package com.movieticket.moviebooking.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movieticket.moviebooking.dto.ExternalMovieDetail;
import com.movieticket.moviebooking.dto.ExternalMovieSummary;

@Service
public class OmdbService {

    @Value("${omdb.api.key}")
    private String apiKey;

    private final HttpClient httpClient =
            HttpClient.newHttpClient();

    private final ObjectMapper objectMapper =
            new ObjectMapper();


    // Search movies by title
    public List<ExternalMovieSummary> searchMovies(String title) {

        String url =
                "http://www.omdbapi.com/?apikey=" + apiKey +
                "&type=movie&s=" +
                URLEncoder.encode(title, StandardCharsets.UTF_8);

        JsonNode root = callOmdb(url);

        List<ExternalMovieSummary> results = new ArrayList<>();

        if (!"True".equalsIgnoreCase(
                root.path("Response").asText())) {

            // OMDb returns Response: False when there are no
            // matches - that is not an error, just an empty list.
            return results;
        }

        for (JsonNode item : root.path("Search")) {

            results.add(new ExternalMovieSummary(
                    item.path("imdbID").asText(),
                    item.path("Title").asText(),
                    item.path("Year").asText(),
                    cleanValue(item.path("Poster").asText()),
                    item.path("Type").asText()
            ));
        }

        return results;
    }


    // Get full details for a single movie by IMDb ID
    public ExternalMovieDetail getMovieDetails(String imdbId) {

        String url =
                "http://www.omdbapi.com/?apikey=" + apiKey +
                "&plot=full&i=" +
                URLEncoder.encode(imdbId, StandardCharsets.UTF_8);

        JsonNode root = callOmdb(url);

        if (!"True".equalsIgnoreCase(
                root.path("Response").asText())) {

            throw new RuntimeException(
                    "Movie not found on OMDb: " +
                    root.path("Error").asText());
        }

        ExternalMovieDetail detail = new ExternalMovieDetail();

        detail.setImdbId(root.path("imdbID").asText());
        detail.setTitle(root.path("Title").asText());
        detail.setYear(root.path("Year").asText());
        detail.setRated(cleanValue(root.path("Rated").asText()));
        detail.setReleased(cleanValue(root.path("Released").asText()));
        detail.setRuntime(cleanValue(root.path("Runtime").asText()));
        detail.setGenre(cleanValue(root.path("Genre").asText()));
        detail.setLanguage(cleanValue(root.path("Language").asText()));
        detail.setPlot(cleanValue(root.path("Plot").asText()));
        detail.setPoster(cleanValue(root.path("Poster").asText()));
        detail.setImdbRating(
                cleanValue(root.path("imdbRating").asText()));

        return detail;
    }


    private JsonNode callOmdb(String url) {

        try {

            HttpRequest request = HttpRequest
                    .newBuilder(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 401) {

                throw new RuntimeException(
                        "OMDb API key is invalid or not yet " +
                        "activated. Please check your email " +
                        "and click the activation link OMDb " +
                        "sent you.");
            }

            if (response.statusCode() != 200) {

                throw new RuntimeException(
                        "OMDb API is currently unavailable. " +
                        "Please try again later.");
            }

            return objectMapper.readTree(response.body());

        } catch (IOException | InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Unable to reach OMDb API. " +
                    "Please try again later.");
        }
    }


    // OMDb uses the literal string "N/A" for missing fields
    private String cleanValue(String value) {

        if (value == null || "N/A".equals(value)) {

            return "";
        }

        return value;
    }
}

package com.movieticket.moviebooking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.dto.ExternalMovieDetail;
import com.movieticket.moviebooking.entity.Movie;
import com.movieticket.moviebooking.repository.MovieRepository;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id).orElse(null);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    /*
     * Import an OMDb movie into the local database so it can be
     * used by the existing booking flow (which expects an
     * internal Movie ID). If this imdbId was already imported
     * before, reuse that row instead of creating a duplicate.
     */
    public Movie importFromExternal(ExternalMovieDetail detail) {

        Movie existing = movieRepository
                .findByImdbId(detail.getImdbId())
                .orElse(null);

        if (existing != null) {

            return existing;
        }

        Movie movie = new Movie();

        movie.setImdbId(detail.getImdbId());
        movie.setTitle(detail.getTitle());
        movie.setDescription(
                detail.getPlot() != null && !detail.getPlot().isEmpty()
                        ? detail.getPlot()
                        : "No description available.");
        movie.setLanguage(
                detail.getLanguage() != null &&
                !detail.getLanguage().isEmpty()
                        ? detail.getLanguage()
                        : "English");
        movie.setGenre(
                detail.getGenre() != null && !detail.getGenre().isEmpty()
                        ? detail.getGenre()
                        : "Unknown");
        movie.setDuration(parseRuntimeMinutes(detail.getRuntime()));
        movie.setReleaseDate(detail.getReleased());
        movie.setPosterUrl(detail.getPoster());

        return movieRepository.save(movie);
    }

    // OMDb runtime looks like "142 min" - pull out the number
    private Integer parseRuntimeMinutes(String runtime) {

        if (runtime == null || runtime.isEmpty()) {

            return 120;
        }

        String digitsOnly = runtime.replaceAll("[^0-9]", "");

        if (digitsOnly.isEmpty()) {

            return 120;
        }

        try {

            return Integer.parseInt(digitsOnly);

        } catch (NumberFormatException e) {

            return 120;
        }
    }
}
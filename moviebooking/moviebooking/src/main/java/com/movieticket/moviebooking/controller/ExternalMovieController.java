package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.dto.ExternalMovieDetail;
import com.movieticket.moviebooking.dto.ExternalMovieSummary;
import com.movieticket.moviebooking.entity.Movie;
import com.movieticket.moviebooking.service.MovieService;
import com.movieticket.moviebooking.service.OmdbService;

@RestController
@RequestMapping("/external-movies")
public class ExternalMovieController {

    private final OmdbService omdbService;
    private final MovieService movieService;

    public ExternalMovieController(
            OmdbService omdbService,
            MovieService movieService) {

        this.omdbService = omdbService;
        this.movieService = movieService;
    }

    // Search OMDb by title
    @GetMapping("/search")
    public List<ExternalMovieSummary> searchMovies(
            @RequestParam String title) {

        return omdbService.searchMovies(title);
    }

    // Get full OMDb details for one movie
    @GetMapping("/{imdbId}")
    public ExternalMovieDetail getMovieDetails(
            @PathVariable String imdbId) {

        return omdbService.getMovieDetails(imdbId);
    }

    /*
     * Import an OMDb movie into the existing Movie table
     * (or reuse it if already imported) and return the
     * internal Movie record, so the frontend can continue
     * straight into the existing booking flow using its
     * normal internal movie ID.
     */
    @PostMapping("/import/{imdbId}")
    public Movie importMovie(@PathVariable String imdbId) {

        ExternalMovieDetail detail =
                omdbService.getMovieDetails(imdbId);

        return movieService.importFromExternal(detail);
    }
}

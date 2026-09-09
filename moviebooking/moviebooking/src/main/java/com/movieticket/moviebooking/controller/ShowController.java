package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.entity.Show;
import com.movieticket.moviebooking.service.ShowService;

@RestController
@RequestMapping("/shows")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @PostMapping
    public Show saveShow(@RequestBody Show show) {
        return showService.saveShow(show);
    }

    @GetMapping
    public List<Show> getAllShows() {
        return showService.getAllShows();
    }

    @GetMapping("/{id}")
    public Show getShowById(@PathVariable Long id) {
        return showService.getShowById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return "Show deleted successfully";
    }

    // Get shows by movie
    @GetMapping("/movie/{movieId}")
    public List<Show> getShowsByMovie(
            @PathVariable Long movieId) {

        return showService.getShowsByMovie(movieId);
    }

    // Get shows by theatre
    @GetMapping("/theatre/{theatreId}")
    public List<Show> getShowsByTheatre(
            @PathVariable Long theatreId) {

        return showService.getShowsByTheatre(theatreId);
    }

    // Get shows by date
    @GetMapping("/date/{showDate}")
    public List<Show> getShowsByDate(
            @PathVariable String showDate) {

        return showService.getShowsByDate(showDate);
    }
}
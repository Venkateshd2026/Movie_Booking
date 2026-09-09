package com.movieticket.moviebooking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.entity.Show;
import com.movieticket.moviebooking.repository.ShowRepository;

@Service
public class ShowService {

    private final ShowRepository showRepository;

    public ShowService(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    public Show saveShow(Show show) {
        return showRepository.save(show);
    }

    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    public Show getShowById(Long id) {
        return showRepository.findById(id).orElse(null);
    }

    public void deleteShow(Long id) {
        showRepository.deleteById(id);
    }

    // Get shows by movie
    public List<Show> getShowsByMovie(Long movieId) {
        return showRepository.findByMovieId(movieId);
    }

    // Get shows by theatre
    public List<Show> getShowsByTheatre(Long theatreId) {
        return showRepository.findByTheatreId(theatreId);
    }

    // Get shows by date
    public List<Show> getShowsByDate(String showDate) {
        return showRepository.findByShowDate(showDate);
    }
}
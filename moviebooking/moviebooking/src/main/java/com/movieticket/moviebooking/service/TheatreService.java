package com.movieticket.moviebooking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.entity.Theatre;
import com.movieticket.moviebooking.repository.TheatreRepository;

@Service
public class TheatreService {

    private final TheatreRepository theatreRepository;

    public TheatreService(TheatreRepository theatreRepository) {
        this.theatreRepository = theatreRepository;
    }

    public Theatre saveTheatre(Theatre theatre) {
        return theatreRepository.save(theatre);
    }

    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll();
    }

    public Theatre getTheatreById(Long id) {
        return theatreRepository.findById(id).orElse(null);
    }

    public void deleteTheatre(Long id) {
        theatreRepository.deleteById(id);
    }
}
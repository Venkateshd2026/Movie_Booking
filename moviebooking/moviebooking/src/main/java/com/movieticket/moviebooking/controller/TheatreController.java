package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.entity.Theatre;
import com.movieticket.moviebooking.service.TheatreService;

@RestController
@RequestMapping("/theatres")
public class TheatreController {

    private final TheatreService theatreService;

    public TheatreController(TheatreService theatreService) {
        this.theatreService = theatreService;
    }

    @PostMapping
    public Theatre saveTheatre(@RequestBody Theatre theatre) {
        return theatreService.saveTheatre(theatre);
    }

    @GetMapping
    public List<Theatre> getAllTheatres() {
        return theatreService.getAllTheatres();
    }

    @GetMapping("/{id}")
    public Theatre getTheatreById(@PathVariable Long id) {
        return theatreService.getTheatreById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteTheatre(@PathVariable Long id) {
        theatreService.deleteTheatre(id);
        return "Theatre deleted successfully";
    }
}
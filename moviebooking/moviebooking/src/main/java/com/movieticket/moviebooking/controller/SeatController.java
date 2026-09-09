package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.dto.SeatResponse;
import com.movieticket.moviebooking.entity.Seat;
import com.movieticket.moviebooking.service.SeatService;

@RestController
@RequestMapping("/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @PostMapping
    public Seat saveSeat(@RequestBody Seat seat) {
        return seatService.saveSeat(seat);
    }

    @GetMapping
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }

    @GetMapping("/{id}")
    public Seat getSeatById(@PathVariable Long id) {
        return seatService.getSeatById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return "Seat deleted successfully";
    }

    // Get seats and their availability for a show
    @GetMapping("/show/{showId}")
    public List<SeatResponse> getSeatsByShow(
            @PathVariable Long showId) {

        return seatService.getSeatsByShow(showId);
    }

    // Get all seats belonging to a screen (used by admin seat management)
    @GetMapping("/screen/{screenId}")
    public List<Seat> getSeatsByScreen(
            @PathVariable Long screenId) {

        return seatService.getSeatsByScreen(screenId);
    }
}
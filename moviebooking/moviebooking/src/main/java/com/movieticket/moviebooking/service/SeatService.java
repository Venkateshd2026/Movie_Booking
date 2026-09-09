package com.movieticket.moviebooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.dto.SeatResponse;
import com.movieticket.moviebooking.entity.Seat;
import com.movieticket.moviebooking.entity.Show;
import com.movieticket.moviebooking.repository.SeatRepository;
import com.movieticket.moviebooking.repository.ShowRepository;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final BookingSeatService bookingSeatService;
    private final ShowRepository showRepository;

    public SeatService(
            SeatRepository seatRepository,
            BookingSeatService bookingSeatService,
            ShowRepository showRepository) {

        this.seatRepository = seatRepository;
        this.bookingSeatService = bookingSeatService;
        this.showRepository = showRepository;
    }

    public Seat saveSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public Seat getSeatById(Long id) {
        return seatRepository.findById(id).orElse(null);
    }

    public void deleteSeat(Long id) {
        seatRepository.deleteById(id);
    }

    // Get all seats for a screen (no availability computed - used by admin)
    public List<Seat> getSeatsByScreen(Long screenId) {
        return seatRepository.findByScreenId(screenId);
    }

    public List<SeatResponse> getSeatsByShow(Long showId) {

        Show show = showRepository
                .findById(showId)
                .orElseThrow(() ->
                        new RuntimeException("Show not found"));

        Long screenId = show.getScreen().getId();

        List<Seat> seats =
                seatRepository.findByScreenId(screenId);

        List<SeatResponse> response = new ArrayList<>();

        for (Seat seat : seats) {

            boolean alreadyBooked =
                    bookingSeatService.isSeatAlreadyBooked(
                            showId,
                            seat.getId());

            boolean available = !alreadyBooked;

            SeatResponse seatResponse = new SeatResponse(
                    seat.getId(),
                    seat.getSeatNumber(),
                    seat.getSeatType(),
                    seat.getPrice(),
                    available
            );

            response.add(seatResponse);
        }

        return response;
    }
}
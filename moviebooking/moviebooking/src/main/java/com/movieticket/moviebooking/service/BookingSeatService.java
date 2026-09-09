package com.movieticket.moviebooking.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.movieticket.moviebooking.entity.Booking;
import com.movieticket.moviebooking.entity.BookingSeat;
import com.movieticket.moviebooking.entity.Seat;
import com.movieticket.moviebooking.repository.BookingRepository;
import com.movieticket.moviebooking.repository.BookingSeatRepository;
import com.movieticket.moviebooking.repository.SeatRepository;

@Service
public class BookingSeatService {

    private final BookingSeatRepository bookingSeatRepository;

    private final BookingRepository bookingRepository;

    private final SeatRepository seatRepository;


    public BookingSeatService(
            BookingSeatRepository bookingSeatRepository,
            BookingRepository bookingRepository,
            SeatRepository seatRepository) {

        this.bookingSeatRepository = bookingSeatRepository;
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
    }


    public BookingSeat saveBookingSeat(Long bookingId, Long seatId) {

        // Find booking
        Booking booking = bookingRepository
                .findById(bookingId)
                .orElse(null);


        // Find seat
        Seat seat = seatRepository
                .findById(seatId)
                .orElse(null);


        // Check booking
        if (booking == null) {

            throw new RuntimeException(
                    "Booking not found"
            );
        }


        // Check seat
        if (seat == null) {

            throw new RuntimeException(
                    "Seat not found"
            );
        }


        // Get show ID
        Long showId = booking
                .getShow()
                .getId();


        // Check whether seat is already booked
        boolean alreadyBooked =
                bookingSeatRepository
                        .existsByBookingShowIdAndSeatIdAndBookingStatus(
                                showId,
                                seatId,
                                "CONFIRMED"
                        );


        // If already booked
        if (alreadyBooked) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Seat " + seat.getSeatNumber()
                    + " is already booked for this show"
            );
        }


        // Create BookingSeat
        BookingSeat bookingSeat =
                new BookingSeat();


        bookingSeat.setBooking(booking);

        bookingSeat.setSeat(seat);


        // Save
        return bookingSeatRepository
                .save(bookingSeat);
    }


    public List<BookingSeat> getAllBookingSeats() {

        return bookingSeatRepository.findAll();
    }


    public BookingSeat getBookingSeatById(Long id) {

        return bookingSeatRepository
                .findById(id)
                .orElse(null);
    }


    public void deleteBookingSeat(Long id) {

        bookingSeatRepository.deleteById(id);
    }


    public boolean isSeatAlreadyBooked(
            Long showId,
            Long seatId) {

        return bookingSeatRepository
                .existsByBookingShowIdAndSeatIdAndBookingStatus(
                        showId,
                        seatId,
                        "CONFIRMED"
                );
    }
}
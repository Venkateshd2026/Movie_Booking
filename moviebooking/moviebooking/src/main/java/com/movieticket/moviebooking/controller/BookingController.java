package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.dto.BookingRequest;
import com.movieticket.moviebooking.dto.BookingResponse;
import com.movieticket.moviebooking.service.BookingService;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public BookingResponse createBooking(
            @RequestBody BookingRequest request) {

        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<BookingResponse> getAllBookings() {

        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public BookingResponse getBookingById(
            @PathVariable Long id) {

        return bookingService.getBookingById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);

        return "Booking deleted successfully";
    }
    @GetMapping("/user/{userId}")
    public List<BookingResponse> getBookingsByUser(
            @PathVariable Long userId) {

        return bookingService.getBookingsByUser(userId);
    }
}
package com.movieticket.moviebooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movieticket.moviebooking.entity.BookingSeat;

public interface BookingSeatRepository
        extends JpaRepository<BookingSeat, Long> {

    boolean existsByBookingShowIdAndSeatIdAndBookingStatus(
            Long showId,
            Long seatId,
            String status
    );

    List<BookingSeat> findByBookingId(Long bookingId);
}
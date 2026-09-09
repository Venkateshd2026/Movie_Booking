package com.movieticket.moviebooking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movieticket.moviebooking.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    boolean existsByBookingId(Long bookingId);

    Optional<Ticket> findByBookingId(Long bookingId);

    List<Ticket> findByBookingUserId(Long userId);
}
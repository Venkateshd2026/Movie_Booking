package com.movieticket.moviebooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movieticket.moviebooking.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    boolean existsByBookingId(Long bookingId);

}
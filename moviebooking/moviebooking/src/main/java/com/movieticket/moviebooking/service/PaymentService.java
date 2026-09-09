package com.movieticket.moviebooking.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.moviebooking.dto.PaymentRequest;
import com.movieticket.moviebooking.dto.PaymentResponse;
import com.movieticket.moviebooking.entity.Booking;
import com.movieticket.moviebooking.entity.Payment;
import com.movieticket.moviebooking.repository.BookingRepository;
import com.movieticket.moviebooking.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    private final BookingRepository bookingRepository;


    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository) {

        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }


    // Create Payment
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {

        // Find booking
        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));


        // Check whether payment already exists
        boolean alreadyPaid =
                paymentRepository.existsByBookingId(
                        request.getBookingId());


        if (alreadyPaid) {

            throw new RuntimeException(
                    "Payment already exists for this booking");

        }


        // Check booking status
        if ("CONFIRMED".equals(booking.getStatus())) {

            throw new RuntimeException(
                    "Booking is already confirmed");

        }


        // Create Payment object
        Payment payment = new Payment();

        payment.setBooking(booking);

        payment.setAmount(
                booking.getTotalAmount());

        payment.setPaymentMethod(
                request.getPaymentMethod());

        payment.setPaymentStatus("SUCCESS");

        payment.setPaymentTime(
                LocalDateTime.now());


        // Save payment
        Payment savedPayment =
                paymentRepository.save(payment);


        // IMPORTANT:
        // Payment successful → confirm booking
        booking.setStatus("CONFIRMED");

        bookingRepository.save(booking);


        // Return payment response
        return convertToResponse(savedPayment);
    }


    // Get all payments
    public List<PaymentResponse> getAllPayments() {

        List<Payment> payments =
                paymentRepository.findAll();

        List<PaymentResponse> response =
                new ArrayList<>();


        for (Payment payment : payments) {

            response.add(
                    convertToResponse(payment)
            );
        }


        return response;
    }


    // Get payment by ID
    public PaymentResponse getPaymentById(Long id) {

        Payment payment =
                paymentRepository
                        .findById(id)
                        .orElse(null);


        if (payment == null) {

            return null;
        }


        return convertToResponse(payment);
    }


    // Delete payment
    public void deletePayment(Long id) {

        paymentRepository.deleteById(id);
    }


    // Convert Payment entity to PaymentResponse
    private PaymentResponse convertToResponse(
            Payment payment) {

        return new PaymentResponse(

                payment.getId(),

                payment.getBooking().getId(),

                payment.getBooking()
                        .getShow()
                        .getMovie()
                        .getTitle(),

                payment.getAmount(),

                payment.getPaymentMethod(),

                payment.getPaymentStatus(),

                payment.getPaymentTime()
        );
    }
}
package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.dto.PaymentRequest;
import com.movieticket.moviebooking.dto.PaymentResponse;
import com.movieticket.moviebooking.service.PaymentService;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public PaymentResponse createPayment(
            @RequestBody PaymentRequest request) {

        return paymentService.createPayment(request);
    }

    @GetMapping
    public List<PaymentResponse> getAllPayments() {

        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public PaymentResponse getPaymentById(
            @PathVariable Long id) {

        return paymentService.getPaymentById(id);
    }

    @DeleteMapping("/{id}")
    public String deletePayment(
            @PathVariable Long id) {

        paymentService.deletePayment(id);

        return "Payment deleted successfully";
    }
}
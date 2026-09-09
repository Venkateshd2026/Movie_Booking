package com.movieticket.moviebooking.dto;

import java.time.LocalDateTime;

public class PaymentResponse {

    private Long paymentId;
    private Long bookingId;
    private String movieName;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paymentTime;

    public PaymentResponse() {
    }

    public PaymentResponse(Long paymentId, Long bookingId,
            String movieName, Double amount,
            String paymentMethod, String paymentStatus,
            LocalDateTime paymentTime) {

        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.movieName = movieName;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.paymentTime = paymentTime;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(LocalDateTime paymentTime) {
        this.paymentTime = paymentTime;
    }
}
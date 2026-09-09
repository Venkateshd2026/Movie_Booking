package com.movieticket.moviebooking.dto;

public class TicketRequest {

    private Long bookingId;

    public TicketRequest() {
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
}
package com.movieticket.moviebooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_seats")
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnoreProperties({"user", "show"})
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "seat_id", nullable = false)
    @JsonIgnoreProperties({"screen"})
    private Seat seat;

    public BookingSeat() {
    }

    public BookingSeat(Booking booking, Seat seat) {
        this.booking = booking;
        this.seat = seat;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }
}
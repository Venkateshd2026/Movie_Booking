package com.movieticket.moviebooking.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Column(nullable = false)
    private Integer numberOfSeats;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime bookingTime;

    public Booking() {

    }

    public Booking(User user, Show show, Integer numberOfSeats,
                   Double totalAmount, String status,
                   LocalDateTime bookingTime) {

        this.user = user;
        this.show = show;
        this.numberOfSeats = numberOfSeats;
        this.totalAmount = totalAmount;
        this.status = status;
        this.bookingTime = bookingTime;
    }

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public User getUser() {

        return user;
    }

    public void setUser(User user) {

        this.user = user;
    }

    public Show getShow() {

        return show;
    }

    public void setShow(Show show) {

        this.show = show;
    }

    public Integer getNumberOfSeats() {

        return numberOfSeats;
    }

    public void setNumberOfSeats(Integer numberOfSeats) {

        this.numberOfSeats = numberOfSeats;
    }

    public Double getTotalAmount() {

        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {

        this.totalAmount = totalAmount;
    }

    public String getStatus() {

        return status;
    }

    public void setStatus(String status) {

        this.status = status;
    }

    public LocalDateTime getBookingTime() {

        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {

        this.bookingTime = bookingTime;
    }
}
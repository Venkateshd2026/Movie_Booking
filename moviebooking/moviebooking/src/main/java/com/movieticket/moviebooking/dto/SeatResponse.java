package com.movieticket.moviebooking.dto;

public class SeatResponse {

    private Long id;
    private String seatNumber;
    private String seatType;
    private double price;
    private boolean available;

    public SeatResponse() {
    }

    public SeatResponse(Long id, String seatNumber,
                        String seatType, double price,
                        boolean available) {

        this.id = id;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.price = price;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getSeatType() {
        return seatType;
    }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
package com.movieticket.moviebooking.dto;

import java.util.List;

public class BookingResponse {

    private Long bookingId;
    private String userName;
    private String movieName;
    private String theatreName;
    private String screenName;
    private String showDate;
    private String showTime;
    private Integer numberOfSeats;
    private Double totalAmount;
    private String status;
    private List<String> seatNumbers;

    public BookingResponse() {
    }

    public BookingResponse(
            Long bookingId,
            String userName,
            String movieName,
            String theatreName,
            String screenName,
            String showDate,
            String showTime,
            Integer numberOfSeats,
            Double totalAmount,
            String status,
            List<String> seatNumbers) {

        this.bookingId = bookingId;
        this.userName = userName;
        this.movieName = movieName;
        this.theatreName = theatreName;
        this.screenName = screenName;
        this.showDate = showDate;
        this.showTime = showTime;
        this.numberOfSeats = numberOfSeats;
        this.totalAmount = totalAmount;
        this.status = status;
        this.seatNumbers = seatNumbers;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public String getTheatreName() {
        return theatreName;
    }

    public void setTheatreName(String theatreName) {
        this.theatreName = theatreName;
    }

    public String getScreenName() {
        return screenName;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }

    public String getShowDate() {
        return showDate;
    }

    public void setShowDate(String showDate) {
        this.showDate = showDate;
    }

    public String getShowTime() {
        return showTime;
    }

    public void setShowTime(String showTime) {
        this.showTime = showTime;
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

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
}
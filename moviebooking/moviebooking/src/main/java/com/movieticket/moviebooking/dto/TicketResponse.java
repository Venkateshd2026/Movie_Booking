package com.movieticket.moviebooking.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {

    private Long ticketId;
    private String ticketNumber;
    private Long bookingId;

    private String userName;
    private String movieName;
    private String theatreName;
    private String screenName;

    private String showDate;
    private String showTime;

    private Integer numberOfSeats;
    private List<String> seatNumbers;

    private Double totalAmount;

    private LocalDateTime issuedAt;

    private String ticketStatus;


    public TicketResponse() {
    }


    public TicketResponse(
            Long ticketId,
            String ticketNumber,
            Long bookingId,
            String userName,
            String movieName,
            String theatreName,
            String screenName,
            String showDate,
            String showTime,
            Integer numberOfSeats,
            List<String> seatNumbers,
            Double totalAmount,
            LocalDateTime issuedAt,
            String ticketStatus) {

        this.ticketId = ticketId;
        this.ticketNumber = ticketNumber;
        this.bookingId = bookingId;
        this.userName = userName;
        this.movieName = movieName;
        this.theatreName = theatreName;
        this.screenName = screenName;
        this.showDate = showDate;
        this.showTime = showTime;
        this.numberOfSeats = numberOfSeats;
        this.seatNumbers = seatNumbers;
        this.totalAmount = totalAmount;
        this.issuedAt = issuedAt;
        this.ticketStatus = ticketStatus;
    }


    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }


    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
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


    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }


    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }


    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }


    public String getTicketStatus() {
        return ticketStatus;
    }

    public void setTicketStatus(String ticketStatus) {
        this.ticketStatus = ticketStatus;
    }
}
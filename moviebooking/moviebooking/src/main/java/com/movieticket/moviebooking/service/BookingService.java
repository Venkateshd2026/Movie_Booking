package com.movieticket.moviebooking.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.movieticket.moviebooking.dto.BookingRequest;
import com.movieticket.moviebooking.dto.BookingResponse;
import com.movieticket.moviebooking.entity.Booking;
import com.movieticket.moviebooking.entity.BookingSeat;
import com.movieticket.moviebooking.entity.Seat;
import com.movieticket.moviebooking.entity.Show;
import com.movieticket.moviebooking.entity.User;
import com.movieticket.moviebooking.repository.BookingRepository;
import com.movieticket.moviebooking.repository.BookingSeatRepository;
import com.movieticket.moviebooking.repository.SeatRepository;
import com.movieticket.moviebooking.repository.ShowRepository;
import com.movieticket.moviebooking.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;


    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ShowRepository showRepository,
            SeatRepository seatRepository,
            BookingSeatRepository bookingSeatRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.showRepository = showRepository;
        this.seatRepository = seatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }


    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        Show show = showRepository
                .findById(request.getShowId())
                .orElseThrow(() ->
                        new RuntimeException("Show not found"));


        List<Long> seatIds = request.getSeatIds();


        if (seatIds == null || seatIds.isEmpty()) {

            throw new RuntimeException(
                    "Please select at least one seat");
        }


        // Check duplicate seats
        if (seatIds.size() !=
                seatIds.stream().distinct().count()) {

            throw new RuntimeException(
                    "Duplicate seats are not allowed");
        }


        Booking booking = new Booking();

        booking.setUser(user);

        booking.setShow(show);

        booking.setNumberOfSeats(seatIds.size());


        double totalAmount = 0;


        // Validate seats and calculate amount
        for (Long seatId : seatIds) {

            Seat seat = seatRepository
                    .findById(seatId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Seat not found: " + seatId));


            // Check seat belongs to show's screen
            if (!seat.getScreen()
                    .getId()
                    .equals(show.getScreen().getId())) {

                throw new RuntimeException(
                        "Seat " +
                        seat.getSeatNumber() +
                        " does not belong to this show's screen");
            }


            // Check whether seat is already confirmed
            boolean alreadyBooked =
                    bookingSeatRepository
                            .existsByBookingShowIdAndSeatIdAndBookingStatus(
                                    show.getId(),
                                    seatId,
                                    "CONFIRMED"
                            );


            if (alreadyBooked) {

                throw new RuntimeException(
                        "Seat " +
                        seat.getSeatNumber() +
                        " is already booked");
            }


            totalAmount += seat.getPrice();
        }


        booking.setTotalAmount(totalAmount);

        booking.setStatus("PENDING");

        booking.setBookingTime(
                LocalDateTime.now());


        // Save booking
        Booking savedBooking =
                bookingRepository.save(booking);


        // Save selected seats
        for (Long seatId : seatIds) {

            Seat seat = seatRepository
                    .findById(seatId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Seat not found"));


            BookingSeat bookingSeat =
                    new BookingSeat(
                            savedBooking,
                            seat);


            bookingSeatRepository.save(
                    bookingSeat);
        }


        return convertToResponse(savedBooking);
    }


    // GET ALL BOOKINGS
    public List<BookingResponse> getAllBookings() {

        List<Booking> bookings =
                bookingRepository.findAll();

        List<BookingResponse> response =
                new ArrayList<>();


        for (Booking booking : bookings) {

            response.add(
                    convertToResponse(booking));
        }


        return response;
    }


    // GET BOOKING BY ID
    public BookingResponse getBookingById(Long id) {

        Booking booking =
                bookingRepository
                        .findById(id)
                        .orElse(null);


        if (booking == null) {

            return null;
        }


        return convertToResponse(booking);
    }


    // DELETE BOOKING
    public void deleteBooking(Long id) {

        bookingRepository.deleteById(id);
    }


    // GET BOOKINGS BY USER
    public List<BookingResponse> getBookingsByUser(
            Long userId) {

        List<Booking> bookings =
                bookingRepository
                        .findByUserId(userId);

        List<BookingResponse> response =
                new ArrayList<>();


        for (Booking booking : bookings) {

            response.add(
                    convertToResponse(booking));
        }


        return response;
    }


    // CONVERT BOOKING TO RESPONSE
    private BookingResponse convertToResponse(
            Booking booking) {


        /*
         * Get only the seats
         * belonging to this booking.
         */
        List<BookingSeat> bookingSeats =
                bookingSeatRepository
                        .findByBookingId(
                                booking.getId());


        List<String> seatNumbers =
                new ArrayList<>();


        for (BookingSeat bookingSeat :
                bookingSeats) {

            seatNumbers.add(
                    bookingSeat
                            .getSeat()
                            .getSeatNumber());
        }


        return new BookingResponse(

                booking.getId(),

                booking.getUser()
                        .getName(),

                booking.getShow()
                        .getMovie()
                        .getTitle(),

                booking.getShow()
                        .getTheatre()
                        .getName(),

                booking.getShow()
                        .getScreen()
                        .getName(),

                booking.getShow()
                        .getShowDate(),

                booking.getShow()
                        .getShowTime(),

                booking.getNumberOfSeats(),

                booking.getTotalAmount(),

                booking.getStatus(),

                seatNumbers
        );
    }
}
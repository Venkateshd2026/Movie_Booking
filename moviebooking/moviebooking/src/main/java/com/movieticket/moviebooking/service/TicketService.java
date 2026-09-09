package com.movieticket.moviebooking.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.dto.TicketRequest;
import com.movieticket.moviebooking.dto.TicketResponse;
import com.movieticket.moviebooking.entity.Booking;
import com.movieticket.moviebooking.entity.BookingSeat;
import com.movieticket.moviebooking.entity.Ticket;
import com.movieticket.moviebooking.repository.BookingRepository;
import com.movieticket.moviebooking.repository.BookingSeatRepository;
import com.movieticket.moviebooking.repository.TicketRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    private final BookingRepository bookingRepository;

    private final BookingSeatRepository bookingSeatRepository;

    private final EmailService emailService;


    public TicketService(
            TicketRepository ticketRepository,
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            EmailService emailService) {

        this.ticketRepository = ticketRepository;

        this.bookingRepository = bookingRepository;

        this.bookingSeatRepository = bookingSeatRepository;

        this.emailService = emailService;
    }


    // CREATE TICKET
    public TicketResponse createTicket(TicketRequest request) {

        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));


        // Check whether ticket already exists
        boolean alreadyExists =
                ticketRepository.existsByBookingId(
                        request.getBookingId());


        if (alreadyExists) {

            throw new RuntimeException(
                    "Ticket already exists for this booking");

        }


        // Generate unique ticket number
        String ticketNumber =
                "TKT-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();


        // Create ticket
        Ticket ticket = new Ticket();

        ticket.setBooking(booking);

        ticket.setTicketNumber(ticketNumber);

        ticket.setIssuedAt(LocalDateTime.now());

        ticket.setTicketStatus("CONFIRMED");


        // Save ticket
        Ticket savedTicket =
                ticketRepository.save(ticket);


        // Send confirmation email - only after the ticket has
        // been successfully created for this booking. Email
        // failures are handled entirely inside EmailService and
        // never affect this already-successful booking/ticket.
        List<BookingSeat> bookingSeatsForEmail =
                bookingSeatRepository.findByBookingId(booking.getId());

        List<String> seatNumbersForEmail = new ArrayList<>();

        for (BookingSeat bookingSeat : bookingSeatsForEmail) {

            seatNumbersForEmail.add(
                    bookingSeat.getSeat().getSeatNumber());
        }

        emailService.sendBookingConfirmation(
                booking, savedTicket, seatNumbersForEmail);


        return convertToResponse(savedTicket);
    }


    // GET ALL TICKETS
    public List<TicketResponse> getAllTickets() {

        List<Ticket> tickets =
                ticketRepository.findAll();

        List<TicketResponse> response =
                new ArrayList<>();


        for (Ticket ticket : tickets) {

            response.add(
                    convertToResponse(ticket)
            );
        }


        return response;
    }


    // GET TICKET BY ID
    public TicketResponse getTicketById(Long id) {

        Ticket ticket =
                ticketRepository
                        .findById(id)
                        .orElse(null);


        if (ticket == null) {

            return null;
        }


        return convertToResponse(ticket);
    }


    // DELETE TICKET
    public void deleteTicket(Long id) {

        ticketRepository.deleteById(id);
    }


    // GET TICKETS BY USER
    public List<TicketResponse> getTicketsByUser(Long userId) {

        List<Ticket> tickets =
                ticketRepository
                        .findByBookingUserId(userId);

        List<TicketResponse> response =
                new ArrayList<>();


        for (Ticket ticket : tickets) {

            response.add(
                    convertToResponse(ticket)
            );
        }


        return response;
    }


    // GET TICKET BY BOOKING ID
    public TicketResponse getTicketByBookingId(
            Long bookingId) {

        Ticket ticket =
                ticketRepository
                        .findByBookingId(bookingId)
                        .orElse(null);


        if (ticket != null) {

            return convertToResponse(ticket);
        }


        /*
         * ROOT-CAUSE FIX for "Ticket not found":
         *
         * Payment confirmation and ticket creation are two
         * separate API calls. If ticket creation ever failed
         * after the booking was already marked CONFIRMED
         * (network issue, double-click, timing), the booking
         * would be stuck CONFIRMED with no ticket forever.
         *
         * Since a CONFIRMED booking has everything a ticket
         * needs, self-heal by generating the missing ticket
         * here instead of permanently failing.
         */
        Booking booking =
                bookingRepository
                        .findById(bookingId)
                        .orElse(null);

        if (booking == null) {

            return null;
        }

        if (!"CONFIRMED".equals(booking.getStatus())) {

            // Booking exists but was never paid for -
            // there is genuinely no ticket yet.
            return null;
        }

        TicketRequest request = new TicketRequest();
        request.setBookingId(bookingId);

        return createTicket(request);
    }


    // CONVERT ENTITY TO RESPONSE
    private TicketResponse convertToResponse(
            Ticket ticket) {

        Booking booking =
                ticket.getBooking();


        /*
         * Get all seats belonging
         * to this booking
         */
        List<BookingSeat> bookingSeats =
                bookingSeatRepository
                        .findByBookingId(
                                booking.getId()
                        );


        /*
         * Store actual seat numbers
         * Example: A1, A2, B3
         */
        List<String> seatNumbers =
                new ArrayList<>();


        for (BookingSeat bookingSeat :
                bookingSeats) {

            seatNumbers.add(
                    bookingSeat
                            .getSeat()
                            .getSeatNumber()
            );
        }


        /*
         * Create TicketResponse
         */
        return new TicketResponse(

                ticket.getId(),

                ticket.getTicketNumber(),

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

                seatNumbers,

                booking.getTotalAmount(),

                ticket.getIssuedAt(),

                ticket.getTicketStatus()
        );
    }
}
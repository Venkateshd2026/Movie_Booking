package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.movieticket.moviebooking.dto.TicketRequest;
import com.movieticket.moviebooking.dto.TicketResponse;
import com.movieticket.moviebooking.service.TicketService;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public TicketResponse createTicket(
            @RequestBody TicketRequest request) {

        return ticketService.createTicket(request);
    }

    @GetMapping
    public List<TicketResponse> getAllTickets() {

        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public TicketResponse getTicketById(
            @PathVariable Long id) {

        return ticketService.getTicketById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteTicket(
            @PathVariable Long id) {

        ticketService.deleteTicket(id);

        return "Ticket deleted successfully";
    }
    @GetMapping("/user/{userId}")
    public List<TicketResponse> getTicketsByUser(
            @PathVariable Long userId) {

        return ticketService.getTicketsByUser(userId);
    }
    @GetMapping("/booking/{bookingId}")
    public TicketResponse getTicketByBookingId(
            @PathVariable Long bookingId) {

        TicketResponse response =
                ticketService.getTicketByBookingId(bookingId);

        if (response == null) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "We couldn't find this ticket. " +
                    "Please check your booking or try again.");
        }

        return response;
    }
}
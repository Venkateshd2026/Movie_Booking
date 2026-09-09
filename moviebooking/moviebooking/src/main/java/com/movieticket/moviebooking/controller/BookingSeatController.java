//package com.movieticket.moviebooking.controller;
//
//import java.util.List;
//
//import org.springframework.web.bind.annotation.*;
//
//import com.movieticket.moviebooking.entity.BookingSeat;
//import com.movieticket.moviebooking.service.BookingSeatService;
//
//@RestController
//@RequestMapping("/booking-seats")
//public class BookingSeatController {
//
//    private final BookingSeatService bookingSeatService;
//
//    public BookingSeatController(BookingSeatService bookingSeatService) {
//        this.bookingSeatService = bookingSeatService;
//    }
//
//    @PostMapping
//    public BookingSeat saveBookingSeat(@RequestBody BookingSeat bookingSeat) {
//        return bookingSeatService.saveBookingSeat(bookingSeat);
//    }
//
//    @GetMapping
//    public List<BookingSeat> getAllBookingSeats() {
//        return bookingSeatService.getAllBookingSeats();
//    }
//
//    @GetMapping("/{id}")
//    public BookingSeat getBookingSeatById(@PathVariable Long id) {
//        return bookingSeatService.getBookingSeatById(id);
//    }
//
//    @DeleteMapping("/{id}")
//    public String deleteBookingSeat(@PathVariable Long id) {
//        bookingSeatService.deleteBookingSeat(id);
//        return "Booking seat deleted successfully";
//    }
//} 
package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.dto.BookingSeatRequest;
import com.movieticket.moviebooking.entity.BookingSeat;
import com.movieticket.moviebooking.service.BookingSeatService;

@RestController
@RequestMapping("/booking-seats")
public class BookingSeatController {

    private final BookingSeatService bookingSeatService;

    public BookingSeatController(BookingSeatService bookingSeatService) {
        this.bookingSeatService = bookingSeatService;
    }

    @PostMapping
    public BookingSeat saveBookingSeat(@RequestBody BookingSeatRequest request) {

        return bookingSeatService.saveBookingSeat(
                request.getBookingId(),
                request.getSeatId()
        );
    }

    @GetMapping
    public List<BookingSeat> getAllBookingSeats() {
        return bookingSeatService.getAllBookingSeats();
    }

    @GetMapping("/{id}")
    public BookingSeat getBookingSeatById(@PathVariable Long id) {
        return bookingSeatService.getBookingSeatById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteBookingSeat(@PathVariable Long id) {
        bookingSeatService.deleteBookingSeat(id);
        return "Booking seat deleted successfully";
    }
}
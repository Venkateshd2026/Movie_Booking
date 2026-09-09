package com.movieticket.moviebooking.controller;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.entity.Movie;
import com.movieticket.moviebooking.entity.Screen;
import com.movieticket.moviebooking.entity.Seat;
import com.movieticket.moviebooking.entity.Show;
import com.movieticket.moviebooking.entity.Theatre;
import com.movieticket.moviebooking.entity.User;

import com.movieticket.moviebooking.repository.UserRepository;

import com.movieticket.moviebooking.service.MovieService;
import com.movieticket.moviebooking.service.ScreenService;
import com.movieticket.moviebooking.service.SeatService;
import com.movieticket.moviebooking.service.ShowService;
import com.movieticket.moviebooking.service.TheatreService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;

    private final MovieService movieService;

    private final TheatreService theatreService;

    private final ScreenService screenService;

    private final SeatService seatService;

    private final ShowService showService;

    public AdminController(
            UserRepository userRepository,
            MovieService movieService,
            TheatreService theatreService,
            ScreenService screenService,
            SeatService seatService,
            ShowService showService) {

        this.userRepository = userRepository;

        this.movieService = movieService;

        this.theatreService = theatreService;

        this.screenService = screenService;

        this.seatService = seatService;

        this.showService = showService;
    }

    @GetMapping("/test")
    public String adminTest(@RequestParam Long userId) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {

            return "User not found";
        }

        if (!user.getRole().equals("ADMIN")) {

            return "Access denied. Admin only.";
        }

        return "Welcome Admin. Admin API is working.";
    }

    @PostMapping("/movies")
    public Object addMovie(
            @RequestParam Long userId,
            @RequestBody Movie movie) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {

            return "User not found";
        }

        if (!user.getRole().equals("ADMIN")) {

            return "Access denied. Admin only.";
        }

        return movieService.saveMovie(movie);
    }

    @PostMapping("/theatres")
    public Object addTheatre(
            @RequestParam Long userId,
            @RequestBody Theatre theatre) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {

            return "User not found";
        }

        if (!user.getRole().equals("ADMIN")) {

            return "Access denied. Admin only.";
        }

        return theatreService.saveTheatre(theatre);
    }

    @PostMapping("/screens")
    public Object addScreen(
            @RequestParam Long userId,
            @RequestBody Screen screen) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {

            return "User not found";
        }

        if (!user.getRole().equals("ADMIN")) {

            return "Access denied. Admin only.";
        }

        return screenService.saveScreen(screen);
    }

    @PostMapping("/seats")
    public Object addSeat(
            @RequestParam Long userId,
            @RequestBody Seat seat) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {

            return "User not found";
        }

        if (!user.getRole().equals("ADMIN")) {

            return "Access denied. Admin only.";
        }

        return seatService.saveSeat(seat);
    }

    @PostMapping("/shows")
    public Object addShow(
            @RequestParam Long userId,
            @RequestBody Show show) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {

            return "User not found";
        }

        if (!user.getRole().equals("ADMIN")) {

            return "Access denied. Admin only.";
        }

        return showService.saveShow(show);
    }
}
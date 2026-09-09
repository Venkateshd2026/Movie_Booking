package com.movieticket.moviebooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.entity.Screen;
import com.movieticket.moviebooking.service.ScreenService;

@RestController
@RequestMapping("/screens")
public class ScreenController {

    private final ScreenService screenService;

    public ScreenController(ScreenService screenService) {
        this.screenService = screenService;
    }

    @PostMapping
    public Screen saveScreen(@RequestBody Screen screen) {
        return screenService.saveScreen(screen);
    }

    @GetMapping
    public List<Screen> getAllScreens() {
        return screenService.getAllScreens();
    }

    @GetMapping("/{id}")
    public Screen getScreenById(@PathVariable Long id) {
        return screenService.getScreenById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteScreen(@PathVariable Long id) {
        screenService.deleteScreen(id);
        return "Screen deleted successfully";
    }
}
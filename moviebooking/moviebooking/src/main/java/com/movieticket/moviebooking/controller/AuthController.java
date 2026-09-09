package com.movieticket.moviebooking.controller;

import org.springframework.web.bind.annotation.*;

import com.movieticket.moviebooking.dto.LoginRequest;
import com.movieticket.moviebooking.dto.LoginResponse;
import com.movieticket.moviebooking.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
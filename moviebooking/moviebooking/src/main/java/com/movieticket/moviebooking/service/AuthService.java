package com.movieticket.moviebooking.service;

import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.dto.LoginRequest;
import com.movieticket.moviebooking.dto.LoginResponse;
import com.movieticket.moviebooking.entity.User;
import com.movieticket.moviebooking.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }
}
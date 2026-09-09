package com.movieticket.moviebooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.movieticket.moviebooking.dto.UserResponse;
import com.movieticket.moviebooking.entity.User;
import com.movieticket.moviebooking.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse saveUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {

            throw new RuntimeException(
                    "Email is already registered");
        }

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }
    public List<UserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();

        List<UserResponse> response = new ArrayList<>();

        for (User user : users) {

            UserResponse userResponse = new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole()
            );

            response.add(userResponse);
        }

        return response;
    }

    public UserResponse getUserById(Long id) {

        User user = userRepository
                .findById(id)
                .orElse(null);

        if (user == null) {
            return null;
        }

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
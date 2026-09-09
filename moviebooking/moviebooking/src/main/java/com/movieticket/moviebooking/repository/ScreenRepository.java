package com.movieticket.moviebooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movieticket.moviebooking.entity.Screen;

public interface ScreenRepository extends JpaRepository<Screen, Long> {

}
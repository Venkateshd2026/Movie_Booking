package com.movieticket.moviebooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movieticket.moviebooking.entity.Theatre;

public interface TheatreRepository extends JpaRepository<Theatre, Long> {

}
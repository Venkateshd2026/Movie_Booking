package com.movieticket.moviebooking.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/**
 * Central place to convert exceptions thrown by services/controllers
 * into consistent JSON error responses instead of the default
 * Spring Boot HTML/verbose error page (or a bare 500).
 *
 * Existing behaviour is preserved:
 *  - ResponseStatusException (e.g. seat-already-booked -> 409)
 *    keeps whatever status it was created with.
 *  - Plain RuntimeException (e.g. "User not found",
 *    "Invalid email or password") now returns 400 with a
 *    { "message": "..." } body instead of a raw 500.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(
            ResponseStatusException ex) {

        HttpStatusCode status = ex.getStatusCode();

        return ResponseEntity
                .status(status)
                .body(buildBody(ex.getReason(), status.value()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> fieldErrors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(fieldError ->
                fieldErrors.put(
                        fieldError.getField(),
                        fieldError.getDefaultMessage()));

        Map<String, Object> body = buildBody(
                "Validation failed", HttpStatus.BAD_REQUEST.value());

        body.put("errors", fieldErrors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(
            RuntimeException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(buildBody(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value()));
    }

    private Map<String, Object> buildBody(String message, int status) {

        Map<String, Object> body = new HashMap<>();

        body.put("timestamp", LocalDateTime.now());
        body.put("status", status);
        body.put("message", message);

        return body;
    }
}

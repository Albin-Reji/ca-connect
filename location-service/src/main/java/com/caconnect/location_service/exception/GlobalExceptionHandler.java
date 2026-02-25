package com.caconnect.location_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidLocationIdException.class)
    public ResponseEntity<String> handleInvalidLocation(InvalidLocationIdException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(WebClientResponseException.class)
    public ResponseEntity<String> handleWebClientError(WebClientResponseException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body("Upstream error: " + ex.getResponseBodyAsString());
    }
}

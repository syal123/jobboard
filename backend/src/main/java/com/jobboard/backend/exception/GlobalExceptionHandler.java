package com.jobboard.backend.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


/*
 Catches the BusinessExceptions thrown anywhere in the application and converts them into proper response
 with real error message, instead of letting them become a generic 500 error with a confusing strack 
 trace in the logs.
*/
@RestControllerAdvice
public class GlobalExceptionHandler {
    // Turns a BusinessException into a clean 400 response, e.g. {"message": "Username already present"}
    // this what the frontend reads to show the user exactly what went wrong.
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, String>> handleBusinessException(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}

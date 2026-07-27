package com.jobboard.backend.exception;

/*
 A special error type used for expected, user-facing problems (like a duplicate username or password) - 
 as opposed to real bugs. Anything thrown as a BusinessException gets caught by GlobalExceptionHandler and
 turned into a clean response instead of a scary generic server error.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}

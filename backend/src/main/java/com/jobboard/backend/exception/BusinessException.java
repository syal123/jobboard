package com.jobboard.backend.exception;

/**
 * Represents an expected, user-facing failure (duplicate username, wrong
 * credentials, resource not found, etc.) as opposed to an unexpected bug.
 * Handled globally to return a clean 4xx response with the message intact,
 * instead of a generic 500 with the real reason hidden from the client.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}

package com.quickhomehelp.exception;

import java.time.LocalDateTime;

import lombok.Data;

@Data


public class ApiError {

    private int status;
    private String message;
    private LocalDateTime timestamp;

    public ApiError(int status, String message, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    // getters
}
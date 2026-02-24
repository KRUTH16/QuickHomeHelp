package com.quickhomehelp.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class LoginResponse {

    private Long userId;
    private String role;
}


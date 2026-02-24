
package com.quickhomehelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.quickhomehelp.dto.*;
import com.quickhomehelp.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(
        @Valid @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

	
    @PostMapping("/login")
    public Object login(
        @Valid @RequestBody LoginRequest request) {

        return authService.login(request);
    }
}

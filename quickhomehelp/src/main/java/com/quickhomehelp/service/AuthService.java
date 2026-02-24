package com.quickhomehelp.service;

import com.quickhomehelp.dto.LoginRequest;
import com.quickhomehelp.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    Object login(LoginRequest request);
}


package com.quickhomehelp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickhomehelp.dto.LoginRequest;
import com.quickhomehelp.dto.LoginResponse;
import com.quickhomehelp.dto.RegisterRequest;
import com.quickhomehelp.entity.*;
import com.quickhomehelp.exception.DuplicateResourceException;
import com.quickhomehelp.exception.ResourceNotFoundException;
import com.quickhomehelp.exception.UnauthorizedActionException;
import com.quickhomehelp.repository.*;

import lombok.Getter;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpertProfileRepository expertRepo;

    @Override
    public String register(RegisterRequest request) {

        if (request.getRole().equalsIgnoreCase("ADMIN")) {
            throw new UnauthorizedActionException(
                "Admin registration not allowed");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already registered");
        }

        Role role = Role.valueOf(
                request.getRole().toUpperCase());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(role);

        userRepository.save(user);

        if (role == Role.EXPERT) {

            ExpertProfile profile = new ExpertProfile();

            profile.setUser(user);
            profile.setVerified(false);   
            profile.setOnline(false);

            expertRepo.save(profile);
        }

        return role + " registered successfully";
    }


    @Override
    public Object login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new ResourceNotFoundException("User not found"));

        if (!user.getPassword()
                .equals(request.getPassword())) {

            throw new UnauthorizedActionException("Invalid password");
        }

        return new LoginResponse(
                user.getId(),
                user.getRole().name()
        );
    }
}

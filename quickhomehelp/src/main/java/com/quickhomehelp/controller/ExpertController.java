package com.quickhomehelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quickhomehelp.dto.ExpertProfileRequest;
import com.quickhomehelp.dto.OtpVerifyRequest;
import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.ExpertProfile;
import com.quickhomehelp.service.ExpertService;

import java.util.List;

@RestController
@RequestMapping("/expert")
public class ExpertController {

    @Autowired
    private ExpertService expertService;
    

    @GetMapping("/profile/{userId}")
    public ExpertProfile getProfile(
            @PathVariable Long userId) {

        return expertService
                .getProfileByUserId(userId);
    }
    

    @PatchMapping("/profile/update")
    public ExpertProfile updateProfile(
        @RequestBody
        ExpertProfileRequest request) {

        return expertService
                .updateProfile(request);
    }

    
    @GetMapping("/bookings")
    public List<Booking> viewJobs(
        @RequestParam Long expertId,
        @RequestParam String status) {

        return expertService
            .viewAssignedJobs(expertId, status);
    }
    

    @PatchMapping("/profile/{id}/online")
    public ExpertProfile goOnline(
        @PathVariable Long id,
        @RequestParam Boolean status) {

        return expertService
                .goOnline(id, status);
    }


    @PatchMapping("/bookings/{id}/accept")
    public Booking accept(
            @PathVariable Long id) {

        return expertService.acceptBooking(id);
    }

    @PatchMapping("/bookings/{id}/reject")
    public Booking reject(
            @PathVariable Long id) {

        return expertService.rejectBooking(id);
    }

    @PatchMapping("/bookings/{id}/status")
    public Booking updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return expertService
            .updateStatus(id, status);
    }
    
    @PostMapping("/bookings/{id}/verify-otp")
    public Booking verifyOtp(
            @PathVariable Long id,
            @RequestBody OtpVerifyRequest request) {

        return expertService
            .verifyOtp(id, request.getOtp());
    }
    
     
}

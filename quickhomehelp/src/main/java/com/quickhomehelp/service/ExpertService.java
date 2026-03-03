package com.quickhomehelp.service;

import java.util.List;

import com.quickhomehelp.dto.ExpertProfileRequest;
import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.ExpertProfile;

public interface ExpertService {
	
    List<Booking> viewAssignedJobs(
        Long expertId,
        String status
    );

    Booking acceptBooking(Long bookingId);

    Booking rejectBooking(Long bookingId);

    Booking updateStatus(
        Long bookingId,
        String status
    );
    
    Booking verifyOtp(
    	    Long bookingId,
    	    String otp
    	);
    
    ExpertProfile updateProfile(
            ExpertProfileRequest request);

    ExpertProfile goOnline(
            Long expertId,
            Boolean status);
    
    ExpertProfile getProfileByUserId(Long userId);

	Booking startJob(Long bookingId);

	Booking completeJob(Long bookingId);

	Booking resumeJob(Long bookingId);

	Booking pauseJob(Long bookingId);

}

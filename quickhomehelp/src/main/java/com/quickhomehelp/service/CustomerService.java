package com.quickhomehelp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.quickhomehelp.dto.BookingRequest;
import com.quickhomehelp.dto.BookingResponse;
import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.HomeService;
import com.quickhomehelp.entity.User;


public interface CustomerService {

    List<HomeService> viewAllServices();

    
    User getCustomerById(Long id);
    
    Booking createBooking(
    	    BookingRequest request,
    	    Long userId
    	);


	String getOtp(Long bookingId);



	  
	  List<BookingResponse>
	  getCustomerBookings(Long customerId);


}


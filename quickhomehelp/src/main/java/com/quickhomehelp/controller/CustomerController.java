package com.quickhomehelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quickhomehelp.dto.BookingRequest;
import com.quickhomehelp.dto.BookingResponse;
import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.HomeService;
import com.quickhomehelp.entity.User;
import com.quickhomehelp.service.CustomerService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/services")
    public List<HomeService> viewServices() {

        return customerService.viewAllServices();
    }


    
    @PostMapping("/bookings")
    public Booking createBooking(
        @Valid @RequestBody BookingRequest request,
        @RequestParam Long userId) {

        return customerService
               .createBooking(request, userId);
    }


    @GetMapping("/{id}")
    public User getCustomer(
            @PathVariable Long id) {

        return customerService
                .getCustomerById(id);
    }
    
    
    @GetMapping("/bookings/{id}/otp")
    public String getOtp(
            @PathVariable Long id) {

        return customerService.getOtp(id);
    }
    
  
    @GetMapping("/bookings")
    public List<BookingResponse> getBookings(
        @RequestParam Long customerId) {

        return customerService
                .getCustomerBookings(
                    customerId);
    }
 
}



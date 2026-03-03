package com.quickhomehelp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickhomehelp.dto.RatingRequest;
import com.quickhomehelp.entity.Rating;
import com.quickhomehelp.service.RatingService;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;
    
    

    @PostMapping
    public String submit(
        @RequestBody RatingRequest dto) {

        ratingService.submitRating(dto);
        return "Rating submitted";
    }

 
    @GetMapping("/booking/{bookingId}")
    public Rating getByBooking(
            @PathVariable Long bookingId) {

        return ratingService
                .getByBookingId(bookingId);
    }
    
    
    
    
}

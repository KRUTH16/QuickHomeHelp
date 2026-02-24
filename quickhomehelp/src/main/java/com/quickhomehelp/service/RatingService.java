package com.quickhomehelp.service;

import java.util.List;
import com.quickhomehelp.dto.RatingRequest;
import com.quickhomehelp.entity.Rating;

public interface RatingService {

    void submitRating(RatingRequest dto);


    
    Rating getByBookingId(Long bookingId);
}



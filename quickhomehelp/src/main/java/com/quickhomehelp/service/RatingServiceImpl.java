package com.quickhomehelp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickhomehelp.dto.RatingRequest;
import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.Rating;
import com.quickhomehelp.repository.BookingRepository;
import com.quickhomehelp.repository.RatingRepository;

@Service
public class RatingServiceImpl
        implements RatingService {

    @Autowired
    private RatingRepository ratingRepo;

    @Autowired
    private BookingRepository bookingRepo;
    
    @Autowired
    private NotificationService notificationService;

    @Override
    public void submitRating(
            RatingRequest dto) {

        Booking booking =
            bookingRepo.findById(dto.getBookingId())
            .orElseThrow(() ->
                new RuntimeException("Booking not found"));

        if (!booking.getPaymentStatus()
                .equals("PAID")) {

            throw new RuntimeException(
                "Cannot rate before payment");
        }

        if (ratingRepo
            .findByBookingId(dto.getBookingId())
            .isPresent()) {

            throw new RuntimeException(
                "Rating already submitted");
        }

        Rating rating = new Rating();

        rating.setBooking(booking);
        rating.setStars(dto.getStars());
        rating.setComment(dto.getComment());

        ratingRepo.save(rating);
        
        notificationService.createNotification(
        	    booking.getExpertId(),
        	    "You received a new rating."
        	);
        
        System.out.println("ExpertId: " + booking.getExpertId());
    }



    
    @Override
    public Rating getByBookingId(Long bookingId) {

        return ratingRepo
                .findByBookingId(bookingId)
                .orElse(null);
    }
}
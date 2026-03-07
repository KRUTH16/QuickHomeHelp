package com.quickhomehelp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickhomehelp.dto.BookingRequest;
import com.quickhomehelp.dto.BookingResponse;
import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.HomeService;
import com.quickhomehelp.entity.User;
import com.quickhomehelp.exception.ResourceNotFoundException;
import com.quickhomehelp.repository.BookingRepository;
import com.quickhomehelp.repository.RatingRepository;
import com.quickhomehelp.repository.ServiceRepository;
import com.quickhomehelp.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private ServiceRepository serviceRepo;

    @Autowired
    private BookingRepository bookingRepo;
    
    @Autowired
    private MatchingService matchingService;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private NotificationService notificationService;
    

    
    @Autowired
    private RatingRepository ratingRepo;


   
    @Override
    public List<HomeService> viewAllServices() {

        return serviceRepo.findAll();
    }

    @Override
    public Booking createBooking(BookingRequest request, Long userId) {

        HomeService service = serviceRepo
                .findById(request.getServiceId())
                .orElseThrow(() ->
                    new ResourceNotFoundException("Service not found"));

        User customer = userRepo
                .findById(userId)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Customer not found"));

        Booking booking = new Booking();

        booking.setCustomerId(customer.getId());
        booking.setServiceId(service.getId());
        booking.setExpertId(null);
        booking.setStatus("REQUESTED");
        booking.setAddress(request.getAddress());
        booking.setPincode(request.getPincode());

        Integer baseDuration = service.getBaseDuration();
        Double basePrice = service.getBasePrice();

        Double perMinuteRate = basePrice / baseDuration;

        booking.setBaseDuration(baseDuration);
        booking.setBasePrice(basePrice);
        booking.setPerMinuteRate(perMinuteRate);

        booking.setAmount(basePrice);

        booking.setCreatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepo.save(booking);

        notificationService.createNotification(
                customer.getId(),
                "Booking confirmed. Expert will be assigned soon."
        );

        return matchingService.assignExpert(savedBooking);
    }
    
    @Override
    public User getCustomerById(Long id) {

        return userRepo.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Customer not found"
                )
            );
    }
    
    @Override
    public String getOtp(Long bookingId) {

        Booking booking = bookingRepo
            .findById(bookingId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Booking not found"));

        return booking.getOtp();
    }

    
    @Override
    public List<BookingResponse>
    getCustomerBookings(Long customerId)  {

        List<Booking> bookings =
            bookingRepo.findByCustomerId(
                customerId);

        List<BookingResponse> list =
            new ArrayList<>();

        for (Booking b : bookings) {

            BookingResponse dto =
                new BookingResponse();

            dto.setId(b.getId());
            dto.setStatus(b.getStatus());
            dto.setAddress(b.getAddress());
            dto.setPincode(b.getPincode());
            dto.setAmount(b.getAmount());
            dto.setOtp(b.getOtp());  
            dto.setPaymentStatus(b.getPaymentStatus());
            
            
            
            boolean rated =
            	    ratingRepo
            	        .findByBookingId(b.getId())
            	        .isPresent();

            	dto.setRated(rated);

            list.add(dto);
        }

        return list;
    }

}





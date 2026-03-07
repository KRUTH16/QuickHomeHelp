package com.quickhomehelp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickhomehelp.dto.ExpertProfileRequest;
import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.ExpertProfile;
import com.quickhomehelp.entity.HomeService;
import com.quickhomehelp.exception.BadRequestException;
import com.quickhomehelp.exception.DuplicateResourceException;
import com.quickhomehelp.exception.ResourceNotFoundException;
import com.quickhomehelp.repository.BookingRepository;
import com.quickhomehelp.repository.ExpertProfileRepository;
import com.quickhomehelp.repository.ServiceRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExpertServiceImpl
        implements ExpertService {

    @Autowired
    private BookingRepository bookingRepo;
    
    @Autowired
    private ExpertProfileRepository expertRepo;
    
    @Autowired
    private MatchingServiceImpl matchingService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private ServiceRepository serviceRepo;
    
    

    @Override
    public List<Booking> viewAssignedJobs(
            Long expertId,
            String status) {

        return bookingRepo
            .findByExpertIdAndStatus(
                expertId,
                status
            );
    }

 
    @Override
    public Booking updateStatus(
            Long bookingId,
            String status) {

        Booking booking =
            bookingRepo.findById(bookingId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Booking not found"));

        booking.setStatus(status);

        return bookingRepo.save(booking);
    }
    

    @Override
    public Booking verifyOtp(
            Long bookingId,
            String otp) {

        Booking booking =
            bookingRepo.findById(bookingId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Booking not found"));

        if (!booking.getOtp().equals(otp)) {
            throw new BadRequestException("Invalid OTP");
        }

        booking.setOtpVerified(true);
        booking.setStatus("IN_PROGRESS");

        return bookingRepo.save(booking);
    }
    
    
    
    @Override
    public Booking acceptBooking(Long bookingId) {

        Booking booking = bookingRepo
                .findById(bookingId)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Booking not found"));

        if (!booking.getStatus().equals("ASSIGNED")) {
            throw new BadRequestException(
                "Booking is not in ASSIGNED state");
        }


        if (booking.getOtp() != null) {
            throw new DuplicateResourceException(
                "OTP already generated for this booking");
        }

     
        int otpNum = 1000 + (int)(Math.random() * 9000);
        String otp = String.valueOf(otpNum);

        booking.setStatus("ACCEPTED");
        booking.setOtp(otp);
        booking.setOtpVerified(false);


        Booking savedBooking = bookingRepo.save(booking);
        
        notificationService.createNotification(
                booking.getCustomerId(),
                "Expert is arriving soon."
        );
        
        notificationService.createNotification(
        	    booking.getCustomerId(),
        	    "OTP is " 
        	  + booking.getOtp() +
        	    ". Share this with the expert to start service."
        	);
        
       

        System.out.println(
            "OTP for Booking ID " +
            bookingId + " : " + otp);

        return savedBooking;
    }
    

    
    @Override
    public Booking rejectBooking(Long bookingId) {

        Booking booking =
            bookingRepo.findById(bookingId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Booking not found"));

        Long rejectedExpertId =
            booking.getExpertId();

        if (rejectedExpertId == null) {
            throw new ResourceNotFoundException(
                "No expert assigned to reject");
        }

        List<Long> rejectedList =
            booking.getRejectedExpertIds();

        if (rejectedList == null) {
            rejectedList = new ArrayList<>();
        }

        if (!rejectedList.contains(
                rejectedExpertId)) {

            rejectedList.add(
                rejectedExpertId);
        }

        booking.setRejectedExpertIds(
            rejectedList);

        booking.setExpertId(null);

        booking.setStatus("REQUESTED");

        Booking savedBooking =
            bookingRepo.save(booking);

        return matchingService
                .assignExpert(savedBooking);
    }


    
    @Override
    public ExpertProfile updateProfile(ExpertProfileRequest request) {

        ExpertProfile expert = expertRepo
                .findByUserId(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Expert profile not found"));

        List<HomeService> selectedServices =
                serviceRepo.findAllById(request.getServiceIds());

        expert.setServices(selectedServices);

        expert.setPincode(request.getPincode());
        expert.setAddress(request.getAddress());

        return expertRepo.save(expert);
    }
    
   
        @Override
        public ExpertProfile goOnline(
                Long expertId,
                Boolean status) {

            ExpertProfile expert =
                expertRepo.findById(expertId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Expert not found"));

            if (!expert.isVerified()) {
                throw new BadRequestException(
                    "Admin verification pending");
            }

            expert.setOnline(status);

            return expertRepo.save(expert);
        }
        
        @Override
        public ExpertProfile getProfileByUserId(
                Long userId) {

            return expertRepo
                .findByUserId(userId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Expert profile not found"));
        }
        
        
        @Override
        public Booking startJob(Long bookingId) {

            Booking booking = bookingRepo.findById(bookingId)
                    .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

            if (!booking.getStatus().equals("IN_PROGRESS")) {
                throw new BadRequestException(
                        "Job must be in IN_PROGRESS state");
            }

 
            if (booking.getStartTime() != null) {
                return booking;   
            }

            booking.setStartTime(LocalDateTime.now());

            return bookingRepo.save(booking);
        }
        
 
              
        @Override
        public Booking completeJob(Long bookingId) {

            Booking booking = bookingRepo.findById(bookingId)
                    .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

            if (!booking.getStatus().equals("IN_PROGRESS")) {
                throw new BadRequestException(
                        "Job is not in progress");
            }

            if (booking.getStartTime() == null) {
                throw new BadRequestException(
                        "Job was never started");
            }

            booking.setEndTime(LocalDateTime.now());

            long minutes = java.time.Duration
                    .between(
                        booking.getStartTime(),
                        booking.getEndTime()
                    )
                    .toMinutes();

            Integer baseDuration = booking.getBaseDuration();
            Double basePrice = booking.getBasePrice();
            Double perMinuteRate = booking.getPerMinuteRate();

            double total;

            if (minutes <= baseDuration) {
                total = basePrice;
            } else {
                long extraMinutes = minutes - baseDuration;
                total = basePrice + (extraMinutes * perMinuteRate);
            }

            booking.setAmount((double) Math.round(total));

            booking.setStatus("COMPLETED");

            return bookingRepo.save(booking);
        }
        
        
        
        
        @Override
        public Booking pauseJob(Long bookingId) {

            Booking booking = bookingRepo.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

            if (!booking.getStatus().equals("IN_PROGRESS"))
                throw new BadRequestException("Job not running");

            if (booking.getPauseTime() == null) {
                booking.setPauseTime(LocalDateTime.now());
            }

            return bookingRepo.save(booking);
        }
        
        @Override
        public Booking resumeJob(Long bookingId) {

            Booking booking = bookingRepo.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

            if (booking.getPauseTime() == null)
                return booking;

            long paused = java.time.Duration
                    .between(booking.getPauseTime(), LocalDateTime.now())
                    .getSeconds();

            booking.setPausedSeconds(
                booking.getPausedSeconds() + paused
            );

            booking.setPauseTime(null);

            return bookingRepo.save(booking);
        }


}


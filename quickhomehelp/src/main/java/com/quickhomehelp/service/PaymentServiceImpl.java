package com.quickhomehelp.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.Payment;
import com.quickhomehelp.repository.BookingRepository;
import com.quickhomehelp.repository.PaymentRepository;

import jakarta.transaction.Transactional;

@Service
public class PaymentServiceImpl
        implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private BookingRepository bookingRepo;
    
    @Autowired
    private NotificationService notificationService;

    
    @Transactional
    @Override
    public void collectPayment(
            Long bookingId,
            String method) {

        Booking booking =
            bookingRepo.findById(bookingId)
            .orElseThrow(() ->
                new RuntimeException("Booking not found"));

        if (!booking.getStatus()
                .equals("COMPLETED")) {

            throw new RuntimeException(
                "Payment allowed only after completion");
        }


        
        Payment payment = new Payment();

        payment.setBookingId(bookingId);
        payment.setMethod(method);
        payment.setStatus("SUCCESS");
        payment.setPaidAt(LocalDateTime.now());

        paymentRepo.save(payment);

        booking.setPaymentStatus("PAID");
        bookingRepo.save(booking);
        
        notificationService.createNotification(
                booking.getCustomerId(),
                "Payment  successfull."
        );
        
        notificationService.createNotification(
        	    booking.getExpertId(),
        	    "Payment collected successfully."
        	);
    }
}

package com.quickhomehelp.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.Payment;
import com.quickhomehelp.exception.BadRequestException;
import com.quickhomehelp.exception.ResourceNotFoundException;
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

   
    
    @Override
    public Payment collectPayment(Long bookingId, String method) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getStatus().equals("COMPLETED")) {
            throw new BadRequestException("Job not completed yet");
        }

        if (booking.getPaymentStatus().equals("PAID")) {
            throw new BadRequestException("Payment already done");
        }

        Payment payment = new Payment();

        payment.setBookingId(bookingId);
        payment.setAmount(booking.getAmount());
        payment.setMethod(method);
        payment.setStatus("SUCCESS");
        payment.setPaidAt(LocalDateTime.now());

        Payment saved = paymentRepo.save(payment);

        booking.setPaymentStatus("PAID");
        bookingRepo.save(booking);

        return saved;
    }
    
    
    
    
}

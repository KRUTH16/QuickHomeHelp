package com.quickhomehelp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickhomehelp.entity.Payment;

public interface PaymentRepository
extends JpaRepository<Payment, Long> {

Optional<Payment>
findByBookingId(Long bookingId);

}
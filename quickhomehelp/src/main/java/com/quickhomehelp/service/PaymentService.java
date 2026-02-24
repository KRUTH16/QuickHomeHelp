package com.quickhomehelp.service;

public interface PaymentService {

    void collectPayment(
        Long bookingId,
        String method);
}
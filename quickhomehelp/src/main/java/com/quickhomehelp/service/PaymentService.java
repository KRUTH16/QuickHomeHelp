package com.quickhomehelp.service;

import com.quickhomehelp.entity.Payment;

public interface PaymentService {

    Payment collectPayment(Long bookingId, String method);

}
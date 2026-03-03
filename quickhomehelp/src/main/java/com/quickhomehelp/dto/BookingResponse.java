package com.quickhomehelp.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BookingResponse {

    private Long id;
    private String status;
    private String address;
    private String pincode;
    private Double amount;
 
    private String otp;
    
    private boolean rated; 
    
    private String paymentStatus;
 
    private LocalDateTime startTime;


}

package com.quickhomehelp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Setter
@Getter
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;

    private Long expertId;   

    private Long serviceId;

    private String status;   

    private String address;

    private String pincode;

    private Double amount;

    private String otp;

    private LocalDateTime createdAt;

    
    @ElementCollection
    @CollectionTable(
        name = "booking_rejected_experts",
        joinColumns = @JoinColumn(name = "booking_id")
    )
    @Column(name = "expert_id")
    private List<Long> rejectedExpertIds = new ArrayList<>();
    
    
    private Integer durationMinutes;


    private Boolean otpVerified;

    @Column(nullable = false)
    private String paymentStatus = "NOT_PAID";







  
}

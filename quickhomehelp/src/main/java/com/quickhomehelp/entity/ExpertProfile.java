package com.quickhomehelp.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "expert_profiles")
@Data
public class ExpertProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;


    private boolean isVerified = false;
    
    private boolean rejected = false;

    private boolean isOnline = false;
    
    private boolean trainingDone=false;
    
    private String address;
    
    private String pincode;


    
    @Column(name = "assignment_count", nullable = false)
    private Integer assignmentCount=0;	
    
    @ManyToMany
    @JoinTable(
        name = "expert_services",
        joinColumns = @JoinColumn(name = "expert_id"),
        inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<HomeService> services;

}


package com.quickhomehelp.dto;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter


public class ExpertProfileRequest {

    private Long userId;  
    private List<Long> serviceIds;
    private String pincode;
    private String address;
    private Boolean trainingDone;

  
}

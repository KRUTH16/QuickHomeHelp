package com.quickhomehelp.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter


public class ExpertProfileRequest {

    private Long userId;  
    private List<Long> serviceIds;
    
    @NotBlank(message = "Pincode required")
    @Pattern(
        regexp = "^[0-9]{6}$",
        message = "Pincode must be exactly 6 digits"
    )
    private String pincode;
    private String address;
    private Boolean trainingDone;

  
}

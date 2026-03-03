package com.quickhomehelp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RatingRequest {

    private Long bookingId;
    
    private Integer stars;
    
    @NotBlank(message = "Comment is required")
    private String comment;
   
}

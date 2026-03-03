

package com.quickhomehelp.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter

public class BookingRequest {
	


    @NotNull
    private Long serviceId;

    @NotNull(message = "Duration is required")
    @Min(value = 30,
         message = "Minimum 30 mins")
    private Integer durationMinutes;

    @NotBlank(message = "Address required")
    private String address;

   
    
    @NotBlank(message = "Pincode required")
    @Pattern(
        regexp = "^[0-9]{6}$",
        message = "Pincode must be exactly 6 digits"
    )
    private String pincode;
    
    

}


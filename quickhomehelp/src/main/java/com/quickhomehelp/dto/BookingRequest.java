
//
//import jakarta.validation.constraints.*;
//import lombok.Data;
//import lombok.Getter;
//import lombok.Setter;
//
//
//@Data
//@Getter
//@Setter
//
//public class BookingRequest {
//
//    @NotNull
//    private Long customerId;
//
//    @NotNull
//    private Long serviceId;
//
//    @NotBlank
//    private String address;
//
//    @NotBlank
//    private String pincode;
//    
//    @NotBlank
//    private Integer durationMinutes;   
//
//  
//
//}


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
    private String pincode;
    
    

}


package com.quickhomehelp.dto;

import lombok.Data;

@Data
public class RatingRequest {

    private Long bookingId;
    private Integer stars;
    private String comment;
}

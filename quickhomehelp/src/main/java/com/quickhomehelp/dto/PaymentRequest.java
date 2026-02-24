package com.quickhomehelp.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter

public class PaymentRequest {
	 private Long bookingId;
	 private Double amount;
}




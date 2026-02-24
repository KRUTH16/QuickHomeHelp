package com.quickhomehelp.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter

public class PaymentResponse {
	  private String orderId;
	    private Double amount;
	    private String key;

}


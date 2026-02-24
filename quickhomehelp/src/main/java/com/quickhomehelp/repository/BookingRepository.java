package com.quickhomehelp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.quickhomehelp.entity.Booking;

public interface BookingRepository
extends JpaRepository<Booking, Long> {
	
	List<Booking>
    findByExpertIdAndStatus(
        Long expertId,
        String status
    );
	
	List<Booking> findByCustomerId(Long customerId);

	boolean existsByExpertIdAndStatusIn(
		    Long expertId,
		    List<String> statuses
		);


	
}


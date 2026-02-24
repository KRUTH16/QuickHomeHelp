

package com.quickhomehelp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.quickhomehelp.entity.ExpertProfile;

public interface ExpertProfileRepository
        extends JpaRepository<ExpertProfile, Long> {

    List<ExpertProfile>
        findByIsOnlineTrueAndIsVerifiedTrue();

    Optional<ExpertProfile>
        findByUserId(Long userId);

    List<ExpertProfile>
        findByIsVerifiedFalse();
  
    @Query("""
    	    SELECT e FROM ExpertProfile e
    	    JOIN e.services s
    	    WHERE s.id = :serviceId
    	    AND e.pincode = :pincode
    	    AND e.isOnline = true
    	    AND e.isVerified = true
    	    ORDER BY e.assignmentCount ASC
    	""")
    
    	List<ExpertProfile> findMatchingExperts(
    	        Long serviceId,
    	        String pincode);


}


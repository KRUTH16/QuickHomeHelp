
package com.quickhomehelp.service;

import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.ExpertProfile;
import com.quickhomehelp.entity.HomeService;
import java.util.List;

public interface AdminService {

    String verifyExpert(Long expertProfileId);
    
    String rejectExpert(Long expertProfileId);

    HomeService addService(HomeService service);

    
    List<ExpertProfile> getAllExperts();

	List<HomeService> getAllServices();

	HomeService updateService(Long id, HomeService updatedService);

	String deleteService(Long id);
	
	String markTrainingDone(Long id);
   

}


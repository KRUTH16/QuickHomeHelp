package com.quickhomehelp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.ExpertProfile;
import com.quickhomehelp.entity.HomeService;
import com.quickhomehelp.exception.BadRequestException;
import com.quickhomehelp.exception.DuplicateResourceException;
import com.quickhomehelp.exception.ResourceNotFoundException;
import com.quickhomehelp.repository.BookingRepository;
import com.quickhomehelp.repository.ExpertProfileRepository;
import com.quickhomehelp.repository.ServiceRepository;

@org.springframework.stereotype.Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private ExpertProfileRepository expertRepo;

    @Autowired
    private ServiceRepository serviceRepo;

    @Autowired
    private BookingRepository bookingRepo;


    
    @Override
    public String verifyExpert(Long expertProfileId) {

        ExpertProfile expert = expertRepo.findById(expertProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Expert not found"));

        if (!expert.isTrainingDone()) {
            throw new BadRequestException("Expert has not completed training");
        }

        expert.setVerified(true);
        expert.setRejected(false);

        expertRepo.save(expert);

        return "Expert verified successfully";
    }
    
    @Override
    public String rejectExpert(Long expertProfileId) {

        ExpertProfile expert =
            expertRepo.findById(expertProfileId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Expert not found"));

        expert.setVerified(false);
        expert.setRejected(true);   

        expertRepo.save(expert);

        return "Expert rejected successfully";
    }


    
    @Override
    public HomeService addService(HomeService service) {

        String normalizedCategory = service.getCategory()
                .trim()
                .toUpperCase();

        service.setCategory(normalizedCategory);

        String normalizedName = service.getName()
                .trim();

        service.setName(normalizedName);

        boolean exists = serviceRepo
                .existsByNameAndCategory(
                        normalizedName,
                        normalizedCategory
                );

        if (exists) {
            throw new DuplicateResourceException(
                    "Service already exists in this category"
            );
        }

        return serviceRepo.save(service);
    }


    
    @Override
    public List<ExpertProfile> getAllExperts() {

        return expertRepo.findAll();
    }
    
    @Override
    public List<HomeService> getAllServices() {
        return serviceRepo.findAll();
    }
    

    @Override
    public HomeService updateService(Long id, HomeService updatedService) {

        HomeService service = serviceRepo.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Service not found"));

        service.setName(updatedService.getName());
        service.setCategory(updatedService.getCategory());
        service.setBaseDuration(updatedService.getBaseDuration());
        service.setBasePrice(updatedService.getBasePrice());

        return serviceRepo.save(service);
    }
    
  
    @Override
    public String deleteService(Long id) {

        if (!serviceRepo.existsById(id)) {
            throw new ResourceNotFoundException("Service not found");
        }

        serviceRepo.deleteById(id);

        return "Service deleted successfully";
    }
    
    //change
    @Override
    public String markTrainingDone(Long id) {

        ExpertProfile expert = expertRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expert not found"));

        expert.setTrainingDone(true);

        expertRepo.save(expert);

        return "Training marked as completed";
    }
  
  
}

package com.quickhomehelp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quickhomehelp.entity.HomeService;
import com.quickhomehelp.service.AdminService;


import java.util.List;
import com.quickhomehelp.entity.Booking;
import com.quickhomehelp.entity.ExpertProfile;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PatchMapping("/experts/{id}/verify")
    public String verifyExpert(@PathVariable Long id) {

        return adminService.verifyExpert(id);
    }
  

    @PatchMapping("/experts/{id}/reject")
    public String rejectExpert(
            @PathVariable Long id) {

        return adminService.rejectExpert(id);
    }


    @PostMapping("/services")
    public HomeService addService(
            @RequestBody HomeService service) {

        return adminService.addService(service);
    }
    
    
    @GetMapping("/services")
    public List<HomeService> getAllServices() {
        return adminService.getAllServices();
    }
    
    @DeleteMapping("/services/{id}")
    public String deleteService(
            @PathVariable Long id) {

        return adminService.deleteService(id);
    }
    
    @PutMapping("/services/{id}")
    public HomeService updateService(
            @PathVariable Long id,
            @RequestBody HomeService service) {

        return adminService.updateService(id, service);
    }


    @GetMapping("/experts")
    public List<ExpertProfile> 
    getAllExperts() {

        return adminService.getAllExperts();
    }
    
    

}


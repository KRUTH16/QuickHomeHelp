
package com.quickhomehelp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickhomehelp.entity.*;
import com.quickhomehelp.exception.BadRequestException;
import com.quickhomehelp.exception.ResourceNotFoundException;
import com.quickhomehelp.repository.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MatchingServiceImpl
        implements MatchingService {

    @Autowired
    private ExpertProfileRepository expertRepo;

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private ServiceRepository serviceRepo;
    
    @Autowired
    private NotificationService notificationService;


    @Override
    public Booking assignExpert(Booking booking) {

        if (booking.getServiceId() == null) {
            throw new BadRequestException("Service ID missing in booking");
        }

        HomeService service = serviceRepo
                .findById(booking.getServiceId())
                .orElseThrow(() ->
                    new ResourceNotFoundException("Service not found"));

        List<ExpertProfile> experts =
            expertRepo
            .findByIsOnlineTrueAndIsVerifiedTrue();

        List<Long> rejected =
            booking.getRejectedExpertIds();

        if (rejected != null && !rejected.isEmpty()) {
            experts.removeIf(expert ->
                rejected.contains(
                    expert.getUser().getId()
                )
            );
        }


        List<String> busyStatuses =
            List.of(
                "ASSIGNED",
                "ACCEPTED",
                "IN_PROGRESS"
            );


        List<ExpertProfile> matched =
            new ArrayList<>();

        for (ExpertProfile expert : experts) {

            boolean skillMatch =
                expert.getServices() != null &&
                expert.getServices()
                      .stream()
                      .anyMatch(s ->
                          s.getId()
                           .equals(service.getId())
                      );

            boolean pincodeMatch =
                expert.getPincode() != null &&
                booking.getPincode() != null &&
                expert.getPincode()
                      .equalsIgnoreCase(
                          booking.getPincode());

            boolean isBusy =
                bookingRepo
                .existsByExpertIdAndStatusIn(
                    expert.getUser().getId(),
                    busyStatuses
                );

            if (skillMatch &&
                pincodeMatch &&
                !isBusy) {

                matched.add(expert);
            }
        }

    
        if (matched.isEmpty()) {

            booking.setStatus(
                "NO_EXPERT_AVAILABLE");

            return bookingRepo.save(booking);
        }

        matched.sort(
            Comparator.comparingInt(
                ExpertProfile::getAssignmentCount
            )
        );

        ExpertProfile selected =
            matched.get(0);

        booking.setExpertId(
            selected.getUser().getId());

        booking.setStatus("ASSIGNED");
   
        notificationService.createNotification(
            selected.getUser().getId(),
            "New booking assigned. Please respond within 30 seconds."
        );

        System.out.println("AssignExpert called");
        System.out.println("ExpertId: " + selected.getUser().getId());

        selected.setAssignmentCount(
            selected.getAssignmentCount() + 1
        );

        expertRepo.save(selected);

        return bookingRepo.save(booking);
    }
}

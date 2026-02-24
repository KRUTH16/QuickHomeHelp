package com.quickhomehelp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickhomehelp.entity.Notification;
import com.quickhomehelp.service.NotificationService;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping("/{userId}")
    public List<Notification> get(
        @PathVariable Long userId) {

        return service
            .getUserNotifications(userId);
    }

    @PatchMapping("/read/{id}")
    public void markRead(
        @PathVariable Long id) {

        service.markAsRead(id);
    }
    @PatchMapping("/read-all/{userId}")
    public void markAll(
            @PathVariable Long userId) {

        service.markAllAsRead(userId);
    }
    
}
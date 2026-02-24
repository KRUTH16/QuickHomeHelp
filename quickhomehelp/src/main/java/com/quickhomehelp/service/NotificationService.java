package com.quickhomehelp.service;

import java.util.List;

import com.quickhomehelp.entity.Notification;

public interface NotificationService {

    void createNotification(
        Long userId,
        String message);

    List<Notification>
    getUserNotifications(Long userId);

    void markAsRead(Long id);
    
    void markAllAsRead(Long userId);
}
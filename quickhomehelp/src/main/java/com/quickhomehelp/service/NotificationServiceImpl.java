package com.quickhomehelp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quickhomehelp.entity.Notification;
import com.quickhomehelp.repository.NotificationRepository;

import jakarta.transaction.Transactional;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    @Autowired
    private NotificationRepository repo;

    @Override
    public void createNotification(
            Long userId,
            String message) {

        Notification n = new Notification();

        n.setUserId(userId);
        n.setMessage(message);
        n.setCreatedAt(LocalDateTime.now());

        repo.save(n);
    }

    @Override
    public List<Notification>
    getUserNotifications(Long userId) {

        return repo
            .findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public void markAsRead(Long id) {

        Notification n =
            repo.findById(id)
                .orElseThrow();

        n.setReadStatus(true);

        repo.save(n);
    }
    
    @Transactional
    @Override
    public void markAllAsRead(Long userId) {
        repo.markAllAsRead(userId);
    }
}
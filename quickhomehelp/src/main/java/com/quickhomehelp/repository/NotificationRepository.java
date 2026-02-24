package com.quickhomehelp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.quickhomehelp.entity.Notification;

import io.lettuce.core.dynamic.annotation.Param;

public interface NotificationRepository
extends JpaRepository<Notification, Long> {

List<Notification>
findByUserIdOrderByCreatedAtDesc(Long userId);

Long countByUserIdAndReadStatusFalse(Long userId);

@Modifying
@Query("UPDATE Notification n SET n.readStatus = true WHERE n.userId = :userId AND n.readStatus = false")
void markAllAsRead(@Param("userId") Long userId);

}

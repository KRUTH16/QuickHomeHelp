package com.quickhomehelp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quickhomehelp.entity.HomeService;

public interface ServiceRepository
extends JpaRepository<HomeService, Long> {
	boolean existsByNameAndCategory(String name, String category);
}


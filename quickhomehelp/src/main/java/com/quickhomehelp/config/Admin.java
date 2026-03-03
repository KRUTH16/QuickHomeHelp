package com.quickhomehelp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.quickhomehelp.entity.Role;
import com.quickhomehelp.entity.User;
import com.quickhomehelp.repository.UserRepository;

@Component
public class Admin implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {

        String adminEmail = "admin@gmail.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {

            User admin = new User();

            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword("admin123"); 
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println(" Default Admin Created");
        }
        else {
            System.out.println(" Admin already exists");
        }
    }
}




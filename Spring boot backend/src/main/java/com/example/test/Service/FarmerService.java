package com.example.test.Service;

import com.example.test.Model.Farmer;
import com.example.test.Repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FarmerService {
    @Autowired
    private FarmerRepository farmerRepository;

    public Farmer signup(Farmer farmer) {
        if (farmerRepository.existsByEmail(farmer.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        // TODO: Add password encryption here if needed
        return farmerRepository.save(farmer);
    }

    public Farmer login(String email, String password) {
        Farmer farmer = farmerRepository.findByEmail(email);
        if (farmer == null || !farmer.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password");
        }
        return farmer;
    }
} 
package com.example.test.Repository;

import com.example.test.Model.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    boolean existsByEmail(String email);
    Farmer findByEmail(String email);
} 
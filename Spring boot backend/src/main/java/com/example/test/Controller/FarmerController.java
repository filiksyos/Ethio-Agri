package com.example.test.Controller;

import com.example.test.Model.Farmer;
import com.example.test.Service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {
    @Autowired
    private FarmerService farmerService;

    @PostMapping("/signup")
    public Farmer signup(@RequestBody Farmer farmer) {
        return farmerService.signup(farmer);
    }

    @PostMapping("/login")
    public Farmer login(@RequestBody LoginRequest loginRequest) {
        return farmerService.login(loginRequest.getEmail(), loginRequest.getPassword());
    }

    // DTO for login
    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
} 
package com.example.test.Controller;

import com.example.test.Model.Customer;
import com.example.test.Service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PostMapping("/signup")
    public Customer signup(@RequestBody Customer customer) {
        return customerService.signup(customer);
    }

    @PostMapping("/login")
    public Customer login(@RequestBody LoginRequest loginRequest) {
        return customerService.login(loginRequest.getEmail(), loginRequest.getPassword());
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
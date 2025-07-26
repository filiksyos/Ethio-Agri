package com.example.test.Service;

import com.example.test.Model.Customer;
import com.example.test.Repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public Customer signup(Customer customer) {
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        // TODO: Add password encryption here if needed
        return customerRepository.save(customer);
    }

    public Customer login(String email, String password) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null || !customer.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password");
        }
        return customer;
    }
} 
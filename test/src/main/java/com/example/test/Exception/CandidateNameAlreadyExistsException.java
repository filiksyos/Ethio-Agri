package com.example.test.Exception;

public class CandidateNameAlreadyExistsException extends RuntimeException {
    public CandidateNameAlreadyExistsException(String message) {
        super(message);
    }
}

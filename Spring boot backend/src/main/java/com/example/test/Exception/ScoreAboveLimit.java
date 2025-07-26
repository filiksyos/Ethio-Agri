package com.example.test.Exception;

public class ScoreAboveLimit extends RuntimeException{
    public ScoreAboveLimit(String message) {
        super(message);
    }
}

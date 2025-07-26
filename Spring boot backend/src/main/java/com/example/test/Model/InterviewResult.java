package com.example.test.Model;


import jakarta.persistence.*;

@Entity
@Table(name = "interview_results")
public class InterviewResult {
    @Id
    private String candidate_name;

    @Column(nullable = false)
    private Double candidate_score;
    @Column(nullable = false)
    private Boolean is_successful;

    public String getCandidate_name() {
        return candidate_name;
    }

    public void setCandidate_name(String candidate_name) {
        this.candidate_name = candidate_name;
    }

    public Double getCandidate_score() {
        return candidate_score;
    }

    public void setCandidate_score(Double candidate_score) {
        this.candidate_score = candidate_score;
    }

    public Boolean getIs_successful() {
        return is_successful;
    }

    public void setIs_successful(Boolean is_successful) {
        this.is_successful = is_successful;
    }
}


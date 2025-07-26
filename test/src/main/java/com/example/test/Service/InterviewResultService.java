package com.example.test.Service;

import com.example.test.Exception.CandidateNameAlreadyExistsException;
import com.example.test.Exception.ScoreAboveLimit;
import com.example.test.Model.InterviewResult;
import com.example.test.Repository.InterviewResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class InterviewResultService {
    @Autowired
    private InterviewResultRepository interviewResultRepository;

    //service separetely handling the business logic
    public ResponseEntity<?> createResult(@RequestBody InterviewResult interviewResult){
        //let my custom exception handle the issue
        if (interviewResultRepository.existsById(interviewResult.getCandidate_name())) {
            throw new CandidateNameAlreadyExistsException("Candidate name " + interviewResult.getCandidate_name() + " already exists.");
        }
        //validate the score
        if(interviewResult.getCandidate_score() > 100){
            throw new ScoreAboveLimit("Score should be less than 100");
        }
        return ResponseEntity.ok(interviewResultRepository.save(interviewResult));
    }
}

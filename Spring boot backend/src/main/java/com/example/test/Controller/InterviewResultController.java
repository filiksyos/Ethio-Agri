package com.example.test.Controller;

import com.example.test.Model.InterviewResult;
import com.example.test.Repository.InterviewResultRepository;
import com.example.test.Service.InterviewResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/interview/result")
public class InterviewResultController {

    @Autowired
    private InterviewResultService interviewResultService;

   // end point to create new iterview result
    @PostMapping
    public ResponseEntity<?> createResult(@RequestBody InterviewResult interviewResult) {
        System.out.println(interviewResult.getCandidate_name());
        return ResponseEntity.ok(interviewResultService.createResult(interviewResult));
    }

} 
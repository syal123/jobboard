package com.jobboard.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobboard.backend.model.Job;
import com.jobboard.backend.service.JobService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("")
    public List<Job> getAllJobs(HttpServletRequest request) {
        String ownerUsername = (String) request.getAttribute("authenticatedUsername");
        return jobService.getAllJobs(ownerUsername);
    }

    @PostMapping("")
    public Job createJob(@RequestBody Job job, HttpServletRequest request) {
        String ownerUsername = (String) request.getAttribute("authenticatedUsername");
        return jobService.createJob(job, ownerUsername);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id, @RequestBody Job job, HttpServletRequest request) {
        String ownerUsername = (String) request.getAttribute("authenticatedUsername");
        return jobService.updateJob(id, job, ownerUsername);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id, HttpServletRequest request) {
        String ownerUsername = (String) request.getAttribute("authenticatedUsername");
        jobService.deleteJob(id, ownerUsername);
        return ResponseEntity.noContent().build();
    }
}

package com.jobboard.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobboard.backend.model.Job;
import com.jobboard.backend.service.JobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("")
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @PostMapping("")
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }
}

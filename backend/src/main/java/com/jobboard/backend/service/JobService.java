package com.jobboard.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobboard.backend.model.Job;
import com.jobboard.backend.repository.JobRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }
}

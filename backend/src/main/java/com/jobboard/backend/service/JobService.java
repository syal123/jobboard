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

    public Job updateJob(Long id, Job updateJob) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        existingJob.setCompany(updateJob.getCompany());
        existingJob.setRole(updateJob.getRole());
        existingJob.setStatus(updateJob.getStatus());
        return jobRepository.save(existingJob);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}

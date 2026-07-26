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

    public List<Job> getAllJobs(String ownerUsername) {
        return jobRepository.findByOwnerUsername(ownerUsername);
    }

    public Job createJob(Job job, String ownerUsername) {
        job.setOwnerUsername(ownerUsername);
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job updateJob, String ownerUsername) {
        Job existingJob = jobRepository.findById(id)
                .filter(job -> job.getOwnerUsername().equals(ownerUsername))
                .orElseThrow(() -> new RuntimeException("Job not found"));
        existingJob.setCompany(updateJob.getCompany());
        existingJob.setRole(updateJob.getRole());
        existingJob.setStatus(updateJob.getStatus());
        existingJob.setFollowUpDate(updateJob.getFollowUpDate());
        return jobRepository.save(existingJob);
    }

    public void deleteJob(Long id, String ownerUsername) {
        Job existingJob = jobRepository.findById(id)
                .filter(job -> job.getOwnerUsername().equals(ownerUsername))
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.deleteById(existingJob.getId());
    }
}

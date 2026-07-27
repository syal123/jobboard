package com.jobboard.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.jobboard.backend.model.DeletedJob;
import com.jobboard.backend.model.Job;
import com.jobboard.backend.repository.DeletedJobRepository;
import com.jobboard.backend.repository.JobRepository;
import com.jobboard.backend.repository.UserRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final DeletedJobRepository deletedJobRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository,
            DeletedJobRepository deletedJobRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.deletedJobRepository = deletedJobRepository;
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
        existingJob.setEdited(true);
        Job savedJob = jobRepository.save(existingJob);

        userRepository.findByUserName(ownerUsername).ifPresent(user -> {
            user.setEditedJobsCount(user.getEditedJobsCount() + 1);
            userRepository.save(user);
        });

        return savedJob;
    }

    public void deleteJob(Long id, String ownerUsername) {
        Job existingJob = jobRepository.findById(id)
                .filter(job -> job.getOwnerUsername().equals(ownerUsername))
                .orElseThrow(() -> new RuntimeException("Job not found"));

        DeletedJob deletedJob = new DeletedJob();
        deletedJob.setCompany(existingJob.getCompany());
        deletedJob.setRole(existingJob.getRole());
        deletedJob.setOwnerUsername(ownerUsername);
        deletedJob.setDeletedAt(LocalDateTime.now());
        deletedJobRepository.save(deletedJob);

        jobRepository.deleteById(existingJob.getId());

        userRepository.findByUserName(ownerUsername).ifPresent(user -> {
            user.setDeletedJobsCount(user.getDeletedJobsCount() + 1);
            userRepository.save(user);
        });
    }
}

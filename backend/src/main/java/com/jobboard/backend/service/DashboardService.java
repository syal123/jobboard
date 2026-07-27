package com.jobboard.backend.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jobboard.backend.model.DeletedJob;
import com.jobboard.backend.model.Job;
import com.jobboard.backend.model.User;
import com.jobboard.backend.repository.DeletedJobRepository;
import com.jobboard.backend.repository.JobRepository;
import com.jobboard.backend.repository.UserRepository;

@Service
public class DashboardService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final DeletedJobRepository deletedJobRepository;

    public DashboardService(JobRepository jobRepository, UserRepository userRepository,
            DeletedJobRepository deletedJobRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.deletedJobRepository = deletedJobRepository;
    }

    public DashboardSummary getSummary(String ownerUsername) {
        List<Job> jobs = jobRepository.findByOwnerUsername(ownerUsername);

        long totalApplications = jobs.size();

        Map<String, Long> statusCounts = jobs.stream()
                .collect(Collectors.groupingBy(Job::getStatus, Collectors.counting()));

        LocalDate today = LocalDate.now();
        List<Job> upcomingFollowUps = jobs.stream()
                .filter(job -> job.getFollowUpDate() != null && !job.getFollowUpDate().isBefore(today))
                .sorted(Comparator.comparing(Job::getFollowUpDate))
                .collect(Collectors.toList());

        User user = userRepository.findByUserName(ownerUsername).orElseThrow(() -> new RuntimeException("User not found"));

        List<Job> editedJobs = jobs.stream()
                .filter(Job::isEdited)
                .collect(Collectors.toList());

        List<DeletedJob> deletedJobs = deletedJobRepository.findByOwnerUsernameOrderByDeletedAtDesc(ownerUsername);

        return new DashboardSummary(totalApplications, statusCounts, upcomingFollowUps,
                user.getDeletedJobsCount(), user.getEditedJobsCount(), editedJobs, deletedJobs);
    }

    public record DashboardSummary(long totalApplications, Map<String, Long> statusCounts,
            List<Job> upcomingFollowUps, int deletedJobsCount, int editedJobsCount,
            List<Job> editedJobs, List<DeletedJob> deletedJobs) {
    }
}

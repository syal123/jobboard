package com.jobboard.backend.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jobboard.backend.model.Job;
import com.jobboard.backend.model.User;
import com.jobboard.backend.repository.JobRepository;
import com.jobboard.backend.repository.UserRepository;

@Service
public class DashboardService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public DashboardService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
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

        return new DashboardSummary(totalApplications, statusCounts, upcomingFollowUps,
                user.getDeletedJobsCount(), user.getEditedJobsCount());
    }

    public record DashboardSummary(long totalApplications, Map<String, Long> statusCounts,
            List<Job> upcomingFollowUps, int deletedJobsCount, int editedJobsCount) {
    }
}

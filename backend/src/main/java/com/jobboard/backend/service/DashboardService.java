package com.jobboard.backend.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jobboard.backend.exception.BusinessException;
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

        User user = userRepository.findByUserName(ownerUsername).orElseThrow(() -> new BusinessException("User not found"));

        List<Job> editedJobs = jobs.stream()
                .filter(Job::isEdited)
                .collect(Collectors.toList());

        List<DeletedJob> deletedJobs = deletedJobRepository.findByOwnerUsernameOrderByDeletedAtDesc(ownerUsername);

        long interviewCount = statusCounts.getOrDefault("Interview", 0L);
        long offerCount = statusCounts.getOrDefault("Offer", 0L);
        double interviewRate = totalApplications == 0 ? 0.0 : (interviewCount * 100.0) / totalApplications;
        double offerRate = totalApplications == 0 ? 0.0 : (offerCount * 100.0) / totalApplications;
        double responseRate = totalApplications == 0 ? 0.0
                : ((interviewCount + offerCount) * 100.0) / totalApplications;

        List<Job> dueFollowUps = jobs.stream()
                .filter(job -> job.getFollowUpDate() != null && job.getFollowUpDate().isBefore(today.plusDays(1)))
                .sorted(Comparator.comparing(Job::getFollowUpDate))
                .collect(Collectors.toList());

        return new DashboardSummary(totalApplications, statusCounts, upcomingFollowUps,
                user.getDeletedJobsCount(), user.getEditedJobsCount(), editedJobs, deletedJobs,
                interviewRate, offerRate, responseRate, dueFollowUps);
    }

    public record DashboardSummary(long totalApplications, Map<String, Long> statusCounts,
            List<Job> upcomingFollowUps, int deletedJobsCount, int editedJobsCount,
            List<Job> editedJobs, List<DeletedJob> deletedJobs,
            double interviewRate, double offerRate, double responseRate, List<Job> dueFollowUps) {
    }
}

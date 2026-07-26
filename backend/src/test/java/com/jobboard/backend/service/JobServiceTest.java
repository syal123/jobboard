package com.jobboard.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jobboard.backend.model.Job;
import com.jobboard.backend.repository.JobRepository;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    private JobService jobService;

    @BeforeEach
    void setUp() {
        jobService = new JobService(jobRepository);
    }

    @Test
    void updateJob_whenJobBelongsToRequester_updatesAndReturnsJob() {
        Job existingJob = new Job();
        existingJob.setId(1L);
        existingJob.setOwnerUsername("owner");
        existingJob.setCompany("OldCompany");
        existingJob.setRole("OldRole");
        existingJob.setStatus("APPLIED");
        when(jobRepository.findById(1L)).thenReturn(Optional.of(existingJob));
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Job updateData = new Job();
        updateData.setCompany("NewCompany");
        updateData.setRole("NewRole");
        updateData.setStatus("INTERVIEWING");

        Job result = jobService.updateJob(1L, updateData, "owner");

        assertEquals("NewCompany", result.getCompany());
        assertEquals("NewRole", result.getRole());
        assertEquals("INTERVIEWING", result.getStatus());
    }

    @Test
    void updateJob_whenJobBelongsToDifferentOwner_throwsJobNotFound() {
        Job existingJob = new Job();
        existingJob.setId(1L);
        existingJob.setOwnerUsername("otherOwner");
        when(jobRepository.findById(1L)).thenReturn(Optional.of(existingJob));

        Job updateData = new Job();
        updateData.setCompany("NewCompany");

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> jobService.updateJob(1L, updateData, "owner"));

        assertEquals("Job not found", exception.getMessage());
    }

    @Test
    void deleteJob_whenJobBelongsToRequester_deletesSuccessfully() {
        Job existingJob = new Job();
        existingJob.setId(1L);
        existingJob.setOwnerUsername("owner");
        when(jobRepository.findById(1L)).thenReturn(Optional.of(existingJob));

        jobService.deleteJob(1L, "owner");

        verify(jobRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteJob_whenJobBelongsToDifferentOwner_throwsJobNotFoundAndDoesNotDelete() {
        Job existingJob = new Job();
        existingJob.setId(1L);
        existingJob.setOwnerUsername("otherOwner");
        when(jobRepository.findById(1L)).thenReturn(Optional.of(existingJob));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> jobService.deleteJob(1L, "owner"));

        assertEquals("Job not found", exception.getMessage());
        verify(jobRepository, never()).deleteById(any());
    }
}

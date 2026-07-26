package com.jobboard.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobboard.backend.model.Job;

public interface JobRepository extends JpaRepository<Job, Long> {
}

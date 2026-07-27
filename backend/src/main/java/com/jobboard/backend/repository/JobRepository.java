package com.jobboard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobboard.backend.model.Job;


// No SQL written here. Spring Data JPA generated the actual database query just from this method's name 
// (find all jobs beloging to one user). Extending JpaRepository also gives save/findById/deleteById for free.
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByOwnerUsername(String ownerUsername);
}

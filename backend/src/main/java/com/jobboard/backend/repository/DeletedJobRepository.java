package com.jobboard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobboard.backend.model.DeletedJob;


// Fetches a user's deleted-job history, newest first-again, purely from the method name; Spring Data JPA 
// writes the actual query automatically.
public interface DeletedJobRepository extends JpaRepository<DeletedJob, Long> {

    List<DeletedJob> findByOwnerUsernameOrderByDeletedAtDesc(String ownerUsername);
}

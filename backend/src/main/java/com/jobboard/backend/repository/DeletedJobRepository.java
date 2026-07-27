package com.jobboard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobboard.backend.model.DeletedJob;

public interface DeletedJobRepository extends JpaRepository<DeletedJob, Long> {

    List<DeletedJob> findByOwnerUsernameOrderByDeletedAtDesc(String ownerUsername);
}

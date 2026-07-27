package com.jobboard.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobboard.backend.model.User;


// Same idea as JobRepository, no SQL written by hand. This method name alone tells Spring Data JPA to look
// up a user by their username.
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserName(String userName);
}

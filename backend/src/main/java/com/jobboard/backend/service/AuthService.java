package com.jobboard.backend.service;

import java.time.LocalDate;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobboard.backend.exception.BusinessException;
import com.jobboard.backend.model.User;
import com.jobboard.backend.repository.UserRepository;


// Handles the actual rules around registering and logging in: makes sure a username isn't already taken,
// encrypts passwords before saving them (the real passwrod is never stored, only its hash), and checks
// a login attempt by comparing against that hash rather than comapring plain text.
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String userName, String rawPassword, String firstName, String lastName,
            LocalDate dateOfBirth) {
        if (userRepository.findByUserName(userName).isPresent()) {
            throw new BusinessException("Username already present");
        }
        User user = new User();
        user.setUserName(userName);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setDateOfBirth(dateOfBirth);
        return userRepository.save(user);
    }

    public User login(String userName, String password) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new BusinessException("Invalid userName and password"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("Invalid userName and password");
        }
        return user;
    }
}

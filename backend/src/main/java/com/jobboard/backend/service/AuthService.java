package com.jobboard.backend.service;

import java.time.LocalDate;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobboard.backend.model.User;
import com.jobboard.backend.repository.UserRepository;

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
            throw new RuntimeException("Username already present");
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
                .orElseThrow(() -> new RuntimeException("Invalid userName and password"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid userName and password");
        }
        return user;
    }
}

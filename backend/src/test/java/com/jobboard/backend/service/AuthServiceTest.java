package com.jobboard.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.jobboard.backend.model.User;
import com.jobboard.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository);
    }

    @Test
    void register_withNewUserName_savesHashedPasswordAndReturnsUser() {
        when(userRepository.findByUserName("newuser")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = authService.register("newuser", "plaintextPassword");

        assertEquals("newuser", result.getUserName());
        assertNotEquals("plaintextPassword", result.getPassword());
    }

    @Test
    void register_withExistingUserName_throwsRuntimeException() {
        User existingUser = new User();
        existingUser.setUserName("existinguser");
        existingUser.setPassword("somehash");
        when(userRepository.findByUserName("existinguser")).thenReturn(Optional.of(existingUser));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register("existinguser", "anyPassword"));

        assertEquals("Username already present", exception.getMessage());
    }

    @Test
    void login_withCorrectCredentials_returnsUser() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User existingUser = new User();
        existingUser.setUserName("realuser");
        existingUser.setPassword(encoder.encode("correctPassword"));
        when(userRepository.findByUserName("realuser")).thenReturn(Optional.of(existingUser));

        User result = authService.login("realuser", "correctPassword");

        assertEquals("realuser", result.getUserName());
    }

    @Test
    void login_withWrongPassword_throwsRuntimeException() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User existingUser = new User();
        existingUser.setUserName("realuser");
        existingUser.setPassword(encoder.encode("correctPassword"));
        when(userRepository.findByUserName("realuser")).thenReturn(Optional.of(existingUser));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.login("realuser", "wrongPassword"));

        assertEquals("Invalid userName and password", exception.getMessage());
    }
}

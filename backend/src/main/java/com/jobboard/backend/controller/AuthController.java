package com.jobboard.backend.controller;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobboard.backend.model.User;
import com.jobboard.backend.service.AuthService;
import com.jobboard.backend.util.JwtUtil;


// Exposes the register and login URLs (/api/auth/register, /api/auth/login). Kept intentionally thin - 
// it just reads the incoming request and hands it straight to AuthService, which does the actual work
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        LocalDate dateOfBirth = LocalDate.parse(request.dateOfBirth());
        return authService.register(request.userName(), request.password(), request.firstName(),
                request.lastName(), dateOfBirth);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        User user = authService.login(request.userName(), request.password());
        String token = jwtUtil.generateToken(user.getUserName());
        return new AuthResponse(token);
    }

    public record RegisterRequest(String userName, String password, String firstName, String lastName,
            String dateOfBirth) {
    }

    public record LoginRequest(String userName, String password) {
    }

    public record AuthResponse(String token) {
    }
}

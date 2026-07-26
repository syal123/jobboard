package com.jobboard.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobboard.backend.model.User;
import com.jobboard.backend.service.AuthService;
import com.jobboard.backend.util.JwtUtil;

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
    public User register(@RequestBody AuthRequest request) {
        return authService.register(request.userName(), request.password());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        User user = authService.login(request.userName(), request.password());
        String token = jwtUtil.generateToken(user.getUserName());
        return new AuthResponse(token);
    }

    public record AuthRequest(String userName, String password) {
    }

    public record AuthResponse(String token) {
    }
}

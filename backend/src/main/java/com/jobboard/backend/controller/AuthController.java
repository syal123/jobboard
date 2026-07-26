package com.jobboard.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobboard.backend.model.User;
import com.jobboard.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody AuthRequest request) {
        return authService.register(request.userName(), request.password());
    }

    @PostMapping("/login")
    public User login(@RequestBody AuthRequest request) {
        return authService.login(request.userName(), request.password());
    }

    public record AuthRequest(String userName, String password) {
    }
}

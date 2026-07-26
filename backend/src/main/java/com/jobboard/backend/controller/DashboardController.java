package com.jobboard.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobboard.backend.service.DashboardService;
import com.jobboard.backend.service.DashboardService.DashboardSummary;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("")
    public DashboardSummary getSummary(HttpServletRequest request) {
        String ownerUsername = (String) request.getAttribute("authenticatedUsername");
        return dashboardService.getSummary(ownerUsername);
    }
}

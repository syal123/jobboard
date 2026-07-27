package com.jobboard.backend.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;

import com.jobboard.backend.util.JwtUtil;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter implements Filter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

/* this method runs on every request before it reaches any controller. It acts as a security check: it looks
for valid login token in the request, and blocks anything without one (except register/login, since you can't
have a token yet if you haven't logged in). This is what keeps one user from being able to see or modify another
user's data. */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        if (httpRequest.getMethod().equals("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }

        String path = httpRequest.getRequestURI();

        if (path.equals("/api/auth/register") || path.equals("/api/auth/login") || path.startsWith("/actuator/")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendUnauthorized(httpResponse);
            return;
        }

        String token = authHeader.substring("Bearer ".length());

        if (!jwtUtil.isTokenValid(token)) {
            sendUnauthorized(httpResponse);
            return;
        }

        String username = jwtUtil.extractUserName(token);
        httpRequest.setAttribute("authenticatedUsername", username);

        chain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Unauthorized\"}");
    }
}

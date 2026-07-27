/* Web browser have a built-in security rule: a website running at one address isn't normally allowed to fecth 
data from different address unless the second address specifically says "I trust requests coming from other 
address." This rule exists to stop malicious websites from secretly reading data from other sites you are 
logged into. 
This file is where the backend gives that permission. Without this file, the frontend and backend couldn't
talk to each other. */

package com.jobboard.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // This is set from an environment variable instead of being hardcoded here
    // That way the same code works locally (where it defaults to localhost:5173) and in production
    // (where vercel sets it to the real frontend URL) - I never have touch this file to switch between the two
    @Value("${cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}

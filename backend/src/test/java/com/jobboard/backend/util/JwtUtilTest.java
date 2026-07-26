package com.jobboard.backend.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "TestSecretKeyForUnitTestingPurposesOnly123456789");
    }

    @Test
    void extractUserName_returnsSameUserNamePassedToGenerateToken() {
        String token = jwtUtil.generateToken("testuser");

        String extractedUserName = jwtUtil.extractUserName(token);

        assertEquals("testuser", extractedUserName);
    }

    @Test
    void isTokenValid_returnsTrueForFreshlyGeneratedToken() {
        String token = jwtUtil.generateToken("testuser");

        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void isTokenValid_returnsFalseForGarbageToken() {
        assertFalse(jwtUtil.isTokenValid("not.a.valid.token"));
    }
}

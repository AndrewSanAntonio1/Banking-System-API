package com.ironclad.bankingsystemapi.api.auth.login.services;

import com.ironclad.bankingsystemapi.api.auth.login.dto.LoginRequest;
import com.ironclad.bankingsystemapi.api.auth.login.dto.LoginResponse;
import com.ironclad.bankingsystemapi.api.auth.login.repository.LoginRepository;
import com.ironclad.bankingsystemapi.api.auth.register.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServices {
    private final LoginRepository loginRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        // Normalize email for lookup (same as registration)
        String normalizedEmail = request.email().toLowerCase().trim();

        // Find user by email
        User user = loginRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("Login failed - user not found: {}", normalizedEmail);
                    return new BadCredentialsException("Invalid email or password");
                });

        // Verify password
        if (!passwordEncoder.matches(request.password(), user.getHashedPassword())) {
            log.warn("Login failed - invalid password for user: {}", normalizedEmail);
            throw new BadCredentialsException("Invalid email or password");
        }

        log.info("Login successful for user ID: {} with email: {}", user.getId(), user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                "Login successful"
        );
    }
}

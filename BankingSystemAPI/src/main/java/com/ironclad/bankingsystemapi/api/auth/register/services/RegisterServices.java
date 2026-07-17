package com.ironclad.bankingsystemapi.api.auth.register.services;

import com.ironclad.bankingsystemapi.api.auth.register.dto.RegisterRequest;
import com.ironclad.bankingsystemapi.api.auth.register.dto.RegisterResponse;
import com.ironclad.bankingsystemapi.api.auth.register.entity.User;
import com.ironclad.bankingsystemapi.api.auth.register.repository.RegisterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegisterServices {
    private final RegisterRepository registerRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.email());

        // Normalize email for consistency
        String normalizedEmail = request.email().toLowerCase().trim();

        // Validate password match
        if (!request.password().equals(request.confirmPassword())) {
            log.warn("Password mismatch for email: {}", normalizedEmail);
            throw new IllegalArgumentException("Passwords don't match");
        }

        // Check if email already exists (with normalized email)
        if (registerRepository.existsByEmail(normalizedEmail)) {
            log.warn("Email already registered: {}", normalizedEmail);
            throw new IllegalArgumentException("Email already registered");
        }

        // Create and save user
        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(request.phoneNumber().trim());
        user.setHashedPassword(passwordEncoder.encode(request.password()));
        
        User savedUser = registerRepository.save(user);

        log.info("User registered successfully with ID: {} and email: {}", savedUser.getId(), savedUser.getEmail());

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                "User registered successfully"
        );
    }
}

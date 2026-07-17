package com.ironclad.bankingsystemapi.api.auth.register.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.aspectj.bridge.Message;

public record RegisterRequest(
        @NotBlank(message = "Fullname is required!")
        String fullName,

        @Email(message = "Invalid email")
        @NotBlank(message = "Email is required!")
        String email,

        @NotBlank(message = "Phone number is required!")
        @Pattern(
                regexp = "^09\\d{9}$",
                message = "Phone number must be in the format 09XXXXXXXXX"
        )
        String phoneNumber,

        @NotBlank(message = "Password is required!")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Confirm password is required!")
        @Size(min = 8, message = "Confirm password must be at least 8 characters")
        String confirmPassword
) {}

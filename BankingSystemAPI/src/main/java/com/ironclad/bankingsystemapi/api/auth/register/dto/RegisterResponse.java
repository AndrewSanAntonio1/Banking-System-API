package com.ironclad.bankingsystemapi.api.auth.register.dto;

public record RegisterResponse(
        long id,
        String fullName,
        String email,
        String message
) {
}

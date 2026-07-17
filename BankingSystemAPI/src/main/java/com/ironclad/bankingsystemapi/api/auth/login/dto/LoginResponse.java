package com.ironclad.bankingsystemapi.api.auth.login.dto;

public record LoginResponse(
        Long userId,
        String fullName,
        String email,
        String message
) {
}

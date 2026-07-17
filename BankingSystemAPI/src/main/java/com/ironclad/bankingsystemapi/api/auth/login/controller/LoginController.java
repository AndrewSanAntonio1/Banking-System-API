package com.ironclad.bankingsystemapi.api.auth.login.controller;

import com.ironclad.bankingsystemapi.api.auth.login.dto.LoginRequest;
import com.ironclad.bankingsystemapi.api.auth.login.dto.LoginResponse;
import com.ironclad.bankingsystemapi.api.auth.login.services.LoginServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    private final LoginServices loginServices;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(loginServices.login(request));
    }
}

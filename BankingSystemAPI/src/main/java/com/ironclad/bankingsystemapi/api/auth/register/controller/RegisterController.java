package com.ironclad.bankingsystemapi.api.auth.register.controller;

import com.ironclad.bankingsystemapi.api.auth.register.dto.RegisterRequest;
import com.ironclad.bankingsystemapi.api.auth.register.dto.RegisterResponse;
import com.ironclad.bankingsystemapi.api.auth.register.services.RegisterServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class RegisterController {
    private final RegisterServices registerServices;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registerServices.register(request));
    }

}

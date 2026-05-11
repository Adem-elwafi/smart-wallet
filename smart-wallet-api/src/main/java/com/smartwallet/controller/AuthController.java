package com.smartwallet.controller;

import com.smartwallet.dto.AuthenticationResponse;
import com.smartwallet.dto.LoginRequest;
import com.smartwallet.dto.RegisterRequest;
import com.smartwallet.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth"})
@RequiredArgsConstructor // Génère le constructeur pour l'injection des champs 'final'
public class AuthController {

    // 1. Assurez-vous que le champ est 'final' pour l'injection via RequiredArgsConstructor
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        // 2. Utilisez 'authService' (le nom déclaré plus haut) et non 'service'
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping({"/login", "/authenticate"})
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody LoginRequest request
    ) {
        // 3. Utilisez également 'authService' ici
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
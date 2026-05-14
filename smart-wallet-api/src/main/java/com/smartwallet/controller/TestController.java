package com.smartwallet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/profile")
    public ResponseEntity<String> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok("Utilisateur connecté : " + userDetails.getUsername());
    }
}
package com.smartwallet.controller;

import com.smartwallet.dto.WalletResponse;
import com.smartwallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/me")
    public ResponseEntity<WalletResponse> getMyWallet(Authentication authentication) {
        // authentication.getName() retourne l'email (username) défini dans le JwtFilter
        return ResponseEntity.ok(walletService.getWalletByUsername(authentication.getName()));
    }
}

package com.smartwallet.service;

import com.smartwallet.dto.WalletResponse;
import com.smartwallet.model.User;
import com.smartwallet.model.Wallet;
import com.smartwallet.repository.UserRepository;
import com.smartwallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private static final String PREFIX = "SW-";
    private static final SecureRandom random = new SecureRandom();
    private final UserRepository userRepository; // Ajouté pour la recherche par email

    public Wallet createWalletForUser(User user) {
        Wallet wallet = Wallet.builder()
                .accountNumber(generateUniqueAccountNumber())
                .balance(BigDecimal.ZERO)
                .currency("TND")
                .user(user)
                .build();

        return walletRepository.save(wallet);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            StringBuilder sb = new StringBuilder(PREFIX);
            for (int i = 0; i < 10; i++) {
                sb.append(random.nextInt(10));
            }
            accountNumber = sb.toString();
        } while (walletRepository.findByAccountNumber(accountNumber).isPresent());

        return accountNumber;
    }

    public WalletResponse getWalletByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Wallet not found for this user"));

        return new WalletResponse(
                wallet.getAccountNumber(),
                wallet.getBalance(),
                wallet.getCurrency()
        );
    }

}
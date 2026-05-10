package com.smartwallet.service;

import com.smartwallet.model.User;
import com.smartwallet.model.Wallet;
import com.smartwallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private static final String PREFIX = "SW-";
    private static final SecureRandom random = new SecureRandom();

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
}
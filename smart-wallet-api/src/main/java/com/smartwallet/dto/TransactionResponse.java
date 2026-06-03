package com.smartwallet.dto;

import com.smartwallet.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        BigDecimal amount,
        LocalDateTime timestamp,
        String type,
        String category,
        String description,
        String senderAccountNumber,
        String recipientAccountNumber
) {
    public static TransactionResponse fromEntity(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getTimestamp(),
                transaction.getType().toString(),
                transaction.getCategory() != null ? transaction.getCategory().toString() : null,
                transaction.getDescription(),
                transaction.getSenderWallet() != null ? transaction.getSenderWallet().getAccountNumber() : null,
                transaction.getReceiverWallet() != null ? transaction.getReceiverWallet().getAccountNumber() : null
        );
    }
}

package com.smartwallet.dto;

import com.smartwallet.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        BigDecimal amount,
        LocalDateTime timestamp,
        String type,
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
                transaction.getDescription(),
                transaction.getSenderWallet().getAccountNumber(),
                transaction.getReceiverWallet().getAccountNumber()
        );
    }
}

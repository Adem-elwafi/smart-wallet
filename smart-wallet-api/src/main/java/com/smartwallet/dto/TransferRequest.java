package com.smartwallet.dto;

import java.math.BigDecimal;

public record TransferRequest(
        String recipientAccountNumber,
        BigDecimal amount,
        String description
) {}

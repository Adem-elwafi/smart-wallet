package com.smartwallet.dto;

import java.math.BigDecimal;

public record DepositRequest(
        BigDecimal amount,
        String description
) {}
package com.smartwallet.dto;

import com.smartwallet.model.TransactionCategory;

import java.math.BigDecimal;

public record ExpenseRequest(
        BigDecimal amount,
        TransactionCategory category,
        String description
) {}
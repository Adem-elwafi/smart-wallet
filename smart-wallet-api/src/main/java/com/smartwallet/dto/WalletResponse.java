package com.smartwallet.dto;

import java.math.BigDecimal;

public record WalletResponse(
        String accountNumber,
        BigDecimal balance,
        String currency
) {}
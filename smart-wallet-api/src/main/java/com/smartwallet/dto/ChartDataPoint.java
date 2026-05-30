package com.smartwallet.dto;

import java.math.BigDecimal;

public record ChartDataPoint(
        String label,
        BigDecimal amount
) {}
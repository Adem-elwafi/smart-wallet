package com.smartwallet.dto;

import java.math.BigDecimal;

public record DashboardStatsResponse(
        BigDecimal totalRevenues,
        BigDecimal totalExpenses,
        BigDecimal totalSavings,
        double revenuesTrend,
        double expensesTrend,
        double savingsTrend
) {}
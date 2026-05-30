package com.smartwallet.controller;

import com.smartwallet.dto.ChartDataPoint;
import com.smartwallet.dto.DashboardStatsResponse;
import com.smartwallet.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(Authentication authentication) {
        return ResponseEntity.ok(analyticsService.getDashboardStats(authentication.getName()));
    }

    @GetMapping("/chart")
    public ResponseEntity<List<ChartDataPoint>> getChartData(Authentication authentication) {
        return ResponseEntity.ok(analyticsService.getChartData(authentication.getName()));
    }
}
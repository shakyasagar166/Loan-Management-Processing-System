package com.loan.controller;

import com.loan.dto.EMIResponseDTO;
import com.loan.service.EMIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emi")
public class EMIController {

    private final EMIService emiService;

    public EMIController(EMIService emiService) {
        this.emiService = emiService;
    }

    @GetMapping("/schedule/{loanAccountId}")
    public ResponseEntity<List<EMIResponseDTO>> getSchedule(@PathVariable Long loanAccountId) {
        return ResponseEntity.ok(emiService.getScheduleByAccount(loanAccountId));
    }

    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateEmi(@RequestParam BigDecimal principal,
                                                           @RequestParam BigDecimal annualRate,
                                                           @RequestParam int tenureMonths) {
        BigDecimal emi = emiService.calculateMonthlyEMI(principal, annualRate, tenureMonths);
        return ResponseEntity.ok(Map.of(
                "principal", principal,
                "annualRate", annualRate,
                "tenureMonths", tenureMonths,
                "monthlyEmi", emi
        ));
    }
}

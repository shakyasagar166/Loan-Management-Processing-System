package com.loan.controller;

import com.loan.dto.LoanEligibilityDTO;
import com.loan.service.LoanEligibilityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eligibility")
public class LoanEligibilityController {

    private final LoanEligibilityService eligibilityService;

    public LoanEligibilityController(LoanEligibilityService eligibilityService) {
        this.eligibilityService = eligibilityService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<LoanEligibilityDTO> calculateEligibility(@Valid @RequestBody LoanEligibilityDTO request) {
        return ResponseEntity.ok(eligibilityService.checkEligibility(request));
    }
}

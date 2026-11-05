package com.loan.service;

import com.loan.dto.LoanEligibilityDTO;

public interface LoanEligibilityService {
    LoanEligibilityDTO checkEligibility(LoanEligibilityDTO request);
}

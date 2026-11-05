package com.loan.service.impl;

import com.loan.dto.LoanEligibilityDTO;
import com.loan.entity.LoanType;
import com.loan.repository.LoanTypeRepository;
import com.loan.service.EMIService;
import com.loan.service.LoanEligibilityService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class LoanEligibilityServiceImpl implements LoanEligibilityService {

    private final LoanTypeRepository loanTypeRepository;
    private final EMIService emiService;

    public LoanEligibilityServiceImpl(LoanTypeRepository loanTypeRepository, EMIService emiService) {
        this.loanTypeRepository = loanTypeRepository;
        this.emiService = emiService;
    }

    @Override
    public LoanEligibilityDTO checkEligibility(LoanEligibilityDTO request) {
        LoanType loanType = loanTypeRepository.findById(request.getLoanTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Loan category not found"));

        BigDecimal income = request.getMonthlyIncome();
        BigDecimal existingEmis = request.getExistingEmiObligations();
        int tenure = request.getTenureMonths();
        BigDecimal rate = loanType.getInterestRate();
        int creditScore = request.getCreditScore() != null ? request.getCreditScore() : 750;

        // Banking FOIR: Max 50% of income can be committed to EMI payments
        BigDecimal maxAllowableTotalEmi = income.multiply(BigDecimal.valueOf(0.50));
        BigDecimal disposableEmiCapacity = maxAllowableTotalEmi.subtract(existingEmis);

        BigDecimal estimatedEmi = emiService.calculateMonthlyEMI(request.getRequestedAmount(), rate, tenure);
        request.setEstimatedEmi(estimatedEmi);

        // Calculate max principal capacity based on disposable EMI
        BigDecimal maxLoanAmount;
        if (disposableEmiCapacity.compareTo(BigDecimal.ZERO) <= 0) {
            maxLoanAmount = BigDecimal.ZERO;
            request.setEligible(false);
            request.setRemarks("Existing EMI commitments exceed allowable 50% income threshold (FOIR).");
        } else {
            // Reverse EMI to Principal calculation:
            // P = EMI * ((1 + r)^n - 1) / (r * (1 + r)^n)
            double r = rate.doubleValue() / (12.0 * 100.0);
            double numerator = Math.pow(1 + r, tenure) - 1;
            double denominator = r * Math.pow(1 + r, tenure);
            double maxP = disposableEmiCapacity.doubleValue() * (numerator / denominator);
            maxLoanAmount = BigDecimal.valueOf(Math.min(maxP, loanType.getMaxAmount().doubleValue())).setScale(2, RoundingMode.HALF_UP);

            boolean isEligible = request.getRequestedAmount().compareTo(maxLoanAmount) <= 0 && creditScore >= loanType.getMinCreditScore();
            request.setEligible(isEligible);

            if (isEligible) {
                request.setRemarks("Congratulations! You satisfy credit rating and income capability criteria.");
            } else if (creditScore < loanType.getMinCreditScore()) {
                request.setRemarks("Credit score of " + creditScore + " is below minimum required " + loanType.getMinCreditScore());
            } else {
                request.setRemarks("Requested amount exceeds maximum borrowing limit of ₹" + maxLoanAmount);
            }
        }

        request.setMaxEligibleAmount(maxLoanAmount);

        // FOIR Ratio
        BigDecimal totalEmiWithNew = existingEmis.add(estimatedEmi);
        BigDecimal foir = income.compareTo(BigDecimal.ZERO) > 0
                ? totalEmiWithNew.divide(income, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.valueOf(100.00);
        request.setFixedObligationToIncomeRatio(foir);

        // Risk Category
        if (creditScore >= 750 && foir.compareTo(BigDecimal.valueOf(40)) <= 0) {
            request.setRiskCategory("Low Risk (Prime)");
        } else if (creditScore >= 680 && foir.compareTo(BigDecimal.valueOf(50)) <= 0) {
            request.setRiskCategory("Moderate Risk (Standard)");
        } else {
            request.setRiskCategory("High Risk (Subprime)");
        }

        return request;
    }
}

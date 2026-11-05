package com.loan.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class LoanEligibilityDTO {

    @NotNull(message = "Monthly income is required")
    private BigDecimal monthlyIncome;

    private BigDecimal existingEmiObligations = BigDecimal.ZERO;

    @NotNull(message = "Requested amount is required")
    private BigDecimal requestedAmount;

    @NotNull(message = "Tenure in months is required")
    private Integer tenureMonths;

    @NotNull(message = "Loan type ID is required")
    private Long loanTypeId;

    private Integer creditScore = 750;

    // Calculation Results
    private Boolean eligible;
    private BigDecimal maxEligibleAmount;
    private BigDecimal estimatedEmi;
    private BigDecimal fixedObligationToIncomeRatio; // FOIR percentage (e.g., 50%)
    private String riskCategory; // Low, Medium, High
    private String remarks;

    public LoanEligibilityDTO() {}

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public BigDecimal getExistingEmiObligations() {
        return existingEmiObligations != null ? existingEmiObligations : BigDecimal.ZERO;
    }

    public void setExistingEmiObligations(BigDecimal existingEmiObligations) {
        this.existingEmiObligations = existingEmiObligations;
    }

    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }

    public void setRequestedAmount(BigDecimal requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public Long getLoanTypeId() {
        return loanTypeId;
    }

    public void setLoanTypeId(Long loanTypeId) {
        this.loanTypeId = loanTypeId;
    }

    public Integer getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(Integer creditScore) {
        this.creditScore = creditScore;
    }

    public Boolean getEligible() {
        return eligible;
    }

    public void setEligible(Boolean eligible) {
        this.eligible = eligible;
    }

    public BigDecimal getMaxEligibleAmount() {
        return maxEligibleAmount;
    }

    public void setMaxEligibleAmount(BigDecimal maxEligibleAmount) {
        this.maxEligibleAmount = maxEligibleAmount;
    }

    public BigDecimal getEstimatedEmi() {
        return estimatedEmi;
    }

    public void setEstimatedEmi(BigDecimal estimatedEmi) {
        this.estimatedEmi = estimatedEmi;
    }

    public BigDecimal getFixedObligationToIncomeRatio() {
        return fixedObligationToIncomeRatio;
    }

    public void setFixedObligationToIncomeRatio(BigDecimal fixedObligationToIncomeRatio) {
        this.fixedObligationToIncomeRatio = fixedObligationToIncomeRatio;
    }

    public String getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(String riskCategory) {
        this.riskCategory = riskCategory;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

package com.loan.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PaymentRequestDTO {

    @NotNull(message = "Loan account ID is required")
    private Long loanAccountId;

    private Long emiScheduleId;

    @NotNull(message = "Payment amount is required")
    private BigDecimal amount;

    private String paymentMethod = "UPI"; // UPI, NET_BANKING, DEBIT_CARD

    private String remarks;

    public PaymentRequestDTO() {}

    public Long getLoanAccountId() {
        return loanAccountId;
    }

    public void setLoanAccountId(Long loanAccountId) {
        this.loanAccountId = loanAccountId;
    }

    public Long getEmiScheduleId() {
        return emiScheduleId;
    }

    public void setEmiScheduleId(Long emiScheduleId) {
        this.emiScheduleId = emiScheduleId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}

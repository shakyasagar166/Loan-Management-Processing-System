package com.loan.service;

import com.loan.dto.PaymentRequestDTO;
import com.loan.entity.LoanPayment;

import java.util.List;

public interface PaymentService {
    LoanPayment processRepayment(PaymentRequestDTO request, String username);
    List<LoanPayment> getPaymentsByAccount(Long loanAccountId);
    List<LoanPayment> getPaymentsByBorrower(Long borrowerId);
    List<LoanPayment> getAllPayments();
}

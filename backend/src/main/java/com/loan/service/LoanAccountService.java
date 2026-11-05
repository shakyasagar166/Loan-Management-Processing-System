package com.loan.service;

import com.loan.dto.LoanAccountDTO;

import java.util.List;

public interface LoanAccountService {
    LoanAccountDTO disburseLoan(Long applicationId);
    LoanAccountDTO getAccountById(Long id);
    LoanAccountDTO getAccountByNumber(String accountNumber);
    List<LoanAccountDTO> getAccountsByBorrower(Long borrowerId);
    List<LoanAccountDTO> getAllAccounts();
}

package com.loan.service;

import com.loan.dto.LoanApplicationDTO;
import com.loan.enums.LoanStatus;

import java.util.List;

public interface LoanApplicationService {
    List<LoanApplicationDTO> getAllApplications();
    List<LoanApplicationDTO> getApplicationsByApplicant(Long applicantId);
    List<LoanApplicationDTO> getApplicationsByStatus(LoanStatus status);
    LoanApplicationDTO getApplicationById(Long id);
    LoanApplicationDTO getApplicationByNumber(String applicationNumber);
    LoanApplicationDTO submitApplication(LoanApplicationDTO dto, String username);
    LoanApplicationDTO updateApplicationStatus(Long id, LoanStatus status, String rejectionReason);
}

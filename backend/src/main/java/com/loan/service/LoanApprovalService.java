package com.loan.service;

import com.loan.dto.LoanApprovalDTO;

import java.util.List;

public interface LoanApprovalService {
    LoanApprovalDTO processApproval(LoanApprovalDTO approvalDTO, String reviewerUsername);
    LoanApprovalDTO getApprovalByApplication(Long applicationId);
    List<LoanApprovalDTO> getAllApprovals();
}

package com.loan.service.impl;

import com.loan.dto.LoanApprovalDTO;
import com.loan.entity.LoanApplication;
import com.loan.entity.LoanApproval;
import com.loan.entity.User;
import com.loan.enums.ApprovalStatus;
import com.loan.enums.LoanStatus;
import com.loan.exception.LoanNotFoundException;
import com.loan.repository.LoanApplicationRepository;
import com.loan.repository.LoanApprovalRepository;
import com.loan.repository.UserRepository;
import com.loan.service.LoanApprovalService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanApprovalServiceImpl implements LoanApprovalService {

    private final LoanApprovalRepository approvalRepository;
    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public LoanApprovalServiceImpl(LoanApprovalRepository approvalRepository,
                                   LoanApplicationRepository applicationRepository,
                                   UserRepository userRepository) {
        this.approvalRepository = approvalRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public LoanApprovalDTO processApproval(LoanApprovalDTO dto, String reviewerUsername) {
        LoanApplication application = applicationRepository.findById(dto.getLoanApplicationId())
                .orElseThrow(() -> new LoanNotFoundException("Application not found: " + dto.getLoanApplicationId()));

        User reviewer = userRepository.findByUsername(reviewerUsername)
                .orElseThrow(() -> new RuntimeException("Reviewer user not found: " + reviewerUsername));

        LoanApproval approval = approvalRepository.findByLoanApplicationId(application.getId())
                .orElse(new LoanApproval());

        approval.setLoanApplication(application);
        approval.setReviewedBy(reviewer);
        approval.setApprovalStatus(dto.getApprovalStatus());
        approval.setApprovedAmount(dto.getApprovedAmount() != null ? dto.getApprovedAmount() : application.getRequestedAmount());
        approval.setApprovedInterestRate(dto.getApprovedInterestRate() != null ? dto.getApprovedInterestRate() : application.getInterestRate());
        approval.setApprovedTenureMonths(dto.getApprovedTenureMonths() != null ? dto.getApprovedTenureMonths() : application.getTenureMonths());
        approval.setDecisionNotes(dto.getDecisionNotes());
        approval.setDecisionDate(LocalDateTime.now());

        if (dto.getApprovalStatus() == ApprovalStatus.APPROVED) {
            application.setStatus(LoanStatus.APPROVED);
        } else if (dto.getApprovalStatus() == ApprovalStatus.REJECTED) {
            application.setStatus(LoanStatus.REJECTED);
            application.setRejectionReason(dto.getDecisionNotes());
        } else if (dto.getApprovalStatus() == ApprovalStatus.MORE_INFO_REQUIRED) {
            application.setStatus(LoanStatus.UNDER_REVIEW);
        }

        applicationRepository.save(application);
        LoanApproval saved = approvalRepository.save(approval);
        return mapToDTO(saved);
    }

    @Override
    public LoanApprovalDTO getApprovalByApplication(Long applicationId) {
        LoanApproval approval = approvalRepository.findByLoanApplicationId(applicationId)
                .orElseThrow(() -> new LoanNotFoundException("Approval record not found for application: " + applicationId));
        return mapToDTO(approval);
    }

    @Override
    public List<LoanApprovalDTO> getAllApprovals() {
        return approvalRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private LoanApprovalDTO mapToDTO(LoanApproval approval) {
        LoanApprovalDTO dto = new LoanApprovalDTO();
        dto.setId(approval.getId());
        if (approval.getLoanApplication() != null) {
            dto.setLoanApplicationId(approval.getLoanApplication().getId());
            dto.setApplicationNumber(approval.getLoanApplication().getApplicationNumber());
            if (approval.getLoanApplication().getApplicant() != null) {
                dto.setApplicantName(approval.getLoanApplication().getApplicant().getFirstName() + " " +
                        approval.getLoanApplication().getApplicant().getLastName());
            }
        }
        if (approval.getReviewedBy() != null) {
            dto.setReviewedBy(approval.getReviewedBy().getFirstName() + " " + approval.getReviewedBy().getLastName());
        }
        dto.setApprovalStatus(approval.getApprovalStatus());
        dto.setApprovedAmount(approval.getApprovedAmount());
        dto.setApprovedInterestRate(approval.getApprovedInterestRate());
        dto.setApprovedTenureMonths(approval.getApprovedTenureMonths());
        dto.setDecisionNotes(approval.getDecisionNotes());
        dto.setDecisionDate(approval.getDecisionDate());
        return dto;
    }
}

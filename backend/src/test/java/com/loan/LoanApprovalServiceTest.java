package com.loan;

import com.loan.dto.LoanApprovalDTO;
import com.loan.entity.LoanApplication;
import com.loan.entity.LoanApproval;
import com.loan.entity.User;
import com.loan.enums.ApprovalStatus;
import com.loan.enums.LoanStatus;
import com.loan.enums.UserRole;
import com.loan.repository.LoanApplicationRepository;
import com.loan.repository.LoanApprovalRepository;
import com.loan.repository.UserRepository;
import com.loan.service.impl.LoanApprovalServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LoanApprovalServiceTest {

    @Mock
    private LoanApprovalRepository approvalRepository;

    @Mock
    private LoanApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LoanApprovalServiceImpl approvalService;

    private User sampleOfficer;
    private LoanApplication sampleApp;

    @BeforeEach
    void setUp() {
        sampleOfficer = new User("underwriter", "password", "under@example.com", "Vikram", "Mehta", UserRole.ROLE_UNDERWRITER);
        sampleOfficer.setId(3L);

        sampleApp = new LoanApplication("APP-001", null, null, BigDecimal.valueOf(500000), 36, BigDecimal.valueOf(11.50), BigDecimal.valueOf(60000), "Personal");
        sampleApp.setId(10L);
    }

    @Test
    void testProcessApprovalApproved() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(sampleApp));
        when(userRepository.findByUsername("underwriter")).thenReturn(Optional.of(sampleOfficer));
        when(approvalRepository.findByLoanApplicationId(10L)).thenReturn(Optional.empty());
        when(approvalRepository.save(any(LoanApproval.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LoanApprovalDTO request = new LoanApprovalDTO();
        request.setLoanApplicationId(10L);
        request.setApprovalStatus(ApprovalStatus.APPROVED);
        request.setApprovedAmount(BigDecimal.valueOf(500000));
        request.setApprovedInterestRate(BigDecimal.valueOf(11.50));
        request.setApprovedTenureMonths(36);
        request.setDecisionNotes("Approved with standard terms");

        LoanApprovalDTO result = approvalService.processApproval(request, "underwriter");
        assertNotNull(result);
        assertEquals(ApprovalStatus.APPROVED, result.getApprovalStatus());
        assertEquals(LoanStatus.APPROVED, sampleApp.getStatus());
    }
}

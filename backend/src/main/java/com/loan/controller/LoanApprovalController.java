package com.loan.controller;

import com.loan.dto.LoanApprovalDTO;
import com.loan.service.LoanApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@PreAuthorize("hasRole('ADMIN') or hasRole('LOAN_OFFICER') or hasRole('UNDERWRITER')")
public class LoanApprovalController {

    private final LoanApprovalService approvalService;

    public LoanApprovalController(LoanApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping
    public ResponseEntity<List<LoanApprovalDTO>> getAllApprovals() {
        return ResponseEntity.ok(approvalService.getAllApprovals());
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<LoanApprovalDTO> getApprovalByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(approvalService.getApprovalByApplication(applicationId));
    }

    @PostMapping("/decision")
    public ResponseEntity<LoanApprovalDTO> processApproval(Authentication authentication,
                                                           @Valid @RequestBody LoanApprovalDTO dto) {
        return ResponseEntity.ok(approvalService.processApproval(dto, authentication.getName()));
    }
}

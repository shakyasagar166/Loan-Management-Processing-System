package com.loan.controller;

import com.loan.dto.LoanApplicationDTO;
import com.loan.entity.User;
import com.loan.enums.LoanStatus;
import com.loan.service.LoanApplicationService;
import com.loan.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class LoanApplicationController {

    private final LoanApplicationService applicationService;
    private final UserService userService;

    public LoanApplicationController(LoanApplicationService applicationService, UserService userService) {
        this.applicationService = applicationService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<LoanApplicationDTO>> getApplications(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        if ("ROLE_CUSTOMER".equals(user.getRole().name())) {
            return ResponseEntity.ok(applicationService.getApplicationsByApplicant(user.getId()));
        } else {
            return ResponseEntity.ok(applicationService.getAllApplications());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<LoanApplicationDTO>> getMyApplications(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(applicationService.getApplicationsByApplicant(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplicationDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/number/{applicationNumber}")
    public ResponseEntity<LoanApplicationDTO> getApplicationByNumber(@PathVariable String applicationNumber) {
        return ResponseEntity.ok(applicationService.getApplicationByNumber(applicationNumber));
    }

    @PostMapping
    public ResponseEntity<LoanApplicationDTO> submitApplication(Authentication authentication,
                                                                @Valid @RequestBody LoanApplicationDTO dto) {
        LoanApplicationDTO created = applicationService.submitApplication(dto, authentication.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LOAN_OFFICER') or hasRole('UNDERWRITER')")
    public ResponseEntity<LoanApplicationDTO> updateStatus(@PathVariable Long id,
                                                           @RequestParam LoanStatus status,
                                                           @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, reason));
    }
}

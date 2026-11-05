package com.loan.controller;

import com.loan.dto.LoanAccountDTO;
import com.loan.entity.User;
import com.loan.service.LoanAccountService;
import com.loan.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class LoanAccountController {

    private final LoanAccountService accountService;
    private final UserService userService;

    public LoanAccountController(LoanAccountService accountService, UserService userService) {
        this.accountService = accountService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<LoanAccountDTO>> getAccounts(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        if ("ROLE_CUSTOMER".equals(user.getRole().name())) {
            return ResponseEntity.ok(accountService.getAccountsByBorrower(user.getId()));
        } else {
            return ResponseEntity.ok(accountService.getAllAccounts());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<LoanAccountDTO>> getMyAccounts(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(accountService.getAccountsByBorrower(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanAccountDTO> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<LoanAccountDTO> getAccountByNumber(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getAccountByNumber(accountNumber));
    }

    @PostMapping("/disburse/{applicationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LOAN_OFFICER')")
    public ResponseEntity<LoanAccountDTO> disburseLoan(@PathVariable Long applicationId) {
        return ResponseEntity.ok(accountService.disburseLoan(applicationId));
    }
}

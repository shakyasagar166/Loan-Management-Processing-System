package com.loan.controller;

import com.loan.dto.PaymentRequestDTO;
import com.loan.entity.LoanPayment;
import com.loan.entity.User;
import com.loan.service.PaymentService;
import com.loan.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService, UserService userService) {
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<LoanPayment>> getPayments(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        if ("ROLE_CUSTOMER".equals(user.getRole().name())) {
            return ResponseEntity.ok(paymentService.getPaymentsByBorrower(user.getId()));
        } else {
            return ResponseEntity.ok(paymentService.getAllPayments());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<LoanPayment>> getMyPayments(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(paymentService.getPaymentsByBorrower(user.getId()));
    }

    @GetMapping("/account/{loanAccountId}")
    public ResponseEntity<List<LoanPayment>> getPaymentsByAccount(@PathVariable Long loanAccountId) {
        return ResponseEntity.ok(paymentService.getPaymentsByAccount(loanAccountId));
    }

    @PostMapping("/repay")
    public ResponseEntity<LoanPayment> processRepayment(Authentication authentication,
                                                        @Valid @RequestBody PaymentRequestDTO request) {
        return ResponseEntity.ok(paymentService.processRepayment(request, authentication.getName()));
    }
}

package com.loan.controller;

import com.loan.repository.EMIScheduleRepository;
import com.loan.repository.LoanAccountRepository;
import com.loan.repository.LoanApplicationRepository;
import com.loan.repository.LoanPaymentRepository;
import com.loan.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN') or hasRole('LOAN_OFFICER')")
public class AdminController {

    private final LoanApplicationRepository applicationRepository;
    private final LoanAccountRepository accountRepository;
    private final LoanPaymentRepository paymentRepository;
    private final EMIScheduleRepository emiScheduleRepository;
    private final UserRepository userRepository;

    public AdminController(LoanApplicationRepository applicationRepository,
                           LoanAccountRepository accountRepository,
                           LoanPaymentRepository paymentRepository,
                           EMIScheduleRepository emiScheduleRepository,
                           UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.accountRepository = accountRepository;
        this.paymentRepository = paymentRepository;
        this.emiScheduleRepository = emiScheduleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getAdminMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        Long totalUsers = userRepository.count();
        Long totalApps = applicationRepository.count();
        Long pendingApps = applicationRepository.countPendingApplications();
        Long approvedApps = applicationRepository.countApprovedApplications();
        Double disbursed = accountRepository.calculateTotalDisbursedAmount();
        Double outstanding = accountRepository.calculateTotalOutstandingBalance();
        Double collections = paymentRepository.calculateTotalCollections();
        int overdueCount = emiScheduleRepository.findOverdueEMIs(LocalDate.now()).size();

        metrics.put("totalUsers", totalUsers);
        metrics.put("totalApplications", totalApps);
        metrics.put("pendingApplications", pendingApps);
        metrics.put("approvedApplications", approvedApps);
        metrics.put("totalDisbursedAmount", disbursed != null ? disbursed : 0.0);
        metrics.put("totalOutstandingBalance", outstanding != null ? outstanding : 0.0);
        metrics.put("totalCollections", collections != null ? collections : 0.0);
        metrics.put("overdueInstallmentsCount", overdueCount);

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("database", "CONNECTED");
        health.put("underwritingEngine", "ONLINE");
        health.put("schedulersActive", true);
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(health);
    }
}

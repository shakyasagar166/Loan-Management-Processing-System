package com.loan.service.impl;

import com.loan.dto.PaymentRequestDTO;
import com.loan.entity.EMISchedule;
import com.loan.entity.LoanAccount;
import com.loan.entity.LoanPayment;
import com.loan.entity.User;
import com.loan.enums.EMIStatus;
import com.loan.enums.LoanStatus;
import com.loan.enums.PaymentStatus;
import com.loan.exception.LoanNotFoundException;
import com.loan.exception.PaymentFailedException;
import com.loan.repository.EMIScheduleRepository;
import com.loan.repository.LoanAccountRepository;
import com.loan.repository.LoanPaymentRepository;
import com.loan.repository.UserRepository;
import com.loan.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final LoanPaymentRepository paymentRepository;
    private final LoanAccountRepository accountRepository;
    private final EMIScheduleRepository emiScheduleRepository;
    private final UserRepository userRepository;

    public PaymentServiceImpl(LoanPaymentRepository paymentRepository,
                              LoanAccountRepository accountRepository,
                              EMIScheduleRepository emiScheduleRepository,
                              UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.accountRepository = accountRepository;
        this.emiScheduleRepository = emiScheduleRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public LoanPayment processRepayment(PaymentRequestDTO request, String username) {
        LoanAccount account = accountRepository.findById(request.getLoanAccountId())
                .orElseThrow(() -> new LoanNotFoundException("Loan account not found: " + request.getLoanAccountId()));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        EMISchedule emiSchedule = null;
        if (request.getEmiScheduleId() != null) {
            emiSchedule = emiScheduleRepository.findById(request.getEmiScheduleId())
                    .orElse(null);
        } else {
            // Find earliest pending EMI
            List<EMISchedule> pendingList = emiScheduleRepository.findByLoanAccountIdAndStatus(account.getId(), EMIStatus.PENDING);
            if (!pendingList.isEmpty()) {
                emiSchedule = pendingList.get(0);
            }
        }

        BigDecimal payAmount = request.getAmount();
        if (payAmount == null || payAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new PaymentFailedException("Invalid repayment amount");
        }

        LoanPayment payment = new LoanPayment();
        payment.setPaymentReference("PAY-LN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setLoanAccount(account);
        payment.setEmiSchedule(emiSchedule);
        payment.setPayer(user);
        payment.setAmount(payAmount);
        payment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI");
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId("tx_mock_" + UUID.randomUUID().toString().substring(0, 10));
        payment.setRemarks(request.getRemarks() != null ? request.getRemarks() : "Monthly EMI Repayment");
        payment.setPaymentDate(LocalDateTime.now());

        LoanPayment savedPayment = paymentRepository.save(payment);

        // Update EMI status if linked
        if (emiSchedule != null) {
            emiSchedule.setStatus(EMIStatus.PAID);
            emiSchedule.setPaidDate(LocalDateTime.now());
            emiScheduleRepository.save(emiSchedule);

            // Deduct principal component from outstanding balance
            BigDecimal newBalance = account.getOutstandingBalance().subtract(emiSchedule.getPrincipalComponent());
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) newBalance = BigDecimal.ZERO;
            account.setOutstandingBalance(newBalance);
        } else {
            BigDecimal newBalance = account.getOutstandingBalance().subtract(payAmount);
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) newBalance = BigDecimal.ZERO;
            account.setOutstandingBalance(newBalance);
        }

        account.setTotalPaid(account.getTotalPaid().add(payAmount));

        // If balance reached zero, close account
        if (account.getOutstandingBalance().compareTo(BigDecimal.ZERO) == 0) {
            account.setStatus(LoanStatus.CLOSED);
            if (account.getLoanApplication() != null) {
                account.getLoanApplication().setStatus(LoanStatus.CLOSED);
            }
        }

        accountRepository.save(account);

        return savedPayment;
    }

    @Override
    public List<LoanPayment> getPaymentsByAccount(Long loanAccountId) {
        return paymentRepository.findByLoanAccountId(loanAccountId);
    }

    @Override
    public List<LoanPayment> getPaymentsByBorrower(Long borrowerId) {
        return paymentRepository.findByPayerId(borrowerId);
    }

    @Override
    public List<LoanPayment> getAllPayments() {
        return paymentRepository.findAll();
    }
}

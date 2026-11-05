package com.loan.service.impl;

import com.loan.dto.LoanAccountDTO;
import com.loan.entity.LoanAccount;
import com.loan.entity.LoanApplication;
import com.loan.enums.LoanStatus;
import com.loan.exception.LoanNotFoundException;
import com.loan.repository.LoanAccountRepository;
import com.loan.repository.LoanApplicationRepository;
import com.loan.service.EMIService;
import com.loan.service.LoanAccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LoanAccountServiceImpl implements LoanAccountService {

    private final LoanAccountRepository accountRepository;
    private final LoanApplicationRepository applicationRepository;
    private final EMIService emiService;

    public LoanAccountServiceImpl(LoanAccountRepository accountRepository,
                                  LoanApplicationRepository applicationRepository,
                                  EMIService emiService) {
        this.accountRepository = accountRepository;
        this.applicationRepository = applicationRepository;
        this.emiService = emiService;
    }

    @Override
    @Transactional
    public LoanAccountDTO disburseLoan(Long applicationId) {
        LoanApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new LoanNotFoundException("Application not found with id: " + applicationId));

        if (application.getStatus() != LoanStatus.APPROVED) {
            throw new IllegalArgumentException("Loan application must be APPROVED before disbursement. Current status: " + application.getStatus());
        }

        // Check if account already exists
        if (accountRepository.findByLoanApplicationId(applicationId).isPresent()) {
            throw new IllegalArgumentException("Loan has already been disbursed for this application.");
        }

        LocalDate today = LocalDate.now();
        LocalDate maturity = today.plusMonths(application.getTenureMonths());

        BigDecimal emi = emiService.calculateMonthlyEMI(
                application.getRequestedAmount(),
                application.getInterestRate(),
                application.getTenureMonths()
        );

        LoanAccount account = new LoanAccount();
        account.setAccountNumber("LN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        account.setLoanApplication(application);
        account.setBorrower(application.getApplicant());
        account.setPrincipalAmount(application.getRequestedAmount());
        account.setOutstandingBalance(application.getRequestedAmount());
        account.setInterestRate(application.getInterestRate());
        account.setTenureMonths(application.getTenureMonths());
        account.setMonthlyEmi(emi);
        account.setDisbursementDate(today);
        account.setMaturityDate(maturity);
        account.setStatus(LoanStatus.DISBURSED);
        account.setTotalPaid(BigDecimal.ZERO);

        LoanAccount savedAccount = accountRepository.save(account);

        // Update application status
        application.setStatus(LoanStatus.DISBURSED);
        applicationRepository.save(application);

        // Generate EMI amortization schedule
        emiService.generateSchedule(savedAccount.getId());

        return mapToDTO(savedAccount);
    }

    @Override
    public LoanAccountDTO getAccountById(Long id) {
        LoanAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan account not found with id: " + id));
        return mapToDTO(account);
    }

    @Override
    public LoanAccountDTO getAccountByNumber(String accountNumber) {
        LoanAccount account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new LoanNotFoundException("Loan account not found with number: " + accountNumber));
        return mapToDTO(account);
    }

    @Override
    public List<LoanAccountDTO> getAccountsByBorrower(Long borrowerId) {
        return accountRepository.findByBorrowerId(borrowerId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<LoanAccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private LoanAccountDTO mapToDTO(LoanAccount account) {
        LoanAccountDTO dto = new LoanAccountDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        if (account.getLoanApplication() != null) {
            dto.setLoanApplicationId(account.getLoanApplication().getId());
            dto.setApplicationNumber(account.getLoanApplication().getApplicationNumber());
        }
        if (account.getBorrower() != null) {
            dto.setBorrowerId(account.getBorrower().getId());
            dto.setBorrowerName(account.getBorrower().getFirstName() + " " + account.getBorrower().getLastName());
            dto.setBorrowerEmail(account.getBorrower().getEmail());
        }
        dto.setPrincipalAmount(account.getPrincipalAmount());
        dto.setOutstandingBalance(account.getOutstandingBalance());
        dto.setInterestRate(account.getInterestRate());
        dto.setTenureMonths(account.getTenureMonths());
        dto.setMonthlyEmi(account.getMonthlyEmi());
        dto.setDisbursementDate(account.getDisbursementDate());
        dto.setMaturityDate(account.getMaturityDate());
        dto.setStatus(account.getStatus());
        dto.setTotalPaid(account.getTotalPaid());
        dto.setCreatedAt(account.getCreatedAt());
        return dto;
    }
}

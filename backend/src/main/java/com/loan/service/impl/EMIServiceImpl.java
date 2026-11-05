package com.loan.service.impl;

import com.loan.dto.EMIResponseDTO;
import com.loan.entity.EMISchedule;
import com.loan.entity.LoanAccount;
import com.loan.enums.EMIStatus;
import com.loan.exception.LoanNotFoundException;
import com.loan.repository.EMIScheduleRepository;
import com.loan.repository.LoanAccountRepository;
import com.loan.service.EMIService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EMIServiceImpl implements EMIService {

    private final EMIScheduleRepository emiScheduleRepository;
    private final LoanAccountRepository loanAccountRepository;

    public EMIServiceImpl(EMIScheduleRepository emiScheduleRepository,
                          LoanAccountRepository loanAccountRepository) {
        this.emiScheduleRepository = emiScheduleRepository;
        this.loanAccountRepository = loanAccountRepository;
    }

    @Override
    public BigDecimal calculateMonthlyEMI(BigDecimal principal, BigDecimal annualRate, int tenureMonths) {
        if (principal == null || annualRate == null || tenureMonths <= 0) {
            return BigDecimal.ZERO;
        }

        double p = principal.doubleValue();
        double r = (annualRate.doubleValue() / 100.0) / 12.0; // Monthly interest rate
        int n = tenureMonths;

        if (r == 0) {
            return principal.divide(BigDecimal.valueOf(n), 2, RoundingMode.HALF_UP);
        }

        double emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    @Transactional
    public List<EMIResponseDTO> generateSchedule(Long loanAccountId) {
        LoanAccount account = loanAccountRepository.findById(loanAccountId)
                .orElseThrow(() -> new LoanNotFoundException("Loan account not found with id: " + loanAccountId));

        BigDecimal principal = account.getPrincipalAmount();
        BigDecimal annualRate = account.getInterestRate();
        int tenure = account.getTenureMonths();
        BigDecimal emi = account.getMonthlyEmi();

        double monthlyRate = (annualRate.doubleValue() / 100.0) / 12.0;
        BigDecimal currentBalance = principal;
        LocalDate startDate = account.getDisbursementDate();

        List<EMISchedule> schedules = new ArrayList<>();

        for (int i = 1; i <= tenure; i++) {
            BigDecimal interestComponent = currentBalance.multiply(BigDecimal.valueOf(monthlyRate)).setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalComponent = emi.subtract(interestComponent).setScale(2, RoundingMode.HALF_UP);

            if (i == tenure) {
                principalComponent = currentBalance;
                emi = principalComponent.add(interestComponent);
                currentBalance = BigDecimal.ZERO;
            } else {
                currentBalance = currentBalance.subtract(principalComponent);
                if (currentBalance.compareTo(BigDecimal.ZERO) < 0) currentBalance = BigDecimal.ZERO;
            }

            LocalDate dueDate = startDate.plusMonths(i);

            EMISchedule schedule = new EMISchedule();
            schedule.setLoanAccount(account);
            schedule.setInstallmentNumber(i);
            schedule.setDueDate(dueDate);
            schedule.setEmiAmount(emi);
            schedule.setPrincipalComponent(principalComponent);
            schedule.setInterestComponent(interestComponent);
            schedule.setRemainingPrincipal(currentBalance);
            schedule.setStatus(EMIStatus.PENDING);

            schedules.add(schedule);
        }

        List<EMISchedule> saved = emiScheduleRepository.saveAll(schedules);
        return saved.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<EMIResponseDTO> getScheduleByAccount(Long loanAccountId) {
        return emiScheduleRepository.findByLoanAccountIdOrderByInstallmentNumberAsc(loanAccountId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private EMIResponseDTO mapToDTO(EMISchedule schedule) {
        EMIResponseDTO dto = new EMIResponseDTO();
        dto.setId(schedule.getId());
        if (schedule.getLoanAccount() != null) {
            dto.setLoanAccountId(schedule.getLoanAccount().getId());
            dto.setAccountNumber(schedule.getLoanAccount().getAccountNumber());
        }
        dto.setInstallmentNumber(schedule.getInstallmentNumber());
        dto.setDueDate(schedule.getDueDate());
        dto.setEmiAmount(schedule.getEmiAmount());
        dto.setPrincipalComponent(schedule.getPrincipalComponent());
        dto.setInterestComponent(schedule.getInterestComponent());
        dto.setRemainingPrincipal(schedule.getRemainingPrincipal());
        dto.setStatus(schedule.getStatus());
        dto.setPaidDate(schedule.getPaidDate());
        dto.setLateFee(schedule.getLateFee());
        return dto;
    }
}

package com.loan.scheduler;

import com.loan.entity.EMISchedule;
import com.loan.enums.EMIStatus;
import com.loan.repository.EMIScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class OverduePaymentScheduler {

    private static final Logger logger = LoggerFactory.getLogger(OverduePaymentScheduler.class);
    private final EMIScheduleRepository emiScheduleRepository;

    public OverduePaymentScheduler(EMIScheduleRepository emiScheduleRepository) {
        this.emiScheduleRepository = emiScheduleRepository;
    }

    // Runs every day at midnight 00:05 AM
    @Scheduled(cron = "0 5 0 * * ?")
    @Transactional
    public void flagOverdueEMIs() {
        LocalDate today = LocalDate.now();
        List<EMISchedule> overdueList = emiScheduleRepository.findOverdueEMIs(today);

        logger.info("[Overdue Payment Scheduler] Found {} overdue EMI installments past due date {}", overdueList.size(), today);

        for (EMISchedule emi : overdueList) {
            emi.setStatus(EMIStatus.OVERDUE);
            // Apply standard late fee of ₹500 or 2% of EMI
            BigDecimal fee = emi.getEmiAmount().multiply(BigDecimal.valueOf(0.02)).max(BigDecimal.valueOf(500.00));
            emi.setLateFee(fee);
            emiScheduleRepository.save(emi);

            logger.warn("-> Flagged Loan Account: {}, Installment #{}, Late Fee Applied: ₹{}",
                    emi.getLoanAccount().getAccountNumber(), emi.getInstallmentNumber(), fee);
        }
    }
}

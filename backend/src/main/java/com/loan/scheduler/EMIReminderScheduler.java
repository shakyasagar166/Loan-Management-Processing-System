package com.loan.scheduler;

import com.loan.entity.EMISchedule;
import com.loan.repository.EMIScheduleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class EMIReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(EMIReminderScheduler.class);
    private final EMIScheduleRepository emiScheduleRepository;

    public EMIReminderScheduler(EMIScheduleRepository emiScheduleRepository) {
        this.emiScheduleRepository = emiScheduleRepository;
    }

    // Runs every day at 8:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendUpcomingEMIReminders() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysLater = today.plusDays(3);

        List<EMISchedule> upcomingEmis = emiScheduleRepository.findUpcomingEMIs(today, threeDaysLater);
        logger.info("[EMI Reminder Scheduler] Scanned {} upcoming EMIs due between {} and {}", upcomingEmis.size(), today, threeDaysLater);

        for (EMISchedule emi : upcomingEmis) {
            String borrower = emi.getLoanAccount().getBorrower().getUsername();
            String accNo = emi.getLoanAccount().getAccountNumber();
            logger.info("-> Reminder dispatched to @{} for Loan Account: {}, Installment #{}, Amount: ₹{}, Due: {}",
                    borrower, accNo, emi.getInstallmentNumber(), emi.getEmiAmount(), emi.getDueDate());
        }
    }
}

package com.loan;

import com.loan.repository.EMIScheduleRepository;
import com.loan.repository.LoanAccountRepository;
import com.loan.service.impl.EMIServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class EMIServiceTest {

    @Mock
    private EMIScheduleRepository emiScheduleRepository;

    @Mock
    private LoanAccountRepository loanAccountRepository;

    @InjectMocks
    private EMIServiceImpl emiService;

    @Test
    void testCalculateMonthlyEMI() {
        // Principal: 1,00,000, Interest Rate: 12% p.a., Tenure: 12 months
        // Standard formula gives ~ 8,884.88
        BigDecimal principal = BigDecimal.valueOf(100000);
        BigDecimal annualRate = BigDecimal.valueOf(12.0);
        int tenureMonths = 12;

        BigDecimal emi = emiService.calculateMonthlyEMI(principal, annualRate, tenureMonths);
        assertNotNull(emi);
        assertTrue(emi.compareTo(BigDecimal.valueOf(8800)) > 0);
        assertTrue(emi.compareTo(BigDecimal.valueOf(9000)) < 0);
    }
}

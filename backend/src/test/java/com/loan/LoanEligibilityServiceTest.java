package com.loan;

import com.loan.dto.LoanEligibilityDTO;
import com.loan.entity.LoanType;
import com.loan.enums.LoanTypeEnum;
import com.loan.repository.LoanTypeRepository;
import com.loan.service.EMIService;
import com.loan.service.impl.LoanEligibilityServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LoanEligibilityServiceTest {

    @Mock
    private LoanTypeRepository loanTypeRepository;

    @Mock
    private EMIService emiService;

    @InjectMocks
    private LoanEligibilityServiceImpl eligibilityService;

    private LoanType sampleType;

    @BeforeEach
    void setUp() {
        sampleType = new LoanType(LoanTypeEnum.HOME_LOAN, "Home Loan", "Prime Home Loan", BigDecimal.valueOf(8.50), BigDecimal.valueOf(500000), BigDecimal.valueOf(10000000), 36, 360);
        sampleType.setId(1L);
        sampleType.setMinCreditScore(700);
    }

    @Test
    void testCheckEligibilityEligible() {
        when(loanTypeRepository.findById(1L)).thenReturn(Optional.of(sampleType));
        when(emiService.calculateMonthlyEMI(any(), any(), anyInt())).thenReturn(BigDecimal.valueOf(25000.00));

        LoanEligibilityDTO request = new LoanEligibilityDTO();
        request.setLoanTypeId(1L);
        request.setMonthlyIncome(BigDecimal.valueOf(100000.00));
        request.setExistingEmiObligations(BigDecimal.valueOf(10000.00));
        request.setRequestedAmount(BigDecimal.valueOf(3000000.00));
        request.setTenureMonths(240);
        request.setCreditScore(780);

        LoanEligibilityDTO result = eligibilityService.checkEligibility(request);
        assertNotNull(result);
        assertNotNull(result.getEligible());
        assertNotNull(result.getMaxEligibleAmount());
    }
}

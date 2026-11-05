package com.loan;

import com.loan.dto.LoanApplicationDTO;
import com.loan.entity.LoanApplication;
import com.loan.entity.LoanType;
import com.loan.entity.User;
import com.loan.enums.LoanStatus;
import com.loan.enums.LoanTypeEnum;
import com.loan.enums.UserRole;
import com.loan.repository.LoanApplicationRepository;
import com.loan.repository.LoanTypeRepository;
import com.loan.repository.UserRepository;
import com.loan.service.EMIService;
import com.loan.service.impl.LoanApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LoanApplicationServiceTest {

    @Mock
    private LoanApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LoanTypeRepository loanTypeRepository;

    @Mock
    private EMIService emiService;

    @InjectMocks
    private LoanApplicationServiceImpl applicationService;

    private User sampleUser;
    private LoanType sampleType;
    private LoanApplication sampleApp;

    @BeforeEach
    void setUp() {
        sampleUser = new User("customer", "password", "cust@example.com", "Amit", "Sharma", UserRole.ROLE_CUSTOMER);
        sampleUser.setId(1L);

        sampleType = new LoanType(LoanTypeEnum.PERSONAL_LOAN, "Personal Loan", "Quick loan", BigDecimal.valueOf(11.50), BigDecimal.valueOf(50000), BigDecimal.valueOf(1500000), 12, 60);
        sampleType.setId(2L);

        sampleApp = new LoanApplication("APP-001", sampleUser, sampleType, BigDecimal.valueOf(200000), 24, BigDecimal.valueOf(11.50), BigDecimal.valueOf(60000), "Home Renovation");
        sampleApp.setId(10L);
    }

    @Test
    void testGetApplicationById() {
        when(applicationRepository.findById(10L)).thenReturn(Optional.of(sampleApp));

        LoanApplicationDTO dto = applicationService.getApplicationById(10L);
        assertNotNull(dto);
        assertEquals("APP-001", dto.getApplicationNumber());
        assertEquals(BigDecimal.valueOf(200000), dto.getRequestedAmount());
    }

    @Test
    void testSubmitApplication() {
        LoanApplicationDTO requestDto = new LoanApplicationDTO();
        requestDto.setLoanTypeId(2L);
        requestDto.setRequestedAmount(BigDecimal.valueOf(300000));
        requestDto.setTenureMonths(36);
        requestDto.setPurpose("Medical Expense");

        when(userRepository.findByUsername("customer")).thenReturn(Optional.of(sampleUser));
        when(loanTypeRepository.findById(2L)).thenReturn(Optional.of(sampleType));
        when(emiService.calculateMonthlyEMI(any(), any(), anyInt())).thenReturn(BigDecimal.valueOf(9890.00));
        when(applicationRepository.save(any(LoanApplication.class))).thenAnswer(invocation -> {
            LoanApplication app = invocation.getArgument(0);
            app.setId(11L);
            return app;
        });

        LoanApplicationDTO result = applicationService.submitApplication(requestDto, "customer");
        assertNotNull(result);
        assertEquals(LoanStatus.APPLIED, result.getStatus());
        assertEquals(BigDecimal.valueOf(300000), result.getRequestedAmount());
    }
}

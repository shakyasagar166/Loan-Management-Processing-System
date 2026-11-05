package com.loan.service;

import com.loan.dto.EMIResponseDTO;

import java.math.BigDecimal;
import java.util.List;

public interface EMIService {
    List<EMIResponseDTO> generateSchedule(Long loanAccountId);
    List<EMIResponseDTO> getScheduleByAccount(Long loanAccountId);
    BigDecimal calculateMonthlyEMI(BigDecimal principal, BigDecimal annualRate, int tenureMonths);
}

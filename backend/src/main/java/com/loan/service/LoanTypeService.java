package com.loan.service;

import com.loan.dto.LoanTypeDTO;
import com.loan.enums.LoanTypeEnum;

import java.util.List;

public interface LoanTypeService {
    List<LoanTypeDTO> getAllLoanTypes();
    List<LoanTypeDTO> getActiveLoanTypes();
    LoanTypeDTO getLoanTypeById(Long id);
    LoanTypeDTO getLoanTypeByEnum(LoanTypeEnum type);
    LoanTypeDTO createLoanType(LoanTypeDTO dto);
    LoanTypeDTO updateLoanType(Long id, LoanTypeDTO dto);
    void deleteLoanType(Long id);
}

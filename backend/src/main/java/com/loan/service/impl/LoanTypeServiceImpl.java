package com.loan.service.impl;

import com.loan.dto.LoanTypeDTO;
import com.loan.entity.LoanType;
import com.loan.enums.LoanTypeEnum;
import com.loan.repository.LoanTypeRepository;
import com.loan.service.LoanTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanTypeServiceImpl implements LoanTypeService {

    private final LoanTypeRepository loanTypeRepository;

    public LoanTypeServiceImpl(LoanTypeRepository loanTypeRepository) {
        this.loanTypeRepository = loanTypeRepository;
    }

    @Override
    public List<LoanTypeDTO> getAllLoanTypes() {
        return loanTypeRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<LoanTypeDTO> getActiveLoanTypes() {
        return loanTypeRepository.findByActiveTrue().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public LoanTypeDTO getLoanTypeById(Long id) {
        LoanType type = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found with id: " + id));
        return mapToDTO(type);
    }

    @Override
    public LoanTypeDTO getLoanTypeByEnum(LoanTypeEnum type) {
        LoanType loanType = loanTypeRepository.findByType(type)
                .orElseThrow(() -> new RuntimeException("Loan type not found: " + type));
        return mapToDTO(loanType);
    }

    @Override
    @Transactional
    public LoanTypeDTO createLoanType(LoanTypeDTO dto) {
        if (loanTypeRepository.existsByType(dto.getType())) {
            throw new IllegalArgumentException("Loan type already exists: " + dto.getType());
        }

        LoanType type = new LoanType();
        type.setType(dto.getType());
        type.setName(dto.getName());
        type.setDescription(dto.getDescription());
        type.setInterestRate(dto.getInterestRate());
        type.setMinAmount(dto.getMinAmount());
        type.setMaxAmount(dto.getMaxAmount());
        type.setMinTenureMonths(dto.getMinTenureMonths() != null ? dto.getMinTenureMonths() : 6);
        type.setMaxTenureMonths(dto.getMaxTenureMonths() != null ? dto.getMaxTenureMonths() : 360);
        type.setProcessingFeePercentage(dto.getProcessingFeePercentage());
        type.setMinCreditScore(dto.getMinCreditScore() != null ? dto.getMinCreditScore() : 650);
        type.setActive(dto.getActive() != null ? dto.getActive() : true);

        return mapToDTO(loanTypeRepository.save(type));
    }

    @Override
    @Transactional
    public LoanTypeDTO updateLoanType(Long id, LoanTypeDTO dto) {
        LoanType type = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found with id: " + id));

        type.setName(dto.getName());
        type.setDescription(dto.getDescription());
        type.setInterestRate(dto.getInterestRate());
        type.setMinAmount(dto.getMinAmount());
        type.setMaxAmount(dto.getMaxAmount());
        if (dto.getMinTenureMonths() != null) type.setMinTenureMonths(dto.getMinTenureMonths());
        if (dto.getMaxTenureMonths() != null) type.setMaxTenureMonths(dto.getMaxTenureMonths());
        if (dto.getProcessingFeePercentage() != null) type.setProcessingFeePercentage(dto.getProcessingFeePercentage());
        if (dto.getMinCreditScore() != null) type.setMinCreditScore(dto.getMinCreditScore());
        if (dto.getActive() != null) type.setActive(dto.getActive());

        return mapToDTO(loanTypeRepository.save(type));
    }

    @Override
    @Transactional
    public void deleteLoanType(Long id) {
        LoanType type = loanTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan type not found with id: " + id));
        type.setActive(false);
        loanTypeRepository.save(type);
    }

    private LoanTypeDTO mapToDTO(LoanType type) {
        LoanTypeDTO dto = new LoanTypeDTO();
        dto.setId(type.getId());
        dto.setType(type.getType());
        dto.setName(type.getName());
        dto.setDescription(type.getDescription());
        dto.setInterestRate(type.getInterestRate());
        dto.setMinAmount(type.getMinAmount());
        dto.setMaxAmount(type.getMaxAmount());
        dto.setMinTenureMonths(type.getMinTenureMonths());
        dto.setMaxTenureMonths(type.getMaxTenureMonths());
        dto.setProcessingFeePercentage(type.getProcessingFeePercentage());
        dto.setMinCreditScore(type.getMinCreditScore());
        dto.setActive(type.getActive());
        return dto;
    }
}

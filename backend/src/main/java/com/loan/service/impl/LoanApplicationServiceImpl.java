package com.loan.service.impl;

import com.loan.dto.LoanApplicationDTO;
import com.loan.entity.LoanApplication;
import com.loan.entity.LoanType;
import com.loan.entity.User;
import com.loan.enums.LoanStatus;
import com.loan.exception.InvalidLoanApplicationException;
import com.loan.exception.LoanNotFoundException;
import com.loan.repository.LoanApplicationRepository;
import com.loan.repository.LoanTypeRepository;
import com.loan.repository.UserRepository;
import com.loan.service.EMIService;
import com.loan.service.LoanApplicationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LoanApplicationServiceImpl implements LoanApplicationService {

    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final LoanTypeRepository loanTypeRepository;
    private final EMIService emiService;

    public LoanApplicationServiceImpl(LoanApplicationRepository applicationRepository,
                                      UserRepository userRepository,
                                      LoanTypeRepository loanTypeRepository,
                                      EMIService emiService) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.loanTypeRepository = loanTypeRepository;
        this.emiService = emiService;
    }

    @Override
    public List<LoanApplicationDTO> getAllApplications() {
        return applicationRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<LoanApplicationDTO> getApplicationsByApplicant(Long applicantId) {
        return applicationRepository.findByApplicantId(applicantId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<LoanApplicationDTO> getApplicationsByStatus(LoanStatus status) {
        return applicationRepository.findByStatus(status).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public LoanApplicationDTO getApplicationById(Long id) {
        LoanApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan application not found with id: " + id));
        return mapToDTO(app);
    }

    @Override
    public LoanApplicationDTO getApplicationByNumber(String applicationNumber) {
        LoanApplication app = applicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new LoanNotFoundException("Loan application not found with number: " + applicationNumber));
        return mapToDTO(app);
    }

    @Override
    @Transactional
    public LoanApplicationDTO submitApplication(LoanApplicationDTO dto, String username) {
        User applicant = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Applicant not found: " + username));

        LoanType loanType = loanTypeRepository.findById(dto.getLoanTypeId())
                .orElseThrow(() -> new InvalidLoanApplicationException("Invalid loan type selected"));

        if (!loanType.getActive()) {
            throw new InvalidLoanApplicationException("The selected loan category is currently inactive");
        }

        if (dto.getRequestedAmount().compareTo(loanType.getMinAmount()) < 0 ||
                dto.getRequestedAmount().compareTo(loanType.getMaxAmount()) > 0) {
            throw new InvalidLoanApplicationException("Requested amount must be between ₹" +
                    loanType.getMinAmount() + " and ₹" + loanType.getMaxAmount());
        }

        if (dto.getTenureMonths() < loanType.getMinTenureMonths() ||
                dto.getTenureMonths() > loanType.getMaxTenureMonths()) {
            throw new InvalidLoanApplicationException("Tenure must be between " +
                    loanType.getMinTenureMonths() + " and " + loanType.getMaxTenureMonths() + " months");
        }

        BigDecimal emi = emiService.calculateMonthlyEMI(
                dto.getRequestedAmount(),
                loanType.getInterestRate(),
                dto.getTenureMonths()
        );

        LoanApplication app = new LoanApplication();
        app.setApplicationNumber("APP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setApplicant(applicant);
        app.setLoanType(loanType);
        app.setRequestedAmount(dto.getRequestedAmount());
        app.setTenureMonths(dto.getTenureMonths());
        app.setInterestRate(loanType.getInterestRate());
        app.setMonthlyIncome(dto.getMonthlyIncome() != null ? dto.getMonthlyIncome() : applicant.getMonthlyIncome());
        app.setPurpose(dto.getPurpose());
        app.setEmploymentType(dto.getEmploymentType() != null ? dto.getEmploymentType() : "Salaried");
        app.setCreditScore(applicant.getCreditScore() != null ? applicant.getCreditScore() : 750);
        app.setCalculatedEmi(emi);
        app.setStatus(LoanStatus.APPLIED);

        return mapToDTO(applicationRepository.save(app));
    }

    @Override
    @Transactional
    public LoanApplicationDTO updateApplicationStatus(Long id, LoanStatus status, String rejectionReason) {
        LoanApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException("Loan application not found with id: " + id));

        app.setStatus(status);
        if (rejectionReason != null) {
            app.setRejectionReason(rejectionReason);
        }
        return mapToDTO(applicationRepository.save(app));
    }

    private LoanApplicationDTO mapToDTO(LoanApplication app) {
        LoanApplicationDTO dto = new LoanApplicationDTO();
        dto.setId(app.getId());
        dto.setApplicationNumber(app.getApplicationNumber());
        if (app.getApplicant() != null) {
            dto.setApplicantId(app.getApplicant().getId());
            dto.setApplicantName(app.getApplicant().getFirstName() + " " + app.getApplicant().getLastName());
            dto.setApplicantEmail(app.getApplicant().getEmail());
            dto.setApplicantPhone(app.getApplicant().getPhoneNumber());
        }
        if (app.getLoanType() != null) {
            dto.setLoanTypeId(app.getLoanType().getId());
            dto.setLoanTypeName(app.getLoanType().getName());
            dto.setLoanTypeEnum(app.getLoanType().getType());
        }
        dto.setRequestedAmount(app.getRequestedAmount());
        dto.setTenureMonths(app.getTenureMonths());
        dto.setInterestRate(app.getInterestRate());
        dto.setMonthlyIncome(app.getMonthlyIncome());
        dto.setPurpose(app.getPurpose());
        dto.setEmploymentType(app.getEmploymentType());
        dto.setCreditScore(app.getCreditScore());
        dto.setCalculatedEmi(app.getCalculatedEmi());
        dto.setStatus(app.getStatus());
        dto.setRejectionReason(app.getRejectionReason());
        dto.setCreatedAt(app.getCreatedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        return dto;
    }
}

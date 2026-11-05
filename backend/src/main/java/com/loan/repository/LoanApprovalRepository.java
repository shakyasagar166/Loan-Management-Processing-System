package com.loan.repository;

import com.loan.entity.LoanApproval;
import com.loan.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApprovalRepository extends JpaRepository<LoanApproval, Long> {
    Optional<LoanApproval> findByLoanApplicationId(Long loanApplicationId);
    List<LoanApproval> findByApprovalStatus(ApprovalStatus status);
}

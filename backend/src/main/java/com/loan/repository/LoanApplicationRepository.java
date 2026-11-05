package com.loan.repository;

import com.loan.entity.LoanApplication;
import com.loan.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    Optional<LoanApplication> findByApplicationNumber(String applicationNumber);
    List<LoanApplication> findByApplicantId(Long applicantId);
    List<LoanApplication> findByStatus(LoanStatus status);

    @Query("SELECT COUNT(a) FROM LoanApplication a WHERE a.status = 'APPLIED' OR a.status = 'UNDER_REVIEW'")
    Long countPendingApplications();

    @Query("SELECT COUNT(a) FROM LoanApplication a WHERE a.status = 'APPROVED' OR a.status = 'DISBURSED'")
    Long countApprovedApplications();
}

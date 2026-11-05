package com.loan.repository;

import com.loan.entity.LoanPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanPaymentRepository extends JpaRepository<LoanPayment, Long> {
    Optional<LoanPayment> findByPaymentReference(String paymentReference);
    List<LoanPayment> findByLoanAccountId(Long loanAccountId);
    List<LoanPayment> findByPayerId(Long payerId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM LoanPayment p WHERE p.status = 'SUCCESS'")
    Double calculateTotalCollections();
}

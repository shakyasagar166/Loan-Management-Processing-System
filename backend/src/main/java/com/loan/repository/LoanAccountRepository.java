package com.loan.repository;

import com.loan.entity.LoanAccount;
import com.loan.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanAccountRepository extends JpaRepository<LoanAccount, Long> {
    Optional<LoanAccount> findByAccountNumber(String accountNumber);
    Optional<LoanAccount> findByLoanApplicationId(Long loanApplicationId);
    List<LoanAccount> findByBorrowerId(Long borrowerId);
    List<LoanAccount> findByStatus(LoanStatus status);

    @Query("SELECT COALESCE(SUM(la.principalAmount), 0) FROM LoanAccount la WHERE la.status = 'DISBURSED'")
    Double calculateTotalDisbursedAmount();

    @Query("SELECT COALESCE(SUM(la.outstandingBalance), 0) FROM LoanAccount la WHERE la.status = 'DISBURSED'")
    Double calculateTotalOutstandingBalance();
}

package com.loan.repository;

import com.loan.entity.EMISchedule;
import com.loan.enums.EMIStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EMIScheduleRepository extends JpaRepository<EMISchedule, Long> {
    List<EMISchedule> findByLoanAccountIdOrderByInstallmentNumberAsc(Long loanAccountId);
    List<EMISchedule> findByLoanAccountIdAndStatus(Long loanAccountId, EMIStatus status);

    @Query("SELECT e FROM EMISchedule e WHERE e.status = 'PENDING' AND e.dueDate < :date")
    List<EMISchedule> findOverdueEMIs(@Param("date") LocalDate date);

    @Query("SELECT e FROM EMISchedule e WHERE e.status = 'PENDING' AND e.dueDate BETWEEN :startDate AND :endDate")
    List<EMISchedule> findUpcomingEMIs(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

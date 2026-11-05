package com.loan.repository;

import com.loan.entity.LoanType;
import com.loan.enums.LoanTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanTypeRepository extends JpaRepository<LoanType, Long> {
    Optional<LoanType> findByType(LoanTypeEnum type);
    List<LoanType> findByActiveTrue();
    boolean existsByType(LoanTypeEnum type);
}

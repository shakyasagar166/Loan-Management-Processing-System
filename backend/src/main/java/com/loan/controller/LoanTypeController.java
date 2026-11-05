package com.loan.controller;

import com.loan.dto.LoanTypeDTO;
import com.loan.enums.LoanTypeEnum;
import com.loan.service.LoanTypeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loan-types")
public class LoanTypeController {

    private final LoanTypeService loanTypeService;

    public LoanTypeController(LoanTypeService loanTypeService) {
        this.loanTypeService = loanTypeService;
    }

    @GetMapping
    public ResponseEntity<List<LoanTypeDTO>> getActiveLoanTypes() {
        return ResponseEntity.ok(loanTypeService.getActiveLoanTypes());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LOAN_OFFICER')")
    public ResponseEntity<List<LoanTypeDTO>> getAllLoanTypes() {
        return ResponseEntity.ok(loanTypeService.getAllLoanTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanTypeDTO> getLoanTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(loanTypeService.getLoanTypeById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<LoanTypeDTO> getLoanTypeByEnum(@PathVariable LoanTypeEnum type) {
        return ResponseEntity.ok(loanTypeService.getLoanTypeByEnum(type));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanTypeDTO> createLoanType(@Valid @RequestBody LoanTypeDTO dto) {
        return new ResponseEntity<>(loanTypeService.createLoanType(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanTypeDTO> updateLoanType(@PathVariable Long id, @Valid @RequestBody LoanTypeDTO dto) {
        return ResponseEntity.ok(loanTypeService.updateLoanType(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteLoanType(@PathVariable Long id) {
        loanTypeService.deleteLoanType(id);
        return ResponseEntity.ok(Map.of("message", "Loan type deactivated successfully"));
    }
}

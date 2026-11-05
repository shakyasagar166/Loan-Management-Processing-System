package com.loan.service;

import com.loan.entity.LoanDocument;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {
    LoanDocument uploadDocument(Long loanApplicationId, String documentType, MultipartFile file, String username);
    List<LoanDocument> getDocumentsByApplication(Long loanApplicationId);
    LoanDocument verifyDocument(Long documentId, String verifiedBy);
    byte[] downloadDocument(Long documentId);
}

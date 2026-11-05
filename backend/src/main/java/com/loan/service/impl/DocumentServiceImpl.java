package com.loan.service.impl;

import com.loan.config.StorageConfig;
import com.loan.entity.LoanApplication;
import com.loan.entity.LoanDocument;
import com.loan.enums.LoanStatus;
import com.loan.exception.DocumentUploadException;
import com.loan.exception.LoanNotFoundException;
import com.loan.repository.LoanApplicationRepository;
import com.loan.repository.LoanDocumentRepository;
import com.loan.service.DocumentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final LoanDocumentRepository documentRepository;
    private final LoanApplicationRepository applicationRepository;
    private final StorageConfig storageConfig;

    public DocumentServiceImpl(LoanDocumentRepository documentRepository,
                               LoanApplicationRepository applicationRepository,
                               StorageConfig storageConfig) {
        this.documentRepository = documentRepository;
        this.applicationRepository = applicationRepository;
        this.storageConfig = storageConfig;
    }

    @Override
    @Transactional
    public LoanDocument uploadDocument(Long loanApplicationId, String documentType, MultipartFile file, String username) {
        LoanApplication application = applicationRepository.findById(loanApplicationId)
                .orElseThrow(() -> new LoanNotFoundException("Loan application not found with id: " + loanApplicationId));

        if (file.isEmpty()) {
            throw new DocumentUploadException("Failed to store empty file");
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String storedFileName = "doc_" + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
            Path targetLocation = Paths.get(storageConfig.getUploadDir()).resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            LoanDocument document = new LoanDocument();
            document.setLoanApplication(application);
            document.setDocumentType(documentType);
            document.setFileName(originalFilename != null ? originalFilename : storedFileName);
            document.setFilePath(targetLocation.toString());
            document.setFileSize(file.getSize());
            document.setVerified(false);

            // Move application status to DOCUMENT_VERIFICATION
            if (application.getStatus() == LoanStatus.APPLIED || application.getStatus() == LoanStatus.UNDER_REVIEW) {
                application.setStatus(LoanStatus.DOCUMENT_VERIFICATION);
                applicationRepository.save(application);
            }

            return documentRepository.save(document);
        } catch (IOException ex) {
            throw new DocumentUploadException("Could not store file. Please try again! " + ex.getMessage());
        }
    }

    @Override
    public List<LoanDocument> getDocumentsByApplication(Long loanApplicationId) {
        return documentRepository.findByLoanApplicationId(loanApplicationId);
    }

    @Override
    @Transactional
    public LoanDocument verifyDocument(Long documentId, String verifiedBy) {
        LoanDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentUploadException("Document not found with id: " + documentId));

        document.setVerified(true);
        document.setVerifiedBy(verifiedBy);
        return documentRepository.save(document);
    }

    @Override
    public byte[] downloadDocument(Long documentId) {
        LoanDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentUploadException("Document not found with id: " + documentId));

        try {
            Path filePath = Paths.get(document.getFilePath());
            if (Files.exists(filePath)) {
                return Files.readAllBytes(filePath);
            }
            return new byte[0];
        } catch (IOException e) {
            throw new DocumentUploadException("Error reading document file: " + e.getMessage());
        }
    }
}

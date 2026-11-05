package com.loan.controller;

import com.loan.entity.LoanDocument;
import com.loan.service.DocumentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<LoanDocument> uploadDocument(Authentication authentication,
                                                       @RequestParam("applicationId") Long applicationId,
                                                       @RequestParam("documentType") String documentType,
                                                       @RequestParam("file") MultipartFile file) {
        LoanDocument doc = documentService.uploadDocument(applicationId, documentType, file, authentication.getName());
        return new ResponseEntity<>(doc, HttpStatus.CREATED);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<LoanDocument>> getDocumentsByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(documentService.getDocumentsByApplication(applicationId));
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LOAN_OFFICER') or hasRole('UNDERWRITER')")
    public ResponseEntity<LoanDocument> verifyDocument(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(documentService.verifyDocument(id, authentication.getName()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        byte[] fileBytes = documentService.downloadDocument(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"document_" + id + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }
}

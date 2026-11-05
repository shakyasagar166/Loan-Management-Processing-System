# Loan Management & Processing System - REST API Documentation

Comprehensive enterprise API specification for automated loan origination, credit eligibility assessment (FOIR), document verification, underwriting approvals, loan disbursement, EMI amortization schedule calculation, and repayment tracking.

---

> ### 🎓 Industry Mentorship & Professional Java Certification
> Accelerate your financial technology backend engineering skills with industry-leading courses:
> - **[Java Training Course in Noida](https://uncodemy.com/course/java-training-course-in-noida)**: Master Spring Boot, microservices, enterprise JPA, and high-volume banking transaction architectures.
> - **[Java Training Course in Delhi](https://uncodemy.com/course/java-training-course-in-delhi)**: Hands-on real-time enterprise full-stack development, distributed ledgers, and secure FinTech solutions.

---

## 1. Architecture & Base Configuration

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT Bearer Token passed via HTTP Header: `Authorization: Bearer <token>`
- **Response Format**: `application/json`

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1 User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "username": "customer",
  "password": "password123"
}
```
- **Response `200 OK`**:
```json
{
  "accessToken": "eyJhbGciOi...",
  "tokenType": "Bearer",
  "id": 4,
  "username": "customer",
  "email": "amit.sharma@gmail.com",
  "firstName": "Amit",
  "lastName": "Sharma",
  "role": "ROLE_CUSTOMER"
}
```

### 2.2 Borrower / User Registration
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "username": "rohit_sharma",
  "password": "password123",
  "email": "rohit.sharma@gmail.com",
  "firstName": "Rohit",
  "lastName": "Sharma",
  "phoneNumber": "+91 9811223344",
  "panNumber": "ABCPS5678Q",
  "aadharNumber": "444455556666",
  "monthlyIncome": 95000.00,
  "role": "ROLE_CUSTOMER"
}
```

---

## 3. Loan Categories & Eligibility (`/api/loan-types`, `/api/eligibility`)

### 3.1 Get Active Loan Products
- **Endpoint**: `GET /api/loan-types`
- **Access**: Public / Authenticated

### 3.2 Calculate Loan Eligibility & FOIR
- **Endpoint**: `POST /api/eligibility/calculate`
- **Access**: Public / Authenticated
- **Request Body**:
```json
{
  "loanTypeId": 1,
  "monthlyIncome": 85000.00,
  "existingEmiObligations": 5000.00,
  "requestedAmount": 3000000.00,
  "tenureMonths": 240,
  "creditScore": 765
}
```
- **Response `200 OK`**:
```json
{
  "eligible": true,
  "maxEligibleAmount": 4215890.00,
  "estimatedEmi": 25836.18,
  "fixedObligationToIncomeRatio": 36.28,
  "riskCategory": "Low Risk (Prime)",
  "remarks": "Congratulations! You satisfy credit rating and income capability criteria."
}
```

---

## 4. Loan Origination & Applications (`/api/applications`)

### 4.1 Submit New Loan Application
- **Endpoint**: `POST /api/applications`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Request Body**:
```json
{
  "loanTypeId": 1,
  "requestedAmount": 4000000.00,
  "tenureMonths": 240,
  "monthlyIncome": 85000.00,
  "purpose": "Purchase of 3BHK Apartment in Noida Sector 75",
  "employmentType": "Salaried"
}
```
- **Response `201 Created`**:
```json
{
  "id": 1,
  "applicationNumber": "APP-HL-2026-001",
  "applicantId": 4,
  "applicantName": "Amit Sharma",
  "loanTypeName": "Prime Home Loan",
  "requestedAmount": 4000000.00,
  "tenureMonths": 240,
  "interestRate": 8.40,
  "calculatedEmi": 34448.24,
  "status": "APPLIED"
}
```

---

## 5. KYC Document Verification (`/api/documents`)

### 5.1 Upload Verification Document
- **Endpoint**: `POST /api/documents/upload`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `applicationId`: `1`
  - `documentType`: `PAN Card`
  - `file`: `[Binary PDF/PNG]`

### 5.2 Verify Document
- **Endpoint**: `PUT /api/documents/{id}/verify`
- **Access**: Underwriter / Loan Officer (`ROLE_UNDERWRITER`, `ROLE_LOAN_OFFICER`, `ROLE_ADMIN`)

---

## 6. Underwriting & Approvals (`/api/approvals`, `/api/accounts`)

### 6.1 Process Underwriting Decision
- **Endpoint**: `POST /api/approvals/decision`
- **Access**: `ROLE_UNDERWRITER`, `ROLE_LOAN_OFFICER`, `ROLE_ADMIN`
- **Request Body**:
```json
{
  "loanApplicationId": 1,
  "approvalStatus": "APPROVED",
  "approvedAmount": 4000000.00,
  "approvedInterestRate": 8.40,
  "approvedTenureMonths": 240,
  "decisionNotes": "Property title search clear. FOIR within 42%."
}
```

### 6.2 Disburse Loan Account
- **Endpoint**: `POST /api/accounts/disburse/{applicationId}`
- **Access**: `ROLE_LOAN_OFFICER`, `ROLE_ADMIN`
- **Response `200 OK`**:
```json
{
  "id": 1,
  "accountNumber": "LN-2026-HL01",
  "principalAmount": 4000000.00,
  "outstandingBalance": 4000000.00,
  "monthlyEmi": 34448.24,
  "disbursementDate": "2026-01-15",
  "status": "DISBURSED"
}
```

---

## 7. Repayments & EMI Amortization (`/api/emi`, `/api/payments`)

### 7.1 View Amortization Schedule
- **Endpoint**: `GET /api/emi/schedule/{loanAccountId}`
- **Access**: Authenticated

### 7.2 Make EMI Repayment
- **Endpoint**: `POST /api/payments/repay`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "loanAccountId": 1,
  "emiScheduleId": 3,
  "amount": 34448.24,
  "paymentMethod": "UPI",
  "remarks": "April 2026 Monthly EMI Payment"
}
```

---

## 8. Administrative Metrics (`/api/admin`)

### 8.1 Loan Portfolio Health
- **Endpoint**: `GET /api/admin/metrics`
- **Access**: Admin / Loan Officer
- **Response `200 OK`**:
```json
{
  "totalUsers": 5,
  "totalApplications": 3,
  "pendingApplications": 1,
  "approvedApplications": 2,
  "totalDisbursedAmount": 4000000.00,
  "totalOutstandingBalance": 3987123.50,
  "totalCollections": 68896.48,
  "overdueInstallmentsCount": 0
}
```

---

*The Loan Management & Processing System follows high-scale financial software architectural standards taught at [Uncodemy Java Training Course in Noida](https://uncodemy.com/course/java-training-course-in-noida) and [Uncodemy Java Training Course in Delhi](https://uncodemy.com/course/java-training-course-in-delhi).*

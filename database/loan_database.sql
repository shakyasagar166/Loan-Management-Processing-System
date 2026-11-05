-- =======================================================================
-- Database Schema: loan_db
-- System: Enterprise Loan Management & Processing System
-- Database Engine: MySQL 8.0+ / MariaDB / H2 Compatible
-- =======================================================================

CREATE DATABASE IF NOT EXISTS loan_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE loan_db;

-- 1. Drop Tables If Exist (Reverse Dependency Order)
DROP TABLE IF EXISTS loan_payments;
DROP TABLE IF EXISTS emi_schedules;
DROP TABLE IF EXISTS loan_accounts;
DROP TABLE IF EXISTS loan_approvals;
DROP TABLE IF EXISTS loan_documents;
DROP TABLE IF EXISTS loan_applications;
DROP TABLE IF EXISTS loan_types;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS users;

-- 2. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    phone_number VARCHAR(25),
    pan_number VARCHAR(30),
    aadhar_number VARCHAR(30),
    monthly_income DECIMAL(12, 2) DEFAULT 0.00,
    credit_score INT DEFAULT 750,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_CUSTOMER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Loan Types Table
CREATE TABLE loan_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    interest_rate DECIMAL(5, 2) NOT NULL,
    min_amount DECIMAL(12, 2) NOT NULL,
    max_amount DECIMAL(12, 2) NOT NULL,
    min_tenure_months INT NOT NULL DEFAULT 6,
    max_tenure_months INT NOT NULL DEFAULT 360,
    processing_fee_percentage DECIMAL(5, 2) DEFAULT 1.00,
    min_credit_score INT DEFAULT 650,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_loantype_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Loan Applications Table
CREATE TABLE loan_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(60) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    loan_type_id BIGINT NOT NULL,
    requested_amount DECIMAL(12, 2) NOT NULL,
    tenure_months INT NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    monthly_income DECIMAL(12, 2) NOT NULL,
    purpose VARCHAR(500),
    employment_type VARCHAR(50) DEFAULT 'Salaried',
    credit_score INT,
    calculated_emi DECIMAL(12, 2),
    status VARCHAR(35) NOT NULL DEFAULT 'APPLIED',
    rejection_reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_app_number (application_number),
    INDEX idx_app_user (user_id),
    INDEX idx_app_status (status),
    CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_app_loantype FOREIGN KEY (loan_type_id) REFERENCES loan_types(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Loan Documents Table
CREATE TABLE loan_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL,
    document_type VARCHAR(60) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_doc_app (loan_application_id),
    CONSTRAINT fk_doc_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Loan Approvals / Underwriting Decisions Table
CREATE TABLE loan_approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_application_id BIGINT NOT NULL UNIQUE,
    reviewed_by_user_id BIGINT NULL,
    approval_status VARCHAR(35) NOT NULL DEFAULT 'PENDING',
    approved_amount DECIMAL(12, 2),
    approved_interest_rate DECIMAL(5, 2),
    approved_tenure_months INT,
    decision_notes TEXT,
    decision_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_approval_app (loan_application_id),
    INDEX idx_approval_status (approval_status),
    CONSTRAINT fk_approval_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_approval_reviewer FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Loan Accounts (Disbursed Active Loans)
CREATE TABLE loan_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(60) NOT NULL UNIQUE,
    loan_application_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    principal_amount DECIMAL(12, 2) NOT NULL,
    outstanding_balance DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    tenure_months INT NOT NULL,
    monthly_emi DECIMAL(12, 2) NOT NULL,
    disbursement_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    status VARCHAR(35) NOT NULL DEFAULT 'DISBURSED',
    total_paid DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_number (account_number),
    INDEX idx_account_user (user_id),
    INDEX idx_account_status (status),
    CONSTRAINT fk_account_app FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE RESTRICT,
    CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. EMI Schedules Table (Amortization Plan)
CREATE TABLE emi_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    loan_account_id BIGINT NOT NULL,
    installment_number INT NOT NULL,
    due_date DATE NOT NULL,
    emi_amount DECIMAL(12, 2) NOT NULL,
    principal_component DECIMAL(12, 2) NOT NULL,
    interest_component DECIMAL(12, 2) NOT NULL,
    remaining_principal DECIMAL(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    paid_date TIMESTAMP NULL,
    late_fee DECIMAL(12, 2) DEFAULT 0.00,
    INDEX idx_emi_account (loan_account_id),
    INDEX idx_emi_status (status),
    INDEX idx_emi_due (due_date),
    CONSTRAINT fk_emi_account FOREIGN KEY (loan_account_id) REFERENCES loan_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Loan Repayments Table
CREATE TABLE loan_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_reference VARCHAR(80) NOT NULL UNIQUE,
    loan_account_id BIGINT NOT NULL,
    emi_schedule_id BIGINT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'UPI',
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    transaction_id VARCHAR(120),
    remarks VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payment_ref (payment_reference),
    INDEX idx_payment_account (loan_account_id),
    INDEX idx_payment_user (user_id),
    CONSTRAINT fk_payment_account FOREIGN KEY (loan_account_id) REFERENCES loan_accounts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_payment_emi FOREIGN KEY (emi_schedule_id) REFERENCES emi_schedules(id) ON DELETE SET NULL,
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Notifications Table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notif_user (user_id),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================================
-- Seed Initial Data
-- =======================================================================

-- Users (BCrypt password123)
INSERT INTO users (id, username, password, email, first_name, last_name, phone_number, pan_number, aadhar_number, monthly_income, credit_score, role, active)
VALUES 
(1, 'admin', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'admin@apexcredit.com', 'System', 'Admin', '+91 9876500001', 'AAAPA1111A', '111122223333', 150000.00, 820, 'ROLE_ADMIN', TRUE),
(2, 'officer', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'officer@apexcredit.com', 'Rajesh', 'Kumar', '+91 9876500002', 'BBBPA2222B', '222233334444', 95000.00, 790, 'ROLE_LOAN_OFFICER', TRUE),
(3, 'underwriter', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'underwriter@apexcredit.com', 'Vikram', 'Mehta', '+91 9876500003', 'CCCPA3333C', '333344445555', 120000.00, 810, 'ROLE_UNDERWRITER', TRUE),
(4, 'customer', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'amit.sharma@gmail.com', 'Amit', 'Sharma', '+91 9876500004', 'ABCPS1234F', '555566667777', 85000.00, 765, 'ROLE_CUSTOMER', TRUE),
(5, 'sneha_patel', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'sneha.patel@gmail.com', 'Sneha', 'Patel', '+91 9876500005', 'XYZPS9876K', '888899990000', 110000.00, 780, 'ROLE_CUSTOMER', TRUE);

-- Loan Types
INSERT INTO loan_types (id, type, name, description, interest_rate, min_amount, max_amount, min_tenure_months, max_tenure_months, processing_fee_percentage, min_credit_score, active)
VALUES
(1, 'HOME_LOAN', 'Prime Home Loan', 'Affordable financing for buying, constructing, or renovating residential real estate.', 8.40, 500000.00, 10000000.00, 36, 360, 0.50, 700, TRUE),
(2, 'PERSONAL_LOAN', 'Express Personal Loan', 'Unsecured credit for personal goals, medical emergencies, travel, or debt consolidation.', 11.50, 50000.00, 1500000.00, 12, 60, 1.50, 680, TRUE),
(3, 'AUTO_LOAN', 'Vehicle & Car Loan', 'Competitive rates for new passenger vehicles, electric cars, and commercial automobiles.', 9.25, 100000.00, 3000000.00, 12, 84, 1.00, 670, TRUE),
(4, 'EDUCATION_LOAN', 'Global Scholar Education Loan', 'Comprehensive academic financing covering global tuition fees and living expenses.', 8.75, 100000.00, 5000000.00, 12, 120, 0.75, 650, TRUE),
(5, 'BUSINESS_LOAN', 'SME Growth Business Loan', 'Working capital and capital expenditure credit facilities for expanding MSMEs.', 13.00, 200000.00, 5000000.00, 12, 60, 2.00, 710, TRUE);

-- Loan Applications
INSERT INTO loan_applications (id, application_number, user_id, loan_type_id, requested_amount, tenure_months, interest_rate, monthly_income, purpose, employment_type, credit_score, calculated_emi, status)
VALUES
(1, 'APP-HL-2026-001', 4, 1, 4000000.00, 240, 8.40, 85000.00, 'Purchase of 3BHK Apartment in Noida Sector 75', 'Salaried', 765, 34448.24, 'DISBURSED'),
(2, 'APP-PL-2026-002', 5, 2, 500000.00, 36, 11.50, 110000.00, 'Home interior design & kitchen renovation', 'Salaried', 780, 16489.87, 'APPROVED'),
(3, 'APP-AL-2026-003', 4, 3, 800000.00, 48, 9.25, 85000.00, 'Electric SUV Vehicle Purchase', 'Salaried', 765, 20008.15, 'UNDER_REVIEW');

-- Loan Approvals
INSERT INTO loan_approvals (id, loan_application_id, reviewed_by_user_id, approval_status, approved_amount, approved_interest_rate, approved_tenure_months, decision_notes, decision_date)
VALUES
(1, 1, 3, 'APPROVED', 4000000.00, 8.40, 240, 'Property title search clear. FOIR within 42%. Disbursed successfully.', CURRENT_TIMESTAMP),
(2, 2, 3, 'APPROVED', 500000.00, 11.50, 36, 'Excellent credit history, debt-to-income healthy. Ready for disbursement.', CURRENT_TIMESTAMP);

-- Loan Accounts
INSERT INTO loan_accounts (id, account_number, loan_application_id, user_id, principal_amount, outstanding_balance, interest_rate, tenure_months, monthly_emi, disbursement_date, maturity_date, status, total_paid)
VALUES
(1, 'LN-2026-HL01', 1, 4, 4000000.00, 3987123.50, 8.40, 240, 34448.24, '2026-01-15', '2046-01-15', 'DISBURSED', 68896.48);

-- EMI Schedules
INSERT INTO emi_schedules (id, loan_account_id, installment_number, due_date, emi_amount, principal_component, interest_component, remaining_principal, status, paid_date, late_fee)
VALUES
(1, 1, 1, '2026-02-15', 34448.24, 6448.24, 28000.00, 3993551.76, 'PAID', '2026-02-14 10:25:00', 0.00),
(2, 1, 2, '2026-03-15', 34448.24, 6493.38, 27954.86, 3987058.38, 'PAID', '2026-03-15 15:40:00', 0.00),
(3, 1, 3, '2026-04-15', 34448.24, 6538.83, 27909.41, 3980519.55, 'PENDING', NULL, 0.00),
(4, 1, 4, '2026-05-15', 34448.24, 6584.60, 27863.64, 3973934.95, 'PENDING', NULL, 0.00);

-- Loan Payments
INSERT INTO loan_payments (id, payment_reference, loan_account_id, emi_schedule_id, user_id, amount, payment_method, status, transaction_id, remarks, payment_date)
VALUES
(1, 'PAY-LN-8801', 1, 1, 4, 34448.24, 'UPI', 'SUCCESS', 'upi_icici_live_8801', 'EMI Installment #1 Paid', '2026-02-14 10:25:00'),
(2, 'PAY-LN-8802', 1, 2, 4, 34448.24, 'NET_BANKING', 'SUCCESS', 'netb_hdfc_live_8802', 'EMI Installment #2 Paid', '2026-03-15 15:40:00');

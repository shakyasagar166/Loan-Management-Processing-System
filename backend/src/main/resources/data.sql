-- Seed Users (password: password123)
MERGE INTO users (id, username, password, email, first_name, last_name, phone_number, pan_number, aadhar_number, monthly_income, credit_score, role, active, created_at, updated_at) KEY(id)
VALUES (1, 'admin', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'admin@apexcredit.com', 'System', 'Admin', '+91 9876500001', 'AAAPA1111A', '111122223333', 150000.00, 820, 'ROLE_ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO users (id, username, password, email, first_name, last_name, phone_number, pan_number, aadhar_number, monthly_income, credit_score, role, active, created_at, updated_at) KEY(id)
VALUES (2, 'officer', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'officer@apexcredit.com', 'Rajesh', 'Kumar', '+91 9876500002', 'BBBPA2222B', '222233334444', 95000.00, 790, 'ROLE_LOAN_OFFICER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO users (id, username, password, email, first_name, last_name, phone_number, pan_number, aadhar_number, monthly_income, credit_score, role, active, created_at, updated_at) KEY(id)
VALUES (3, 'underwriter', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'underwriter@apexcredit.com', 'Vikram', 'Mehta', '+91 9876500003', 'CCCPA3333C', '333344445555', 120000.00, 810, 'ROLE_UNDERWRITER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO users (id, username, password, email, first_name, last_name, phone_number, pan_number, aadhar_number, monthly_income, credit_score, role, active, created_at, updated_at) KEY(id)
VALUES (4, 'customer', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'amit.sharma@gmail.com', 'Amit', 'Sharma', '+91 9876500004', 'ABCPS1234F', '555566667777', 85000.00, 765, 'ROLE_CUSTOMER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO users (id, username, password, email, first_name, last_name, phone_number, pan_number, aadhar_number, monthly_income, credit_score, role, active, created_at, updated_at) KEY(id)
VALUES (5, 'sneha_patel', '$2a$10$7JbzTjQOQ4qM2sB84m8y6eqDkP7C3.B.rX6U8aD/yqZ1Hlyp6e7QW', 'sneha.patel@gmail.com', 'Sneha', 'Patel', '+91 9876500005', 'XYZPS9876K', '888899990000', 110000.00, 780, 'ROLE_CUSTOMER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Loan Types
MERGE INTO loan_types (id, type, name, description, interest_rate, min_amount, max_amount, min_tenure_months, max_tenure_months, processing_fee_percentage, min_credit_score, active, created_at) KEY(id)
VALUES (1, 'HOME_LOAN', 'Prime Home Loan', 'Affordable financing for buying, constructing, or renovating residential real estate.', 8.40, 500000.00, 10000000.00, 36, 360, 0.50, 700, true, CURRENT_TIMESTAMP);

MERGE INTO loan_types (id, type, name, description, interest_rate, min_amount, max_amount, min_tenure_months, max_tenure_months, processing_fee_percentage, min_credit_score, active, created_at) KEY(id)
VALUES (2, 'PERSONAL_LOAN', 'Express Personal Loan', 'Unsecured credit for personal goals, medical emergencies, travel, or debt consolidation.', 11.50, 50000.00, 1500000.00, 12, 60, 1.50, 680, true, CURRENT_TIMESTAMP);

MERGE INTO loan_types (id, type, name, description, interest_rate, min_amount, max_amount, min_tenure_months, max_tenure_months, processing_fee_percentage, min_credit_score, active, created_at) KEY(id)
VALUES (3, 'AUTO_LOAN', 'Vehicle & Car Loan', 'Competitive rates for new passenger vehicles, electric cars, and commercial automobiles.', 9.25, 100000.00, 3000000.00, 12, 84, 1.00, 670, true, CURRENT_TIMESTAMP);

MERGE INTO loan_types (id, type, name, description, interest_rate, min_amount, max_amount, min_tenure_months, max_tenure_months, processing_fee_percentage, min_credit_score, active, created_at) KEY(id)
VALUES (4, 'EDUCATION_LOAN', 'Global Scholar Education Loan', 'Comprehensive academic financing covering global tuition fees and living expenses.', 8.75, 100000.00, 5000000.00, 12, 120, 0.75, 650, true, CURRENT_TIMESTAMP);

MERGE INTO loan_types (id, type, name, description, interest_rate, min_amount, max_amount, min_tenure_months, max_tenure_months, processing_fee_percentage, min_credit_score, active, created_at) KEY(id)
VALUES (5, 'BUSINESS_LOAN', 'SME Growth Business Loan', 'Working capital and capital expenditure credit facilities for expanding MSMEs.', 13.00, 200000.00, 5000000.00, 12, 60, 2.00, 710, true, CURRENT_TIMESTAMP);

-- Seed Loan Applications
MERGE INTO loan_applications (id, application_number, user_id, loan_type_id, requested_amount, tenure_months, interest_rate, monthly_income, purpose, employment_type, credit_score, calculated_emi, status, rejection_reason, created_at, updated_at) KEY(id)
VALUES (1, 'APP-HL-2026-001', 4, 1, 4000000.00, 240, 8.40, 85000.00, 'Purchase of 3BHK Apartment in Noida Sector 75', 'Salaried', 765, 34448.24, 'DISBURSED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO loan_applications (id, application_number, user_id, loan_type_id, requested_amount, tenure_months, interest_rate, monthly_income, purpose, employment_type, credit_score, calculated_emi, status, rejection_reason, created_at, updated_at) KEY(id)
VALUES (2, 'APP-PL-2026-002', 5, 2, 500000.00, 36, 11.50, 110000.00, 'Home interior design & kitchen renovation', 'Salaried', 780, 16489.87, 'APPROVED', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO loan_applications (id, application_number, user_id, loan_type_id, requested_amount, tenure_months, interest_rate, monthly_income, purpose, employment_type, credit_score, calculated_emi, status, rejection_reason, created_at, updated_at) KEY(id)
VALUES (3, 'APP-AL-2026-003', 4, 3, 800000.00, 48, 9.25, 85000.00, 'Electric SUV Vehicle Purchase', 'Salaried', 765, 20008.15, 'UNDER_REVIEW', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Loan Approvals
MERGE INTO loan_approvals (id, loan_application_id, reviewed_by_user_id, approval_status, approved_amount, approved_interest_rate, approved_tenure_months, decision_notes, decision_date, created_at) KEY(id)
VALUES (1, 1, 3, 'APPROVED', 4000000.00, 8.40, 240, 'Property title search clear. FOIR within 42%. Disbursed successfully.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

MERGE INTO loan_approvals (id, loan_application_id, reviewed_by_user_id, approval_status, approved_amount, approved_interest_rate, approved_tenure_months, decision_notes, decision_date, created_at) KEY(id)
VALUES (2, 2, 3, 'APPROVED', 500000.00, 11.50, 36, 'Excellent credit history, debt-to-income healthy. Ready for disbursement.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Loan Accounts
MERGE INTO loan_accounts (id, account_number, loan_application_id, user_id, principal_amount, outstanding_balance, interest_rate, tenure_months, monthly_emi, disbursement_date, maturity_date, status, total_paid, created_at) KEY(id)
VALUES (1, 'LN-2026-HL01', 1, 4, 4000000.00, 3987123.50, 8.40, 240, 34448.24, '2026-01-15', '2046-01-15', 'DISBURSED', 68896.48, CURRENT_TIMESTAMP);

-- Seed EMI Schedules (First 4 EMIs for LN-2026-HL01)
MERGE INTO emi_schedules (id, loan_account_id, installment_number, due_date, emi_amount, principal_component, interest_component, remaining_principal, status, paid_date, late_fee) KEY(id)
VALUES (1, 1, 1, '2026-02-15', 34448.24, 6448.24, 28000.00, 3993551.76, 'PAID', '2026-02-14 10:25:00', 0.00);

MERGE INTO emi_schedules (id, loan_account_id, installment_number, due_date, emi_amount, principal_component, interest_component, remaining_principal, status, paid_date, late_fee) KEY(id)
VALUES (2, 1, 2, '2026-03-15', 34448.24, 6493.38, 27954.86, 3987058.38, 'PAID', '2026-03-15 15:40:00', 0.00);

MERGE INTO emi_schedules (id, loan_account_id, installment_number, due_date, emi_amount, principal_component, interest_component, remaining_principal, status, paid_date, late_fee) KEY(id)
VALUES (3, 1, 3, '2026-04-15', 34448.24, 6538.83, 27909.41, 3980519.55, 'PENDING', NULL, 0.00);

MERGE INTO emi_schedules (id, loan_account_id, installment_number, due_date, emi_amount, principal_component, interest_component, remaining_principal, status, paid_date, late_fee) KEY(id)
VALUES (4, 1, 4, '2026-05-15', 34448.24, 6584.60, 27863.64, 3973934.95, 'PENDING', NULL, 0.00);

-- Seed Loan Payments
MERGE INTO loan_payments (id, payment_reference, loan_account_id, emi_schedule_id, user_id, amount, payment_method, status, transaction_id, remarks, payment_date) KEY(id)
VALUES (1, 'PAY-LN-8801', 1, 1, 4, 34448.24, 'UPI', 'SUCCESS', 'upi_icici_live_8801', 'EMI Installment #1 Paid', '2026-02-14 10:25:00');

MERGE INTO loan_payments (id, payment_reference, loan_account_id, emi_schedule_id, user_id, amount, payment_method, status, transaction_id, remarks, payment_date) KEY(id)
VALUES (2, 'PAY-LN-8802', 1, 2, 4, 34448.24, 'NET_BANKING', 'SUCCESS', 'netb_hdfc_live_8802', 'EMI Installment #2 Paid', '2026-03-15 15:40:00');

-- Seed Loan Documents
MERGE INTO loan_documents (id, loan_application_id, document_type, file_name, file_path, file_size, verified, verified_by, uploaded_at) KEY(id)
VALUES (1, 1, 'PAN Card', 'amit_sharma_pan.pdf', 'uploads/loan-documents/amit_sharma_pan.pdf', 245000, true, 'Vikram Mehta', CURRENT_TIMESTAMP);

MERGE INTO loan_documents (id, loan_application_id, document_type, file_name, file_path, file_size, verified, verified_by, uploaded_at) KEY(id)
VALUES (2, 1, 'Salary Slips (3 Months)', 'amit_salary_slips.pdf', 'uploads/loan-documents/amit_salary_slips.pdf', 1250000, true, 'Vikram Mehta', CURRENT_TIMESTAMP);

MERGE INTO loan_documents (id, loan_application_id, document_type, file_name, file_path, file_size, verified, verified_by, uploaded_at) KEY(id)
VALUES (3, 2, 'Aadhaar Card', 'sneha_aadhaar.pdf', 'uploads/loan-documents/sneha_aadhaar.pdf', 310000, true, 'Vikram Mehta', CURRENT_TIMESTAMP);

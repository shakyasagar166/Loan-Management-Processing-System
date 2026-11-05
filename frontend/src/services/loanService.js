import api from './api';

export const loanService = {
  getLoanTypes: async () => {
    const response = await api.get('/loan-types');
    return response.data;
  },

  getAllLoanTypes: async () => {
    const response = await api.get('/loan-types/all');
    return response.data;
  },

  getLoanTypeById: async (id) => {
    const response = await api.get(`/loan-types/${id}`);
    return response.data;
  },

  submitApplication: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  getAllApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id, status, reason = '') => {
    const response = await api.put(`/applications/${id}/status?status=${status}&reason=${encodeURIComponent(reason)}`);
    return response.data;
  },

  processApprovalDecision: async (decisionData) => {
    const response = await api.post('/approvals/decision', decisionData);
    return response.data;
  },

  getAllApprovals: async () => {
    const response = await api.get('/approvals');
    return response.data;
  },

  getApprovalByApplication: async (applicationId) => {
    const response = await api.get(`/approvals/application/${applicationId}`);
    return response.data;
  },

  disburseLoan: async (applicationId) => {
    const response = await api.post(`/accounts/disburse/${applicationId}`);
    return response.data;
  },

  getMyAccounts: async () => {
    const response = await api.get('/accounts/my');
    return response.data;
  },

  getAllAccounts: async () => {
    const response = await api.get('/accounts');
    return response.data;
  },

  getAccountById: async (id) => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  getEMISchedule: async (loanAccountId) => {
    const response = await api.get(`/emi/schedule/${loanAccountId}`);
    return response.data;
  },

  calculateEmi: async (principal, annualRate, tenureMonths) => {
    const response = await api.post(`/emi/calculate?principal=${principal}&annualRate=${annualRate}&tenureMonths=${tenureMonths}`);
    return response.data;
  },

  getAdminMetrics: async () => {
    const response = await api.get('/admin/metrics');
    return response.data;
  }
};

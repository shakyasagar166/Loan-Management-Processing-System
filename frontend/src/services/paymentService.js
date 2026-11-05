import api from './api';

export const paymentService = {
  processRepayment: async (paymentData) => {
    const response = await api.post('/payments/repay', paymentData);
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get('/payments/my');
    return response.data;
  },

  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  getPaymentsByAccount: async (loanAccountId) => {
    const response = await api.get(`/payments/account/${loanAccountId}`);
    return response.data;
  }
};

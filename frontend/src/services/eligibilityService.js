import api from './api';

export const eligibilityService = {
  calculateEligibility: async (payload) => {
    const response = await api.post('/eligibility/calculate', payload);
    return response.data;
  }
};

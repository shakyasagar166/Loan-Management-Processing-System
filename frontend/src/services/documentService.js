import api from './api';

export const documentService = {
  uploadDocument: async (applicationId, documentType, file) => {
    const formData = new FormData();
    formData.append('applicationId', applicationId);
    formData.append('documentType', documentType);
    formData.append('file', file);

    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocumentsByApplication: async (applicationId) => {
    const response = await api.get(`/documents/application/${applicationId}`);
    return response.data;
  },

  verifyDocument: async (documentId) => {
    const response = await api.put(`/documents/${documentId}/verify`);
    return response.data;
  }
};

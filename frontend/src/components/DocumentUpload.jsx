import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { documentService } from '../services/documentService';

const DocumentUpload = ({ applicationId, onUploadSuccess }) => {
  const [documentType, setDocumentType] = useState('PAN Card');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const docTypes = [
    'PAN Card',
    'Aadhaar Card',
    'Salary Slips (3 Months)',
    'Bank Statement (6 Months)',
    'Income Tax Return (ITR)',
    'Property / Collateral Title Deed'
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      await documentService.uploadDocument(applicationId, documentType, file);
      setSuccess(`${documentType} uploaded successfully!`);
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        <UploadCloud className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-slate-900">Upload Verification Document</h3>
      </div>
      <p className="text-xs text-slate-500">
        Upload clear PDF, PNG, or JPG copies of mandatory identity and financial verification records.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Document Category
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            {docTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-700">
              {file ? file.name : 'Click to select or drag and drop document'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports PDF, PNG, JPEG up to 10MB
            </p>
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span>Upload Document</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;

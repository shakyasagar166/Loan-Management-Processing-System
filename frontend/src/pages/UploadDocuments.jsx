import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { documentService } from '../services/documentService';
import DocumentUpload from '../components/DocumentUpload';
import { FileText, CheckCircle2, Clock, ArrowLeft, Download } from 'lucide-react';

const UploadDocuments = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(location.state?.applicationId || '');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await loanService.getMyApplications();
      setApplications(data);
      if (!selectedAppId && data.length > 0) {
        setSelectedAppId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAppId) {
      fetchDocuments(selectedAppId);
    }
  }, [selectedAppId]);

  const fetchDocuments = async (appId) => {
    try {
      const docs = await documentService.getDocumentsByApplication(appId);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            KYC & Document Verification
          </h1>
          <p className="text-xs text-slate-500">
            Submit required identity, income, and bank proof documents for credit underwriting.
          </p>
        </div>
        <Link
          to="/applications"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Applications</span>
        </Link>
      </div>

      {/* Select Application Dropdown */}
      {applications.length > 1 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center space-x-3 text-xs">
          <label className="font-semibold text-slate-700">Select Loan Application:</label>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-mono"
          >
            {applications.map(a => (
              <option key={a.id} value={a.id}>
                {a.applicationNumber} - {a.loanTypeName} (₹{Number(a.requestedAmount).toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedAppId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <DocumentUpload
            applicationId={selectedAppId}
            onUploadSuccess={() => fetchDocuments(selectedAppId)}
          />

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Uploaded Documents ({documents.length})</h3>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No documents uploaded for this application yet.
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{doc.documentType}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                          {doc.fileName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center space-x-1 ${
                        doc.verified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {doc.verified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600 mr-1" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
          No loan applications found. Please submit an application first.
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;

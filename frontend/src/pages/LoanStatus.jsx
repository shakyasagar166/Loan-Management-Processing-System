import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { documentService } from '../services/documentService';
import {
  FileClock,
  CheckCircle2,
  Clock,
  XCircle,
  UploadCloud,
  Landmark,
  ArrowLeft,
  FileText
} from 'lucide-react';

const LoanStatus = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const app = await loanService.getApplicationById(id);
      setApplication(app);

      const docs = await documentService.getDocumentsByApplication(id);
      setDocuments(docs);

      try {
        const apprv = await loanService.getApprovalByApplication(id);
        setApproval(apprv);
      } catch (e) {
        // May not have an approval record yet
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Application not found.</p>
        <Link to="/applications" className="text-emerald-600 text-xs font-semibold mt-2 inline-block">
          ← Back to My Applications
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Application Submitted', desc: 'Received & Queued', status: 'completed' },
    {
      title: 'Underwriting Review',
      desc: 'FOIR & Credit Check',
      status: ['UNDER_REVIEW', 'DOCUMENT_VERIFICATION', 'APPROVED', 'DISBURSED'].includes(application.status)
        ? 'completed'
        : application.status === 'REJECTED' ? 'failed' : 'active'
    },
    {
      title: 'KYC & Verification',
      desc: `${documents.filter(d => d.verified).length}/${documents.length} Docs Verified`,
      status: ['DOCUMENT_VERIFICATION', 'APPROVED', 'DISBURSED'].includes(application.status)
        ? 'completed'
        : application.status === 'REJECTED' ? 'failed' : 'pending'
    },
    {
      title: 'Approval & Sanction',
      desc: application.status === 'APPROVED' || application.status === 'DISBURSED' ? 'Sanction Letter Issued' : 'Pending Underwriter',
      status: ['APPROVED', 'DISBURSED'].includes(application.status)
        ? 'completed'
        : application.status === 'REJECTED' ? 'failed' : 'pending'
    },
    {
      title: 'Fund Disbursement',
      desc: application.status === 'DISBURSED' ? 'Funds Transferred to Account' : 'Ready for Disbursal',
      status: application.status === 'DISBURSED' ? 'completed' : 'pending'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/applications"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to My Applications
      </Link>

      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-slate-900">{application.loanTypeName}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                application.status === 'DISBURSED' || application.status === 'APPROVED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : application.status === 'REJECTED'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {application.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Ref: {application.applicationNumber} • Applied on {application.createdAt?.substring(0, 10)}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Requested Amount</span>
            <p className="text-2xl font-extrabold text-slate-900">
              ₹{Number(application.requestedAmount).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Application Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-5">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400">Tenure</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{application.tenureMonths} Months</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400">Interest Rate</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{application.interestRate}% p.a.</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400">Estimated EMI</span>
            <p className="text-sm font-bold text-emerald-700 mt-1">
              ₹{Number(application.calculatedEmi).toLocaleString('en-IN')}/mo
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400">Borrower Credit Score</span>
            <p className="text-sm font-bold text-slate-900 mt-1">{application.creditScore || '750'}</p>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900">Origination Lifecycle Tracker</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((step, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex items-center space-x-2">
                {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {step.status === 'active' && <Clock className="w-4 h-4 text-blue-600 animate-pulse" />}
                {step.status === 'pending' && <Clock className="w-4 h-4 text-slate-300" />}
                {step.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                <span className="font-bold text-xs text-slate-800">Step {idx + 1}</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900">{step.title}</h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Decision Note if Available */}
      {approval && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Underwriting Sanction Note</span>
          </div>
          <p className="text-slate-700 leading-relaxed">{approval.decisionNotes}</p>
          <div className="pt-2 border-t border-emerald-200 text-slate-500 flex justify-between">
            <span>Reviewed by: {approval.reviewedBy || 'Senior Underwriter'}</span>
            <span>Sanctioned on: {approval.decisionDate?.substring(0, 10)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanStatus;

import React, { useState, useEffect } from 'react';
import { loanService } from '../services/loanService';
import { documentService } from '../services/documentService';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Landmark,
  FileText,
  User,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const LoanApproval = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [approvedRate, setApprovedRate] = useState('');
  const [approvedTenure, setApprovedTenure] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchPendingApps();
  }, []);

  const fetchPendingApps = async () => {
    try {
      const data = await loanService.getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApp = async (app) => {
    setSelectedApp(app);
    setApprovedAmount(app.requestedAmount);
    setApprovedRate(app.interestRate);
    setApprovedTenure(app.tenureMonths);
    setNotes('');
    try {
      const docs = await documentService.getDocumentsByApplication(app.id);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecision = async (status) => {
    if (!selectedApp) return;
    setSubmitting(true);
    setActionMsg('');
    try {
      await loanService.processApprovalDecision({
        loanApplicationId: selectedApp.id,
        approvalStatus: status,
        approvedAmount: parseFloat(approvedAmount),
        approvedInterestRate: parseFloat(approvedRate),
        approvedTenureMonths: parseInt(approvedTenure),
        decisionNotes: notes || (status === 'APPROVED' ? 'Approved based on credit and income criteria' : 'Rejected after underwriting assessment')
      });
      setActionMsg(`Application #${selectedApp.applicationNumber} has been ${status}!`);
      setSelectedApp(null);
      fetchPendingApps();
    } catch (err) {
      alert('Decision processing failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisburse = async (appId) => {
    if (!window.confirm('Confirm loan disbursement and creation of active loan account?')) return;
    try {
      await loanService.disburseLoan(appId);
      setActionMsg('Loan disbursed successfully and active account opened!');
      fetchPendingApps();
    } catch (err) {
      alert('Disbursement failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Credit Underwriting & Approval Desk
        </h1>
        <p className="text-xs text-slate-500">
          Underwrite originated borrower requests, verify uploaded KYC proof, and sanction disbursable credit facilities.
        </p>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
          {actionMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Applications List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <span className="font-bold text-xs text-slate-700">Originated Requests</span>
            <span className="text-xs text-slate-400 font-semibold">{applications.length} files</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {applications.map((app) => (
              <div
                key={app.id}
                onClick={() => handleSelectApp(app)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedApp?.id === app.id
                    ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{app.applicantName}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">{app.applicationNumber}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'DISBURSED' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-600">
                  <span>{app.loanTypeName}</span>
                  <span className="font-bold text-slate-900">₹{Number(app.requestedAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>Score: {app.creditScore || 750}</span>
                  <span>Income: ₹{Number(app.monthlyIncome).toLocaleString('en-IN')}/mo</span>
                </div>

                {app.status === 'APPROVED' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDisburse(app.id); }}
                    className="mt-3 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    Disburse Funds Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Application Details & Underwriting Decision */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          {selectedApp ? (
            <>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedApp.applicantName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedApp.applicationNumber} • {selectedApp.loanTypeName}</p>
                </div>
                <span className="text-sm font-bold text-emerald-700">
                  Requested: ₹{Number(selectedApp.requestedAmount).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400">Monthly Salary:</span>
                  <p className="font-bold text-slate-900 mt-0.5">₹{Number(selectedApp.monthlyIncome).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-slate-400">Credit Rating:</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{selectedApp.creditScore || 750}</p>
                </div>
                <div>
                  <span className="text-slate-400">Tenure:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedApp.tenureMonths} Months</p>
                </div>
              </div>

              {/* KYC Documents */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  KYC Verification ({documents.length} Files Uploaded)
                </h4>
                {documents.length === 0 ? (
                  <p className="text-xs text-slate-400">No documents submitted yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 text-xs">
                        <span className="font-medium text-slate-800">{doc.documentType} ({doc.fileName})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${doc.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {doc.verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Decision Form */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Underwriter Sanction Terms
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Approved Amount (₹)</label>
                    <input
                      type="number"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={approvedRate}
                      onChange={(e) => setApprovedRate(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Tenure (Mos)</label>
                    <input
                      type="number"
                      value={approvedTenure}
                      onChange={(e) => setApprovedTenure(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Underwriter Decision Remarks</label>
                  <textarea
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter sanction notes or reason for rejection..."
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleDecision('APPROVED')}
                    disabled={submitting}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Application</span>
                  </button>
                  <button
                    onClick={() => handleDecision('REJECTED')}
                    disabled={submitting}
                    className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              <ShieldCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Select an originated loan request from the list to begin underwriting and credit approval.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApproval;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loanService } from '../services/loanService';
import {
  FileClock,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Landmark
} from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await loanService.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DISBURSED':
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
      case 'APPLIED':
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            {status === 'APPLIED' ? 'Underwriting Queued' : 'Under Review'}
          </span>
        );
      case 'DOCUMENT_VERIFICATION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <UploadCloud className="w-3 h-3 mr-1" />
            KYC Verification
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Loan Applications
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status tracking for originated retail and commercial credit requests.
          </p>
        </div>
        <Link
          to="/apply"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          New Application
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <FileClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">No applications submitted yet</p>
          <Link to="/apply" className="mt-2 inline-block text-xs font-semibold text-emerald-600 hover:underline">
            Submit your first loan request →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-base font-bold text-slate-900">{app.loanTypeName}</h3>
                  {getStatusBadge(app.status)}
                  <span className="text-xs text-slate-400 font-mono">[{app.applicationNumber}]</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                  <span>Requested: <strong className="text-slate-800">₹{Number(app.requestedAmount).toLocaleString('en-IN')}</strong></span>
                  <span>Tenure: <strong className="text-slate-800">{app.tenureMonths} Months</strong></span>
                  <span>Estimated EMI: <strong className="text-emerald-700">₹{Number(app.calculatedEmi).toLocaleString('en-IN')}/mo</strong></span>
                  <span>Rate: {app.interestRate}% p.a.</span>
                </div>
                {app.rejectionReason && (
                  <p className="text-xs text-red-600 font-medium pt-1">
                    Reason: {app.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 self-end md:self-center">
                <Link
                  to={`/loan-status/${app.id}`}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  Track Status
                </Link>
                <Link
                  to="/documents"
                  state={{ applicationId: app.id, applicationNumber: app.applicationNumber }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload KYC</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;

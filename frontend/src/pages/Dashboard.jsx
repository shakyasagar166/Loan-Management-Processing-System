import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loanService } from '../services/loanService';
import {
  Landmark,
  Calculator,
  Send,
  CalendarCheck,
  CreditCard,
  FileCheck2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [emis, setEmis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [accData, appData] = await Promise.all([
        loanService.getMyAccounts(),
        loanService.getMyApplications()
      ]);
      setAccounts(accData);
      setApplications(appData);

      if (accData && accData.length > 0) {
        const schedule = await loanService.getEMISchedule(accData[0].id);
        setEmis(schedule.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeLoan = accounts.find(a => a.status === 'DISBURSED') || accounts[0];
  const pendingApps = applications.filter(a => a.status === 'APPLIED' || a.status === 'UNDER_REVIEW' || a.status === 'DOCUMENT_VERIFICATION');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Credit & Underwriting Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Track active loan disbursements, check instant borrowing eligibility using our automated FOIR engine, and manage hassle-free EMI repayments.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Credit Score</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {user?.creditScore || 750}
          </p>
          <span className="mt-1 inline-block text-xs font-medium text-emerald-600">
            Prime Borrower Status
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Loans</span>
            <Landmark className="w-5 h-5 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {accounts.length}
          </p>
          <span className="mt-1 inline-block text-xs font-medium text-slate-500">
            {activeLoan ? activeLoan.accountNumber : 'No Active Loans'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Outstanding</span>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            ₹{activeLoan ? Number(activeLoan.outstandingBalance).toLocaleString('en-IN') : '0'}
          </p>
          <span className="mt-1 inline-block text-xs font-medium text-slate-500">
            Disbursed: ₹{activeLoan ? Number(activeLoan.principalAmount).toLocaleString('en-IN') : '0'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Apps</span>
            <FileCheck2 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {pendingApps.length}
          </p>
          <span className="mt-1 inline-block text-xs font-medium text-slate-500">
            In underwriting review
          </span>
        </div>
      </div>

      {/* Active Loan Spotlight */}
      {activeLoan ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Loan Account: {activeLoan.accountNumber}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {activeLoan.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Disbursed on {activeLoan.disbursementDate} • Maturity: {activeLoan.maturityDate}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/emi-schedule"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Pay Monthly EMI
              </Link>
              <Link
                to="/loans"
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                View Account Specs
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-5">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase">Principal Borrowed</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                ₹{Number(activeLoan.principalAmount).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase">Monthly EMI</span>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                ₹{Number(activeLoan.monthlyEmi).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase">Interest Rate</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {activeLoan.interestRate}% p.a.
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase">Total Paid Till Date</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                ₹{Number(activeLoan.totalPaid).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <Landmark className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-emerald-900">No Active Disbursed Loans</h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto mt-1 mb-4">
            Explore our prime retail and home loan products with low interest rates starting from 8.40% p.a.
          </p>
          <div className="flex justify-center space-x-3">
            <Link
              to="/eligibility"
              className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors"
            >
              Check Eligibility
            </Link>
            <Link
              to="/apply"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Apply Online
            </Link>
          </div>
        </div>
      )}

      {/* Amortization Schedule Table Preview */}
      {emis.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming EMI Installments</h3>
              <p className="text-xs text-slate-500">Upcoming principal and interest schedule breakdown.</p>
            </div>
            <Link
              to="/emi-schedule"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>View Full Schedule</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Inst #</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">EMI Amount</th>
                  <th className="px-4 py-3">Principal Component</th>
                  <th className="px-4 py-3">Interest Component</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {emis.map((emi) => (
                  <tr key={emi.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold">#{emi.installmentNumber}</td>
                    <td className="px-4 py-3">{emi.dueDate}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      ₹{Number(emi.emiAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">₹{Number(emi.principalComponent).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{Number(emi.interestComponent).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        emi.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {emi.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Featured Mentorship & Upskilling Section */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-emerald-800/40 shadow-md">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-300 bg-emerald-800/40 px-3 py-1 rounded-full border border-emerald-700">
              <ExternalLink className="w-3 h-3 mr-1" />
              Corporate Banking & Tech Upskilling
            </span>
            <h3 className="text-xl font-bold tracking-tight">
              Master Java Enterprise & FinTech Microservice Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gain expertise in transactional ledger consistency, high-throughput credit engines, Spring Boot 3 security, and automated underwriting:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
            <a
              href="https://uncodemy.com/course/java-training-course-in-noida"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-md transition-all text-center flex items-center justify-center space-x-1"
            >
              <span>Java Training in Noida</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://uncodemy.com/course/java-training-course-in-delhi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold shadow-md transition-all text-center flex items-center justify-center space-x-1"
            >
              <span>Java Training in Delhi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loanService } from '../services/loanService';
import api from '../services/api';
import {
  BanknotesIcon,
  UsersIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsData, usersData] = await Promise.all([
        loanService.getAdminMetrics(),
        api.get('/users').then(r => r.data).catch(() => [])
      ]);
      setMetrics(metricsData);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('Failed to fetch administrator metrics and user records.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await api.put(`/users/${userId}/toggle-status`);
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, enabled: !u.enabled } : u));
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert('Could not update user status.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-indigo-100 text-indigo-800">
              Admin & Operations
            </span>
            <span className="flex items-center text-xs text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
              Live Core Banking Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Executive Dashboard</h1>
          <p className="text-sm text-slate-500">
            Portfolio performance, underwriting throughput, capital allocation, and user governance
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            title="Refresh Metrics"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <Link
            to="/approvals"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
          >
            Underwriting Queue
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Capital Disbursed</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BanknotesIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ₹{Number(metrics?.totalDisbursedAmount || 0).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center text-xs text-emerald-600 font-medium mt-2">
            <ArrowTrendingUpIcon className="w-3.5 h-3.5 mr-1" />
            <span>Active Lending Book</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Collections</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ArrowTrendingUpIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            ₹{Number(metrics?.totalCollections || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Outstanding: ₹{Number(metrics?.totalOutstandingBalance || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Applications Pipeline</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <DocumentCheckIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {metrics?.totalApplications || 0}
          </div>
          <div className="flex items-center space-x-2 text-xs font-medium mt-2">
            <span className="text-amber-600">{metrics?.pendingApplications || 0} Pending</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600">{metrics?.approvedApplications || 0} Sanctioned</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Overdue Installments</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ExclamationTriangleIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">
            {metrics?.overdueInstallmentsCount || 0}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Scheduled automated reminders active
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/approvals"
          className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-6 rounded-2xl shadow hover:shadow-lg transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Underwriting Desk
            </span>
            <ShieldCheckIcon className="w-6 h-6 text-indigo-300 group-hover:scale-110 transition" />
          </div>
          <h3 className="text-lg font-bold mt-3">Review Pending Credit Decisions</h3>
          <p className="text-xs text-indigo-200 mt-1">
            Evaluate applicant credit scores, monthly debt-to-income ratios, and approve or decline requests.
          </p>
          <div className="mt-4 inline-flex items-center text-xs font-semibold text-white underline underline-offset-4">
            Open Queue &rarr;
          </div>
        </Link>

        <Link
          to="/loans"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Loan Accounts
            </span>
            <BanknotesIcon className="w-6 h-6 text-slate-500 group-hover:scale-110 transition" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-3">Inspect Disbursed Portfolios</h3>
          <p className="text-xs text-slate-500 mt-1">
            Access active loan accounts, audit interest rates, amortization schedules, and balance recoveries.
          </p>
          <div className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 underline underline-offset-4">
            View All Accounts &rarr;
          </div>
        </Link>

        <Link
          to="/payments"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Audit & Ledger
            </span>
            <ArrowTrendingUpIcon className="w-6 h-6 text-slate-500 group-hover:scale-110 transition" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-3">Repayment Transaction Logs</h3>
          <p className="text-xs text-slate-500 mt-1">
            Real-time reconciliation of UPI, Net Banking, and Auto-Debit repayments across all borrowers.
          </p>
          <div className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 underline underline-offset-4">
            Open Payment Ledger &rarr;
          </div>
        </Link>
      </div>

      {/* User Governance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Registered System Users & Access</h3>
            <p className="text-xs text-slate-500">Manage borrower profiles and loan officer authority</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            {users.length} Total Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">Credit Score</th>
                <th className="px-6 py-3.5">Account Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{u.fullName}</div>
                    <div className="text-xs text-slate-400 font-mono">@{u.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-800">{u.email}</div>
                    <div className="text-xs text-slate-400">{u.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                      u.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : u.role === 'UNDERWRITER' || u.role === 'LOAN_OFFICER'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                    {u.creditScore || '750 (Default)'}
                  </td>
                  <td className="px-6 py-4">
                    {u.enabled !== false ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircleIcon className="w-3.5 h-3.5 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        <XCircleIcon className="w-3.5 h-3.5 mr-1" /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.id !== user?.id && (
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                          u.enabled !== false
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.enabled !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

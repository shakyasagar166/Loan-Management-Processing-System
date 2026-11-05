import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loanService } from '../services/loanService';
import {
  CreditCardIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function MyLoans() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const isStaff = user?.role === 'ADMIN' || user?.role === 'LOAN_OFFICER' || user?.role === 'UNDERWRITER';

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = isStaff ? await loanService.getAllAccounts() : await loanService.getMyAccounts();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching loan accounts:', err);
      setError('Failed to load active loan accounts.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = accounts.filter(acc => {
    if (filter === 'ACTIVE') return acc.status === 'ACTIVE';
    if (filter === 'CLOSED') return acc.status === 'CLOSED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>;
      case 'CLOSED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Closed</span>;
      case 'DEFAULTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">Defaulted</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isStaff ? 'All Disbursed Loan Accounts' : 'My Disbursed Loans'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your sanctioned accounts, inspect amortization tables, and repay monthly EMIs
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/apply"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Apply for New Loan
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        {['ALL', 'ACTIVE', 'CLOSED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
              filter === tab
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'ALL' ? 'All Loans' : tab === 'ACTIVE' ? 'Active Loans' : 'Closed / Paid Off'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">{error}</div>
      ) : filteredAccounts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <CreditCardIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">No loan accounts found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {filter === 'ALL'
              ? 'You do not have any disbursed loan accounts currently. Submit a loan application to get started.'
              : `You do not have any ${filter.toLowerCase()} loans at this moment.`}
          </p>
          <div className="mt-5">
            <Link
              to="/apply"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              Browse Loan Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => {
            const principal = Number(account.loanAmount || 0);
            const remaining = Number(account.remainingBalance || 0);
            const paid = Math.max(0, principal - remaining);
            const progress = principal > 0 ? Math.min(100, Math.round((paid / principal) * 100)) : 0;

            return (
              <div
                key={account.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                        {account.accountNumber}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                        {account.loanType?.name || 'Sanctioned Loan'}
                      </h3>
                      {isStaff && account.user && (
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">
                          Borrower: {account.user.fullName} ({account.user.email})
                        </p>
                      )}
                    </div>
                    {getStatusBadge(account.status)}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500">Sanctioned Amount</div>
                      <div className="text-base font-bold text-slate-900 flex items-center mt-0.5">
                        ₹{Number(account.loanAmount || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Monthly EMI</div>
                      <div className="text-base font-bold text-indigo-700 flex items-center mt-0.5">
                        ₹{Number(account.monthlyEmi || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Interest Rate</div>
                      <div className="text-sm font-semibold text-slate-700 mt-0.5">
                        {account.interestRate}% p.a.
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Tenure</div>
                      <div className="text-sm font-semibold text-slate-700 mt-0.5">
                        {account.tenureMonths} Months
                      </div>
                    </div>
                  </div>

                  {/* Repayment Progress */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Repaid: ₹{paid.toLocaleString('en-IN')}</span>
                      <span className="font-semibold text-slate-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Remaining: ₹{remaining.toLocaleString('en-IN')}</span>
                      <span>Disbursed: {account.disbursedDate ? new Date(account.disbursedDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/payments?account=${account.id}`}
                    className="text-xs font-medium text-slate-600 hover:text-indigo-600 inline-flex items-center space-x-1"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Receipts</span>
                  </Link>

                  <Link
                    to={`/emi-schedule/${account.id}`}
                    className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 space-x-1"
                  >
                    <span>EMI Schedule & Pay</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loanService } from '../services/loanService';
import { paymentService } from '../services/paymentService';
import {
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CreditCardIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function EMISchedule() {
  const { accountId } = useParams();
  const { user } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(accountId || '');
  const [currentAccount, setCurrentAccount] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEmi, setActiveEmi] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  useEffect(() => {
    if (selectedAccountId) {
      loadAccountSchedule(selectedAccountId);
    }
  }, [selectedAccountId]);

  const fetchAccounts = async () => {
    try {
      const isStaff = user?.role === 'ADMIN' || user?.role === 'LOAN_OFFICER';
      const data = isStaff ? await loanService.getAllAccounts() : await loanService.getMyAccounts();
      const list = Array.isArray(data) ? data : [];
      setAccounts(list);

      if (!selectedAccountId && list.length > 0) {
        setSelectedAccountId(list[0].id.toString());
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    }
  };

  const loadAccountSchedule = async (accId) => {
    setLoading(true);
    setError('');
    try {
      const [acc, emiList] = await Promise.all([
        loanService.getAccountById(accId),
        loanService.getEMISchedule(accId)
      ]);
      setCurrentAccount(acc);
      setSchedule(Array.isArray(emiList) ? emiList : []);
    } catch (err) {
      console.error('Failed to load schedule:', err);
      setError('Could not retrieve EMI schedule for this loan account.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayment = (emi) => {
    setActiveEmi(emi);
    setPaymentSuccess('');
    setPaymentError('');
    setIsModalOpen(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!activeEmi || !currentAccount) return;

    setPaymentProcessing(true);
    setPaymentError('');
    try {
      await paymentService.processRepayment({
        loanAccountId: currentAccount.id,
        emiScheduleId: activeEmi.id,
        amount: activeEmi.emiAmount,
        paymentMethod: paymentMethod,
        transactionRef: 'TXN-' + Math.floor(100000000 + Math.random() * 900000000)
      });

      setPaymentSuccess(`EMI #${activeEmi.installmentNumber} payment of ₹${Number(activeEmi.emiAmount).toLocaleString('en-IN')} was processed successfully!`);
      // Reload schedule & account
      loadAccountSchedule(currentAccount.id);
      setTimeout(() => {
        setIsModalOpen(false);
        setActiveEmi(null);
      }, 1500);
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.response?.data?.message || 'Repayment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircleIcon className="w-3.5 h-3.5 mr-1" /> Paid
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <ExclamationCircleIcon className="w-3.5 h-3.5 mr-1" /> Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <ClockIcon className="w-3.5 h-3.5 mr-1" /> Pending
          </span>
        );
    }
  };

  const totalInstallments = schedule.length;
  const paidCount = schedule.filter((s) => s.status === 'PAID').length;
  const pendingCount = schedule.filter((s) => s.status === 'PENDING').length;
  const overdueCount = schedule.filter((s) => s.status === 'OVERDUE').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/loans"
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">EMI Amortization Schedule</h1>
            <p className="text-sm text-slate-500">Track monthly installments, breakdown of principal & interest, and make payments</p>
          </div>
        </div>

        {/* Account Switcher */}
        {accounts.length > 1 && (
          <div className="flex items-center space-x-2">
            <label className="text-xs font-medium text-slate-500">Select Loan:</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} - {acc.loanType?.name} (₹{Number(acc.loanAmount).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Account Overview Cards */}
      {currentAccount && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Sanctioned Principal</span>
            <div className="text-xl font-bold text-slate-900 mt-1">
              ₹{Number(currentAccount.loanAmount || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">{currentAccount.accountNumber}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Monthly EMI</span>
            <div className="text-xl font-bold text-indigo-600 mt-1">
              ₹{Number(currentAccount.monthlyEmi || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1">{currentAccount.interestRate}% Annual Interest</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Outstanding Balance</span>
            <div className="text-xl font-bold text-rose-600 mt-1">
              ₹{Number(currentAccount.remainingBalance || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {currentAccount.tenureMonths} Months Tenure
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500">Repayment Status</span>
            <div className="text-sm font-bold text-slate-800 mt-1 flex items-center space-x-2">
              <span className="text-emerald-600">{paidCount} Paid</span>
              <span className="text-slate-300">/</span>
              <span className="text-amber-600">{pendingCount} Due</span>
              {overdueCount > 0 && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-rose-600">{overdueCount} Overdue</span>
                </>
              )}
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${totalInstallments ? Math.round((paidCount / totalInstallments) * 100) : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">{error}</div>
      ) : schedule.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <CalendarDaysIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No EMI schedule generated</h3>
          <p className="text-sm text-slate-500 mt-1">
            There are no installments listed for this loan account.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Monthly Installment Breakdown</h3>
            <span className="text-xs text-slate-500">{schedule.length} Total Installments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">#</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">EMI Amount</th>
                  <th className="px-6 py-3.5">Principal</th>
                  <th className="px-6 py-3.5">Interest</th>
                  <th className="px-6 py-3.5">Remaining Balance</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedule.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-mono font-medium text-slate-800">
                      {item.installmentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.dueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ₹{Number(item.emiAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-emerald-700 font-medium">
                      ₹{Number(item.principalComponent).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-amber-700 font-medium">
                      ₹{Number(item.interestComponent).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      ₹{Number(item.remainingBalance).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {item.status === 'PAID' ? (
                        <span className="text-xs text-slate-400 font-medium">Paid on {item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'N/A'}</span>
                      ) : (
                        <button
                          onClick={() => handleOpenPayment(item)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                        >
                          Pay EMI
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isModalOpen && activeEmi && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <CreditCardIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800">Pay EMI Installment #{activeEmi.installmentNumber}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="p-6 space-y-4">
              {paymentSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{paymentSuccess}</span>
                </div>
              )}

              {paymentError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
                  {paymentError}
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Due Date:</span>
                  <span className="font-medium text-slate-800">
                    {new Date(activeEmi.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Principal Component:</span>
                  <span className="font-medium text-emerald-700">
                    ₹{Number(activeEmi.principalComponent).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Interest Component:</span>
                  <span className="font-medium text-amber-700">
                    ₹{Number(activeEmi.interestComponent).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold">
                  <span className="text-slate-900">Total Payable:</span>
                  <span className="text-indigo-600">
                    ₹{Number(activeEmi.emiAmount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['UPI', 'NET_BANKING', 'DEBIT_CARD', 'AUTO_DEBIT'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition text-center ${
                        paymentMethod === method
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  {paymentProcessing && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>Confirm Repayment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

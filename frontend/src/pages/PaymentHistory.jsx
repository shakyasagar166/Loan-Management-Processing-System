import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/paymentService';
import {
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline';

export default function PaymentHistory() {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const accountFilterParam = searchParams.get('account') || '';

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'LOAN_OFFICER';

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = isStaff ? await paymentService.getAllPayments() : await paymentService.getMyPayments();
      let list = Array.isArray(data) ? data : [];
      if (accountFilterParam) {
        list = list.filter((p) => p.loanAccount && p.loanAccount.id.toString() === accountFilterParam);
      }
      setPayments(list);
    } catch (err) {
      console.error('Failed to load payments:', err);
      setError('Failed to load repayment transaction records.');
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const successCount = payments.filter((p) => p.status === 'SUCCESS').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Repayment & Transaction History</h1>
          <p className="text-sm text-slate-500">
            View all loan repayments, generate digital receipts, and audit transaction records
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/loans"
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            View Active Loans
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <BanknotesIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Total Repaid</span>
            <div className="text-xl font-bold text-slate-900">
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Successful Repayments</span>
            <div className="text-xl font-bold text-indigo-700">{successCount} Transactions</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
            <ReceiptPercentIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Total Records</span>
            <div className="text-xl font-bold text-slate-800">{payments.length} Entries</div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">{error}</div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <BanknotesIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No repayment records found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Once you make an EMI installment payment, your transaction receipt and timestamp will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Transaction ID</th>
                  <th className="px-6 py-3.5">Loan Account</th>
                  <th className="px-6 py-3.5">Payment Date</th>
                  <th className="px-6 py-3.5">Amount Paid</th>
                  <th className="px-6 py-3.5">Method</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-700">
                      {p.transactionId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {p.loanAccount?.accountNumber || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {p.loanAccount?.loanType?.name || 'Loan'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {new Date(p.paymentDate).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircleIcon className="w-3.5 h-3.5 mr-1" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                          <XCircleIcon className="w-3.5 h-3.5 mr-1" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        <PrinterIcon className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="p-8 space-y-6">
              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                      ₹
                    </div>
                    <span className="text-lg font-bold text-slate-900 tracking-tight">LoanExpress</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Official Payment Receipt & Confirmation</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                    PAID VERIFIED
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Ref: {selectedReceipt.transactionId}
                  </div>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block">Borrower / Payer</span>
                    <span className="font-semibold text-slate-800">
                      {selectedReceipt.user?.fullName || user?.fullName || 'Verified Customer'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Date & Time</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(selectedReceipt.paymentDate).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Loan Account</span>
                    <span className="font-mono font-medium text-slate-800">
                      {selectedReceipt.loanAccount?.accountNumber || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Payment Method</span>
                    <span className="font-semibold text-slate-800">{selectedReceipt.paymentMethod}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-slate-500">EMI Repayment Installment</span>
                    <span className="font-medium text-slate-800">
                      ₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-slate-500">Convenience Charges / GST</span>
                    <span className="font-medium text-emerald-600">₹0.00 (Waived)</span>
                  </div>
                  <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-base font-bold">
                    <span className="text-slate-900">Total Paid:</span>
                    <span className="text-indigo-600">
                      ₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Notice */}
              <div className="text-center text-xs text-slate-400">
                This is a computer generated receipt issued by LoanExpress Core Banking Platform.
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm flex items-center space-x-2"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

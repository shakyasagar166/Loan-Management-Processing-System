import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loanService } from '../services/loanService';
import { useAuth } from '../context/AuthContext';
import { Send, Calculator, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const ApplyLoan = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState(location.state?.selectedLoanTypeId || '');
  const [requestedAmount, setRequestedAmount] = useState(500000);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || 75000);
  const [purpose, setPurpose] = useState('');
  const [employmentType, setEmploymentType] = useState('Salaried');
  const [estimatedEmi, setEstimatedEmi] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  const fetchLoanTypes = async () => {
    try {
      const data = await loanService.getLoanTypes();
      setLoanTypes(data);
      if (!selectedTypeId && data.length > 0) {
        setSelectedTypeId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedLoanType = loanTypes.find(t => t.id === Number(selectedTypeId));

  // Recalculate EMI whenever amount, tenure, or loan type changes
  useEffect(() => {
    if (selectedLoanType && requestedAmount && tenureMonths) {
      const rate = selectedLoanType.interestRate;
      const r = (rate / 100.0) / 12.0;
      const p = parseFloat(requestedAmount);
      const n = parseInt(tenureMonths);

      if (r > 0 && n > 0 && p > 0) {
        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEstimatedEmi(Math.round(emi));
      }
    }
  }, [selectedLoanType, requestedAmount, tenureMonths]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await loanService.submitApplication({
        loanTypeId: selectedTypeId,
        requestedAmount: requestedAmount,
        tenureMonths: tenureMonths,
        monthlyIncome: monthlyIncome,
        purpose: purpose,
        employmentType: employmentType
      });
      // Redirect to upload documents for this application
      navigate('/documents', { state: { applicationId: result.id, applicationNumber: result.applicationNumber } });
    } catch (err) {
      setError(err.response?.data?.message || 'Loan application submission failed.');
    } finally {
      setSubmitting(false);
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Apply for Digital Loan
        </h1>
        <p className="text-xs text-slate-500">
          Complete the digital application form to initiate underwriting assessment and instant loan eligibility.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Loan Product Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Loan Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {loanTypes.map((type) => (
              <button
                type="button"
                key={type.id}
                onClick={() => setSelectedTypeId(type.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTypeId === type.id
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{type.name}</div>
                <div className="text-xs font-semibold text-emerald-600 mt-1">{type.interestRate}% p.a.</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Up to ₹{Number(type.maxAmount).toLocaleString('en-IN')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount & Tenure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Requested Loan Amount (₹)
              </label>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                ₹{Number(requestedAmount).toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="number"
              required
              min={selectedLoanType?.minAmount || 50000}
              max={selectedLoanType?.maxAmount || 10000000}
              step={10000}
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tenure (Months)
              </label>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {tenureMonths} Months ({Math.round(tenureMonths / 12 * 10) / 10} Yrs)
              </span>
            </div>
            <input
              type="number"
              required
              min={selectedLoanType?.minTenureMonths || 6}
              max={selectedLoanType?.maxTenureMonths || 360}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Live EMI Banner */}
        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Estimated Monthly EMI</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
              ₹{Number(estimatedEmi).toLocaleString('en-IN')}
              <span className="text-xs text-slate-400 font-normal"> / month</span>
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>Applicable Rate: <span className="text-white font-semibold">{selectedLoanType?.interestRate}%</span></p>
            <p>Processing: <span className="text-white font-semibold">{selectedLoanType?.processingFeePercentage || 1}%</span></p>
          </div>
        </div>

        {/* Income & Employment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Monthly Net Income (₹)
            </label>
            <input
              type="number"
              required
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="85000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Employment Type
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Salaried">Salaried (Corporate / Govt)</option>
              <option value="Self-Employed Professional">Self-Employed Professional</option>
              <option value="Business Owner / MSME">Business Owner / MSME</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Purpose of Loan
          </label>
          <textarea
            rows="2"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. Home purchase, educational semester fee, wedding, medical urgency..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Submit & Proceed to Document Upload</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ApplyLoan;

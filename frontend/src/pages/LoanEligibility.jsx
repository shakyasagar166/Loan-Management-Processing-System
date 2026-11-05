import React, { useState, useEffect } from 'react';
import { loanService } from '../services/loanService';
import { eligibilityService } from '../services/eligibilityService';
import { useAuth } from '../context/AuthContext';
import { Calculator, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoanEligibility = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || 85000);
  const [existingEmi, setExistingEmi] = useState(5000);
  const [requestedAmount, setRequestedAmount] = useState(2000000);
  const [tenureMonths, setTenureMonths] = useState(120);
  const [creditScore, setCreditScore] = useState(user?.creditScore || 750);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const data = await loanService.getLoanTypes();
        setLoanTypes(data);
        if (data.length > 0) setSelectedTypeId(data[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLoanTypes();
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await eligibilityService.calculateEligibility({
        loanTypeId: selectedTypeId,
        monthlyIncome: parseFloat(monthlyIncome),
        existingEmiObligations: parseFloat(existingEmi),
        requestedAmount: parseFloat(requestedAmount),
        tenureMonths: parseInt(tenureMonths),
        creditScore: parseInt(creditScore)
      });
      setResult(res);
    } catch (err) {
      alert('Eligibility calculation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Loan Eligibility & FOIR Engine
        </h1>
        <p className="text-xs text-slate-500">
          Automated Fixed Obligation to Income Ratio (FOIR) underwriting simulator based on RBI and banking standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs */}
        <form onSubmit={handleCalculate} className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Loan Product
            </label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {loanTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.interestRate}% p.a.)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Monthly Net Salary / Income (₹)
              </label>
              <input
                type="number"
                required
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Existing Monthly EMIs (₹)
              </label>
              <input
                type="number"
                value={existingEmi}
                onChange={(e) => setExistingEmi(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Desired Borrowing Amount (₹)
              </label>
              <input
                type="number"
                required
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tenure (Months)
              </label>
              <input
                type="number"
                required
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Credit Score (CIBIL / Experian)
              </label>
              <span className="text-xs font-bold text-emerald-700">{creditScore}</span>
            </div>
            <input
              type="range"
              min="500"
              max="900"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              className="w-full accent-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                <span>Calculate Eligibility Now</span>
              </>
            )}
          </button>
        </form>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Eligibility Verdict</h3>
          </div>

          {result ? (
            <div className="space-y-4 text-xs">
              <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                result.eligible
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                {result.eligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {result.eligible ? 'Approved for Lending' : 'Eligibility Conditional / Declined'}
                  </h4>
                  <p className="mt-1 leading-relaxed text-[11px]">{result.remarks}</p>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Loan Capacity:</span>
                  <span className="font-bold text-slate-900">
                    ₹{Number(result.maxEligibleAmount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated New EMI:</span>
                  <span className="font-bold text-emerald-700">
                    ₹{Number(result.estimatedEmi).toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">FOIR (Fixed Obligation):</span>
                  <span className="font-bold text-slate-900">{result.fixedObligationToIncomeRatio}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk Assessment:</span>
                  <span className="font-semibold text-emerald-700">{result.riskCategory}</span>
                </div>
              </div>

              {result.eligible && (
                <button
                  onClick={() => navigate('/apply', { state: { selectedLoanTypeId: selectedTypeId } })}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
                >
                  <span>Proceed with Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Adjust your financial inputs and click "Calculate Eligibility Now" to see underwriting results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanEligibility;

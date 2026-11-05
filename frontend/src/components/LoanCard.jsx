import React from 'react';
import { Landmark, ArrowRight, Percent, Calendar, ShieldCheck } from 'lucide-react';

const LoanCard = ({ loanType, onApply, onCheckEligibility }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <Landmark className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            {loanType.interestRate}% p.a.
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900">{loanType.name}</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed min-h-[36px]">
          {loanType.description}
        </p>

        <div className="space-y-2 py-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Borrowing Limit:</span>
            <span className="font-semibold text-slate-800">
              ₹{Number(loanType.minAmount).toLocaleString('en-IN')} - ₹{Number(loanType.maxAmount).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Tenure Range:</span>
            <span className="font-semibold text-slate-800">
              {loanType.minTenureMonths} to {loanType.maxTenureMonths} months
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Processing Fee:</span>
            <span className="font-semibold text-slate-800">
              {loanType.processingFeePercentage || 1.0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Min. Credit Score:</span>
            <span className="font-semibold text-emerald-700">
              {loanType.minCreditScore || 650}+
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
        <button
          onClick={() => onApply(loanType)}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center space-x-1"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onCheckEligibility(loanType)}
          className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-xs transition-colors"
        >
          Check Eligibility
        </button>
      </div>
    </div>
  );
};

export default LoanCard;

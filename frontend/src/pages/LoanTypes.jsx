import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanService } from '../services/loanService';
import LoanCard from '../components/LoanCard';

const LoanTypes = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  const fetchLoanTypes = async () => {
    try {
      const data = await loanService.getLoanTypes();
      setLoanTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (loanType) => {
    navigate('/apply', { state: { selectedLoanTypeId: loanType.id } });
  };

  const handleCheckEligibility = (loanType) => {
    navigate('/eligibility', { state: { selectedLoanTypeId: loanType.id } });
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
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Retail & Enterprise Loan Products
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Transparent interest rates, minimal paperwork, flexible tenures up to 30 years, and quick digital disbursements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loanTypes.map((type) => (
          <LoanCard
            key={type.id}
            loanType={type}
            onApply={handleApply}
            onCheckEligibility={handleCheckEligibility}
          />
        ))}
      </div>
    </div>
  );
};

export default LoanTypes;

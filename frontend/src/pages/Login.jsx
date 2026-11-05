import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('customer');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div>
          <div className="mx-auto w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Landmark className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
            Sign in to ApexCredit
          </h2>
          <p className="mt-1 text-center text-xs text-slate-500">
            Digital Loan Origination, Underwriting & Repayment Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Credentials */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs text-slate-600 space-y-2">
          <p className="font-semibold text-slate-700">Quick Demo Logins (password: password123):</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer', 'password123')}
              className="py-1 px-2 bg-white rounded border border-slate-300 hover:border-emerald-500 text-emerald-700 font-medium text-center text-[11px] transition-colors"
            >
              Borrower (Amit)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('officer', 'password123')}
              className="py-1 px-2 bg-white rounded border border-slate-300 hover:border-emerald-500 text-blue-700 font-medium text-center text-[11px] transition-colors"
            >
              Loan Officer (Rajesh)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('underwriter', 'password123')}
              className="py-1 px-2 bg-white rounded border border-slate-300 hover:border-emerald-500 text-purple-700 font-medium text-center text-[11px] transition-colors"
            >
              Underwriter (Vikram)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'password123')}
              className="py-1 px-2 bg-white rounded border border-slate-300 hover:border-emerald-500 text-indigo-700 font-medium text-center text-[11px] transition-colors"
            >
              System Admin
            </button>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="customer / officer / underwriter / admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          New borrower?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Register your profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, LogOut, User, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-md shadow-emerald-500/20">
              <Landmark className="w-5 h-5" />
            </div>
            <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors">
              Apex<span className="text-emerald-400">Credit</span> Solutions
            </Link>
            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
              Lending Engine v1.0
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/loan-types"
                  className="hidden sm:inline-flex text-sm text-slate-300 hover:text-white font-medium transition-colors"
                >
                  Loan Products
                </Link>
                <Link
                  to="/eligibility"
                  className="hidden sm:inline-flex text-sm text-slate-300 hover:text-white font-medium transition-colors"
                >
                  Eligibility Engine
                </Link>
                <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium leading-none text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-emerald-400 mt-1">{user?.role?.replace('ROLE_', '')}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Profile"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoanTypes from './pages/LoanTypes';
import ApplyLoan from './pages/ApplyLoan';
import MyApplications from './pages/MyApplications';
import LoanEligibility from './pages/LoanEligibility';
import UploadDocuments from './pages/UploadDocuments';
import LoanStatus from './pages/LoanStatus';
import LoanApproval from './pages/LoanApproval';
import MyLoans from './pages/MyLoans';
import EMISchedule from './pages/EMISchedule';
import PaymentHistory from './pages/PaymentHistory';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main App Routes */}
          <Route element={<MainLayout />}>
            {/* Publicly Accessible Information */}
            <Route path="/loan-types" element={<LoanTypes />} />
            <Route path="/eligibility" element={<LoanEligibility />} />

            {/* Authenticated Customer Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/apply" element={<ApplyLoan />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/applications/:id" element={<LoanStatus />} />
              <Route path="/status/:id" element={<LoanStatus />} />
              <Route path="/loans" element={<MyLoans />} />
              <Route path="/emi-schedule" element={<EMISchedule />} />
              <Route path="/emi-schedule/:accountId" element={<EMISchedule />} />
              <Route path="/payments" element={<PaymentHistory />} />
              <Route path="/documents" element={<UploadDocuments />} />
              <Route path="/documents/:applicationId" element={<UploadDocuments />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Staff / Underwriting / Admin Routes */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={['ADMIN', 'LOAN_OFFICER', 'UNDERWRITER']}
                />
              }
            >
              <Route path="/approvals" element={<LoanApproval />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

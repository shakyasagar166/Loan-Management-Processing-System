import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  UserCircleIcon,
  IdentificationIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    panNumber: '',
    aadhaarNumber: '',
    employmentType: 'SALARIED',
    monthlyIncome: '',
    creditScore: 750
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getProfile();
      setProfile(data);
      setFormData({
        fullName: data.fullName || '',
        phone: data.phone || '',
        address: data.address || '',
        panNumber: data.panNumber || '',
        aadhaarNumber: data.aadhaarNumber || '',
        employmentType: data.employmentType || 'SALARIED',
        monthlyIncome: data.monthlyIncome || '',
        creditScore: data.creditScore || 750
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
      // Fallback to local user
      if (user) {
        setFormData({
          fullName: user.fullName || '',
          phone: user.phone || '',
          address: user.address || '',
          panNumber: user.panNumber || '',
          aadhaarNumber: user.aadhaarNumber || '',
          employmentType: user.employmentType || 'SALARIED',
          monthlyIncome: user.monthlyIncome || '',
          creditScore: user.creditScore || 750
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const updated = await authService.updateProfile(formData);
      setProfile(updated);
      setSuccessMsg('Your personal and financial profile was updated successfully.');
    } catch (err) {
      console.error('Update failed:', err);
      setErrorMsg('Failed to update profile information.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900">{profile?.fullName || user?.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-mono mt-0.5">@{user?.username} • {user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Credit Score</div>
            <div className="text-xl font-extrabold text-emerald-600 mt-0.5">
              {profile?.creditScore || 750} <span className="text-xs font-normal text-slate-500">/ 900</span>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Excellent Rating
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Account Status</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5 flex items-center space-x-1">
              <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
              <span>Verified</span>
            </div>
            <span className="text-[11px] text-slate-400">KYC Compliant</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Personal & Financial Profile</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Your details are used by our automated underwriting engine to determine loan eligibility and interest rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Residential Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House/Flat No, Street, City, State, PIN"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono uppercase text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Aadhaar Card Number
            </label>
            <input
              type="text"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="SALARIED">Salaried Employee</option>
              <option value="SELF_EMPLOYED">Self-Employed / Freelancer</option>
              <option value="BUSINESS">Business Owner / Partner</option>
              <option value="STUDENT">Student / Scholar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Net Monthly Income (₹)
            </label>
            <input
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              placeholder="e.g. 75000"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 flex items-center space-x-2"
          >
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Recommended Tech Certification & Career Upskilling */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-indigo-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
            <AcademicCapIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Enterprise Backend Engineering & Java Certifications</h3>
            <p className="text-xs text-indigo-200">
              Advance your software career with top-rated industry certifications and live project training
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mt-4 leading-relaxed">
          Master Spring Boot 3, Microservices, Cloud Architecture, and Banking Platform Security through industry-recognized corporate programs:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <a
            href="https://uncodemy.com/course/java-training-course-in-noida"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400 hover:bg-white/10 transition group flex items-center justify-between"
          >
            <div>
              <div className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">
                Certification Center Noida
              </div>
              <div className="text-sm font-bold text-white mt-1 group-hover:text-indigo-200 transition">
                Java Training Course in Noida
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full-stack Java development, Spring Cloud, Hibernate & live enterprise banking systems.
              </p>
            </div>
            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition flex-shrink-0 ml-3" />
          </a>

          <a
            href="https://uncodemy.com/course/java-training-course-in-delhi"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400 hover:bg-white/10 transition group flex items-center justify-between"
          >
            <div>
              <div className="text-xs uppercase font-semibold text-indigo-400 tracking-wider">
                Certification Center Delhi
              </div>
              <div className="text-sm font-bold text-white mt-1 group-hover:text-indigo-200 transition">
                Java Training Course in Delhi
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Hands-on enterprise Java masterclass with 100% placement assistance & mentorship.
              </p>
            </div>
            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition flex-shrink-0 ml-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

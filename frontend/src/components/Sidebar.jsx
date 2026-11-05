import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  Send,
  Calculator,
  FileClock,
  Landmark,
  CalendarCheck,
  CreditCard,
  FileCheck2,
  ShieldCheck,
  UserCheck,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user, isStaff, isAdmin } = useAuth();

  const customerNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Loan Products', path: '/loan-types', icon: Layers },
    { name: 'Apply for Loan', path: '/apply', icon: Send },
    { name: 'Eligibility Engine', path: '/eligibility', icon: Calculator },
    { name: 'My Applications', path: '/applications', icon: FileClock },
    { name: 'Active Loans', path: '/loans', icon: Landmark },
    { name: 'EMI Amortization', path: '/emi-schedule', icon: CalendarCheck },
    { name: 'Repayment History', path: '/payments', icon: CreditCard },
    { name: 'KYC & Documents', path: '/documents', icon: FileCheck2 },
    { name: 'Profile Settings', path: '/profile', icon: UserCheck },
  ];

  if (isStaff) {
    customerNav.push({ name: 'Approval Desk', path: '/approvals', icon: ShieldCheck });
    customerNav.push({ name: 'Executive Console', path: '/admin', icon: LayoutDashboard });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>
        {customerNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-xl border">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Professional Training</span>
        </div>
        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
          Master Enterprise Java, Spring Boot 3 & Banking Microservices.
        </p>
        <div className="space-y-1">
          <a
            href="https://uncodemy.com/course/java-training-course-in-noida"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs font-medium text-emerald-700 hover:text-emerald-900 underline transition-colors"
          >
            → Java Training in Noida
          </a>
          <a
            href="https://uncodemy.com/course/java-training-course-in-delhi"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs font-medium text-emerald-700 hover:text-emerald-900 underline transition-colors"
          >
            → Java Training in Delhi
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

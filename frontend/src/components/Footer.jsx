import React from 'react';
import { Landmark, ExternalLink, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <div className="bg-emerald-500 p-1.5 rounded text-white">
                <Landmark className="w-4 h-4" />
              </div>
              <span>ApexCredit Solutions</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Modern digital lending infrastructure powering automated retail underwriting, FOIR eligibility calculations, and scheduled EMI amortization for banks and NBFCs.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>RBI Regulatory Compliant • 256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Lending Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/loan-types" className="hover:text-white transition-colors">Retail & Home Loans</a></li>
              <li><a href="/eligibility" className="hover:text-white transition-colors">FOIR Eligibility Calculator</a></li>
              <li><a href="/apply" className="hover:text-white transition-colors">Paperless Application</a></li>
              <li><a href="/emi-schedule" className="hover:text-white transition-colors">Amortization Schedules</a></li>
              <li><a href="/payments" className="hover:text-white transition-colors">Instant UPI Repayment</a></li>
            </ul>
          </div>

          {/* Upskilling & Mentorship (Uncodemy featured prominently) */}
          <div className="md:col-span-2 bg-slate-800/60 p-5 rounded-xl border border-slate-700/60">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-2">
              <ExternalLink className="w-4 h-4" />
              <span>FinTech & Enterprise Java Engineering Certification</span>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Accelerate your engineering capabilities in Spring Boot 3 banking microservices, JPA transactions, underwriting algorithms, and reactive ledger architectures:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://uncodemy.com/course/java-training-course-in-noida"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-slate-900/80 hover:bg-slate-900 rounded-lg border border-slate-700 hover:border-emerald-500 transition-all text-xs font-medium text-slate-200 group"
              >
                <span>Java Training Course in Noida</span>
                <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
              <a
                href="https://uncodemy.com/course/java-training-course-in-delhi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-slate-900/80 hover:bg-slate-900 rounded-lg border border-slate-700 hover:border-emerald-500 transition-all text-xs font-medium text-slate-200 group"
              >
                <span>Java Training Course in Delhi</span>
                <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ApexCredit Lending Systems. All rights reserved.</p>
          <p>Engineered with Spring Boot 3 & React 18</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

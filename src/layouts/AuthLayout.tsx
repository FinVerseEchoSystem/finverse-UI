import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck, Sparkles, Landmark } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-banking-slate-950 flex font-sans relative overflow-hidden">
      {/* Background radial and floating blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.05),transparent_40%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-banking-indigo-500/10 rounded-full filter blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-banking-cyan-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Left Column: Premium Branding Promo */}
      <div className="hidden lg:flex lg:w-1/2 p-16 flex-col justify-between border-r border-banking-slate-800/40 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-banking-indigo-500 to-banking-cyan-500 flex items-center justify-center shadow-lg shadow-banking-indigo-500/20">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-banking-slate-200 to-banking-slate-400 bg-clip-text text-transparent">
            FinVerse
          </span>
        </div>

        <div className="max-w-md my-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-banking-indigo-500/10 border border-banking-indigo-500/20 text-banking-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Learning Microservices Platform
          </div>
          <h1 className="font-display font-bold text-4xl xl:text-5xl text-white tracking-tight leading-[1.15] mb-6">
            Secure access to your unified financial ecosystem.
          </h1>
          <p className="text-banking-slate-400 text-base leading-relaxed mb-8">
            Experience real-time ledger settlement, automated portfolio tracking, and event-driven notifications, engineered with a resilient microservices architecture.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-banking-indigo-500/10 flex items-center justify-center flex-shrink-0 text-banking-indigo-400 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-banking-slate-200">Zero-Trust Authentication</h4>
                <p className="text-xs text-banking-slate-400">Strict session management with cryptographic tokens and hardware tracking.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-banking-slate-500">
          &copy; {new Date().getFullYear()} FinVerse Banking Group. All rights reserved.
        </div>
      </div>

      {/* Right Column: Auth Forms Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md bg-banking-slate-900/40 backdrop-blur-xl border border-banking-slate-800/60 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/40">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

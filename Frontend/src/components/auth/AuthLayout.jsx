import React from 'react';

export default function AuthLayout({ title, subtitle, badgeText, heroText, children }) {
  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 bg-[#0b0f17]">
      {/* Left Column: Enterprise Branding */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0f172a]/40 border-r border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">
            {badgeText}
          </span>
          <h1 className="text-4xl font-bold text-white mt-4 leading-tight tracking-tight">
            {heroText}
          </h1>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          PARKPULSE PLATFORM v2.4 • ENTERPRISE PARKING TELEMETRY
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
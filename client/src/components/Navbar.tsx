// client/src/components/Navbar.tsx
import React from 'react';
import { Sprout, ShieldCheck, Cpu, Bell, Activity, Sparkles } from 'lucide-react';
import { useTenant, useDashboardStats } from '../hooks/useAgriApi';

export const Navbar: React.FC = () => {
  const { data: tenant } = useTenant();
  const { data: stats } = useDashboardStats();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between">
        {/* Brand & Subsystem Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                AgriSmart AI
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                <Cpu className="w-3 h-3 text-emerald-400" /> Gemini 2.5 Pro / Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              Precision Agriculture & Autonomous Agronomic Advisory Suite
            </p>
          </div>
        </div>

        {/* Telemetry Status & Tenant Capsule */}
        <div className="flex items-center gap-3">
          {/* Active Field Counter */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Plots: <strong className="text-white font-mono">{stats?.registeredFieldsCount ?? 3}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Acreage: <strong className="text-emerald-400 font-mono">{stats?.totalAcres ?? 135.5} ac</strong></span>
          </div>

          {/* Critical Risk Triage Tag */}
          {(stats?.criticalRisksCount ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs px-2.5 py-1 rounded-lg">
              <Bell className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="font-medium">{stats?.criticalRisksCount} Pathogen Alert</span>
            </div>
          )}

          {/* Tenant Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
              {tenant?.fullName ? tenant.fullName.split(' ').map(n => n[0]).join('') : 'EV'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                {tenant?.fullName || 'Dr. Evelyn Vance'}
                <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {tenant?.farmName || 'Vance Precision Agro'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

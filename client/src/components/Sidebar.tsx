// client/src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Sparkles, 
  Microscope, 
  History, 
  FileText,
  ChevronRight,
  TrendingUp,
  Droplets,
  Layers
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useAgriApi';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { data: stats } = useDashboardStats();

  const navItems: NavItem[] = [
    { to: '/', label: 'Executive Dashboard', icon: LayoutDashboard },
    { to: '/fields', label: 'Field Manager', icon: MapPin, badge: stats?.registeredFieldsCount ?? 3 },
    { to: '/advisory/new', label: 'Generate Advisory', icon: Sparkles, highlight: true },
    { to: '/diagnostics', label: 'Visual Crop Doctor', icon: Microscope, badge: stats?.criticalRisksCount ? 'Alert' : undefined },
    { to: '/history', label: 'Advisory Archive', icon: History, badge: stats?.advisoriesCount },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      {/* Primary Navigation List */}
      <div className="p-4 space-y-1.5 flex-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Core Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950/40'
                    : item.highlight
                    ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/20 text-emerald-300 hover:bg-emerald-900/30 border border-emerald-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${item.highlight ? 'text-emerald-400' : ''}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  item.badge === 'Alert'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Mini Quick Telemetry Widget in Sidebar */}
      <div className="p-4 m-3 rounded-xl glass-panel border border-emerald-900/30 bg-gradient-to-b from-slate-900/90 to-emerald-950/20">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Layers className="w-3.5 h-3.5" /> Soil Health
          </span>
          <span className="font-bold text-white">{stats?.averageSoilHealthScore ?? 92}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
            style={{ width: `${stats?.averageSoilHealthScore ?? 92}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
          <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
            <span className="text-[10px] block text-slate-400">Telemetry Feed</span>
            <span className="text-emerald-400 font-mono font-medium">Synchronized</span>
          </div>
          <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
            <span className="text-[10px] block text-slate-400">Engine Node</span>
            <span className="text-amber-400 font-mono font-medium">Gemini Pro</span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-slate-900 text-[11px] text-slate-400 text-center font-mono">
        AgriSmart AI v1.0.4 • ISO 14001 Agronomy
      </div>
    </aside>
  );
};

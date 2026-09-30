// client/src/pages/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  MapPin, 
  Sparkles, 
  Microscope, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight,
  Droplet,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useDashboardStats, useFields, useAdvisories, usePathologyScans } from '../hooks/useAgriApi';
import { WeatherForecastBadge } from '../components/WeatherForecastBadge';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: fields } = useFields();
  const { data: advisories } = useAdvisories();
  const { data: scans } = usePathologyScans();

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 lg:p-8 overflow-hidden border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Agricultural Informatics Platform</span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Precision Field Intelligence & Crop Health Orchestration
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Harnessing Gemini 2.5 Pro for multi-stage soil-climate crop synthesis and Gemini 2.5 Flash for real-time leaf pathology diagnostics.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/advisory/new"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Generate Precision Advisory
            </Link>

            <Link
              to="/diagnostics"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition"
            >
              <Microscope className="w-4 h-4 text-emerald-400" />
              Scan Plant Specimen
            </Link>

            <Link
              to="/fields"
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 flex items-center gap-2 transition"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              Manage Plots ({stats?.registeredFieldsCount ?? 3})
            </Link>
          </div>
        </div>

        {/* Ambient background glow decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Aggregate KPI Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Acreage */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Acreage Under Mgmt</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {stats?.totalAcres ?? 135.5} <span className="text-xs font-sans font-normal text-slate-400">acres</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            Across {stats?.registeredFieldsCount ?? 3} active farm plots
          </span>
        </div>

        {/* Advisory Blueprints */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Active Advisories</span>
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {stats?.advisoriesCount ?? 1}
          </div>
          <span className="text-[11px] text-teal-400 font-mono mt-1 block">
            Phased phenological plans
          </span>
        </div>

        {/* Pathology Scans */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Diagnostic Scans</span>
            <Microscope className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {stats?.scansCount ?? 2}
          </div>
          <span className="text-[11px] text-amber-400 font-mono mt-1 block">
            Multimodal vision reports
          </span>
        </div>

        {/* Soil Health Index */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Avg Soil Health</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {stats?.averageSoilHealthScore ?? 94}%
          </div>
          <span className="text-[11px] text-sky-400 font-mono mt-1 block">
            Stoichiometric index
          </span>
        </div>
      </div>

      {/* Main Grid: Weather Telemetry & Active Field Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weather Telemetry Widget */}
        <div className="lg:col-span-1 space-y-6">
          <WeatherForecastBadge
            temperatureCelsius={28.2}
            rainfallMm={480}
            humidityPercent={64}
            region="Indo-Gangetic Basin Agro-Station #04"
            season="Active Kharif / Monsoon Cycle"
          />

          {/* Quick Critical Alert Banner if any */}
          {(stats?.criticalRisksCount ?? 0) > 0 && (
            <div className="glass-panel-elevated rounded-2xl p-4 border border-rose-800/80 bg-rose-950/30">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>Urgent Pathogen Alert</span>
              </div>
              <p className="text-xs text-slate-300">
                A critical pathogen rating was identified in recent field scans. Immediate vector control & quarantine recommended.
              </p>
              <Link
                to="/diagnostics"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white"
              >
                Review Diagnosis Protocol <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Operational Field Plots & Recent Advisories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Advisories Spotlight */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Active Crop Advisory Blueprints</h3>
                  <p className="text-xs text-slate-400">Synthesized phenological timelines & nutrient splits</p>
                </div>
              </div>
              <Link to="/history" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                View Archive <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {advisories && advisories.length > 0 ? (
              <div className="space-y-3">
                {advisories.slice(0, 3).map((adv) => (
                  <Link
                    key={adv.id}
                    to={`/advisory/${adv.id}`}
                    className="block p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                            {adv.cropName} {adv.variety && `(${adv.variety})`}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {adv.confidenceScore}% Confidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {adv.advisorySummary}
                        </p>
                      </div>

                      <div className="text-right shrink-0 ml-4">
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          {adv.projectedYieldQuintalsPerAcre} qtl/ac
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Projected Yield
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No advisories generated yet. Launch the wizard to build your first plan.
              </div>
            )}
          </div>

          {/* Operational Field Plots Overview */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Operational Field Parcels</h3>
                  <p className="text-xs text-slate-400">Registered farm plots with soil classification</p>
                </div>
              </div>
              <Link to="/fields" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                Manage Fields <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fields?.slice(0, 3).map((f) => (
                <div key={f.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="font-semibold text-white text-xs truncate">{f.name}</h4>
                  <div className="text-lg font-black font-mono text-emerald-400 mt-1">
                    {f.acreage} <span className="text-[10px] font-sans text-slate-400 font-normal">acres</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 space-y-0.5">
                    <div>Soil: <strong className="text-slate-300">{f.soilType}</strong></div>
                    <div>Water: <strong className="text-slate-300">{f.irrigationType.split('(')[0]}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

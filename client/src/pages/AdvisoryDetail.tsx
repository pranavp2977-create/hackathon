// client/src/pages/AdvisoryDetail.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sprout, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  TrendingUp,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { useAdvisory } from '../hooks/useAgriApi';
import { SoilMetricsCard } from '../components/SoilMetricsCard';
import { LifecycleTimeline } from '../components/LifecycleTimeline';
import { EconomicsCard } from '../components/EconomicsCard';

export const AdvisoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: advisory, isLoading, error } = useAdvisory(id);

  const handlePrintPdf = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-4" />
        <h3 className="text-white font-bold text-base">Loading Precision Advisory Blueprint...</h3>
        <p className="text-xs text-slate-400 mt-1">Retrieving stoichiometric models and phased lifecycle actions</p>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-white font-bold text-lg">Advisory Record Not Found</h3>
        <p className="text-xs text-slate-400">The requested agronomic plan ID does not exist or access is restricted.</p>
        <Link to="/history" className="inline-block px-4 py-2 bg-slate-800 text-white rounded-xl text-xs">
          Return to Archive
        </Link>
      </div>
    );
  }

  const plan = advisory.actionPlan;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          to="/history"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Advisory Archive
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            Export Agronomic PDF Report
          </button>
        </div>
      </div>

      {/* Primary Hero Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 lg:p-8 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                {advisory.confidenceScore}% Suitability Score
              </span>
              <span className="text-xs font-mono text-slate-400">
                Synthesized: {new Date(advisory.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              {advisory.cropName} {advisory.variety && <span className="text-emerald-400">({advisory.variety})</span>}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Target Plot: <strong className="text-slate-200">{advisory.fieldName || 'Operational Parcel'}</strong>
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-right">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Projected Net Yield
            </span>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {advisory.projectedYieldQuintalsPerAcre || plan.projectedYieldQuintals} <span className="text-xs font-sans text-slate-300">qtl/acre</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Calibrated to soil stoichiometry</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            Executive Agronomic Assessment:
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            {advisory.advisorySummary}
          </p>
        </div>
      </div>

      {/* Mandatory Soil Amendments & Liming / Gypsum Section */}
      {plan.soilAmendments && plan.soilAmendments.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-800/60 bg-amber-950/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-amber-300 text-sm">
              Prescribed Soil Buffering & Stoichiometric Amendments
            </h3>
          </div>
          <ul className="space-y-2">
            {plan.soilAmendments.map((amendment, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{amendment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Soil Telemetry & Economics Cards Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoilMetricsCard
          nitrogenPpm={advisory.soilNitrogenPpm ?? 135}
          phosphorusPpm={advisory.soilPhosphorusPpm ?? 22}
          potassiumPpm={advisory.soilPotassiumPpm ?? 195}
          ph={advisory.soilPh ?? 5.5}
        />

        <EconomicsCard
          outlook={plan.economicOutlook}
          cropName={advisory.cropName}
          projectedYieldQuintals={advisory.projectedYieldQuintalsPerAcre || plan.projectedYieldQuintals}
        />
      </div>

      {/* Phased Phenological Lifecycle Timeline */}
      <LifecycleTimeline
        phases={plan.lifecyclePhases}
        cropName={advisory.cropName}
      />
    </div>
  );
};

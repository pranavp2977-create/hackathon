// client/src/components/SoilMetricsCard.tsx
import React from 'react';
import { Gauge, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

interface SoilMetricsProps {
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  ph: number;
  organicCarbonPercent?: number;
  compact?: boolean;
}

export const SoilMetricsCard: React.FC<SoilMetricsProps> = ({
  nitrogenPpm,
  phosphorusPpm,
  potassiumPpm,
  ph,
  organicCarbonPercent = 0.65,
  compact = false
}) => {
  // Agronomic assessment helpers
  const getNitrogenStatus = (val: number) => {
    if (val < 140) return { label: 'Deficient (Low)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', pct: Math.min((val / 300) * 100, 100) };
    if (val <= 280) return { label: 'Optimal Safe Zone', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', pct: Math.min((val / 300) * 100, 100) };
    return { label: 'Surplus (Excess)', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30', pct: 100 };
  };

  const getPhosphorusStatus = (val: number) => {
    if (val < 20) return { label: 'Deficient (Low)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', pct: Math.min((val / 60) * 100, 100) };
    if (val <= 50) return { label: 'Optimal Safe Zone', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', pct: Math.min((val / 60) * 100, 100) };
    return { label: 'Elevated High', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30', pct: 100 };
  };

  const getPotassiumStatus = (val: number) => {
    if (val < 150) return { label: 'Deficient (Low)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', pct: Math.min((val / 350) * 100, 100) };
    if (val <= 300) return { label: 'Optimal Safe Zone', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', pct: Math.min((val / 350) * 100, 100) };
    return { label: 'Very High', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30', pct: 100 };
  };

  const getPhStatus = (val: number) => {
    if (val < 5.5) return { label: 'Strongly Acidic (Liming Mandatory)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', bracket: 'Acidic Danger' };
    if (val < 6.2) return { label: 'Slightly Acidic', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', bracket: 'Mild Acid' };
    if (val <= 7.5) return { label: 'Optimal Agronomic Buffer', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', bracket: 'Neutral/Ideal' };
    if (val <= 7.8) return { label: 'Mildly Alkaline', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', bracket: 'Alkaline' };
    return { label: 'Strongly Alkaline (Gypsum/Sulfur Needed)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', bracket: 'High Sodic' };
  };

  const nStatus = getNitrogenStatus(nitrogenPpm);
  const pStatus = getPhosphorusStatus(phosphorusPpm);
  const kStatus = getPotassiumStatus(potassiumPpm);
  const phStatus = getPhStatus(ph);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Soil Stoichiometry & N-P-K Telemetry</h3>
            <p className="text-xs text-slate-400">Electrochemical nutrient titration & pH balance</p>
          </div>
        </div>
        <span className="text-xs font-mono bg-slate-900 px-2.5 py-1 rounded-full text-slate-300 border border-slate-800">
          SOC: <strong className="text-emerald-400">{organicCarbonPercent}%</strong>
        </span>
      </div>

      {/* pH Master Gauge Banner */}
      <div className={`p-3.5 rounded-xl border mb-4 flex items-center justify-between ${phStatus.bg}`}>
        <div className="flex items-center gap-3">
          <div className="text-center font-mono">
            <span className="text-[10px] block text-slate-400 uppercase tracking-wider">Soil pH</span>
            <span className={`text-2xl font-black ${phStatus.color}`}>{ph.toFixed(1)}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className={`text-xs font-semibold ${phStatus.color}`}>{phStatus.label}</div>
            <div className="text-[11px] text-slate-400">
              Target Agronomic Tolerance Bracket: <span className="font-mono text-slate-300">6.0 — 7.5 pH</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
            {ph < 5.5 ? '⚠️ Prescribe CaCO3 Lime' : ph > 7.8 ? '⚠️ Prescribe Gypsum/Sulfur' : '✓ Cation Exchange Balanced'}
          </span>
        </div>
      </div>

      {/* NPK Horizontal Gauge Grids */}
      <div className="space-y-3.5">
        {/* Nitrogen */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sky-400 font-mono">N</span>
              <span className="font-medium text-slate-200">Available Nitrogen</span>
              <span className="text-[10px] text-slate-400">(mg/kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${nStatus.bg} ${nStatus.color}`}>
                {nStatus.label}
              </span>
              <span className="font-mono font-bold text-white">{nitrogenPpm} ppm</span>
            </div>
          </div>
          {/* Progress with safe zone marker */}
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-sky-400 rounded-full transition-all duration-700"
              style={{ width: `${nStatus.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0</span>
            <span className="text-emerald-400">Optimal Range: 140 - 280 ppm</span>
            <span>300+</span>
          </div>
        </div>

        {/* Phosphorus */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-400 font-mono">P</span>
              <span className="font-medium text-slate-200">Available Phosphorus (Olsen-P)</span>
              <span className="text-[10px] text-slate-400">(mg/kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${pStatus.bg} ${pStatus.color}`}>
                {pStatus.label}
              </span>
              <span className="font-mono font-bold text-white">{phosphorusPpm} ppm</span>
            </div>
          </div>
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${pStatus.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0</span>
            <span className="text-emerald-400">Optimal Range: 20 - 50 ppm</span>
            <span>60+</span>
          </div>
        </div>

        {/* Potassium */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-400 font-mono">K</span>
              <span className="font-medium text-slate-200">Exchangeable Potassium</span>
              <span className="text-[10px] text-slate-400">(mg/kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${kStatus.bg} ${kStatus.color}`}>
                {kStatus.label}
              </span>
              <span className="font-mono font-bold text-white">{potassiumPpm} ppm</span>
            </div>
          </div>
          <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-300 rounded-full transition-all duration-700"
              style={{ width: `${kStatus.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0</span>
            <span className="text-emerald-400">Optimal Range: 150 - 300 ppm</span>
            <span>350+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

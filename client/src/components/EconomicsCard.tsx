// client/src/components/EconomicsCard.tsx
import React from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Scale, ShieldAlert } from 'lucide-react';
import { EconomicOutlook } from '@shared/schema';

interface EconomicsCardProps {
  outlook: EconomicOutlook;
  cropName: string;
  projectedYieldQuintals: number;
}

export const EconomicsCard: React.FC<EconomicsCardProps> = ({
  outlook,
  cropName,
  projectedYieldQuintals
}) => {
  const netProfit = outlook.estimatedRevenuePerAcre - outlook.estimatedCostPerAcre;
  const roiPercent = Math.round((netProfit / outlook.estimatedCostPerAcre) * 100);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Economic Outlook & Revenue Forecast</h3>
            <p className="text-xs text-slate-400">Yield monetization model for {cropName}</p>
          </div>
        </div>
        <span className="text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          ROI +{roiPercent}%
        </span>
      </div>

      {/* Grid of Key Financials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Gross Revenue */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1 uppercase tracking-wider">
            Gross Revenue / Acre
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ${outlook.estimatedRevenuePerAcre.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
            Base @ {projectedYieldQuintals} qtl/acre
          </span>
        </div>

        {/* Input & Operational Cost */}
        <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1 uppercase tracking-wider">
            Input & Labor Cost / Acre
          </span>
          <div className="text-2xl font-black font-mono text-slate-300">
            ${outlook.estimatedCostPerAcre.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
            Fertilizer, seed & fuel
          </span>
        </div>

        {/* Net Margin */}
        <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 p-3.5 rounded-xl border border-emerald-800/60 shadow-lg shadow-emerald-950/20">
          <span className="text-[11px] font-mono text-emerald-300 block mb-1 uppercase tracking-wider font-semibold">
            Net Margin / Acre
          </span>
          <div className="text-2xl font-black font-mono text-emerald-300">
            +${netProfit.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono mt-0.5 block">
            Net Farmer Take-Home
          </span>
        </div>
      </div>

      {/* Optimal Market Window Banner */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400">Target Market Liquidation Window: </span>
            <strong className="text-amber-300 font-medium">{outlook.recommendedMarketWindow}</strong>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
          Peak Mandi Price
        </span>
      </div>
    </div>
  );
};

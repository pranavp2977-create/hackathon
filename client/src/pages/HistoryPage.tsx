// client/src/pages/HistoryPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  Sprout, 
  Microscope, 
  ChevronRight, 
  Calendar, 
  TrendingUp, 
  FileText,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { useAdvisories, usePathologyScans } from '../hooks/useAgriApi';

export const HistoryPage: React.FC = () => {
  const { data: advisories } = useAdvisories();
  const { data: scans } = usePathologyScans();

  const [activeTab, setActiveTab] = useState<'advisories' | 'diagnostics'>('advisories');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter advisories
  const filteredAdvisories = advisories?.filter(a => 
    a.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.variety && a.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.fieldName && a.fieldName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.advisorySummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter scans
  const filteredScans = scans?.filter(s =>
    s.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.diagnosisLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.pathogenType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.severity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Agronomic Archive & Historical Logs
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
              Audit Trail
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete records of synthesized crop phenology schedules, soil corrections, and visual pathology assessments.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-700 flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          Print Archive
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('advisories')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'advisories'
                ? 'bg-emerald-500/20 text-emerald-400 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Crop Advisories ({advisories?.length ?? 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'diagnostics'
                ? 'bg-emerald-500/20 text-emerald-400 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Microscope className="w-4 h-4" />
            <span>Pathology Scans ({scans?.length ?? 0})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search crop, plot, or disease..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Advisories Tab Content */}
      {activeTab === 'advisories' && (
        <div className="space-y-3">
          {filteredAdvisories && filteredAdvisories.length > 0 ? (
            filteredAdvisories.map((adv) => (
              <Link
                key={adv.id}
                to={`/advisory/${adv.id}`}
                className="block glass-panel rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition group shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {adv.confidenceScore}% Suitability
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(adv.createdAt).toLocaleDateString()}
                      </span>
                      {adv.fieldName && (
                        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                          Plot: {adv.fieldName}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                      {adv.cropName} {adv.variety && `— ${adv.variety}`}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {adv.advisorySummary}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="text-lg font-black font-mono text-emerald-400">
                        {adv.projectedYieldQuintalsPerAcre || adv.actionPlan?.projectedYieldQuintals} qtl/ac
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">Projected Yield</span>
                    </div>

                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition mt-2">
                      View Blueprint <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No crop advisory records match your query.
            </div>
          )}
        </div>
      )}

      {/* Diagnostics Scans Tab Content */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-3">
          {filteredScans && filteredScans.length > 0 ? (
            filteredScans.map((scan) => (
              <div
                key={scan.id}
                className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        scan.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                        scan.severity === 'Severe' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                        scan.severity === 'Moderate' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}>
                        {scan.severity} Severity
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                        Host: {scan.cropName}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {scan.diagnosisLabel}
                    </h3>

                    <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 mt-2 space-y-1">
                      <div>
                        <strong className="text-sky-400 font-mono">Chemical: </strong>
                        <span>{scan.treatmentProtocols.chemicalIntervention}</span>
                      </div>
                      <div>
                        <strong className="text-emerald-400 font-mono">Organic IPM: </strong>
                        <span>{scan.treatmentProtocols.organicAlternative}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No pathology scan records match your query.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

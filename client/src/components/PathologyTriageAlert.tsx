// client/src/components/PathologyTriageAlert.tsx
import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  FlaskConical, 
  Leaf, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp,
  Radio,
  FileCheck,
  Ban
} from 'lucide-react';
import { TreatmentProtocols } from '@shared/schema';

interface PathologyTriageProps {
  diagnosisLabel: string;
  cropName: string;
  severity: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  pathogenType: string;
  symptomsObserved?: string[];
  treatmentProtocols: TreatmentProtocols;
  quarantineRequired?: boolean;
  dateScanned?: string;
}

export const PathologyTriageAlert: React.FC<PathologyTriageProps> = ({
  diagnosisLabel,
  cropName,
  severity,
  pathogenType,
  symptomsObserved = [],
  treatmentProtocols,
  quarantineRequired = false,
  dateScanned
}) => {
  const [activeTab, setActiveTab] = useState<'chemical' | 'organic' | 'cultural'>('organic');

  const getSeverityConfig = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return {
          badge: 'bg-rose-950 text-rose-300 border-rose-800',
          border: 'border-rose-600/40',
          glow: 'shadow-rose-950/40',
          icon: AlertOctagon,
          textColor: 'text-rose-400',
          title: 'Critical Threat - Rapid Intervention Required'
        };
      case 'Severe':
        return {
          badge: 'bg-orange-950 text-orange-300 border-orange-800',
          border: 'border-orange-600/40',
          glow: 'shadow-orange-950/40',
          icon: AlertTriangle,
          textColor: 'text-orange-400',
          title: 'Severe Infestation Detected'
        };
      case 'Moderate':
        return {
          badge: 'bg-amber-950 text-amber-300 border-amber-800',
          border: 'border-amber-600/40',
          glow: 'shadow-amber-950/40',
          icon: AlertTriangle,
          textColor: 'text-amber-400',
          title: 'Moderate Pathogen Expression'
        };
      default:
        return {
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          border: 'border-emerald-600/40',
          glow: 'shadow-emerald-950/40',
          icon: ShieldCheck,
          textColor: 'text-emerald-400',
          title: 'Low Pathology / Early Stage'
        };
    }
  };

  const config = getSeverityConfig(severity);
  const Icon = config.icon;

  return (
    <div className={`glass-panel-elevated rounded-2xl p-6 border ${config.border} shadow-2xl ${config.glow}`}>
      {/* Top Banner */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${config.badge}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${config.badge}`}>
                {severity} Severity
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {pathogenType} Etiology
              </span>
              {quarantineRequired && (
                <span className="text-xs font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded animate-pulse flex items-center gap-1">
                  <Ban className="w-3 h-3" /> Quarantine Required
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{diagnosisLabel}</h3>
            <p className="text-xs text-slate-400">Specimen Host: <strong className="text-slate-200">{cropName}</strong> {dateScanned && `• Scanned ${new Date(dateScanned).toLocaleDateString()}`}</p>
          </div>
        </div>
      </div>

      {/* Observed Symptoms List */}
      {symptomsObserved.length > 0 && (
        <div className="mb-5 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 font-mono">
            Diagnostic Symptom Observations:
          </span>
          <ul className="space-y-1.5">
            {symptomsObserved.map((symptom, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">•</span>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Treatment Protocols Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        {/* Toggle Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('organic')}
            className={`py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-2 transition ${
              activeTab === 'organic'
                ? 'bg-emerald-500/15 text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Organic / Bio-IPM</span>
          </button>

          <button
            onClick={() => setActiveTab('chemical')}
            className={`py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-2 transition ${
              activeTab === 'chemical'
                ? 'bg-sky-500/15 text-sky-400 border-b-2 border-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Chemical Intervention</span>
          </button>

          <button
            onClick={() => setActiveTab('cultural')}
            className={`py-2.5 px-3 text-xs font-medium flex items-center justify-center gap-2 transition ${
              activeTab === 'cultural'
                ? 'bg-amber-500/15 text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cultural & Agronomic</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4">
          {activeTab === 'organic' && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Leaf className="w-4 h-4" />
                <span>Biological & Low-Toxicity Alternative:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40">
                {treatmentProtocols.organicAlternative}
              </p>
            </div>
          )}

          {activeTab === 'chemical' && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                <FlaskConical className="w-4 h-4" />
                <span>Targeted Chemical Trade Formulations:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-sky-950/20 p-3 rounded-lg border border-sky-950/60 font-mono">
                {treatmentProtocols.chemicalIntervention}
              </p>
              <span className="text-[10px] text-slate-500 block italic">
                * Observe Pre-Harvest Intervals (PHI) and calibrate sprayers to prevent chemical run-off into waterways.
              </span>
            </div>
          )}

          {activeTab === 'cultural' && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <ShieldAlert className="w-4 h-4" />
                <span>Sanitation, Spacing & Cultural Controls:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-amber-950/20 p-3 rounded-lg border border-amber-900/40">
                {treatmentProtocols.culturalPreventativeMeasures}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

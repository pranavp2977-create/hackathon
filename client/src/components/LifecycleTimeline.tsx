// client/src/components/LifecycleTimeline.tsx
import React, { useState } from 'react';
import { 
  Clock, 
  Droplets, 
  FlaskConical, 
  Bug, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { LifecyclePhase } from '@shared/schema';

interface LifecycleTimelineProps {
  phases: LifecyclePhase[];
  cropName: string;
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({ phases, cropName }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">Phased Crop Phenological Growth Calendar</h3>
            <p className="text-xs text-slate-400">Step-by-step agronomic field intervention schedule for {cropName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedIndex(expandedIndex === null ? 0 : null)}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            {expandedIndex === null ? 'Expand Active Stage' : 'Collapse Details'}
          </button>
        </div>
      </div>

      {/* Vertical Phased Steps Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-slate-800">
        {phases.map((phase, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div key={idx} className="relative group">
              {/* Timeline Node Bullet */}
              <div 
                className={`absolute -left-[30px] top-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isExpanded 
                    ? 'border-emerald-400 bg-emerald-950 text-emerald-400 shadow-lg shadow-emerald-500/30' 
                    : 'border-slate-700 bg-slate-900 text-slate-500 group-hover:border-emerald-500'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              </div>

              {/* Phase Card */}
              <div 
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'glass-panel-elevated border-emerald-500/40 shadow-xl shadow-emerald-950/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header Strip */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full p-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      Phase {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-white text-base tracking-tight">{phase.phaseName}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{phase.dayRange}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </div>
                </button>

                {/* Expanded Action Protocols */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Irrigation Protocol */}
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-sky-950/60 flex flex-col">
                      <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-2">
                        <Droplets className="w-4 h-4 shrink-0" />
                        <span>Irrigation Scheduling</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {phase.irrigationSchedule}
                      </p>
                    </div>

                    {/* Fertilization Protocol */}
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-amber-950/60 flex flex-col">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
                        <FlaskConical className="w-4 h-4 shrink-0" />
                        <span>Fertilizer Split & Nutrition</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {phase.fertilizationAction}
                      </p>
                    </div>

                    {/* Pest Surveillance Protocol */}
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-rose-950/60 flex flex-col">
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-2">
                        <Bug className="w-4 h-4 shrink-0" />
                        <span>IPM & Pest Scouting</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {phase.pestSurveillance}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

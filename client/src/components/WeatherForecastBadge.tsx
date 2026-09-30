// client/src/components/WeatherForecastBadge.tsx
import React from 'react';
import { CloudRain, Sun, Droplets, Wind, Thermometer, Compass } from 'lucide-react';

interface WeatherForecastProps {
  temperatureCelsius?: number;
  rainfallMm?: number;
  humidityPercent?: number;
  region?: string;
  season?: string;
}

export const WeatherForecastBadge: React.FC<WeatherForecastProps> = ({
  temperatureCelsius = 27.5,
  rainfallMm = 450,
  humidityPercent = 68,
  region = 'Regional Agro-Climatic Station',
  season = 'Active Growing Season'
}) => {
  // Determine moisture index
  const isHighMoisture = rainfallMm > 600 || humidityPercent > 75;
  const isDroughtRisk = rainfallMm < 200 && humidityPercent < 45;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Micro-Climate Telemetry</h3>
            <p className="text-xs text-slate-400">{region}</p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-800">
          {season}
        </span>
      </div>

      {/* Main Metric Spotlight */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Temperature */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <Thermometer className="w-4 h-4 text-rose-400 mb-1" />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Ambient Temp</span>
          <span className="text-xl font-bold font-mono text-white">{temperatureCelsius}°C</span>
          <span className="text-[10px] text-slate-400 font-mono">{((temperatureCelsius * 9/5) + 32).toFixed(1)}°F</span>
        </div>

        {/* Rainfall Forecast */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <CloudRain className="w-4 h-4 text-sky-400 mb-1" />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Seasonal Rain</span>
          <span className="text-xl font-bold font-mono text-sky-300">{rainfallMm} mm</span>
          <span className="text-[10px] text-emerald-400 font-mono">
            {rainfallMm > 400 ? 'Adequate' : 'Deficit'}
          </span>
        </div>

        {/* Relative Humidity */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <Droplets className="w-4 h-4 text-teal-400 mb-1" />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Rel. Humidity</span>
          <span className="text-xl font-bold font-mono text-teal-300">{humidityPercent}%</span>
          <span className="text-[10px] text-slate-400 font-mono">
            {humidityPercent > 70 ? 'High Spore Risk' : 'Normal'}
          </span>
        </div>
      </div>

      {/* Meteorological Interpretation Strip */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Wind className="w-3.5 h-3.5 text-slate-400" />
          <span>VPD Index: <strong className="text-emerald-400 font-mono">1.12 kPa (Optimal Transpiration)</strong></span>
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          {isHighMoisture ? '⚠️ Blight Risk Active' : '✓ Favorable Conditions'}
        </span>
      </div>
    </div>
  );
};

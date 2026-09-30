// client/src/pages/AdvisoryWizard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Layers, 
  Sun, 
  CloudRain, 
  Droplets, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  FlaskConical,
  Gauge
} from 'lucide-react';
import { useFields, useGenerateAdvisory } from '../hooks/useAgriApi';
import { SEASONS } from '@shared/schema';

export const AdvisoryWizard: React.FC = () => {
  const navigate = useNavigate();
  const { data: fields } = useFields();
  const generateMutation = useGenerateAdvisory();

  // Wizard Step Tracker (1 to 4)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fieldId, setFieldId] = useState<string>('');
  const [targetSeason, setTargetSeason] = useState<"Kharif / Monsoon" | "Rabi / Winter" | "Zaid / Summer" | "Perennial">("Kharif / Monsoon");
  const [cropPreferences, setCropPreferences] = useState<string>('');

  // Soil Metrics
  const [nitrogenPpm, setNitrogenPpm] = useState<number>(145);
  const [phosphorusPpm, setPhosphorusPpm] = useState<number>(24);
  const [potassiumPpm, setPotassiumPpm] = useState<number>(210);
  const [ph, setPh] = useState<number>(6.5);
  const [organicCarbonPercent, setOrganicCarbonPercent] = useState<number>(0.72);

  // Weather Context
  const [avgTemperatureCelsius, setAvgTemperatureCelsius] = useState<number>(28);
  const [rainfallForecastMm, setRainfallForecastMm] = useState<number>(550);
  const [relativeHumidityPercent, setRelativeHumidityPercent] = useState<number>(68);

  const [formError, setFormError] = useState<string | null>(null);

  // Auto-select first field when loaded
  React.useEffect(() => {
    if (fields && fields.length > 0 && !fieldId) {
      setFieldId(fields[0].id);
    }
  }, [fields, fieldId]);

  const selectedField = fields?.find(f => f.id === fieldId);

  const handleNext = () => {
    setFormError(null);
    if (step === 1 && !fieldId) {
      setFormError('Please select a target field plot.');
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setFormError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleGenerate = async () => {
    setFormError(null);
    if (!fieldId) {
      setFormError('Invalid field plot selection.');
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        fieldId,
        cropPreferences: cropPreferences.trim() || undefined,
        targetSeason,
        soilMetrics: {
          nitrogenPpm,
          phosphorusPpm,
          potassiumPpm,
          ph,
          organicCarbonPercent
        },
        weatherContext: {
          avgTemperatureCelsius,
          rainfallForecastMm,
          relativeHumidityPercent
        }
      });

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#14b8a6', '#f59e0b', '#3b82f6']
      });

      // Redirect to newly generated advisory
      navigate(`/advisory/${result.id}`);
    } catch (err: any) {
      setFormError(err.message || 'Advisory synthesis failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Powered by Gemini 2.5 Pro Agronomic Core
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Precision Advisory Generator</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Calibrate soil electrochemical telemetry and regional micro-climate models to generate an automated phenological crop blueprint.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: 'Plot & Season' },
          { num: 2, label: 'Soil Metrics' },
          { num: 3, label: 'Climate Context' },
          { num: 4, label: 'Synthesize' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-xl border text-center transition-all ${
              step === s.num
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                : step > s.num
                ? 'bg-slate-900 border-slate-700 text-slate-300 font-medium'
                : 'bg-slate-950/50 border-slate-800/80 text-slate-600'
            }`}
          >
            <div className="text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5">
              {step > s.num ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : `Step 0${s.num}`}
            </div>
            <div className="text-xs truncate mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Error alert */}
      {formError && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{formError}</span>
        </div>
      )}

      {/* Wizard Step Body */}
      <div className="glass-panel-elevated rounded-3xl p-6 lg:p-8 border border-slate-800 shadow-2xl">
        {/* STEP 1: Plot Selection & Target Season */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Target Farm Plot & Cropping Cycle</h3>
              <p className="text-xs text-slate-400">Select the operational parcel and planned seasonal sowing window.</p>
            </div>

            {/* Field Plot Picker */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">Select Registered Plot *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {fields?.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFieldId(f.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      fieldId === f.id
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-950/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white truncate">{f.name}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{f.acreage} ac</span>
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <div>Soil: <strong className="text-slate-300">{f.soilType}</strong></div>
                      <div>Water: <strong className="text-slate-300">{f.irrigationType.split('(')[0]}</strong></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Season Radio Tiles */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">Target Agronomic Season *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SEASONS.map((season) => (
                  <button
                    key={season}
                    type="button"
                    onClick={() => setTargetSeason(season)}
                    className={`p-3 rounded-xl border text-center transition ${
                      targetSeason === season
                        ? 'bg-teal-500/20 border-teal-400 text-white font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-teal-400" />
                    <span className="text-xs">{season}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Crop Preferences */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Target Crop Preferences or Constraints (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Prefer Basmati Paddy or high-protein legumes, no transgenic crops"
                value={cropPreferences}
                onChange={(e) => setCropPreferences(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Soil Metrics & Reactive Sliders */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Soil Electrochemical Telemetry</h3>
              <p className="text-xs text-slate-400">
                Adjust N-P-K nutrient concentrations and soil pH. Liming/sulfur requirements update reactively.
              </p>
            </div>

            {/* Reactive pH Slider & Live Liming Alert */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-200">Soil pH Reaction (Acidity / Alkalinity)</span>
                <span className="text-xl font-black font-mono text-emerald-400">{ph.toFixed(1)} pH</span>
              </div>
              <input
                type="range"
                min="3.5"
                max="10.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>3.5 (Extreme Acid)</span>
                <span className="text-emerald-400">Optimal Buffer (6.0 - 7.5)</span>
                <span>10.0 (High Sodic)</span>
              </div>

              {/* Dynamic Liming / Sulfur Guidance based on master directive */}
              <div className="mt-3 text-xs p-2.5 rounded-lg border">
                {ph < 5.5 ? (
                  <div className="bg-rose-950/40 border-rose-800/60 text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Liming Protocol Triggered:</strong> Soil is acidic (pH &lt; 5.5). Gemini will prescribe Dolomitic Limestone @ 2.5 t/ha.</span>
                  </div>
                ) : ph > 7.8 ? (
                  <div className="bg-amber-950/40 border-amber-800/60 text-amber-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Saline Amendment Triggered:</strong> Soil is alkaline (pH &gt; 7.8). Gemini will prescribe Gypsum or Elemental Sulfur.</span>
                  </div>
                ) : (
                  <div className="bg-emerald-950/40 border-emerald-800/60 text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Nutrient Bio-Availability Ideal:</strong> Cation exchange capacity operates at high agronomic efficiency.</span>
                  </div>
                )}
              </div>
            </div>

            {/* N-P-K Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nitrogen */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-sky-400 font-mono">Nitrogen (N)</span>
                  <span className="font-mono font-bold text-white">{nitrogenPpm} ppm</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={nitrogenPpm}
                  onChange={(e) => setNitrogenPpm(parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {nitrogenPpm < 140 ? 'Deficient' : nitrogenPpm > 280 ? 'Excess' : 'Optimal'}
                </span>
              </div>

              {/* Phosphorus */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-amber-400 font-mono">Phosphorus (P)</span>
                  <span className="font-mono font-bold text-white">{phosphorusPpm} ppm</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={phosphorusPpm}
                  onChange={(e) => setPhosphorusPpm(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {phosphorusPpm < 20 ? 'Deficient' : phosphorusPpm > 50 ? 'High' : 'Optimal'}
                </span>
              </div>

              {/* Potassium */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-400 font-mono">Potassium (K)</span>
                  <span className="font-mono font-bold text-white">{potassiumPpm} ppm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="10"
                  value={potassiumPpm}
                  onChange={(e) => setPotassiumPpm(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {potassiumPpm < 150 ? 'Low' : 'Adequate'}
                </span>
              </div>
            </div>

            {/* Soil Organic Carbon */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">Soil Organic Carbon (SOC %)</span>
                <p className="text-[11px] text-slate-400">Microbial baseline & moisture retention index</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="5.0"
                  value={organicCarbonPercent}
                  onChange={(e) => setOrganicCarbonPercent(parseFloat(e.target.value))}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono text-right"
                />
                <span className="text-xs font-mono text-slate-400">%</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Weather Telemetry */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Regional Micro-Climate Telemetry</h3>
              <p className="text-xs text-slate-400">Calibrate ambient temperature, precipitation forecast, and humidity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Avg Temperature */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-2">
                  <Sun className="w-4 h-4" />
                  <span>Avg Temperature (°C)</span>
                </div>
                <input
                  type="number"
                  value={avgTemperatureCelsius}
                  onChange={(e) => setAvgTemperatureCelsius(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-lg font-mono font-bold text-white"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {((avgTemperatureCelsius * 9/5) + 32).toFixed(1)} °F
                </span>
              </div>

              {/* Rainfall Forecast */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold mb-2">
                  <CloudRain className="w-4 h-4" />
                  <span>Rainfall Forecast (mm)</span>
                </div>
                <input
                  type="number"
                  value={rainfallForecastMm}
                  onChange={(e) => setRainfallForecastMm(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-lg font-mono font-bold text-white"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Cumulative seasonal precipitation
                </span>
              </div>

              {/* Relative Humidity */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-2">
                  <Droplets className="w-4 h-4" />
                  <span>Relative Humidity (%)</span>
                </div>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={relativeHumidityPercent}
                  onChange={(e) => setRelativeHumidityPercent(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-lg font-mono font-bold text-white"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Vapor pressure & transpiration index
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Synthesis Review & Submit */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Synthesizing Agronomic Blueprint</h3>
              <p className="text-xs text-slate-400">
                Review your parameters before invoking Gemini 2.5 Pro for multi-stage advisory compilation.
              </p>
            </div>

            {/* Summary Preview Table */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block uppercase">Field Plot</span>
                <strong className="text-white truncate block">{selectedField?.name}</strong>
                <span className="text-emerald-400 font-mono text-[10px]">{selectedField?.acreage} ac • {selectedField?.soilType}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block uppercase">Season</span>
                <strong className="text-teal-300 block">{targetSeason}</strong>
                <span className="text-slate-400 text-[10px]">{cropPreferences || 'Optimal Cash/Food'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block uppercase">Soil Status</span>
                <strong className="text-amber-300 font-mono block">pH {ph.toFixed(1)}</strong>
                <span className="text-slate-400 text-[10px] font-mono">N:{nitrogenPpm} P:{phosphorusPpm} K:{potassiumPpm}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] font-mono block uppercase">Micro-Climate</span>
                <strong className="text-sky-300 font-mono block">{avgTemperatureCelsius}°C</strong>
                <span className="text-slate-400 text-[10px] font-mono">{rainfallForecastMm}mm • {relativeHumidityPercent}% RH</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-emerald-400 shrink-0 animate-pulse" />
              <div className="text-xs text-slate-300">
                Submitting this telemetry will trigger Gemini 2.5 Pro to execute stoichiometric nutrient allocation,
                irrigation splits, IPM protocols, and market monetization windows.
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex justify-between items-center">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={generateMutation.isPending}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition shadow-xl shadow-emerald-500/30 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {generateMutation.isPending ? 'Synthesizing with Gemini 2.5 Pro...' : 'Synthesize Precision Advisory'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// client/src/pages/FieldsPage.tsx
import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Layers, 
  Droplets, 
  Compass, 
  FileText, 
  LayoutGrid, 
  List, 
  X, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useFields, useCreateField } from '../hooks/useAgriApi';
import { SOIL_TYPES, IRRIGATION_TYPES, Field } from '@shared/schema';

export const FieldsPage: React.FC = () => {
  const { data: fields, isLoading } = useFields();
  const createFieldMutation = useCreateField();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [acreage, setAcreage] = useState('');
  const [soilType, setSoilType] = useState<string>(SOIL_TYPES[0]);
  const [irrigationType, setIrrigationType] = useState<string>(IRRIGATION_TYPES[0]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [historicalNotes, setHistoricalNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAcreage = parseFloat(acreage);
    if (!name.trim()) {
      setFormError('Field parcel name is required.');
      return;
    }
    if (isNaN(parsedAcreage) || parsedAcreage <= 0) {
      setFormError('Please enter a valid positive acreage.');
      return;
    }

    try {
      await createFieldMutation.mutateAsync({
        name: name.trim(),
        acreage: parsedAcreage,
        soilType,
        irrigationType,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        historicalNotes: historicalNotes.trim() || undefined
      });

      // Reset and close
      setName('');
      setAcreage('');
      setLatitude('');
      setLongitude('');
      setHistoricalNotes('');
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to register field');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Field Parcel Manager</h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
              {fields?.length ?? 0} Registered Plots
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            GIS spatial parcels, soil physical structures, and irrigation infrastructure telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'table' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Field Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Register New Plot
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fields?.map((field) => (
            <div
              key={field.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {field.acreage} <span className="text-xs font-normal text-slate-400 font-sans">acres</span>
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                  {field.name}
                </h3>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-amber-400" /> Soil Class
                    </span>
                    <strong className="text-slate-200">{field.soilType}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" /> Irrigation
                    </span>
                    <strong className="text-slate-200 truncate max-w-[150px]">{field.irrigationType}</strong>
                  </div>

                  {(field.latitude || field.longitude) && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 font-mono text-[11px]">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Compass className="w-3.5 h-3.5 text-teal-400" /> GIS Coordinates
                      </span>
                      <strong className="text-teal-300">
                        {field.latitude?.toFixed(4)}, {field.longitude?.toFixed(4)}
                      </strong>
                    </div>
                  )}
                </div>

                {field.historicalNotes && (
                  <div className="mt-3 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed italic">
                    "{field.historicalNotes}"
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>ID: {field.id.slice(0, 8)}</span>
                <span>Registered {new Date(field.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Plot Name</th>
                  <th className="p-4">Acreage</th>
                  <th className="p-4">Soil Texture</th>
                  <th className="p-4">Irrigation Infrastructure</th>
                  <th className="p-4">GIS Coordinates</th>
                  <th className="p-4">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fields?.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {field.name}
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">{field.acreage} ac</td>
                    <td className="p-4 text-slate-300">{field.soilType}</td>
                    <td className="p-4 text-slate-300">{field.irrigationType}</td>
                    <td className="p-4 font-mono text-slate-400">
                      {field.latitude && field.longitude ? `${field.latitude.toFixed(4)}, ${field.longitude.toFixed(4)}` : 'N/A'}
                    </td>
                    <td className="p-4 font-mono text-slate-500">
                      {new Date(field.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Field Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel-elevated rounded-3xl p-6 border border-slate-700 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Register Operational Plot</h3>
                <p className="text-xs text-slate-400">Enter GIS spatial & soil classification metrics</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Plot Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Terraced Basin (Plot Delta)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Acreage *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="e.g. 35.5"
                    value={acreage}
                    onChange={(e) => setAcreage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Soil Classification</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SOIL_TYPES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Irrigation System</label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {IRRIGATION_TYPES.map((it) => (
                    <option key={it} value={it}>{it}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Latitude (GIS)</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 28.6139"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Longitude (GIS)</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="e.g. 77.2090"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Historical Rotation & Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pre-planted with chickpeas in winter 2024. Nitrogen fixation residual present."
                  value={historicalNotes}
                  onChange={(e) => setHistoricalNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFieldMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition disabled:opacity-50"
                >
                  {createFieldMutation.isPending ? 'Registering...' : 'Save Field Parcel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

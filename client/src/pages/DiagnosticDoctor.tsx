// client/src/pages/DiagnosticDoctor.tsx
import React, { useState } from 'react';
import { 
  Microscope, 
  Sparkles, 
  AlertOctagon, 
  Leaf, 
  MapPin, 
  Calendar, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useFields, usePathologyScans, useScanPathology } from '../hooks/useAgriApi';
import { LeafScannerUpload } from '../components/LeafScannerUpload';
import { PathologyTriageAlert } from '../components/PathologyTriageAlert';
import { PathologyScan } from '@shared/schema';

export const DiagnosticDoctor: React.FC = () => {
  const { data: fields } = useFields();
  const { data: pastScans } = usePathologyScans();
  const scanMutation = useScanPathology();

  const [fieldId, setFieldId] = useState<string>('');
  const [cropName, setCropName] = useState<string>('Rice (Paddy)');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<"image/jpeg" | "image/png" | "image/webp">('image/jpeg');
  const [latestScanResult, setLatestScanResult] = useState<PathologyScan | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleImageReady = (base64: string, mime: "image/jpeg" | "image/png" | "image/webp") => {
    setImageBase64(base64);
    setMimeType(mime);
    setScanError(null);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setScanError('Please upload or capture a foliage specimen photo first.');
      return;
    }
    if (!cropName.trim()) {
      setScanError('Please enter or select the host crop name.');
      return;
    }

    setScanError(null);
    try {
      const result = await scanMutation.mutateAsync({
        fieldId: fieldId || undefined,
        cropName: cropName.trim(),
        imageBase64,
        mimeType
      });
      setLatestScanResult(result);
    } catch (err: any) {
      setScanError(err.message || 'Pathology scanning failed');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Visual Plant Pathology Diagnostician
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Gemini 2.5 Flash Vision
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multimodal deep visual triage for plant pathogen identification, symptom mapping, and biosecurity protocols.
          </p>
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form & Scanner (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Microscope className="w-5 h-5 text-emerald-400" />
              Upload Foliage / Stem / Root Specimen
            </h3>

            {/* Crop & Field Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Host Crop *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paddy (Rice), Tomato, Cotton"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Associate Farm Plot</label>
                <select
                  value={fieldId}
                  onChange={(e) => setFieldId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- General Unassigned Plot --</option>
                  {fields?.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.acreage} ac)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Uploader Component with Canvas Compression */}
            <LeafScannerUpload
              onImageSelected={handleImageReady}
              isScanning={scanMutation.isPending}
            />

            {scanError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl">
                {scanError}
              </div>
            )}

            {/* Analyze Action Button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={scanMutation.isPending || !imageBase64}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-500/20 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {scanMutation.isPending ? 'Executing Multimodal Vision Diagnostic...' : 'Execute AI Pathology Triage'}
            </button>
          </div>
        </div>

        {/* Right Active Result Spotlight (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {latestScanResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">✓ Triage Complete</span>
                <span className="font-mono text-slate-400">{new Date(latestScanResult.createdAt).toLocaleTimeString()}</span>
              </div>
              <PathologyTriageAlert
                diagnosisLabel={latestScanResult.diagnosisLabel}
                cropName={latestScanResult.cropName}
                severity={latestScanResult.severity}
                pathogenType={latestScanResult.pathogenType}
                symptomsObserved={latestScanResult.symptomsObserved}
                treatmentProtocols={latestScanResult.treatmentProtocols}
                quarantineRequired={latestScanResult.quarantineRequired}
              />
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center h-full flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
                <Microscope className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-sm">No Active Scan Session</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Upload a plant specimen or click one of the quick test presets to generate real-time symptom mapping.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Historical Diagnostics Gallery */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-400" />
          Recent Diagnostic Assessment Log
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pastScans?.map((scan) => (
            <PathologyTriageAlert
              key={scan.id}
              diagnosisLabel={scan.diagnosisLabel}
              cropName={scan.cropName}
              severity={scan.severity}
              pathogenType={scan.pathogenType}
              symptomsObserved={scan.symptomsObserved}
              treatmentProtocols={scan.treatmentProtocols}
              quarantineRequired={scan.quarantineRequired}
              dateScanned={scan.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

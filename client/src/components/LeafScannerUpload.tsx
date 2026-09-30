// client/src/components/LeafScannerUpload.tsx
import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, X, AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface LeafScannerUploadProps {
  onImageSelected: (base64: string, mimeType: "image/jpeg" | "image/png" | "image/webp") => void;
  isScanning: boolean;
}

export const LeafScannerUpload: React.FC<LeafScannerUploadProps> = ({ onImageSelected, isScanning }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Compress & strip EXIF using HTML Canvas
  const processImageFile = (file: File) => {
    setErrorMessage(null);
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimes.includes(file.type)) {
      setErrorMessage('Invalid file format. Please upload a JPEG, PNG, or WebP foliage image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Strip EXIF & compress to reasonable resolution (max 1280px)
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1280;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setErrorMessage('Canvas rendering context unavailable');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG with quality 0.85
        const targetMime: "image/jpeg" | "image/png" | "image/webp" = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedBase64 = canvas.toDataURL(targetMime, 0.85);

        setPreview(compressedBase64);
        onImageSelected(compressedBase64, targetMime);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  // Live Camera Activation
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setErrorMessage('Could not access device camera. Please check browser permissions.');
      setUseCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.88);
        setPreview(base64);
        onImageSelected(base64, 'image/jpeg');
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    stopCamera();
  };

  // Sample quick presets for testing
  const loadPresetSample = (type: 'rice' | 'tomato' | 'cotton') => {
    let svgUrl = '';
    if (type === 'rice') {
      svgUrl = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%230f2415'/><path d='M300 40 C180 120, 120 260, 300 360 C480 260, 420 120, 300 40' fill='%232e7d32'/><circle cx='280' cy='180' r='24' fill='%23a16207'/><circle cx='325' cy='230' r='18' fill='%23854d0e'/><circle cx='290' cy='280' r='16' fill='%23713f12'/></svg>";
    } else if (type === 'tomato') {
      svgUrl = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%23131c15'/><path d='M250 50 C120 100, 100 300, 300 370 C500 300, 480 100, 350 50' fill='%2315803d'/><circle cx='270' cy='160' r='30' stroke='%23f59e0b' stroke-width='4' fill='%2378350f'/><circle cx='270' cy='160' r='14' fill='%23451a03'/><circle cx='340' cy='240' r='22' stroke='%23f59e0b' stroke-width='3' fill='%2378350f'/></svg>";
    } else {
      svgUrl = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%231e1e1e'/><path d='M200 300 Q300 80 400 300 Q300 380 200 300' fill='%233f6212'/><line x1='220' y1='250' x2='380' y2='290' stroke='%23dc2626' stroke-width='8'/><circle cx='270' cy='220' r='16' fill='%23ef4444'/></svg>";
    }
    setPreview(svgUrl);
    onImageSelected(svgUrl, 'image/jpeg');
  };

  return (
    <div className="space-y-4">
      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Upload / Camera / Preview Container */}
      {!preview && !useCamera ? (
        <div
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive 
              ? 'border-emerald-400 bg-emerald-950/30' 
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base font-semibold text-white mb-1">
            Upload Leaf, Stem, or Fruit Specimen
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            Drag and drop high-resolution plant imagery, or capture directly with field camera. Client automatically compresses & strips metadata.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <ImageIcon className="w-4 h-4" />
              Browse Field Photo
            </button>

            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              Open Live Camera
            </button>
          </div>

          {/* Quick Demo Sample Presets */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-2">
              Or test with sample plant pathology specimen:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => loadPresetSample('rice')}
                className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              >
                🌾 Rice Brown Spot Sample
              </button>
              <button
                type="button"
                onClick={() => loadPresetSample('tomato')}
                className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              >
                🍅 Tomato Early Blight Sample
              </button>
              <button
                type="button"
                onClick={() => loadPresetSample('cotton')}
                className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              >
                🌿 Cotton Leaf Curl Sample
              </button>
            </div>
          </div>
        </div>
      ) : useCamera ? (
        /* Live Camera Viewfinder */
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video max-h-[420px] flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          
          {/* Viewfinder crosshairs */}
          <div className="absolute inset-8 border-2 border-emerald-400/50 rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-[11px] font-mono bg-slate-950/80 px-2 py-0.5 rounded text-emerald-300">
              Align infected leaf area within box
            </span>
          </div>

          <div className="absolute bottom-4 flex items-center gap-4">
            <button
              type="button"
              onClick={capturePhoto}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/30"
            >
              <Camera className="w-4 h-4" />
              Capture Specimen
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="px-4 py-2.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white text-xs border border-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Image Preview with Radar Scan Animation */
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-[360px] flex items-center justify-center">
          <img src={preview!} alt="Plant leaf preview" className="w-full h-64 object-cover object-center" />

          {/* Radar Scanline when AI is active */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 shadow-lg shadow-emerald-400/80 animate-scanline" />
              <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex items-center justify-center">
                <span className="font-mono text-xs px-3 py-1.5 rounded-full bg-slate-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-2 shadow-xl">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  Gemini 2.5 Flash Vision Triage in Progress...
                </span>
              </div>
            </div>
          )}

          {/* Reset / Clear Button */}
          {!isScanning && (
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition shadow-lg"
              title="Change Image"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="absolute bottom-2 left-3 bg-slate-950/80 px-2 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-800">
            ✓ Image Ready & Compressed (MIME Verified)
          </div>
        </div>
      )}
    </div>
  );
};

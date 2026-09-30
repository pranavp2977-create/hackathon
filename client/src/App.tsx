// client/src/App.tsx
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { FieldsPage } from './pages/FieldsPage';
import { AdvisoryWizard } from './pages/AdvisoryWizard';
import { AdvisoryDetail } from './pages/AdvisoryDetail';
import { DiagnosticDoctor } from './pages/DiagnosticDoctor';
import { HistoryPage } from './pages/HistoryPage';
import { HostileTool } from './pages/HostileTool';
import { Skull, Sprout, ArrowRightLeft } from 'lucide-react';

export const App: React.FC = () => {
  const location = useLocation();
  const isHostile = location.pathname === '/' || location.pathname === '/hostile';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Switcher Bar between Hostile Mode & AgriSmart AI Platform */}
      <div className="bg-black border-b border-yellow-500/50 py-1.5 px-4 flex items-center justify-between text-xs font-mono z-50">
        <div className="flex items-center gap-2">
          {isHostile ? (
            <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <Skull className="w-3.5 h-3.5 text-[#ff0055] animate-pulse" />
              <span>Hostile UI Mode: One-Time Single-Use Tool</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sprout className="w-3.5 h-3.5" />
              <span>AgriSmart AI: Precision Agriculture Assistant</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isHostile ? (
            <Link
              to="/agri"
              className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900 transition flex items-center gap-1.5 text-[11px]"
            >
              <Sprout className="w-3 h-3 text-emerald-400" />
              Switch to AgriSmart AI Enterprise Suite
            </Link>
          ) : (
            <Link
              to="/"
              className="px-2.5 py-0.5 rounded bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/40 hover:bg-[#ff0055]/30 transition flex items-center gap-1.5 text-[11px]"
            >
              <Skull className="w-3 h-3" />
              Switch to Hostile Dark-Pattern Tool
            </Link>
          )}
        </div>
      </div>

      {isHostile ? (
        /* Hostile Dark-Pattern Experience */
        <HostileTool />
      ) : (
        /* AgriSmart AI Full Platform Experience */
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 flex">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
              <Routes>
                <Route path="/agri" element={<Dashboard />} />
                <Route path="/agri/fields" element={<FieldsPage />} />
                <Route path="/agri/advisory/new" element={<AdvisoryWizard />} />
                <Route path="/agri/advisory/:id" element={<AdvisoryDetail />} />
                <Route path="/agri/diagnostics" element={<DiagnosticDoctor />} />
                <Route path="/agri/history" element={<HistoryPage />} />
                {/* Fallbacks */}
                <Route path="/fields" element={<FieldsPage />} />
                <Route path="/advisory/new" element={<AdvisoryWizard />} />
                <Route path="/advisory/:id" element={<AdvisoryDetail />} />
                <Route path="/diagnostics" element={<DiagnosticDoctor />} />
                <Route path="/history" element={<HistoryPage />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

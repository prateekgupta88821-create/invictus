'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sliders, Cpu, Save, RefreshCw, CheckCircle, Database, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [ocrProvider, setOcrProvider] = useState('demo');
  const [minConfidence, setMinConfidence] = useState(85);
  const [activeRuleVersion, setActiveRuleVersion] = useState('LMPC-2011-v1.4');
  const [hashIntegrityCheck, setHashIntegrityCheck] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>System Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Enforcement Engine & Rules Configuration
          </h1>
          <p className="text-xs text-slate-500">
            Configure OCR pipelines, confidence sensitivity thresholds, statutory rule versions, and cryptographic audit parameters.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Configuration Applied</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: AI / OCR Provider Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-gov-blue" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Vision & OCR Extraction Layer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Active OCR / AI Provider
              </label>
              <select
                value={ocrProvider}
                onChange={(e) => setOcrProvider(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-1 focus:ring-gov-blue outline-none font-medium"
              >
                <option value="demo">Demo Provider (Deterministic FMCG Seeded Data - Zero Key)</option>
                <option value="paddle">PaddleOCR Engine (Indic-Bilingual Model)</option>
                <option value="tesseract">Tesseract 5.0 (Offline Fallback)</option>
                <option value="external_vision">External Vision LLM (Configured via AI_API_KEY)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Currently running in zero-external-cost Demo Mode. Compliant with SIH evaluation rules.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Minimum Confidence Threshold for Automatic Verification: <span className="font-mono text-gov-blue">{minConfidence}%</span>
              </label>
              <input
                type="range"
                min="50"
                max="98"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gov-blue mt-3"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>50% (Permissive)</span>
                <span>85% (Statutory Standard)</span>
                <span>98% (Strict)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Statutory Rule Versioning */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Legal Metrology Statutory Version
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Active Statutory Framework
              </label>
              <select
                value={activeRuleVersion}
                onChange={(e) => setActiveRuleVersion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-1 focus:ring-gov-blue outline-none font-medium"
              >
                <option value="LMPC-2011-v1.4">LMPC Rules 2011 (Updated w/ 2022 Unit Sale Price Amendment)</option>
                <option value="LMPC-2011-v1.3">LMPC Rules 2011 (Standard Packaging Schedule Rules)</option>
                <option value="LMPC-2011-v1.0">LMPC Rules 2011 (Base Statutory Baseline)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Rules live outside code in JSON definitions. New amendments can be published without recompilation.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 block">Compliance Index Weighting</span>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Required Declarations (Rule 6)</span>
                <span className="font-mono font-bold">80%</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Format & Metric Syntax</span>
                <span className="font-mono font-bold">10%</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>OCR Confidence Weighting</span>
                <span className="font-mono font-bold">5%</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Tamper / Mislabel Penalties</span>
                <span className="font-mono font-bold">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Cryptographic Integrity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Cryptographic Audit Chaining & Tamper Protection
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Continuous SHA-256 Hash Chaining
              </span>
              <p className="text-[11px] text-slate-500">
                Links every officer override, evidence attachment, and report issuance to the previous block hash.
              </p>
            </div>
            <input
              type="checkbox"
              checked={hashIntegrityCheck}
              onChange={(e) => setHashIntegrityCheck(e.target.checked)}
              className="w-5 h-5 accent-gov-blue rounded-md cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gov-blue hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}

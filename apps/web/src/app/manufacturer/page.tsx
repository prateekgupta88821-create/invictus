'use client';

import React, { useState } from 'react';
import {
  Factory,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Upload,
  RefreshCw,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';

export default function ManufacturerPortalPage() {
  // Before / After State
  const [beforeScore, setBeforeScore] = useState(72);
  const [afterScore, setAfterScore] = useState(96);
  const [isFixApplied, setIsFixApplied] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#172554] to-gov-blue text-white p-6 rounded-2xl border border-blue-900 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-400/20 text-blue-200 text-xs font-bold mb-2 border border-blue-300/30">
            <Factory className="w-3.5 h-3.5" />
            <span>Pre-Market Regulatory Label Verification</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Manufacturer &amp; Packer Self-Check Portal
          </h1>
          <p className="text-blue-100 text-xs mt-1 max-w-xl leading-relaxed">
            Audit packaging designs prior to commercial batch printing. Eliminate seizure risks, verify font height minimums, and generate pre-market QR compliance badges.
          </p>
        </div>

        <button
          onClick={() => setIsFixApplied(!isFixApplied)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isFixApplied ? 'Reset to Initial Scan' : 'Simulate Pre-Market Label Fix'}</span>
        </button>
      </div>

      {/* Manufacturer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Registered SKUs</div>
          <div className="text-2xl font-black text-slate-900 mt-1">24 Products</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Average Compliance</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">92.4%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Fixes</div>
          <div className="text-2xl font-black text-amber-600 mt-1">2 Labels</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">QR Badges Issued</div>
          <div className="text-2xl font-black text-gov-blue mt-1">18 Verified</div>
        </div>
      </div>

      {/* Before vs After Interactive Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Interactive Before &amp; After Regulatory Compliance Audit
            </h2>
            <p className="text-xs text-slate-500">
              Demonstrating the packaging correction workflow from initial deficiency to gold standard compliance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Compliance Progression:</span>
            <div className="flex items-center gap-2 font-mono text-sm font-extrabold">
              <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">72 / 100</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">96 / 100</span>
            </div>
          </div>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* BEFORE CARD */}
          <div className={`p-5 rounded-xl border transition-all ${!isFixApplied ? 'border-amber-400 bg-amber-50/20 ring-2 ring-amber-300' : 'border-slate-200 bg-slate-50/50'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  Initial Artwork Scan
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">ABC Biscuits (Draft Pack)</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-rose-600">72%</div>
                <div className="text-[10px] font-bold text-amber-700 uppercase">Medium Risk</div>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                <div className="font-bold text-rose-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Rule LM_MRP_001: Missing Tax Inclusive Clause</span>
                </div>
                <div className="text-[11px] text-rose-700">
                  Observed: &quot;MRP ₹ 120.00&quot; without mandatory &quot;(incl. of all taxes)&quot;.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                <div className="font-bold text-rose-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Rule LM_USP_001: Missing Unit Sale Price (USP)</span>
                </div>
                <div className="text-[11px] text-rose-700">
                  Rule 6(11) requires per g/ml retail cost declaration on pre-packs.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Net Qty: 500 g &bull; Mfg Date: 08/2026 &bull; Address: OK</span>
                </div>
              </div>
            </div>
          </div>

          {/* AFTER CARD */}
          <div className={`p-5 rounded-xl border transition-all ${isFixApplied ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-400' : 'border-slate-200 bg-slate-50/50'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Remediated Artwork Proof
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">ABC Biscuits (Final Production Proof)</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-600">96%</div>
                <div className="text-[10px] font-bold text-emerald-700 uppercase">Low Risk (Compliant)</div>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MRP Remediation Verified:</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  Artwork updated to: <span className="font-bold">&quot;MRP ₹ 120.00 (Inclusive of all taxes)&quot;</span>.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unit Sale Price Incorporated:</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  Added prominent declaration: <span className="font-bold">&quot;Unit Sale Price: ₹ 0.24 per g&quot;</span>.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pre-Market QR Clearance Certificate Generated: #MC-2026-01001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

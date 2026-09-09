'use client';

import React from 'react';
import { Compass, CheckCircle2, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const PHASES = [
  {
    phase: "Phase 1: Production Core (CURRENT HACKATHON BUILD)",
    status: "COMPLETED & LIVE",
    color: "emerald",
    items: [
      "Image Ingestion & Multi-Format Quality Assurance (Blur, Glare, Resolution)",
      "Pluggable OCR & Vision Abstraction Layer (Zero-API Key Demo Mode)",
      "Deterministic Statutory Rule Engine for Legal Metrology Rules, 2011 (Rule 6)",
      "MetroCheck Compliance Index (0-100) & Operational Risk Tiering",
      "Interactive Visual Evidence Canvas with Pan/Zoom & Color-Coded Bounding Boxes",
      "Human-in-the-Loop Officer Case Review with Overrides & Audit Log Chaining",
      "Official Statutory Inspection Record PDF & Printable HTML Generator"
    ]
  },
  {
    phase: "Phase 2: Differentiators & Consumer Empowerment (LIVE DEMO)",
    status: "COMPLETED & LIVE",
    color: "emerald",
    items: [
      "Bilingual / Multilingual Label Support (English & Hindi) & Indic Script OCR Readiness",
      "Public QR Verification Badge & Citizen Grievance Portal (/verify)",
      "Pre-Market Manufacturer Self-Check with Before/After Artwork Comparison",
      "AI Anomaly & Packaging Tamper Detection (Sticker Overlays, Font Discrepancies)",
      "Cryptographic SHA-256 Chained Immutable Audit Log with Mathematical Integrity Verification",
      "E-Commerce Marketplace Listing Auditor (Amazon, Flipkart, Blinkit, Zepto simulation)"
    ]
  },
  {
    phase: "Phase 3: Nationwide Mobile & Edge Enforcement",
    status: "ROADMAP (Q3 2026)",
    color: "blue",
    items: [
      "Full Offline Mobile Application with Background Edge OCR (TFLite / ONNX on-device)",
      "Automatic Synchronized Field Queues with District Legal Metrology Central Servers",
      "Live Barcode / GTIN 1D/2D GS1 Registry Integration with Smart Consumer Database",
      "Predictive Recidivism Modeling for High-Risk District Target Prioritization"
    ]
  },
  {
    phase: "Phase 4: Pan-India Inter-Departmental Enforcement Grid",
    status: "FUTURE ROADMAP (2027)",
    color: "amber",
    items: [
      "National Single-Window Integration with FSSAI (Food Safety) and BIS (Bureau of Indian Standards)",
      "E-Commerce Automated API Webhooks & Real-Time De-Listing of Non-Compliant Products",
      "Statutory Electronic Show Cause Notice Issuance with Aadhaar-based eSign Integration",
      "Permissioned Hyperledger / Blockchain Consensus Node for Tamper-Proof Pan-India Legal Records"
    ]
  }
];

export default function RoadmapPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-gov-blue font-bold text-xs uppercase tracking-wide mb-1">
          <Compass className="w-4 h-4" />
          <span>Strategic Product Vision</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          MetroCheck Deployment &amp; Scaling Roadmap
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Phased evolutionary trajectory transitioning from our Smart India Hackathon 2026 reference architecture to nationwide enterprise government deployment.
        </p>
      </div>

      {/* Phases Timeline */}
      <div className="space-y-4">
        {PHASES.map((p, idx) => {
          const isLive = p.status.includes("LIVE");
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                isLive ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>{p.phase}</span>
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider self-start sm:self-auto ${
                    isLive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-50 text-gov-blue border border-blue-200'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {p.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isLive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

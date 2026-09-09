'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Scan,
  Cpu,
  Sliders,
  AlertTriangle,
  FileText,
  BarChart,
  MapPin,
  QrCode,
  ShieldAlert,
  Scale
} from 'lucide-react';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Scan & Ingest Physical Commodity Package",
    desc: "Ingesting physical packaging image. Preprocessing checks image blur, resolution, and lighting orientation.",
    actionRoute: "/scanner?demo=abc-biscuits",
    icon: Scan,
    badge: "Image Ingestion"
  },
  {
    step: 2,
    title: "2. Optical Character & Visual Region Extraction",
    desc: "Pluggable OCR & Vision layer extracts label text blocks, detecting 20+ required packaging fields.",
    actionRoute: "/scanner?demo=abc-biscuits",
    icon: Cpu,
    badge: "Vision / OCR"
  },
  {
    step: 3,
    title: "3. Confidence Scoring & Threshold Assessment",
    desc: "Every detected declaration is assigned a Bayesian confidence score (0-100%). Values under threshold trigger manual verification.",
    actionRoute: "/scanner?demo=abc-biscuits",
    icon: Scale,
    badge: "Confidence Scoring"
  },
  {
    step: 4,
    title: "4. Deterministic Legal Metrology Rule Engine",
    desc: "Externalized statutory rules (LMPC Rules 2011, Rule 6) evaluate declarations without trusting AI hallucinations.",
    actionRoute: "/rules",
    icon: Sliders,
    badge: "Deterministic Engine"
  },
  {
    step: 5,
    title: "5. Statutory Violations & Contraventions",
    desc: "System identifies specific non-conformances: e.g. missing taxes inclusive declaration, non-standard metric unit, missing USP.",
    actionRoute: "/violations",
    icon: AlertTriangle,
    badge: "Violations Breakdown"
  },
  {
    step: 6,
    title: "6. Interactive Visual Evidence & Bounding Boxes",
    desc: "Visual evidence canvas links every violation and verified declaration to its precise physical coordinate on the package.",
    actionRoute: "/scanner?demo=abc-biscuits",
    icon: EyeIcon,
    badge: "Visual Ground Truth"
  },
  {
    step: 7,
    title: "7. MetroCheck Compliance Index & Risk Tiering",
    desc: "Generates transparent Compliance Index (e.g. 84/100) and categorizes operational Risk (Low, Medium, High, Critical).",
    actionRoute: "/",
    icon: Scale,
    badge: "Compliance Index"
  },
  {
    step: 8,
    title: "8. Human-in-the-Loop Inspector Case Review",
    desc: "Legal Metrology Officer can override OCR errors, attach field observations, and confirm or reject contraventions.",
    actionRoute: "/inspections",
    icon: CheckCircle2,
    badge: "Human Review"
  },
  {
    step: 9,
    title: "9. Statutory Inspection Record & PDF Report",
    desc: "Automated generation of official Legal Metrology inspection reports with digital SHA-256 audit hash and notice drafts.",
    actionRoute: "/inspections",
    icon: FileText,
    badge: "PDF Report Draft"
  },
  {
    step: 10,
    title: "10. Government Intelligence Dashboard & Trends",
    desc: "Real-time officer executive dashboard with compliance trends, top violation categories, and repeat offender rankings.",
    actionRoute: "/",
    icon: BarChart,
    badge: "Executive Dashboard"
  },
  {
    step: 11,
    title: "11. Geo-Tagged Violation & Risk Heatmap",
    desc: "Interactive Leaflet / OpenStreetMap visualizer pinning inspections and repeat violator hotspots across districts.",
    actionRoute: "/map",
    icon: MapPin,
    badge: "GIS Risk Map"
  },
  {
    step: 12,
    title: "12. Consumer QR Verification & Citizen Portal",
    desc: "Verified compliant commodities earn public QR verification badge, empowering citizens to verify authenticity in retail stores.",
    actionRoute: "/verify",
    icon: QrCode,
    badge: "Public QR Verification"
  }
];

function EyeIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export function JudgeDemoModal({ isOpen, onClose }: JudgeDemoModalProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const router = useRouter();

  if (!isOpen) return null;

  const current = DEMO_STEPS[currentStepIdx];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      router.push(DEMO_STEPS[nextIdx].actionRoute);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      router.push(DEMO_STEPS[prevIdx].actionRoute);
    }
  };

  const handleJumpTo = (idx: number) => {
    setCurrentStepIdx(idx);
    router.push(DEMO_STEPS[idx].actionRoute);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f2942] to-slate-900 p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                Smart India Hackathon 2026 &bull; Problem SIH26034
              </div>
              <h2 className="text-lg font-black text-white">
                MetroCheck Guided Judge Tour (3 Min Flow)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Progress: Step {current.step} of 12</span>
            <span className="text-amber-400 font-bold">{current.badge}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-sky-400 h-full transition-all duration-300"
              style={{ width: `${(current.step / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="p-3 bg-gov-navy/80 rounded-xl border border-slate-600 text-sky-400 shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">{current.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{current.desc}</p>
            </div>
          </div>

          {/* Quick Steps Navigation Pills */}
          <div className="grid grid-cols-6 gap-1.5 pt-2">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => handleJumpTo(idx)}
                className={`py-1 px-1 rounded text-[11px] font-bold border transition-colors ${
                  idx === currentStepIdx
                    ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-sm'
                    : idx < currentStepIdx
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800'
                }`}
              >
                #{s.step}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Controls */}
        <div className="p-5 border-t border-slate-800 bg-[#081320] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Step
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                router.push(current.actionRoute);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 border border-sky-500/30"
            >
              Open This Page Directly
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-md transition-all"
            >
              <span>{currentStepIdx === DEMO_STEPS.length - 1 ? 'Finish Tour' : 'Next Demo Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

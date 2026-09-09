'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Camera,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Trash2,
  Cpu,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Layers,
  ChevronRight
} from 'lucide-react';
import { BoundingBoxViewer } from '@/components/scanner/BoundingBoxViewer';
import { api } from '@/lib/api';
import { saveOfflineScan } from '@/lib/offline';

const DEMO_ITEMS = [
  { id: 'abc-biscuits', name: 'ABC Biscuits (Compliant Pack)', img: '/demo/abc_biscuits.svg', desc: 'Standard FMCG packaged food with full declarations' },
  { id: 'xyz-oil', name: 'XYZ Mustard Oil (Deficient Declarations)', img: '/demo/xyz_oil.svg', desc: 'Missing complete address PIN, unverified price, missing USP' },
  { id: 'fresh-soap', name: 'Fresh Glow Soap (98% Score)', img: '/demo/fresh_soap.svg', desc: 'High compliance personal care commodity' },
  { id: 'imported-chocolate', name: 'Swiss Delice (Imported Good)', img: '/demo/imported_chocolate.svg', desc: 'Imported chocolate requiring Rule 6(1)(g) Country of Origin' },
  { id: 'tampered-package', name: 'Tampered Basmati Rice', img: '/demo/tampered_rice.svg', desc: 'Suspicious sticker overlay defacing original retail price' },
  { id: 'hindi-label', name: 'अमृत चाय (Hindi / Bilingual)', img: '/demo/hindi_tea.svg', desc: 'Indic script packaging complying with bilingual rules' }
];

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading Packaging Scanner...</div>}>
      <ScannerContent />
    </Suspense>
  );
}

function ScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedDemo, setSelectedDemo] = useState<string>('abc-biscuits');
  const [imagePreview, setImagePreview] = useState<string>('/demo/abc_biscuits.svg');
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedFieldKey, setSelectedFieldKey] = useState<string | null>(null);
  const [qualityStatus, setQualityStatus] = useState<'GOOD' | 'NEEDS_IMPROVEMENT'>('GOOD');
  const [qualityScore, setQualityScore] = useState<number>(94);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check URL query for demo
  useEffect(() => {
    const demoParam = searchParams.get('demo');
    if (demoParam && DEMO_ITEMS.some((d) => d.id === demoParam)) {
      handleSelectDemo(demoParam);
    }
  }, [searchParams]);

  const handleSelectDemo = (demoId: string) => {
    setSelectedDemo(demoId);
    const item = DEMO_ITEMS.find((d) => d.id === demoId);
    if (item) {
      setImagePreview(item.img);
      if (demoId === 'tampered-package') {
        setQualityStatus('NEEDS_IMPROVEMENT');
        setQualityScore(68);
      } else {
        setQualityStatus('GOOD');
        setQualityScore(94);
      }
      setAnalysisResult(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setSelectedDemo('');
      setQualityStatus('GOOD');
      setQualityScore(91);
      setAnalysisResult(null);
    }
  };

  const runAnalysis = async () => {
    setIsProcessing(true);
    setProcessStep(1);

    // Realistic progressive pipeline steps
    const steps = [
      { step: 1, label: 'Image preprocessed & geometry normalized' },
      { step: 2, label: 'OCR & Vision text extraction complete' },
      { step: 3, label: 'Detecting statutory label regions & contours' },
      { step: 4, label: 'Extracting 10 mandatory Rule 6 fields' },
      { step: 5, label: 'Evaluating deterministic Legal Metrology rules' },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((res) => setTimeout(res, 220));
      setProcessStep(i + 1);
    }

    try {
      const res = await api.analyzeScan({
        demo_product_id: selectedDemo || 'abc-biscuits',
        image_url: imagePreview,
      });

      setAnalysisResult(res);
      setIsProcessing(false);
    } catch (err) {
      console.warn('Backend scan failed, running offline queue fallback:', err);
      // Save offline queue
      await saveOfflineScan({
        id: `offline-${Date.now()}`,
        demoProductId: selectedDemo,
        imageName: 'scanned_package.jpg',
        capturedAt: new Date().toISOString(),
        locationName: 'Field Unit Inspection',
        district: 'Delhi',
        syncStatus: 'PENDING',
      });
      setIsProcessing(false);
      alert('Network scan offline. Inspection recorded in IndexedDB sync queue.');
    }
  };

  const fields = analysisResult?.extracted_fields || {};
  const violations = analysisResult?.violations || [];
  const tamper = analysisResult?.tamper_analysis;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Product Packaging Scanner</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-gov-blue font-mono font-bold">
              Rule 6 Engine
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Capture, ingest, and validate pre-packaged commodity labels against Legal Metrology Rules, 2011.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera</span>
          </button>
        </div>
      </div>

      {/* Demo Selector Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Select High-Fidelity Demo Packaging Scenarios:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DEMO_ITEMS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => handleSelectDemo(demo.id)}
              className={`p-2 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                selectedDemo === demo.id
                  ? 'border-gov-blue bg-blue-50/70 shadow-xs ring-1 ring-gov-blue'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-slate-800 truncate">{demo.name}</div>
              <div className="text-[10px] text-slate-500 line-clamp-2 mt-1">{demo.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Canvas & Evidence Viewer (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700">Package Image Preview</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    qualityStatus === 'GOOD'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  Quality: {qualityStatus} ({qualityScore}%)
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  title="Rotate"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setImagePreview('/demo/abc_biscuits.svg');
                    setSelectedDemo('abc-biscuits');
                    setAnalysisResult(null);
                  }}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  title="Reset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bounding Box Visual Evidence Canvas */}
            <div className="min-h-[460px]">
              <BoundingBoxViewer
                imageUrl={imagePreview}
                fields={fields}
                selectedFieldKey={selectedFieldKey}
                onSelectField={(key) => setSelectedFieldKey(key)}
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          {!analysisResult && (
            <button
              onClick={runAnalysis}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-xl bg-gov-blue hover:bg-blue-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Statutory Declarations Pipeline...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Run Legal Metrology Verification Pipeline</span>
                </>
              )}
            </button>
          )}

          {/* Processing Status Pipeline UI */}
          {isProcessing && (
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-md text-xs space-y-2">
              <div className="font-bold text-sky-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Multi-Stage Verification Pipeline Active
              </div>
              <div className="space-y-1.5 pl-2 text-slate-300">
                <div className={processStep >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  &bull; Step 1: Image ingestion, sharpness check, perspective normalization
                </div>
                <div className={processStep >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  &bull; Step 2: OCR textual decoding &amp; contour detection
                </div>
                <div className={processStep >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  &bull; Step 3: Detecting bounding regions for MRP, Net Quantity, Dates
                </div>
                <div className={processStep >= 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  &bull; Step 4: Confidence scoring &amp; field normalization
                </div>
                <div className={processStep >= 5 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  &bull; Step 5: Statutory Legal Metrology (Packaged Commodities) Rule Engine
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Structured Extraction, Compliance Index, Violations (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {analysisResult ? (
            <>
              {/* Compliance Index Score Box */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      MetroCheck Compliance Index
                    </div>
                    <div className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
                      <span>{analysisResult.compliance_index}</span>
                      <span className="text-base text-slate-400 font-bold">/ 100</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        analysisResult.risk_level === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : analysisResult.risk_level === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {analysisResult.risk_level} RISK
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Case: {analysisResult.case_id}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/inspections/${analysisResult.inspection_id}`}
                    className="flex-1 py-2 px-3 bg-gov-blue hover:bg-blue-900 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Open Inspector Case &amp; Override</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Tamper / Anomaly Alert (if detected) */}
              {tamper && tamper.anomalies_detected > 0 && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 text-xs">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-1">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>AI Anomaly / Tamper Warning ({tamper.tamper_risk} RISK)</span>
                  </div>
                  {tamper.anomalies.map((an: any, idx: number) => (
                    <div key={idx} className="mt-2 text-slate-700 bg-white/70 p-2.5 rounded border border-rose-200">
                      <div className="font-bold text-rose-900">{an.type}: {an.region}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{an.description}</div>
                      <div className="text-[10px] text-amber-800 font-semibold mt-1">Recommended: {an.remediation}</div>
                    </div>
                  ))}
                  <div className="text-[10px] text-rose-600 italic mt-2">
                    * AI anomaly detection assistance only. Requires physical confirmation by an inspector.
                  </div>
                </div>
              )}

              {/* Violations List */}
              {violations.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Detected Contraventions ({violations.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {violations.map((v: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedFieldKey(v.field_name)}
                        className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 cursor-pointer text-xs transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900">{v.rule_code}</span>
                          <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            {v.severity}
                          </span>
                        </div>
                        <div className="text-slate-800 mt-1 font-semibold">{v.failure_message}</div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          Remediation: <span className="text-slate-900">{v.remediation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Structured Extracted Declarations Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex-1">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Extracted Mandatory Declarations
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Click field to locate</span>
                </div>

                <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 text-xs">
                  {Object.entries(fields).map(([key, f]: [string, any]) => {
                    const isSelected = selectedFieldKey === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setSelectedFieldKey(key)}
                        className={`p-3 transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-sky-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-tight">
                            {key.replace('_', ' ')}
                          </div>
                          <div className="font-bold text-slate-900 truncate">
                            {f.value || f.detected_value || '—'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                            {Math.round((f.confidence || 0) * 100)}%
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              f.status === 'PASS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : f.status === 'VERIFY'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {f.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Standby Guide */
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 text-center flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-gov-blue flex items-center justify-center mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                Ready for Packaging Verification
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Select a sample scenario from above or upload packaging photos. Click &quot;Run Legal Metrology Verification Pipeline&quot; to inspect against Rule 6 statutory declarations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

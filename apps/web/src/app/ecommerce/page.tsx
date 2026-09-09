'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';

export default function EcommerceCompliancePage() {
  const [url, setUrl] = useState('https://www.flipkart.com/item/organic-cashews-500g');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.analyzeEcommerce(url);
      setResult(data);
    } catch (err) {
      console.error('Failed to analyze e-commerce listing:', err);
    } finally {
      setLoading(false);
    }
  };

  const setSampleUrl = (sample: string) => {
    setUrl(sample);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">
              E-Commerce Marketplace Packaging Checker
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-gov-blue font-bold">
              Rule 6(10) E-Commerce
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated compliance auditing for online marketplace listings (Amazon, Flipkart, Blinkit, Zepto) under Legal Metrology E-Commerce Rules 2017.
          </p>
        </div>

        <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-semibold">
          Demo Listing Analysis Pipeline
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <ShoppingCart className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste product page URL from Amazon, Flipkart, Blinkit, or Zepto..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-gov-blue outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gov-blue hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            {loading ? 'Analyzing Listing Declarations...' : 'Audit Listing Compliance'}
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
          <span className="font-bold">Try Sample URLs:</span>
          <button
            onClick={() => setSampleUrl('https://www.flipkart.com/item/organic-cashews-500g')}
            className="text-gov-blue hover:underline font-medium"
          >
            Flipkart (Cashews 500g)
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setSampleUrl('https://www.blinkit.com/item/farm-fresh-butter-100g')}
            className="text-gov-blue hover:underline font-medium"
          >
            Blinkit (Quick Commerce Butter)
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setSampleUrl('https://www.amazon.in/item/swiss-chocolate-bar-imported')}
            className="text-gov-blue hover:underline font-medium"
          >
            Amazon (Imported Swiss Chocolate)
          </button>
        </div>
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Platform: {result.marketplace}
              </span>
              <h3 className="font-black text-slate-900 text-base mt-1">
                {result.product_title}
              </h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Listing Compliance Index
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {result.compliance_index} <span className="text-base text-slate-400 font-bold">/ 100</span>
              </div>
              <div className="mt-2">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black uppercase ${
                    result.risk_level === 'LOW'
                      ? 'bg-emerald-100 text-emerald-800'
                      : result.risk_level === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {result.risk_level} RISK
                </span>
              </div>
            </div>

            {/* Missing Declarations Box */}
            {result.missing_declarations && result.missing_declarations.length > 0 && (
              <div className="p-3.5 bg-rose-50 rounded-lg border border-rose-200 text-xs space-y-1.5">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Missing Mandatory Declarations:</span>
                </div>
                <ul className="list-disc pl-5 text-rose-800 text-[11px] space-y-0.5">
                  {result.missing_declarations.map((m: string, idx: number) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide pb-2 border-b border-slate-100">
              Verified Pre-Purchase Listing Declarations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.detected_declarations.map((d: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">{d.field}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{d.value}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">Confidence: {d.confidence}</div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 italic pt-2">
              * Legal requirement under Consumer Protection (E-Commerce) Rules, 2020 and Rule 6(10) of LMPC Rules.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

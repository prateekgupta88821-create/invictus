'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  ScanLine,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api } from '@/lib/api';
import { useApp } from './layout';
import { translations } from '@/lib/i18n';

export default function DashboardPage() {
  const { lang, openDemo } = useApp();
  const t = translations[lang];

  const [summary, setSummary] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, anaRes, inspRes] = await Promise.all([
          api.getSummary().catch(() => null),
          api.getAnalytics().catch(() => null),
          api.getInspections('limit=7').catch(() => null),
        ]);

        if (sumRes) setSummary(sumRes.kpi);
        if (anaRes) setAnalytics(anaRes);
        if (inspRes) setInspections(inspRes.items || []);
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const kpis = summary || {
    total_inspections: 1284,
    compliant: 914,
    violations: 270,
    high_risk: 100,
    pending_verification: 18,
    overall_compliance_rate: 82.4,
  };

  const riskData = analytics?.risk_distribution || [
    { name: 'Low Risk (80-100)', value: 914, color: '#16a34a' },
    { name: 'Medium Risk (60-79)', value: 170, color: '#eab308' },
    { name: 'High Risk (40-59)', value: 120, color: '#f97316' },
    { name: 'Critical Risk (0-39)', value: 80, color: '#dc2626' },
  ];

  const violationCategories = analytics?.violation_categories || [
    { category: 'MRP / Taxes Declaration', count: 142 },
    { category: 'Manufacturing Date Format', count: 98 },
    { category: 'Unit Sale Price (USP)', count: 74 },
    { category: 'Consumer Care Contact', count: 58 },
    { category: 'Complete Postal Address', count: 42 },
    { category: 'Metric Unit Standards', count: 28 },
  ];

  const trendData = analytics?.compliance_trend || [
    { month: 'Apr', compliance_rate: 76, inspections: 180 },
    { month: 'May', compliance_rate: 79, inspections: 210 },
    { month: 'Jun', compliance_rate: 81, inspections: 240 },
    { month: 'Jul', compliance_rate: 82, inspections: 290 },
    { month: 'Aug', compliance_rate: 84, inspections: 330 },
    { month: 'Sep', compliance_rate: 86, inspections: 384 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Actions Banner */}
      <div className="bg-gradient-to-r from-gov-navy via-[#14324f] to-gov-blue text-white rounded-2xl p-6 shadow-md border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 2026 Problem SIH26034 Enforcement System</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Legal Metrology Compliance Command Center
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
            AI-assisted verification platform for Packaged Commodities Rules, 2011. Converts packaging imagery to structured compliance evidence with deterministic statutory validation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/scanner"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-all"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan Product Packaging</span>
          </Link>
          <button
            onClick={openDemo}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-extrabold shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Guided Judge Tour</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Inspections</span>
            <FileCheck2 className="w-4 h-4 text-gov-blue" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {kpis.total_inspections.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% this month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <span>Compliant Packs</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {kpis.compliant.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Compliance Index: {kpis.overall_compliance_rate}%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-rose-700 text-xs font-bold uppercase tracking-wider">
            <span>Violations Flagged</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">
            {kpis.violations.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Action notices generated
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase tracking-wider">
            <span>High / Critical Risk</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">
            {kpis.high_risk.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            Priority enforcement targets
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-sky-700 text-xs font-bold uppercase tracking-wider">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-800 mt-2">
            {kpis.pending_verification.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Awaiting Officer sign-off
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Trend Over Time */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Compliance Rate Trend &amp; Inspection Volume
              </h2>
              <p className="text-xs text-slate-500">
                Monthly trajectory under Rule 6 compliance monitoring
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              National Index: 86%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#0284c7" stop-opacity={0.3} />
                    <stop offset="95%" stop-color="#0284c7" stop-opacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[60, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="compliance_rate"
                  name="Compliance Rate %"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#compGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Level Distribution Donut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="mb-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Risk Level Distribution
            </h2>
            <p className="text-xs text-slate-500">Categorized by MetroCheck Index</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {riskData.map((r: any) => (
              <div key={r.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-slate-600 truncate">{r.name.split(' ')[0]}</span>
                <span className="font-bold text-slate-900 ml-auto">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Top Violations & Repeat Offenders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Violations Horizontal Bar */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Top Contraventions by Statutory Category
              </h2>
              <p className="text-xs text-slate-500">
                Most frequent packaging deficiencies identified under LMPC Rules
              </p>
            </div>
            <Link
              href="/violations"
              className="text-xs font-semibold text-gov-blue hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationCategories} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#64748b" fontSize={10} width={130} />
                <Tooltip />
                <Bar dataKey="count" name="Violations Count" fill="#dc2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repeat Offender / High Risk Manufacturers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Repeat Violator Profiles
              </h2>
              <p className="text-xs text-slate-500">High-risk entities flagged for review</p>
            </div>
            <Link href="/businesses" className="text-xs font-semibold text-gov-blue hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {(analytics?.repeat_offenders || [
              { name: 'Heritage Grain Traders', district: 'Fatehgarh Sahib', repeat_violations: 4, risk_tier: 'CRITICAL', risk_score: 88 },
              { name: 'Patan Agro Processors Ltd', district: 'Ahmedabad', repeat_violations: 3, risk_tier: 'HIGH', risk_score: 82 },
              { name: 'Sunrise Dairy Products LLP', district: 'Gurugram', repeat_violations: 3, risk_tier: 'HIGH', risk_score: 74 },
              { name: 'XYZ Agro Mills Limited', district: 'Alwar', repeat_violations: 2, risk_tier: 'MEDIUM', risk_score: 68 },
            ]).map((biz: any) => (
              <div
                key={biz.name}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{biz.name}</div>
                  <div className="text-slate-500 text-[11px]">
                    {biz.district} &bull; {biz.repeat_violations} Repeat Contraventions
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    biz.risk_tier === 'CRITICAL'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : biz.risk_tier === 'HIGH'
                      ? 'bg-orange-100 text-orange-800 border border-orange-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {biz.risk_tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Packaging Inspections
            </h2>
            <p className="text-xs text-slate-500">
              Field officer scans and statutory verification statuses
            </p>
          </div>

          <Link
            href="/inspections"
            className="text-xs font-bold text-gov-blue hover:text-blue-900 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Product Commodity</th>
                <th className="py-3 px-4">Manufacturer</th>
                <th className="py-3 px-4">Compliance Index</th>
                <th className="py-3 px-4">Risk Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {inspections.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">
                    Loading recent inspections...
                  </td>
                </tr>
              ) : (
                inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gov-blue">
                      {insp.case_id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {insp.product_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">
                      {insp.manufacturer}
                    </td>
                    <td className="py-3 px-4 font-extrabold">
                      <span
                        className={
                          insp.compliance_score >= 80
                            ? 'text-emerald-600'
                            : insp.compliance_score >= 60
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        {insp.compliance_score} / 100
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          insp.risk_level === 'LOW'
                            ? 'bg-emerald-100 text-emerald-800'
                            : insp.risk_level === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {insp.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          insp.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : insp.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {insp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {insp.district}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/inspections/${insp.id}`}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-gov-navy rounded font-bold text-[11px] transition-colors inline-block"
                      >
                        Review Case
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

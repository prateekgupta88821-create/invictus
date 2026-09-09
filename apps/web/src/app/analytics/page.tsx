'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Download } from 'lucide-react';
import { api } from '@/lib/api';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const riskData = analytics?.risk_distribution || [
    { name: 'Low Risk (80-100)', value: 914, color: '#16a34a' },
    { name: 'Medium Risk (60-79)', value: 170, color: '#eab308' },
    { name: 'High Risk (40-59)', value: 120, color: '#f97316' },
    { name: 'Critical Risk (0-39)', value: 80, color: '#dc2626' },
  ];

  const categoryData = analytics?.violation_categories || [
    { category: 'MRP Declaration', count: 142 },
    { category: 'Manufacturing Date', count: 98 },
    { category: 'Unit Sale Price', count: 74 },
    { category: 'Consumer Care', count: 58 },
    { category: 'Address', count: 42 },
    { category: 'Net Qty Units', count: 28 },
  ];

  const monthlyTrends = analytics?.compliance_trend || [
    { month: 'Apr', inspections: 180, compliant: 140, compliance_rate: 78 },
    { month: 'May', inspections: 210, compliant: 165, compliance_rate: 79 },
    { month: 'Jun', inspections: 240, compliant: 200, compliance_rate: 83 },
    { month: 'Jul', inspections: 290, compliant: 240, compliance_rate: 83 },
    { month: 'Aug', inspections: 330, compliant: 280, compliance_rate: 85 },
    { month: 'Sep', inspections: 384, compliant: 330, compliance_rate: 86 },
  ];

  const districtData = analytics?.district_data || [
    { district: 'South East Delhi', inspections: 24 },
    { district: 'Alwar', inspections: 18 },
    { district: 'Solan', inspections: 15 },
    { district: 'Fatehgarh Sahib', inspections: 14 },
    { district: 'Gurugram', inspections: 12 },
    { district: 'Noida', inspections: 11 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Enforcement Analytics &amp; Statistical Insights</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-gov-blue font-bold">
              National Metrology Dashboard
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated statutory compliance metrics under Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Rate Trajectory */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
            National Compliance Trajectory (% Rate)
          </h3>
          <p className="text-xs text-slate-400 mb-4">Tracking monthly improvement in pre-packaged goods</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="compliance_rate" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Category */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
            Frequency of Contraventions by Statutory Category
          </h3>
          <p className="text-xs text-slate-400 mb-4">Categorized contraventions flagged during inspections</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" height={40} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Level Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
            Overall Packaging Risk Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-4">Inspected commodities segmented by risk bands</p>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" outerRadius={85} dataKey="value" label>
                  {riskData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Wise Volume */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
            Inspections Volume by Administrative District
          </h3>
          <p className="text-xs text-slate-400 mb-4">Active surveillance across Northern / Central zones</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="district" type="category" stroke="#64748b" fontSize={10} width={110} />
                <Tooltip />
                <Bar dataKey="inspections" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

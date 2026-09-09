'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Eye,
  Plus
} from 'lucide-react';
import { api } from '@/lib/api';

export default function InspectionsListPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const queryParts: string[] = ['limit=50'];
      if (statusFilter) queryParts.push(`status=${encodeURIComponent(statusFilter)}`);
      if (riskFilter) queryParts.push(`risk=${encodeURIComponent(riskFilter)}`);
      if (searchQuery) queryParts.push(`search=${encodeURIComponent(searchQuery)}`);

      const res = await api.getInspections(queryParts.join('&'));
      setInspections(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [statusFilter, riskFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInspections();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Statutory Packaging Inspections</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
              {total} Total Cases
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official records of packaged commodity label examinations under the Legal Metrology Act, 2009.
          </p>
        </div>

        <Link
          href="/scanner"
          className="flex items-center gap-2 px-4 py-2 bg-gov-blue hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Packaging Inspection</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Case ID (e.g. MC-2026), Product name, or Manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-gov-blue text-xs"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Resolved">Resolved</option>
            <option value="Draft">Draft</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="">All Risk Tiers</option>
            <option value="LOW">Low Risk (80-100)</option>
            <option value="MEDIUM">Medium Risk (60-79)</option>
            <option value="HIGH">High Risk (40-59)</option>
            <option value="CRITICAL">Critical Risk (0-39)</option>
          </select>
        </div>
      </div>

      {/* Inspections Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Commodity / Product</th>
                <th className="py-3.5 px-4">Manufacturer / Packer</th>
                <th className="py-3.5 px-4">Compliance Index</th>
                <th className="py-3.5 px-4">Risk Tier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Loading statutory inspection records...
                  </td>
                </tr>
              ) : inspections.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No inspection cases matching current filters.
                  </td>
                </tr>
              ) : (
                inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gov-blue">
                      {insp.case_id}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {insp.product_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">
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
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
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
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {insp.created_at ? new Date(insp.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/inspections/${insp.id}`}
                        className="px-3 py-1 bg-gov-blue hover:bg-blue-900 text-white rounded font-bold text-[11px] transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
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

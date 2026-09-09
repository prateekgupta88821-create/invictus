'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Download, Printer, Search, ShieldCheck, AlertTriangle, Filter, ExternalLink, Calendar, Building } from 'lucide-react';
import Link from 'next/link';

export default function ReportsDirectoryPage() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/inspections?limit=100')
      .then((r) => r.json())
      .then((data) => {
        setInspections(data.items || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Failed to load reports:', e);
        setLoading(false);
      });
  }, []);

  const filtered = inspections.filter((insp) => {
    const matchesSearch =
      insp.case_id.toLowerCase().includes(search.toLowerCase()) ||
      insp.product_name.toLowerCase().includes(search.toLowerCase()) ||
      insp.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = selectedRisk ? insp.risk_level === selectedRisk : true;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-gov-blue text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Statutory Repository</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Legal Metrology Inspection Reports & Notices
          </h1>
          <p className="text-xs text-slate-500">
            Form-V Statutory Reports, Inspection Records, and Advisory Notices generated under the Legal Metrology Act, 2009.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Case ID, Commodity, or Manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-gov-blue outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-gov-blue outline-none"
          >
            <option value="">All Risk Tiers</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs font-bold text-slate-500">
            Loading statutory reports...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs font-bold text-slate-500">
            No inspection reports match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Case Reference</th>
                  <th className="py-3 px-4">Packaged Commodity</th>
                  <th className="py-3 px-4">Registered Business</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4">Risk Tier</th>
                  <th className="py-3 px-4">Enforcement Status</th>
                  <th className="py-3 px-4 text-right">Statutory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filtered.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gov-blue">
                      <Link href={`/inspections/${insp.case_id}`} className="hover:underline">
                        {insp.case_id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {insp.product_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{insp.manufacturer}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-black">
                      <span className={`px-2 py-0.5 rounded-md ${
                        insp.compliance_score >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : insp.compliance_score >= 60
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {insp.compliance_score}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                        insp.risk_level === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : insp.risk_level === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : insp.risk_level === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {insp.risk_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold text-slate-600">
                        {insp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/inspections/${insp.case_id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          View Case
                        </Link>
                        <a
                          href={`http://127.0.0.1:8000/api/reports/${insp.case_id}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-gov-blue hover:bg-blue-900 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

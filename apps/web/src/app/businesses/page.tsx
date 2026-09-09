'use client';

import React, { useEffect, useState } from 'react';
import { Building2, AlertTriangle, ShieldCheck, Search, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function BusinessesDirectoryPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getBusinesses();
        setBusinesses(data || []);
      } catch (err) {
        console.error('Failed to load businesses:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = businesses.filter((b) =>
    (b.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.district || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Packager &amp; Manufacturer Risk Profiles</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              Surveillance Registry
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking repeat packaging contraventions, cumulative compliance indices, and enforcement risk rankings.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search manufacturer or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-gov-blue outline-none"
          />
        </div>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400 text-xs">
            Loading manufacturer profiles...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400 text-xs">
            No entities matching search query.
          </div>
        ) : (
          filtered.map((biz) => (
            <div
              key={biz.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-gov-blue">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      biz.risk_tier === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : biz.risk_tier === 'HIGH'
                        ? 'bg-orange-100 text-orange-800 border border-orange-300'
                        : biz.risk_tier === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {biz.risk_tier} RISK
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3">{biz.name}</h3>
                <div className="text-xs text-slate-500 mt-0.5">{biz.address}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">Reg: {biz.registration_number}</div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Inspections</div>
                    <div className="text-sm font-black text-slate-800">{biz.total_inspections}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Repeat Flags</div>
                    <div className="text-sm font-black text-rose-700">{biz.repeat_violations_count}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Risk Score</div>
                    <div className="text-sm font-black text-slate-900">{biz.risk_score}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-right">
                <span className="text-[11px] font-bold text-gov-blue inline-flex items-center gap-1 hover:underline cursor-pointer">
                  <span>View Inspection History</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

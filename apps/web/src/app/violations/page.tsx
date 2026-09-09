'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, ArrowRight, Search, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function ViolationsDirectoryPage() {
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadViolations = async () => {
    try {
      const data = await api.getInspections('limit=50');
      const allViolations: any[] = [];
      (data.items || []).forEach((insp: any) => {
        if (insp.violations_count > 0) {
          allViolations.push({
            id: insp.id,
            case_id: insp.case_id,
            product_name: insp.product_name,
            manufacturer: insp.manufacturer,
            district: insp.district,
            compliance_score: insp.compliance_score,
            risk: insp.risk_level,
            date: insp.created_at,
          });
        }
      });
      setViolations(allViolations);
    } catch (err) {
      console.error('Failed to load violations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadViolations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Statutory Contraventions &amp; Violations Registry</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
              Enforcement Cases
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centrally cataloged Legal Metrology non-compliances, evidentiary backing, and statutory remediation requirements under Rule 6.
          </p>
        </div>
      </div>

      {/* Directory Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-400 text-xs">
            Loading contraventions directory...
          </div>
        ) : violations.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400 text-xs">
            No confirmed contraventions found.
          </div>
        ) : (
          violations.map((v) => (
            <div
              key={v.id}
              className="bg-white p-5 rounded-xl border border-rose-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono font-bold text-xs text-gov-blue">
                    {v.case_id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      v.risk === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {v.risk} RISK
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2">{v.product_name}</h3>
                <div className="text-xs text-slate-600 mt-0.5">{v.manufacturer}</div>
                <div className="text-[11px] text-slate-400 mt-1">District: {v.district}</div>

                <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-900 space-y-1">
                  <div className="font-bold text-[11px] uppercase tracking-wide text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Statutory Non-Compliance
                  </div>
                  <div className="text-slate-700 text-[11px]">
                    Non-compliant under Rule 6: Deficient or ambiguous statutory declaration detected.
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700">
                  Index: {v.compliance_score}/100
                </span>
                <Link
                  href={`/inspections/${v.id}`}
                  className="px-3 py-1.5 bg-gov-navy hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                >
                  <span>Review Evidence</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

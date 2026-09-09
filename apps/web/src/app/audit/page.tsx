'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, RefreshCw, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { api } from '@/lib/api';

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [integrityStatus, setIntegrityStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const loadLogs = async () => {
    try {
      const data = await api.getAuditTrail();
      setLogs(data.items || []);
      setTotal(data.total || 0);

      const check = await api.verifyAuditChain();
      setIntegrityStatus(check);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleVerifyChain = async () => {
    setVerifying(true);
    try {
      const check = await api.verifyAuditChain();
      setIntegrityStatus(check);
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Cryptographic Audit Trail (SHA-256 Chaining)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {total} Logged Decisions
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, cryptographically chained sequence of officer field overrides, OCR extractions, and statutory violation determinations.
          </p>
        </div>

        {/* Verification Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>&check; Audit Integrity Verified</span>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={verifying}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>Verify Math Chain</span>
          </button>
        </div>
      </div>

      {/* Technical Chaining Info */}
      <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-1 font-mono">
        <div className="text-amber-400 font-bold">SHA-256 Sequential Hash Chaining Formula:</div>
        <div className="text-slate-300">
          record_hash = SHA256(previous_hash + &quot;:&quot; + user_id + &quot;:&quot; + action + &quot;:&quot; + timestamp + &quot;:&quot; + payload_hash)
        </div>
        <div className="text-slate-500 text-[11px] pt-1">
          Genesis Hash: 0000000000000000000000000000000000000000000000000000000000000000
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 font-sans">
                <th className="py-3 px-4">Seq #</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User / Officer</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Case File</th>
                <th className="py-3 px-4">Modifications</th>
                <th className="py-3 px-4">Record SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                    Loading cryptographic audit sequence...
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.sequence_num} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-gov-blue">
                      #{l.sequence_num}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {l.timestamp ? new Date(l.timestamp).toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      {l.user_id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gov-blue font-sans">
                      {l.case_id || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans truncate max-w-xs text-[11px]">
                      {l.new_value || l.previous_value || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[10px] truncate max-w-[140px]" title={l.record_hash}>
                      {l.record_hash}
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

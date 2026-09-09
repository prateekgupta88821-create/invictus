'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Download,
  Printer,
  FileText,
  Edit3,
  ArrowLeft,
  Clock,
  ShieldAlert,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { BoundingBoxViewer } from '@/components/scanner/BoundingBoxViewer';
import { api } from '@/lib/api';

export default function InspectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [inspection, setInspection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFieldKey, setSelectedFieldKey] = useState<string | null>(null);

  // Edit Field Modal State
  const [editModalField, setEditModalField] = useState<any>(null);
  const [editValue, setEditValue] = useState('');
  const [editStatus, setEditStatus] = useState('PASS');
  const [editNote, setEditNote] = useState('');

  // Notice Draft Modal State
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [noticeText, setNoticeText] = useState('');

  const loadCase = async () => {
    try {
      const data = await api.getInspection(id);
      setInspection(data);
    } catch (err) {
      console.error('Failed to load inspection case:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadCase();
  }, [id]);

  const handleOpenEdit = (field: any) => {
    setEditModalField(field);
    setEditValue(field.detected_value || '');
    setEditStatus(field.status || 'PASS');
    setEditNote(field.override_note || 'Inspecting officer verified from physical packaging');
  };

  const handleSaveOverride = async () => {
    if (!editModalField) return;
    try {
      await api.overrideField(id, editModalField.field_name, {
        field_name: editModalField.field_name,
        override_value: editValue,
        override_note: editNote,
        new_status: editStatus,
      });
      setEditModalField(null);
      loadCase();
    } catch (err) {
      console.error('Failed to save field override:', err);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await api.updateInspectionStatus(id, {
        status,
        inspector_notes: `Status marked as ${status} by inspecting officer.`,
      });
      loadCase();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleGenerateNotice = async () => {
    try {
      const res = await api.generateNotice(id);
      setNoticeText(res.notice_draft);
      setNoticeModalOpen(true);
    } catch (err) {
      console.error('Failed to draft notice:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-slate-400 text-sm">
        Loading Legal Metrology inspection record...
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-slate-500">
        Inspection case not found.
      </div>
    );
  }

  // Convert array to dict for BoundingBoxViewer
  const fieldsDict: Record<string, any> = {};
  (inspection.fields || []).forEach((f: any) => {
    fieldsDict[f.field_name] = {
      value: f.detected_value,
      confidence: f.confidence,
      bbox: f.bbox,
      status: f.status,
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link
            href="/inspections"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-gov-blue font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inspections Directory</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900">
              Inspection Case: <span className="font-mono text-gov-blue">{inspection.case_id}</span>
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                inspection.status === 'Confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : inspection.status === 'Resolved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {inspection.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {inspection.product_name} &bull; {inspection.manufacturer} &bull; District: {inspection.district}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Official PDF */}
          <a
            href={`/api/reports/${inspection.id}/pdf`}
            download
            className="flex items-center gap-1.5 px-3 py-2 bg-gov-navy hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (PDF)</span>
          </a>

          {/* Printable HTML */}
          <a
            href={`/api/reports/${inspection.id}/html`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </a>

          {/* Draft Notice */}
          <button
            onClick={handleGenerateNotice}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>Draft Statutory Notice</span>
          </button>
        </div>
      </div>

      {/* Case Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            MetroCheck Compliance Index
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {inspection.compliance_score} <span className="text-sm text-slate-400 font-bold">/ 100</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Risk Assessment
          </div>
          <div
            className={`text-xl font-black mt-1 uppercase ${
              inspection.risk_level === 'LOW'
                ? 'text-emerald-600'
                : inspection.risk_level === 'MEDIUM'
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}
          >
            {inspection.risk_level} RISK
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Public QR Verification
          </div>
          <div className="text-xs font-bold mt-2 flex items-center gap-1.5">
            {inspection.compliance_score >= 80 ? (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                &check; Verified QR Issued
              </span>
            ) : (
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Pending Remediation
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Cryptographic Audit Chain
          </div>
          <div className="text-xs font-bold text-slate-700 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SHA-256 Verified</span>
          </div>
        </div>
      </div>

      {/* Main Review Section: Packaging Canvas vs Extracted Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Evidence Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
            <span className="font-bold text-slate-800">Physical Packaging Visual Ground Truth</span>
            <span className="text-slate-400">Click field to cross-examine</span>
          </div>

          <div className="min-h-[440px] flex-1">
            <BoundingBoxViewer
              imageUrl={inspection.scan_image_url}
              fields={fieldsDict}
              selectedFieldKey={selectedFieldKey}
              onSelectField={(key) => setSelectedFieldKey(key)}
            />
          </div>
        </div>

        {/* Right Column: Human-in-the-Loop Override Checklist (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          {/* Officer Decision Toolbar */}
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase text-slate-300">
                Officer Enforcement Action:
              </div>
              <div className="text-[11px] text-slate-400">
                Current State: <span className="text-white font-bold">{inspection.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateStatus('Confirmed')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
              >
                Confirm Violation
              </button>
              <button
                onClick={() => handleUpdateStatus('Resolved')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-xs transition-colors"
              >
                Mark Compliant
              </button>
              <button
                onClick={() => handleUpdateStatus('Under Review')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-bold transition-colors"
              >
                Needs Verification
              </button>
            </div>
          </div>

          {/* Violations Box (if any) */}
          {inspection.violations && inspection.violations.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Statutory Contraventions ({inspection.violations.length})</span>
              </h3>
              <div className="space-y-2 text-xs">
                {inspection.violations.map((v: any) => (
                  <div key={v.id} className="p-3 bg-white rounded-lg border border-rose-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">{v.rule_code}</span>
                      <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                        {v.severity}
                      </span>
                    </div>
                    <div className="text-slate-800 mt-1 font-semibold">{v.failure_message}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Statutory Remedy: <span className="text-slate-900">{v.remediation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Fields Table with Override Action */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex-1">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Mandatory Packaging Declarations (Rule 6)
              </h3>
              <span className="text-[11px] text-slate-400">Officer overrides log to audit chain</span>
            </div>

            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 text-xs">
              {(inspection.fields || []).map((f: any) => {
                const isSelected = selectedFieldKey === f.field_name;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFieldKey(f.field_name)}
                    className={`p-3.5 flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-sky-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 pr-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-[11px] uppercase">
                          {f.field_name.replace('_', ' ')}
                        </span>
                        {f.inspector_override && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded">
                            OVERRIDDEN
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-900 mt-0.5 truncate">
                        {f.detected_value || '—'}
                      </div>
                      {f.override_note && (
                        <div className="text-[10px] text-slate-400 italic">
                          Note: {f.override_note}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.status === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : f.status === 'VERIFY'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {f.status}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(f);
                        }}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                        title="Override value"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Field Override Modal */}
      {editModalField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-300 w-full max-w-md p-5 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">
                Human-in-the-Loop Override: {editModalField.field_name.replace('_', ' ').toUpperCase()}
              </h3>
              <button onClick={() => setEditModalField(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Observed Value on Physical Pack:</label>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Statutory Determination:</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-gov-blue outline-none"
              >
                <option value="PASS">PASS &bull; Compliant with Rule 6</option>
                <option value="VERIFY">VERIFY &bull; Requires Secondary Lab Examination</option>
                <option value="FAIL">FAIL &bull; Statutory Contravention</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Officer Justification Note (Audit Log):</label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={3}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-gov-blue outline-none text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditModalField(null)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                className="px-4 py-2 bg-gov-blue hover:bg-blue-900 text-white rounded-lg font-bold shadow-xs"
              >
                Save &amp; Recalculate Index
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Cause Notice Draft Modal */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-300 w-full max-w-2xl p-6 shadow-2xl text-xs space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                  Draft Generated for Officer Review Only
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">
                  Draft Statutory Show Cause Notice (Rule 6)
                </h3>
              </div>
              <button onClick={() => setNoticeModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap text-slate-800 leading-relaxed">
              {noticeText}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span>* Notice drafts are never automatically dispatched. Officer digital signature required.</span>
              <button
                onClick={() => setNoticeModalOpen(false)}
                className="px-4 py-2 bg-gov-navy text-white font-bold rounded-lg"
              >
                Close Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

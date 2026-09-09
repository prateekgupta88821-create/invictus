'use client';

import React, { useEffect, useState } from 'react';
import { Sliders, ShieldCheck, Edit2, Save, X, Info, Check, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

export default function RulesManagementPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<any>(null);

  const loadRules = async () => {
    try {
      const data = await api.getRules();
      setRules(data);
    } catch (err) {
      console.error('Failed to load rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleToggleActive = async (rule: any) => {
    try {
      await api.updateRule(rule.rule_code, { active: !rule.active });
      loadRules();
    } catch (err) {
      console.error('Failed to toggle rule active state:', err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingRule) return;
    try {
      await api.updateRule(editingRule.rule_code, {
        name: editingRule.name,
        severity: editingRule.severity,
        weight: parseFloat(editingRule.weight),
        confidence_threshold: parseFloat(editingRule.confidence_threshold),
      });
      setEditingRule(null);
      loadRules();
    } catch (err) {
      console.error('Failed to update rule:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">
              Deterministic Legal Metrology Rules Engine
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
              Version: LMPC-2011-v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative regulatory definitions decoupled from AI models. Configurable weights, condition checks, and statutory severities under Rule 6.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-500">Statutory Authority:</span>
          <div className="text-xs font-extrabold text-gov-blue">The Legal Metrology Act, 2009 (Sec 52)</div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Rule Code</th>
                <th className="py-3 px-4">Statutory Declaration Title</th>
                <th className="py-3 px-4">Target Field</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Scoring Weight</th>
                <th className="py-3 px-4">Confidence Min</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Configure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading statutory rules engine configuration...
                  </td>
                </tr>
              ) : (
                rules.map((r) => (
                  <tr key={r.rule_code} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gov-navy">
                      {r.rule_code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{r.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-sm font-normal">
                        {r.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {r.field}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : r.severity === 'major'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {r.weight} pts
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {Math.round((r.confidence_threshold || 0.65) * 100)}%
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(r)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                          r.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {r.active ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setEditingRule({ ...r })}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors inline-block"
                        title="Edit Config"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-300 w-full max-w-md p-5 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">
                Configure Rule: {editingRule.rule_code}
              </h3>
              <button onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Rule Name / Title:</label>
              <input
                type="text"
                value={editingRule.name}
                onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Severity Tier:</label>
                <select
                  value={editingRule.severity}
                  onChange={(e) => setEditingRule({ ...editingRule, severity: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-1 focus:ring-gov-blue outline-none"
                >
                  <option value="critical">Critical</option>
                  <option value="major">Major</option>
                  <option value="moderate">Moderate</option>
                  <option value="minor">Minor</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Index Weight (Points):</label>
                <input
                  type="number"
                  value={editingRule.weight}
                  onChange={(e) => setEditingRule({ ...editingRule, weight: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-1 focus:ring-gov-blue outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">
                Confidence Threshold (0.0 - 1.0):
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={editingRule.confidence_threshold}
                onChange={(e) => setEditingRule({ ...editingRule, confidence_threshold: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-1 focus:ring-gov-blue outline-none"
              />
              <span className="text-[10px] text-slate-400">Values extracted with confidence below this threshold require manual verification.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingRule(null)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-gov-blue hover:bg-blue-900 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

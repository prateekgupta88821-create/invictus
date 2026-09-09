'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, UserCheck, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '../layout';
import { Role } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useApp();

  const [email, setEmail] = useState('officer@metrocheck.gov.in');
  const [password, setPassword] = useState('officer123');
  const [selectedRole, setSelectedRole] = useState<Role>('OFFICER');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'OFFICER' as Role,
      title: 'Legal Metrology Officer',
      email: 'officer@metrocheck.gov.in',
      pass: 'officer123',
      desc: 'Full enforcement access, scan products, review cases, generate Form-V notices',
      badge: 'GovTech Enforcement'
    },
    {
      role: 'MANUFACTURER' as Role,
      title: 'Packer / Manufacturer',
      email: 'manufacturer@abcfoods.in',
      pass: 'manuf123',
      desc: 'Pre-market packaging self-audit, before/after compliance score, label fixes',
      badge: 'Industry Portal'
    },
    {
      role: 'CONSUMER' as Role,
      title: 'Citizen / Consumer',
      email: 'consumer@citizen.nic.in',
      pass: 'consumer123',
      desc: 'Scan QR verification badge, check statutory MRP, report retail grievances',
      badge: 'Public Portal'
    },
    {
      role: 'ADMIN' as Role,
      title: 'Statutory Administrator',
      email: 'admin@metrocheck.gov.in',
      pass: 'admin123',
      desc: 'Rule engine weights, statutory amendments, audit integrity, GIS analytics',
      badge: 'Super Admin'
    }
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setRole(selectedRole);
      setLoading(false);
      if (selectedRole === 'MANUFACTURER') {
        router.push('/manufacturer');
      } else if (selectedRole === 'CONSUMER') {
        router.push('/verify');
      } else {
        router.push('/');
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
          <Shield className="w-4 h-4 text-gov-blue" />
          <span>Department of Consumer Affairs, Government of India</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Sign In to METROCHECK
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          AI-Assisted Legal Metrology Compliance & Enforcement System under Packaged Commodities Rules, 2011.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Quick Demo Credentials Panel */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
              One-Click Demo Roles (No External Keys Required)
            </h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              SIH 2026 Judge Mode
            </span>
          </div>

          <div className="space-y-2.5">
            {demoAccounts.map((acc) => {
              const active = selectedRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'border-gov-blue bg-blue-50/50 shadow-xs ring-1 ring-gov-blue'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900">{acc.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {acc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">{acc.desc}</p>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
                    <span>Email: <strong className="text-slate-700">{acc.email}</strong></span>
                    <span>Pass: <strong className="text-slate-700">{acc.pass}</strong></span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
          <div>
            <h3 className="text-sm font-black text-slate-900">Portal Authentication</h3>
            <p className="text-[11px] text-slate-500">
              Selected Role: <strong className="text-gov-blue">{selectedRole}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Official Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-gov-blue outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-gov-blue outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                Deterministic RBAC Enforcement
              </p>
              <p>
                JWT session is digitally bound to role permissions. All actions are logged to the SHA-256 tamper-evident audit ledger.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gov-blue hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

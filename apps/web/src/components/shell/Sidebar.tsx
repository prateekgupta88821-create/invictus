'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanLine,
  FileCheck2,
  Building2,
  AlertTriangle,
  MapPin,
  FileText,
  Factory,
  QrCode,
  Sliders,
  BarChart3,
  ShieldCheck,
  ShoppingCart,
  Compass
} from 'lucide-react';
import { translations, Language } from '@/lib/i18n';

interface SidebarProps {
  currentRole: string;
  lang?: Language;
}

export function Sidebar({ currentRole, lang = 'en' }: SidebarProps) {
  const pathname = usePathname();
  const t = translations[lang];

  const officerNav = [
    { href: '/', label: t.dashboard, icon: LayoutDashboard },
    { href: '/scanner', label: t.scanProduct, icon: ScanLine, highlight: true },
    { href: '/inspections', label: t.inspections, icon: FileCheck2 },
    { href: '/businesses', label: t.businesses, icon: Building2 },
    { href: '/violations', label: t.violations, icon: AlertTriangle },
    { href: '/map', label: t.riskMap, icon: MapPin },
    { href: '/rules', label: t.rules, icon: Sliders },
    { href: '/analytics', label: t.analytics, icon: BarChart3 },
    { href: '/ecommerce', label: t.ecommerce, icon: ShoppingCart },
    { href: '/audit', label: t.auditTrail, icon: ShieldCheck },
    { href: '/roadmap', label: 'Future Roadmap', icon: Compass },
  ];

  const manufacturerNav = [
    { href: '/manufacturer', label: 'Self-Check Portal', icon: Factory, highlight: true },
    { href: '/scanner', label: 'Scan Packaging', icon: ScanLine },
    { href: '/inspections', label: 'Compliance History', icon: FileCheck2 },
    { href: '/roadmap', label: 'Future Roadmap', icon: Compass },
  ];

  const consumerNav = [
    { href: '/verify', label: 'Verify QR Badge', icon: QrCode, highlight: true },
    { href: '/scanner', label: 'Citizen Scanner', icon: ScanLine },
    { href: '/grievances', label: 'File Grievance', icon: AlertTriangle },
    { href: '/roadmap', label: 'Future Roadmap', icon: Compass },
  ];

  const navItems =
    currentRole === 'MANUFACTURER'
      ? manufacturerNav
      : currentRole === 'CONSUMER'
      ? consumerNav
      : officerNav;

  return (
    <aside className="w-64 bg-gov-navy text-slate-100 flex flex-col border-r border-slate-800 shadow-xl min-h-screen">
      {/* Brand & Emblem Header */}
      <div className="p-5 border-b border-slate-800 bg-[#0a1f33] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shadow-md">
          <ScaleEmblem />
        </div>
        <div>
          <div className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
            METROCHECK
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-600/30 border border-amber-500/40 text-amber-300 rounded font-mono">
              SIH26
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium tracking-tight">
            Legal Metrology Rules, 2011
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          {currentRole} WORKSPACE
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gov-blue text-white shadow-sm'
                  : item.highlight
                  ? 'bg-amber-600/20 text-amber-200 hover:bg-amber-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
              {item.highlight && (
                <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Statute Tag */}
      <div className="p-4 border-t border-slate-800 bg-[#091829] text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
          <span>Rule Engine</span>
          <span className="text-emerald-400">LMPC-v1.0</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Advisory AI Extraction with Deterministic Statutory Engine.
        </p>
      </div>
    </aside>
  );
}

function ScaleEmblem() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l9-4 9 4M12 2v20m-9-6l4-8 4 8m5-8l4 8 4-8" />
    </svg>
  );
}

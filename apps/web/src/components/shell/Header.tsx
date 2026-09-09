'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  UserCheck,
  Languages,
  Sparkles,
  WifiOff,
  Wifi,
  ChevronDown,
  Building,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { Language } from '@/lib/i18n';
import { getPendingScans } from '@/lib/offline';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: 'OFFICER' | 'MANUFACTURER' | 'CONSUMER' | 'ADMIN') => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  onOpenJudgeDemo: () => void;
}

export function Header({
  currentRole,
  onRoleChange,
  lang,
  onLangChange,
  onOpenJudgeDemo,
}: HeaderProps) {
  const [offlineCount, setOfflineCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check offline items
    getPendingScans().then((items) => setOfflineCount(items.length));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const roles: Array<{ id: 'OFFICER' | 'MANUFACTURER' | 'CONSUMER' | 'ADMIN'; label: string; icon: any }> = [
    { id: 'OFFICER', label: 'Legal Metrology Officer', icon: Shield },
    { id: 'MANUFACTURER', label: 'Manufacturer / Packer', icon: Building },
    { id: 'CONSUMER', label: 'Citizen / Consumer', icon: UserIcon },
    { id: 'ADMIN', label: 'Statutory Administrator', icon: Briefcase },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-30 sticky top-0">
      {/* Left: Department Identifier */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <span>GOVERNMENT OF INDIA</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-gov-blue">LEGAL METROLOGY DIVISION</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Enforcement System for Packaged Commodities Rules, 2011 (Rule 6)
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Judge Demo Quick Action */}
        <button
          onClick={onOpenJudgeDemo}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
          <span>Judge Demo Mode (3 min)</span>
        </button>

        {/* Offline Badge */}
        {offlineCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs font-medium">
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span>{offlineCount} Pending Sync</span>
          </div>
        )}

        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => onLangChange('en')}
            className={`px-2 py-1 rounded transition-colors ${lang === 'en' ? 'bg-white text-gov-navy shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            English
          </button>
          <button
            onClick={() => onLangChange('hi')}
            className={`px-2 py-1 rounded transition-colors ${lang === 'hi' ? 'bg-white text-gov-navy shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            हिन्दी
          </button>
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-gov-blue" />
            <span>Role: {currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Switch Portal Role
              </div>
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      onRoleChange(r.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                      currentRole === r.id
                        ? 'bg-slate-50 text-gov-blue font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

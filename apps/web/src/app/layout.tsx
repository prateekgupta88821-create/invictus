'use client';

import React, { useState, createContext, useContext } from 'react';
import './globals.css';
import { Sidebar } from '@/components/shell/Sidebar';
import { Header } from '@/components/shell/Header';
import { JudgeDemoModal } from '@/components/demo/JudgeDemoModal';
import { Language } from '@/lib/i18n';
import { Role } from '@/types';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  openDemo: () => void;
}

const AppContext = createContext<AppContextType>({
  role: 'OFFICER',
  setRole: () => {},
  lang: 'en',
  setLang: () => {},
  openDemo: () => {},
});

export const useApp = () => useContext(AppContext);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<Role>('OFFICER');
  const [lang, setLang] = useState<Language>('en');
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <html lang={lang}>
      <head>
        <title>MetroCheck - AI-Powered Legal Metrology Compliance System</title>
        <meta
          name="description"
          content="Compliance verification system for Packaged Commodities under Legal Metrology Rules, 2011 for Smart India Hackathon 2026."
        />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="flex h-screen overflow-hidden bg-[#f4f7fb] text-slate-800 antialiased">
        <AppContext.Provider
          value={{
            role,
            setRole,
            lang,
            setLang,
            openDemo: () => setDemoOpen(true),
          }}
        >
          {/* Main Navigation Sidebar */}
          <Sidebar currentRole={role} lang={lang} />

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Bar */}
            <Header
              currentRole={role}
              onRoleChange={setRole}
              lang={lang}
              onLangChange={setLang}
              onOpenJudgeDemo={() => setDemoOpen(true)}
            />

            {/* Scrollable Page Body */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>

          {/* Guided 3-Minute Judge Tour */}
          <JudgeDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
        </AppContext.Provider>
      </body>
    </html>
  );
}

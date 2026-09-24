import React, { useState } from 'react';
import { 
  Scan, 
  Bell, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Wrench, 
  ShieldAlert, 
  Info, 
  ChevronDown, 
  Scale, 
  Sparkles,
  Menu
} from 'lucide-react';
import { InstrumentRole } from '../types/metrochain';

interface NavbarProps {
  currentRole: InstrumentRole;
  onSelectRole: (role: InstrumentRole) => void;
  onOpenScanner: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onOpenAbout: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  onOpenScanner,
  onOpenNotifications,
  unreadCount,
  onOpenAbout,
  onToggleMobileMenu,
}) => {
  const roles: { id: InstrumentRole; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    {
      id: 'citizen',
      label: 'Citizen (Public)',
      shortLabel: 'Citizen',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />,
    },
    {
      id: 'business',
      label: 'Business Owner',
      shortLabel: 'Business',
      icon: <Building2 className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      id: 'lmo',
      label: 'LMO Officer',
      shortLabel: 'LMO',
      icon: <UserCheck className="w-3.5 h-3.5 text-blue-400" />,
    },
    {
      id: 'gatc',
      label: 'GATC Lab',
      shortLabel: 'GATC',
      icon: <Wrench className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: 'admin',
      label: 'State Oversight',
      shortLabel: 'Admin',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />,
    },
  ];

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      {/* Top micro-bar for official national notice */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">भारत सरकार · Government of India</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय · Legal Metrology</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAbout}
            className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3 h-3" />
            <span className="underline decoration-dotted">Concept & eMaap Integration</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Branding & Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-9 h-9 rounded-lg bg-blue-900/60 border border-blue-600/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">
                Metro<span className="text-amber-400">Chain</span>
              </span>
              <span className="text-[10px] bg-blue-950 border border-blue-700/50 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                RBAC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">
              Legal Metrology Digital Lifecycle
            </p>
          </div>
        </div>

        {/* Center: Role Switcher (Visible on medium+ screens) */}
        <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
          {roles.map((r) => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRole(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Role Dropdown */}
          <div className="md:hidden">
            <select
              value={currentRole}
              onChange={(e) => onSelectRole(e.target.value as InstrumentRole)}
              aria-label="Select role"
              className="bg-slate-900 text-white text-xs border border-slate-700 rounded-md px-2 py-1.5 focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  Role: {r.shortLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Simulate QR Scan Button */}
          <button
            type="button"
            onClick={onOpenScanner}
            title="Open simulated QR code scanner to test RBAC"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Scan className="w-4 h-4" />
            <span className="hidden sm:inline">Simulate QR Scan</span>
          </button>

          {/* Notifications bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            title="View statutory alerts"
            className="relative p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Camera, Scale } from 'lucide-react';
import { CurrentUser } from '../types/scaly';

interface TopTaskbarProps {
  currentUser: CurrentUser;
  onOpenProfileDrawer: () => void;
  onOpenScanner: () => void;
}

export const TopTaskbar: React.FC<TopTaskbarProps> = ({
  currentUser,
  onOpenProfileDrawer,
  onOpenScanner,
}) => {
  // Get initials for circular emblem
  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || 'SC').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Top-Left Circular Emblem */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenProfileDrawer}
            title={`Active User: ${currentUser.name} (${currentUser.role.toUpperCase()}) - Click to view profile / sign out`}
            className="w-10 h-10 rounded-full border border-slate-200 shadow-sm flex items-center justify-center bg-slate-900 text-white font-semibold text-xs hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer group shrink-0"
          >
            <span className="group-hover:scale-105 transition-transform font-mono">
              {getInitials(currentUser.name)}
            </span>
          </button>

          <div className="hidden sm:block leading-tight">
            <span className="text-xs font-bold text-slate-900 block truncate max-w-[160px]">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block truncate max-w-[160px]">
              {currentUser.idOrBadge}
            </span>
          </div>
        </div>

        {/* Center: Minimalist brand label Scaly with active sub-division indicator pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-blue-900 flex items-center justify-center text-amber-400">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span className="text-lg font-medium tracking-tight text-slate-950 font-brand">
              Scaly
            </span>
          </div>

          <span className="text-slate-300">/</span>

          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-700 max-w-[200px] sm:max-w-xs truncate shadow-2xs font-heading">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0 animate-pulse" />
            <span className="truncate">{currentUser.division}</span>
          </div>
        </div>

        {/* Top-Right Single Action: One high-contrast button [📷 Scan Machine QR] */}
        <div>
          <button
            type="button"
            onClick={onOpenScanner}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98 font-heading tracking-[0.02em]"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Scan Machine QR</span>
            <span className="xs:hidden">Scan QR</span>
          </button>
        </div>
      </div>
    </header>
  );
};

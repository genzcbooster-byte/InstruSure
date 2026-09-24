import React from 'react';
import { 
  X, 
  LogOut, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  FlaskConical, 
  ShieldAlert, 
  Scale, 
  MapPin, 
  BadgeCheck, 
  FileText,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { CurrentUser } from '../types/scaly';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onSignOut: () => void;
  onOpenScanner: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignOut,
  onOpenScanner,
}) => {
  if (!isOpen) return null;

  const roleMeta: Record<string, { label: string; icon: React.ReactNode; color: string; badgeBg: string }> = {
    citizen: {
      label: 'Citizen / Public Consumer',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300',
    },
    business: {
      label: 'Business / Machine Owner',
      icon: <Building2 className="w-5 h-5 text-blue-400" />,
      color: 'text-blue-400',
      badgeBg: 'bg-blue-950/80 border-blue-700/60 text-blue-300',
    },
    lmo: {
      label: 'Legal Metrology Officer',
      icon: <UserCheck className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-950/80 border-amber-700/60 text-amber-300',
    },
    gatc: {
      label: 'GATC Calibration Lab',
      icon: <FlaskConical className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400',
      badgeBg: 'bg-purple-950/80 border-purple-700/60 text-purple-300',
    },
    admin: {
      label: 'State Oversight Admin',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'text-rose-400',
      badgeBg: 'bg-rose-950/80 border-rose-700/60 text-rose-300',
    },
  };

  const meta = roleMeta[currentUser.role] || roleMeta.citizen;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-slate-900 border-r border-slate-800 text-slate-100 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight font-heading">
                  <span className="font-brand font-medium mr-1 text-base">Scaly</span> Identity Passport
                </h2>
                <p className="text-[10px] text-slate-400 font-normal">
                  Role-Based Authentication Session
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile details */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Persona Hero Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  {meta.icon}
                </div>
                <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${meta.badgeBg}`}>
                  {meta.label}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID / Badge: {currentUser.idOrBadge}
                </p>
              </div>

              {currentUser.organization && (
                <div className="text-xs text-slate-300 font-medium pt-2 border-t border-slate-900">
                  {currentUser.organization}
                </div>
              )}
            </div>

            {/* Division & Jurisdiction */}
            <div className="space-y-3">
              <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                Metrological Jurisdiction
              </h4>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-semibold text-white">{currentUser.division}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-400">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{currentUser.jurisdictionStatus}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-mono">{currentUser.phone}</span>
                  </div>
                )}
                {currentUser.email && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-mono">{currentUser.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Core Capabilities under RBAC */}
            <div className="space-y-2">
              <h4 className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                Authorized Capabilities
              </h4>
              <ul className="text-xs space-y-1.5 text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {currentUser.role === 'citizen' && (
                  <>
                    <li className="flex items-center gap-2 text-emerald-400">
                      ✓ Instant public verification of stamped scales
                    </li>
                    <li className="flex items-center gap-2 text-emerald-400">
                      ✓ Lodge direct inaccuracy/tampered seal grievance
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      ✗ Internal telemetry and business finances strictly hidden
                    </li>
                  </>
                )}
                {currentUser.role === 'business' && (
                  <>
                    <li className="flex items-center gap-2 text-blue-400">
                      ✓ Monitor fleet verification expiry and lead seals
                    </li>
                    <li className="flex items-center gap-2 text-blue-400">
                      ✓ 1-click apply for statutory re-verification
                    </li>
                    <li className="flex items-center gap-2 text-blue-400">
                      ✓ Download digital Form VI Verification Certificates
                    </li>
                  </>
                )}
                {currentUser.role === 'lmo' && (
                  <>
                    <li className="flex items-center gap-2 text-amber-400">
                      ✓ Field tolerance test with real-time MPE calculator
                    </li>
                    <li className="flex items-center gap-2 text-amber-400">
                      ✓ Digital stamping and physical lead wire seal logging
                    </li>
                    <li className="flex items-center gap-2 text-amber-400">
                      ✓ Issue statutory rejection notices under LM Act 2009
                    </li>
                  </>
                )}
                {currentUser.role === 'gatc' && (
                  <>
                    <li className="flex items-center gap-2 text-purple-400">
                      ✓ Precision pattern testing and technical DNA logging
                    </li>
                    <li className="flex items-center gap-2 text-purple-400">
                      ✓ Eccentricity, zero-load balance & repeatability scores
                    </li>
                    <li className="flex items-center gap-2 text-purple-400">
                      ✓ Issue NABL endorsed lab verification certificates
                    </li>
                  </>
                )}
                {currentUser.role === 'admin' && (
                  <>
                    <li className="flex items-center gap-2 text-rose-400">
                      ✓ State compliance analytics across all districts
                    </li>
                    <li className="flex items-center gap-2 text-rose-400">
                      ✓ Consumer grievance dispatch & compounding enforcement
                    </li>
                    <li className="flex items-center gap-2 text-rose-400">
                      ✓ Direct synchronous raw CSV database inspection
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Sign Out / Switch Profile Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-950/60 space-y-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full py-2.5 px-4 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-200 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch Stakeholder Profile / Sign Out</span>
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Clears active credentials and returns cleanly to Onboarding Gate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

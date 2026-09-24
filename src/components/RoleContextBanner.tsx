import React from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Wrench, 
  ShieldAlert, 
  ArrowRight,
  Info,
  Lock,
  EyeOff
} from 'lucide-react';
import { InstrumentRole } from '../types/metrochain';

interface RoleContextBannerProps {
  role: InstrumentRole;
  onOpenScanner: () => void;
  onSwitchRole: (role: InstrumentRole) => void;
}

export const RoleContextBanner: React.FC<RoleContextBannerProps> = ({
  role,
  onOpenScanner,
  onSwitchRole,
}) => {
  const roleConfigs: Record<
    InstrumentRole,
    {
      title: string;
      badge: string;
      description: string;
      permissions: string[];
      privacyNote?: string;
      colorClass: string;
    }
  > = {
    citizen: {
      title: 'Public Citizen / Consumer Mode',
      badge: 'Public · No Login Required',
      description:
        'Scanning an instrument QR displays government verification validity without exposing merchant business metrics.',
      permissions: [
        'Inspect certificate validity (Valid/Expiring/Expired)',
        'Check last verification date & lead stamp existence',
        'Submit official consumer complaints with geo-tagging',
      ],
      privacyNote: 'Commercial entity data and proprietor details are strictly redacted.',
      colorClass: 'bg-sky-50 border-sky-200 text-sky-950',
    },
    business: {
      title: 'Instrument Owner / Merchant Portal',
      badge: 'Authenticated Commercial Trader',
      description:
        'Manage your commercial weighing and measuring fleet across industrial sites, fuel stations, and grocery counters.',
      permissions: [
        'Monitor fleet compliance status and penalty risks',
        'Apply online for statutory periodic re-verification & pay fees',
        'Generate and print official QR verification stickers',
      ],
      colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    },
    lmo: {
      title: 'Legal Metrology Officer (Field Inspector Desk)',
      badge: 'Enforcement Authority · Badge #DL-LMO-104',
      description:
        'Field tool for on-site testing against standard weights, checking Maximum Permissible Error (MPE), and lead seal stamping.',
      permissions: [
        'Scan QR in field to instantly pull compliance history',
        'Log inspection findings: tolerance error %, seal crimp check',
        'Issue statutory verification certificates or defect notices',
      ],
      colorClass: 'bg-blue-50 border-blue-200 text-blue-950',
    },
    gatc: {
      title: 'Govt. Approved Test Centre (GATC / NABL Lab)',
      badge: 'Accredited Testing & Calibration Center',
      description:
        'High-precision calibration laboratory for standard weights, analytical balances, moisture analyzers, and flow meters.',
      permissions: [
        'Intake testing queue for Class I/II precision instruments',
        'Submit laboratory calibration error curves & uncertainty',
        'Issue NABL-traceable calibration verification certificates',
      ],
      colorClass: 'bg-amber-50 border-amber-200 text-amber-950',
    },
    admin: {
      title: 'State Oversight & Controller of Legal Metrology',
      badge: 'Apex Regulatory Directorate',
      description:
        'State-wide jurisdiction dashboard bridging central eMaap, state metrology portals, and testing centers.',
      permissions: [
        'View complete state compliance analytics & expiry backlogs',
        'Monitor LMO field workload and complaint redressal SLAs',
        'Mint new digital twin instrument identities on the ledger',
      ],
      colorClass: 'bg-purple-50 border-purple-200 text-purple-950',
    },
  };

  const config = roleConfigs[role];

  return (
    <div className={`p-4 rounded-xl border text-xs shadow-xs ${config.colorClass}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-slate-900">{config.title}</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white/80 border border-current/20">
              {config.badge}
            </span>
          </div>

          <p className="text-slate-600 max-w-2xl leading-relaxed">
            {config.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-700 font-medium">
            {config.permissions.map((p, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="text-emerald-700">✓</span>
                <span>{p}</span>
              </span>
            ))}
          </div>

          {config.privacyNote && (
            <div className="flex items-center gap-1.5 text-[11px] text-sky-800 pt-1 font-semibold">
              <EyeOff className="w-3.5 h-3.5" />
              <span>{config.privacyNote}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenScanner}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <span>Scan Any QR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

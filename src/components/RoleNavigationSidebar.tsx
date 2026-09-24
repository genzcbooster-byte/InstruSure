import React from 'react';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  FlaskConical, 
  ShieldAlert, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  PlusCircle, 
  BarChart3, 
  Scale, 
  Printer, 
  Clock, 
  Info, 
  ChevronRight, 
  X,
  Layers,
  Wrench,
  HelpCircle,
  FileCheck2,
  Users
} from 'lucide-react';
import { InstrumentRole } from '../types/metrochain';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

interface RoleNavigationSidebarProps {
  currentRole: InstrumentRole;
  activeSection: string;
  onSelectSection: (section: string) => void;
  onSwitchRole: (role: InstrumentRole) => void;
  onOpenScanner: () => void;
  onOpenAbout: () => void;
  complaintsCount: number;
  pendingApplicationsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const RoleNavigationSidebar: React.FC<RoleNavigationSidebarProps> = ({
  currentRole,
  activeSection,
  onSelectSection,
  onSwitchRole,
  onOpenScanner,
  onOpenAbout,
  complaintsCount,
  pendingApplicationsCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  // Navigation items specific to each role
  const roleNavItems: Record<InstrumentRole, NavItem[]> = {
    citizen: [
      {
        id: 'verify',
        label: 'Verify Instrument',
        icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
      },
      {
        id: 'complaint',
        label: 'Submit Complaint',
        icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
      },
      {
        id: 'rights',
        label: 'Consumer Rights & Standards',
        icon: <Info className="w-4 h-4 text-amber-400" />,
      },
    ],
    business: [
      {
        id: 'overview',
        label: 'Fleet Compliance',
        icon: <BarChart3 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'instruments',
        label: 'Owned Equipment',
        icon: <Scale className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'applications',
        label: 'Re-Verification Applications',
        icon: <FileText className="w-4 h-4 text-blue-400" />,
        badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : undefined,
        badgeColor: 'bg-blue-600 text-white',
      },
      {
        id: 'stickers',
        label: 'Print QR Labels',
        icon: <Printer className="w-4 h-4 text-purple-400" />,
      },
    ],
    lmo: [
      {
        id: 'assigned',
        label: 'Assigned Inspection Beat',
        icon: <UserCheck className="w-4 h-4 text-blue-400" />,
      },
      {
        id: 'complaints',
        label: 'Grievance Inspections',
        icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
        badge: complaintsCount > 0 ? complaintsCount : undefined,
        badgeColor: 'bg-red-600 text-white',
      },
      {
        id: 'findings',
        label: 'Log Field Finding',
        icon: <FileCheck2 className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'all',
        label: 'Registry Search',
        icon: <Layers className="w-4 h-4 text-slate-400" />,
      },
    ],
    gatc: [
      {
        id: 'queue',
        label: 'Lab Testing Worklist',
        icon: <FlaskConical className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'calibration',
        label: 'Submit Calibration Record',
        icon: <Wrench className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'certificates',
        label: 'NABL Standards & Traceability',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      },
    ],
    admin: [
      {
        id: 'overview',
        label: 'Compliance Analytics',
        icon: <BarChart3 className="w-4 h-4 text-purple-400" />,
      },
      {
        id: 'complaints',
        label: 'Consumer Grievance Center',
        icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
        badge: complaintsCount > 0 ? complaintsCount : undefined,
        badgeColor: 'bg-red-600 text-white',
      },
      {
        id: 'workload',
        label: 'Officer Workload & Beats',
        icon: <Users className="w-4 h-4 text-blue-400" />,
      },
      {
        id: 'registry',
        label: 'State Instrument Registry',
        icon: <Scale className="w-4 h-4 text-slate-400" />,
      },
      {
        id: 'register',
        label: 'Mint Digital Twin',
        icon: <PlusCircle className="w-4 h-4 text-emerald-400" />,
      },
    ],
  };

  const roleMeta: Record<
    InstrumentRole,
    { title: string; subtitle: string; badge: string; color: string; icon: React.ReactNode }
  > = {
    citizen: {
      title: 'Public Consumer',
      subtitle: 'Public Verification Portal',
      badge: 'Unrestricted Public Access',
      color: 'border-sky-500/40 text-sky-400',
      icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
    },
    business: {
      title: 'Apex Freight Logistics',
      subtitle: 'Enterprise Instrument Owner',
      badge: 'Trader ID: BIZ-049',
      color: 'border-emerald-500/40 text-emerald-400',
      icon: <Building2 className="w-5 h-5 text-emerald-400" />,
    },
    lmo: {
      title: 'Insp. R. K. Sharma',
      subtitle: 'Legal Metrology Officer',
      badge: 'Badge #DL-LMO-104',
      color: 'border-blue-500/40 text-blue-400',
      icon: <UserCheck className="w-5 h-5 text-blue-400" />,
    },
    gatc: {
      title: 'National Testing Lab',
      subtitle: 'Govt. Approved Test Centre',
      badge: 'NABL Accr: CC-2849',
      color: 'border-amber-500/40 text-amber-400',
      icon: <FlaskConical className="w-5 h-5 text-amber-400" />,
    },
    admin: {
      title: 'State Directorate',
      subtitle: 'Controller of Legal Metrology',
      badge: 'Supervisory Oversight',
      color: 'border-purple-500/40 text-purple-400',
      icon: <ShieldAlert className="w-5 h-5 text-purple-400" />,
    },
  };

  const allRoles: { id: InstrumentRole; name: string }[] = [
    { id: 'citizen', name: 'Citizen (Public)' },
    { id: 'business', name: 'Business Owner' },
    { id: 'lmo', name: 'LMO Field Officer' },
    { id: 'gatc', name: 'GATC Testing Lab' },
    { id: 'admin', name: 'Admin / Oversight' },
  ];

  const meta = roleMeta[currentRole];
  const items = roleNavItems[currentRole] || [];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 text-slate-200 border-r border-slate-800/90 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Logo & App Branding */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-600/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight text-white">
                  Metro<span className="text-amber-400">Chain</span>
                </span>
                <span className="text-[9px] bg-blue-950 border border-blue-700/50 text-blue-300 px-1 py-0.2 rounded font-mono">
                  RBAC
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Legal Metrology Portal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Role Persona Card */}
        <div className="p-3.5 mx-3 mt-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
              {meta.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-bold text-white truncate">{meta.title}</h2>
              <p className="text-[10px] text-slate-400 truncate">{meta.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
            <span className="text-slate-400 font-mono">{meta.badge}</span>
            <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded">
              Active
            </span>
          </div>
        </div>

        {/* Quick QR Scan Action Button */}
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => {
              onOpenScanner();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Simulate QR Scan</span>
          </button>
        </div>

        {/* Dynamic Navigation Links Pertinent ONLY to Current Role */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2 pb-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {currentRole.toUpperCase()} Navigation
          </div>

          {items.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectSection(item.id);
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-900/60 text-white border border-blue-500/40 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.badgeColor || 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Persona / Role Switcher (For Demo & Evaluation) */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/40 space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Switch Persona / Role:
          </label>
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => onSwitchRole(e.target.value as InstrumentRole)}
              className="w-full bg-slate-950 text-white text-xs border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {allRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenAbout}
            className="w-full text-left text-[11px] text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 pt-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>How MetroChain Works</span>
          </button>
        </div>
      </aside>
    </>
  );
};

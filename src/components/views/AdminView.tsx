import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  SlidersHorizontal, 
  X, 
  FileSpreadsheet, 
  Scale, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Calendar,
  Building2,
  Cpu,
  FileText,
  Download
} from 'lucide-react';
import { 
  ScalyInstrument, 
  CurrentUser, 
  CitizenGrievance, 
  OfficerProfile,
  DigitalCertificate
} from '../../types/scaly';
import { serializeCSV, CREDENTIALED_USERS_CSV_RAW } from '../../data/csvDatabase';
import { DigitalCertificateModal } from '../DigitalCertificateModal';

interface AdminViewProps {
  currentUser: CurrentUser;
  instruments: ScalyInstrument[];
  grievances: CitizenGrievance[];
  officers: OfficerProfile[];
  onSelectInstrument: (id: string) => void;
  onOpenScanner: () => void;
  onResolveGrievance: (grievanceId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  instruments,
  grievances,
  officers,
  onSelectInstrument,
  onOpenScanner,
  onResolveGrievance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeDrawerInst, setActiveDrawerInst] = useState<ScalyInstrument | null>(null);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvTab, setCsvTab] = useState<'instruments' | 'users'>('instruments');
  const [adminCertModalOpen, setAdminCertModalOpen] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<DigitalCertificate | null>(null);

  // 1. KPI: State Compliance Rate (%)
  const compliantCount = instruments.filter(
    i => i.status === 'VALID' || i.status === 'GATC_APPROVED'
  ).length;
  const complianceRate = Math.round((compliantCount / (instruments.length || 1)) * 100);

  // 2. KPI: Expiring in 30 Days
  const now = new Date('2026-09-23T11:25:37');
  const expiringCount = instruments.filter(i => {
    if (!i.nextDueDate) return false;
    const due = new Date(i.nextDueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  // 3. KPI: Open Citizen Grievances
  const openGrievances = grievances.filter(
    g => g.status === 'PENDING_REVIEW' || g.status === 'INVESTIGATION_DISPATCHED'
  );

  // Search and filter instruments
  const filteredInstruments = instruments.filter(i => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      i.id.toLowerCase().includes(q) ||
      i.ownerName.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q) ||
      i.lmoOfficerBadge.toLowerCase().includes(q) ||
      i.leadSealNumber.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Current serialized CSV representation of state
  const rawCsvText = serializeCSV(
    [
      'id',
      'type',
      'makeModel',
      'ownerId',
      'ownerName',
      'status',
      'lastVerifiedDate',
      'nextDueDate',
      'lmoOfficerBadge',
      'leadSealNumber',
      'mpeToleranceGrams',
      'patternApprovalRef'
    ],
    instruments
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Admin Command Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white">
                Apex State Enforcement Command
              </h1>
              <span className="text-[10px] font-mono bg-rose-950 border border-rose-500/50 text-rose-300 font-bold px-2 py-0.5 rounded-full">
                {currentUser.idOrBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Department of Consumer Affairs • Legal Metrology Directorate Statewide Oversight
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Live CSV Database</span>
          </button>
        </div>
      </div>

      {/* CLEAN 3-CARD KPI SUMMARY (User Requirement 5.E) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: State Compliance Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              State Compliance Rate
            </span>
            <div className="text-2xl font-black text-slate-900">
              {complianceRate}%
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {compliantCount} of {instruments.length} machines certified
            </span>
          </div>
        </div>

        {/* Card 2: Expiring in 30 Days */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Expiring in 30 Days
            </span>
            <div className="text-2xl font-black text-slate-900">
              {expiringCount} Units
            </div>
            <span className="text-[11px] text-amber-700 font-medium">
              Scheduled for LMO re-stamping beats
            </span>
          </div>
        </div>

        {/* Card 3: Open Citizen Grievances */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Open Citizen Grievances
            </span>
            <div className="text-2xl font-black text-slate-900">
              {openGrievances.length} Active
            </div>
            <span className="text-[11px] text-rose-600 font-medium">
              Requiring field enforcement dispatch
            </span>
          </div>
        </div>
      </div>

      {/* SEARCHABLE INSTRUMENT DIRECTORY WITH ONE-CLICK DETAIL DRAWERS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Directory Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Machine ID, Owner, Type, or Officer Badge..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'VALID', 'EXPIRING_SOON', 'SEAL_BROKEN', 'PENDING_GATC'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Instruments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Chassis QR ID</th>
                <th className="py-3.5 px-4">Instrument Category & Model</th>
                <th className="py-3.5 px-4">Operating Enterprise</th>
                <th className="py-3.5 px-4">Lead Seal ID</th>
                <th className="py-3.5 px-4">LMO Officer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstruments.map((inst) => {
                const off = officers.find(o => o.badge === inst.lmoOfficerBadge);
                return (
                  <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {inst.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{inst.type}</div>
                      <div className="text-[11px] text-slate-500">{inst.makeModel}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{inst.ownerName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{inst.ownerId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {inst.leadSealNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{off ? off.name : inst.lmoOfficerBadge}</span>
                      <span className="block text-[10px] font-mono text-slate-400">{inst.lmoOfficerBadge}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        inst.status === 'VALID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inst.status === 'EXPIRING_SOON'
                          ? 'bg-amber-100 text-amber-800'
                          : inst.status === 'SEAL_BROKEN'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveDrawerInst(inst)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Detail Drawer</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CITIZEN GRIEVANCE ACTION LOG */}
      {grievances.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Statewide Citizen Consumer Grievance Center ({grievances.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Section 15 LM Act Signals</span>
          </div>

          <div className="space-y-3">
            {grievances.map((g) => (
              <div key={g.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-800">{g.id}</span>
                    <span className="text-xs font-semibold text-slate-900">Target: {g.instrumentId}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                      {g.issueType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{g.description}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Reported by: <strong>{g.citizenName}</strong></span>
                    <span>•</span>
                    <span>{g.timestamp}</span>
                    {g.photoAttached && <span className="text-emerald-600 font-semibold">• Photo Attached</span>}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onResolveGrievance(g.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Mark Investigated & Compounded
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONE-CLICK DETAIL DRAWER (Slide-Over) */}
      {activeDrawerInst && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setActiveDrawerInst(null)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white text-slate-900 shadow-2xl flex flex-col justify-between">
              {/* Drawer Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold font-mono">
                      {activeDrawerInst.id}
                    </h2>
                    <p className="text-[10px] text-slate-400">
                      Machine Lifecycle Digital Twin
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDrawerInst(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Status Hero */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Statutory Compliance
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {activeDrawerInst.status}
                    </span>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                    Lead Seal: {activeDrawerInst.leadSealNumber}
                  </span>
                </div>

                {/* Technical Specs */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Technical Specifications
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-bold">{activeDrawerInst.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Make & Model:</span>
                      <span className="font-bold">{activeDrawerInst.makeModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rated Capacity:</span>
                      <span>{activeDrawerInst.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Accuracy Class:</span>
                      <span>{activeDrawerInst.accuracyClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pattern Approval Ref:</span>
                      <span className="font-mono font-bold text-purple-700">{activeDrawerInst.patternApprovalRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Permissible Error MPE:</span>
                      <span className="font-mono font-bold">±{activeDrawerInst.mpeToleranceGrams} grams</span>
                    </div>
                  </div>
                </div>

                {/* Owner & Location */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Commercial Operating Entity
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Enterprise:</span>
                      <span className="font-bold">{activeDrawerInst.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Entity ID:</span>
                      <span className="font-mono">{activeDrawerInst.ownerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Installation Site:</span>
                      <span className="text-right truncate max-w-[200px]">{activeDrawerInst.location}</span>
                    </div>
                  </div>
                </div>

                {/* Stamping Validity */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                    Officer Stamping Audit
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Verified By Officer:</span>
                      <span className="font-bold">{activeDrawerInst.lmoOfficerBadge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Verified Date:</span>
                      <span>{activeDrawerInst.lastVerifiedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Statutory Expiry Due:</span>
                      <span className="font-bold text-slate-900">{activeDrawerInst.nextDueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Statutory Digital Certificate */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
                    Statutory Digital Certificate
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    {activeDrawerInst.certificate ? (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-500 text-[11px]">Certificate No:</span>
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {activeDrawerInst.certificate.certificateNumber}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-500 text-[11px]">Valid Until:</span>
                          <span className="font-mono text-emerald-800 font-bold text-xs">
                            {activeDrawerInst.certificate.nextDueDate}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setViewingCertificate(activeDrawerInst.certificate || null);
                            setAdminCertModalOpen(true);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm font-heading cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-300" />
                          <span>View Official Certificate & Export PDF</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="text-amber-800 font-semibold text-xs block font-heading">
                          Verification Pending
                        </span>
                        <span className="text-[10px] text-slate-500">
                          No digital certificate issued yet for this instrument.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveDrawerInst(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
                >
                  Close Detail Drawer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSV RAW DATABASE MODAL (User Requirement 6) */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Direct Synchronous CSV Database Ledger
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs text-slate-400">
                  All platform state is governed directly by raw CSV structures parsed synchronously in memory with zero external libraries.
                </p>

                {/* CSV Table Selector Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCsvTab('instruments')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      csvTab === 'instruments'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Instruments Master CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setCsvTab('users')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      csvTab === 'users'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Credentialed Users CSV (Non-Citizens)
                  </button>
                </div>
              </div>

              {csvTab === 'users' && (
                <div className="p-2.5 bg-blue-950/40 border border-blue-800/60 rounded-xl text-[11px] text-blue-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    <strong>Data Model Note:</strong> Citizens never authenticate and are not stored in any database table. Only department-provisioned Business, LMO, GATC, and Admin accounts are stored in this credentialed ledger.
                  </span>
                </div>
              )}

              <div className="relative">
                <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed select-all">
                  {csvTab === 'instruments' ? rawCsvText : CREDENTIALED_USERS_CSV_RAW.trim()}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close CSV Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Certificate Modal (Admin view allows viewing and export) */}
      {adminCertModalOpen && viewingCertificate && (
        <DigitalCertificateModal
          isOpen={adminCertModalOpen}
          onClose={() => {
            setAdminCertModalOpen(false);
            setViewingCertificate(null);
          }}
          certificate={viewingCertificate}
          instrument={activeDrawerInst || undefined}
          allowDownload={true}
        />
      )}
    </div>
  );
};

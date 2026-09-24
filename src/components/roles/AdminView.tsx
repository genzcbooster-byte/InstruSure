import React, { useState } from 'react';
import { 
  ShieldAlert, 
  BarChart3, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  Search, 
  ChevronRight,
  TrendingUp,
  Award,
  Scale,
  RefreshCw
} from 'lucide-react';
import { 
  Instrument, 
  CitizenComplaint, 
  ReVerificationApplication, 
  LifecycleEvent, 
  InstrumentCategory 
} from '../../types/metrochain';
import { StatusBadge } from '../StatusBadge';
import { InstrumentDetailView } from '../InstrumentDetailView';

interface AdminViewProps {
  instruments: Instrument[];
  complaints: CitizenComplaint[];
  applications: ReVerificationApplication[];
  selectedInstrumentId?: string;
  onSelectInstrument: (id: string) => void;
  onOpenScanner: () => void;
  onRegisterNewInstrument: (newInst: Instrument) => void;
  onUpdateComplaintStatus: (complaintId: string, newStatus: CitizenComplaint['status']) => void;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  instruments,
  complaints,
  applications,
  selectedInstrumentId,
  onSelectInstrument,
  onOpenScanner,
  onRegisterNewInstrument,
  onUpdateComplaintStatus,
  activeSection,
  onSelectSection,
}) => {
  const [internalTab, setInternalTab] = useState<'overview' | 'workload' | 'complaints' | 'registry'>('overview');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use activeSection if provided, mapped to tabs
  const activeTab = (activeSection as 'overview' | 'workload' | 'complaints' | 'registry') || internalTab;

  const handleTabChange = (tab: 'overview' | 'workload' | 'complaints' | 'registry') => {
    setInternalTab(tab);
    if (onSelectSection) onSelectSection(tab);
  };

  const activeInstrument = instruments.find((i) => i.id === selectedInstrumentId);

  // Analytics
  const total = instruments.length;
  const valid = instruments.filter((i) => i.status === 'valid').length;
  const expiring = instruments.filter((i) => i.status === 'expiring').length;
  const expired = instruments.filter((i) => i.status === 'expired' || i.status === 'revoked').length;
  const complianceRate = total > 0 ? Math.round((valid / total) * 100) : 0;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  instruments.forEach((inst) => {
    categoryCounts[inst.type] = (categoryCounts[inst.type] || 0) + 1;
  });

  // State / district workload
  const lmoWorkload: Record<string, { total: number; pending: number }> = {
    'Inspector R. K. Sharma (South-East Delhi)': { total: 4, pending: 1 },
    'Inspector Anita Deshmukh (Zone 4 Mumbai)': { total: 3, pending: 2 },
    'Inspector K. S. Gowda (Bengaluru East)': { total: 3, pending: 1 },
    'Inspector Deepa Trivedi (Ahmedabad Central)': { total: 2, pending: 0 },
    'Inspector Manpreet Kaur (Fatehgarh Sahib)': { total: 2, pending: 1 },
  };

  // State for new registration form
  const [newType, setNewType] = useState<InstrumentCategory>('Weighbridge');
  const [newName, setNewName] = useState('100T High-Capacity Rail Weighbridge');
  const [newCapacity, setNewCapacity] = useState('100,000 kg');
  const [newBizName, setNewBizName] = useState('Adani Agri Logistics Ltd');
  const [newDistrict, setNewDistrict] = useState('Kandla, Gujarat');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `IN-${newDistrict.slice(0, 2).toUpperCase()}-WB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setFullYear(dueDate.getFullYear() + 1);

    const newInst: Instrument = {
      id: newId,
      qrCodePayload: `https://metrochain.gov.in/verify/${newId}`,
      type: newType,
      name: newName,
      modelNumber: 'STD-2024-MOD',
      serialNumber: `SN-${Math.floor(10000 + Math.random() * 90000)}`,
      manufacturer: 'Essae Weighing India',
      capacity: newCapacity,
      accuracyClass: 'Class III',
      owner: {
        id: `BIZ-${Math.floor(100 + Math.random() * 900)}`,
        name: 'Authorized Plant Manager',
        businessName: newBizName,
        gstinOrReg: '24AAACT1009K1Z5',
        contactPhone: '+91 98250 99011',
        email: 'compliance@biz.in',
        address: newDistrict,
        district: newDistrict,
        state: 'Gujarat',
      },
      location: {
        siteName: `${newBizName} Main Terminal`,
        address: newDistrict,
        district: newDistrict,
        state: 'Gujarat',
      },
      status: 'valid',
      certificateNo: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      lastVerifiedDate: now,
      nextDueDate: dueDate.toISOString().split('T')[0],
      leadSealNumber: `SEAL-${Math.floor(10000 + Math.random() * 90000)}`,
      assignedLMO: 'Inspector Deepa Trivedi (Badge #GJ-LMO-045)',
      specifications: {
        'Standard Approval': 'OIML R 76-1 Compliant',
        'Verification Type': 'Initial Stamping upon Deployment',
      },
      history: [
        {
          id: `EVT-${Date.now()}`,
          timestamp: `${now} 10:00 AM`,
          type: 'registration',
          title: 'Instrument Initial Registration & Digital Twin Minted',
          performedBy: 'Central Legal Metrology Directorate (MetroChain eMaap)',
          role: 'Controller of Legal Metrology',
          location: newDistrict,
          status: 'passed',
          notes: 'Device calibrated and approved for commercial trade use with dynamic QR identity.',
          certificateNo: `CERT-${new Date().getFullYear()}-001`,
        },
      ],
    };

    onRegisterNewInstrument(newInst);
    setRegisterModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {activeInstrument ? (
        <InstrumentDetailView
          instrument={activeInstrument}
          role="admin"
          onBack={() => onSelectInstrument('')}
          onOpenComplaintModal={() => {}}
          onOpenReVerificationModal={() => {}}
          onOpenFindingModal={() => {}}
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-purple-600/30 border border-purple-400/30 text-purple-300 px-2.5 py-0.5 rounded text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Controller of Legal Metrology · State Oversight</span>
              </div>
              <h1 className="text-xl font-bold">
                National Weights & Measures Unified Oversight Console
              </h1>
              <p className="text-xs text-slate-300">
                Centralized monitoring across Central eMaap, State Portals, and GATC Testing Centers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRegisterModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Mint New Instrument Twin</span>
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Total Fleet</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{total}</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Active digital twins</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">Compliance Rate</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{complianceRate}%</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">{valid} valid certificates</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider block">Expiring 30D</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">{expiring}</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Notices automated</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-red-700 uppercase tracking-wider block">Non-Compliant</span>
              <div className="text-2xl font-bold text-red-600 mt-1">{expired}</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Pending enforcement</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-blue-700 uppercase tracking-wider block">Grievances Open</span>
              <div className="text-2xl font-bold text-blue-900 mt-1">{complaints.length}</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Citizen reports</span>
            </div>
          </div>

          {/* Visual Analytics & Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Status Distribution Bar */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-700" />
                  <span>Instrument Compliance Status Distribution</span>
                </h2>
                <span className="text-xs text-slate-500">100% Registry Traceability</span>
              </div>

              {/* Proportional horizontal stack bar */}
              <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${(valid / total) * 100}%` }}
                  title={`Valid: ${valid}`}
                  className="bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {valid > 0 && `${Math.round((valid / total) * 100)}%`}
                </div>
                <div
                  style={{ width: `${(expiring / total) * 100}%` }}
                  title={`Expiring: ${expiring}`}
                  className="bg-amber-400 hover:bg-amber-500 transition-all flex items-center justify-center text-[10px] font-bold text-slate-900"
                >
                  {expiring > 0 && `${Math.round((expiring / total) * 100)}%`}
                </div>
                <div
                  style={{ width: `${(expired / total) * 100}%` }}
                  title={`Expired: ${expired}`}
                  className="bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {expired > 0 && `${Math.round((expired / total) * 100)}%`}
                </div>
              </div>

              {/* Legend with exact numbers */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
                  <span className="text-[11px] text-emerald-800 font-semibold block">Valid Instruments</span>
                  <span className="text-lg font-bold text-emerald-950">{valid} units</span>
                </div>
                <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50">
                  <span className="text-[11px] text-amber-800 font-semibold block">Expiring (Within 30D)</span>
                  <span className="text-lg font-bold text-amber-950">{expiring} units</span>
                </div>
                <div className="p-2.5 rounded-lg border border-red-200 bg-red-50/50">
                  <span className="text-[11px] text-red-800 font-semibold block">Expired / Revoked</span>
                  <span className="text-lg font-bold text-red-950">{expired} units</span>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Category Distribution
              </h2>

              <div className="space-y-2 text-xs">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-slate-700">
                        <span className="font-medium">{cat}</span>
                        <span className="font-semibold text-slate-900">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-800 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs: Workload & Citizen Complaints */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => handleTabChange('overview')}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All Registered Instruments
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('workload')}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    activeTab === 'workload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  LMO / GATC Officer Workload
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('complaints')}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'complaints' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <span>Consumer Grievance Log</span>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {complaints.length}
                  </span>
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded-md bg-white w-44"
                />
              </div>
            </div>

            {/* Tab 1: Overview Instruments */}
            {activeTab === 'overview' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                      <th className="py-3 px-4">Instrument ID & Type</th>
                      <th className="py-3 px-4">Owner Business & Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Verified</th>
                      <th className="py-3 px-4">Next Due Date</th>
                      <th className="py-3 px-4">Assigned Authority</th>
                      <th className="py-3 px-4 text-right">Digital Twin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {instruments
                      .filter((i) =>
                        i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.owner.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.type.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((inst) => (
                        <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-blue-900 block">{inst.id}</span>
                            <span className="text-slate-700">{inst.name}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900">{inst.owner.businessName}</div>
                            <span className="text-[11px] text-slate-500">{inst.location.district}</span>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={inst.status} size="sm" />
                          </td>
                          <td className="py-3 px-4 text-slate-700">{inst.lastVerifiedDate}</td>
                          <td className="py-3 px-4 font-semibold text-slate-900">{inst.nextDueDate}</td>
                          <td className="py-3 px-4 text-slate-600">{inst.assignedLMO}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onSelectInstrument(inst.id)}
                              className="px-2.5 py-1 text-xs text-white bg-slate-900 hover:bg-slate-800 rounded font-medium cursor-pointer"
                            >
                              Open Twin
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: Workload */}
            {activeTab === 'workload' && (
              <div className="p-5 space-y-4">
                <div className="text-xs text-slate-600">
                  Officer beat load balancing and inspection completion rates across district circles:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(lmoWorkload).map(([officer, data]) => (
                    <div key={officer} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-slate-900">{officer}</strong>
                        <span className="text-[11px] font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                          Active Beat
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Assigned Instruments:</span>
                        <strong className="text-slate-800">{data.total} units</strong>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Scheduled Inspections Pending:</span>
                        <strong className="text-amber-700">{data.pending} cases</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Citizen Complaints Log */}
            {activeTab === 'complaints' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600 bg-red-50/60 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      Public grievances logged under Section 15 of Legal Metrology Act 2009. Complainant identity and contact info are captured for official investigation.
                    </span>
                  </div>
                  <span className="font-bold text-red-950 whitespace-nowrap">
                    {complaints.length} Total Registered
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complaints.map((comp) => (
                    <div key={comp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                      {/* Complaint ID & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="font-mono text-xs font-bold text-slate-900">{comp.id}</span>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                            comp.status === 'action_taken'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : comp.status === 'assigned_to_lmo'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {comp.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Issue Details */}
                      <div>
                        <span className="text-xs font-bold text-slate-900 block capitalize">
                          Issue: {comp.complaintType.replace('_', ' ')}
                        </span>
                        <p className="text-xs text-slate-600 mt-1 italic bg-white p-2.5 rounded border border-slate-200">
                          "{comp.description}"
                        </p>
                      </div>

                      {/* Equipment Context */}
                      <div className="text-[11px] text-slate-600 space-y-1 bg-white/70 p-2.5 rounded border border-slate-200">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Equipment Target:</span>
                          <strong className="font-mono text-blue-900">{comp.instrumentId}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Commercial Site:</span>
                          <span className="truncate max-w-[200px] text-slate-800">{comp.siteName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">District:</span>
                          <span className="text-slate-800">{comp.district}</span>
                        </div>
                      </div>

                      {/* Complainant Contact Information (Logged and Visible to Admin) */}
                      <div className="text-[11px] bg-blue-50/60 border border-blue-200 rounded-lg p-3 space-y-1 text-slate-700">
                        <span className="font-bold text-blue-950 block text-[11px]">
                          Complainant Contact Information:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-0.5">
                          <div>
                            <span className="text-slate-500">Name:</span>{' '}
                            <strong className="text-slate-900">{comp.citizenName || 'Anonymous Citizen'}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500">Phone:</span>{' '}
                            <span className="font-mono text-slate-800">{comp.citizenPhone || 'None provided'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Email:</span>{' '}
                            <span className="text-slate-800">{comp.citizenEmail || 'None provided'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Reported:</span>{' '}
                            <span className="text-slate-800">{comp.reportedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Resolution Actions */}
                      <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2 border-t border-slate-200">
                        {comp.status !== 'action_taken' && (
                          <button
                            type="button"
                            onClick={() => onUpdateComplaintStatus(comp.id, 'action_taken')}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded cursor-pointer transition-colors"
                          >
                            Mark Resolved & Fine Issued
                          </button>
                        )}
                        {comp.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => onUpdateComplaintStatus(comp.id, 'assigned_to_lmo')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-blue-900 bg-blue-100 hover:bg-blue-200 rounded cursor-pointer transition-colors"
                          >
                            Dispatch LMO Audit
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectInstrument(comp.instrumentId)}
                          className="px-2.5 py-1 text-[11px] text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                        >
                          Inspect Scale Twin
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Register New Instrument Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-purple-950 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-300" />
                <div>
                  <h2 className="text-base font-semibold">Mint Digital Twin Instrument</h2>
                  <p className="text-xs text-purple-200">Generate Permanent QR Code & Ledger Entry</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Equipment Category:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as InstrumentCategory)}
                  className="w-full p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="Weighbridge">Weighbridge (Heavy Vehicle)</option>
                  <option value="Fuel Dispenser">Fuel Dispenser (Multi-Nozzle)</option>
                  <option value="Electronic Retail Scale">Electronic Retail Counter Scale</option>
                  <option value="Precision Balance">Class II Precision Gold Balance</option>
                  <option value="Moisture Meter">Grain Moisture Meter</option>
                  <option value="Flow Meter">Bulk Flow Meter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instrument Model / Name:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity:</label>
                  <input
                    type="text"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District / Jurisdiction:</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating Business Name:</label>
                <input
                  type="text"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-600">
                A permanent cryptographically signed QR code will be generated upon confirmation, tying manufacturer model approval with state verification.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-700 hover:bg-purple-800 rounded shadow-xs cursor-pointer"
                >
                  Mint & Issue Permanent QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

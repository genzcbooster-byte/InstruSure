import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  PlusCircle, 
  Filter, 
  ArrowUpRight,
  Printer,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { Instrument, ReVerificationApplication, CertificateStatus } from '../../types/metrochain';
import { StatusBadge } from '../StatusBadge';
import { InstrumentDetailView } from '../InstrumentDetailView';
import { ReVerificationModal } from '../ReVerificationModal';
import { QRCodeDisplay } from '../QRCodeDisplay';

interface BusinessViewProps {
  instruments: Instrument[];
  applications: ReVerificationApplication[];
  selectedInstrumentId?: string;
  onSelectInstrument: (id: string) => void;
  onSubmitApplication: (app: ReVerificationApplication) => void;
  onOpenScanner: () => void;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

export const BusinessView: React.FC<BusinessViewProps> = ({
  instruments,
  applications,
  selectedInstrumentId,
  onSelectInstrument,
  onSubmitApplication,
  onOpenScanner,
  activeSection = 'overview',
  onSelectSection,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reVerificationModalOpen, setReVerificationModalOpen] = useState(false);
  const [targetInstrumentForApply, setTargetInstrumentForApply] = useState<Instrument | undefined>(undefined);
  const [stickerModalInst, setStickerModalInst] = useState<Instrument | null>(null);

  const activeInstrument = instruments.find((i) => i.id === selectedInstrumentId);

  // Compute metrics
  const totalCount = instruments.length;
  const validCount = instruments.filter((i) => i.status === 'valid').length;
  const expiringCount = instruments.filter((i) => i.status === 'expiring').length;
  const expiredCount = instruments.filter((i) => i.status === 'expired' || i.status === 'revoked').length;

  const filtered = instruments.filter((i) => {
    if (filterStatus === 'all') return true;
    return i.status === filterStatus;
  });

  const handleApplyClick = (inst?: Instrument) => {
    setTargetInstrumentForApply(inst);
    setReVerificationModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {activeInstrument ? (
        <InstrumentDetailView
          instrument={activeInstrument}
          role="business"
          onBack={() => onSelectInstrument('')}
          onOpenComplaintModal={() => {}}
          onOpenReVerificationModal={() => handleApplyClick(activeInstrument)}
          onOpenFindingModal={() => {}}
        />
      ) : (
        <>
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-900" />
                <h1 className="text-xl font-bold text-slate-900">
                  Commercial Enterprise Metrology Dashboard
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                Manage statutory compliance, track re-verification due dates, and print permanent QR codes.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleApplyClick(undefined)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Apply for Re-Verification</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setFilterStatus('all')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs opacity-75 block font-medium">Total Registered</span>
              <div className="text-2xl font-bold mt-1">{totalCount}</div>
              <span className="text-[11px] opacity-70 mt-1 block">Active digital twins</span>
            </div>

            <div
              onClick={() => setFilterStatus('valid')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                filterStatus === 'valid'
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-75 font-medium">Valid & Certified</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-600">{validCount}</div>
              <span className="text-[11px] opacity-70 mt-1 block">Fully compliant</span>
            </div>

            <div
              onClick={() => setFilterStatus('expiring')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                filterStatus === 'expiring'
                  ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-75 font-medium">Expiring Soon</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold mt-1 text-amber-600">{expiringCount}</div>
              <span className="text-[11px] opacity-70 mt-1 block">Due within 30 days</span>
            </div>

            <div
              onClick={() => setFilterStatus('expired')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                filterStatus === 'expired'
                  ? 'bg-red-800 text-white border-red-800 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-75 font-medium">Expired / Overdue</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-bold mt-1 text-red-600">{expiredCount}</div>
              <span className="text-[11px] opacity-70 mt-1 block">Immediate action required</span>
            </div>
          </div>

          {/* Instruments Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Commercial Instruments Fleet</h2>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">Showing {filtered.length} equipment units</span>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                {(['all', 'valid', 'expiring', 'expired'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 font-medium rounded-md capitalize transition-colors cursor-pointer ${
                      filterStatus === st
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">Instrument ID & Type</th>
                    <th className="py-3 px-4">Operating Entity / Location</th>
                    <th className="py-3 px-4">Certificate Status</th>
                    <th className="py-3 px-4">Next Due Date</th>
                    <th className="py-3 px-4">Seal Serial</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((inst) => (
                    <tr
                      key={inst.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-blue-900">{inst.id}</div>
                        <div className="text-slate-800 font-medium">{inst.name}</div>
                        <span className="text-[11px] text-slate-500">{inst.type}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-medium text-slate-900">{inst.owner.businessName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{inst.location.siteName}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={inst.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{inst.nextDueDate}</div>
                        <span className="text-[10px] text-slate-500">Last: {inst.lastVerifiedDate}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700 text-[11px]">
                        {inst.leadSealNumber}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setStickerModalInst(inst)}
                          title="Generate physical QR verification sticker"
                          className="px-2.5 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium cursor-pointer transition-colors inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3 text-slate-600" />
                          <span>Label</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyClick(inst)}
                          className="px-2.5 py-1.5 text-xs text-blue-900 bg-blue-50 hover:bg-blue-100 rounded font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Re-Verify</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectInstrument(inst.id)}
                          className="px-2.5 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 rounded font-medium cursor-pointer transition-colors inline-flex items-center gap-1"
                        >
                          <span>Twin</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Application Tracking Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Re-Verification Applications Tracker
                </h2>
                <p className="text-xs text-slate-500">
                  Track statutory stamping requests submitted to Legal Metrology inspectorate
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
                {applications.length} Active Applications
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{app.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        app.status === 'lmo_assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'submitted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Device:</span>
                      <strong className="font-mono text-slate-800">{app.instrumentId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fee Paid:</span>
                      <span className="font-semibold text-emerald-700">₹{app.feePaid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Inspection Slot:</span>
                      <span className="text-slate-800">{app.preferredDate}</span>
                    </div>
                    {app.lmoOfficer && (
                      <div className="flex justify-between border-t border-slate-200 pt-1">
                        <span className="text-slate-500">Assigned LMO:</span>
                        <span className="text-blue-900 font-semibold">{app.lmoOfficer}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Re-Verification Modal */}
      <ReVerificationModal
        isOpen={reVerificationModalOpen}
        onClose={() => setReVerificationModalOpen(false)}
        instrument={targetInstrumentForApply}
        allInstruments={instruments}
        onSubmitApplication={onSubmitApplication}
      />

      {/* Sticker Preview Modal */}
      {stickerModalInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Physical QR Sticker Generator</h3>
            <p className="text-xs text-slate-500">
              Affix this tamper-evident sticker to the scale body for public and officer inspection.
            </p>

            <div className="flex justify-center">
              <QRCodeDisplay instrument={stickerModalInst} size={150} showStickerPreview />
            </div>

            <button
              type="button"
              onClick={() => setStickerModalInst(null)}
              className="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

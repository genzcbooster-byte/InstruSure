import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  UserCheck, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Scale, 
  AlertTriangle,
  ArrowRight,
  Printer,
  Download,
  Eye,
  X
} from 'lucide-react';
import { 
  ScalyInstrument, 
  CurrentUser, 
  OfficerProfile, 
  ReVerificationApplication,
  DigitalCertificate
} from '../../types/scaly';
import { DigitalCertificateModal } from '../DigitalCertificateModal';

interface BusinessViewProps {
  currentUser: CurrentUser;
  instruments: ScalyInstrument[];
  currentInstrument: ScalyInstrument | null;
  officers: OfficerProfile[];
  onSelectInstrument: (id: string) => void;
  onOpenScanner: () => void;
  onSubmitApplication: (app: ReVerificationApplication) => void;
}

export const BusinessView: React.FC<BusinessViewProps> = ({
  currentUser,
  instruments,
  currentInstrument,
  officers,
  onSelectInstrument,
  onOpenScanner,
  onSubmitApplication,
}) => {
  // Filter instruments owned by this business or show full directory if matching
  const ownedInstruments = instruments.filter(
    i => i.ownerName.toLowerCase().includes(currentUser.name.toLowerCase()) || 
         i.ownerName.toLowerCase().includes((currentUser.organization || '').toLowerCase()) ||
         i.ownerId === 'BIZ-MH-884'
  );

  const activeInst = currentInstrument || ownedInstruments[0] || instruments[0];
  const officer = officers.find(o => o.badge === activeInst?.lmoOfficerBadge) || officers[0];

  // Modals state
  const [reVerifyModalOpen, setReVerifyModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{ cert: DigitalCertificate; inst: ScalyInstrument } | null>(null);
  const [preferredDate, setPreferredDate] = useState('2026-10-10');
  const [applicationSubmitted, setApplicationSubmitted] = useState<ReVerificationApplication | null>(null);

  // Automated statutory fee calculator under Indian Legal Metrology Rules
  const calculateStatutoryFee = (instType: string) => {
    const t = instType.toLowerCase();
    if (t.includes('weighbridge')) return 5000;
    if (t.includes('fuel')) return 2000;
    if (t.includes('balance') || t.includes('precision')) return 1500;
    if (t.includes('moisture')) return 1200;
    return 500; // standard commercial bench scale
  };

  const statutoryFee = calculateStatutoryFee(activeInst?.type || '');

  // Days remaining calculation
  const calculateDaysRemaining = (dueDateStr?: string) => {
    if (!dueDateStr) return 0;
    const now = new Date('2026-09-23T11:25:37');
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining(activeInst?.nextDueDate);

  const handleApplyReVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInst) return;

    const newApp: ReVerificationApplication = {
      id: `APP-LM-${Math.floor(10000 + Math.random() * 90000)}`,
      instrumentId: activeInst.id,
      businessId: activeInst.ownerId,
      businessName: activeInst.ownerName,
      appliedDate: '2026-09-23',
      feeAmount: statutoryFee,
      transactionRef: `BHIM-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
      preferredInspectionDate: preferredDate,
      status: 'SUBMITTED',
    };

    onSubmitApplication(newApp);
    setApplicationSubmitted(newApp);
  };

  const handleOpenCertificate = (inst: ScalyInstrument) => {
    if (inst.certificate) {
      setSelectedCert({ cert: inst.certificate, inst });
      setCertModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Enterprise Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-slate-900 tracking-tight font-heading">
                {currentUser.organization || 'Apex Logistics & Warehousing Ltd.'}
              </h1>
              <span className="text-[10px] font-mono tabular-nums bg-blue-50 border border-blue-200 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                {currentUser.idOrBadge}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Commercial Instrument Owner Portal • Regulated Fleet Compliance
            </p>
          </div>
        </div>

        {/* Quick Fleet Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">Active Unit:</span>
          <select
            value={activeInst?.id}
            onChange={(e) => onSelectInstrument(e.target.value)}
            className="w-full sm:w-auto p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono tabular-nums font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-[1.5]"
          >
            {instruments.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} ({i.type.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ASSET HEALTH BANNER: Real-time validity countdown pill */}
      <div className={`p-5 rounded-3xl border shadow-sm transition-all ${
        daysRemaining <= 0
          ? 'bg-rose-50 border-rose-200 text-rose-950'
          : daysRemaining <= 30
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold ${
              daysRemaining <= 0
                ? 'bg-rose-600 text-white'
                : daysRemaining <= 30
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-600 text-white'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-slate-500 block font-heading">
                Statutory Stamping Status
              </span>
              <h2 className="text-base font-semibold tracking-tight font-heading">
                <span className="font-mono tabular-nums">{activeInst?.id}</span> — {activeInst?.type}
              </h2>
            </div>
          </div>

          {/* Real-time Validity Countdown Pill */}
          <div className={`px-4 py-1.5 rounded-full border text-xs font-semibold font-mono tabular-nums flex items-center gap-2 shadow-xs ${
            daysRemaining <= 0
              ? 'bg-rose-100 border-rose-300 text-rose-800'
              : daysRemaining <= 30
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-emerald-100 border-emerald-300 text-emerald-900'
          }`}>
            <Clock className="w-4 h-4 animate-pulse" />
            <span>
              {daysRemaining > 0 
                ? `${daysRemaining} Days Until Mandatory Re-Verification`
                : 'Statutory Verification Overdue / Non-Compliant'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: LMO Visit Schedule & Active Physical Seal Record */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Next LMO Visit Schedule & Officer Contact Portal */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Next LMO Inspection Schedule</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Assigned Beat
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Target Inspection Window:</span>
              <span className="font-bold text-slate-900">{activeInst?.nextDueDate}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Designated Field Inspector:</span>
              <span className="font-bold text-slate-900">{officer.name}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Inspector Badge ID:</span>
              <span className="font-mono font-bold text-slate-800">{officer.badge}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Jurisdiction Division:</span>
              <span className="text-slate-700">{officer.division}</span>
            </div>

            {/* Officer Contact Portal */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${officer.phone}`}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Inspector</span>
              </a>
              <a
                href={`mailto:${officer.email}`}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                <span>Email Sub-Division</span>
              </a>
            </div>
          </div>
        </div>

        {/* Active Physical Seal Record */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Active Physical Lead Seal Record</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
              activeInst?.status === 'SEAL_BROKEN' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {activeInst?.status === 'SEAL_BROKEN' ? 'SEAL TAMPERED' : 'SEAL VERIFIED'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Lead Wire Seal Serial No.
                </span>
                <span className="text-base font-mono font-extrabold text-slate-900">
                  {activeInst?.leadSealNumber}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Matches Physical Chassis Lock
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">MPE Statutory Tolerance:</span>
              <span className="font-mono font-bold text-slate-900">±{activeInst?.mpeToleranceGrams} grams</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-500">Model Approval Certificate:</span>
              <span className="font-mono text-slate-700">{activeInst?.patternApprovalRef}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Installation Site:</span>
              <span className="text-slate-700 truncate max-w-[200px]">{activeInst?.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Actions: 1-Click Re-Verification & Digital Certificate */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold font-heading">
            Mandatory Statutory Re-Verification
          </h3>
          <p className="text-xs text-slate-300 font-normal">
            Submit annual re-stamping request and calculate official government fee directly.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {activeInst?.certificate ? (
            <button
              type="button"
              onClick={() => handleOpenCertificate(activeInst)}
              className="flex-1 sm:flex-initial py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all font-heading tracking-[0.02em]"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download Certificate</span>
            </button>
          ) : (
            <div className="flex-1 sm:flex-initial py-2 px-3 bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs rounded-xl flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold font-heading">Verification Pending</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setReVerifyModalOpen(true)}
            className="flex-1 sm:flex-initial py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all font-heading"
          >
            <CreditCard className="w-4 h-4" />
            <span>Apply for Annual Re-Verification</span>
          </button>
        </div>
      </div>

      {/* REGISTERED ENTERPRISE FLEET TABLE WITH CERTIFICATE ACTIONS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-blue-900" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-heading">
                Enterprise Instruments Fleet & Digital Certificates
              </h2>
              <p className="text-[11px] text-slate-500">
                Official statutory status, verification validities, and client-side certificate downloads
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {ownedInstruments.length} Units Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Instrument ID & Make</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Last Verified</th>
                <th className="py-2.5 px-3">Next Due Date</th>
                <th className="py-2.5 px-3">Compliance Status</th>
                <th className="py-2.5 px-3 text-right">Statutory Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ownedInstruments.map((item) => {
                const isSelected = item.id === activeInst?.id;
                return (
                  <tr 
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">
                        {item.id}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.makeModel}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {item.type}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {item.lastVerifiedDate}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {item.nextDueDate}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'VALID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'EXPIRING_SOON'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.certificate ? (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenCertificate(item)}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-[11px] rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer font-heading tracking-[0.01em]"
                          >
                            <Download className="w-3 h-3 text-amber-300" />
                            <span>Download Certificate</span>
                          </button>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-50 border border-amber-300/80 text-amber-900 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 font-heading">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Verification Pending</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Annual Re-Verification with Automated Statutory Fee Calculator */}
      {reVerifyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            <div className="p-5 bg-blue-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">Annual Re-Verification Application</h3>
                  <p className="text-[10px] text-blue-200">Legal Metrology General Rules, 2011</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReVerifyModalOpen(false);
                  setApplicationSubmitted(null);
                }}
                className="text-blue-200 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {applicationSubmitted ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Application & Fee Lodged</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Dispatched to {officer.name} ({officer.division}) for field scheduling.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Application Number:</span>
                    <strong className="font-mono">{applicationSubmitted.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Statutory Fee Paid:</span>
                    <strong className="text-emerald-700">₹{applicationSubmitted.feeAmount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Treasury Transaction Ref:</span>
                    <span className="font-mono text-slate-700">{applicationSubmitted.transactionRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Requested Inspection Date:</span>
                    <span className="font-semibold">{applicationSubmitted.preferredInspectionDate}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReVerifyModalOpen(false);
                    setApplicationSubmitted(null);
                  }}
                  className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyReVerification} className="p-6 space-y-4 text-xs">
                {/* Machine Summary */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900">{activeInst?.id}</div>
                  <div className="text-slate-600">{activeInst?.type} • {activeInst?.makeModel}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Current Lead Wire Seal: <strong className="font-mono">{activeInst?.leadSealNumber}</strong>
                  </div>
                </div>

                {/* Automated Statutory Fee Calculator */}
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">Statutory Stamping Fee:</span>
                    <span className="text-lg font-black text-blue-950 font-mono">₹{statutoryFee}</span>
                  </div>
                  <p className="text-[10px] text-blue-700">
                    Prescribed under Schedule IX of Legal Metrology (General) Rules, 2011 for {activeInst?.type}.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Preferred Field Inspection Date
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px]">
                    Automatic Treasury Settlement with State Metrology Directorate.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReVerifyModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Confirm & Pay ₹{statutoryFee}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Official Digital Certificate Modal (Allows client-side PDF download) */}
      {certModalOpen && selectedCert && (
        <DigitalCertificateModal
          isOpen={certModalOpen}
          onClose={() => {
            setCertModalOpen(false);
            setSelectedCert(null);
          }}
          certificate={selectedCert.cert}
          instrument={selectedCert.inst}
          allowDownload={true}
        />
      )}
    </div>
  );
};

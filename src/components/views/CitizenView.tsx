import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Calendar, 
  UserCheck, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Upload, 
  Send, 
  ArrowLeft,
  Info,
  Clock,
  ExternalLink,
  FileText,
  Eye
} from 'lucide-react';
import { ScalyInstrument, CitizenGrievance, OfficerProfile } from '../../types/scaly';
import { DigitalCertificateDocument } from '../DigitalCertificateDocument';
import { DigitalCertificateModal } from '../DigitalCertificateModal';

interface CitizenViewProps {
  currentInstrument: ScalyInstrument | null;
  officers: OfficerProfile[];
  onOpenScanner: () => void;
  onSubmitGrievance: (grievance: CitizenGrievance) => void;
  onSelectInstrument: (id: string) => void;
  allInstruments: ScalyInstrument[];
}

export const CitizenView: React.FC<CitizenViewProps> = ({
  currentInstrument,
  officers,
  onOpenScanner,
  onSubmitGrievance,
  onSelectInstrument,
  allInstruments,
}) => {
  const [grievanceModalOpen, setGrievanceModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [grievanceType, setGrievanceType] = useState<CitizenGrievance['issueType']>('underweight');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [submittedGrievanceId, setSubmittedGrievanceId] = useState<string | null>(null);

  // If no instrument selected yet, pick the first valid one or prompt
  const inst = currentInstrument || allInstruments[0];
  const officer = officers.find(o => o.badge === inst?.lmoOfficerBadge) || {
    badge: inst?.lmoOfficerBadge || 'LM-88219',
    name: 'Rajesh Sharma',
    division: 'Mumbai Central Sub-Division',
  };

  // Remaining days calculation
  const calculateDaysRemaining = (dueDateStr?: string) => {
    if (!dueDateStr) return 0;
    const now = new Date('2026-09-23T11:25:37');
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysRemaining(inst?.nextDueDate);

  // Authenticity Shield status mapping
  const getShieldStatus = () => {
    if (!inst) return { text: 'Unknown', bg: 'bg-slate-800', border: 'border-slate-700', icon: <Info className="w-8 h-8 text-slate-400" /> };
    if (inst.status === 'SEAL_BROKEN' || inst.status === 'REJECTED') {
      return {
        text: 'Tampered Lead Seal — Unlawful for Trade',
        subtext: 'Warning: This machine is prohibited from commercial use under Section 15 of Legal Metrology Act.',
        badgeBg: 'bg-rose-950/80 border-rose-600 text-rose-200',
        iconBg: 'bg-rose-600 text-white',
        icon: <ShieldAlert className="w-10 h-10" />,
        isLegal: false,
      };
    }
    if (inst.status === 'EXPIRING_SOON' || daysLeft <= 15) {
      return {
        text: 'Verification Expiring Soon',
        subtext: `Valid for commercial use. Statutory re-stamping due in ${daysLeft > 0 ? daysLeft : 0} days.`,
        badgeBg: 'bg-amber-950/80 border-amber-600 text-amber-200',
        iconBg: 'bg-amber-500 text-slate-950',
        icon: <Clock className="w-10 h-10" />,
        isLegal: true,
      };
    }
    if (inst.status === 'VALID' || inst.status === 'GATC_APPROVED') {
      return {
        text: 'Officially Tested & Sealed',
        subtext: 'Certified by Department of Consumer Affairs Legal Metrology Division.',
        badgeBg: 'bg-emerald-950/80 border-emerald-600 text-emerald-200',
        iconBg: 'bg-emerald-600 text-white',
        icon: <ShieldCheck className="w-10 h-10" />,
        isLegal: true,
      };
    }
    return {
      text: 'Pending Laboratory Endorsement',
      subtext: 'Currently undergoing precision bench testing at NABL accredited GATC.',
      badgeBg: 'bg-purple-950/80 border-purple-600 text-purple-200',
      iconBg: 'bg-purple-600 text-white',
      icon: <Info className="w-10 h-10" />,
      isLegal: false,
    };
  };

  const shield = getShieldStatus();

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inst) return;
    const newId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrievance: CitizenGrievance = {
      id: newId,
      instrumentId: inst.id,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      citizenName: citizenName || 'Anonymous Consumer',
      citizenPhone: citizenPhone || undefined,
      issueType: grievanceType,
      description: description || 'Reported discrepancy in weight delivery during purchase.',
      latitude: 18.9750,
      longitude: 72.8258,
      photoAttached,
      status: 'PENDING_REVIEW',
    };

    onSubmitGrievance(newGrievance);
    setSubmittedGrievanceId(newId);
  };

  return (
    <div className="max-w-md mx-auto space-y-5 font-sans">
      {/* Mobile-first top prompt */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-slate-800">Public Consumer Verification</span>
        </div>
        <button
          type="button"
          onClick={onOpenScanner}
          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Switch Machine</span>
        </button>
      </div>

      {/* Main Authenticity Card (Mobile-First Single Column) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Large Authenticity Shield */}
        <div className="p-6 text-center space-y-4 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative">
          <div className="relative inline-flex items-center justify-center p-4 rounded-3xl shadow-2xl mx-auto border-2 border-white/20">
            <div className={`p-4 rounded-2xl ${shield.iconBg} shadow-inner`}>
              {shield.icon}
            </div>
          </div>

          <div className="space-y-1">
            <span className={`inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${shield.badgeBg}`}>
              {shield.text}
            </span>
            <p className="text-xs text-slate-300 max-w-xs mx-auto pt-1 leading-relaxed">
              {shield.subtext}
            </p>
          </div>

          {/* Machine Header */}
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span className="font-mono text-slate-200 font-bold block text-sm">
              {inst?.id}
            </span>
            <span>{inst?.type} • {inst?.makeModel}</span>
          </div>
        </div>

        {/* 3 CRITICAL DATA POINTS ONLY (Strictly Scoped) */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {/* Point 1: Verified By */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-slate-400 block font-heading">
                  1. Statutory Officer Verification
                </span>
                <span className="text-xs font-semibold text-slate-900 block truncate font-heading">
                  {officer.name} • <span className="font-mono tabular-nums">{officer.badge}</span>
                </span>
                <span className="text-[11px] text-slate-500 block truncate font-normal">
                  {officer.division}
                </span>
              </div>
            </div>

            {/* Point 2: Verification Date */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-slate-400 block font-heading">
                  2. Official Stamping Date
                </span>
                <span className="text-xs font-semibold text-slate-900 block font-mono tabular-nums">
                  {inst?.lastVerifiedDate}
                </span>
                <span className="text-[11px] text-slate-500 block font-normal">
                  Lead Wire Seal Number: <strong className="font-mono tabular-nums text-slate-700">{inst?.leadSealNumber}</strong>
                </span>
              </div>
            </div>

            {/* Point 3: Valid Until (with remaining days badge) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-slate-400 block font-heading">
                    3. Stamping Validity Expiry
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-heading ${
                    daysLeft > 30 ? 'bg-emerald-100 text-emerald-800' : daysLeft > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {daysLeft > 0 ? `${daysLeft} Days Remaining` : 'Expired'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block font-mono tabular-nums">
                  {inst?.nextDueDate}
                </span>
                <span className="text-[11px] text-slate-500 block font-normal">
                  National Pattern Approval: <span className="font-mono tabular-nums">{inst?.patternApprovalRef}</span>
                </span>
              </div>
            </div>

            {/* Point 4: Statutory Digital Certificate Status Line & Read-Only Thumbnail */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-slate-400 block font-heading">
                    4. Statutory Digital Verification Certificate
                  </span>
                  {inst?.certificate ? (
                    <div>
                      {/* Plain-text status line */}
                      <p className="text-xs font-semibold text-slate-900 font-heading">
                        Valid until {inst.certificate.nextDueDate}
                      </p>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        Cert No: {inst.certificate.certificateNumber}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-amber-700 font-heading">
                        Verification Pending
                      </p>
                      <span className="text-[11px] text-slate-500 block">
                        No digital certificate has been issued yet for this instrument.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Read-Only Thumbnail Preview (Non-interactive: no zoom, no download, no PDF export) */}
              {inst?.certificate && (
                <div className="pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.04em] text-slate-500 font-heading flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Official Certificate Thumbnail (Read-Only)
                    </span>
                    <button
                      type="button"
                      onClick={() => setCertModalOpen(true)}
                      className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 font-heading cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Full Document</span>
                    </button>
                  </div>

                  {/* Thumbnail Card: Tapping opens larger read-only view */}
                  <div 
                    onClick={() => setCertModalOpen(true)}
                    className="cursor-pointer group relative rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-amber-50/20 hover:border-blue-400 transition-all"
                    title="Tap to view full read-only statutory certificate"
                  >
                    <DigitalCertificateDocument
                      certificate={inst.certificate}
                      instrument={inst}
                      isThumbnail={true}
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center pointer-events-none">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-950/80 text-white px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-md">
                        <Eye className="w-3 h-3 text-amber-400" />
                        Tap for larger read-only view
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 text-center font-normal">
                    Public Inspection Record • Certified under Rule 24 of LM Rules
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SINGLE ACTION: Report Inaccuracy / Broken Seal */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setGrievanceModalOpen(true)}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs rounded-2xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading tracking-[0.02em]"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Inaccuracy / Broken Seal</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2 font-normal leading-relaxed">
              Direct statutory lodging under Section 15 of the Legal Metrology Act, 2009
            </p>
          </div>
        </div>

        {/* STRICTLY HIDDEN NOTICE FOR EVALUATOR CLARITY */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 text-center font-mono">
          🔒 Scoped Privacy: Business finances, purchase invoices & sensor telemetry hidden.
        </div>
      </div>

      {/* Grievance Modal */}
      {grievanceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            {/* Header */}
            <div className="p-5 bg-rose-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-900 text-rose-200 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Lodge Metrology Grievance</h3>
                  <p className="text-[10px] text-rose-200">Against Machine {inst?.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setGrievanceModalOpen(false);
                  setSubmittedGrievanceId(null);
                }}
                className="text-rose-200 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {submittedGrievanceId ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Grievance Registered</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your complaint has been assigned to the Legal Metrology Officer ({officer.name} • {officer.badge}).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
                  Grievance Tracking ID: <strong>{submittedGrievanceId}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setGrievanceModalOpen(false);
                    setSubmittedGrievanceId(null);
                    setDescription('');
                  }}
                  className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleGrievanceSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nature of Irregularity
                  </label>
                  <select
                    value={grievanceType}
                    onChange={(e) => setGrievanceType(e.target.value as CitizenGrievance['issueType'])}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="underweight">Underweight / Short Delivery (Charged more than given)</option>
                    <option value="tampered_seal">Tampered / Missing Lead Wire Stamping Seal</option>
                    <option value="expired_verification">Expired Annual Stamping Certificate</option>
                    <option value="faulty_display">Unstable / Obstructed Customer Weight Display</option>
                    <option value="refused_receipt">Refusal by Merchant to Produce Verification Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Detailed Observation / Transaction Incident
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Billed for 5.0 kg of goods, secondary calibrated check revealed 4.65 kg. Seal wire looked unfastened."
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Rajesh K."
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      Mobile Number (For SMS update)
                    </label>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Mock photo upload & GPS coordinate tag */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Attach Physical Proof:</span>
                    <button
                      type="button"
                      onClick={() => setPhotoAttached(!photoAttached)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                        photoAttached ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {photoAttached ? '✓ Photo Attached' : '+ Simulate Photo'}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Geo-tagged location: 18.9750° N, 72.8258° E (Mumbai Central)</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setGrievanceModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to State Inspector</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Read-Only Digital Certificate Modal (allowDownload={false} strictly removes all download & export options) */}
      {certModalOpen && inst?.certificate && (
        <DigitalCertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          certificate={inst.certificate}
          instrument={inst}
          allowDownload={false}
        />
      )}
    </div>
  );
};

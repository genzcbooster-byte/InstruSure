import React, { useState } from 'react';
import { 
  UserCheck, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Hash, 
  Cpu, 
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
  History,
  Download,
  Eye
} from 'lucide-react';
import { 
  ScalyInstrument, 
  CurrentUser, 
  StampingRecord, 
  CitizenGrievance,
  DigitalCertificate
} from '../../types/scaly';
import { DigitalCertificateModal } from '../DigitalCertificateModal';

interface LMOViewProps {
  currentUser: CurrentUser;
  instruments: ScalyInstrument[];
  currentInstrument: ScalyInstrument | null;
  stampingRecords: StampingRecord[];
  grievances: CitizenGrievance[];
  onSelectInstrument: (id: string) => void;
  onOpenScanner: () => void;
  onCommitInspection: (
    updatedInstrument: ScalyInstrument, 
    stampingRecord: StampingRecord
  ) => void;
}

export const LMOView: React.FC<LMOViewProps> = ({
  currentUser,
  instruments,
  currentInstrument,
  stampingRecords,
  grievances,
  onSelectInstrument,
  onOpenScanner,
  onCommitInspection,
}) => {
  const inst = currentInstrument || instruments[0];

  // Tolerance Test Form State
  const defaultStandard = inst?.type.toLowerCase().includes('weighbridge')
    ? 10000
    : inst?.type.toLowerCase().includes('fuel')
    ? 5000
    : inst?.type.toLowerCase().includes('balance')
    ? 200
    : 20;

  const [standardLoad, setStandardLoad] = useState<number>(defaultStandard);
  const [observedLoad, setObservedLoad] = useState<number>(defaultStandard);
  const [sealCheck, setSealCheck] = useState<'INTACT' | 'DAMAGED_TAMPERED'>('INTACT');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Digital Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<DigitalCertificate | null>(null);

  // MPE Calculator logic
  const mpeLimit = inst?.mpeToleranceGrams || 10;
  const delta = Math.abs(observedLoad - standardLoad);
  const isTolerancePass = delta <= mpeLimit;
  const overallPass = isTolerancePass && sealCheck === 'INTACT';

  // Past stamping records for this instrument
  const pastStampings = stampingRecords.filter(r => r.instrumentId === inst?.id);

  // Grievances for this machine
  const machineGrievances = grievances.filter(g => g.instrumentId === inst?.id);

  // Action: Pass & Affix Digital Seal
  const handlePassAndAffixSeal = () => {
    if (!inst) return;

    const newSeal = `SEAL-${inst.id.split('-')[1] || 'MH'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: StampingRecord = {
      id: `STP-${Date.now()}`,
      instrumentId: inst.id,
      timestamp: '2026-09-23 11:30',
      officerBadge: currentUser.idOrBadge,
      standardLoad,
      observedLoad,
      delta,
      mpeLimit,
      result: 'PASS',
      sealCheck: 'INTACT',
      newSealNumber: newSeal,
      notes: inspectionNotes || 'Standard statutory field tolerance check completed. Maximum permissible error satisfied.',
    };

    const updated: ScalyInstrument = {
      ...inst,
      status: 'VALID',
      lastVerifiedDate: '2026-09-23',
      nextDueDate: '2027-09-22',
      leadSealNumber: newSeal,
      lmoOfficerBadge: currentUser.idOrBadge,
    };

    onCommitInspection(updated, newRecord);
    setActionNotice(`Instrument ${inst.id} successfully verified and stamped with Lead Seal ${newSeal}.`);
  };

  // Action: Generate Official Digital Certificate (Enabled on Pass only)
  const handleGenerateCertificate = () => {
    if (!inst || !overallPass) return;

    const today = '2026-09-23';
    const nextDueDate = '2027-09-22';
    const newSeal = inst.leadSealNumber || `SEAL-${inst.id.split('-')[1] || 'MH'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const certNumber = `CERT-LM-2026-${inst.id.split('-')[1] || 'MH'}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCertificate: DigitalCertificate = {
      certificateNumber: certNumber,
      instrumentId: inst.id,
      instrumentType: inst.type,
      makeModel: inst.makeModel,
      ownerName: inst.ownerName,
      ownerId: inst.ownerId,
      verificationDate: today,
      nextDueDate: nextDueDate,
      validityPeriod: '1 Year (Mandatory Annual Re-verification)',
      officerName: currentUser.name || 'Inspector Rajesh Sharma',
      officerBadge: currentUser.idOrBadge,
      jurisdiction: currentUser.division || 'Mumbai Central Sub-Division, Maharashtra',
      sealNumber: newSeal,
      accuracyClass: inst.accuracyClass || 'Class III (Commercial Standard)',
      capacity: inst.capacity || 'Standard Operational',
      mpeTolerance: `±${mpeLimit} grams`,
      issuedAt: new Date().toISOString(),
      qrPayload: inst.id,
    };

    const newRecord: StampingRecord = {
      id: `STP-${Date.now()}`,
      instrumentId: inst.id,
      timestamp: `${today} 11:45`,
      officerBadge: currentUser.idOrBadge,
      standardLoad,
      observedLoad,
      delta,
      mpeLimit,
      result: 'PASS',
      sealCheck: 'INTACT',
      newSealNumber: newSeal,
      notes: `Certificate Issued: ${certNumber}. Tolerance delta ${delta}g within MPE limit ${mpeLimit}g. Lead seal ${newSeal} verified intact. ${inspectionNotes || 'Digital certificate officially signed.'}`,
    };

    const updated: ScalyInstrument = {
      ...inst,
      status: 'VALID',
      lastVerifiedDate: today,
      nextDueDate: nextDueDate,
      leadSealNumber: newSeal,
      lmoOfficerBadge: currentUser.idOrBadge,
      certificate: newCertificate,
    };

    onCommitInspection(updated, newRecord);
    setActiveCertificate(newCertificate);
    setIsCertModalOpen(true);
    setActionNotice(`Official Statutory Certificate ${certNumber} successfully generated for ${inst.id}.`);
  };

  // Action: Issue Notice of Rejection
  const handleIssueRejection = () => {
    if (!inst) return;

    const newRecord: StampingRecord = {
      id: `REJ-${Date.now()}`,
      instrumentId: inst.id,
      timestamp: '2026-09-23 11:35',
      officerBadge: currentUser.idOrBadge,
      standardLoad,
      observedLoad,
      delta,
      mpeLimit,
      result: 'FAIL',
      sealCheck,
      notes: inspectionNotes || `STATUTORY NOTICE ISSUED: Unit failed permissible error margin (delta ${delta}g exceeds MPE ${mpeLimit}g) or seal compromised.`,
    };

    const updated: ScalyInstrument = {
      ...inst,
      status: sealCheck === 'DAMAGED_TAMPERED' ? 'SEAL_BROKEN' : 'REJECTED',
      lastVerifiedDate: '2026-09-23',
      lmoOfficerBadge: currentUser.idOrBadge,
      // Remove valid certificate on rejection
      certificate: undefined,
    };

    onCommitInspection(updated, newRecord);
    setActionNotice(`Statutory Notice of Rejection & Seizure issued for ${inst.id} under Section 15 & 30 of LM Act.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Officer Beat Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white">
                Officer {currentUser.name}
              </h1>
              <span className="text-[10px] font-mono bg-amber-950 border border-amber-500/50 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                {currentUser.idOrBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Legal Metrology Field Inspector • {currentUser.division}
            </p>
          </div>
        </div>

        {/* Machine Selector on Officer's Assigned Beat */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Inspecting:</span>
          <select
            value={inst?.id}
            onChange={(e) => onSelectInstrument(e.target.value)}
            className="w-full sm:w-auto p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {instruments.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} — {i.type.split(' ')[0]} ({i.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600 rounded-2xl text-emerald-200 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-emerald-400 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Historical Stamping Matrix & Machine Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Historical Stamping Matrix */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Historical Stamping Matrix</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Audit Record
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                Last Physical Lead Seal
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-mono font-extrabold text-slate-900">
                  {inst?.leadSealNumber}
                </span>
                <span className="text-[11px] text-amber-700">
                  Stamped on: {inst?.lastVerifiedDate}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Wire Placement & Tamper-Evident Guide:
              </span>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                {inst?.type.toLowerCase().includes('weighbridge')
                  ? 'Pass twisted annealed copper-lead wire through Terminal Box J2 and secure to base plate anchor bracket. Ensure embossed government logo face outward.'
                  : inst?.type.toLowerCase().includes('fuel')
                  ? 'Double-loop wire around metering unit calibrator pin #4 and locking collar. Crimp with state emblem die.'
                  : 'Thread wire through calibration access hole in under-chassis casing and crimp tight with officer pliers.'}
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-slate-100">
              <span className="text-slate-500">Statutory MPE Limit:</span>
              <span className="font-mono font-bold text-slate-900">±{inst?.mpeToleranceGrams} grams</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Pattern Approval Ref:</span>
              <span className="font-mono text-slate-700">{inst?.patternApprovalRef}</span>
            </div>
          </div>
        </div>

        {/* Machine Owner & Grievance Context */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Installation Site & Citizen Signals</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              inst?.status === 'VALID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {inst?.status}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Registered Enterprise:</span>
              <span className="font-bold text-slate-900">{inst?.ownerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Physical Location:</span>
              <span className="text-slate-700 truncate max-w-[200px]">{inst?.location}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Rated Capacity & Class:</span>
              <span className="font-semibold text-slate-800">{inst?.capacity} • {inst?.accuracyClass}</span>
            </div>

            {/* Open Grievances for this machine */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Citizen Grievance Signals ({machineGrievances.length}):
              </span>
              {machineGrievances.length > 0 ? (
                <div className="space-y-1.5">
                  {machineGrievances.map((g) => (
                    <div key={g.id} className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 text-[11px] space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{g.issueType.toUpperCase()}</span>
                        <span className="font-mono text-[10px]">{g.timestamp}</span>
                      </div>
                      <p className="text-slate-700 leading-tight">{g.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px] text-center">
                  No active citizen complaints reported against this unit.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FIELD TOLERANCE TEST FORM */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Statutory Field Tolerance Test
            </h3>
            <p className="text-[11px] text-slate-500">
              Legal Metrology (General) Rules, 2011 • Verification Testing Workstation
            </p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
            overallPass 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}>
            {overallPass ? 'VERDICT: PASS' : 'VERDICT: NON-COMPLIANT'}
          </div>
        </div>

        {/* Input Pair: Standard Test Load vs Observed Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Standard Test Load Applied (Grams / Units)
            </label>
            <input
              type="number"
              step="any"
              value={standardLoad}
              onChange={(e) => setStandardLoad(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Certified standard reference weights placed on platform
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observed Machine Reading (Grams / Units)
            </label>
            <input
              type="number"
              step="any"
              value={observedLoad}
              onChange={(e) => setObservedLoad(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Indicated numerical value on digital weight indicator
            </span>
          </div>
        </div>

        {/* REAL-TIME MPE CALCULATOR DISPLAY */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Observed Error Delta:
              </span>
              <div className="text-lg font-black font-mono text-slate-900">
                {observedLoad >= standardLoad ? `+${(observedLoad - standardLoad).toFixed(3)}` : (observedLoad - standardLoad).toFixed(3)} grams
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Prescribed Statutory MPE Limit:
              </span>
              <div className="text-lg font-black font-mono text-slate-700">
                ±{mpeLimit} grams
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Tolerance Status:
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                isTolerancePass 
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                  : 'bg-rose-100 border-rose-300 text-rose-800'
              }`}>
                {isTolerancePass ? 'WITHIN MPE LIMIT' : 'EXCEEDS MPE LIMIT'}
              </span>
            </div>
          </div>
        </div>

        {/* Physical Seal Check: "Seal Intact & Secure" vs "Seal Damaged / Tampered" */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Physical Chassis Lead Seal Inspection:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSealCheck('INTACT')}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                sealCheck === 'INTACT'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${sealCheck === 'INTACT' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs block">Seal Intact & Secure</span>
                <span className="text-[10px] opacity-80">Wire uncut, government die impression sharp.</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSealCheck('DAMAGED_TAMPERED')}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                sealCheck === 'DAMAGED_TAMPERED'
                  ? 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className={`p-2 rounded-xl ${sealCheck === 'DAMAGED_TAMPERED' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs block">Seal Damaged / Tampered</span>
                <span className="text-[10px] opacity-80">Lead sheared, missing wire, or altered calibration access.</span>
              </div>
            </button>
          </div>
        </div>

        {/* Remarks / Inspection Field Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Officer Remarks / Inspection Summary
          </label>
          <input
            type="text"
            value={inspectionNotes}
            onChange={(e) => setInspectionNotes(e.target.value)}
            placeholder="e.g. Performed 10MT test load. Corner loading deviation within limits. Stamped."
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* ACTIONS: Pass & Affix Digital Seal, Generate Certificate, or Issue Notice of Rejection */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100 flex-wrap">
          {inst?.certificate && (
            <button
              type="button"
              onClick={() => {
                setActiveCertificate(inst.certificate || null);
                setIsCertModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>View Issued Certificate</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleIssueRejection}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-rose-600 text-rose-600 hover:bg-rose-50 active:bg-rose-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Issue Notice of Rejection</span>
          </button>

          <button
            type="button"
            onClick={handlePassAndAffixSeal}
            disabled={!overallPass}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              overallPass
                ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pass & Affix Seal</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateCertificate}
            disabled={!overallPass}
            title={overallPass ? 'Generate Statutory Digital Certificate' : 'Pass tolerance and seal inspection first'}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-heading tracking-[0.02em] ${
              overallPass
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25 active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Generate Certificate</span>
          </button>
        </div>
      </div>

      {/* Digital Certificate Modal (LMO inspection view allows download & print) */}
      {isCertModalOpen && activeCertificate && (
        <DigitalCertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          certificate={activeCertificate}
          instrument={inst}
          allowDownload={true}
        />
      )}
    </div>
  );
};

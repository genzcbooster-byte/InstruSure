import React, { useState } from 'react';
import { 
  FlaskConical, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  FileCheck, 
  Scale, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  ScalyInstrument, 
  CurrentUser, 
  GATCEndorsement 
} from '../../types/scaly';

interface GATCViewProps {
  currentUser: CurrentUser;
  instruments: ScalyInstrument[];
  currentInstrument: ScalyInstrument | null;
  endorsements: GATCEndorsement[];
  onSelectInstrument: (id: string) => void;
  onOpenScanner: () => void;
  onSubmitEndorsement: (
    updatedInstrument: ScalyInstrument, 
    endorsement: GATCEndorsement
  ) => void;
}

export const GATCView: React.FC<GATCViewProps> = ({
  currentUser,
  instruments,
  currentInstrument,
  endorsements,
  onSelectInstrument,
  onOpenScanner,
  onSubmitEndorsement,
}) => {
  // Prefer pending GATC instruments or first instrument
  const pendingGATC = instruments.find(i => i.status === 'PENDING_GATC');
  const inst = currentInstrument || pendingGATC || instruments[0];

  // Bench Test Form State
  const [zeroLoadDeviation, setZeroLoadDeviation] = useState(0.001);
  const [eccentricityDeviation, setEccentricityDeviation] = useState(0.002);
  const [repeatabilityScore, setRepeatabilityScore] = useState(0.0008);
  const [ambientTemp, setAmbientTemp] = useState('23.4 °C');
  const [ambientHumidity, setAmbientHumidity] = useState('48% RH');
  const [labNotes, setLabNotes] = useState('Metrological sensitivity satisfies OIML R76 / IS 9281 standards.');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const existingEndorsements = endorsements.filter(e => e.instrumentId === inst?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inst) return;

    const certRef = `NABL-CERT-${inst.id.slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const newEndorsement: GATCEndorsement = {
      id: `GTC-${Date.now()}`,
      instrumentId: inst.id,
      labId: currentUser.idOrBadge,
      testDate: '2026-09-23',
      zeroLoadDeviation,
      eccentricityDeviation,
      repeatabilityScore,
      verdict: 'APPROVED',
      certificateRef: certRef,
      notes: labNotes,
    };

    const updatedInstrument: ScalyInstrument = {
      ...inst,
      status: 'GATC_APPROVED',
      lastVerifiedDate: '2026-09-23',
      nextDueDate: '2027-09-22',
    };

    onSubmitEndorsement(updatedInstrument, newEndorsement);
    setActionNotice(`Laboratory Endorsement & NABL Certificate ${certRef} registered for machine ${inst.id}.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Lab Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white">
                {currentUser.organization || 'National Metrology Test Lab'}
              </h1>
              <span className="text-[10px] font-mono bg-purple-950 border border-purple-500/50 text-purple-300 font-bold px-2 py-0.5 rounded-full">
                Accreditation: {currentUser.idOrBadge}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Government Approved Testing Center (GATC) • {currentUser.division}
            </p>
          </div>
        </div>

        {/* Machine Worklist Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Bench Test Unit:</span>
          <select
            value={inst?.id}
            onChange={(e) => onSelectInstrument(e.target.value)}
            className="w-full sm:w-auto p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {instruments.map((i) => (
              <option key={i.id} value={i.id}>
                {i.id} ({i.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-purple-950/80 border border-purple-600 rounded-2xl text-purple-200 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-purple-400 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TECHNICAL DNA SPECIFICATIONS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Instrument Technical DNA
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Pattern Approval Master Registry
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Manufacturer Brand</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{inst?.makeModel.split(' ')[0]}</span>
            <span className="text-[11px] text-slate-500">{inst?.makeModel}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Machine Accuracy Class</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{inst?.accuracyClass}</span>
            <span className="text-[11px] text-slate-500">Rated Range: {inst?.capacity}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">National Pattern Approval Ref</span>
            <span className="font-mono font-bold text-purple-800 text-sm mt-0.5 block">{inst?.patternApprovalRef}</span>
            <span className="text-[11px] text-slate-500">Legal Metrology Model Gazette Ref</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">OEM Factory Serial No.</span>
            <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{inst?.serialNumber}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Operating MPE Tolerance</span>
            <span className="font-mono font-bold text-slate-800 mt-0.5 block">±{inst?.mpeToleranceGrams} grams</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Installation Entity</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">{inst?.ownerName}</span>
          </div>
        </div>
      </div>

      {/* BENCH TEST FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Laboratory Calibration Bench Test Form
            </h3>
            <p className="text-[11px] text-slate-500">
              Zero-load balance, eccentricity deviation & repeatability score logging
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            ISO/IEC 17025 Compliant
          </span>
        </div>

        {/* 3 Core Metrology Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Zero-Load Balance Drift (g)
            </label>
            <input
              type="number"
              step="any"
              required
              value={zeroLoadDeviation}
              onChange={(e) => setZeroLoadDeviation(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Deviation from zero return after full scale cycle
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Eccentricity Deviation (g)
            </label>
            <input
              type="number"
              step="any"
              required
              value={eccentricityDeviation}
              onChange={(e) => setEccentricityDeviation(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Max delta across 4 corner loading positions
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Repeatability Score (σ / g)
            </label>
            <input
              type="number"
              step="any"
              required
              value={repeatabilityScore}
              onChange={(e) => setRepeatabilityScore(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Standard deviation across 10 identical loads
            </span>
          </div>
        </div>

        {/* Environmental Ambient Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Ambient Room Temperature
            </label>
            <input
              type="text"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Relative Humidity
            </label>
            <input
              type="text"
              value={ambientHumidity}
              onChange={(e) => setAmbientHumidity(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Laboratory Endorsement Remarks
          </label>
          <input
            type="text"
            value={labNotes}
            onChange={(e) => setLabNotes(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-700/20 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>Submit Laboratory Test Endorsement</span>
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, FileSpreadsheet, Lock } from 'lucide-react';
import { Instrument, InstrumentRole, LifecycleEvent } from '../types/metrochain';

interface OfficerFindingModalProps {
  isOpen: boolean;
  onClose: () => void;
  instrument: Instrument;
  role: 'lmo' | 'gatc';
  onSubmitFinding: (
    updatedInstrument: Instrument,
    newEvent: LifecycleEvent
  ) => void;
}

export const OfficerFindingModal: React.FC<OfficerFindingModalProps> = ({
  isOpen,
  onClose,
  instrument,
  role,
  onSubmitFinding,
}) => {
  const [result, setResult] = useState<'pass' | 'fail' | 'notice'>('pass');
  const [errorPercentage, setErrorPercentage] = useState<string>('0.04');
  const [sealIntact, setSealIntact] = useState<boolean>(true);
  const [newSealNumber, setNewSealNumber] = useState<string>(
    role === 'lmo'
      ? `DL-SEAL-${Math.floor(10000 + Math.random() * 90000)}-N`
      : `GATC-CAL-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [remarks, setRemarks] = useState<string>('');
  const [validityPeriodMonths, setValidityPeriodMonths] = useState<number>(12);
  const [officerName, setOfficerName] = useState<string>(
    role === 'lmo' ? 'Inspector R. K. Sharma (Badge #DL-LMO-104)' : 'Dr. Hitesh Patel, Chief Metrologist'
  );
  const [testingWeightsUsed, setTestingWeightsUsed] = useState<string>('NPL-Traceable Class M1/F2 Calibrated Test Weights');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const formattedNow = now.toISOString().split('T')[0];
    
    // Calculate new due date
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + Number(validityPeriodMonths));
    const formattedDueDate = dueDate.toISOString().split('T')[0];

    const newStatus = result === 'pass' ? 'valid' : result === 'notice' ? 'expiring' : 'revoked';

    const newCertNo = result === 'pass'
      ? `${role.toUpperCase()}-CERT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      : instrument.certificateNo;

    const eventId = `EVT-${Date.now().toString().slice(-4)}`;
    const newEvent: LifecycleEvent = {
      id: eventId,
      timestamp: `${formattedNow} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type: role === 'lmo' ? 'field_inspection' : 'gatc_test',
      title:
        result === 'pass'
          ? `${role === 'lmo' ? 'LMO Field Inspection & Stamping Passed' : 'GATC Laboratory Calibration Certified'}`
          : `${role === 'lmo' ? 'LMO Inspection Rejected / Defect Found' : 'GATC Calibration Failed Standards'}`,
      performedBy: officerName,
      role: role === 'lmo' ? 'Legal Metrology Officer' : 'GATC Testing Officer',
      location: instrument.location.siteName,
      status: result === 'pass' ? 'passed' : result === 'notice' ? 'warning' : 'failed',
      notes: remarks || (result === 'pass' ? 'Full span tolerance test passed within statutory MPE limit. Sealed with official lead stamp.' : 'Tolerance exceeded or mechanical defect observed.'),
      certificateNo: result === 'pass' ? newCertNo : undefined,
      sealNumber: result === 'pass' ? newSealNumber : undefined,
    };

    const updatedInstrument: Instrument = {
      ...instrument,
      status: newStatus,
      lastVerifiedDate: formattedNow,
      nextDueDate: result === 'pass' ? formattedDueDate : instrument.nextDueDate,
      certificateNo: newCertNo,
      leadSealNumber: result === 'pass' ? newSealNumber : instrument.leadSealNumber,
      history: [newEvent, ...instrument.history],
    };

    onSubmitFinding(updatedInstrument, newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded ${role === 'lmo' ? 'bg-blue-600/40 text-blue-300' : 'bg-amber-600/40 text-amber-300'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">
                {role === 'lmo' ? 'LMO Official Inspection Findings' : 'GATC Laboratory Calibration Record'}
              </h2>
              <p className="text-xs text-slate-300">
                Statutory Verification under Legal Metrology (General) Rules 2011
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Instrument Context Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 block">Instrument ID:</span>
              <strong className="font-mono text-slate-900">{instrument.id}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Equipment Category:</span>
              <strong className="text-slate-800">{instrument.type}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Owner / Trader:</span>
              <strong className="text-slate-800">{instrument.owner.businessName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Location:</span>
              <span className="text-slate-700 truncate block">{instrument.location.siteName}</span>
            </div>
          </div>

          {/* Officer Credentials */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inspecting Officer / Badge:
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Calibration Standards Used:
              </label>
              <input
                type="text"
                value={testingWeightsUsed}
                onChange={(e) => setTestingWeightsUsed(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              />
            </div>
          </div>

          {/* Verification Result Decision */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Official Determination:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setResult('pass')}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  result === 'pass'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold">PASS & CERTIFY</span>
                <span className="text-[10px] text-emerald-700">Within legal MPE</span>
              </button>

              <button
                type="button"
                onClick={() => setResult('notice')}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  result === 'notice'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold">PROVISIONAL / REPAIR</span>
                <span className="text-[10px] text-amber-700">7-day rectify notice</span>
              </button>

              <button
                type="button"
                onClick={() => setResult('fail')}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  result === 'fail'
                    ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-xs font-bold">FAIL & REJECT</span>
                <span className="text-[10px] text-red-700">Seals seized / Revoked</span>
              </button>
            </div>
          </div>

          {/* Technical Measurements */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Measured Deviation / Error (%):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={errorPercentage}
                  onChange={(e) => setErrorPercentage(e.target.value)}
                  placeholder="±0.04"
                  className="w-full text-xs p-2 border border-slate-300 rounded font-mono pr-8"
                  required
                />
                <span className="absolute right-2.5 top-2 text-xs text-slate-400 font-mono">%</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Max Permissible Error (MPE): ±0.1%</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Validity Granted:
              </label>
              <select
                value={validityPeriodMonths}
                onChange={(e) => setValidityPeriodMonths(Number(e.target.value))}
                className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
              >
                <option value={12}>12 Months (Standard Annual)</option>
                <option value={3}>3 Months (Quarterly for Fuel Dispensers)</option>
                <option value={24}>24 Months (Class II Laboratory Standards)</option>
                <option value={1}>1 Month (Provisional Re-test)</option>
              </select>
            </div>
          </div>

          {/* Lead Security Seal */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>Physical Security Lead/Wire Seal:</span>
              </label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    checked={sealIntact}
                    onChange={() => setSealIntact(true)}
                  />
                  <span>Intact & Crimped</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    checked={!sealIntact}
                    onChange={() => setSealIntact(false)}
                  />
                  <span className="text-red-600">Broken / Tampered</span>
                </label>
              </div>
            </div>

            {result === 'pass' && (
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  New Affixed Stamping Seal Serial Number:
                </label>
                <input
                  type="text"
                  value={newSealNumber}
                  onChange={(e) => setNewSealNumber(e.target.value)}
                  className="w-full text-xs p-1.5 border border-slate-300 rounded font-mono bg-white"
                  required
                />
              </div>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Observations & Verification Remarks:
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="E.g., Full load span tested with 20-ton calibrated iron weights. Zero load repeatability verified. Certificate sticker renewed."
              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-md shadow-sm transition-colors cursor-pointer ${
                result === 'pass'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : result === 'notice'
                  ? 'bg-amber-700 hover:bg-amber-800'
                  : 'bg-red-700 hover:bg-red-800'
              }`}
            >
              Sign & Commit Official Finding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

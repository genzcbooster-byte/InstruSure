import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { Instrument, ReVerificationApplication } from '../types/metrochain';

interface ReVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  instrument?: Instrument;
  allInstruments: Instrument[];
  onSubmitApplication: (app: ReVerificationApplication) => void;
}

export const ReVerificationModal: React.FC<ReVerificationModalProps> = ({
  isOpen,
  onClose,
  instrument,
  allInstruments,
  onSubmitApplication,
}) => {
  const [selectedInstId, setSelectedInstId] = useState<string>(
    instrument?.id || allInstruments[0]?.id || ''
  );
  const [verificationType, setVerificationType] = useState<ReVerificationApplication['verificationType']>('periodic');
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState<string>('');
  const [paymentStep, setPaymentStep] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<ReVerificationApplication | null>(null);

  if (!isOpen) return null;

  const activeInst = allInstruments.find((i) => i.id === selectedInstId) || allInstruments[0];

  // Statutory fee determination
  const calculateFee = (type: string) => {
    switch (type) {
      case 'Weighbridge':
        return 3500;
      case 'Fuel Dispenser':
        return 3200;
      case 'Precision Balance':
        return 2200;
      case 'Moisture Meter':
        return 1800;
      case 'Automatic Packaging Scale':
        return 2800;
      case 'Flow Meter':
        return 4000;
      default:
        return 450;
    }
  };

  const statutoryFee = calculateFee(activeInst?.type || '');

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep(true);
  };

  const handleFinalizeSubmission = () => {
    const appId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: ReVerificationApplication = {
      id: appId,
      instrumentId: activeInst.id,
      instrumentType: activeInst.type,
      businessName: activeInst.owner.businessName,
      appliedDate: new Date().toISOString().split('T')[0],
      preferredDate,
      verificationType,
      status: 'submitted',
      feePaid: statutoryFee,
      transactionRef: `TXN-BK-${Math.floor(100000000 + Math.random() * 900000000)}`,
      notes: notes || 'Standard periodic statutory verification requested prior to certificate expiration.',
    };

    onSubmitApplication(newApp);
    setSubmittedApp(newApp);
  };

  const handleCloseAll = () => {
    setPaymentStep(false);
    setSubmittedApp(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-base font-semibold">Apply for Statutory Re-Verification</h2>
              <p className="text-xs text-blue-200">Legal Metrology Rules 2011 · Stamping & Verification Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseAll}
            className="text-blue-200 hover:text-white p-1 rounded hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedApp ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Application Submitted & Fee Acknowledged</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your application has been routed to the District Legal Metrology Officer. An inspection officer will be assigned shortly.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Application Number:</span>
                <span className="font-mono font-bold text-slate-900">{submittedApp.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Instrument ID:</span>
                <span className="font-mono text-slate-800">{submittedApp.instrumentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Fee:</span>
                <span className="font-semibold text-emerald-700">₹{submittedApp.feePaid.toLocaleString('en-IN')} (Paid)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Challan / Ref No:</span>
                <span className="font-mono text-slate-600">{submittedApp.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-medium text-slate-800">{submittedApp.preferredDate}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseAll}
              className="w-full py-2 px-4 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Back to Business Dashboard
            </button>
          </div>
        ) : paymentStep ? (
          <div className="p-6 space-y-4">
            <div className="text-center pb-2">
              <h3 className="text-sm font-bold text-slate-900">Statutory Verification Fee Payment</h3>
              <p className="text-xs text-slate-500">Government Treasury / BharatKosh Gateway Simulation</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Instrument:</span>
                <span className="font-mono font-bold text-slate-900">{activeInst?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Category:</span>
                <span className="font-medium text-slate-800">{activeInst?.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Verification Type:</span>
                <span className="capitalize font-medium text-slate-800">{verificationType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span className="text-slate-900">Total Statutory Fee:</span>
                <span className="text-emerald-700 text-sm">₹{statutoryFee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Payment Channel:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded border border-blue-600 bg-blue-50/60 font-medium text-blue-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-700" />
                  <span>BharatKosh / UPI (Instant)</span>
                </div>
                <div className="p-2.5 rounded border border-slate-200 bg-slate-50 text-slate-600 flex items-center gap-2 opacity-75">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Treasury e-Challan</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-800">
              Note: Upon fee payment, an inspection slot will be locked and an authorized Legal Metrology Officer will be deployed with secondary calibrated test weights.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setPaymentStep(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalizeSubmission}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Authorize ₹{statutoryFee.toLocaleString('en-IN')} & Submit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-4">
            {/* Instrument Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Owned Instrument:
              </label>
              <select
                value={selectedInstId}
                onChange={(e) => setSelectedInstId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {allInstruments.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.id} · {inst.type} ({inst.location.siteName}) — Status: {inst.status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Verification Category:
              </label>
              <select
                value={verificationType}
                onChange={(e) => setVerificationType(e.target.value as ReVerificationApplication['verificationType'])}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="periodic">Periodic Mandatory Re-Verification (Annual / Quarterly)</option>
                <option value="post_repair">Post-Repair / Alteration Re-Verification</option>
                <option value="initial">Initial Verification of New Equipment</option>
              </select>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Site Inspection Date:
              </label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Specific Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Site Contact / Access Instructions:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Site engineer available between 10am-4pm. 20-ton crane on standby for weighbridge test weights."
                className="w-full text-xs p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Fee summary banner */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Statutory Verification Fee:</span>
              <span className="font-bold text-slate-900 text-sm">₹{statutoryFee.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleCloseAll}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

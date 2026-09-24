import React, { useState } from 'react';
import { QrCode, Scan, X, ArrowRight, Shield, Building2, UserCheck, Wrench, ShieldAlert } from 'lucide-react';
import { Instrument, InstrumentRole } from '../types/metrochain';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruments: Instrument[];
  onScanComplete: (instrumentId: string, role: InstrumentRole) => void;
  currentRole: InstrumentRole;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  instruments,
  onScanComplete,
  currentRole,
}) => {
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>(
    instruments[0]?.id || 'IN-DL-WB-2024-8841'
  );
  const [targetRole, setTargetRole] = useState<InstrumentRole>(currentRole);
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);

  if (!isOpen) return null;

  const selectedInst = instruments.find((i) => i.id === selectedInstrumentId) || instruments[0];

  const handleSimulateScan = () => {
    setIsScanningAnimation(true);
    setTimeout(() => {
      setIsScanningAnimation(false);
      onScanComplete(selectedInstrumentId, targetRole);
      onClose();
    }, 700);
  };

  const roleLabels: Record<InstrumentRole, { label: string; desc: string; icon: React.ReactNode }> = {
    citizen: {
      label: 'Citizen (Public)',
      desc: 'Consumer view. Privacy protected (no owner info), validity status & grievance reporting.',
      icon: <Shield className="w-4 h-4 text-sky-600" />,
    },
    business: {
      label: 'Business / Owner',
      desc: 'Owner view. Manage compliance, re-verification applications & certificate stickers.',
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
    },
    lmo: {
      label: 'LMO Officer',
      desc: 'Field inspection tool. Verify lead seals, log MPE test errors, issue/renew certificates.',
      icon: <UserCheck className="w-4 h-4 text-blue-700" />,
    },
    gatc: {
      label: 'GATC Testing Lab',
      desc: 'NABL accredited center. Calibrate standard weights, submit laboratory test curves.',
      icon: <Wrench className="w-4 h-4 text-amber-600" />,
    },
    admin: {
      label: 'State Oversight',
      desc: 'Controller of Legal Metrology. State-wide analytics, officer rosters & enforcement.',
      icon: <ShieldAlert className="w-4 h-4 text-purple-600" />,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide">Simulate Physical QR Scan</h2>
              <p className="text-xs text-slate-300">
                1 Permanent QR Code · Dynamic Role-Based Access Control (RBAC)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Scanner Optical Simulation Viewport */}
          <div className="relative bg-slate-950 rounded-lg p-6 flex flex-col items-center justify-center overflow-hidden border border-slate-800 text-center">
            {/* Viewfinder corners */}
            <div className="w-48 h-48 border-2 border-dashed border-blue-400/60 rounded-xl relative flex items-center justify-center p-3 bg-slate-900/60 shadow-inner">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />

              {/* QR Icon in center */}
              <div className="flex flex-col items-center">
                <QrCode className="w-20 h-20 text-slate-300 mb-1" />
                <span className="font-mono text-[11px] font-bold text-amber-400">
                  {selectedInst?.id}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  {selectedInst?.type}
                </span>
              </div>

              {/* Laser scanning beam */}
              {isScanningAnimation && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce" />
              )}
            </div>

            <p className="text-xs text-slate-400 mt-3 font-mono">
              [Simulating camera scan on physical Legal Metrology stamp]
            </p>
          </div>

          {/* Step 1: Select Instrument to Scan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. Choose Instrument QR to Scan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {instruments.map((inst) => {
                const isSelected = inst.id === selectedInstrumentId;
                const statusColor =
                  inst.status === 'valid'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : inst.status === 'expiring'
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-red-500 bg-red-50/50';

                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => setSelectedInstrumentId(inst.id)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? `${statusColor} ring-2 ring-blue-600`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-slate-900">{inst.id}</span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                          inst.status === 'valid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inst.status === 'expiring'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </div>
                    <div className="text-slate-700 font-medium truncate">{inst.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{inst.location.siteName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Persona / Scanning Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2. Scan As (Demonstrating RBAC View):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['citizen', 'business', 'lmo', 'gatc', 'admin'] as InstrumentRole[]).map((role) => {
                const info = roleLabels[role];
                const isSelected = targetRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-700 bg-blue-50/80 ring-2 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {info.icon}
                      <span className="text-xs font-bold text-slate-900">{info.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                      {info.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Selected: <strong className="font-mono text-slate-900">{selectedInstrumentId}</strong> as{' '}
            <strong className="text-blue-900 uppercase">{targetRole}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSimulateScan}
              disabled={isScanningAnimation}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-md shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isScanningAnimation ? 'Scanning QR...' : 'Trigger Scan & Open View'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, QrCode, ShieldCheck, CheckCircle2, Split, Database, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold">About MetroChain Concept & Architecture</h2>
              <p className="text-xs text-slate-400">
                Solving fragmented legal metrology systems with a Single QR Digital Twin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Problem Statement */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Split className="w-4 h-4 text-red-600" />
              <span>The Current Problem in India</span>
            </h3>
            <p className="text-slate-600">
              Currently, verification of weighing and measuring instruments in India is split across disconnected, siloed systems:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <strong className="block text-slate-900 font-bold mb-1">Central eMaap Portal</strong>
                <span>Holds model approval certificates and manufacturer licenses.</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <strong className="block text-slate-900 font-bold mb-1">State Metrology Portals</strong>
                <span>Handles periodic quarterly/annual re-verification fees and regional LMO beat assignments.</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <strong className="block text-slate-900 font-bold mb-1">Manual GATC Records</strong>
                <span>Paper and isolated testing certificates for precision scales and standard weights.</span>
              </div>
            </div>
          </div>

          {/* MetroChain Solution */}
          <div className="space-y-2 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-950">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>The MetroChain Solution: 1 Permanent QR = 1 Digital Identity</span>
            </h3>
            <p>
              Every instrument receives <strong>ONE permanent QR code</strong> physically affixed at manufacture or initial commissioning. The physical QR code never changes; instead, <strong>what the user sees and is permitted to do is dynamically governed by Role-Based Access Control (RBAC):</strong>
            </p>

            <ul className="space-y-1.5 pt-2 text-[11px]">
              <li className="flex items-start gap-1.5">
                <strong className="text-slate-900 min-w-[70px]">Citizen:</strong>
                <span>Scans QR at grocery counter or petrol pump. Sees validity green/yellow/red, stamp date, and one-click complaint button. <strong>Trader business/owner data is strictly withheld</strong> for consumer privacy.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <strong className="text-slate-900 min-w-[70px]">Owner:</strong>
                <span>Scans or logs in to manage compliance, track due dates, and apply for statutory re-verification with fee payment.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <strong className="text-slate-900 min-w-[70px]">LMO Officer:</strong>
                <span>Scans QR in the field to open the active inspection case, enter MPE tolerance check, crimp lead seal, and issue/renew certificates.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <strong className="text-slate-900 min-w-[70px]">GATC Lab:</strong>
                <span>Accesses precision calibration history, submits NABL-traceable lab calibration certificates.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <strong className="text-slate-900 min-w-[70px]">Admin:</strong>
                <span>State controller monitors real-time compliance %, officer workload, and consumer grievance SLAs.</span>
              </li>
            </ul>
          </div>

          {/* Architecture note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
            <strong>Hackathon Architecture Note:</strong> In production, MetroChain serves as the cryptographic state layer indexing eMaap APIs and state databases. In this interactive prototype, state is managed in-memory with live mutations so you can test the full end-to-end flow across all 5 roles.
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            Close & Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

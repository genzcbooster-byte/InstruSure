import React, { useState } from 'react';
import { 
  Wrench, 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  Scan, 
  ChevronRight, 
  FileSpreadsheet,
  Award,
  Layers,
  Activity
} from 'lucide-react';
import { Instrument, LifecycleEvent } from '../../types/metrochain';
import { StatusBadge } from '../StatusBadge';
import { InstrumentDetailView } from '../InstrumentDetailView';
import { OfficerFindingModal } from '../OfficerFindingModal';

interface GATCViewProps {
  instruments: Instrument[];
  selectedInstrumentId?: string;
  onSelectInstrument: (id: string) => void;
  onOpenScanner: () => void;
  onUpdateInstrument: (instrument: Instrument, event: LifecycleEvent) => void;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

export const GATCView: React.FC<GATCViewProps> = ({
  instruments,
  selectedInstrumentId,
  onSelectInstrument,
  onOpenScanner,
  onUpdateInstrument,
  activeSection = 'queue',
  onSelectSection,
}) => {
  const [findingModalOpen, setFindingModalOpen] = useState(false);
  const [targetInst, setTargetInst] = useState<Instrument | null>(null);

  const activeInstrument = instruments.find((i) => i.id === selectedInstrumentId);

  // Filter instruments that have GATC assignment or are high precision
  const gatcQueue = instruments.filter(
    (i) => i.assignedGATC || i.accuracyClass === 'Class II' || i.accuracyClass === 'Class I' || i.type === 'Moisture Meter' || i.type === 'Flow Meter'
  );

  const handleOpenTest = (inst: Instrument) => {
    setTargetInst(inst);
    setFindingModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {activeInstrument ? (
        <>
          <InstrumentDetailView
            instrument={activeInstrument}
            role="gatc"
            onBack={() => onSelectInstrument('')}
            onOpenComplaintModal={() => {}}
            onOpenReVerificationModal={() => {}}
            onOpenFindingModal={() => handleOpenTest(activeInstrument)}
          />

          {findingModalOpen && (
            <OfficerFindingModal
              isOpen={findingModalOpen}
              onClose={() => setFindingModalOpen(false)}
              instrument={activeInstrument}
              role="gatc"
              onSubmitFinding={(updated, event) => {
                onUpdateInstrument(updated, event);
                setFindingModalOpen(false);
              }}
            />
          )}
        </>
      ) : (
        <>
          {/* Header */}
          <div className="bg-amber-950 text-white p-6 rounded-2xl border border-amber-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 bg-amber-800/40 border border-amber-600/40 text-amber-300 px-2.5 py-0.5 rounded text-xs font-semibold">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>NABL Accredited Testing Laboratory · GATC Hub</span>
              </div>
              <h1 className="text-xl font-bold">
                Govt. Approved Test Centre (GATC) Calibration Portal
              </h1>
              <p className="text-xs text-amber-200">
                Primary & Secondary standards calibration traceable to National Physical Laboratory (NPL India).
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenScanner}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Lab Intake QR</span>
            </button>
          </div>

          {/* GATC Queue */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Assigned Testing & Calibration Worklist
                </h2>
                <p className="text-xs text-slate-500">
                  Instruments undergoing Class I/II verification, chemical moisture testing, or bulk meter calibration
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                {gatcQueue.length} Active Lab Test Cases
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {gatcQueue.map((inst) => (
                <div
                  key={inst.id}
                  className="bg-slate-50 border border-slate-200 hover:border-amber-300 rounded-xl p-5 transition-all shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{inst.id}</span>
                    <StatusBadge status={inst.status} size="sm" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{inst.name}</h3>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Class: <strong className="text-slate-900">{inst.accuracyClass}</strong> · Capacity: {inst.capacity}
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-slate-200 text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Owner / Mandate:</span>
                      <strong className="text-slate-800">{inst.owner.businessName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Assigned Lab:</span>
                      <span className="text-slate-700 truncate max-w-xs">{inst.assignedGATC || 'National Calibration Center'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Certificate:</span>
                      <span className="font-mono text-slate-800">{inst.certificateNo}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => onSelectInstrument(inst.id)}
                      className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-200 rounded font-medium cursor-pointer"
                    >
                      Audit Trail
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenTest(inst)}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Submit Lab Test Results</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Testing Findings Modal */}
      {findingModalOpen && targetInst && (
        <OfficerFindingModal
          isOpen={findingModalOpen}
          onClose={() => setFindingModalOpen(false)}
          instrument={targetInst}
          role="gatc"
          onSubmitFinding={(updated, event) => {
            onUpdateInstrument(updated, event);
            setFindingModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

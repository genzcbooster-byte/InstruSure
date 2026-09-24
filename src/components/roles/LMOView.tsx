import React, { useState } from 'react';
import { 
  UserCheck, 
  Scan, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck2, 
  Lock, 
  ChevronRight,
  ClipboardList,
  Search,
  Filter
} from 'lucide-react';
import { Instrument, CitizenComplaint, ReVerificationApplication, LifecycleEvent } from '../../types/metrochain';
import { StatusBadge } from '../StatusBadge';
import { InstrumentDetailView } from '../InstrumentDetailView';
import { OfficerFindingModal } from '../OfficerFindingModal';

interface LMOViewProps {
  instruments: Instrument[];
  complaints: CitizenComplaint[];
  applications: ReVerificationApplication[];
  selectedInstrumentId?: string;
  onSelectInstrument: (id: string) => void;
  onOpenScanner: () => void;
  onUpdateInstrument: (instrument: Instrument, event: LifecycleEvent) => void;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

export const LMOView: React.FC<LMOViewProps> = ({
  instruments,
  complaints,
  applications,
  selectedInstrumentId,
  onSelectInstrument,
  onOpenScanner,
  onUpdateInstrument,
  activeSection,
  onSelectSection,
}) => {
  const [findingModalOpen, setFindingModalOpen] = useState(false);
  const [activeInstForFinding, setActiveInstForFinding] = useState<Instrument | null>(null);
  const [internalTab, setInternalTab] = useState<'assigned' | 'complaints' | 'all'>('assigned');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTab = (activeSection as 'assigned' | 'complaints' | 'all') || internalTab;

  const handleTabChange = (tab: 'assigned' | 'complaints' | 'all') => {
    setInternalTab(tab);
    if (onSelectSection) onSelectSection(tab);
  };

  const activeInstrument = instruments.find((i) => i.id === selectedInstrumentId);

  // Inspector profile simulation
  const inspectorName = 'Inspector R. K. Sharma';
  const badgeNo = 'DL-LMO-104';
  const beat = 'Delhi South-East Zone & Okhla Industrial Estate';

  const handleOpenFinding = (inst: Instrument) => {
    setActiveInstForFinding(inst);
    setFindingModalOpen(true);
  };

  const assignedInstruments = instruments.filter(
    (i) => i.assignedLMO.includes('Sharma') || i.status === 'expiring' || i.status === 'expired'
  );

  return (
    <div className="space-y-6">
      {activeInstrument ? (
        <>
          <InstrumentDetailView
            instrument={activeInstrument}
            role="lmo"
            onBack={() => onSelectInstrument('')}
            onOpenComplaintModal={() => {}}
            onOpenReVerificationModal={() => {}}
            onOpenFindingModal={() => handleOpenFinding(activeInstrument)}
          />

          {findingModalOpen && (
            <OfficerFindingModal
              isOpen={findingModalOpen}
              onClose={() => setFindingModalOpen(false)}
              instrument={activeInstrument}
              role="lmo"
              onSubmitFinding={(updated, event) => {
                onUpdateInstrument(updated, event);
                setFindingModalOpen(false);
              }}
            />
          )}
        </>
      ) : (
        <>
          {/* LMO Field Header */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 bg-blue-600/30 border border-blue-400/30 text-blue-300 px-2.5 py-0.5 rounded text-xs font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Field Enforcement Portal · {badgeNo}</span>
              </div>
              <h1 className="text-xl font-bold">
                {inspectorName} · Field Officer Desk
              </h1>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Jurisdiction: {beat}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenScanner}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Scan QR on Scale in Field</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTabChange('assigned')}
                className={`pb-3 text-xs font-bold transition-colors cursor-pointer relative ${
                  activeTab === 'assigned'
                    ? 'text-blue-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Assigned Inspection Beat ({assignedInstruments.length})</span>
                {activeTab === 'assigned' && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-900" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('complaints')}
                className={`pb-3 text-xs font-bold transition-colors cursor-pointer relative ml-4 ${
                  activeTab === 'complaints'
                    ? 'text-blue-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>Consumer Grievance Cases</span>
                  <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full text-[10px]">
                    {complaints.length}
                  </span>
                </div>
                {activeTab === 'complaints' && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-900" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`pb-3 text-xs font-bold transition-colors cursor-pointer relative ml-4 ${
                  activeTab === 'all'
                    ? 'text-blue-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>State Registry Search ({instruments.length})</span>
                {activeTab === 'all' && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-900" />
                )}
              </button>
            </div>

            <div className="pb-2">
              <input
                type="text"
                placeholder="Filter by ID or site..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-md bg-white w-48"
              />
            </div>
          </div>

          {/* Assigned Roster */}
          {activeTab === 'assigned' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between text-xs text-blue-900">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    Priority field inspection list based on statutory re-verification due dates and commercial verification applications.
                  </span>
                </div>
                <span className="font-semibold text-blue-950 whitespace-nowrap">
                  {assignedInstruments.length} Units Scheduled
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedInstruments
                  .filter((inst) =>
                    inst.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    inst.location.siteName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((inst) => (
                    <div
                      key={inst.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {inst.id}
                        </span>
                        <StatusBadge status={inst.status} size="sm" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{inst.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {inst.owner.businessName} · Contact: {inst.owner.contactPhone}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded p-2.5 text-xs text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Installation Site:</span>
                          <span className="font-medium text-slate-800 truncate max-w-xs">{inst.location.siteName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Lead Seal:</span>
                          <span className="font-mono text-slate-900">{inst.leadSealNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Due:</span>
                          <span className="font-semibold text-slate-900">{inst.nextDueDate}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => onSelectInstrument(inst.id)}
                          className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded font-medium cursor-pointer"
                        >
                          View History
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenFinding(inst)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Log Field Finding</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map((comp) => {
                  const target = instruments.find((i) => i.id === comp.instrumentId);
                  return (
                    <div
                      key={comp.id}
                      className="bg-white border border-red-200 rounded-xl p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {comp.id}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          {comp.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-800 block capitalize">
                          Issue: {comp.complaintType.replace('_', ' ')}
                        </span>
                        <p className="text-xs text-slate-600 mt-1 italic">
                          "{comp.description}"
                        </p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded text-xs space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>Target Equipment:</span>
                          <strong className="font-mono text-slate-900">{comp.instrumentId}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="truncate max-w-xs">{comp.siteName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Citizen:</span>
                          <span>{comp.citizenName} ({comp.citizenPhone || 'No phone'})</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                        {target && (
                          <button
                            type="button"
                            onClick={() => handleOpenFinding(target)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded cursor-pointer flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Conduct Spot Audit</span>
                          </button>
                        )}
                        {target && (
                          <button
                            type="button"
                            onClick={() => onSelectInstrument(target.id)}
                            className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium cursor-pointer"
                          >
                            Inspect Twin
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Registry Tab */}
          {activeTab === 'all' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">Instrument ID & Name</th>
                    <th className="py-3 px-4">Trader / Business</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Officer</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {instruments
                    .filter((inst) =>
                      inst.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      inst.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((inst) => (
                      <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{inst.id}</span>
                          <span className="text-slate-700">{inst.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800 block">{inst.owner.businessName}</span>
                          <span className="text-[11px] text-slate-500">{inst.location.district}</span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={inst.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {inst.assignedLMO}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenFinding(inst)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectInstrument(inst.id)}
                            className="px-2.5 py-1 text-xs text-white bg-slate-900 hover:bg-slate-800 rounded font-medium cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Standalone Officer Finding Modal */}
      {findingModalOpen && activeInstForFinding && (
        <OfficerFindingModal
          isOpen={findingModalOpen}
          onClose={() => setFindingModalOpen(false)}
          instrument={activeInstForFinding}
          role="lmo"
          onSubmitFinding={(updated, event) => {
            onUpdateInstrument(updated, event);
            setFindingModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Calendar, 
  Lock, 
  FileText, 
  ArrowLeft, 
  AlertTriangle,
  Building,
  CheckCircle2,
  XCircle,
  EyeOff,
  UserCheck,
  Wrench,
  Sparkles,
  Printer
} from 'lucide-react';
import { Instrument, InstrumentRole, LifecycleEvent } from '../types/metrochain';
import { StatusBadge } from './StatusBadge';
import { QRCodeDisplay } from './QRCodeDisplay';

interface InstrumentDetailViewProps {
  instrument: Instrument;
  role: InstrumentRole;
  onBack?: () => void;
  onOpenComplaintModal: () => void;
  onOpenReVerificationModal: () => void;
  onOpenFindingModal: (mode: 'lmo' | 'gatc') => void;
}

export const InstrumentDetailView: React.FC<InstrumentDetailViewProps> = ({
  instrument,
  role,
  onBack,
  onOpenComplaintModal,
  onOpenReVerificationModal,
  onOpenFindingModal,
}) => {
  const isCitizen = role === 'citizen';
  const isBusiness = role === 'business';
  const isLMO = role === 'lmo';
  const isGATC = role === 'gatc';
  const isAdmin = role === 'admin';

  // Calculate days remaining or days expired
  const today = new Date();
  const dueDate = new Date(instrument.nextDueDate);
  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          )}
          <span className="text-xs text-slate-400">/</span>
          <span className="font-mono text-xs font-bold text-slate-700">{instrument.id}</span>
        </div>

        {/* Active Role Indicator */}
        <div className="text-xs flex items-center gap-1.5">
          <span className="text-slate-500">Access View:</span>
          <span className="font-bold text-blue-900 uppercase bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
            {role === 'citizen' ? 'Citizen (Public No-Login)' : `${role.toUpperCase()} Authority`}
          </span>
        </div>
      </div>

      {/* Main Identity Banner Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top ribbon indicating validity */}
        <div
          className={`h-2 ${
            instrument.status === 'valid'
              ? 'bg-emerald-600'
              : instrument.status === 'expiring'
              ? 'bg-amber-500'
              : 'bg-red-600'
          }`}
        />

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Left side: Identity & Status */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={instrument.status} size="lg" />
                <span className="text-xs text-slate-500">
                  {diffDays > 0
                    ? `· Next verification due in ${diffDays} days`
                    : `· Stamping expired ${Math.abs(diffDays)} days ago`}
                </span>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {instrument.name}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Legal Metrology Category: <strong className="text-slate-800">{instrument.type}</strong> · Model: {instrument.modelNumber}
                </p>
              </div>

              {/* Citizen View Privacy Alert & Submit Complaint Callout */}
              {isCitizen ? (
                <div className="space-y-2.5">
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 flex items-start gap-2.5">
                    <EyeOff className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Citizen Public Verification Mode</strong>
                      <span>
                        Per Legal Metrology public registry guidelines, owner identity and commercial business metrics are redacted to protect trader privacy while ensuring full consumer verification transparency.
                      </span>
                    </div>
                  </div>

                  <div className="bg-red-50/80 border border-red-200 rounded-lg p-3.5 text-xs text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <strong className="font-semibold block text-red-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>Suspect short-weight or tampering on this device?</span>
                      </strong>
                      <span className="text-slate-600 text-[11px]">
                        Lodge an official consumer grievance. Your report will be logged and routed to the State Admin & Beat Inspector.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenComplaintModal}
                      className="px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-md shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Submit Complaint</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-wrap gap-x-6 gap-y-1 text-slate-700">
                  <div>
                    <span className="text-slate-500">Owner Entity:</span>{' '}
                    <strong className="text-slate-900">{instrument.owner.businessName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Proprietor:</span>{' '}
                    <span>{instrument.owner.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">GSTIN:</span>{' '}
                    <span className="font-mono">{instrument.owner.gstinOrReg}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>{' '}
                    <span>{instrument.owner.contactPhone}</span>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {instrument.location.siteName}, {instrument.location.address} ({instrument.location.district}, {instrument.location.state})
                </span>
              </div>

              {/* Key Verification Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                  <span className="text-[11px] text-slate-500 block">Instrument ID</span>
                  <span className="font-mono text-xs font-bold text-blue-950 select-all">{instrument.id}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                  <span className="text-[11px] text-slate-500 block">Certificate No.</span>
                  <span className="font-mono text-xs font-semibold text-slate-900">{instrument.certificateNo}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                  <span className="text-[11px] text-slate-500 block">Last Verified</span>
                  <span className="text-xs font-semibold text-slate-900">{instrument.lastVerifiedDate}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
                  <span className="text-[11px] text-slate-500 block">Valid Till</span>
                  <span className="text-xs font-bold text-slate-900">{instrument.nextDueDate}</span>
                </div>
              </div>
            </div>

            {/* Right side: QR Display */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
              <QRCodeDisplay instrument={instrument} size={150} />
              <span className="text-[10px] text-slate-500 mt-2 font-mono">1 Permanent QR · Multi-Role</span>
            </div>
          </div>

          {/* Action Bar based on RBAC Role */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Lead Security Stamp: <strong className="font-mono text-slate-900">{instrument.leadSealNumber}</strong> · 
              Assigned Authority: <span className="text-slate-800">{instrument.assignedLMO}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Citizen Action */}
              {isCitizen && (
                <button
                  type="button"
                  onClick={onOpenComplaintModal}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Submit Complaint</span>
                </button>
              )}

              {/* Business Owner Actions */}
              {isBusiness && (
                <>
                  <button
                    type="button"
                    onClick={onOpenReVerificationModal}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Apply for Re-Verification</span>
                  </button>
                </>
              )}

              {/* LMO Officer Actions */}
              {(isLMO || isAdmin) && (
                <button
                  type="button"
                  onClick={() => onOpenFindingModal('lmo')}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Conduct Field Inspection & Stamping</span>
                </button>
              )}

              {/* GATC Officer Actions */}
              {(isGATC || isAdmin) && (
                <button
                  type="button"
                  onClick={() => onOpenFindingModal('gatc')}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Log GATC Laboratory Test</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Technical Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Statutory Specifications</span>
          </h2>

          <div className="text-xs space-y-2.5 divide-y divide-slate-100">
            <div className="pt-1 flex justify-between">
              <span className="text-slate-500">Max Capacity:</span>
              <strong className="text-slate-900">{instrument.capacity}</strong>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500">Accuracy Class:</span>
              <strong className="text-slate-900">{instrument.accuracyClass}</strong>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500">Manufacturer:</span>
              <span className="text-slate-800 text-right">{instrument.manufacturer}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-slate-500">Serial Number:</span>
              <span className="font-mono text-slate-900">{instrument.serialNumber}</span>
            </div>

            {Object.entries(instrument.specifications).map(([key, val]) => (
              <div key={key} className="pt-2 flex justify-between">
                <span className="text-slate-500">{key}:</span>
                <span className="text-slate-800 text-right font-medium">{val}</span>
              </div>
            ))}
          </div>

          {!isCitizen && instrument.assignedGATC && (
            <div className="pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-500 block mb-0.5">Accredited Testing Lab:</span>
              <span className="font-medium text-slate-800">{instrument.assignedGATC}</span>
            </div>
          )}
        </div>

        {/* Right 2 columns: Interactive Lifecycle Timeline */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>Digital Twin Lifecycle & Chain of Custody</span>
            </h2>
            <span className="text-[11px] text-slate-500">
              {instrument.history.length} Verified Milestones
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 pt-2">
            {instrument.history.map((event, idx) => {
              const isPassed = event.status === 'passed';
              const isWarning = event.status === 'warning';
              const isFailed = event.status === 'failed';

              return (
                <div key={event.id} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white ${
                      isPassed
                        ? 'border-emerald-600 ring-4 ring-emerald-50'
                        : isWarning
                        ? 'border-amber-500 ring-4 ring-amber-50'
                        : isFailed
                        ? 'border-red-600 ring-4 ring-red-50'
                        : 'border-blue-600 ring-4 ring-blue-50'
                    }`}
                  />

                  <div className="bg-slate-50 hover:bg-slate-100/80 rounded-lg p-3.5 border border-slate-200 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <h3 className="text-xs font-bold text-slate-900">{event.title}</h3>
                      <span className="text-[11px] text-slate-500 font-mono">{event.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 mb-2 leading-relaxed">
                      {event.notes}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-200/70">
                      <div>
                        <span>Officer:</span> <strong className="text-slate-800">{event.performedBy}</strong>
                      </div>
                      <div>
                        <span>Role:</span> <span>{event.role}</span>
                      </div>
                      {event.certificateNo && (
                        <div>
                          <span>Cert:</span> <strong className="font-mono text-blue-900">{event.certificateNo}</strong>
                        </div>
                      )}
                      {event.sealNumber && (
                        <div>
                          <span>Seal:</span> <strong className="font-mono text-slate-800">{event.sealNumber}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

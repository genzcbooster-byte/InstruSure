import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scan, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  FileWarning, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Scale,
  Upload,
  Clock,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { Instrument, CitizenComplaint } from '../../types/metrochain';
import { StatusBadge } from '../StatusBadge';
import { InstrumentDetailView } from '../InstrumentDetailView';
import { CitizenComplaintModal } from '../CitizenComplaintModal';

interface CitizenViewProps {
  instruments: Instrument[];
  onOpenScanner: () => void;
  onSubmitComplaint: (complaint: CitizenComplaint) => void;
  selectedInstrumentId?: string;
  onSelectInstrument: (id: string) => void;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

export const CitizenView: React.FC<CitizenViewProps> = ({
  instruments,
  onOpenScanner,
  onSubmitComplaint,
  selectedInstrumentId,
  onSelectInstrument,
  activeSection = 'verify',
  onSelectSection,
}) => {
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Standalone complaint form states
  const [targetInstrumentId, setTargetInstrumentId] = useState(
    selectedInstrumentId || instruments[0]?.id || ''
  );
  const [complaintType, setComplaintType] = useState<CitizenComplaint['complaintType']>('underweight');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [standaloneSubmittedId, setStandaloneSubmittedId] = useState<string | null>(null);

  const activeInstrument = instruments.find((i) => i.id === selectedInstrumentId);

  const filteredInstruments = instruments.filter(
    (i) =>
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.location.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStandaloneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = instruments.find((i) => i.id === targetInstrumentId) || instruments[0];
    const newId = `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComp: CitizenComplaint = {
      id: newId,
      instrumentId: target.id,
      instrumentType: target.type,
      siteName: target.location.siteName,
      district: target.location.district,
      reportedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      complaintType,
      description: description || 'Reported discrepancy during commercial transaction.',
      citizenName: citizenName || 'Anonymous Citizen',
      citizenPhone: citizenPhone || undefined,
      citizenEmail: citizenEmail || undefined,
      status: 'pending',
    };

    onSubmitComplaint(newComp);
    setStandaloneSubmittedId(newId);
  };

  return (
    <div className="space-y-6">
      {/* If an instrument is currently inspected, show its detail view */}
      {activeInstrument ? (
        <>
          <InstrumentDetailView
            instrument={activeInstrument}
            role="citizen"
            onBack={() => onSelectInstrument('')}
            onOpenComplaintModal={() => setComplaintModalOpen(true)}
            onOpenReVerificationModal={() => {}}
            onOpenFindingModal={() => {}}
          />

          <CitizenComplaintModal
            isOpen={complaintModalOpen}
            onClose={() => setComplaintModalOpen(false)}
            instrument={activeInstrument}
            onSubmitComplaint={onSubmitComplaint}
          />
        </>
      ) : activeSection === 'complaint' ? (
        /* Standalone Submit Complaint Page */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-red-950 text-white p-6 border-b border-red-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-900/60 border border-red-700/50 flex items-center justify-center text-red-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Lodge Legal Metrology Complaint</h1>
                <p className="text-xs text-red-200">
                  Direct submission to the State Directorate & Legal Metrology Field Officers
                </p>
              </div>
            </div>
            <span className="text-[11px] bg-red-900 text-red-100 font-semibold px-2.5 py-1 rounded">
              Sec. 15 LM Act 2009
            </span>
          </div>

          {standaloneSubmittedId ? (
            <div className="p-8 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Complaint Registered Successfully</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Your grievance has been logged onto the state enforcement register and will be investigated by the assigned Legal Metrology Officer.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm">
                <span className="text-slate-500 block text-xs">Tracking Grievance ID:</span>
                <strong className="text-slate-900 text-lg">{standaloneSubmittedId}</strong>
              </div>
              <div className="text-xs text-slate-500">
                You will receive investigation updates via SMS/Email. The inspection report will be reviewed by the State Controller.
              </div>
              <button
                type="button"
                onClick={() => {
                  setStandaloneSubmittedId(null);
                  setDescription('');
                  setCitizenName('');
                  setCitizenPhone('');
                  setCitizenEmail('');
                  if (onSelectSection) onSelectSection('verify');
                }}
                className="py-2.5 px-6 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Return to Instrument Verification
              </button>
            </div>
          ) : (
            <form onSubmit={handleStandaloneSubmit} className="p-6 space-y-5 max-w-2xl mx-auto">
              {/* Instrument Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Target Instrument to Report <span className="text-red-600">*</span>
                </label>
                <select
                  value={targetInstrumentId}
                  onChange={(e) => setTargetInstrumentId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                  required
                >
                  {instruments.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.id} — {i.name} ({i.location.siteName}, {i.location.district})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Or scan the physical QR code on the equipment to automatically link this complaint.
                </p>
              </div>

              {/* Complaint Category */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Nature of Irregularity <span className="text-red-600">*</span>
                </label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value as CitizenComplaint['complaintType'])}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  <option value="underweight">Underweight / Short Measure (Delivered less than billed)</option>
                  <option value="tampered_seal">Tampered / Broken Lead Stamping Wire Seal</option>
                  <option value="expired_verification">Expired Verification Certificate Sticker</option>
                  <option value="refused_receipt">Refusal by Merchant to Produce Stamping Certificate</option>
                  <option value="faulty_display">Unstable / Obstructed Customer Display</option>
                </select>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Detailed Observation / Incident Notes <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what occurred (e.g. Billed for 10 kg, home scale showed 8.8 kg. Merchant refused to zero the machine, or seal was snipped)."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              {/* Citizen Contact Information (Visible to Admin & LMO) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-900" />
                  <h3 className="text-xs font-bold text-slate-900">
                    Complainant Contact Information (Logged for Official Verification)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sunita Verma"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98XXX XXXXX"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="sunita@example.com"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-red-600"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Your identity is kept confidential from the merchant. Contact info is exclusively shared with the investigating Legal Metrology Officer and State Admin.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => onSelectSection && onSelectSection('verify')}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : activeSection === 'rights' ? (
        /* Consumer Rights Section */
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                Statutory Guidelines
              </span>
              <h1 className="text-xl font-bold">Consumer Rights & Legal Metrology Standards</h1>
              <p className="text-xs text-slate-300">
                What every citizen in India is entitled to under the Legal Metrology Act 2009
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectSection && onSelectSection('complaint')}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Submit Complaint</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Mandatory Lead Seal Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every commercial weighing machine must have an official lead wire seal with the government verification stamp. If the wire is cut, twisted open, or missing, the machine cannot legally be used for trade.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Right to Inspect Stamping Certificate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                By law, any trader must produce their official Legal Metrology Verification Certificate upon request by a consumer. The certificate contains the valid date, serial number, and Inspector's signature.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">5-Litre Fuel Test at Petrol Pumps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every petrol pump in India is legally mandated to maintain a calibrated 5-litre conical brass or stainless steel measure. If you suspect short-fuelling, you can request an immediate on-the-spot 5L test.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Net Quantity & Zero Tare Protection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cardboard sweet boxes, heavy plastic packaging, and containers cannot be weighed along with the product. The scale must be tared (zeroed) with the container before adding goods.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Default Verify Section */
        <>
          {/* Hero Banner for Citizens */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-800/80 border border-blue-600/40 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Legal Metrology Consumer Verification Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Scan Any Commercial Scale or Meter to Check Legal Verification
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Under the Legal Metrology Act 2009, all commercial weighing and measuring instruments in India must bear a valid government verification certificate and lead seal. Scan the QR code pasted on the equipment to immediately verify its validity.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Scan className="w-4 h-4 text-slate-950" />
                  <span>Simulate QR Scan (Any Device)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSection && onSelectSection('complaint')}
                  className="px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </button>
              </div>
            </div>

            {/* Decorative background grid */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          </div>

          {/* Quick Search & Public Verified Instruments Registry */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Select a Sample Instrument to Test Citizen Scan
                </h2>
                <p className="text-xs text-slate-500">
                  Click any verified instrument below to view the citizen-facing verification certificate
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by ID, scale type, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {filteredInstruments.map((inst) => (
                <div
                  key={inst.id}
                  onClick={() => onSelectInstrument(inst.id)}
                  className="bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-400 rounded-xl p-4 transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-900">
                        {inst.id}
                      </span>
                      <StatusBadge status={inst.status} size="sm" />
                    </div>

                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {inst.name}
                    </h3>

                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <div>Category: <strong className="text-slate-700">{inst.type}</strong></div>
                      <div>Location: <span className="text-slate-700">{inst.location.siteName}, {inst.location.district}</span></div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-800">
                    <span>Inspect Public Stamp</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

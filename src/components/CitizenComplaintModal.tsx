import React, { useState } from 'react';
import { X, AlertCircle, ShieldAlert, CheckCircle2, Upload, MapPin } from 'lucide-react';
import { Instrument, CitizenComplaint } from '../types/metrochain';

interface CitizenComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  instrument: Instrument;
  onSubmitComplaint: (complaint: CitizenComplaint) => void;
}

export const CitizenComplaintModal: React.FC<CitizenComplaintModalProps> = ({
  isOpen,
  onClose,
  instrument,
  onSubmitComplaint,
}) => {
  const [complaintType, setComplaintType] = useState<CitizenComplaint['complaintType']>('underweight');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: CitizenComplaint = {
      id: newId,
      instrumentId: instrument.id,
      instrumentType: instrument.type,
      siteName: instrument.location.siteName,
      district: instrument.location.district,
      reportedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      complaintType,
      description: description || 'Citizen reported potential inaccuracy during commercial transaction.',
      citizenName: citizenName || 'Anonymous Citizen',
      citizenPhone: citizenPhone || undefined,
      citizenEmail: citizenEmail || undefined,
      status: 'pending',
    };

    onSubmitComplaint(newComplaint);
    setSubmittedId(newId);
  };

  const handleReset = () => {
    setSubmittedId(null);
    setDescription('');
    setCitizenName('');
    setCitizenPhone('');
    setCitizenEmail('');
    setHasPhoto(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-200" />
            <div>
              <h2 className="text-base font-semibold">Lodge Legal Metrology Grievance</h2>
              <p className="text-xs text-red-200">Legal Metrology Act 2009 · Section 15 Consumer Redressal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-red-200 hover:text-white p-1 rounded hover:bg-red-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Complaint Registered Successfully</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your grievance has been securely hashed into the state enforcement ledger and dispatched to the local Legal Metrology Inspector.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-sm">
              <span className="text-slate-500 block text-xs">Tracking Grievance ID:</span>
              <strong className="text-slate-900 text-base">{submittedId}</strong>
            </div>
            <div className="text-xs text-slate-500">
              Assigned beat inspector will conduct a surprise verification audit within 48 hours.
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2 px-4 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Instrument Context (No Owner Name exposed) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Instrument:</span>
                <span className="font-mono font-bold text-slate-900">{instrument.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{instrument.type}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 pt-1 border-t border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{instrument.location.siteName}, {instrument.location.district}</span>
              </div>
            </div>

            {/* Complaint Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nature of Irregularity <span className="text-red-500">*</span>
              </label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value as CitizenComplaint['complaintType'])}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="underweight">Underweight / Short Measure (Delivered less than billed)</option>
                <option value="tampered_seal">Tampered / Missing Official Lead Stamping Seal</option>
                <option value="expired_verification">Expired Verification Certificate Sticker</option>
                <option value="refused_receipt">Refusal by Merchant to Produce Stamping Certificate</option>
                <option value="faulty_display">Unstable / Obstructed Customer Display</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Observation <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Weighed 5 kg rice, verified at home as 4.4 kg. Vendor refused to tare container."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* Optional Photo Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evidence Photo (Optional)
              </label>
              <div
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors ${
                  hasPhoto ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs">
                  <Upload className={`w-4 h-4 ${hasPhoto ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className={hasPhoto ? 'font-semibold text-emerald-800' : 'text-slate-600'}>
                    {hasPhoto ? 'Photo Attached (bill_photo_receipt.jpg - 1.2 MB)' : 'Click to simulate attaching receipt / scale photo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-800">
                Contact Information (For Investigation Updates & Admin Verification)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="citizen@example.com"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-amber-50 p-2.5 rounded border border-amber-200 text-[11px] text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Complaints are logged onto the public compliance ledger and visible to State Admin & Legal Metrology Inspectors for immediate enforcement.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Submit Complaint</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

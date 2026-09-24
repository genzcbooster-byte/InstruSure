import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Building2, 
  Scale, 
  Calendar, 
  UserCheck, 
  Lock, 
  Hash, 
  Clock 
} from 'lucide-react';
import { DigitalCertificate, ScalyInstrument } from '../types/scaly';

interface DigitalCertificateDocumentProps {
  certificate: DigitalCertificate;
  instrument?: ScalyInstrument;
  id?: string;
  isThumbnail?: boolean;
}

export const DigitalCertificateDocument: React.FC<DigitalCertificateDocumentProps> = ({
  certificate,
  instrument,
  id = 'scaly-digital-certificate',
  isThumbnail = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const payload = certificate.qrPayload || certificate.instrumentId;
    QRCode.toDataURL(
      payload,
      {
        width: isThumbnail ? 100 : 220,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [certificate, isThumbnail]);

  if (isThumbnail) {
    return (
      <div 
        id={id}
        className="w-full bg-[#fefdfb] border-2 border-amber-600/60 rounded-xl p-3 text-[#0f172a] shadow-xs select-none pointer-events-none relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
        
        {/* Miniature Certificate Header */}
        <div className="text-center space-y-0.5 border-b border-amber-700/30 pb-2 mb-2">
          <div className="flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-900 font-heading">
              Govt. of India • Legal Metrology
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-tight text-blue-950 font-heading">
            Certificate of Verification
          </p>
          <span className="text-[8px] font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded-sm inline-block">
            {certificate.certificateNumber}
          </span>
        </div>

        {/* Miniature Grid */}
        <div className="space-y-1 text-[9px] leading-tight">
          <div className="flex justify-between">
            <span className="text-slate-500">Unit ID:</span>
            <span className="font-mono font-bold text-slate-900">{certificate.instrumentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Owner:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[130px]">{certificate.ownerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Valid Until:</span>
            <span className="font-bold text-emerald-800 font-mono">{certificate.nextDueDate}</span>
          </div>
        </div>

        {/* Thumbnail QR & Badge */}
        <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Digitally Verified</span>
          </div>
          {qrDataUrl && (
            <img 
              src={qrDataUrl} 
              alt="QR Code" 
              className="w-8 h-8 rounded border border-slate-300 shadow-2xs" 
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      className="w-full max-w-[760px] mx-auto bg-[#fefdfa] text-[#0f172a] p-6 sm:p-10 shadow-2xl rounded-2xl border-[6px] border-[#1e3a8a] relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative Inner Gold Inset Border */}
      <div className="absolute inset-2 sm:inset-3 border-2 border-[#b45309]/50 pointer-events-none rounded-xl" />
      <div className="absolute inset-3 sm:inset-4 border border-[#1e3a8a]/20 pointer-events-none rounded-lg" />

      {/* Decorative Corner Filigrees */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

      {/* Subtle Background Watermark Stamp */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
        <Scale className="w-[360px] h-[360px] text-[#1e3a8a]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center space-y-1.5 border-b-2 border-[#1e3a8a]/20 pb-5">
          {/* Emblem Motif */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] flex items-center justify-center text-amber-300 shadow-md ring-2 ring-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <h4 className="text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-slate-700 font-heading">
            Government of India • Ministry of Consumer Affairs
          </h4>
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-[#1e3a8a] font-heading">
            Department of Consumer Affairs • Legal Metrology Division
          </h2>
          <div className="pt-1">
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-[#0f172a] font-heading">
              Statutory Certificate of Verification
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium italic mt-0.5">
              [ Issued under Section 24 of The Legal Metrology Act, 2009 & Rule 14 of Legal Metrology (General) Rules, 2011 ]
            </p>
          </div>

          {/* Certificate Number & Issue Date Strip */}
          <div className="mt-3 pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 shadow-2xs">
              <span className="text-slate-500 font-sans text-[10px] uppercase font-bold">Cert No:</span>
              <span className="font-bold tracking-wider">{certificate.certificateNumber}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-slate-800 shadow-2xs">
              <span className="text-slate-500 font-sans text-[10px] uppercase font-bold">Issued:</span>
              <span className="font-bold">{certificate.verificationDate}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 shadow-2xs">
              <span className="text-emerald-700 font-sans text-[10px] uppercase font-bold">Valid Until:</span>
              <span className="font-bold">{certificate.nextDueDate}</span>
            </div>
          </div>
        </div>

        {/* ================= STATUTORY BODY DATA ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Box 1: Instrument & Mechanical Identity */}
          <div className="p-3.5 bg-white/90 border border-slate-200 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
              <Scale className="w-4 h-4 text-[#1e3a8a]" />
              <h3 className="font-bold uppercase tracking-wider text-[10px] text-[#1e3a8a] font-heading">
                1. Instrument Technical Identity
              </h3>
            </div>
            
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Instrument ID:</span>
                <span className="font-mono font-bold text-slate-900">{certificate.instrumentId}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Category & Type:</span>
                <span className="font-semibold text-slate-900">{certificate.instrumentType}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Make & Model:</span>
                <span className="font-medium text-slate-800">{certificate.makeModel}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Accuracy Class:</span>
                <span className="font-semibold text-slate-800">{certificate.accuracyClass || 'Class III (Commercial Standard)'}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Rated Capacity:</span>
                <span className="font-bold text-slate-900">{certificate.capacity || 'Standard Operational'}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Tolerance Margin (MPE):</span>
                <span className="font-mono font-bold text-emerald-800">{certificate.mpeTolerance || '±100 grams'}</span>
              </div>
            </div>
          </div>

          {/* Box 2: Enterprise & Deployment */}
          <div className="p-3.5 bg-white/90 border border-slate-200 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
              <Building2 className="w-4 h-4 text-[#1e3a8a]" />
              <h3 className="font-bold uppercase tracking-wider text-[10px] text-[#1e3a8a] font-heading">
                2. Enterprise & Deployment Site
              </h3>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Registered Enterprise:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">{certificate.ownerName}</span>
              </div>
              {certificate.ownerId && (
                <div className="flex justify-between py-0.5 border-b border-slate-50">
                  <span className="text-slate-500">Commercial Reg ID:</span>
                  <span className="font-mono font-bold text-blue-900">{certificate.ownerId}</span>
                </div>
              )}
              <div className="py-0.5 border-b border-slate-50">
                <span className="text-slate-500 block text-[10px]">Physical Installation Location:</span>
                <span className="font-medium text-slate-800 text-[11px] block mt-0.5">
                  {instrument?.location || 'Registered Operational Site, Maharashtra'}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-50">
                <span className="text-slate-500">Statutory Die Seal:</span>
                <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {certificate.sealNumber}
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Validity Period:</span>
                <span className="font-bold text-emerald-800">{certificate.validityPeriod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= VERIFICATION STAMP & QR SECTION ================= */}
        <div className="p-4 bg-gradient-to-r from-blue-50/60 via-amber-50/40 to-emerald-50/60 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Officer Credentials & Authority */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-[#1e3a8a] font-heading">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Issuing Legal Metrology Officer</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900">
              {certificate.officerName}
            </p>
            <p className="text-xs font-mono font-bold text-slate-600">
              Inspector Badge ID: {certificate.officerBadge}
            </p>
            <p className="text-[11px] text-slate-500">
              Jurisdiction: {certificate.jurisdiction}
            </p>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Statutory Stamping Completed • Tolerances Passed</span>
            </div>
          </div>

          {/* Embedded Re-Verification QR Code */}
          <div className="flex flex-col items-center text-center shrink-0">
            <div className="p-2 bg-white rounded-xl border-2 border-slate-300 shadow-md">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt={`QR Verification for ${certificate.instrumentId}`} 
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-slate-100 text-xs font-mono">
                  Generating QR...
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-600 mt-1 uppercase tracking-wider">
              Scan to Re-Verify
            </span>
          </div>
        </div>

        {/* ================= FOOTER STATUTORY CLAUSE ================= */}
        <div className="text-center pt-2 border-t border-slate-200 space-y-1">
          <p className="text-[11px] font-bold text-[#1e3a8a] uppercase tracking-wider font-heading">
            Digitally Issued — No Physical Signature Required
          </p>
          <p className="text-[10px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            This digital certificate is legally binding under Section 4 of the Information Technology Act, 2000 and Section 24 of The Legal Metrology Act, 2009. The authenticity and statutory validity of this document may be independently verified at any time by scanning the embedded QR code.
          </p>
        </div>
      </div>
    </div>
  );
};

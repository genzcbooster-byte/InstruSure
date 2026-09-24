import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Lock,
  Loader2 
} from 'lucide-react';
import { DigitalCertificate, ScalyInstrument } from '../types/scaly';
import { DigitalCertificateDocument } from './DigitalCertificateDocument';
import { downloadCertificatePDF } from '../utils/pdfGenerator';

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: DigitalCertificate | null;
  instrument?: ScalyInstrument;
  allowDownload?: boolean; // false for Citizen view, true for Business Owner and LMO
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  instrument,
  allowDownload = true,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !certificate) return null;

  const handleDownloadPDF = async () => {
    if (!allowDownload) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      const success = await downloadCertificatePDF(
        'scaly-certificate-printable',
        certificate.instrumentId,
        { fileName: `Certificate_${certificate.instrumentId}.pdf` }
      );

      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col my-auto max-h-[95vh] overflow-hidden text-slate-100">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-700/60 flex items-center justify-center text-amber-400 shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight font-heading">
                  Statutory Digital Certificate
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  {certificate.certificateNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                Legal Metrology Act, 2009 • National Verification Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Download Button (Business Owner & LMO ONLY - strictly omitted for Citizen) */}
            {allowDownload && (
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-98 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer font-heading tracking-[0.02em] disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-amber-300" />
                    <span className="hidden sm:inline">Download Certificate (PDF)</span>
                    <span className="sm:hidden">Download PDF</span>
                  </>
                )}
              </button>
            )}

            {!allowDownload && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-normal text-[11px]">Public Inspection Record • Read-Only</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Banner if PDF downloaded */}
        {downloadSuccess && (
          <div className="p-3 bg-emerald-950/80 border-b border-emerald-600/60 text-emerald-200 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold font-heading">
              Certificate downloaded successfully as Certificate_{certificate.instrumentId}.pdf
            </span>
          </div>
        )}

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950/50 flex items-center justify-center">
          <div className="w-full">
            <DigitalCertificateDocument
              certificate={certificate}
              instrument={instrument}
              id="scaly-certificate-printable"
              isThumbnail={false}
            />
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Statutory Digital Signature Verified</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            Valid Until: {certificate.nextDueDate}
          </span>
        </div>
      </div>
    </div>
  );
};

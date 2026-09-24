import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, ShieldCheck, QrCode } from 'lucide-react';
import { Instrument } from '../types/metrochain';

interface QRCodeDisplayProps {
  instrument: Instrument;
  size?: number;
  showStickerPreview?: boolean;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  instrument,
  size = 180,
  showStickerPreview = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR code with error correction level H
    QRCode.toDataURL(
      instrument.qrCodePayload,
      {
        width: size * 2,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (!err && url) {
          setDataUrl(url);
        }
      }
    );
  }, [instrument.qrCodePayload, size]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `MetroChain_QR_${instrument.id}.png`;
    link.click();
  };

  const handlePrintSticker = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Legal Metrology Verification Sticker - ${instrument.id}</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #fff; }
            .sticker { border: 3px solid #1e3a8a; width: 340px; padding: 16px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { font-size: 11px; font-weight: bold; color: #1e3a8a; letter-spacing: 0.5px; text-transform: uppercase; }
            .sub-header { font-size: 9px; color: #475569; margin-bottom: 12px; }
            .qr-img { width: 140px; height: 140px; margin: 0 auto 10px; display: block; }
            .id-box { background: #f1f5f9; padding: 6px; border-radius: 4px; font-family: monospace; font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 8px; }
            .meta { font-size: 10px; color: #334155; text-align: left; line-height: 1.5; border-top: 1px dashed #cbd5e1; padding-top: 8px; }
            .status-tag { display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: bold; border-radius: 9999px; background: #dcfce7; color: #15803d; }
          </style>
        </head>
        <body>
          <div class="sticker">
            <div class="header">Government of India · Legal Metrology</div>
            <div class="sub-header">विधिक मापविज्ञान प्रभाग · Instrument Digital Twin</div>
            <img class="qr-img" src="${dataUrl}" alt="QR Code" />
            <div class="id-box">${instrument.id}</div>
            <div class="meta">
              <div><strong>Type:</strong> ${instrument.type}</div>
              <div><strong>Status:</strong> <span class="status-tag">${instrument.status.toUpperCase()}</span></div>
              <div><strong>Cert No:</strong> ${instrument.certificateNo}</div>
              <div><strong>Valid Till:</strong> ${instrument.nextDueDate}</div>
              <div><strong>Lead Seal:</strong> ${instrument.leadSealNumber}</div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col items-center">
      {showStickerPreview ? (
        <div className="bg-white border-2 border-blue-900 rounded-lg p-4 shadow-sm w-full max-w-[280px] text-center relative overflow-hidden">
          {/* Official Sticker Header */}
          <div className="flex items-center justify-center gap-1.5 text-blue-900 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Govt. of India · Legal Metrology</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-3">Statutory Digital Verification Sticker</p>

          <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200 inline-block mb-3">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt={`QR code for ${instrument.id}`}
                className="w-36 h-36 mx-auto rounded"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center bg-slate-100 text-slate-400">
                <QrCode className="w-10 h-10 animate-pulse" />
              </div>
            )}
          </div>

          <div className="bg-slate-900 text-amber-300 font-mono font-bold text-xs py-1 px-2 rounded mb-2 select-all">
            {instrument.id}
          </div>

          <div className="text-[11px] text-slate-600 text-left border-t border-dashed border-slate-200 pt-2 space-y-0.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Valid Till:</span>
              <span className="font-semibold text-slate-900">{instrument.nextDueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Seal No:</span>
              <span className="font-mono text-slate-800">{instrument.leadSealNumber}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm inline-block">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={`QR code for ${instrument.id}`}
              style={{ width: size, height: size }}
              className="rounded"
            />
          ) : (
            <div
              style={{ width: size, height: size }}
              className="flex items-center justify-center bg-slate-100 text-slate-400"
            >
              <QrCode className="w-8 h-8 animate-pulse" />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        <button
          type="button"
          onClick={handleDownload}
          title="Download high-res QR code PNG"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Save PNG</span>
        </button>
        <button
          type="button"
          onClick={handlePrintSticker}
          title="Print official physical QR label for affixing"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 cursor-pointer shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-blue-700" />
          <span>Print Sticker</span>
        </button>
      </div>
    </div>
  );
};

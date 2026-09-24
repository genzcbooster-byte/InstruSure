import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  fileName?: string;
  scale?: number;
  backgroundColor?: string;
}

/**
 * Client-side PDF generation for Legal Metrology Verification Certificates
 * Converts the rendered certificate DOM element to a crisp A4 PDF using html2canvas & jsPDF.
 */
export async function downloadCertificatePDF(
  elementId: string, 
  instrumentId: string,
  options?: PDFExportOptions
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Certificate element with id "${elementId}" not found in DOM`);
    return false;
  }

  try {
    // Wait briefly for all fonts & images (e.g. QR code canvas) to settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    const canvas = await html2canvas(element, {
      scale: options?.scale || 2, // 2x DPI for crisp government document print quality
      useCORS: true,
      logging: false,
      backgroundColor: options?.backgroundColor || '#fefdfa',
      windowWidth: 800,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Fit to page width with 10mm margins
    const margin = 10;
    const usableWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * usableWidth) / canvas.width;
    
    // Position vertically on A4 page
    const posY = imgHeight < (pageHeight - (margin * 2)) 
      ? margin + ((pageHeight - (margin * 2) - imgHeight) / 4)
      : margin;

    pdf.addImage(imgData, 'PNG', margin, posY, usableWidth, imgHeight, undefined, 'FAST');
    
    const finalFileName = options?.fileName || `Certificate_${instrumentId}.pdf`;
    pdf.save(finalFileName);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF via html2canvas & jsPDF:', error);
    // Graceful fallback to browser print if available
    try {
      window.print();
    } catch {
      // ignore
    }
    return false;
  }
}

// Retain alias for backward compatibility
export const generateCertificatePDF = downloadCertificatePDF;

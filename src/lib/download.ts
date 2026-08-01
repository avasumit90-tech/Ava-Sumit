/**
 * REAL DOWNLOAD UTILITIES
 * -----------------------
 * - captureElementAsPng: kisi bhi HTML element ko high-res PNG me download karta hai
 * - downloadSimplePdf: simple text-based PDF banata hai (receipts / certificates)
 * - triggerPrint: browser print dialog (Save as PDF destination)
 * - downloadTextFile: generic text file (CSV/report) download
 *
 * Ye alert() wali fake downloads ki jagah use hota hai.
 */

import html2canvas from 'html2canvas';

/** DOM element ko PNG image me capture + download */
export async function captureElementAsPng(el: HTMLElement, filename: string): Promise<boolean> {
  try {
    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scale: 3, // high-res printable
      logging: false,
    });
    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (e) {
    console.error('[download] PNG capture failed:', e);
    return false;
  }
}

/** Browser print dialog kholta hai (user "Save as PDF" choose kar sakta hai) */
export function triggerPrint() {
  window.print();
}

/** Simple text-based PDF file banao aur download karo (no libs needed) */
export function downloadSimplePdf(title: string, lines: { label: string; value: string }[], filename: string, footer = 'Astha Foundation — Official Document') {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const w = 595; // A4 width in points
  const lineH = 16;
  let y = 80;
  const parts: string[] = [];

  // Title
  parts.push(`BT /F1 20 Tf 60 ${y} Td (${esc(title)}) Tj ET`);
  y += 30;
  parts.push('BT /F1 10 Tf 60 ' + y + ' Td (Astha Foundation - Official Document) Tj ET');
  y += 22;

  for (const l of lines) {
    if (y > 780) {
      // page break
      parts.push('BT /F1 9 Tf 60 820 Td (-- continued --) Tj ET');
      break;
    }
    parts.push(`BT /F2 11 Tf 60 ${y} Td (${esc(l.label)}) Tj ET`);
    parts.push(`BT /F1 11 Tf 210 ${y} Td (${esc(l.value)}) Tj ET`);
    y += lineH;
  }

  y += 20;
  parts.push(`BT /F1 9 Tf 60 ${y} Td (${esc(footer)}) Tj ET`);
  y += 14;
  parts.push(`BT /F1 9 Tf 60 ${y} Td (Generated on ${new Date().toLocaleString('en-IN')}) Tj ET`);

  const content = parts.join('\n');
  const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R/F2 6 0 R>>>>>>endobj
4 0 obj<</Length ${content.length}>>stream
${content}
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
6 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000271 00000 n 
0000000400 00000 n 
0000000476 00000 n 
trailer<</Size 7/Root 1 0 R>>
startxref
552
%%EOF`;

  downloadBlob(new Blob([pdf], { type: 'application/pdf' }), filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

/** Generic text file download (CSV, txt...) */
export function downloadTextFile(content: string, filename: string, mime = 'text/plain') {
  downloadBlob(new Blob([content], { type: mime }), filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

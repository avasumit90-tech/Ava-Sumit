/**
 * REAL DOWNLOAD UTILITIES (v2 — rock solid)
 * -----------------------------------------
 * - captureElementAsPng: element → high-res PNG (DOM-appended anchor fix +
 *   hard timeout, taaki Firefox/Chrome dono me chalega)
 * - openPrintableCard: ID card ko naye window me full HTML ke saath kholta
 *   hai (remote images browser khud load karta hai — koi CORS issue nahi),
 *   images load hote hi print dialog (Save as PDF) auto-kholta hai
 * - downloadSimplePdf: simple text PDF (receipts/certificates)
 * - triggerPrint / downloadTextFile: helpers
 */

import html2canvas from 'html2canvas';

/** DOM element ko high-res PNG me capture + download (with hard timeout) */
export async function captureElementAsPng(el: HTMLElement, filename: string): Promise<boolean> {
  const capture = (async () => {
    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        scale: 3,
        logging: false,
        imageTimeout: 5000,
        windowWidth: el.scrollWidth + 40,
        windowHeight: el.scrollHeight + 40,
      });
      const link = document.createElement('a');
      link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.style.display = 'none';
      document.body.appendChild(link); // Firefox requires DOM presence
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (e) {
      console.error('[download] PNG capture failed:', e);
      return false;
    }
  })();

  // Agar capture 8 sec me complete na ho → fail (hanging images etc.)
  const timeout = new Promise<boolean>((res) => setTimeout(() => res(false), 8000));
  return Promise.race([capture, timeout]);
}

/** ID Card ko naye window me printable HTML ke saath kholo + auto print */
export function openPrintableCard(card: {
  name: string;
  id: string;
  role: string;
  location: string;
  dob: string;
  bloodGroup: string;
  validUntil: string;
  serialNo: string;
  photoUrl: string;
  logoUrl: string;
  patternUrl: string;
  qrUrl: string;
}) {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>ID Card — ${esc(card.name)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #e2e8f0; font-family: 'Segoe UI', Arial, sans-serif; display: flex; flex-direction: column; align-items: center; padding: 24px; }
  .toolbar { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .toolbar button { background: #1e293b; color: #fff; border: none; padding: 12px 22px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; }
  .toolbar button.amber { background: #f59e0b; color: #1e293b; }
  .toolbar button:hover { opacity: 0.9; }
  .card { width: 360px; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,.15); }
  .header { background: #0f172a; color: #fff; padding: 22px 24px; text-align: center; position: relative; overflow: hidden; }
  .header .pattern { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .2; }
  .header .row { position: relative; display: flex; align-items: center; justify-content: center; gap: 12px; }
  .header .logo { width: 46px; height: 46px; border-radius: 50%; background: #fff; padding: 3px; border: 2px solid #f59e0b; }
  .header .logo img { width: 100%; height: 100%; object-fit: contain; }
  .header h4 { font-size: 17px; letter-spacing: .5px; text-transform: uppercase; }
  .header p { font-size: 9px; color: #fcd34d; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .ribbon { height: 8px; background: linear-gradient(90deg,#f59e0b,#f97316,#d97706); }
  .body { padding: 22px; }
  .top { display: flex; gap: 16px; align-items: center; }
  .photo { width: 96px; height: 96px; border-radius: 16px; object-fit: cover; border: 2px solid #0f172a; }
  .info { flex: 1; }
  .badge { display: inline-block; background: #fef3c7; color: #78350f; font-size: 9px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: .5px; }
  .info h3 { font-size: 19px; margin-top: 6px; color: #0f172a; }
  .info .id { font-family: monospace; font-size: 11px; color: #64748b; font-weight: 700; margin-top: 3px; }
  .info .loc { font-size: 10px; color: #94a3b8; }
  .details { margin-top: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px; display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; font-size: 10px; }
  .details .lbl { color: #94a3b8; font-weight: 700; text-transform: uppercase; display: block; }
  .details .val { font-weight: 800; color: #1e293b; }
  .details .val.amber { color: #b45309; }
  .foot { margin-top: 12px; border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; align-items: center; justify-content: space-between; }
  .foot .cert { font-size: 10px; color: #047857; font-weight: 800; }
  .foot .serial { font-size: 8px; color: #94a3b8; font-family: monospace; }
  .foot .qr { width: 52px; height: 52px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 3px; }
  @media print {
    body { background: #fff; padding: 0; }
    .toolbar { display: none !important; }
    .card { box-shadow: none; border: 1px solid #cbd5e1; }
  }
  @page { size: A4 portrait; margin: 10mm; }
</style>
</head>
<body>
  <div class="toolbar">
    <button class="amber" onclick="window.print()">⬇️ Download / Save as PDF</button>
    <button onclick="window.close()">Close</button>
  </div>
  <div class="card">
    <div class="header">
      <img class="pattern" src="${esc(card.patternUrl)}" alt="" />
      <div class="row">
        <div class="logo"><img src="${esc(card.logoUrl)}" alt="logo" /></div>
        <div>
          <h4>Astha Foundation</h4>
          <p>Official Member Identity Card</p>
        </div>
      </div>
    </div>
    <div class="ribbon"></div>
    <div class="body">
      <div class="top">
        <img class="photo" src="${esc(card.photoUrl)}" alt="photo" />
        <div class="info">
          <span class="badge">${esc(card.role)}</span>
          <h3>${esc(card.name)}</h3>
          <p class="id">ID: ${esc(card.id)}</p>
          <p class="loc">${esc(card.location)}</p>
        </div>
      </div>
      <div class="details">
        <div><span class="lbl">DOB</span><span class="val">${esc(card.dob)}</span></div>
        <div><span class="lbl">Blood Group</span><span class="val">${esc(card.bloodGroup)}</span></div>
        <div><span class="lbl">Valid Thru</span><span class="val amber">${esc(card.validUntil)}</span></div>
      </div>
      <div class="foot">
        <div>
          <p class="cert">✓ FCRA &amp; 80G Certified</p>
          <p class="serial">SERIAL: ${esc(card.serialNo)}</p>
        </div>
        <img class="qr" src="${esc(card.qrUrl)}" alt="QR" />
      </div>
    </div>
  </div>
  <script>
    // Images load hone ke baad print dialog auto-kholo (2 attempts)
    var printed = false;
    function tryPrint() { if (!printed && document.readyState === 'complete') { printed = true; setTimeout(function(){ window.print(); }, 400); } }
    window.addEventListener('load', tryPrint);
    setTimeout(tryPrint, 1500);
    setTimeout(tryPrint, 3500);
  <\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=860,height=720');
  if (!win) {
    // Popup blocked → inline fallback: print current window w/ only card visible
    alert('Popup blocked! Print dialog kholne ke liye popups allow karo. Abhi direct print try ho raha hai...');
    triggerPrint();
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

/** Browser print dialog kholta hai */
export function triggerPrint() {
  window.print();
}

/** Simple text-based PDF file banao aur download karo (no libs needed) */
export function downloadSimplePdf(title: string, lines: { label: string; value: string }[], filename: string, footer = 'Astha Foundation — Official Document') {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const lineH = 16;
  let y = 80;
  const parts: string[] = [];

  parts.push(`BT /F1 20 Tf 60 ${y} Td (${esc(title)}) Tj ET`);
  y += 30;
  parts.push('BT /F1 10 Tf 60 ' + y + ' Td (Astha Foundation - Official Document) Tj ET');
  y += 22;

  for (const l of lines) {
    if (y > 780) break;
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
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

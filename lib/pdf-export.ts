/**
 * Renders the hidden `PdfExportTemplate` node (a real, browser-painted DOM
 * tree) to a canvas via html2canvas, then drops that image into a single
 * continuously-tall jsPDF page sized to match its aspect ratio.
 *
 * This goes through the browser's own text engine rather than jsPDF's vector
 * text drawing — jsPDF has no Arabic shaping or bidi reordering of its own,
 * so Arabic text drawn directly with it comes out as disconnected, reversed
 * glyphs. Rasterizing the already-correctly-rendered DOM sidesteps that
 * entirely, and a single tall page (rather than slicing across A4 pages)
 * avoids cutting a card or a paragraph in half at a page break.
 */
const PDF_PAGE_WIDTH_MM = 210;

export async function renderNodeToPdf(node: HTMLElement, filename: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(node, {
    scale: 1.5,
    backgroundColor: "#fffefc",
    useCORS: true,
  });

  // JPEG rather than PNG: this is a flat, mostly-white document with fine
  // text, and PNG's lossless compression does badly on the antialiasing
  // noise html2canvas introduces at every glyph edge — it was inflating a
  // ~10-page export to double-digit megabytes. JPEG at high quality keeps
  // text legible at a fraction of the size.
  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdfHeight = (canvas.height / canvas.width) * PDF_PAGE_WIDTH_MM;

  const doc = new jsPDF({
    unit: "mm",
    format: [PDF_PAGE_WIDTH_MM, pdfHeight],
    compress: true,
  });

  doc.addImage(imgData, "JPEG", 0, 0, PDF_PAGE_WIDTH_MM, pdfHeight);
  doc.save(filename);
}

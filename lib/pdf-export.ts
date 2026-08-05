import { jsPDF } from "jspdf";
import type { AssessmentState, DomainResult, Locale, ResultLevel } from "./types";
import type { Translator } from "./ui-text";

const PAGE_MARGIN = 18;
const LINE_HEIGHT = 6;

interface PdfExportArgs {
  state: AssessmentState;
  result: ResultLevel;
  domainResults: DomainResult[];
  maxScore: number;
  locale: Locale;
  t: Translator;
  tx: (value: { en: string; ar: string }) => string;
}

/**
 * Renders the result screen's content as a downloadable PDF. jsPDF's built-in
 * fonts only cover Latin script, so Arabic text will not shape or reorder
 * correctly here — this generates a faithful export for the `en` locale and a
 * best-effort one for `ar`.
 */
export function downloadResultPdf({
  state,
  result,
  domainResults,
  maxScore,
  locale,
  t,
  tx,
}: PdfExportArgs) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  let y = PAGE_MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
  };

  const writeLines = (
    text: string,
    fontSize: number,
    options: { bold?: boolean; gap?: number; color?: [number, number, number] } = {},
  ) => {
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...(options.color ?? [30, 30, 30]));
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * LINE_HEIGHT + (options.gap ?? 0));
    doc.text(lines, PAGE_MARGIN, y);
    y += lines.length * LINE_HEIGHT + (options.gap ?? 0);
  };

  const rule = () => {
    ensureSpace(4);
    doc.setDrawColor(210, 210, 210);
    doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
    y += 6;
  };

  // Header ----------------------------------------------------------------
  writeLines(t("brand"), 20, { bold: true, gap: 1 });
  writeLines(t("resultEyebrow"), 10, { color: [110, 110, 110], gap: 3 });
  rule();

  // Score + headline --------------------------------------------------------
  writeLines(
    `${t("resultScoreLabel")}: ${state.totalScore} ${t("resultOutOf")} ${maxScore}`,
    11,
    { gap: 2 },
  );
  writeLines(result.label, 16, { bold: true, gap: 2 });
  writeLines(result.message, 11, { gap: 4 });

  // Next step ---------------------------------------------------------------
  writeLines(t("resultNextStep"), 10, { bold: true, gap: 1 });
  writeLines(result.actionCall, 11, { gap: 4 });
  rule();

  // Full profile --------------------------------------------------------------
  writeLines(t("resultProfile"), 14, { bold: true, gap: 3 });

  for (const domainResult of domainResults) {
    ensureSpace(10);
    const name = tx(domainResult.domain.name);
    const band = t.band(domainResult.band.id);
    const scoreLabel = `${domainResult.score} / ${domainResult.maxScore}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(name, PAGE_MARGIN, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(120, 120, 120);
    doc.text(`${band} · ${scoreLabel}`, pageWidth - PAGE_MARGIN, y, {
      align: "right",
    });
    y += 5;

    writeLines(tx(domainResult.band.reading), 10, { gap: 3 });
  }

  rule();
  writeLines(t("disclaimer"), 8.5, { color: [130, 130, 130] });

  const dateSuffix = new Date().toISOString().slice(0, 10);
  doc.save(`orenda-result-${locale}-${dateSuffix}.pdf`);
}

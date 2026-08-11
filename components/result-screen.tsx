"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { LeafMark } from "./leaf-mark";
import { DomainChips, DomainProfile } from "./domain-profile";
import { PdfExportTemplate } from "./pdf-export-template";
import { EraseEverything } from "./erase-everything";
import { useLanguage } from "./language-provider";
import { getResultLevel, resolveResultLevel } from "@/lib/content";
import {
  selectDomainResults,
  selectHasRiskFlag,
  selectSteadyDomains,
  selectTopDomains,
} from "@/lib/assessment";
import { buildAttentionLine, buildSteadyLine } from "@/lib/results-narrative";
import { MAX_SCORE } from "@/lib/questions";
import { renderNodeToPdf } from "@/lib/pdf-export";
import { HELPLINE_DIRECTORY } from "@/lib/resources";
import type { AssessmentState, ResultTone } from "@/lib/types";

const TONE_TEXT: Record<ResultTone, string> = {
  steady: "text-tone-steady",
  mild: "text-tone-mild",
  moderate: "text-tone-moderate",
  elevated: "text-tone-elevated",
  high: "text-tone-high",
};

const TONE_GLOW: Record<ResultTone, string> = {
  steady: "rgba(141, 163, 153, 0.15)",
  mild: "rgba(127, 154, 164, 0.15)",
  moderate: "rgba(183, 154, 109, 0.15)",
  elevated: "rgba(191, 138, 114, 0.15)",
  high: "rgba(169, 112, 122, 0.15)",
};

const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const transition = { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const };

interface ResultScreenProps {
  state: AssessmentState;
  onRetake: () => void;
}

export function ResultScreen({ state, onRetake }: ResultScreenProps) {
  const { t, tx, locale, isRtl } = useLanguage();

  const level = getResultLevel(state.totalScore);
  const result = resolveResultLevel(level, locale);
  const domainResults = selectDomainResults(state);
  const topDomains = selectTopDomains(state);
  const steadyDomains = selectSteadyDomains(state);
  const showCrisis = selectHasRiskFlag(state);
  // Gentle, data-true summary sentences — null when there is nothing genuine
  // to say, in which case the reassuring "none" copy takes over below.
  const attentionLine = buildAttentionLine(topDomains, locale, t);
  const steadyLine = buildSteadyLine(steadyDomains, locale, t);

  const pdfNodeRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!pdfNodeRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const dateSuffix = new Date().toISOString().slice(0, 10);
      await renderNodeToPdf(
        pdfNodeRef.current,
        `orenda-result-${locale}-${dateSuffix}.pdf`,
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      }}
      className="relative mx-auto w-full max-w-3xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16"
    >
      {/* Decorative gradient blob matching result tone. A real radial gradient
          rather than a flat fill behind `blur-[100px]` — a blur that wide is a
          genuinely expensive raster on a phone, and the gradient reaches the
          same softness for free. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 h-64 w-full max-w-150 -translate-x-1/2 opacity-60 sm:h-100"
        style={{
          background: `radial-gradient(closest-side, ${TONE_GLOW[level.tone]}, transparent)`,
        }}
      />

      {showCrisis ? (
        <motion.aside
          variants={rise}
          transition={transition}
          role="note"
          className="border-tone-high/30 bg-tone-high/[0.07] mb-10 rounded-3xl border p-6 sm:p-7"
        >
          <h2 className="text-tone-high flex items-center gap-2.5 text-[15px] font-semibold">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-tone-high h-1.5 w-1.5 rounded-full"
            />
            {t("crisisTitle")}
          </h2>
          <p className="text-ink-soft mt-3 text-[15px] leading-relaxed">
            {t("crisisBody")}
          </p>
          <a
            href={HELPLINE_DIRECTORY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tone-high decoration-tone-high/40 hover:decoration-tone-high mt-4 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors"
          >
            {t("crisisFindLine")}
            <span aria-hidden="true">{isRtl ? "←" : "→"}</span>
          </a>
        </motion.aside>
      ) : null}

      {/* Headline ------------------------------------------------------- */}
      <motion.div variants={rise} transition={transition}>
        <p className="text-ink-muted text-sm tracking-wide">
          {t("resultEyebrow")}
        </p>
        <p className="text-ink-soft mt-1.5 max-w-lg text-[15px] leading-relaxed text-pretty">
          {t("resultSnapshot")}
        </p>
      </motion.div>

      <motion.div
        variants={rise}
        transition={transition}
        className="mt-6 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-10"
      >
        {/* A quiet tonal anchor, not a score. The number that used to sit here
            read as an "overall mental-health score" — exactly the register this
            page avoids. The interpretive band is still stated in words beside
            it; the leaf just carries the overall tone. */}
        <div
          aria-hidden="true"
          className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32"
        >
          <div
            className="absolute inset-0 rounded-full opacity-80"
            style={{
              background: `radial-gradient(circle, ${TONE_GLOW[level.tone]}, transparent 70%)`,
            }}
          />
          <div className="border-hairline bg-surface/70 relative flex h-20 w-20 items-center justify-center rounded-full border backdrop-blur-sm sm:h-24 sm:w-24">
            <LeafMark className={`h-9 w-9 sm:h-10 sm:w-10 ${TONE_TEXT[level.tone]}`} />
          </div>
        </div>

        <div className="flex-1">
          <h1
            className={`font-display text-3xl leading-tight font-semibold tracking-tight sm:text-4xl ${TONE_TEXT[level.tone]}`}
          >
            {result.label}
          </h1>
          <p className="text-ink-soft mt-4 text-[15px] leading-relaxed text-pretty sm:text-base">
            {result.message}
          </p>
        </div>
      </motion.div>

      {/* Summary chips -------------------------------------------------- */}
      <motion.section
        variants={rise}
        transition={transition}
        className="mt-14 grid gap-8 sm:grid-cols-2"
      >
        <div>
          <h2 className="text-ink-muted text-xs font-medium tracking-widest uppercase">
            {t("resultTopAreas")}
          </h2>
          <div className="mt-4 space-y-3.5">
            {attentionLine ? (
              <>
                <p className="text-ink text-[15px] leading-relaxed text-pretty">
                  {attentionLine}
                </p>
                <DomainChips results={topDomains} />
              </>
            ) : (
              <p className="text-ink-soft text-sm leading-relaxed text-pretty">
                {t("resultTopAreasNone")}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-ink-muted text-xs font-medium tracking-widest uppercase">
            {t("resultSteadyAreas")}
          </h2>
          <div className="mt-4 space-y-3.5">
            {steadyLine ? (
              <>
                <p className="text-ink text-[15px] leading-relaxed text-pretty">
                  {steadyLine}
                </p>
                <DomainChips results={steadyDomains} />
              </>
            ) : (
              <p className="text-ink-soft text-sm leading-relaxed text-pretty">
                {t("resultSteadyNone")}
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Full profile ---------------------------------------------------- */}
      <motion.section
        variants={rise}
        transition={transition}
        className="border-hairline/70 mt-14 border-t pt-10"
      >
        <h2 className="font-display text-ink text-2xl font-semibold tracking-tight">
          {t("resultProfile")}
        </h2>
        <p className="text-ink-muted mt-2 text-sm">{t("resultBreakdown")}</p>

        <div className="mt-8">
          <DomainProfile results={domainResults} />
        </div>
      </motion.section>

      {/* Next step ------------------------------------------------------- */}
      <motion.section
        variants={rise}
        transition={transition}
        className="glass-card mt-14 rounded-3xl p-6 sm:p-8"
        style={{
          borderColor: "color-mix(in oklab, var(--color-sage-200) 60%, transparent)",
          background: "color-mix(in oklab, var(--color-sage-50) 55%, transparent)",
        }}
      >
        <h2 className="text-sage-700 text-xs font-medium tracking-widest uppercase">
          {t("resultNextStep")}
        </h2>
        <p className="text-ink mt-3 text-lg leading-relaxed text-pretty">
          {result.actionCall}
        </p>
      </motion.section>

      {/* Where to go from here — gentle, non-prescriptive paths ---------- */}
      <motion.section
        variants={rise}
        transition={transition}
        className="border-hairline/70 mt-14 border-t pt-10"
      >
        <h2 className="font-display text-ink text-2xl font-semibold tracking-tight">
          {t("resultPathsTitle")}
        </h2>

        <ul className="mt-8 flex flex-col gap-4">
          <PathCard title={t("pathGentleTitle")} body={t("pathGentleBody")} />
          <PathCard
            title={t("pathUnderstandTitle")}
            body={t("pathUnderstandBody")}
          />
          <PathCard title={t("pathHeavyTitle")} body={t("pathHeavyBody")}>
            <a
              href={HELPLINE_DIRECTORY}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-600 decoration-sage-300 hover:decoration-sage-500 mt-3 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors"
            >
              {t("pathHeavyCta")}
              <span aria-hidden="true">{isRtl ? "←" : "→"}</span>
            </a>
          </PathCard>
        </ul>
      </motion.section>

      {/* Actions --------------------------------------------------------- */}
      <motion.div
        variants={rise}
        transition={transition}
        className="mt-10 flex flex-wrap items-center gap-3"
      >
        <motion.button
          type="button"
          onClick={onRetake}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="bg-sage-500 hover:bg-sage-600 rounded-full px-7 py-3.5 text-[15px] font-medium text-white shadow-lg transition-all duration-300"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          {t("retake")}
        </motion.button>
        <motion.button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          whileHover={isGeneratingPdf ? {} : { scale: 1.02 }}
          whileTap={isGeneratingPdf ? {} : { scale: 0.98 }}
          className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink inline-block rounded-full border bg-surface px-7 py-3.5 text-[15px] font-medium transition-colors disabled:cursor-wait disabled:opacity-60"
        >
          {isGeneratingPdf ? t("downloadPdfPending") : t("downloadPdf")}
        </motion.button>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/"
            className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink inline-block rounded-full border bg-surface px-7 py-3.5 text-[15px] font-medium transition-colors"
          >
            {t("backHome")}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div variants={rise} transition={transition} className="mt-6">
        <EraseEverything />
      </motion.div>

      {/* A profile, not a label — the emotional close ------------------- */}
      <motion.section
        variants={rise}
        transition={transition}
        className="border-hairline/70 mt-14 flex flex-col items-center border-t pt-12 text-center"
      >
        <h2 className="font-display text-ink text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("closerTitle")}
        </h2>
        <p className="text-ink-soft mt-4 max-w-md text-[15px] leading-relaxed text-pretty">
          {t("closerBody")}
        </p>
      </motion.section>

      <motion.p
        variants={rise}
        transition={transition}
        className="border-hairline/70 text-ink-muted mt-14 border-t pt-8 text-xs leading-relaxed"
      >
        {t("disclaimer")}
      </motion.p>

      {/* Off-screen but fully painted (not display:none, which html2canvas
          cannot capture) — rasterized on demand when "Download PDF" is
          clicked. See lib/pdf-export.ts. */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }}
      >
        <PdfExportTemplate
          ref={pdfNodeRef}
          state={state}
          result={result}
          resultTone={level.tone}
          domainResults={domainResults}
          topDomains={topDomains}
          steadyDomains={steadyDomains}
          showCrisis={showCrisis}
          maxScore={MAX_SCORE}
          locale={locale}
          isRtl={isRtl}
          t={t}
          tx={tx}
          generatedOn={new Date().toLocaleDateString(locale === "ar" ? "ar" : "en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </div>
    </motion.main>
  );
}

/**
 * One gentle pathway in "Where to go from here". Framed as an invitation
 * ("If you want to…") rather than an instruction, per the brief's insistence
 * that next steps never read as medical commands.
 */
function PathCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="border-hairline/60 bg-surface/40 rounded-2xl border p-5 sm:p-6">
      <h3 className="text-ink text-[15px] font-semibold">{title}</h3>
      <p className="text-ink-soft mt-2 text-sm leading-relaxed text-pretty">
        {body}
      </p>
      {children}
    </li>
  );
}

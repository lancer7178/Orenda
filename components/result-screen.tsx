"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ScoreDial } from "./score-dial";
import { DomainChips, DomainProfile } from "./domain-profile";
import { useLanguage } from "./language-provider";
import { getResultLevel, resolveResultLevel } from "@/lib/content";
import {
  selectDomainResults,
  selectHasRiskFlag,
  selectSteadyDomains,
  selectTopDomains,
} from "@/lib/assessment";
import { MAX_SCORE } from "@/lib/questions";
import type { AssessmentState, ResultTone } from "@/lib/types";

/** International directory of crisis lines, filterable by country. */
const HELPLINE_DIRECTORY = "https://findahelpline.com";

const TONE_TEXT: Record<ResultTone, string> = {
  steady: "text-tone-steady",
  mild: "text-tone-mild",
  moderate: "text-tone-moderate",
  elevated: "text-tone-elevated",
  high: "text-tone-high",
};

const rise = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const transition = { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] as const };

interface ResultScreenProps {
  state: AssessmentState;
  onRetake: () => void;
}

export function ResultScreen({ state, onRetake }: ResultScreenProps) {
  const { t, locale, isRtl } = useLanguage();

  const level = getResultLevel(state.totalScore);
  const result = resolveResultLevel(level, locale);
  const domainResults = selectDomainResults(state);
  const topDomains = selectTopDomains(state);
  const steadyDomains = selectSteadyDomains(state);
  const showCrisis = selectHasRiskFlag(state);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      className="mx-auto w-full max-w-3xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16"
    >
      {showCrisis ? (
        <motion.aside
          variants={rise}
          transition={transition}
          role="note"
          className="border-tone-high/30 bg-tone-high/[0.07] mb-10 rounded-3xl border p-6 sm:p-7"
        >
          <h2 className="text-tone-high flex items-center gap-2.5 text-[15px] font-semibold">
            <span className="bg-tone-high h-1.5 w-1.5 rounded-full" />
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
      <motion.p
        variants={rise}
        transition={transition}
        className="text-ink-muted text-sm tracking-wide"
      >
        {t("resultEyebrow")}
      </motion.p>

      <motion.div
        variants={rise}
        transition={transition}
        className="mt-6 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-10"
      >
        <ScoreDial
          score={state.totalScore}
          maxScore={MAX_SCORE}
          tone={level.tone}
          caption={t("resultScoreLabel")}
          outOfLabel={t("resultOutOf")}
        />

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
          <div className="mt-4">
            {topDomains.length > 0 ? (
              <DomainChips results={topDomains} />
            ) : (
              <p className="text-ink-soft text-sm leading-relaxed">
                {t("resultTopAreasNone")}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-ink-muted text-xs font-medium tracking-widest uppercase">
            {t("resultSteadyAreas")}
          </h2>
          <div className="mt-4">
            {steadyDomains.length > 0 ? (
              <DomainChips results={steadyDomains} />
            ) : (
              <p className="text-ink-soft text-sm leading-relaxed">
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
        className="border-sage-200/60 bg-sage-50/50 mt-14 rounded-3xl border p-6 sm:p-8"
      >
        <h2 className="text-sage-700 text-xs font-medium tracking-widest uppercase">
          {t("resultNextStep")}
        </h2>
        <p className="text-ink mt-3 text-lg leading-relaxed text-pretty">
          {result.actionCall}
        </p>
      </motion.section>

      {/* Actions --------------------------------------------------------- */}
      <motion.div
        variants={rise}
        transition={transition}
        className="mt-10 flex flex-wrap items-center gap-3"
      >
        <button
          type="button"
          onClick={onRetake}
          className="bg-sage-500 hover:bg-sage-600 shadow-sage-600/15 rounded-full px-7 py-3.5 text-[15px] font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          {t("retake")}
        </button>
        <Link
          href="/"
          className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink rounded-full border bg-surface px-7 py-3.5 text-[15px] font-medium transition-colors"
        >
          {t("backHome")}
        </Link>
      </motion.div>

      <motion.p
        variants={rise}
        transition={transition}
        className="border-hairline/70 text-ink-muted mt-14 border-t pt-8 text-xs leading-relaxed"
      >
        {t("disclaimer")}
      </motion.p>
    </motion.main>
  );
}

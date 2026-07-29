"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ScoreDial } from "./score-dial";
import { useLanguage } from "./language-provider";
import { getResultLevel, resolveResultLevel } from "@/lib/content";
import { selectHasRiskFlag, selectScoreByCategory } from "@/lib/assessment";
import { MAX_SCORE, MAX_SCORE_BY_CATEGORY } from "@/lib/questions";
import type { AssessmentState, QuestionCategory, ResultTone } from "@/lib/types";

/** International directory of crisis lines, filterable by country. */
const HELPLINE_DIRECTORY = "https://findahelpline.com";

const TONE_TEXT: Record<ResultTone, string> = {
  steady: "text-tone-steady",
  mild: "text-tone-mild",
  moderate: "text-tone-moderate",
  elevated: "text-tone-elevated",
  high: "text-tone-high",
};

const TONE_BG: Record<ResultTone, string> = {
  steady: "bg-tone-steady",
  mild: "bg-tone-mild",
  moderate: "bg-tone-moderate",
  elevated: "bg-tone-elevated",
  high: "bg-tone-high",
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
  const byCategory = selectScoreByCategory(state);
  const showCrisis = selectHasRiskFlag(state);

  const categories: Array<{ key: QuestionCategory; label: string }> = [
    { key: "depression", label: t("categoryDepression") },
    { key: "emotional", label: t("categoryEmotional") },
  ];

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
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

      {/* Breakdown ------------------------------------------------------- */}
      <motion.section variants={rise} transition={transition} className="mt-14">
        <h2 className="text-ink-muted text-xs font-medium tracking-widest uppercase">
          {t("resultBreakdown")}
        </h2>
        <ul className="mt-5 flex flex-col gap-5">
          {categories.map((category, index) => {
            const score = byCategory[category.key];
            const max = MAX_SCORE_BY_CATEGORY[category.key] ?? 0;
            const ratio = max > 0 ? score / max : 0;

            return (
              <li key={category.key}>
                <div className="text-ink-soft flex items-baseline justify-between text-sm">
                  <span className="font-medium">{category.label}</span>
                  <span className="text-ink-muted tabular-nums">
                    {score} / {max}
                  </span>
                </div>
                <div className="bg-hairline/50 mt-2 h-2 w-full overflow-hidden rounded-full">
                  <motion.div
                    className={`h-full rounded-full ${TONE_BG[level.tone]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(ratio * 100)}%` }}
                    transition={{
                      duration: 1.1,
                      delay: 0.5 + index * 0.12,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </motion.section>

      {/* Next step ------------------------------------------------------- */}
      <motion.section
        variants={rise}
        transition={transition}
        className="border-sage-200/60 bg-sage-50/50 mt-12 rounded-3xl border p-6 sm:p-8"
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

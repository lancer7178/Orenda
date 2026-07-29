"use client";

import { motion } from "motion/react";
import { useLanguage } from "./language-provider";
import { LeafMark } from "./leaf-mark";
import { DOMAIN_ORDER } from "@/lib/domains";
import type { Domain } from "@/lib/types";

interface SectionIntroProps {
  domain: Domain;
  questionCount: number;
  onBegin: () => void;
}

const transition = { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const };

/**
 * A breath between sections. At 55 items the flow needs somewhere to pause,
 * and naming what the next section is about makes the questions land better.
 */
export function SectionIntro({
  domain,
  questionCount,
  onBegin,
}: SectionIntroProps) {
  const { t, tx, isRtl } = useLanguage();
  const position = DOMAIN_ORDER.indexOf(domain.id) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={transition}
      className="flex flex-col items-start"
    >
      <div className="text-sage-600 flex items-center gap-2.5 text-sm font-medium">
        <LeafMark className="text-sage-300 h-5 w-5" />
        {t("sectionLabel")} {position} {t("progressOf")} {DOMAIN_ORDER.length}
      </div>

      <h1 className="font-display text-ink mt-5 text-[30px] leading-tight font-semibold tracking-tight sm:text-[38px]">
        {tx(domain.name)}
      </h1>

      <p className="text-ink-soft mt-4 max-w-lg text-lg leading-relaxed text-pretty">
        {tx(domain.blurb)}
      </p>

      <div className="text-ink-muted mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="border-hairline rounded-full border px-3 py-1">
          {tx(domain.instrument)}
        </span>
        <span>
          {questionCount} {t("questionsWord")}
        </span>
      </div>

      <button
        type="button"
        onClick={onBegin}
        className="group bg-sage-500 hover:bg-sage-600 shadow-sage-600/15 mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        {t("beginSection")}
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${
            isRtl ? "-scale-x-100 group-hover:-translate-x-1" : ""
          }`}
        >
          <path
            d="M4 10h11m0 0-4-4m4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </motion.div>
  );
}

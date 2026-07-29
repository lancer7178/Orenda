"use client";

import { motion } from "motion/react";
import { useLanguage } from "./language-provider";
import { LeafMark } from "./leaf-mark";
import { DOMAIN_ORDER } from "@/lib/domains";
import type { Domain } from "@/lib/types";

interface SectionIntroProps {
  domain: Domain;
  questionCount: number;
  /** Sections fully answered so far — drives the completion beat. */
  sectionsCompleted: number;
  onBegin: () => void;
}

const transition = { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] as const };

const cascadeVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/**
 * A breath between sections. At 55 items the flow needs somewhere to pause,
 * and naming what the next section is about makes the questions land better.
 */
export function SectionIntro({
  domain,
  questionCount,
  sectionsCompleted,
  onBegin,
}: SectionIntroProps) {
  const { t, tx, isRtl } = useLanguage();
  const position = DOMAIN_ORDER.indexOf(domain.id) + 1;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -12 }}
      variants={cascadeVariants}
      transition={transition}
      className="relative flex flex-col items-start"
    >
      {/* Decorative background circles */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 opacity-[0.06]">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Arriving at a new section means the previous one is finished. Marking
          that explicitly turns a long climb into a run of small completions. */}
      {sectionsCompleted > 0 ? (
        <motion.div
          variants={item}
          transition={transition}
          className="border-sage-200/70 bg-sage-50/70 text-sage-700 mb-7 inline-flex items-center gap-2.5 rounded-full border py-1.5 ps-2 pe-4 text-sm font-medium"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.25,
              type: "spring",
              stiffness: 420,
              damping: 16,
            }}
            className="bg-sage-500 flex h-5 w-5 items-center justify-center rounded-full text-white"
          >
            <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
              <path
                d="M2.5 6.2 4.9 8.5 9.5 3.6"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
          {t("sectionCompleteTitle")}
          <span className="opacity-50">·</span>
          <span className="tabular-nums">
            {sectionsCompleted}/{DOMAIN_ORDER.length}
          </span>{" "}
          {t("sectionsDone")}
        </motion.div>
      ) : null}

      <motion.div
        variants={item}
        transition={transition}
        className="text-sage-600 flex items-center gap-2.5 text-sm font-medium"
      >
        <motion.div
          animate={{ rotate: [0, 8, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <LeafMark className="text-sage-300 h-5 w-5" />
        </motion.div>
        {t("sectionLabel")} {position} {t("progressOf")} {DOMAIN_ORDER.length}
      </motion.div>

      <motion.h1
        variants={item}
        transition={transition}
        className="font-display text-ink mt-5 text-[30px] leading-tight font-semibold tracking-tight sm:text-[38px]"
      >
        {tx(domain.name)}
      </motion.h1>

      <motion.p
        variants={item}
        transition={transition}
        className="text-ink-soft mt-4 max-w-lg text-lg leading-relaxed text-pretty"
      >
        {tx(domain.blurb)}
      </motion.p>

      <motion.div
        variants={item}
        transition={transition}
        className="text-ink-muted mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
      >
        <span className="border-hairline rounded-full border px-3 py-1">
          {tx(domain.instrument)}
        </span>
        <span>
          {questionCount} {t("questionsWord")}
        </span>
      </motion.div>

      <motion.button
        variants={item}
        transition={transition}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onBegin}
        className="group bg-sage-500 hover:bg-sage-600 mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-300"
        style={{ boxShadow: "var(--shadow-elevated)" }}
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
      </motion.button>
    </motion.div>
  );
}

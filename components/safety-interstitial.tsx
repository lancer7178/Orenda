"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "./language-provider";
import { LeafMark } from "./leaf-mark";
import { HELPLINE_DIRECTORY } from "@/lib/resources";

interface SafetyInterstitialProps {
  /** User-controlled return to the check-in, exactly where they left it. */
  onContinue: () => void;
}

const transition = { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] as const };

const cascade = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/**
 * A quiet pause when an answer touches self-harm — shown at the moment it is
 * given, not saved up for the results screen. The answer has already been
 * recorded and scored; this only slows the flow down long enough to
 * acknowledge it and offer a way to reach real help.
 *
 * Deliberately not an alarm. No red, no emergency iconography, no modal that
 * traps the reader. The brand's leaf carries the moment, and the reader stays
 * in control of whether they continue or step away — honesty is met with care,
 * never with a warning.
 */
export function SafetyInterstitial({ onContinue }: SafetyInterstitialProps) {
  const { t, isRtl } = useLanguage();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The answer that raised this screen unmounted the button that had focus, so
  // without this a keyboard or screen-reader user would be dropped on <body>
  // and might never reach the care message. Move focus to the heading, which is
  // made programmatically focusable below, so the screen is announced and the
  // support link is one Tab away.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-16 sm:px-8">
      <motion.div
        initial="hidden"
        animate="show"
        variants={cascade}
        role="group"
        aria-labelledby="safety-title"
        className="glass-card rounded-3xl p-7 sm:p-9"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <motion.div variants={item} transition={transition}>
          <span
            aria-hidden="true"
            className="border-sage-200/70 bg-sage-50/70 inline-flex h-12 w-12 items-center justify-center rounded-2xl border"
          >
            <LeafMark className="text-sage-500 h-6 w-6" />
          </span>
        </motion.div>

        <motion.h1
          ref={headingRef}
          id="safety-title"
          tabIndex={-1}
          variants={item}
          transition={transition}
          className="font-display text-ink mt-6 text-2xl font-semibold tracking-tight focus:outline-none sm:text-[28px]"
        >
          {t("safetyTitle")}
        </motion.h1>

        <motion.p
          variants={item}
          transition={transition}
          className="text-ink-soft mt-4 text-[15px] leading-relaxed text-pretty"
        >
          {t("safetyBody")}
        </motion.p>

        <motion.p
          variants={item}
          transition={transition}
          className="text-ink mt-4 text-[15px] leading-relaxed text-pretty"
        >
          {t("safetyBodyUrgent")}
        </motion.p>

        {/* Immediate support — one reviewed, self-serve destination. */}
        <motion.div
          variants={item}
          transition={transition}
          className="border-sage-200/60 bg-sage-50/50 mt-7 rounded-2xl border p-5"
        >
          <h2 className="text-sage-700 text-xs font-medium tracking-widest uppercase">
            {t("safetySupportTitle")}
          </h2>
          <a
            href={HELPLINE_DIRECTORY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sage-700 decoration-sage-300 hover:decoration-sage-600 mt-3 inline-flex items-center gap-2 text-[15px] font-medium underline underline-offset-4 transition-colors"
          >
            {t("crisisFindLine")}
            <span aria-hidden="true">{isRtl ? "←" : "→"}</span>
          </a>
        </motion.div>

        {/* User-controlled continuation — never trapped, never forced on. */}
        <motion.div
          variants={item}
          transition={transition}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <motion.button
            type="button"
            onClick={onContinue}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="bg-sage-500 hover:bg-sage-600 rounded-full px-7 py-3.5 text-[15px] font-medium text-white shadow-lg transition-all duration-300"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            {t("safetyContinue")}
          </motion.button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink inline-block rounded-full border bg-surface px-7 py-3.5 text-[15px] font-medium transition-colors"
            >
              {t("safetyLeave")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}

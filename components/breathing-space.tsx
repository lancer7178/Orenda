"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { useLanguage } from "./language-provider";
import { useCalmMode } from "./calm-provider";
import { LeafMark } from "./leaf-mark";
import {
  getSavedProgressSnapshot,
  getServerProgressSnapshot,
  markAutoResume,
  subscribeToSavedProgress,
} from "@/lib/progress-store";
import type { UIKey } from "@/lib/ui-text";

/**
 * A 4-4-6 cycle: a longer out-breath than in-breath is the part that actually
 * shifts you toward the parasympathetic side, so the exhale is the longest
 * phase rather than a symmetric box.
 */
const PHASES: Array<{ id: UIKey; seconds: number; scale: number }> = [
  { id: "breatheIn", seconds: 4, scale: 1 },
  { id: "breatheHold", seconds: 4, scale: 1 },
  { id: "breatheOut", seconds: 6, scale: 0.55 },
];

export function BreathingSpace() {
  const { t } = useLanguage();
  const { calm, setCalm } = useCalmMode();

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [breaths, setBreaths] = useState(0);

  // Advance the cycle. The timeout callback is the only thing calling
  // setState, so this never cascades renders on mount.
  useEffect(() => {
    const phase = PHASES[phaseIndex];
    const isLastPhase = phaseIndex === PHASES.length - 1;

    const timer = setTimeout(() => {
      setPhaseIndex((index) => (index + 1) % PHASES.length);
      if (isLastPhase) setBreaths((count) => count + 1);
    }, phase.seconds * 1000);

    return () => clearTimeout(timer);
  }, [phaseIndex]);

  const savedRaw = useSyncExternalStore(
    subscribeToSavedProgress,
    getSavedProgressSnapshot,
    getServerProgressSnapshot,
  );

  const phase = PHASES[phaseIndex];

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-14 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        className="flex w-full flex-col items-center"
      >
        <h1 className="font-display text-ink text-3xl font-semibold tracking-tight">
          {t("pauseTitle")}
        </h1>
        <p className="text-ink-soft mt-4 max-w-md text-center text-[15px] leading-relaxed text-pretty">
          {t("pauseIntro")}
        </p>

        {/* The one animation in the app that is the feature rather than
            decoration, so it opts out of calm mode explicitly. */}
        <MotionConfig reducedMotion="never">
          <div className="relative mt-14 flex h-64 w-64 items-center justify-center">
            <motion.span
              aria-hidden="true"
              className="bg-sage-200/35 absolute h-full w-full rounded-full blur-2xl"
              animate={{ scale: phase.scale, opacity: phase.scale }}
              transition={{ duration: phase.seconds, ease: "easeInOut" }}
            />
            <motion.span
              aria-hidden="true"
              className="border-sage-300/60 absolute h-52 w-52 rounded-full border"
              animate={{ scale: phase.scale }}
              transition={{ duration: phase.seconds, ease: "easeInOut" }}
            />
            <motion.span
              aria-hidden="true"
              className="bg-surface/70 ring-sage-200/70 absolute flex h-40 w-40 items-center justify-center rounded-full ring-1 backdrop-blur-sm"
              animate={{ scale: phase.scale }}
              transition={{ duration: phase.seconds, ease: "easeInOut" }}
            />

            <div className="relative flex flex-col items-center">
              <motion.p
                key={phase.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-display text-sage-700 text-xl font-semibold"
              >
                {t(phase.id)}
              </motion.p>
              <LeafMark className="text-sage-300 mt-2 h-5 w-5" />
            </div>
          </div>
        </MotionConfig>

        {/* Announced politely so the cue is available without watching. */}
        <p className="sr-only" aria-live="polite">
          {t(phase.id)}
        </p>

        <p className="text-ink-muted mt-12 text-sm tabular-nums">
          {breaths} {t("breathsTaken")}
        </p>
        <p className="text-ink-muted/70 mt-1.5 text-center text-xs">
          {t("pauseReassurance")}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {savedRaw ? (
            <Link
              href="/assessment"
              onClick={markAutoResume}
              className="bg-sage-500 hover:bg-sage-600 rounded-full px-7 py-3.5 text-[15px] font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              {t("returnToCheckIn")}
            </Link>
          ) : null}
          <Link
            href="/"
            className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink rounded-full border bg-surface px-7 py-3.5 text-[15px] font-medium transition-colors"
          >
            {t("backHome")}
          </Link>
        </div>

        {/* Motion preference, relocated here from the header where it was an
            unlabelled icon nobody could interpret. */}
        <section className="border-hairline/70 mt-16 w-full border-t pt-8">
          <h2 className="text-ink-muted text-xs font-medium tracking-widest uppercase">
            {t("pauseSettingsTitle")}
          </h2>

          <label className="border-hairline/70 mt-4 flex cursor-pointer items-start gap-4 rounded-2xl border bg-surface/60 p-5">
            <input
              type="checkbox"
              checked={calm}
              onChange={(event) => setCalm(event.target.checked)}
              className="accent-sage-500 mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
            />
            <span>
              <span className="text-ink block text-[15px] font-medium">
                {t("calmSettingLabel")}
              </span>
              <span className="text-ink-soft mt-1 block text-sm leading-relaxed">
                {t("calmSettingBody")}
              </span>
            </span>
          </label>
        </section>
      </motion.div>
    </main>
  );
}

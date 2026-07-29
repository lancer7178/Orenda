"use client";

import { useEffect, useState, useSyncExternalStore, useRef } from "react";
import Link from "next/link";
import { MotionConfig, motion, useMotionValue, useTransform, animate } from "motion/react";
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

const TOTAL_CYCLE = PHASES.reduce((sum, p) => sum + p.seconds, 0);

/* SVG arc constants */
const ARC_RADIUS = 46;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

export function BreathingSpace() {
  const { t } = useLanguage();
  const { calm, setCalm } = useCalmMode();

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [breaths, setBreaths] = useState(0);

  /* Countdown arc — gives ADHD brains a concrete visual timer to anchor to */
  const arcProgress = useMotionValue(0);
  const arcDashoffset = useTransform(
    arcProgress,
    [0, 1],
    [ARC_CIRCUMFERENCE, 0],
  );

  // Advance the cycle and animate the arc.
  useEffect(() => {
    const phase = PHASES[phaseIndex];
    const isLastPhase = phaseIndex === PHASES.length - 1;

    // Reset and animate the countdown arc for this phase
    arcProgress.set(0);
    const arcAnimation = animate(arcProgress, 1, {
      duration: phase.seconds,
      ease: "linear",
    });

    const timer = setTimeout(() => {
      setPhaseIndex((index) => (index + 1) % PHASES.length);
      if (isLastPhase) setBreaths((count) => count + 1);
    }, phase.seconds * 1000);

    return () => {
      clearTimeout(timer);
      arcAnimation.stop();
    };
  }, [phaseIndex, arcProgress]);

  const savedRaw = useSyncExternalStore(
    subscribeToSavedProgress,
    getSavedProgressSnapshot,
    getServerProgressSnapshot,
  );

  const phase = PHASES[phaseIndex];

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-20 sm:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="flex w-full flex-col items-center"
      >
        {/* Title & intro */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-display text-ink text-3xl font-semibold tracking-tight"
        >
          {t("pauseTitle")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-ink-soft mt-5 max-w-sm text-center text-[15px] leading-relaxed text-pretty"
        >
          {t("pauseIntro")}
        </motion.p>

        {/* The one animation in the app that is the feature rather than
            decoration, so it opts out of calm mode explicitly. */}
        <MotionConfig reducedMotion="never">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.8, ease: "easeOut" }}
            className="relative mt-20 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72"
          >
            {/* Soft ambient glow — breathes with the cycle */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-[-20%] rounded-full"
              animate={{ opacity: 0.25 + 0.2 * phase.scale }}
              transition={{ duration: phase.seconds, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--color-sage-200) 35%, transparent), transparent)",
              }}
            />

            {/* Outer ring — barely visible, breathes gently */}
            <motion.span
              aria-hidden="true"
              className="border-sage-200/25 absolute h-full w-full rounded-full border"
              animate={{ scale: phase.scale }}
              transition={{ duration: phase.seconds, ease: "easeInOut" }}
            />

            {/* Inner ring */}
            <motion.span
              aria-hidden="true"
              className="border-sage-200/35 absolute h-[75%] w-[75%] rounded-full border"
              animate={{ scale: phase.scale }}
              transition={{
                duration: phase.seconds,
                ease: "easeInOut",
                delay: 0.08,
              }}
            />

            {/* Glass core — the visual anchor */}
            <motion.span
              aria-hidden="true"
              className="ring-sage-100/50 absolute flex h-[52%] w-[52%] items-center justify-center rounded-full ring-1 backdrop-blur-sm"
              animate={{ scale: phase.scale }}
              transition={{
                duration: phase.seconds,
                ease: "easeInOut",
                delay: 0.04,
              }}
              style={{
                background:
                  "radial-gradient(circle at 45% 40%, rgba(255,254,252,0.75), rgba(255,254,252,0.4) 80%)",
              }}
            />

            {/* Soft pulse — only on inhale */}
            <motion.span
              aria-hidden="true"
              className="bg-sage-100/15 absolute h-[52%] w-[52%] rounded-full"
              animate={{
                scale: phase.id === "breatheIn" ? [1, 1.45] : 1,
                opacity: phase.id === "breatheIn" ? [0.3, 0] : 0,
              }}
              transition={{ duration: phase.seconds, ease: "easeOut" }}
            />

            {/* Completion ripple — micro-reward when a full cycle finishes */}
            <motion.span
              key={breaths}
              aria-hidden="true"
              className="bg-sage-200/20 absolute h-[52%] w-[52%] rounded-full"
              initial={{ scale: 1, opacity: breaths > 0 ? 0.4 : 0 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />

            {/* Countdown arc — the ADHD anchor, shows time left in this phase */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            >
              <motion.circle
                cx="50"
                cy="50"
                r={ARC_RADIUS}
                fill="none"
                stroke="var(--color-sage-300)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray={ARC_CIRCUMFERENCE}
                style={{ strokeDashoffset: arcDashoffset }}
                opacity={0.45}
              />
            </svg>

            {/* Center content */}
            <div className="relative flex flex-col items-center gap-2.5">
              <motion.p
                key={phase.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="font-display text-sage-600 text-lg font-semibold tracking-tight sm:text-xl"
              >
                {t(phase.id)}
              </motion.p>
              <LeafMark className="text-sage-300 h-4 w-4" />
            </div>
          </motion.div>
        </MotionConfig>

        {/* Announced politely so the cue is available without watching. */}
        <p className="sr-only" aria-live="polite">
          {t(phase.id)}
        </p>

        {/* Phase indicator dots — shows where you are in the cycle
            (in · hold · out) so you always know what's next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 flex items-center gap-3"
          aria-hidden="true"
        >
          {PHASES.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              {i > 0 && (
                <span className="bg-sage-200/40 h-px w-4" />
              )}
              <motion.span
                animate={{
                  scale: i === phaseIndex ? 1 : 0.75,
                  opacity: i === phaseIndex ? 1 : 0.35,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="bg-sage-400 flex h-2 w-2 items-center justify-center rounded-full"
              />
            </div>
          ))}
        </motion.div>

        {/* Breath counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <p className="text-ink-muted text-sm tabular-nums">
            {breaths} {t("breathsTaken")}
          </p>
          <p className="text-ink-muted/50 max-w-[16rem] text-center text-xs leading-relaxed">
            {t("pauseReassurance")}
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {savedRaw ? (
            <Link
              href="/assessment"
              onClick={markAutoResume}
              className="bg-sage-500 hover:bg-sage-600 rounded-full px-7 py-3.5 text-[15px] font-medium text-white transition-colors duration-500"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              {t("returnToCheckIn")}
            </Link>
          ) : null}
          <Link
            href="/"
            className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink rounded-full border bg-surface px-7 py-3.5 text-[15px] font-medium transition-colors duration-500"
          >
            {t("backHome")}
          </Link>
        </motion.div>

        {/* Motion preference */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-20 w-full"
        >
          <div className="border-hairline/40 border-t pt-8">
            <h2 className="text-ink-muted/70 text-xs font-medium tracking-widest uppercase">
              {t("pauseSettingsTitle")}
            </h2>

            <label className="border-hairline/50 mt-4 flex cursor-pointer items-start gap-4 rounded-2xl border bg-surface/40 p-5 transition-colors duration-500 hover:bg-surface/70">
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
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}

"use client";

import { motion } from "motion/react";
import type { ResultTone } from "@/lib/types";

const TONE_VAR: Record<ResultTone, string> = {
  steady: "var(--color-tone-steady)",
  mild: "var(--color-tone-mild)",
  moderate: "var(--color-tone-moderate)",
  elevated: "var(--color-tone-elevated)",
  high: "var(--color-tone-high)",
};

interface ScoreDialProps {
  score: number;
  maxScore: number;
  tone: ResultTone;
  caption: string;
  outOfLabel: string;
}

const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Leaves a gap at the bottom so the arc reads as a dial, not a ring. */
const SWEEP = 0.78;

export function ScoreDial({
  score,
  maxScore,
  tone,
  caption,
  outOfLabel,
}: ScoreDialProps) {
  const ratio = maxScore > 0 ? Math.min(score / maxScore, 1) : 0;
  const track = CIRCUMFERENCE * SWEEP;

  return (
    <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 160 160"
        className="absolute inset-0 h-full w-full -rotate-[139deg]"
        aria-hidden="true"
      >
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${track} ${CIRCUMFERENCE}`}
        />
        <motion.circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          stroke={TONE_VAR[tone]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${track} ${CIRCUMFERENCE}`}
          initial={{ strokeDashoffset: track }}
          animate={{ strokeDashoffset: track * (1 - ratio) }}
          transition={{ duration: 1.5, delay: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </svg>

      <div className="relative flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-display text-ink text-5xl leading-none font-semibold tabular-nums"
        >
          {score}
        </motion.span>
        <span className="text-ink-muted mt-2 text-xs tabular-nums">
          {outOfLabel} {maxScore}
        </span>
        <span className="text-ink-muted mt-0.5 text-[11px] tracking-wide uppercase">
          {caption}
        </span>
      </div>
    </div>
  );
}

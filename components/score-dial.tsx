"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { ResultTone } from "@/lib/types";

const TONE_VAR: Record<ResultTone, string> = {
  steady: "var(--color-tone-steady)",
  mild: "var(--color-tone-mild)",
  moderate: "var(--color-tone-moderate)",
  elevated: "var(--color-tone-elevated)",
  high: "var(--color-tone-high)",
};

const TONE_GLOW: Record<ResultTone, string> = {
  steady: "rgba(141, 163, 153, 0.2)",
  mild: "rgba(127, 154, 164, 0.2)",
  moderate: "rgba(183, 154, 109, 0.2)",
  elevated: "rgba(191, 138, 114, 0.2)",
  high: "rgba(169, 112, 122, 0.2)",
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

/** Animate a number from 0 up to `target` over `durationMs`. */
function useCountUp(target: number, durationMs: number = 1200, delayMs: number = 500) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame = 0;

    const timeout = setTimeout(() => {
      let start: number | null = null;
      const step = (timestamp: number) => {
        if (start === null) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / durationMs, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        setCurrent(Math.round(eased * target));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delayMs);

    // Retaking the assessment unmounts this mid-count; without the cancel the
    // loop keeps ticking against a dead component.
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs, delayMs]);

  return current;
}

export function ScoreDial({
  score,
  maxScore,
  tone,
  caption,
  outOfLabel,
}: ScoreDialProps) {
  const ratio = maxScore > 0 ? Math.min(score / maxScore, 1) : 0;
  const track = CIRCUMFERENCE * SWEEP;
  const displayScore = useCountUp(score);

  return (
    <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
      {/* Glow halo behind the dial */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute inset-[-12%] rounded-full"
        style={{
          background: `radial-gradient(circle, ${TONE_GLOW[tone]}, transparent 70%)`,
        }}
      />

      <svg
        viewBox="0 0 160 160"
        className="absolute inset-0 h-full w-full rotate-[-139deg]"
        aria-hidden="true"
      >
        {/* Ghost track for depth */}
        <circle
          cx="80"
          cy="80"
          r={RADIUS + 6}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE * SWEEP} ${CIRCUMFERENCE}`}
          opacity="0.3"
        />

        {/* Main track */}
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

        {/* Animated fill */}
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
          transition={{
            duration: 1.5,
            delay: 0.35,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        />
      </svg>

      {/* Score text */}
      <div className="relative flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-display text-ink text-5xl leading-none font-semibold tabular-nums"
        >
          {displayScore}
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

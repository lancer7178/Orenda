"use client";

import { motion } from "motion/react";

interface ProgressBarProps {
  /** 0–1 completion ratio. */
  value: number;
  label: string;
}

/**
 * A deliberately slow bar. The spec asks for a sense of progress without
 * urgency, so the fill eases over 900ms rather than snapping to its new width.
 */
export function ProgressBar({ value, label }: ProgressBarProps) {
  const percent = Math.round(value * 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="bg-hairline/50 h-[3px] w-full overflow-hidden rounded-full"
    >
      <motion.div
        className="from-sage-300 to-sage-500 h-full rounded-full bg-gradient-to-r"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      />
    </div>
  );
}

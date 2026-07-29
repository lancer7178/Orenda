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
 * Now with a glowing leading edge and subtle shimmer.
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
      className="bg-hairline/50 relative h-1 w-full overflow-hidden rounded-full"
    >
      <motion.div
        className="from-sage-300 via-sage-400 to-sage-500 relative h-full rounded-full bg-linear-to-r"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {/* Shimmer sheen */}
        <span
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden rounded-full"
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
              animation: "shimmer 3s ease-in-out infinite",
            }}
          />
        </span>

        {/* Glowing leading dot */}
        {percent > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-0 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full"
            style={{
              background: "var(--color-sage-400)",
              boxShadow: "0 0 8px 2px rgba(119, 144, 127, 0.4)",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

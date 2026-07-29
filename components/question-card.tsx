"use client";

import { motion } from "motion/react";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  preamble: string;
  categoryLabel: string;
  /** The previously chosen score, if the user has been here before. */
  selectedScore?: number;
  /** The score chosen just now, held during the auto-advance pause. */
  pendingScore: number | null;
  onSelect: (score: number) => void;
  disabled: boolean;
}

const transition = { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] as const };

export function QuestionCard({
  question,
  preamble,
  categoryLabel,
  selectedScore,
  pendingScore,
  onSelect,
  disabled,
}: QuestionCardProps) {
  const active = pendingScore ?? selectedScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={transition}
    >
      <span className="border-sage-200/70 text-sage-600 inline-flex rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide uppercase">
        {categoryLabel}
      </span>

      <p className="text-ink-muted mt-6 text-sm">{preamble}</p>

      <h1 className="font-display text-ink mt-2 text-[27px] leading-[1.3] font-semibold tracking-tight text-balance sm:text-[34px] sm:leading-[1.28]">
        {question.text}
      </h1>

      <div
        role="group"
        aria-label={question.text}
        className="mt-9 flex flex-col gap-3"
      >
        {question.answers.map((answer) => {
          const isActive = active === answer.score;
          const isDimmed = pendingScore !== null && !isActive;

          return (
            <button
              key={answer.id}
              type="button"
              onClick={() => onSelect(answer.score)}
              disabled={disabled}
              aria-pressed={isActive}
              className={[
                "group relative flex w-full items-center gap-4 rounded-full border px-6 py-4 text-start text-[15px] transition-all duration-300 sm:text-base",
                isActive
                  ? "border-sage-500 bg-sage-500 text-white shadow-sage-600/20 shadow-md"
                  : "border-hairline text-ink bg-surface/80 hover:border-sage-300 hover:bg-sage-50/70",
                isDimmed ? "opacity-40" : "opacity-100",
                disabled ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  isActive
                    ? "border-white/70 bg-white/20"
                    : "border-hairline group-hover:border-sage-300",
                ].join(" ")}
              >
                {isActive ? (
                  <motion.svg
                    viewBox="0 0 12 12"
                    fill="none"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.22 }}
                    className="h-3 w-3"
                  >
                    <path
                      d="M2.5 6.2 4.9 8.5 9.5 3.6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                ) : null}
              </span>
              <span className="flex-1">{answer.text}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

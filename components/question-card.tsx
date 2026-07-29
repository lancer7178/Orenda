"use client";

import { motion } from "motion/react";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  /** The stem for this question's section, e.g. "Over the last two weeks…". */
  preamble: string;
  /** Name of the section the question belongs to. */
  sectionLabel: string;
  /** The previously chosen score, if the user has been here before. */
  selectedScore?: number;
  /** The score chosen just now, held during the auto-advance pause. */
  pendingScore: number | null;
  onSelect: (score: number) => void;
  disabled: boolean;
}

const transition = { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const };

const answerVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

export function QuestionCard({
  question,
  preamble,
  sectionLabel,
  selectedScore,
  pendingScore,
  onSelect,
  disabled,
}: QuestionCardProps) {
  const active = pendingScore ?? selectedScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={transition}
      className="glass-card rounded-3xl p-6 sm:p-8"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...transition, delay: 0.1 }}
        className="border-sage-200/70 text-sage-600 inline-flex rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide uppercase"
      >
        {sectionLabel}
      </motion.span>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition, delay: 0.15 }}
        className="text-ink-muted mt-6 text-sm"
      >
        {preamble}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: 0.2 }}
        className="font-display text-ink mt-2 text-[27px] leading-[1.3] font-semibold tracking-tight text-balance sm:text-[34px] sm:leading-[1.28]"
      >
        {question.text}
      </motion.h1>

      <motion.div
        role="group"
        aria-label={question.text}
        className="mt-8 flex flex-col gap-2.5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {question.answers.map((answer) => {
          const isActive = active === answer.score;
          const isDimmed = pendingScore !== null && !isActive;

          return (
            <motion.button
              key={answer.id}
              type="button"
              onClick={() => onSelect(answer.score)}
              disabled={disabled}
              aria-pressed={isActive}
              variants={answerVariants}
              transition={transition}
              whileHover={!disabled ? { scale: 1.01, x: 3 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              className={[
                "group relative flex w-full items-center gap-4 rounded-full border px-6 py-3.5 text-start text-[15px] transition-all duration-300 sm:text-base",
                isActive
                  ? "border-sage-500 bg-sage-500 text-white shadow-md"
                  : "border-hairline text-ink bg-surface/80 hover:border-sage-300 hover:bg-sage-50/70",
                isDimmed ? "opacity-40" : "opacity-100",
                disabled ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
              style={
                isActive
                  ? { boxShadow: "0 4px 20px -4px rgba(119, 144, 127, 0.35)" }
                  : {}
              }
            >
              <span
                aria-hidden="true"
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                  isActive
                    ? "border-white/70 bg-white/20"
                    : "border-hairline group-hover:border-sage-300",
                ].join(" ")}
              >
                {isActive ? (
                  <motion.svg
                    viewBox="0 0 12 12"
                    fill="none"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, type: "spring", stiffness: 400, damping: 15 }}
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

              {/* Selection pulse ripple */}
              {isActive ? (
                <motion.span
                  aria-hidden="true"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="bg-sage-400/30 pointer-events-none absolute inset-0 rounded-full"
                />
              ) : null}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

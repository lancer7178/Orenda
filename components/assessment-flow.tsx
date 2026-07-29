"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "./language-provider";
import { ProgressBar } from "./progress-bar";
import { QuestionCard } from "./question-card";
import { ResultScreen } from "./result-screen";
import {
  assessmentReducer,
  initialAssessmentState,
  selectProgress,
} from "@/lib/assessment";
import { resolveQuestion } from "@/lib/content";
import { QUESTIONS } from "@/lib/questions";

/** The pause between selecting an answer and the next question sliding in. */
const AUTO_ADVANCE_MS = 500;

export function AssessmentFlow() {
  const { t, locale, isRtl } = useLanguage();
  const [state, dispatch] = useReducer(
    assessmentReducer,
    initialAssessmentState,
  );

  // Held while the highlight is visible but before the question changes, so
  // the user sees their choice register before anything moves.
  const [pendingScore, setPendingScore] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const localizedQuestion = QUESTIONS[state.currentQuestionIndex];
  const question = resolveQuestion(localizedQuestion, locale);

  const handleSelect = useCallback(
    (score: number) => {
      if (pendingScore !== null) return;

      setPendingScore(score);
      clearTimer();
      timerRef.current = setTimeout(() => {
        dispatch({ type: "answer", questionId: localizedQuestion.id, score });
        setPendingScore(null);
        timerRef.current = null;
      }, AUTO_ADVANCE_MS);
    },
    [pendingScore, clearTimer, localizedQuestion.id],
  );

  const handleBack = useCallback(() => {
    clearTimer();
    setPendingScore(null);
    dispatch({ type: "back" });
  }, [clearTimer]);

  const handleRetake = useCallback(() => {
    clearTimer();
    setPendingScore(null);
    dispatch({ type: "reset" });
  }, [clearTimer]);

  if (state.isCompleted) {
    return (
      <>
        <div className="mx-auto w-full max-w-3xl px-5 pt-6 sm:px-8">
          <ProgressBar value={1} label={t("progressAria")} />
          <div className="mt-4 flex justify-start">
            <BackButton onClick={handleBack} label={t("back")} isRtl={isRtl} />
          </div>
        </div>
        <ResultScreen state={state} onRetake={handleRetake} />
      </>
    );
  }

  const canGoBack = state.currentQuestionIndex > 0;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-6 pb-16 sm:px-8">
      <ProgressBar value={selectProgress(state)} label={t("progressAria")} />

      <div className="mt-4 flex items-center justify-between">
        {canGoBack ? (
          <BackButton onClick={handleBack} label={t("back")} isRtl={isRtl} />
        ) : (
          <span />
        )}

        <p className="text-ink-muted text-xs tabular-nums">
          {t("progressLabel")} {state.currentQuestionIndex + 1} {t("progressOf")}{" "}
          {QUESTIONS.length}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center py-10 sm:py-14">
        <AnimatePresence mode="wait" initial={false}>
          <QuestionCard
            key={question.id}
            question={question}
            preamble={t("preamble")}
            categoryLabel={
              localizedQuestion.category === "depression"
                ? t("categoryDepression")
                : t("categoryEmotional")
            }
            selectedScore={state.answersRecord[question.id]}
            pendingScore={pendingScore}
            onSelect={handleSelect}
            disabled={pendingScore !== null}
          />
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-ink-muted mt-auto text-center text-xs"
      >
        {t("privacyBadge")}
      </motion.p>
    </main>
  );
}

function BackButton({
  onClick,
  label,
  isRtl,
}: {
  onClick: () => void;
  label: string;
  isRtl: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-ink-muted hover:text-ink -ms-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors"
    >
      <span aria-hidden="true">{isRtl ? "→" : "←"}</span>
      {label}
    </button>
  );
}

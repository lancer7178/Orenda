"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "./language-provider";
import { ProgressBar } from "./progress-bar";
import { QuestionCard } from "./question-card";
import { ResultScreen } from "./result-screen";
import { SectionIntro } from "./section-intro";
import { SectionProgress } from "./section-progress";
import {
  assessmentReducer,
  deserializeProgress,
  initialAssessmentState,
  selectAnsweredCount,
  selectMinutesRemaining,
  selectProgress,
  selectSectionPosition,
  selectSectionsCompleted,
  serializeProgress,
} from "@/lib/assessment";
import {
  clearProgress,
  getAutoResumeSnapshot,
  getSavedProgressSnapshot,
  getServerAutoResumeSnapshot,
  getServerProgressSnapshot,
  saveProgress,
  subscribeToSavedProgress,
} from "@/lib/progress-store";
import { resolveQuestion } from "@/lib/content";
import { DOMAIN_BY_ID, DOMAIN_ORDER } from "@/lib/domains";
import { QUESTIONS, QUESTION_COUNT_BY_DOMAIN } from "@/lib/questions";

/** The pause between selecting an answer and the next question sliding in. */
const AUTO_ADVANCE_MS = 500;

type ResumeDecision = "pending" | "resolved";

export function AssessmentFlow() {
  const { t, tx, locale, isRtl } = useLanguage();
  const [state, dispatch] = useReducer(
    assessmentReducer,
    initialAssessmentState,
  );

  // Whatever was in storage when the page loaded, if anything.
  const savedRaw = useSyncExternalStore(
    subscribeToSavedProgress,
    getSavedProgressSnapshot,
    getServerProgressSnapshot,
  );
  const savedState = useMemo(
    () => (savedRaw ? deserializeProgress(savedRaw) : null),
    [savedRaw],
  );
  // Coming back from the breathing space should feel like stepping back into
  // the room, not like being asked whether you meant to leave.
  const returningFromPause = useSyncExternalStore(
    subscribeToSavedProgress,
    getAutoResumeSnapshot,
    getServerAutoResumeSnapshot,
  );
  const [resume, setResume] = useState<ResumeDecision>("pending");

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

  const answeredCount = selectAnsweredCount(state);

  // Save after every answer. Guarded on having answers so the empty starting
  // state can never wipe a run the user has not decided about yet.
  useEffect(() => {
    if (answeredCount > 0) saveProgress(serializeProgress(state));
  }, [state, answeredCount]);

  const localizedQuestion = QUESTIONS[state.currentQuestionIndex];
  const question = resolveQuestion(localizedQuestion, locale);
  const domain = DOMAIN_BY_ID[localizedQuestion.domain];

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
    clearProgress();
    dispatch({ type: "reset" });
    setResume("resolved");
  }, [clearTimer]);

  const handleContinue = useCallback(() => {
    if (savedState) dispatch({ type: "restore", state: savedState });
    setResume("resolved");
  }, [savedState]);

  const handleStartFresh = useCallback(() => {
    clearProgress();
    dispatch({ type: "reset" });
    setResume("resolved");
  }, []);

  // Returning from a breathing break restores in place instead of asking.
  // Adjusting state during render is the supported React pattern for this;
  // the guards mean it can run at most once.
  if (
    resume === "pending" &&
    returningFromPause &&
    savedState !== null &&
    answeredCount === 0 &&
    state.currentQuestionIndex === 0
  ) {
    dispatch({ type: "restore", state: savedState });
    setResume("resolved");
  }

  // -- Resume prompt --------------------------------------------------------
  if (resume === "pending" && savedState !== null && !returningFromPause) {
    return (
      <ResumePrompt
        answered={selectAnsweredCount(savedState)}
        total={QUESTIONS.length}
        onContinue={handleContinue}
        onStartFresh={handleStartFresh}
      />
    );
  }

  // -- Result ---------------------------------------------------------------
  if (state.isCompleted) {
    return (
      <>
        <div className="mx-auto w-full max-w-3xl px-5 pt-6 sm:px-8">
          <ProgressBar value={1} label={t("progressAria")} />
          <div className="mt-4">
            <BackButton onClick={handleBack} label={t("back")} isRtl={isRtl} />
          </div>
        </div>
        <ResultScreen state={state} onRetake={handleRetake} />
      </>
    );
  }

  // -- Question / section flow ---------------------------------------------
  const introDomain = state.pendingSectionIntro
    ? DOMAIN_BY_ID[state.pendingSectionIntro]
    : null;
  const canGoBack = state.currentQuestionIndex > 0;
  const sectionNumber = DOMAIN_ORDER.indexOf(domain.id) + 1;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-6 pb-16 sm:px-8">
      <ProgressBar value={selectProgress(state)} label={t("progressAria")} />

      <div className="mt-4 flex items-center justify-between gap-4">
        {canGoBack ? (
          <BackButton onClick={handleBack} label={t("back")} isRtl={isRtl} />
        ) : (
          <span />
        )}

        <motion.p
          key={state.currentQuestionIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-ink-muted/70 text-xs tabular-nums"
        >
          {introDomain ? (
            <>
              {t("sectionLabel")} {DOMAIN_ORDER.indexOf(introDomain.id) + 1}{" "}
              {t("progressOf")} {DOMAIN_ORDER.length}
            </>
          ) : (
            <>
              {state.currentQuestionIndex + 1} {t("progressOf")}{" "}
              {QUESTIONS.length}
            </>
          )}
        </motion.p>
      </div>

      {/* The prominent readout is section-relative, so the visible horizon is
          the next five or six questions rather than all fifty-five. */}
      {introDomain ? null : (
        <div className="mt-3">
          <SectionProgress
            section={selectSectionPosition(state)}
            sectionName={tx(domain.name)}
            minutesRemaining={selectMinutesRemaining(state)}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col justify-center py-10 sm:py-14">
        <AnimatePresence mode="wait" initial={false}>
          {introDomain ? (
            <SectionIntro
              key={`intro-${introDomain.id}`}
              domain={introDomain}
              questionCount={QUESTION_COUNT_BY_DOMAIN[introDomain.id]}
              sectionsCompleted={selectSectionsCompleted(state)}
              onBegin={() => dispatch({ type: "dismissIntro" })}
            />
          ) : (
            <QuestionCard
              key={question.id}
              question={question}
              preamble={tx(domain.prompt)}
              sectionLabel={`${sectionNumber}. ${tx(domain.name)}`}
              selectedScore={state.answersRecord[question.id]}
              pendingScore={pendingScore}
              onSelect={handleSelect}
              disabled={pendingScore !== null}
              // Surfaced only for the first few questions, then retired so it
              // stops competing for attention once the habit is formed.
              showKeyboardHint={answeredCount < 3}
              keyboardHint={t("keyboardHint")}
            />
          )}
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-ink-muted mt-auto text-center text-xs"
      >
        {answeredCount > 0 ? t("savedLocally") : t("privacyBadge")}
      </motion.p>
    </main>
  );
}

// ---------------------------------------------------------------------------

function ResumePrompt({
  answered,
  total,
  onContinue,
  onStartFresh,
}: {
  answered: number;
  total: number;
  onContinue: () => void;
  onStartFresh: () => void;
}) {
  const { t } = useLanguage();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-20 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="glass-card rounded-3xl p-7 sm:p-9"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <h1 className="font-display text-ink text-2xl font-semibold tracking-tight">
          {t("resumeTitle")}
        </h1>
        <p className="text-ink-soft mt-3 leading-relaxed">{t("resumeBody")}</p>

        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-sage-700 bg-sage-50/70 border-sage-200/60 mt-5 inline-flex rounded-full border px-4 py-1.5 text-sm font-medium tabular-nums"
        >
          {answered} / {total} {t("resumeAnswered")}
        </motion.p>

        <div className="mt-8 flex flex-wrap gap-3">
          <motion.button
            type="button"
            onClick={onContinue}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="bg-sage-500 hover:bg-sage-600 rounded-full px-7 py-3.5 text-[15px] font-medium text-white shadow-lg transition-all duration-300"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            {t("resumeContinue")}
          </motion.button>
          <motion.button
            type="button"
            onClick={onStartFresh}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink rounded-full border bg-surface px-7 py-3.5 text-[15px] font-medium transition-colors"
          >
            {t("resumeRestart")}
          </motion.button>
        </div>
      </motion.div>
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
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: isRtl ? 3 : -3 }}
      whileTap={{ scale: 0.95 }}
      className="text-ink-muted hover:text-ink -ms-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors"
    >
      <span aria-hidden="true">{isRtl ? "→" : "←"}</span>
      {label}
    </motion.button>
  );
}

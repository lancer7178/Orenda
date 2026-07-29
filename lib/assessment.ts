import { QUESTIONS, RISK_ITEM_IDS } from "./questions";
import type { AssessmentState, QuestionCategory } from "./types";

export const initialAssessmentState: AssessmentState = {
  currentQuestionIndex: 0,
  totalScore: 0,
  answersRecord: {},
  isCompleted: false,
};

export type AssessmentAction =
  | { type: "answer"; questionId: string; score: number }
  | { type: "back" }
  | { type: "reset" };

function sumScores(answersRecord: Record<string, number>): number {
  return Object.values(answersRecord).reduce((total, score) => total + score, 0);
}

export function assessmentReducer(
  state: AssessmentState,
  action: AssessmentAction,
): AssessmentState {
  switch (action.type) {
    case "answer": {
      // Recomputed from the record rather than accumulated, so revisiting an
      // earlier question and changing the answer stays consistent.
      const answersRecord = {
        ...state.answersRecord,
        [action.questionId]: action.score,
      };
      const isLastQuestion =
        state.currentQuestionIndex === QUESTIONS.length - 1;

      return {
        currentQuestionIndex: isLastQuestion
          ? state.currentQuestionIndex
          : state.currentQuestionIndex + 1,
        totalScore: sumScores(answersRecord),
        answersRecord,
        isCompleted: isLastQuestion,
      };
    }

    case "back": {
      if (state.currentQuestionIndex === 0 && !state.isCompleted) return state;

      return {
        ...state,
        // Leaving the result screen returns to the final question, which is
        // already answered — the selection stays visible.
        currentQuestionIndex: state.isCompleted
          ? state.currentQuestionIndex
          : state.currentQuestionIndex - 1,
        isCompleted: false,
      };
    }

    case "reset":
      return initialAssessmentState;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

/** 0–1 completion ratio, used by the progress bar. */
export function selectProgress(state: AssessmentState): number {
  if (state.isCompleted) return 1;
  return state.currentQuestionIndex / QUESTIONS.length;
}

export function selectAnsweredCount(state: AssessmentState): number {
  return Object.keys(state.answersRecord).length;
}

export function selectScoreByCategory(
  state: AssessmentState,
): Record<QuestionCategory, number> {
  const totals: Record<QuestionCategory, number> = {
    depression: 0,
    emotional: 0,
  };

  for (const question of QUESTIONS) {
    const score = state.answersRecord[question.id];
    if (score !== undefined) totals[question.category] += score;
  }

  return totals;
}

/**
 * True when the user reported any thoughts of self-harm (PHQ-9 item 9). Crisis
 * support is surfaced on its own merits here, independent of the total score.
 */
export function selectHasRiskFlag(state: AssessmentState): boolean {
  return RISK_ITEM_IDS.some((id) => (state.answersRecord[id] ?? 0) > 0);
}

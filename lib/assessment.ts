import { DOMAIN_BY_ID, DOMAIN_ORDER, DOMAINS } from "./domains";
import {
  MAX_SCORE_BY_DOMAIN,
  QUESTIONS,
  RISK_ITEM_IDS,
} from "./questions";
import type {
  AssessmentState,
  DomainId,
  DomainResult,
  QuestionCategory,
} from "./types";

export const initialAssessmentState: AssessmentState = {
  currentQuestionIndex: 0,
  totalScore: 0,
  answersRecord: {},
  isCompleted: false,
  // The battery opens on the first section card rather than cold on question 1.
  pendingSectionIntro: DOMAIN_ORDER[0],
};

export type AssessmentAction =
  | { type: "answer"; questionId: string; score: number }
  | { type: "dismissIntro" }
  | { type: "back" }
  | { type: "reset" }
  | { type: "restore"; state: AssessmentState };

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
      const isLastQuestion = state.currentQuestionIndex === QUESTIONS.length - 1;

      if (isLastQuestion) {
        return {
          ...state,
          answersRecord,
          totalScore: sumScores(answersRecord),
          isCompleted: true,
          pendingSectionIntro: null,
        };
      }

      const nextIndex = state.currentQuestionIndex + 1;
      const current = QUESTIONS[state.currentQuestionIndex];
      const next = QUESTIONS[nextIndex];

      // Crossing into a new section shows its opening card first — but only
      // the first time through, so stepping back and forward is not blocked.
      const entersNewSection =
        next.domain !== current.domain &&
        answersRecord[next.id] === undefined;

      return {
        currentQuestionIndex: nextIndex,
        totalScore: sumScores(answersRecord),
        answersRecord,
        isCompleted: false,
        pendingSectionIntro: entersNewSection ? next.domain : null,
      };
    }

    case "dismissIntro":
      return state.pendingSectionIntro === null
        ? state
        : { ...state, pendingSectionIntro: null };

    case "back": {
      // From a section card, step back into the last question of the previous
      // section rather than re-showing the card.
      if (state.pendingSectionIntro !== null) {
        if (state.currentQuestionIndex === 0) return state;
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex - 1,
          pendingSectionIntro: null,
        };
      }

      // Leaving the result screen returns to the final question, which is
      // already answered — the selection stays visible.
      if (state.isCompleted) {
        return { ...state, isCompleted: false };
      }

      if (state.currentQuestionIndex === 0) return state;

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
      };
    }

    case "reset":
      return initialAssessmentState;

    case "restore":
      return action.state;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

/** 0–1 completion ratio, driven by answers given rather than position. */
export function selectProgress(state: AssessmentState): number {
  if (state.isCompleted) return 1;
  return selectAnsweredCount(state) / QUESTIONS.length;
}

export function selectAnsweredCount(state: AssessmentState): number {
  return Object.keys(state.answersRecord).length;
}

export function selectCurrentDomain(state: AssessmentState): DomainId {
  return (
    state.pendingSectionIntro ?? QUESTIONS[state.currentQuestionIndex].domain
  );
}

/** 1-based position of the active section, for "Section 3 of 9". */
export function selectSectionNumber(state: AssessmentState): number {
  return DOMAIN_ORDER.indexOf(selectCurrentDomain(state)) + 1;
}

export function selectScoreByDomain(
  state: AssessmentState,
): Record<DomainId, number> {
  const totals = Object.fromEntries(
    DOMAIN_ORDER.map((id) => [id, 0]),
  ) as Record<DomainId, number>;

  for (const question of QUESTIONS) {
    const score = state.answersRecord[question.id];
    if (score !== undefined) totals[question.domain] += score;
  }

  return totals;
}

/** Preserved from the original schema: the coarse depression/emotional split. */
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

/** Full per-domain readout, in presentation order. */
export function selectDomainResults(state: AssessmentState): DomainResult[] {
  const scores = selectScoreByDomain(state);

  return DOMAINS.map((domain) => {
    const score = scores[domain.id];
    const maxScore = MAX_SCORE_BY_DOMAIN[domain.id];
    const ratio = maxScore > 0 ? score / maxScore : 0;
    const band =
      domain.bands.find((candidate) => ratio <= candidate.maxRatio) ??
      domain.bands[domain.bands.length - 1];

    return { domain, score, maxScore, ratio, band };
  });
}

/**
 * The areas carrying the most weight, strongest first. Ties are broken by
 * presentation order so the output is stable.
 */
export function selectTopDomains(
  state: AssessmentState,
  count = 3,
): DomainResult[] {
  return selectDomainResults(state)
    .filter((result) => result.band.id !== "settled")
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, count);
}

/** Areas that came back settled — worth naming as intact, not just absent. */
export function selectSteadyDomains(state: AssessmentState): DomainResult[] {
  return selectDomainResults(state).filter(
    (result) => result.band.id === "settled",
  );
}

/**
 * True when the user reported any thoughts of self-harm (PHQ-9 item 9). Crisis
 * support is surfaced on its own merits here, independent of the total score.
 */
export function selectHasRiskFlag(state: AssessmentState): boolean {
  return RISK_ITEM_IDS.some((id) => (state.answersRecord[id] ?? 0) > 0);
}

export function selectDomainName(id: DomainId) {
  return DOMAIN_BY_ID[id].name;
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

/**
 * A 55-item battery is long enough that losing your place is a real cost, so
 * progress is saved. It goes to localStorage and nowhere else — same device,
 * same privacy guarantee as the scoring itself.
 */
export const PROGRESS_STORAGE_KEY = "orenda.progress.v2";

interface StoredProgress {
  version: 2;
  answersRecord: Record<string, number>;
  currentQuestionIndex: number;
  isCompleted: boolean;
}

export function serializeProgress(state: AssessmentState): string {
  const payload: StoredProgress = {
    version: 2,
    answersRecord: state.answersRecord,
    currentQuestionIndex: state.currentQuestionIndex,
    isCompleted: state.isCompleted,
  };
  return JSON.stringify(payload);
}

const VALID_QUESTION_IDS = new Set(QUESTIONS.map((question) => question.id));

/**
 * Rebuilds state from a stored payload, dropping anything that no longer
 * matches the current battery. Returns null when there is nothing usable, so a
 * stale or hand-edited entry can never produce a bogus score.
 */
export function deserializeProgress(raw: string): AssessmentState | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;
  const payload = parsed as Partial<StoredProgress>;
  if (payload.version !== 2) return null;
  if (typeof payload.answersRecord !== "object" || payload.answersRecord === null)
    return null;

  const answersRecord: Record<string, number> = {};
  for (const [id, score] of Object.entries(payload.answersRecord)) {
    if (!VALID_QUESTION_IDS.has(id)) continue;
    if (typeof score !== "number" || !Number.isFinite(score)) continue;

    const question = QUESTIONS.find((candidate) => candidate.id === id);
    if (!question?.answers.some((answer) => answer.score === score)) continue;

    answersRecord[id] = score;
  }

  const answeredCount = Object.keys(answersRecord).length;
  if (answeredCount === 0) return null;

  const index =
    typeof payload.currentQuestionIndex === "number" &&
    Number.isInteger(payload.currentQuestionIndex)
      ? Math.min(Math.max(payload.currentQuestionIndex, 0), QUESTIONS.length - 1)
      : 0;

  const isCompleted =
    payload.isCompleted === true && answeredCount === QUESTIONS.length;

  return {
    currentQuestionIndex: index,
    totalScore: sumScores(answersRecord),
    answersRecord,
    isCompleted,
    pendingSectionIntro: null,
  };
}

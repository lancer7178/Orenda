/**
 * Core schema for the Orenda screening flow.
 *
 * The `Answer` / `Question` / `ResultLevel` / `AssessmentState` shapes below are
 * the runtime contract described in the project schema. Because the app ships in
 * both English and Arabic, the *source* content is authored as `Localized*`
 * variants that carry every locale, and is resolved down to the plain schema
 * shapes for the active locale (see `lib/content.ts`).
 */

export type Locale = "en" | "ar";

/** A string authored once per supported locale. */
export type LocalizedText = Record<Locale, string>;

export type QuestionCategory = "emotional" | "depression";

// ---------------------------------------------------------------------------
// 1. Answer
// ---------------------------------------------------------------------------

export interface Answer {
  id: string;
  /** The label shown to the user (e.g., "Several days"). */
  text: string;
  /** The numerical value attached to the answer (e.g., 1). */
  score: number;
}

export interface LocalizedAnswer {
  id: string;
  text: LocalizedText;
  score: number;
}

// ---------------------------------------------------------------------------
// 2. Question
// ---------------------------------------------------------------------------

export interface Question {
  id: string;
  category: QuestionCategory;
  /** The question text (e.g., "Little interest or pleasure in doing things?"). */
  text: string;
  answers: Answer[];
}

export interface LocalizedQuestion {
  id: string;
  category: QuestionCategory;
  text: LocalizedText;
  answers: LocalizedAnswer[];
  /**
   * Marks an item where any non-zero response warrants surfacing crisis
   * support immediately, regardless of the total score (PHQ-9 item 9).
   */
  isRiskItem?: boolean;
}

// ---------------------------------------------------------------------------
// 3. Result level
// ---------------------------------------------------------------------------

export interface ResultLevel {
  minScore: number;
  maxScore: number;
  /** The classification (e.g., "Mild emotional distress"). */
  label: string;
  /** Empathetic and supportive feedback message. */
  message: string;
  /** Next steps (e.g., "Talk to a professional", "Read this guide"). */
  actionCall: string;
}

export type ResultTone = "steady" | "mild" | "moderate" | "elevated" | "high";

export interface LocalizedResultLevel {
  minScore: number;
  maxScore: number;
  label: LocalizedText;
  message: LocalizedText;
  actionCall: LocalizedText;
  /** Drives the accent colour of the result screen. */
  tone: ResultTone;
}

// ---------------------------------------------------------------------------
// 4. Assessment state
// ---------------------------------------------------------------------------

export interface AssessmentState {
  /** Tracks the current active question. */
  currentQuestionIndex: number;
  /** The cumulative score. */
  totalScore: number;
  /** Maps question IDs to selected scores (allows going "Back"). */
  answersRecord: Record<string, number>;
  /** Flag to trigger the Result Screen. */
  isCompleted: boolean;
}

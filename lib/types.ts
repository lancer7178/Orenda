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

/**
 * The coarse axis from the original schema. Every question still resolves to
 * one of these; `DomainId` is the finer grouping the analysis actually reports
 * on.
 */
export type QuestionCategory = "emotional" | "depression";

/** The nine areas the battery covers, in the order they are presented. */
export type DomainId =
  | "mood"
  | "anxiety"
  | "stress"
  | "sleep"
  | "somatic"
  | "connection"
  | "selfWorth"
  | "functioning"
  | "resilience";

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

/**
 * A reusable response scale. Domains borrow the response format of the
 * instrument they are modelled on, so the app carries several.
 */
export interface AnswerScale {
  id: string;
  options: ReadonlyArray<{ text: LocalizedText; score: number }>;
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
  domain: DomainId;
  text: LocalizedText;
  answers: LocalizedAnswer[];
  /**
   * Marks an item where any non-zero response warrants surfacing crisis
   * support immediately, regardless of the total score (PHQ-9 item 9).
   */
  isRiskItem?: boolean;
}

// ---------------------------------------------------------------------------
// 3. Domains
// ---------------------------------------------------------------------------

/** Severity steps shared by every domain, low to high. */
export type BandId = "settled" | "noticeable" | "elevated" | "high";

export interface DomainBand {
  id: BandId;
  /** Inclusive upper bound as a fraction of the domain's maximum score. */
  maxRatio: number;
  /** One-sentence reading of what this level means for this domain. */
  reading: LocalizedText;
}

export interface Domain {
  id: DomainId;
  category: QuestionCategory;
  name: LocalizedText;
  /** What this section is asking about, shown on its opening card. */
  blurb: LocalizedText;
  /** The instrument the items are modelled on. */
  instrument: LocalizedText;
  /** The stem that precedes every question in the section. */
  prompt: LocalizedText;
  /**
   * True when the items are positively worded and reverse-scored, so a high
   * domain score still means "more strain" like every other domain.
   */
  isReverseScored?: boolean;
  bands: DomainBand[];
}

export interface DomainResult {
  domain: Domain;
  score: number;
  maxScore: number;
  /** 0–1. */
  ratio: number;
  band: DomainBand;
}

// ---------------------------------------------------------------------------
// 4. Result level
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
// 5. Assessment state
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
  /**
   * When set, the section opener for this domain is showing instead of a
   * question. Long batteries need a breath between sections.
   */
  pendingSectionIntro: DomainId | null;
}

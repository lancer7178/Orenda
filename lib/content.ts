import { RESULT_LEVELS } from "./results";
import { QUESTIONS } from "./questions";
import type {
  Locale,
  LocalizedQuestion,
  LocalizedResultLevel,
  LocalizedText,
  Question,
  ResultLevel,
} from "./types";

/** Reads a localized string for the active locale. */
export function text(value: LocalizedText, locale: Locale): string {
  return value[locale];
}

/** Flattens a localized question down to the plain `Question` schema shape. */
export function resolveQuestion(
  question: LocalizedQuestion,
  locale: Locale,
): Question {
  return {
    id: question.id,
    category: question.category,
    text: question.text[locale],
    answers: question.answers.map((answer) => ({
      id: answer.id,
      text: answer.text[locale],
      score: answer.score,
    })),
  };
}

export function resolveQuestions(locale: Locale): Question[] {
  return QUESTIONS.map((question) => resolveQuestion(question, locale));
}

export function resolveResultLevel(
  level: LocalizedResultLevel,
  locale: Locale,
): ResultLevel {
  return {
    minScore: level.minScore,
    maxScore: level.maxScore,
    label: level.label[locale],
    message: level.message[locale],
    actionCall: level.actionCall[locale],
  };
}

/**
 * Finds the band a total score falls into. Falls back to the highest band so a
 * score above the defined range can never return `undefined`.
 */
export function getResultLevel(totalScore: number): LocalizedResultLevel {
  return (
    RESULT_LEVELS.find(
      (level) => totalScore >= level.minScore && totalScore <= level.maxScore,
    ) ?? RESULT_LEVELS[RESULT_LEVELS.length - 1]
  );
}

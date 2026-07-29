import type { AnswerScale } from "./types";

/**
 * Response scales, each borrowed from the instrument the matching section is
 * modelled on. Keeping the original response format matters: a PHQ-9 item
 * scored on an agreement scale is no longer a PHQ-9 item.
 */

/** PHQ-9 / GAD-7 two-week frequency. 0–3. */
export const FREQUENCY_4: AnswerScale = {
  id: "freq4",
  options: [
    { text: { en: "Not at all", ar: "ولا مرة" }, score: 0 },
    { text: { en: "Several days", ar: "عدة أيام" }, score: 1 },
    {
      text: { en: "More than half the days", ar: "أكثر من نصف الأيام" },
      score: 2,
    },
    { text: { en: "Nearly every day", ar: "تقريباً كل يوم" }, score: 3 },
  ],
};

/** Perceived Stress Scale frequency. 0–4. */
export const FREQUENCY_5: AnswerScale = {
  id: "freq5",
  options: [
    { text: { en: "Never", ar: "أبداً" }, score: 0 },
    { text: { en: "Almost never", ar: "نادراً جداً" }, score: 1 },
    { text: { en: "Sometimes", ar: "أحياناً" }, score: 2 },
    { text: { en: "Fairly often", ar: "كثيراً" }, score: 3 },
    { text: { en: "Very often", ar: "كثيراً جداً" }, score: 4 },
  ],
};

/** Insomnia Severity Index / PHQ-15 style severity. 0–4. */
export const SEVERITY_5: AnswerScale = {
  id: "sev5",
  options: [
    { text: { en: "Not at all", ar: "إطلاقاً" }, score: 0 },
    { text: { en: "Mild", ar: "خفيف" }, score: 1 },
    { text: { en: "Moderate", ar: "متوسط" }, score: 2 },
    { text: { en: "Severe", ar: "شديد" }, score: 3 },
    { text: { en: "Very severe", ar: "شديد جداً" }, score: 4 },
  ],
};

/** WHODAS-style interference. 0–4. */
export const INTERFERENCE_5: AnswerScale = {
  id: "interfere5",
  options: [
    { text: { en: "Not at all", ar: "إطلاقاً" }, score: 0 },
    { text: { en: "A little", ar: "قليلاً" }, score: 1 },
    { text: { en: "Somewhat", ar: "إلى حد ما" }, score: 2 },
    { text: { en: "Quite a bit", ar: "كثيراً" }, score: 3 },
    { text: { en: "Extremely", ar: "بشكل بالغ" }, score: 4 },
  ],
};

const AGREEMENT_LABELS = [
  { en: "Strongly disagree", ar: "لا أوافق بشدة" },
  { en: "Disagree", ar: "لا أوافق" },
  { en: "Neither", ar: "محايد" },
  { en: "Agree", ar: "أوافق" },
  { en: "Strongly agree", ar: "أوافق بشدة" },
] as const;

/** Rosenberg-style agreement, negatively worded item. Agreeing scores high. */
export const AGREEMENT_5: AnswerScale = {
  id: "agree5",
  options: AGREEMENT_LABELS.map((text, index) => ({ text, score: index })),
};

/**
 * The same agreement scale for positively worded items. Scores run backwards
 * so that agreeing ("I bounce back quickly") lowers the strain total — the
 * reverse-scoring is baked into the data rather than special-cased in the
 * reducer.
 */
export const AGREEMENT_5_REVERSED: AnswerScale = {
  id: "agree5r",
  options: AGREEMENT_LABELS.map((text, index) => ({
    text,
    score: AGREEMENT_LABELS.length - 1 - index,
  })),
};

import type { LocalizedAnswer, LocalizedQuestion } from "./types";

/**
 * The four-point frequency scale used by the PHQ-9. Every item shares it, so it
 * is defined once and cloned per question with a stable, question-scoped id.
 */
const FREQUENCY_SCALE: ReadonlyArray<Omit<LocalizedAnswer, "id">> = [
  {
    text: { en: "Not at all", ar: "ولا مرة" },
    score: 0,
  },
  {
    text: { en: "Several days", ar: "عدة أيام" },
    score: 1,
  },
  {
    text: { en: "More than half the days", ar: "أكثر من نصف الأيام" },
    score: 2,
  },
  {
    text: { en: "Nearly every day", ar: "تقريباً كل يوم" },
    score: 3,
  },
];

function scaleFor(questionId: string): LocalizedAnswer[] {
  return FREQUENCY_SCALE.map((answer, index) => ({
    ...answer,
    id: `${questionId}-a${index}`,
  }));
}

type QuestionSeed = Omit<LocalizedQuestion, "answers">;

/**
 * Items 1–9 are the PHQ-9 (Patient Health Questionnaire), a validated screening
 * instrument for depressive symptoms. Items 10–13 add a short emotional-load
 * check covering tension, overwhelm, disconnection and restlessness.
 *
 * Scores: 0–3 per item across 13 items → 0–39 total.
 */
const SEEDS: QuestionSeed[] = [
  {
    id: "phq-1",
    category: "depression",
    text: {
      en: "Little interest or pleasure in doing things?",
      ar: "قلّة الاهتمام أو المتعة في القيام بالأشياء؟",
    },
  },
  {
    id: "phq-2",
    category: "depression",
    text: {
      en: "Feeling down, depressed, or hopeless?",
      ar: "الشعور بالإحباط أو الاكتئاب أو فقدان الأمل؟",
    },
  },
  {
    id: "phq-3",
    category: "depression",
    text: {
      en: "Trouble falling asleep, staying asleep, or sleeping too much?",
      ar: "صعوبة في الخلود إلى النوم أو الاستمرار فيه، أو النوم أكثر من اللازم؟",
    },
  },
  {
    id: "phq-4",
    category: "depression",
    text: {
      en: "Feeling tired, or having little energy?",
      ar: "الشعور بالتعب أو قلة الطاقة؟",
    },
  },
  {
    id: "phq-5",
    category: "depression",
    text: {
      en: "Poor appetite, or eating more than usual?",
      ar: "ضعف الشهية، أو الإفراط في الأكل؟",
    },
  },
  {
    id: "phq-6",
    category: "depression",
    text: {
      en: "Feeling bad about yourself, or that you have let yourself or your family down?",
      ar: "الشعور بالسوء تجاه نفسك، أو أنك خذلت نفسك أو عائلتك؟",
    },
  },
  {
    id: "phq-7",
    category: "depression",
    text: {
      en: "Trouble concentrating on things, such as reading or watching something?",
      ar: "صعوبة في التركيز على الأشياء، مثل القراءة أو متابعة شيء ما؟",
    },
  },
  {
    id: "phq-8",
    category: "depression",
    text: {
      en: "Moving or speaking noticeably slowly — or the opposite, feeling restless and unable to sit still?",
      ar: "الحركة أو الكلام ببطء يلاحظه الآخرون — أو العكس، التململ وعدم القدرة على الثبات في مكانك؟",
    },
  },
  {
    id: "phq-9",
    category: "depression",
    isRiskItem: true,
    text: {
      en: "Thoughts that you would be better off gone, or of hurting yourself in some way?",
      ar: "أفكار بأنك ستكون أفضل حالاً لو رحلت، أو أفكار بإيذاء نفسك بطريقة ما؟",
    },
  },
  {
    id: "emo-1",
    category: "emotional",
    text: {
      en: "Feeling nervous, anxious, or on edge?",
      ar: "الشعور بالتوتر أو القلق أو التوجّس؟",
    },
  },
  {
    id: "emo-2",
    category: "emotional",
    text: {
      en: "Feeling that difficulties were piling up so high you could not get past them?",
      ar: "الشعور بأن الصعوبات تتراكم لدرجة يصعب معها تجاوزها؟",
    },
  },
  {
    id: "emo-3",
    category: "emotional",
    text: {
      en: "Feeling emotionally distant from the people closest to you?",
      ar: "الشعور بالبُعد العاطفي عمّن هم أقرب إليك؟",
    },
  },
  {
    id: "emo-4",
    category: "emotional",
    text: {
      en: "Struggling to find calm or comfort, even when you had time to rest?",
      ar: "صعوبة في إيجاد الهدوء أو الراحة، حتى حين يتاح لك وقت للاستجمام؟",
    },
  },
];

export const QUESTIONS: LocalizedQuestion[] = SEEDS.map((seed) => ({
  ...seed,
  answers: scaleFor(seed.id),
}));

export const MAX_SCORE = QUESTIONS.reduce(
  (total, question) =>
    total + Math.max(...question.answers.map((answer) => answer.score)),
  0,
);

export const MAX_SCORE_BY_CATEGORY = QUESTIONS.reduce<Record<string, number>>(
  (totals, question) => {
    const highest = Math.max(...question.answers.map((a) => a.score));
    totals[question.category] = (totals[question.category] ?? 0) + highest;
    return totals;
  },
  {},
);

/** Question ids where any non-zero answer should surface crisis support. */
export const RISK_ITEM_IDS = QUESTIONS.filter((q) => q.isRiskItem).map(
  (q) => q.id,
);

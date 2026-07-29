import { DOMAIN_BY_ID, DOMAIN_ORDER } from "./domains";
import {
  AGREEMENT_5,
  AGREEMENT_5_REVERSED,
  FREQUENCY_4,
  FREQUENCY_5,
  INTERFERENCE_5,
  SEVERITY_5,
} from "./scales";
import type {
  AnswerScale,
  DomainId,
  LocalizedAnswer,
  LocalizedQuestion,
  LocalizedText,
} from "./types";

interface QuestionSeed {
  id: string;
  domain: DomainId;
  scale: AnswerScale;
  text: LocalizedText;
  isRiskItem?: boolean;
}

function answersFrom(scale: AnswerScale, questionId: string): LocalizedAnswer[] {
  return scale.options.map((option, index) => ({
    id: `${questionId}-a${index}`,
    text: option.text,
    score: option.score,
  }));
}

/**
 * The battery. Items are grouped by the instrument they come from and kept in
 * that instrument's own response format; nothing here is invented wording where
 * a validated item exists.
 */
const SEEDS: QuestionSeed[] = [
  // -- Mood — PHQ-9 --------------------------------------------------------
  {
    id: "mood-1",
    domain: "mood",
    scale: FREQUENCY_4,
    text: {
      en: "Little interest or pleasure in doing things?",
      ar: "قلّة الاهتمام أو المتعة في القيام بالأشياء؟",
    },
  },
  {
    id: "mood-2",
    domain: "mood",
    scale: FREQUENCY_4,
    text: {
      en: "Feeling down, depressed, or hopeless?",
      ar: "الشعور بالإحباط أو الاكتئاب أو فقدان الأمل؟",
    },
  },
  {
    id: "mood-3",
    domain: "mood",
    scale: FREQUENCY_4,
    text: {
      en: "Trouble falling asleep, staying asleep, or sleeping too much?",
      ar: "صعوبة في الخلود إلى النوم أو الاستمرار فيه، أو النوم أكثر من اللازم؟",
    },
  },
  {
    id: "mood-4",
    domain: "mood",
    scale: FREQUENCY_4,
    text: {
      en: "Feeling tired, or having little energy?",
      ar: "الشعور بالتعب أو قلة الطاقة؟",
    },
  },
  {
    id: "mood-5",
    domain: "mood",
    scale: FREQUENCY_4,
    text: {
      en: "Poor appetite, or eating more than usual?",
      ar: "ضعف الشهية، أو الإفراط في الأكل؟",
    },
  },
  {
    id: "mood-6",
    domain: "mood",
    scale: FREQUENCY_4,
    text: {
      en: "Feeling bad about yourself, or that you have let yourself or your family down?",
      ar: "الشعور بالسوء تجاه نفسك، أو أنك خذلت نفسك أو عائلتك؟",
    },
  },
  {
    id: "mood-7",
    domain: "mood",
    scale: FREQUENCY_4,
    text: {
      en: "Trouble concentrating on things, such as reading or following something?",
      ar: "صعوبة في التركيز على الأشياء، مثل القراءة أو متابعة شيء ما؟",
    },
  },
  {
    id: "mood-8",
    domain: "mood",
    scale: FREQUENCY_4,
    text: {
      en: "Moving or speaking noticeably slowly — or the opposite, feeling restless and unable to sit still?",
      ar: "الحركة أو الكلام ببطء يلاحظه الآخرون — أو العكس، التململ وعدم القدرة على الثبات في مكانك؟",
    },
  },
  {
    id: "mood-9",
    domain: "mood",
    scale: FREQUENCY_4,
    isRiskItem: true,
    text: {
      en: "Thoughts that you would be better off gone, or of hurting yourself in some way?",
      ar: "أفكار بأنك ستكون أفضل حالاً لو رحلت، أو أفكار بإيذاء نفسك بطريقة ما؟",
    },
  },

  // -- Anxiety — GAD-7 -----------------------------------------------------
  {
    id: "anx-1",
    domain: "anxiety",
    scale: FREQUENCY_4,
    text: {
      en: "Feeling nervous, anxious, or on edge?",
      ar: "الشعور بالتوتر أو القلق أو التوجّس؟",
    },
  },
  {
    id: "anx-2",
    domain: "anxiety",
    scale: FREQUENCY_4,
    text: {
      en: "Not being able to stop or control worrying?",
      ar: "عدم القدرة على إيقاف القلق أو السيطرة عليه؟",
    },
  },
  {
    id: "anx-3",
    domain: "anxiety",
    scale: FREQUENCY_4,
    text: {
      en: "Worrying too much about different things?",
      ar: "الإفراط في القلق بشأن أمور مختلفة؟",
    },
  },
  {
    id: "anx-4",
    domain: "anxiety",
    scale: FREQUENCY_4,
    text: { en: "Trouble relaxing?", ar: "صعوبة في الاسترخاء؟" },
  },
  {
    id: "anx-5",
    domain: "anxiety",
    scale: FREQUENCY_4,
    text: {
      en: "Being so restless that it is hard to sit still?",
      ar: "التململ الشديد لدرجة يصعب معها الجلوس بثبات؟",
    },
  },
  {
    id: "anx-6",
    domain: "anxiety",
    scale: FREQUENCY_4,
    text: {
      en: "Becoming easily annoyed or irritable?",
      ar: "الانزعاج أو التهيّج بسهولة؟",
    },
  },
  {
    id: "anx-7",
    domain: "anxiety",
    scale: FREQUENCY_4,
    text: {
      en: "Feeling afraid, as if something awful might happen?",
      ar: "الشعور بالخوف وكأن شيئاً فظيعاً قد يحدث؟",
    },
  },

  // -- Stress — Perceived Stress Scale -------------------------------------
  {
    id: "str-1",
    domain: "stress",
    scale: FREQUENCY_5,
    text: {
      en: "…that you were unable to control the important things in your life?",
      ar: "…أنك غير قادر على التحكم في الأمور المهمة في حياتك؟",
    },
  },
  {
    id: "str-2",
    domain: "stress",
    scale: FREQUENCY_5,
    text: { en: "…nervous and under pressure?", ar: "…بالتوتر وبأنك تحت ضغط؟" },
  },
  {
    id: "str-3",
    domain: "stress",
    scale: FREQUENCY_5,
    text: {
      en: "…that difficulties were piling up so high you could not get past them?",
      ar: "…أن الصعوبات تتراكم لدرجة يصعب معها تجاوزها؟",
    },
  },
  {
    id: "str-4",
    domain: "stress",
    scale: FREQUENCY_5,
    text: {
      en: "…unable to cope with everything you had to do?",
      ar: "…بعدم القدرة على التعامل مع كل ما عليك فعله؟",
    },
  },
  {
    id: "str-5",
    domain: "stress",
    scale: FREQUENCY_5,
    text: {
      en: "…angered by things that were outside your control?",
      ar: "…بالغضب من أمور خارجة عن سيطرتك؟",
    },
  },
  {
    id: "str-6",
    domain: "stress",
    scale: FREQUENCY_5,
    text: {
      en: "…that you were falling behind no matter what you did?",
      ar: "…أنك تتخلّف عن الركب مهما فعلت؟",
    },
  },

  // -- Sleep — Insomnia Severity Index -------------------------------------
  {
    id: "slp-1",
    domain: "sleep",
    scale: SEVERITY_5,
    text: {
      en: "Difficulty falling asleep",
      ar: "صعوبة في الخلود إلى النوم",
    },
  },
  {
    id: "slp-2",
    domain: "sleep",
    scale: SEVERITY_5,
    text: {
      en: "Difficulty staying asleep through the night",
      ar: "صعوبة في الاستمرار في النوم طوال الليل",
    },
  },
  {
    id: "slp-3",
    domain: "sleep",
    scale: SEVERITY_5,
    text: {
      en: "Waking much earlier than you meant to",
      ar: "الاستيقاظ أبكر بكثير ممّا قصدت",
    },
  },
  {
    id: "slp-4",
    domain: "sleep",
    scale: SEVERITY_5,
    text: {
      en: "Waking unrefreshed, however long you slept",
      ar: "الاستيقاظ دون انتعاش، مهما طالت مدة نومك",
    },
  },
  {
    id: "slp-5",
    domain: "sleep",
    scale: SEVERITY_5,
    text: {
      en: "Sleep problems getting in the way of your day",
      ar: "تأثير مشكلات النوم على سير يومك",
    },
  },
  {
    id: "slp-6",
    domain: "sleep",
    scale: SEVERITY_5,
    text: {
      en: "Worrying about your sleep, or dreading bedtime",
      ar: "القلق بشأن نومك، أو الرهبة من موعد النوم",
    },
  },

  // -- Somatic — PHQ-15 ----------------------------------------------------
  {
    id: "som-1",
    domain: "somatic",
    scale: SEVERITY_5,
    text: { en: "Headaches", ar: "صداع" },
  },
  {
    id: "som-2",
    domain: "somatic",
    scale: SEVERITY_5,
    text: {
      en: "Stomach or digestive trouble",
      ar: "اضطرابات في المعدة أو الهضم",
    },
  },
  {
    id: "som-3",
    domain: "somatic",
    scale: SEVERITY_5,
    text: {
      en: "Aching muscles, back, or joints",
      ar: "آلام في العضلات أو الظهر أو المفاصل",
    },
  },
  {
    id: "som-4",
    domain: "somatic",
    scale: SEVERITY_5,
    text: {
      en: "Your heart racing or pounding",
      ar: "تسارع أو خفقان في القلب",
    },
  },
  {
    id: "som-5",
    domain: "somatic",
    scale: SEVERITY_5,
    text: {
      en: "Shortness of breath, or tightness in your chest",
      ar: "ضيق في التنفس، أو ضيق في الصدر",
    },
  },
  {
    id: "som-6",
    domain: "somatic",
    scale: SEVERITY_5,
    text: {
      en: "Feeling dizzy, faint, or unsteady",
      ar: "الشعور بالدوار أو الإغماء أو عدم الاتزان",
    },
  },

  // -- Connection — UCLA Loneliness Scale ----------------------------------
  {
    id: "con-1",
    domain: "connection",
    scale: FREQUENCY_5,
    text: { en: "…that you lacked companionship?", ar: "…بافتقاد الرفقة؟" },
  },
  {
    id: "con-2",
    domain: "connection",
    scale: FREQUENCY_5,
    text: {
      en: "…left out, even when people were around?",
      ar: "…بأنك مستبعَد، حتى في وجود الناس؟",
    },
  },
  {
    id: "con-3",
    domain: "connection",
    scale: FREQUENCY_5,
    text: {
      en: "…that nobody really knows you well?",
      ar: "…بأن لا أحد يعرفك حق المعرفة؟",
    },
  },
  {
    id: "con-4",
    domain: "connection",
    scale: FREQUENCY_5,
    text: {
      en: "…unable to reach out to someone when you needed to?",
      ar: "…بعدم القدرة على التواصل مع أحد حين احتجت إلى ذلك؟",
    },
  },
  {
    id: "con-5",
    domain: "connection",
    scale: FREQUENCY_5,
    text: {
      en: "…that you had to hide how you were really doing?",
      ar: "…بأن عليك إخفاء حقيقة ما تمر به؟",
    },
  },

  // -- Self-worth — Rosenberg ----------------------------------------------
  {
    id: "slf-1",
    domain: "selfWorth",
    scale: AGREEMENT_5,
    text: {
      en: "I feel I do not have much to be proud of.",
      ar: "أشعر أنه ليس لديّ الكثير لأفخر به.",
    },
  },
  {
    id: "slf-2",
    domain: "selfWorth",
    scale: AGREEMENT_5,
    text: {
      en: "At times I think I am no good at all.",
      ar: "أحياناً أظن أنني لا أصلح لشيء على الإطلاق.",
    },
  },
  {
    id: "slf-3",
    domain: "selfWorth",
    scale: AGREEMENT_5_REVERSED,
    text: {
      en: "I am able to do things as well as most other people.",
      ar: "أستطيع أن أفعل الأشياء بكفاءة مثل معظم الناس.",
    },
  },
  {
    id: "slf-4",
    domain: "selfWorth",
    scale: AGREEMENT_5,
    text: {
      en: "I wish I could have more respect for myself.",
      ar: "أتمنى لو كان لديّ احترام أكبر لنفسي.",
    },
  },
  {
    id: "slf-5",
    domain: "selfWorth",
    scale: AGREEMENT_5_REVERSED,
    text: {
      en: "On the whole, I am satisfied with myself.",
      ar: "بشكل عام، أنا راضٍ عن نفسي.",
    },
  },

  // -- Functioning — WHODAS 2.0 --------------------------------------------
  {
    id: "fun-1",
    domain: "functioning",
    scale: INTERFERENCE_5,
    text: { en: "Your work or your studies", ar: "عملك أو دراستك" },
  },
  {
    id: "fun-2",
    domain: "functioning",
    scale: INTERFERENCE_5,
    text: {
      en: "Looking after your home and everyday responsibilities",
      ar: "الاعتناء ببيتك ومسؤولياتك اليومية",
    },
  },
  {
    id: "fun-3",
    domain: "functioning",
    scale: INTERFERENCE_5,
    text: {
      en: "Keeping up with family and friends",
      ar: "مواكبة العائلة والأصدقاء",
    },
  },
  {
    id: "fun-4",
    domain: "functioning",
    scale: INTERFERENCE_5,
    text: {
      en: "Doing the things you normally enjoy",
      ar: "ممارسة الأشياء التي تستمتع بها عادةً",
    },
  },
  {
    id: "fun-5",
    domain: "functioning",
    scale: INTERFERENCE_5,
    text: {
      en: "Looking after yourself — eating, washing, moving",
      ar: "العناية بنفسك — الطعام والنظافة والحركة",
    },
  },

  // -- Resilience — Brief Resilience Scale (reverse-scored) ----------------
  {
    id: "res-1",
    domain: "resilience",
    scale: AGREEMENT_5_REVERSED,
    text: {
      en: "I tend to bounce back quickly after hard times.",
      ar: "أميل إلى النهوض سريعاً بعد الأوقات الصعبة.",
    },
  },
  {
    id: "res-2",
    domain: "resilience",
    scale: AGREEMENT_5,
    text: {
      en: "I have a hard time making it through stressful events.",
      ar: "أجد صعوبة في تجاوز الأحداث المُجهِدة.",
    },
  },
  {
    id: "res-3",
    domain: "resilience",
    scale: AGREEMENT_5_REVERSED,
    text: {
      en: "It does not take me long to recover from a setback.",
      ar: "لا يستغرقني التعافي من الانتكاسة وقتاً طويلاً.",
    },
  },
  {
    id: "res-4",
    domain: "resilience",
    scale: AGREEMENT_5,
    text: {
      en: "It is hard for me to steady myself when something bad happens.",
      ar: "يصعب عليّ أن أستعيد توازني حين يحدث شيء سيئ.",
    },
  },
  {
    id: "res-5",
    domain: "resilience",
    scale: AGREEMENT_5_REVERSED,
    text: {
      en: "I usually come through difficult times with little trouble.",
      ar: "عادةً ما أجتاز الأوقات الصعبة دون متاعب كبيرة.",
    },
  },
  {
    id: "res-6",
    domain: "resilience",
    scale: AGREEMENT_5,
    text: {
      en: "I tend to take a long time to get over setbacks in my life.",
      ar: "أميل إلى أخذ وقت طويل لتجاوز انتكاسات حياتي.",
    },
  },
];

/** Presented in domain order, so each section runs contiguously. */
export const QUESTIONS: LocalizedQuestion[] = DOMAIN_ORDER.flatMap((domainId) =>
  SEEDS.filter((seed) => seed.domain === domainId).map((seed) => ({
    id: seed.id,
    domain: seed.domain,
    category: DOMAIN_BY_ID[seed.domain].category,
    text: seed.text,
    answers: answersFrom(seed.scale, seed.id),
    ...(seed.isRiskItem ? { isRiskItem: true as const } : {}),
  })),
);

function highestScore(question: LocalizedQuestion): number {
  return Math.max(...question.answers.map((answer) => answer.score));
}

export const MAX_SCORE = QUESTIONS.reduce(
  (total, question) => total + highestScore(question),
  0,
);

export const MAX_SCORE_BY_DOMAIN = QUESTIONS.reduce<Record<string, number>>(
  (totals, question) => {
    totals[question.domain] = (totals[question.domain] ?? 0) + highestScore(question);
    return totals;
  },
  {},
) as Record<DomainId, number>;

export const MAX_SCORE_BY_CATEGORY = QUESTIONS.reduce<Record<string, number>>(
  (totals, question) => {
    totals[question.category] =
      (totals[question.category] ?? 0) + highestScore(question);
    return totals;
  },
  {},
);

export const QUESTION_COUNT_BY_DOMAIN = QUESTIONS.reduce<Record<string, number>>(
  (counts, question) => {
    counts[question.domain] = (counts[question.domain] ?? 0) + 1;
    return counts;
  },
  {},
) as Record<DomainId, number>;

/** Index of the first question in each domain, for section headers. */
export const FIRST_INDEX_BY_DOMAIN = QUESTIONS.reduce<Record<string, number>>(
  (indexes, question, index) => {
    indexes[question.domain] ??= index;
    return indexes;
  },
  {},
) as Record<DomainId, number>;

/** Question ids where any non-zero answer should surface crisis support. */
export const RISK_ITEM_IDS = QUESTIONS.filter((q) => q.isRiskItem).map(
  (q) => q.id,
);

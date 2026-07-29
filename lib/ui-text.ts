import type { Locale, LocalizedText } from "./types";

/** Every piece of chrome copy, authored per locale. */
const UI = {
  brand: { en: "Orenda", ar: "أوريندا" },
  brandMeaning: {
    en: "the quiet force in you that can change your own course",
    ar: "القوة الهادئة الكامنة فيك والقادرة على تغيير مسارك",
  },

  // Landing -----------------------------------------------------------------
  landingEyebrow: {
    en: "A private moment with yourself",
    ar: "لحظة خاصة مع نفسك",
  },
  landingTitle: {
    en: "How have the last two weeks actually been?",
    ar: "كيف كان الأسبوعان الماضيان في حقيقتهما؟",
  },
  landingBody: {
    en: "Thirteen questions, one at a time, no timer. Orenda reflects back what you report using validated screening scales — it will not diagnose you, and it will not remember you.",
    ar: "ثلاثة عشر سؤالاً، واحداً تلو الآخر، دون مؤقّت. تعكس لك أوريندا ما تذكره اعتماداً على مقاييس تقييم معتمدة — لن تشخّصك، ولن تحتفظ بشيء عنك.",
  },
  startCta: { en: "Begin when you're ready", ar: "ابدأ حين تكون مستعداً" },
  landingMetaQuestions: { en: "13 questions", ar: "١٣ سؤالاً" },
  landingMetaTime: { en: "about 3 minutes", ar: "نحو ٣ دقائق" },
  landingMetaNoTimer: { en: "no timer", ar: "بلا مؤقّت" },

  principleOneTitle: { en: "Nothing leaves this device", ar: "لا شيء يغادر جهازك" },
  principleOneBody: {
    en: "Every answer and every calculation happens in your browser. There is no account, no server, no analytics on what you tell it.",
    ar: "كل إجابة وكل عملية حساب تجري داخل متصفحك. لا حساب، ولا خادم، ولا تتبّع لما تخبره به.",
  },
  principleTwoTitle: { en: "One question at a time", ar: "سؤال واحد في كل مرة" },
  principleTwoBody: {
    en: "You are never shown a wall of questions. Answer, and the next one arrives on its own — you can always step back.",
    ar: "لن تُعرض عليك قائمة طويلة من الأسئلة. أجب، وسيأتي السؤال التالي وحده — ويمكنك العودة خطوة دائماً.",
  },
  principleThreeTitle: { en: "Built to steady, not to label", ar: "صُمِّم ليطمئنك لا ليصنّفك" },
  principleThreeBody: {
    en: "The result is a description of what you reported and a suggested next step — never a verdict about who you are.",
    ar: "النتيجة وصفٌ لما ذكرته واقتراحٌ لخطوة تالية — وليست حكماً على من تكون.",
  },

  // Assessment --------------------------------------------------------------
  preamble: {
    en: "Over the last two weeks, how often have you been bothered by…",
    ar: "خلال الأسبوعين الماضيين، كم مرة أزعجك…",
  },
  progressLabel: { en: "Question", ar: "سؤال" },
  progressOf: { en: "of", ar: "من" },
  back: { en: "Back", ar: "رجوع" },
  startOver: { en: "Start over", ar: "البدء من جديد" },
  categoryDepression: { en: "Mood", ar: "المزاج" },
  categoryEmotional: { en: "Emotional load", ar: "الحِمل العاطفي" },
  progressAria: { en: "Assessment progress", ar: "مؤشر التقدم في التقييم" },

  // Result ------------------------------------------------------------------
  resultEyebrow: { en: "What you reported", ar: "ما ذكرته" },
  resultScoreLabel: { en: "Total score", ar: "المجموع" },
  resultOutOf: { en: "out of", ar: "من أصل" },
  resultBreakdown: { en: "Where the weight sits", ar: "أين يتركز الثقل" },
  resultNextStep: { en: "A next step", ar: "خطوة تالية" },
  retake: { en: "Take it again", ar: "إعادة التقييم" },
  backHome: { en: "Back to start", ar: "العودة إلى البداية" },

  crisisTitle: {
    en: "Please read this part first",
    ar: "من فضلك اقرأ هذا الجزء أولاً",
  },
  crisisBody: {
    en: "You reported thoughts of not wanting to be here, or of hurting yourself. Those thoughts are more common than most people are ever told — and they are worth telling someone about today, not eventually. If you are in immediate danger, contact your local emergency number now.",
    ar: "ذكرتَ أفكاراً بعدم الرغبة في البقاء، أو بإيذاء نفسك. هذه الأفكار أكثر شيوعاً ممّا يُقال لمعظم الناس — وتستحق أن تخبر بها شخصاً اليوم، لا لاحقاً. وإن كنت في خطر مباشر، اتصل الآن برقم الطوارئ في بلدك.",
  },
  crisisFindLine: {
    en: "Find a crisis line in your country",
    ar: "ابحث عن خط دعم الأزمات في بلدك",
  },

  disclaimer: {
    en: "Orenda is a screening aid, not a diagnosis. Only a qualified professional can assess your health, and a low score does not rule out a condition worth talking about.",
    ar: "أوريندا أداة تقييم مبدئي، وليست تشخيصاً. لا يستطيع تقييم صحتك سوى مختص مؤهل، والنتيجة المنخفضة لا تنفي وجود ما يستحق الحديث عنه.",
  },
  privacyBadge: { en: "Processed on your device", ar: "تُعالَج على جهازك" },

  // Chrome ------------------------------------------------------------------
  languageToggle: { en: "العربية", ar: "English" },
  languageToggleAria: { en: "Switch to Arabic", ar: "التبديل إلى الإنجليزية" },
} as const satisfies Record<string, LocalizedText>;

export type UIKey = keyof typeof UI;

/** Returns a translator bound to the active locale. */
export function createTranslator(locale: Locale) {
  return (key: UIKey): string => UI[key][locale];
}

export type Translator = ReturnType<typeof createTranslator>;

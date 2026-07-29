import type { BandId, Locale, LocalizedText } from "./types";

/** Every piece of chrome copy, authored per locale. */
const UI = {
  brand: { en: "Orenda", ar: "أوريندا" },
  brandMeaning: {
    en: "the quiet force in you that can change your own course",
    ar: "القوة الهادئة الكامنة فيك والقادرة على تغيير مسارك",
  },

  // Landing -----------------------------------------------------------------
  landingEyebrow: {
    en: "A private hour with yourself",
    ar: "ساعة خاصة مع نفسك",
  },
  landingTitle: {
    en: "How have the last two weeks actually been?",
    ar: "كيف كان الأسبوعان الماضيان في حقيقتهما؟",
  },
  landingBody: {
    en: "Fifty-five questions across nine areas of psychological well-being, drawn from validated clinical screening instruments. One question per screen, no timer, and a detailed profile at the end. Orenda will not diagnose you, and it will not remember you.",
    ar: "خمسة وخمسون سؤالاً عبر تسعة مجالات من الصحة النفسية، مستمدة من أدوات تقييم سريرية معتمدة. سؤال واحد في كل شاشة، دون مؤقّت، وملف مفصّل في النهاية. لن تشخّصك أوريندا، ولن تحتفظ بشيء عنك.",
  },
  startCta: { en: "Begin when you're ready", ar: "ابدأ حين تكون مستعداً" },
  landingMetaQuestions: { en: "55 questions", ar: "٥٥ سؤالاً" },
  landingMetaAreas: { en: "9 areas", ar: "٩ مجالات" },
  landingMetaTime: { en: "about 10 minutes", ar: "نحو ١٠ دقائق" },
  landingMetaNoTimer: { en: "no timer", ar: "بلا مؤقّت" },

  landingCoverageTitle: {
    en: "What this covers",
    ar: "ما الذي يغطيه هذا التقييم",
  },
  landingCoverageBody: {
    en: "Each section keeps the wording and the response scale of the instrument it comes from, so the numbers mean what they mean elsewhere.",
    ar: "يحافظ كل قسم على صياغة الأداة التي جاء منها وعلى مقياس الإجابة الخاص بها، لتبقى الأرقام محتفظة بدلالتها المعروفة.",
  },

  principleOneTitle: { en: "Nothing leaves this device", ar: "لا شيء يغادر جهازك" },
  principleOneBody: {
    en: "Every answer and every calculation happens in your browser. There is no account, no server, and no analytics on what you tell it.",
    ar: "كل إجابة وكل عملية حساب تجري داخل متصفحك. لا حساب، ولا خادم، ولا تتبّع لما تخبره به.",
  },
  principleTwoTitle: { en: "One question at a time", ar: "سؤال واحد في كل مرة" },
  principleTwoBody: {
    en: "You are never shown a wall of questions. Answer, and the next arrives on its own — you can step back at any point, and your place is kept if you leave.",
    ar: "لن تُعرض عليك قائمة طويلة من الأسئلة. أجب، وسيأتي التالي وحده — ويمكنك العودة خطوة في أي وقت، ويُحفظ موضعك إن غادرت.",
  },
  principleThreeTitle: {
    en: "A profile, not a label",
    ar: "ملف شخصي، لا تصنيف",
  },
  principleThreeBody: {
    en: "The result maps where the weight sits across all nine areas — including what is holding steady — and suggests a next step. Never a verdict about who you are.",
    ar: "ترسم النتيجة أين يتركّز الثقل عبر المجالات التسعة — بما في ذلك ما يظل ثابتاً — وتقترح خطوة تالية. وليست حكماً على من تكون.",
  },

  // Assessment --------------------------------------------------------------
  sectionLabel: { en: "Section", ar: "قسم" },
  progressLabel: { en: "Question", ar: "سؤال" },
  progressOf: { en: "of", ar: "من" },
  questionsWord: { en: "questions", ar: "أسئلة" },
  beginSection: { en: "Begin this section", ar: "ابدأ هذا القسم" },
  back: { en: "Back", ar: "رجوع" },
  progressAria: { en: "Assessment progress", ar: "مؤشر التقدم في التقييم" },
  savedLocally: {
    en: "Progress saved on this device",
    ar: "تم حفظ التقدم على هذا الجهاز",
  },

  // Resume ------------------------------------------------------------------
  resumeTitle: {
    en: "You left an assessment unfinished",
    ar: "تركت تقييماً غير مكتمل",
  },
  resumeBody: {
    en: "Your answers were kept on this device. Pick up where you stopped, or clear them and start again.",
    ar: "حُفظت إجاباتك على هذا الجهاز. تابع من حيث توقفت، أو امسحها وابدأ من جديد.",
  },
  resumeAnswered: { en: "answered", ar: "تمت الإجابة عنها" },
  resumeContinue: { en: "Continue", ar: "متابعة" },
  resumeRestart: { en: "Start fresh", ar: "البدء من جديد" },

  // Result ------------------------------------------------------------------
  resultEyebrow: { en: "What you reported", ar: "ما ذكرته" },
  resultScoreLabel: { en: "Total", ar: "المجموع" },
  resultOutOf: { en: "out of", ar: "من أصل" },
  resultProfile: {
    en: "Your profile across nine areas",
    ar: "ملفك عبر المجالات التسعة",
  },
  resultTopAreas: {
    en: "Carrying the most weight",
    ar: "الأكثر حملاً للثقل",
  },
  resultTopAreasNone: {
    en: "No single area came back elevated — the picture is even, and it is a settled one.",
    ar: "لم يظهر أي مجال بمفرده مرتفعاً — الصورة متوازنة، وهي صورة مستقرة.",
  },
  resultSteadyAreas: { en: "Holding steady", ar: "ما يظل ثابتاً" },
  resultSteadyNone: {
    en: "Every area registered some strain. That is worth taking seriously, and it is also worth knowing that breadth like this often lifts together once one part eases.",
    ar: "سجّل كل مجال قدراً من الضغط. هذا يستحق أن يُؤخذ بجدية، ويستحق أيضاً أن تعرف أن اتساعاً كهذا كثيراً ما ينحسر معاً بمجرد أن يخفّ أحد أجزائه.",
  },
  resultBreakdown: { en: "Section by section", ar: "قسماً بقسم" },
  resultNextStep: { en: "A next step", ar: "خطوة تالية" },
  retake: { en: "Take it again", ar: "إعادة التقييم" },
  backHome: { en: "Back to start", ar: "العودة إلى البداية" },

  // Band names --------------------------------------------------------------
  bandSettled: { en: "Settled", ar: "مستقر" },
  bandNoticeable: { en: "Noticeable", ar: "ملحوظ" },
  bandElevated: { en: "Elevated", ar: "مرتفع" },
  bandHigh: { en: "High", ar: "شديد" },

  // Crisis ------------------------------------------------------------------
  crisisTitle: {
    en: "Please read this part first",
    ar: "من فضلك اقرأ هذا الجزء أولاً",
  },
  crisisBody: {
    en: "You reported thoughts of not wanting to be here, or of hurting yourself. Those thoughts are far more common than most people are ever told — and they are worth telling someone about today, not eventually. If you are in immediate danger, contact your local emergency number now.",
    ar: "ذكرتَ أفكاراً بعدم الرغبة في البقاء، أو بإيذاء نفسك. هذه الأفكار أكثر شيوعاً بكثير ممّا يُقال لمعظم الناس — وتستحق أن تخبر بها شخصاً اليوم، لا لاحقاً. وإن كنت في خطر مباشر، اتصل الآن برقم الطوارئ في بلدك.",
  },
  crisisFindLine: {
    en: "Find a crisis line in your country",
    ar: "ابحث عن خط دعم الأزمات في بلدك",
  },

  disclaimer: {
    en: "Orenda is a screening aid, not a diagnosis. The instruments behind it are validated for screening, not for self-diagnosis — only a qualified professional can assess your health, and a low score does not rule out something worth talking about.",
    ar: "أوريندا أداة تقييم مبدئي، وليست تشخيصاً. الأدوات التي تقوم عليها معتمدة للتقييم المبدئي لا للتشخيص الذاتي — ولا يستطيع تقييم صحتك سوى مختص مؤهل، والنتيجة المنخفضة لا تنفي وجود ما يستحق الحديث عنه.",
  },
  privacyBadge: { en: "Processed on your device", ar: "تُعالَج على جهازك" },

  // Chrome ------------------------------------------------------------------
  languageGroup: { en: "Language", ar: "اللغة" },
} as const satisfies Record<string, LocalizedText>;

export type UIKey = keyof typeof UI;

const BAND_KEY: Record<BandId, UIKey> = {
  settled: "bandSettled",
  noticeable: "bandNoticeable",
  elevated: "bandElevated",
  high: "bandHigh",
};

/** Returns a translator bound to the active locale. */
export function createTranslator(locale: Locale) {
  const t = (key: UIKey): string => UI[key][locale];
  t.band = (band: BandId): string => UI[BAND_KEY[band]][locale];
  return t;
}

export type Translator = ReturnType<typeof createTranslator>;

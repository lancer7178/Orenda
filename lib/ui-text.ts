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
  landingSecondaryCta: {
    en: "See what it covers",
    ar: "اطّلع على ما يغطيه",
  },
  landingMetaQuestions: { en: "55 questions", ar: "٥٥ سؤالاً" },
  landingMetaAreas: { en: "9 areas", ar: "٩ مجالات" },
  landingMetaTime: { en: "~10 min", ar: "نحو ١٠ دقائق" },
  landingMetaNoTimer: { en: "no timer", ar: "بلا مؤقّت" },
  landingMetaOneAtATime: {
    en: "one question at a time",
    ar: "سؤال واحد في كل مرة",
  },

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

  // Landing — privacy pillar ------------------------------------------------
  privacyTitle: { en: "Private by design", ar: "خصوصية بالتصميم" },
  privacyLede: {
    en: "Privacy here is not a policy you have to trust — it is the way the app is built. Your answers are scored where you sit, and your profile never leaves this device.",
    ar: "الخصوصية هنا ليست سياسة عليك أن تثق بها — بل هي طريقة بناء التطبيق نفسه. تُحسب إجاباتك حيث أنت، ولا يغادر ملفك هذا الجهاز.",
  },
  privacyNoAccountTitle: { en: "No account", ar: "بلا حساب" },
  privacyNoAccountBody: {
    en: "Nothing to sign up for, and nothing tied to your name.",
    ar: "لا شيء تسجّل فيه، ولا شيء مرتبط باسمك.",
  },
  privacyNoCloudTitle: { en: "No cloud", ar: "بلا سحابة" },
  privacyNoCloudBody: {
    en: "Answers are scored in your browser and kept only in its local storage.",
    ar: "تُحسب الإجابات في متصفحك وتُحفظ في تخزينه المحلي وحده.",
  },
  privacyNoTrackingTitle: { en: "No tracking", ar: "بلا تتبّع" },
  privacyNoTrackingBody: {
    en: "There is no analytics on what you answer, and no third-party scripts watching the flow.",
    ar: "لا تحليلات لما تجيب به، ولا نصوص من جهات خارجية تراقب مسارك.",
  },
  privacyNoSharingTitle: { en: "Nothing shared", ar: "لا مشاركة" },
  privacyNoSharingBody: {
    en: "Your responses are never transmitted, sold, or shared with anyone.",
    ar: "لا تُرسَل إجاباتك ولا تُباع ولا تُشارَك مع أحد.",
  },

  // Erase everything --------------------------------------------------------
  eraseCta: { en: "Erase my responses", ar: "امسح إجاباتي" },
  eraseDialogTitle: { en: "Erase everything?", ar: "مسح كل شيء؟" },
  eraseDialogBody: {
    en: "This will permanently remove your saved answers and results from this device.",
    ar: "سيؤدي هذا إلى إزالة إجاباتك ونتائجك المحفوظة من هذا الجهاز نهائياً.",
  },
  eraseCancel: { en: "Cancel", ar: "إلغاء" },
  eraseConfirm: { en: "Erase everything", ar: "مسح كل شيء" },
  eraseDone: { en: "Erased from this device", ar: "تم المسح من هذا الجهاز" },

  // Landing — what Orenda isn't ---------------------------------------------
  notTitle: { en: "What Orenda isn't", ar: "ما ليست عليه أوريندا" },
  notDiagnosisTitle: { en: "A diagnosis", ar: "تشخيصاً" },
  notDiagnosisBody: {
    en: "It cannot tell you whether you have a mental health condition — only a qualified professional can do that.",
    ar: "لا يمكنها أن تخبرك إن كنت مصاباً بحالة نفسية — هذا ما يقدر عليه مختص مؤهل وحده.",
  },
  notTherapyTitle: { en: "A replacement for therapy", ar: "بديلاً عن العلاج" },
  notTherapyBody: {
    en: "It can help you notice patterns; a professional can understand them in the context of your life.",
    ar: "يمكنها أن تساعدك على ملاحظة الأنماط؛ أما فهمها في سياق حياتك فهو ما يقدر عليه المختص.",
  },
  notLabelTitle: { en: "A score that defines you", ar: "درجةً تعرّفك" },
  notLabelBody: {
    en: "Your results describe a moment — not who you are.",
    ar: "تصف نتائجك لحظة — لا حقيقة من أنت.",
  },

  // Landing — closing statement ---------------------------------------------
  closerTitle: { en: "A profile, not a label.", ar: "ملف، لا تصنيف." },
  closerBody: {
    en: "You are more than a score. Your results describe a moment, not who you are.",
    ar: "أنت أكثر من درجة. تصف نتائجك لحظة، لا من تكون.",
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

  // Pacing ------------------------------------------------------------------
  minutesLeft: { en: "min left", ar: "دقيقة متبقية" },
  leftInSection: { en: "left in this section", ar: "متبقٍ في هذا القسم" },
  lastOneInSection: {
    en: "last one in this section",
    ar: "الأخير في هذا القسم",
  },
  sectionsDone: { en: "sections done", ar: "أقسام مكتملة" },
  sectionCompleteTitle: { en: "Section complete", ar: "اكتمل القسم" },
  keyboardHint: {
    en: "Tip — press 1–5 to answer without reaching for the mouse.",
    ar: "ملاحظة — اضغط ١–٥ للإجابة دون الحاجة إلى الفأرة.",
  },

  // Breathing space ---------------------------------------------------------
  pauseCta: { en: "Take a breath", ar: "خذ نفساً" },
  pauseTitle: { en: "Take a breath", ar: "خذ نفساً" },
  pauseIntro: {
    en: "Follow the circle, or just watch it. Nothing here is recorded, nothing is timed, and your place is kept exactly where you left it.",
    ar: "اتبع الدائرة، أو اكتفِ بمشاهدتها. لا يُسجَّل شيء هنا، ولا يوجد توقيت، ويبقى موضعك محفوظاً تماماً حيث تركته.",
  },
  breatheIn: { en: "Breathe in", ar: "شهيق" },
  breatheHold: { en: "Hold", ar: "احبس" },
  breatheOut: { en: "Breathe out", ar: "زفير" },
  breathsTaken: { en: "breaths taken", ar: "نفَساً" },
  pauseReassurance: {
    en: "There is no right number. Leave whenever you are ready.",
    ar: "لا يوجد عدد صحيح. غادر متى شعرت أنك مستعد.",
  },
  returnToCheckIn: {
    en: "Return to your check-in",
    ar: "العودة إلى تقييمك",
  },

  // Settings on the pause page ----------------------------------------------
  pauseSettingsTitle: { en: "While you're here", ar: "بينما أنت هنا" },
  calmSettingLabel: { en: "Calm the page", ar: "تهدئة الصفحة" },
  calmSettingBody: {
    en: "Stops the background movement and the sliding animations across Orenda. Useful if motion pulls your attention.",
    ar: "يوقف حركة الخلفية والرسوم المتحركة المنزلقة في أوريندا. مفيد إن كانت الحركة تشتت انتباهك.",
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

  // Why am I seeing this? ---------------------------------------------------
  whyTitle: { en: "Why am I seeing this?", ar: "لماذا أرى هذا؟" },
  whyScreeningNote: {
    en: "This is a screening result, not a diagnosis. It reflects what you reported, and can point to what may be worth a closer look with a professional.",
    ar: "هذه نتيجة تقييم مبدئي، لا تشخيص. تعكس ما ذكرته، وقد تشير إلى ما قد يستحق نظرة أعمق مع مختص.",
  },

  // Where to go from here ---------------------------------------------------
  resultPathsTitle: { en: "Where to go from here", ar: "إلى أين من هنا" },
  pathGentleTitle: {
    en: "If you want to start gently",
    ar: "إن أردت أن تبدأ برفق",
  },
  pathGentleBody: {
    en: "Pick one small thing — a steadier sleep time, a short walk, a message to someone you trust — and give it just this week.",
    ar: "اختر شيئاً صغيراً واحداً — موعد نوم أكثر ثباتاً، مشي قصير، رسالة إلى شخص تثق به — وامنحه هذا الأسبوع فقط.",
  },
  pathUnderstandTitle: {
    en: "If you want to understand this",
    ar: "إن أردت أن تفهم هذا",
  },
  pathUnderstandBody: {
    en: "Sit with the profile above. Notice which area you least wanted to read — that hesitation is often where the real information is.",
    ar: "تأمّل الملف أعلاه. لاحظ أي مجال كنت أقل رغبة في قراءته — فذلك التردد غالباً حيث تكمن المعلومة الحقيقية.",
  },
  pathHeavyTitle: { en: "If this feels heavy", ar: "إن بدا هذا ثقيلاً" },
  pathHeavyBody: {
    en: "Some of what you're carrying may be worth talking through with a qualified professional. That isn't a last resort — it's a reasonable next step.",
    ar: "بعض ما تحمله قد يستحق أن تتحدث عنه مع مختص مؤهل. وهذا ليس ملاذاً أخيراً — بل خطوة تالية معقولة.",
  },
  pathHeavyCta: { en: "Find professional support", ar: "ابحث عن دعم مختص" },
  retake: { en: "Take it again", ar: "إعادة التقييم" },
  backHome: { en: "Back to start", ar: "العودة إلى البداية" },
  downloadPdf: { en: "Download PDF", ar: "تنزيل PDF" },
  downloadPdfPending: { en: "Preparing…", ar: "جارٍ التحضير…" },

  // Band names --------------------------------------------------------------
  bandSettled: { en: "Settled", ar: "مستقر" },
  bandNoticeable: { en: "Noticeable", ar: "ملحوظ" },
  bandElevated: { en: "Elevated", ar: "مرتفع" },
  bandHigh: { en: "High", ar: "شديد" },

  // Safety — an in-flow pause when a sensitive answer is given -------------
  safetyTitle: {
    en: "Something here deserves care",
    ar: "هناك ما يستحق العناية هنا",
  },
  safetyBody: {
    en: "One of your answers suggests you may be going through something particularly heavy right now. We wanted to pause here for a moment — not to alarm you, and not because anything is wrong with you.",
    ar: "تشير إحدى إجاباتك إلى أنك قد تمرّ بشيء ثقيل بوجه خاص في هذه الفترة. أردنا أن نتوقف هنا لحظة — لا لنقلقك، ولا لأن فيك خطأً.",
  },
  safetyBodyUrgent: {
    en: "Orenda cannot assess your immediate safety. If you feel you might hurt yourself, or you are in immediate danger, please reach out to urgent local help, or to someone you trust. You don't have to carry this alone.",
    ar: "لا تستطيع أوريندا تقييم سلامتك المباشرة. إن شعرت أنك قد تؤذي نفسك، أو كنت في خطر مباشر، فمن فضلك تواصل مع مساعدة عاجلة قريبة منك، أو مع شخص تثق به. لست مضطراً لحمل هذا وحدك.",
  },
  safetySupportTitle: {
    en: "If you'd like to talk to someone now",
    ar: "إن أردت أن تتحدث إلى شخص الآن",
  },
  safetyContinue: {
    en: "Continue the check-in",
    ar: "متابعة التقييم",
  },
  safetyLeave: {
    en: "Leave for now",
    ar: "المغادرة الآن",
  },

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
  themeToDark: { en: "Switch to dark", ar: "التبديل إلى الوضع الداكن" },
  themeToLight: { en: "Switch to light", ar: "التبديل إلى الوضع الفاتح" },
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

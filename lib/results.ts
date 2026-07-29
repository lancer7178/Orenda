import type { LocalizedResultLevel } from "./types";

/**
 * Bands across the 0–39 range, scaled from the PHQ-9's published severity cut
 * points (0–4 / 5–9 / 10–14 / 15–19 / 20–27 over 27 points) to account for the
 * four additional emotional-load items.
 *
 * The language is deliberately descriptive rather than diagnostic — Orenda
 * reflects what you reported back to you, it does not name a condition.
 */
export const RESULT_LEVELS: LocalizedResultLevel[] = [
  {
    minScore: 0,
    maxScore: 6,
    tone: "steady",
    label: {
      en: "Steady ground",
      ar: "أرض ثابتة",
    },
    message: {
      en: "Your answers point to very few troubling symptoms over the past two weeks. That does not mean nothing is hard right now — it means what you are carrying appears to be within what you can hold. Checking in on yourself, as you just did, is part of what keeps it that way.",
      ar: "تشير إجاباتك إلى وجود أعراض مقلقة قليلة جداً خلال الأسبوعين الماضيين. هذا لا يعني أن كل شيء سهل الآن — بل يعني أن ما تحمله يبدو ضمن قدرتك على احتماله. ومراجعة نفسك، كما فعلت للتو، جزء ممّا يحافظ على ذلك.",
    },
    actionCall: {
      en: "Keep the habits that are working — sleep, movement, and people you can be honest with. Come back if things shift.",
      ar: "حافظ على العادات التي تنفعك — النوم، والحركة، وأشخاص يمكنك أن تكون صادقاً معهم. وعُد إلى هنا إن تغيّرت الأمور.",
    },
  },
  {
    minScore: 7,
    maxScore: 13,
    tone: "mild",
    label: {
      en: "Mild emotional strain",
      ar: "ضغط عاطفي خفيف",
    },
    message: {
      en: "There is a low, persistent weight in your answers. Symptoms at this level often go unnamed because they are livable — you get through the day, but it costs more than it should. Naming it is not an overreaction.",
      ar: "في إجاباتك ثِقَل خفيف لكنه مستمر. الأعراض عند هذا المستوى غالباً ما تمرّ دون تسمية لأنها محتمَلة — تنهي يومك، لكن ذلك يكلّفك أكثر ممّا ينبغي. وتسميتها ليست مبالغة.",
    },
    actionCall: {
      en: "Watch how this moves over the next two weeks. Protect your sleep, and tell one person you trust what you noticed here.",
      ar: "راقب كيف يتغيّر هذا خلال الأسبوعين القادمين. احمِ نومك، وأخبر شخصاً تثق به بما لاحظته هنا.",
    },
  },
  {
    minScore: 14,
    maxScore: 20,
    tone: "moderate",
    label: {
      en: "Moderate emotional strain",
      ar: "ضغط عاطفي متوسط",
    },
    message: {
      en: "Your answers describe symptoms that are showing up often enough to shape your days — energy, focus, sleep, or how you see yourself. This is the range where support tends to make a real, measurable difference, and where waiting it out tends not to.",
      ar: "تصف إجاباتك أعراضاً تتكرر بما يكفي لتشكيل ملامح أيامك — الطاقة، أو التركيز، أو النوم، أو نظرتك إلى نفسك. هذا هو النطاق الذي يُحدث فيه الدعم فرقاً حقيقياً وملموساً، والذي نادراً ما ينفع فيه الانتظار وحده.",
    },
    actionCall: {
      en: "Consider booking time with a therapist, counsellor, or your doctor. Bringing these answers with you is a fine place to start.",
      ar: "فكّر في حجز موعد مع معالج نفسي أو مرشد أو طبيبك. ويمكنك أن تبدأ ببساطة بعرض هذه الإجابات عليه.",
    },
  },
  {
    minScore: 21,
    maxScore: 28,
    tone: "elevated",
    label: {
      en: "Significant emotional strain",
      ar: "ضغط عاطفي كبير",
    },
    message: {
      en: "What you reported is heavy, and it has been going on for weeks. Carrying this alone takes an enormous amount of effort — effort that is not visible to anyone else, which is part of why it is so exhausting. You are not failing at something other people find easy.",
      ar: "ما ذكرته ثقيل، وهو مستمر منذ أسابيع. حمل هذا وحدك يستهلك جهداً هائلاً — جهداً لا يراه أحد، وهذا جزء من سبب كونه منهكاً إلى هذا الحد. أنت لا تفشل في شيء يجده الآخرون سهلاً.",
    },
    actionCall: {
      en: "Please reach out to a mental health professional soon. If that feels like too much, start with your doctor or one person who can help you make the call.",
      ar: "من فضلك تواصل قريباً مع مختص في الصحة النفسية. وإن بدا ذلك كثيراً، ابدأ بطبيبك أو بشخص واحد يستطيع مساعدتك في اتخاذ الخطوة.",
    },
  },
  {
    minScore: 29,
    maxScore: 39,
    tone: "high",
    label: {
      en: "Severe emotional strain",
      ar: "ضغط عاطفي شديد",
    },
    message: {
      en: "Your answers describe a level of distress that deserves real, immediate care — not because something is wrong with you, but because no one should be holding this much on their own. Whatever you have been doing to get through the past two weeks took strength, and it is not a resource that has to be spent alone.",
      ar: "تصف إجاباتك مستوى من الضيق يستحق رعاية حقيقية وفورية — ليس لأن فيك خطأً، بل لأنه ما من أحد يجب أن يحمل هذا القدر وحده. مهما كان ما فعلته لتتجاوز الأسبوعين الماضيين فقد تطلّب قوة، وهي قوة لا يلزم أن تُنفق وحدك.",
    },
    actionCall: {
      en: "Please speak to a mental health professional or a crisis line as soon as you can. If you are in immediate danger, contact your local emergency number now.",
      ar: "من فضلك تحدث إلى مختص في الصحة النفسية أو إلى خط دعم الأزمات في أقرب وقت ممكن. وإن كنت في خطر مباشر، اتصل الآن برقم الطوارئ في بلدك.",
    },
  },
];

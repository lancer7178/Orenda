import type { LocalizedResultLevel } from "./types";

/**
 * Bands across the full 0–204 range of the battery, set at roughly 15% / 33% /
 * 52% / 70% of the maximum — the proportions of the PHQ-9's published severity
 * cut points, carried across the nine sections.
 *
 * The language is deliberately descriptive rather than diagnostic. Orenda
 * reflects what you reported back to you; it does not name a condition.
 */
export const RESULT_LEVELS: LocalizedResultLevel[] = [
  {
    minScore: 0,
    maxScore: 30,
    tone: "steady",
    label: {
      en: "Steady ground",
      ar: "أرض ثابتة",
    },
    message: {
      en: "Across all nine areas, your answers point to very few troubling symptoms. That does not mean nothing is hard right now — it means what you are carrying appears to be within what you can hold, and that your usual ways of coping are still doing their work.",
      ar: "عبر المجالات التسعة جميعها، تشير إجاباتك إلى أعراض مقلقة قليلة جداً. هذا لا يعني أن كل شيء سهل الآن — بل يعني أن ما تحمله يبدو ضمن قدرتك على احتماله، وأن طرقك المعتادة في التكيّف ما زالت تؤدي عملها.",
    },
    actionCall: {
      en: "Keep the habits that are working — sleep, movement, and people you can be honest with. Come back if things shift.",
      ar: "حافظ على العادات التي تنفعك — النوم، والحركة، وأشخاص يمكنك أن تكون صادقاً معهم. وعُد إلى هنا إن تغيّرت الأمور.",
    },
  },
  {
    minScore: 31,
    maxScore: 67,
    tone: "mild",
    label: {
      en: "Mild emotional strain",
      ar: "ضغط عاطفي خفيف",
    },
    message: {
      en: "There is a low, persistent weight running through your answers. Strain at this level often goes unnamed because it is livable — you get through the day, but it costs more than it should. The section breakdown below is worth reading: at this level the load is usually concentrated in one or two areas rather than spread evenly.",
      ar: "يسري في إجاباتك ثِقَل خفيف لكنه مستمر. الضغط عند هذا المستوى غالباً ما يمرّ دون تسمية لأنه محتمَل — تنهي يومك، لكن ذلك يكلّفك أكثر ممّا ينبغي. ويستحق تفصيل الأقسام أدناه القراءة: عند هذا المستوى يتركّز الحِمل عادةً في مجال أو مجالين لا أن يتوزّع بالتساوي.",
    },
    actionCall: {
      en: "Watch how this moves over the next two weeks, and start with whichever section below scored highest. Telling one person you trust is a reasonable first step.",
      ar: "راقب كيف يتغيّر هذا خلال الأسبوعين القادمين، وابدأ بالقسم الأعلى نتيجةً أدناه. وإخبار شخص واحد تثق به خطوة أولى معقولة.",
    },
  },
  {
    minScore: 68,
    maxScore: 106,
    tone: "moderate",
    label: {
      en: "Moderate emotional strain",
      ar: "ضغط عاطفي متوسط",
    },
    message: {
      en: "Your answers describe symptoms showing up often enough, and in enough areas, to be shaping your days — energy, focus, sleep, or how you see yourself. This is the range where support tends to make a real and measurable difference, and where waiting it out tends not to.",
      ar: "تصف إجاباتك أعراضاً تتكرر بما يكفي، وفي مجالات كافية، لتشكيل ملامح أيامك — الطاقة، أو التركيز، أو النوم، أو نظرتك إلى نفسك. هذا هو النطاق الذي يُحدث فيه الدعم فرقاً حقيقياً وملموساً، والذي نادراً ما ينفع فيه الانتظار وحده.",
    },
    actionCall: {
      en: "Consider booking time with a therapist, counsellor, or your doctor. Bringing this breakdown with you is a fine place to start the conversation.",
      ar: "فكّر في حجز موعد مع معالج نفسي أو مرشد أو طبيبك. وعرض هذا التفصيل عليه بداية جيدة للحديث.",
    },
  },
  {
    minScore: 107,
    maxScore: 142,
    tone: "elevated",
    label: {
      en: "Significant emotional strain",
      ar: "ضغط عاطفي كبير",
    },
    message: {
      en: "What you reported is heavy, it spans several areas at once, and it has been going on for weeks. Carrying this alone takes an enormous amount of effort — effort nobody else can see, which is part of why it is so exhausting. You are not failing at something other people find easy.",
      ar: "ما ذكرته ثقيل، ويمتد إلى عدة مجالات في آنٍ واحد، وهو مستمر منذ أسابيع. حمل هذا وحدك يستهلك جهداً هائلاً — جهداً لا يراه أحد، وهذا جزء من سبب كونه منهكاً إلى هذا الحد. أنت لا تفشل في شيء يجده الآخرون سهلاً.",
    },
    actionCall: {
      en: "Please reach out to a mental health professional soon. If that feels like too much to arrange, start with your doctor, or with one person who can help you make the call.",
      ar: "من فضلك تواصل قريباً مع مختص في الصحة النفسية. وإن بدا ترتيب ذلك كثيراً عليك، ابدأ بطبيبك، أو بشخص واحد يستطيع مساعدتك في اتخاذ الخطوة.",
    },
  },
  {
    minScore: 143,
    maxScore: 204,
    tone: "high",
    label: {
      en: "Severe emotional strain",
      ar: "ضغط عاطفي شديد",
    },
    message: {
      en: "Your answers describe distress across nearly every area this covers, at a level that deserves real and prompt care — not because something is wrong with you, but because no one should be holding this much on their own. Whatever you have been doing to get through the past two weeks took strength, and it is not a resource that has to be spent alone.",
      ar: "تصف إجاباتك ضيقاً يمتد إلى كل مجال يغطيه هذا التقييم تقريباً، عند مستوى يستحق رعاية حقيقية وعاجلة — ليس لأن فيك خطأً، بل لأنه ما من أحد يجب أن يحمل هذا القدر وحده. مهما كان ما فعلته لتتجاوز الأسبوعين الماضيين فقد تطلّب قوة، وهي قوة لا يلزم أن تُنفق وحدك.",
    },
    actionCall: {
      en: "Please speak to a mental health professional or a crisis line as soon as you can. If you are in immediate danger, contact your local emergency number now.",
      ar: "من فضلك تحدث إلى مختص في الصحة النفسية أو إلى خط دعم الأزمات في أقرب وقت ممكن. وإن كنت في خطر مباشر، اتصل الآن برقم الطوارئ في بلدك.",
    },
  },
];

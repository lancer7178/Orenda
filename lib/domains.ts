import type { Domain, DomainBand, DomainId, LocalizedText } from "./types";

/**
 * Shared severity steps. A band's `maxRatio` is the inclusive upper bound of
 * `score / maxScore` for that domain, so sections of different lengths stay
 * comparable to one another on the result profile.
 */
const RATIOS: Record<DomainBand["id"], number> = {
  settled: 0.2,
  noticeable: 0.45,
  elevated: 0.7,
  high: 1,
};

type Readings = Record<DomainBand["id"], LocalizedText>;

function bands(readings: Readings): DomainBand[] {
  return (Object.keys(RATIOS) as DomainBand["id"][]).map((id) => ({
    id,
    maxRatio: RATIOS[id],
    reading: readings[id],
  }));
}

const TWO_WEEK_FREQUENCY: LocalizedText = {
  en: "Over the last two weeks, how often have you been bothered by…",
  ar: "خلال الأسبوعين الماضيين، كم مرة أزعجك…",
};

const AGREEMENT_PROMPT: LocalizedText = {
  en: "How much do you agree with this?",
  ar: "إلى أي مدى توافق على هذه العبارة؟",
};

export const DOMAINS: Domain[] = [
  // -------------------------------------------------------------------------
  {
    id: "mood",
    category: "depression",
    name: { en: "Mood", ar: "المزاج" },
    blurb: {
      en: "How your mood, your energy, and your interest in things have been holding up.",
      ar: "كيف صمد مزاجك وطاقتك واهتمامك بالأشياء في الفترة الأخيرة.",
    },
    instrument: { en: "Based on the PHQ-9", ar: "مبني على مقياس PHQ-9" },
    prompt: TWO_WEEK_FREQUENCY,
    bands: bands({
      settled: {
        en: "Your mood has largely held its shape over the past two weeks.",
        ar: "حافظ مزاجك على استقراره إلى حد كبير خلال الأسبوعين الماضيين.",
      },
      noticeable: {
        en: "There is a low, steady drag on your mood — livable, but it is costing you something.",
        ar: "هناك ثِقَل خفيف ومستمر على مزاجك — محتمَل، لكنه يكلّفك شيئاً ما.",
      },
      elevated: {
        en: "Low mood is showing up often enough to be shaping how your days go.",
        ar: "ينخفض مزاجك بتواتر يكفي ليشكّل ملامح أيامك.",
      },
      high: {
        en: "Your answers describe persistent low mood at a level that rarely lifts on its own.",
        ar: "تصف إجاباتك انخفاضاً مستمراً في المزاج عند مستوى نادراً ما يزول من تلقاء نفسه.",
      },
    }),
  },

  // -------------------------------------------------------------------------
  {
    id: "anxiety",
    category: "emotional",
    name: { en: "Anxiety", ar: "القلق" },
    blurb: {
      en: "Worry, tension, and the part of you that stays braced for something.",
      ar: "القلق والتوتر، وذلك الجزء منك الذي يبقى متأهباً لشيء ما.",
    },
    instrument: { en: "Based on the GAD-7", ar: "مبني على مقياس GAD-7" },
    prompt: TWO_WEEK_FREQUENCY,
    bands: bands({
      settled: {
        en: "Worry seems to come and go without taking hold of you.",
        ar: "يبدو أن القلق يأتي ويذهب دون أن يتمكّن منك.",
      },
      noticeable: {
        en: "There is a background hum of worry that you are quietly working around.",
        ar: "هناك أزيز قلق في الخلفية تتحايل عليه بصمت.",
      },
      elevated: {
        en: "Anxiety is frequent enough to be taking real attention and energy from you.",
        ar: "يتكرر القلق بما يكفي ليستهلك قدراً حقيقياً من انتباهك وطاقتك.",
      },
      high: {
        en: "Your answers describe near-constant worry and physical tension that is hard to switch off.",
        ar: "تصف إجاباتك قلقاً شبه دائم وتوتراً جسدياً يصعب إيقافه.",
      },
    }),
  },

  // -------------------------------------------------------------------------
  {
    id: "stress",
    category: "emotional",
    name: { en: "Stress & overwhelm", ar: "الضغط والإرهاق" },
    blurb: {
      en: "How manageable life has felt lately, and how much say you have had in it.",
      ar: "إلى أي حد بدت الحياة قابلة للإدارة مؤخراً، وكم كان لك من تحكّم فيها.",
    },
    instrument: {
      en: "Based on the Perceived Stress Scale",
      ar: "مبني على مقياس الضغط المُدرَك",
    },
    prompt: {
      en: "In the last month, how often have you felt…",
      ar: "خلال الشهر الماضي، كم مرة شعرت…",
    },
    bands: bands({
      settled: {
        en: "You have mostly felt able to meet what has been asked of you.",
        ar: "شعرت في الغالب بالقدرة على تلبية ما طُلب منك.",
      },
      noticeable: {
        en: "Demands are outpacing your reserves some of the time.",
        ar: "المتطلبات تتجاوز مخزونك من الطاقة في بعض الأحيان.",
      },
      elevated: {
        en: "You are often operating past your capacity, with very little margin left over.",
        ar: "تعمل غالباً بما يتجاوز طاقتك، دون هامش يُذكر.",
      },
      high: {
        en: "Life has felt largely unmanageable — this is a load few people could carry steadily.",
        ar: "بدت الحياة غير قابلة للإدارة إلى حد بعيد — وهذا حِمل قلّة من الناس يمكنهم حمله باستقرار.",
      },
    }),
  },

  // -------------------------------------------------------------------------
  {
    id: "sleep",
    category: "emotional",
    name: { en: "Sleep", ar: "النوم" },
    blurb: {
      en: "Falling asleep, staying asleep, and whether rest is actually restoring you.",
      ar: "الخلود إلى النوم، والاستمرار فيه، وما إذا كانت الراحة تعيد إليك طاقتك فعلاً.",
    },
    instrument: {
      en: "Based on the Insomnia Severity Index",
      ar: "مبني على مؤشر شدة الأرق",
    },
    prompt: {
      en: "Over the last two weeks, how much of a problem has this been…",
      ar: "خلال الأسبوعين الماضيين، إلى أي حد شكّل هذا مشكلة…",
    },
    bands: bands({
      settled: {
        en: "Your sleep appears to be doing its job.",
        ar: "يبدو أن نومك يؤدي وظيفته.",
      },
      noticeable: {
        en: "Sleep is unreliable in ways you are probably absorbing without noticing.",
        ar: "نومك غير منتظم بطرق تستوعبها على الأرجح دون أن تنتبه.",
      },
      elevated: {
        en: "Disrupted sleep is likely feeding back into your mood and concentration.",
        ar: "اضطراب النوم ينعكس على الأرجح على مزاجك وتركيزك.",
      },
      high: {
        en: "Your sleep is significantly disturbed — this alone can drive much of what the other sections found.",
        ar: "نومك مضطرب بدرجة كبيرة — وهذا وحده قد يفسّر جانباً كبيراً ممّا أظهرته الأقسام الأخرى.",
      },
    }),
  },

  // -------------------------------------------------------------------------
  {
    id: "somatic",
    category: "emotional",
    name: { en: "Body & physical signs", ar: "الجسد والأعراض الجسدية" },
    blurb: {
      en: "Physical symptoms that often turn out to be carrying emotional weight.",
      ar: "أعراض جسدية كثيراً ما يتبيّن أنها تحمل ثِقَلاً عاطفياً.",
    },
    instrument: { en: "Based on the PHQ-15", ar: "مبني على مقياس PHQ-15" },
    prompt: {
      en: "Over the last two weeks, how much have you been bothered by…",
      ar: "خلال الأسبوعين الماضيين، إلى أي حد أزعجك…",
    },
    bands: bands({
      settled: {
        en: "Few physical symptoms are showing up alongside how you feel.",
        ar: "قليل من الأعراض الجسدية يظهر بجانب ما تشعر به.",
      },
      noticeable: {
        en: "Some of what you are carrying appears to be surfacing in your body.",
        ar: "يبدو أن جزءاً ممّا تحمله يطفو على السطح في جسدك.",
      },
      elevated: {
        en: "Physical symptoms are frequent — worth ruling out medical causes as well as emotional ones.",
        ar: "الأعراض الجسدية متكررة — ويستحق الأمر استبعاد الأسباب الطبية إلى جانب العاطفية.",
      },
      high: {
        en: "Your body is carrying a substantial share of this. Please have the physical symptoms looked at too.",
        ar: "يحمل جسدك نصيباً كبيراً من هذا. من فضلك اعرض الأعراض الجسدية على طبيب أيضاً.",
      },
    }),
  },

  // -------------------------------------------------------------------------
  {
    id: "connection",
    category: "emotional",
    name: { en: "Connection", ar: "التواصل" },
    blurb: {
      en: "Closeness, belonging, and whether you feel reachable by the people around you.",
      ar: "القرب والانتماء، وما إذا كنت تشعر أن من حولك يمكنهم الوصول إليك.",
    },
    instrument: {
      en: "Based on the UCLA Loneliness Scale",
      ar: "مبني على مقياس الوحدة UCLA",
    },
    prompt: {
      en: "In the last month, how often have you felt…",
      ar: "خلال الشهر الماضي، كم مرة شعرت…",
    },
    bands: bands({
      settled: {
        en: "You seem to have people you can reach, and who can reach you.",
        ar: "يبدو أن لديك أشخاصاً يمكنك الوصول إليهم، ويمكنهم الوصول إليك.",
      },
      noticeable: {
        en: "There is some distance between you and the people around you.",
        ar: "هناك بعض المسافة بينك وبين من حولك.",
      },
      elevated: {
        en: "You are spending a lot of time feeling unseen, even in company.",
        ar: "تقضي وقتاً طويلاً وأنت تشعر أن أحداً لا يراك، حتى بين الناس.",
      },
      high: {
        en: "Deep isolation runs through your answers — both a symptom and something that makes everything else heavier.",
        ar: "تسري في إجاباتك عزلة عميقة — وهي عَرَضٌ وسببٌ يجعل كل شيء آخر أثقل.",
      },
    }),
  },

  // -------------------------------------------------------------------------
  {
    id: "selfWorth",
    category: "depression",
    name: { en: "Self-worth", ar: "تقدير الذات" },
    blurb: {
      en: "How you speak to yourself, and what you have come to believe you are worth.",
      ar: "كيف تخاطب نفسك، وما الذي صرت تعتقد أنك تستحقه.",
    },
    instrument: {
      en: "Based on the Rosenberg Self-Esteem Scale",
      ar: "مبني على مقياس روزنبرغ لتقدير الذات",
    },
    prompt: AGREEMENT_PROMPT,
    bands: bands({
      settled: {
        en: "You appear to hold a reasonably steady and fair view of yourself.",
        ar: "يبدو أنك تحمل نظرة مستقرة ومنصفة إلى حد معقول تجاه نفسك.",
      },
      noticeable: {
        en: "Your inner commentary is harsher than you would ever be with someone else.",
        ar: "حديثك الداخلي أقسى ممّا قد تكونه يوماً مع شخص آخر.",
      },
      elevated: {
        en: "Self-criticism is a frequent presence, and it is quietly shaping what you attempt.",
        ar: "نقد الذات حاضر بكثرة، وهو يشكّل بصمت ما تجرؤ على محاولته.",
      },
      high: {
        en: "Your answers describe a persistently harsh view of yourself that is unlikely to be accurate.",
        ar: "تصف إجاباتك نظرة قاسية ودائمة تجاه نفسك، ومن غير المرجّح أن تكون دقيقة.",
      },
    }),
  },

  // -------------------------------------------------------------------------
  {
    id: "functioning",
    category: "emotional",
    name: { en: "Daily functioning", ar: "الأداء اليومي" },
    blurb: {
      en: "How much all of this is reaching into work, home, and the ordinary things.",
      ar: "إلى أي مدى يمتد كل هذا إلى العمل والبيت والأمور الاعتيادية.",
    },
    instrument: { en: "Based on the WHODAS 2.0", ar: "مبني على مقياس WHODAS 2.0" },
    prompt: {
      en: "In the last two weeks, how much did difficulties interfere with…",
      ar: "خلال الأسبوعين الماضيين، إلى أي حد أعاقتك الصعوبات في…",
    },
    bands: bands({
      settled: {
        en: "Whatever you are carrying, you are still getting where you need to go.",
        ar: "مهما كان ما تحمله، ما زلت تصل إلى حيث تحتاج أن تصل.",
      },
      noticeable: {
        en: "Ordinary tasks are costing more effort than they used to.",
        ar: "المهام الاعتيادية تكلّفك جهداً أكبر ممّا اعتادت.",
      },
      elevated: {
        en: "This is measurably interfering with work, home life, or both.",
        ar: "هذا يعيق بشكل ملموس عملك أو حياتك المنزلية أو كليهما.",
      },
      high: {
        en: "Daily life has become genuinely hard to keep up with — the clearest single signal that support would help.",
        ar: "صار من الصعب حقاً مجاراة الحياة اليومية — وهذه أوضح إشارة منفردة إلى أن الدعم سينفع.",
      },
    }),
  },

  // -------------------------------------------------------------------------
  {
    id: "resilience",
    category: "emotional",
    name: { en: "Coping & resilience", ar: "التكيّف والمرونة" },
    blurb: {
      en: "What you still have to draw on. These questions are about your strengths, not your symptoms.",
      ar: "ما زال لديك ما تستند إليه. هذه الأسئلة عن نقاط قوتك، لا عن أعراضك.",
    },
    instrument: {
      en: "Based on the Brief Resilience Scale",
      ar: "مبني على مقياس المرونة المختصر",
    },
    prompt: AGREEMENT_PROMPT,
    isReverseScored: true,
    bands: bands({
      settled: {
        en: "You still have real recovery capacity to draw on — a genuine protective factor.",
        ar: "ما زالت لديك قدرة حقيقية على التعافي تستند إليها — وهذا عامل حماية فعلي.",
      },
      noticeable: {
        en: "Your ability to bounce back is intact, but thinner than it usually is.",
        ar: "قدرتك على النهوض مجدداً ما زالت قائمة، لكنها أرقّ من المعتاد.",
      },
      elevated: {
        en: "Your usual ways of recovering are not working as well as they normally do.",
        ar: "طرقك المعتادة في التعافي لم تعد تعمل بالكفاءة التي تعمل بها عادةً.",
      },
      high: {
        en: "Your reserves are close to spent. Recovery is unlikely to come from pushing harder.",
        ar: "مخزونك أوشك على النفاد. ومن غير المرجّح أن يأتي التعافي من دفع نفسك أكثر.",
      },
    }),
  },
];

export const DOMAIN_BY_ID: Record<DomainId, Domain> = Object.fromEntries(
  DOMAINS.map((domain) => [domain.id, domain]),
) as Record<DomainId, Domain>;

/** Presentation order, used for both the flow and the result profile. */
export const DOMAIN_ORDER: DomainId[] = DOMAINS.map((domain) => domain.id);

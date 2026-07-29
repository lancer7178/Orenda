# Orenda 🌿

**An interactive psychological screening tool for self-discovery and emotional balance.**

Orenda is a web app that gives you a broad, private read on your emotional
well-being, built from validated clinical screening instruments. It asks 55
questions across nine areas, one question per screen, with no timer — and it
scores everything in your browser.

The name refers to a force said to be present in every person, the capacity to
change one's own course. That is the app's posture: it reflects back what you
reported and suggests a next step. It never diagnoses, and it never labels.

> **Orenda is a screening aid, not a diagnosis.** The instruments behind it are
> validated for screening, not for self-diagnosis. Only a qualified
> professional can assess your health, and a low score does not rule out
> something worth talking about.

---

## Core principles

1. **Zero data leakage.** Every answer and every calculation happens on the
   client. There is no account, no server, no analytics on what you tell it.
   Nothing you report ever leaves the device.
2. **Low cognitive load.** One question per screen. You are never shown a wall
   of questions.
3. **Empathetic UX.** No timers, a calm palette, and soft transitions
   throughout. Nothing in the interface is designed to create urgency.

---

## What it measures

Each section keeps the wording and the response scale of the instrument it is
modelled on, so the numbers mean what they mean elsewhere.

| # | Section | Based on | Items | Max |
|---|---------|----------|-------|-----|
| 1 | Mood | PHQ-9 | 9 | 27 |
| 2 | Anxiety | GAD-7 | 7 | 21 |
| 3 | Stress & overwhelm | Perceived Stress Scale | 6 | 24 |
| 4 | Sleep | Insomnia Severity Index | 6 | 24 |
| 5 | Body & physical signs | PHQ-15 | 6 | 24 |
| 6 | Connection | UCLA Loneliness Scale | 5 | 20 |
| 7 | Self-worth | Rosenberg Self-Esteem Scale | 5 | 20 |
| 8 | Daily functioning | WHODAS 2.0 | 5 | 20 |
| 9 | Coping & resilience | Brief Resilience Scale | 6 | 24 |
|   | **Total** | | **55** | **204** |

Because the instruments use different response formats, the app carries several
answer scales (`lib/scales.ts`): four-point two-week frequency for PHQ-9/GAD-7,
five-point frequency for the stress and loneliness items, severity for sleep and
somatic items, interference for functioning, and agreement for self-worth and
resilience.

### Reverse scoring

The resilience section — and the positively worded self-worth items — are
scored backwards, so agreeing with *"I tend to bounce back quickly"* **lowers**
the strain total. This is baked into the answer data rather than special-cased
in the reducer, which keeps the scoring logic uniform: for every domain, a
higher score always means more strain.

### Scoring bands

The overall bands sit at roughly 15% / 33% / 52% / 70% of the maximum — the
proportions of the PHQ-9's published severity cut points, carried across all
nine sections.

| Score | Level |
|-------|-------|
| 0–30 | Steady ground |
| 31–67 | Mild emotional strain |
| 68–106 | Moderate emotional strain |
| 107–142 | Significant emotional strain |
| 143–204 | Severe emotional strain |

Each domain additionally gets its own band — `settled`, `noticeable`,
`elevated`, or `high` — computed from `score / maxScore`, so sections of
different lengths stay comparable on the result profile.

### Crisis flagging

Any non-zero answer to PHQ-9 item 9 (thoughts of self-harm) surfaces crisis
support on the result screen **regardless of the total score**. Someone can
report almost nothing else and still need that card, so it is evaluated on its
own merits rather than gated behind a severity threshold.

---

## Designed for long-form attention

55 questions is a lot to ask. Several features exist specifically to keep the
flow from becoming overwhelming or boring — and to work for people with ADHD:

- **Chunked progress.** The prominent readout is section-relative — dots plus
  *"4 left in this section"* — so the visible finish line is always five or six
  questions away, not fifty-five. The whole-battery count is demoted to faint
  secondary text.
- **Number-key answering.** Press `1`–`5` to pick an option without reaching
  for the mouse, with key hints on each button. The tip retires after the first
  few questions so it stops being noise.
- **Section-complete beat.** Crossing into a new section shows a
  *"✓ Section complete · 3/9 sections done"* badge, turning one long climb into
  nine small finishes.
- **Time estimate.** *"~10 min left"*, recalculated from remaining items, so
  the unknown length is not its own source of anxiety.
- **Calm mode.** A header toggle that stills the ambient motion (breathing
  background, pulsing dots, shimmer) and softens the wash.
  `prefers-reduced-motion` is honoured too, but many people distracted by
  drifting backgrounds have never found that OS setting — this puts the same
  relief one click away.
- **Section cards.** A breath between sections that names what is coming next.
- **Resume.** Progress is saved to `localStorage` after every answer, so
  closing the tab mid-run does not cost you the whole thing.

---

## Bilingual

The app ships in **English and Arabic**, with full RTL support. Content is
authored once per locale as `LocalizedText` (`{ en, ar }`) and resolved to the
plain schema shapes for the active locale at render time. Arabic gets its own
typeface (IBM Plex Sans Arabic) and a little more line height.

The language preference is the only thing Orenda persists besides your
progress, and it is stored client-side — no cookie is sent, so the server has
no way to know it.

---

## Tech stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict) |
| **UI** | React 19 |
| **Styling** | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`) |
| **Animation** | Motion 12 (Framer Motion) |
| **State** | `useReducer` + pure selectors |

> **Note:** this project targets Next.js 16, which has breaking changes from
> earlier versions. Consult `node_modules/next/dist/docs/` before making
> framework-level changes.

---

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
npx tsc --noEmit  # typecheck
```

---

## Project structure

```
app/
  layout.tsx           Root layout — fonts, metadata, providers
  page.tsx             Landing screen
  assessment/page.tsx  The assessment route
  globals.css          Design tokens, ambient effects, calm mode
  icon.png             Favicon, generated from the logo mark

components/
  landing-screen.tsx   Hero, coverage list, principles
  site-header.tsx      Logo, privacy badge, calm + language toggles
  assessment-flow.tsx  Flow orchestration, auto-advance, resume
  section-intro.tsx    Between-section card + completion beat
  section-progress.tsx Chunked dots, "N left", time estimate
  question-card.tsx    One question, keyboard shortcuts
  result-screen.tsx    Overall band, summaries, full profile
  domain-profile.tsx   Per-domain bars, bands, and readings
  score-dial.tsx       Animated total-score dial
  progress-bar.tsx     Whole-battery progress
  language-provider.tsx  Locale context, RTL, persistence
  calm-toggle.tsx      Calm-mode switch

lib/
  types.ts             Core schema (Answer, Question, ResultLevel, …)
  scales.ts            Response scales, one per instrument format
  questions.ts         The 55-item battery
  domains.ts           The nine sections, bands, and readings
  results.ts           Overall scoring bands
  assessment.ts        Reducer, selectors, persistence
  content.ts           Locale resolution
  ui-text.ts           All chrome copy, per locale
  progress-store.ts    localStorage snapshot for resume
  calm-store.ts        Calm-mode preference
```

---

## Architecture notes

**The schema is the contract.** `lib/types.ts` defines `Answer`, `Question`,
`ResultLevel`, and `AssessmentState` as specified. Because the app is
bilingual, source content is authored as `Localized*` variants carrying every
locale and flattened to those plain shapes by `lib/content.ts`.

**State is a reducer plus pure selectors.** `assessmentReducer` handles
`answer`, `dismissIntro`, `back`, `reset`, and `restore`. Everything derived —
domain scores, bands, section position, minutes remaining, the crisis flag — is
a pure selector over state, so it is all trivially testable without a DOM.

**Totals are recomputed, never accumulated.** `totalScore` is derived by summing
`answersRecord` on every answer rather than incremented. That is what makes
going back and revising an earlier answer correct instead of double-counting.

**Restored progress is validated, not trusted.** `deserializeProgress` drops
unknown question ids and any score that is not a real option on that question,
refuses a stale schema version, clamps the index, and will not honour a
completion claim that the answer count does not support. A hand-edited
`localStorage` entry cannot produce a bogus score.

**Client-only state uses `useSyncExternalStore`.** Locale, saved progress, and
calm mode are all read through it with a server snapshot, which keeps hydration
correct without an effect that calls `setState` on mount.

---

## Privacy

There is no backend. Both routes are statically prerendered, and the only
things written to `localStorage` are:

| Key | Contents |
|-----|----------|
| `orenda.progress.v2` | Your in-progress answers, so you can resume |
| `orenda.locale` | Language preference |
| `orenda.calm` | Calm-mode preference |

Clearing site data removes all of it. Nothing is transmitted anywhere. The one
outbound link in the app is the crisis-line directory
([findahelpline.com](https://findahelpline.com)), and it is only ever a link —
following it is your choice.

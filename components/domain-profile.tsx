"use client";

import { motion } from "motion/react";
import { useLanguage } from "./language-provider";
import type { BandId, DomainResult } from "@/lib/types";

/**
 * Four steps on one warm ramp — sage, sand, terracotta, clay. Written as full
 * class names so Tailwind can see them at build time. Never a traffic light:
 * the tones sit close together on a single ramp, so the profile reads as a
 * quiet shape, not a red/green scoreboard.
 */
const BAND_CHIP: Record<BandId, string> = {
  settled: "text-tone-steady border-tone-steady/35 bg-tone-steady/10",
  noticeable: "text-tone-moderate border-tone-moderate/35 bg-tone-moderate/10",
  elevated: "text-tone-elevated border-tone-elevated/35 bg-tone-elevated/10",
  high: "text-tone-high border-tone-high/35 bg-tone-high/10",
};

/** Filled dot colour per band, mirroring the chip ramp. */
const BAND_DOT: Record<BandId, string> = {
  settled: "bg-tone-steady",
  noticeable: "bg-tone-moderate",
  elevated: "bg-tone-elevated",
  high: "bg-tone-high",
};

/**
 * How many of the five dots are filled, keyed to the band so the dots and the
 * worded chip can never disagree. The level is always carried by the chip text
 * and the reading sentence too — the dots are decorative, never the sole
 * signal, so nothing here depends on colour alone.
 */
const BAND_FILLED: Record<BandId, number> = {
  settled: 2,
  noticeable: 3,
  elevated: 4,
  high: 5,
};

const DOT_COUNT = 5;

/** A calm five-step indicator — "the shape of how things seem", not a metric. */
function BandDots({ bandId, index }: { bandId: BandId; index: number }) {
  const filled = BAND_FILLED[bandId];

  return (
    <div aria-hidden="true" className="mt-3 flex items-center gap-1.5">
      {Array.from({ length: DOT_COUNT }, (_, dot) => (
        <motion.span
          key={dot}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.3 + index * 0.07 + dot * 0.05,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className={`h-2.5 w-2.5 rounded-full ${
            dot < filled ? BAND_DOT[bandId] : "bg-hairline"
          }`}
        />
      ))}
    </div>
  );
}

export function DomainProfile({ results }: { results: DomainResult[] }) {
  const { t, tx } = useLanguage();

  return (
    <ul className="flex flex-col gap-7">
      {results.map((result, index) => (
        <motion.li
          key={result.domain.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2 + index * 0.08,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="group rounded-2xl px-3 py-3 transition-all duration-300 hover:bg-sage-50/40"
        >
          {/* Name + a worded band label. The level is carried by the label
              text and the reading below — never by colour alone — and the raw
              score is deliberately left off here: a "12 / 27" reads as a
              medical statistic, which is exactly the register this page avoids. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-ink text-[15px] font-semibold">
              {tx(result.domain.name)}
            </h3>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${BAND_CHIP[result.band.id]}`}
            >
              {t.band(result.band.id)}
            </span>
          </div>

          <BandDots bandId={result.band.id} index={index} />

          <p className="text-ink-soft mt-3 text-sm leading-relaxed text-pretty">
            {tx(result.band.reading)}
          </p>
          <p className="text-ink-muted/80 mt-1.5 text-xs">
            {tx(result.domain.instrument)}
          </p>

          {/* Native <details> so the disclosure is keyboard- and
              screen-reader-accessible for free, and needs no client state. */}
          <details className="group/why mt-2.5">
            <summary className="text-ink-muted hover:text-sage-600 inline-flex cursor-pointer list-none items-center gap-1.5 text-xs transition-colors [&::-webkit-details-marker]:hidden">
              <svg
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                className="h-3 w-3 transition-transform duration-300 group-open/why:rotate-90 rtl:group-open/why:-rotate-90"
              >
                <path
                  d="M4.5 2.5 8 6l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("whyTitle")}
            </summary>
            <div className="border-sage-200/50 mt-2.5 border-s-2 ps-3.5">
              <p className="text-ink-soft text-xs leading-relaxed text-pretty">
                {tx(result.domain.about)}
              </p>
              <p className="text-ink-muted mt-2 text-xs leading-relaxed text-pretty">
                {t("whyScreeningNote")}
              </p>
            </div>
          </details>
        </motion.li>
      ))}
    </ul>
  );
}

/** Compact chips used by the "most weight" and "holding steady" summaries. */
export function DomainChips({ results }: { results: DomainResult[] }) {
  const { t, tx } = useLanguage();

  return (
    <ul className="flex flex-wrap gap-2">
      {results.map((result, index) => (
        <motion.li
          key={result.domain.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: index * 0.06,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 hover:scale-[1.03] ${BAND_CHIP[result.band.id]}`}
        >
          {tx(result.domain.name)}
          <span className="opacity-60">{t.band(result.band.id)}</span>
        </motion.li>
      ))}
    </ul>
  );
}

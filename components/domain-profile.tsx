"use client";

import { motion } from "motion/react";
import { useLanguage } from "./language-provider";
import type { BandId, DomainResult } from "@/lib/types";

/**
 * Four steps on one warm ramp — sage, sand, terracotta, clay. Written as full
 * class names so Tailwind can see them at build time.
 */
const BAND_BAR: Record<BandId, string> = {
  settled: "bg-tone-steady",
  noticeable: "bg-tone-moderate",
  elevated: "bg-tone-elevated",
  high: "bg-tone-high",
};

const BAND_CHIP: Record<BandId, string> = {
  settled: "text-tone-steady border-tone-steady/35 bg-tone-steady/10",
  noticeable: "text-tone-moderate border-tone-moderate/35 bg-tone-moderate/10",
  elevated: "text-tone-elevated border-tone-elevated/35 bg-tone-elevated/10",
  high: "text-tone-high border-tone-high/35 bg-tone-high/10",
};

export function DomainProfile({ results }: { results: DomainResult[] }) {
  const { t, tx } = useLanguage();

  return (
    <ul className="flex flex-col gap-7">
      {results.map((result, index) => (
        <li key={result.domain.id}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="text-ink text-[15px] font-semibold">
              {tx(result.domain.name)}
            </h3>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${BAND_CHIP[result.band.id]}`}
            >
              {t.band(result.band.id)}
            </span>
            <span className="text-ink-muted ms-auto text-sm tabular-nums">
              {result.score} / {result.maxScore}
            </span>
          </div>

          <div className="bg-hairline/50 mt-2.5 h-2 w-full overflow-hidden rounded-full">
            <motion.div
              className={`h-full rounded-full ${BAND_BAR[result.band.id]}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(result.ratio * 100)}%` }}
              transition={{
                duration: 1,
                delay: 0.35 + index * 0.07,
                ease: [0.22, 0.61, 0.36, 1],
              }}
            />
          </div>

          <p className="text-ink-soft mt-3 text-sm leading-relaxed text-pretty">
            {tx(result.band.reading)}
          </p>
          <p className="text-ink-muted/80 mt-1.5 text-xs">
            {tx(result.domain.instrument)}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Compact chips used by the "most weight" and "holding steady" summaries. */
export function DomainChips({ results }: { results: DomainResult[] }) {
  const { t, tx } = useLanguage();

  return (
    <ul className="flex flex-wrap gap-2">
      {results.map((result) => (
        <li
          key={result.domain.id}
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium ${BAND_CHIP[result.band.id]}`}
        >
          {tx(result.domain.name)}
          <span className="opacity-60">{t.band(result.band.id)}</span>
        </li>
      ))}
    </ul>
  );
}

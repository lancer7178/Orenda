"use client";

import { motion } from "motion/react";
import { useLanguage } from "./language-provider";
import type { SectionPosition } from "@/lib/assessment";

interface SectionProgressProps {
  section: SectionPosition;
  sectionName: string;
  minutesRemaining: number;
}

/**
 * Chunked progress. Fifty-five questions is a mountain; six is an errand — so
 * the prominent readout is always position *within the current section*, with
 * one dot per question so the end of the stretch is visible at a glance.
 *
 * The whole-battery number is deliberately absent here: it lives in the thin
 * bar above, where it informs without looming.
 */
export function SectionProgress({
  section,
  sectionName,
  minutesRemaining,
}: SectionProgressProps) {
  const { t } = useLanguage();
  const remaining = section.total - section.position + 1;
  const isLast = remaining === 1;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: section.total }, (_, index) => {
          const isCurrent = index === section.position - 1;
          const isPast = index < section.position - 1;

          return (
            <motion.span
              key={index}
              initial={false}
              animate={{
                width: isCurrent ? 20 : 6,
                opacity: isCurrent ? 1 : isPast ? 0.9 : 0.35,
              }}
              transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
              className={[
                "h-1.5 rounded-full",
                isCurrent
                  ? "bg-sage-500"
                  : isPast
                    ? "bg-sage-300"
                    : "bg-hairline",
              ].join(" ")}
            />
          );
        })}
      </div>

      <p className="text-ink-muted text-xs">
        <span className="text-ink-soft font-medium">{sectionName}</span>
        <span className="mx-1.5 opacity-40">·</span>
        {isLast ? (
          <span className="text-sage-600 font-medium">
            {t("lastOneInSection")}
          </span>
        ) : (
          <>
            <span className="tabular-nums">{remaining}</span>{" "}
            {t("leftInSection")}
          </>
        )}
      </p>

      {minutesRemaining > 0 ? (
        <p className="text-ink-muted/70 ms-auto text-xs tabular-nums">
          ~{minutesRemaining} {t("minutesLeft")}
        </p>
      ) : null}
    </div>
  );
}

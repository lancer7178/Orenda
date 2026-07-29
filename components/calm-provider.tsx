"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MotionConfig } from "motion/react";
import {
  getCalmSnapshot,
  getServerCalmSnapshot,
  setCalm,
  subscribeToCalm,
} from "@/lib/calm-store";

export function useCalmMode() {
  const calm = useSyncExternalStore(
    subscribeToCalm,
    getCalmSnapshot,
    getServerCalmSnapshot,
  );

  // Syncing a class onto an external system (the document) — the CSS in
  // globals.css keys the ambient background off it.
  useEffect(() => {
    document.documentElement.classList.toggle("calm-mode", calm);
  }, [calm]);

  return { calm, setCalm };
}

/**
 * Calm mode has to reach the JS animations to mean anything.
 *
 * Almost every moving thing here is a Motion animation — cards sliding in,
 * answers staggering, hover scale, the selection ripple, the rotating leaf,
 * the orbiting hero. A CSS class cannot stop any of it, so an earlier
 * CSS-only version of this switch was close to a placebo.
 *
 * `reducedMotion="always"` makes Motion skip transform and layout animations
 * (x/y, scale, rotate) while still allowing opacity and colour to fade, which
 * is exactly the intent: the page still responds, it just stops moving.
 */
export function CalmProvider({ children }: { children: React.ReactNode }) {
  const { calm } = useCalmMode();

  return (
    <MotionConfig reducedMotion={calm ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}

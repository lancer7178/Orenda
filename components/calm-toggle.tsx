"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useLanguage } from "./language-provider";
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
  // globals.css keys every ambient animation off it.
  useEffect(() => {
    document.documentElement.classList.toggle("calm-mode", calm);
  }, [calm]);

  return { calm, setCalm };
}

function WavesIcon({ calm, className }: { calm: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      {calm ? (
        // Stilled: flat lines.
        <>
          <path d="M2.5 6h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M2.5 10h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </>
      ) : (
        // Moving: waves.
        <>
          <path
            d="M2.5 6.5c1.4-1.6 2.8-1.6 4.2 0s2.8 1.6 4.2 0 2.2-1.3 2.6-.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M2.5 10.5c1.4-1.6 2.8-1.6 4.2 0s2.8 1.6 4.2 0 2.2-1.3 2.6-.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export function CalmToggle() {
  const { t } = useLanguage();
  const { calm, setCalm: apply } = useCalmMode();

  return (
    <button
      type="button"
      onClick={() => apply(!calm)}
      aria-pressed={calm}
      aria-label={t("focusModeAria")}
      title={calm ? t("focusModeOff") : t("focusModeOn")}
      className={[
        "border-hairline/60 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
        calm
          ? "bg-sage-100 text-sage-700 border-sage-200/70"
          : "text-ink-muted hover:text-ink bg-surface/60 hover:bg-sage-50/70",
      ].join(" ")}
    >
      <WavesIcon calm={calm} className="h-4 w-4" />
    </button>
  );
}

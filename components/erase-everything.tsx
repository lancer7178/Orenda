"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "./language-provider";
import {
  clearProgress,
  getSavedProgressSnapshot,
  getServerProgressSnapshot,
  subscribeToSavedProgress,
} from "@/lib/progress-store";

interface EraseEverythingProps {
  /** Called after the data is cleared, e.g. to reset in-memory state. */
  onErased?: () => void;
  /** Extra classes for the trigger row. */
  className?: string;
}

/**
 * An explicit, unhurried privacy control: "Erase my responses", behind a calm
 * confirmation. It only appears when there is actually something saved on the
 * device, so it never implies data exists where none does.
 *
 * Erasing removes the same localStorage key the flow writes to — nothing is
 * sent anywhere to accomplish it, because nothing was ever stored anywhere
 * else.
 */
export function EraseEverything({ onErased, className }: EraseEverythingProps) {
  const { t, isRtl } = useLanguage();

  // Presence on arrival. The snapshot is load-time cached, so once we erase we
  // track that locally rather than expecting the snapshot to change.
  const savedRaw = useSyncExternalStore(
    subscribeToSavedProgress,
    getSavedProgressSnapshot,
    getServerProgressSnapshot,
  );

  const [open, setOpen] = useState(false);
  const [erased, setErased] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback(() => {
    clearProgress();
    setErased(true);
    setOpen(false);
    onErased?.();
  }, [onErased]);

  if (erased) {
    return (
      <p
        className={`text-ink-muted inline-flex items-center gap-2 text-xs ${className ?? ""}`}
      >
        <CheckIcon className="text-sage-500 h-3.5 w-3.5" />
        {t("eraseDone")}
      </p>
    );
  }

  if (!savedRaw) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`text-ink-muted hover:text-tone-high inline-flex items-center gap-1.5 rounded-full text-xs transition-colors duration-300 ${className ?? ""}`}
      >
        <TrashIcon className="h-3.5 w-3.5" />
        {t("eraseCta")}
      </button>

      <AnimatePresence>
        {open ? (
          <EraseDialog
            isRtl={isRtl}
            title={t("eraseDialogTitle")}
            body={t("eraseDialogBody")}
            cancelLabel={t("eraseCancel")}
            confirmLabel={t("eraseConfirm")}
            onCancel={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            onConfirm={confirm}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------

function EraseDialog({
  isRtl,
  title,
  body,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  isRtl: boolean;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Escape closes; focus lands on the safe (Cancel) action on open, so a stray
  // Enter never erases. Body scroll is locked while the dialog is up.
  useEffect(() => {
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* A dark scrim in both themes: `bg-ink` would invert to a light veil in
          dark mode, so the backdrop is a fixed translucent black instead. */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onCancel}
        aria-hidden="true"
      />

      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="erase-title"
        aria-describedby="erase-body"
        dir={isRtl ? "rtl" : "ltr"}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
        className="glass-card relative w-full max-w-sm rounded-3xl p-7"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <h2
          id="erase-title"
          className="font-display text-ink text-xl font-semibold tracking-tight"
        >
          {title}
        </h2>
        <p id="erase-body" className="text-ink-soft mt-3 text-[15px] leading-relaxed">
          {body}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink rounded-full border bg-surface px-6 py-3 text-[15px] font-medium transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-tone-high/90 hover:bg-tone-high rounded-full px-6 py-3 text-[15px] font-medium text-white transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 4.5h10M6.5 4.5V3.2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.3M4.2 4.5l.5 8a1.2 1.2 0 0 0 1.2 1.1h4.2a1.2 1.2 0 0 0 1.2-1.1l.5-8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2.5 6.2 4.9 8.5 9.5 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

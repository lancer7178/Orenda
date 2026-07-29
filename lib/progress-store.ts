import { PROGRESS_STORAGE_KEY } from "./assessment";

/**
 * A read-only snapshot of whatever was in storage when the page loaded, for
 * `useSyncExternalStore`. Reading once and caching forever is deliberate: the
 * resume prompt asks about the run that existed *on arrival*, and a stable
 * snapshot is what `useSyncExternalStore` requires.
 *
 * Writes go straight to localStorage and never touch the cache, so saving
 * progress cannot re-trigger the prompt.
 */

let snapshot: string | null = null;
let hasRead = false;

/** No cross-tab subscription: the snapshot is intentionally load-time only. */
export function subscribeToSavedProgress(): () => void {
  return () => {};
}

export function getSavedProgressSnapshot(): string | null {
  if (!hasRead) {
    hasRead = true;
    try {
      snapshot = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    } catch {
      snapshot = null;
    }
  }
  return snapshot;
}

export function getServerProgressSnapshot(): string | null {
  return null;
}

export function saveProgress(serialized: string): void {
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, serialized);
  } catch {
    // Storage can be full or blocked; the in-memory run continues regardless.
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch {
    // Nothing to do — the next run will simply overwrite it.
  }
}

/* ---------------------------------------------------------------------------
   Returning from the breathing space.

   Stepping away to breathe should not be punished with a "you left an
   assessment unfinished" prompt on the way back — that turns a break into a
   decision. This flag says "resume straight into the question they were on".

   It is session-scoped and read exactly once: the getter caches the value and
   removes it immediately, so a later visit still gets the normal prompt.
--------------------------------------------------------------------------- */

const AUTO_RESUME_KEY = "orenda.resume-immediately";

let autoResume: boolean | null = null;

export function markAutoResume(): void {
  try {
    window.sessionStorage.setItem(AUTO_RESUME_KEY, "1");
  } catch {
    // Falls back to the normal resume prompt, which is a safe default.
  }
}

export function getAutoResumeSnapshot(): boolean {
  if (autoResume === null) {
    try {
      autoResume = window.sessionStorage.getItem(AUTO_RESUME_KEY) === "1";
      window.sessionStorage.removeItem(AUTO_RESUME_KEY);
    } catch {
      autoResume = false;
    }
  }
  return autoResume;
}

export function getServerAutoResumeSnapshot(): boolean {
  return false;
}

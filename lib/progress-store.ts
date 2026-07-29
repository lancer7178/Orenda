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

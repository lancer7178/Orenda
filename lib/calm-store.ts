/**
 * "Calm the page" — a manual switch that stills the ambient motion (the
 * breathing background wash, pulsing dots, shimmer, float).
 *
 * `prefers-reduced-motion` already covers people who set it at the OS level,
 * but plenty of people who are distracted by drifting backgrounds have never
 * found that setting. This puts the same relief one click away, which matters
 * most on a 55-question flow where the page is in view for ten minutes.
 *
 * Same load-time snapshot pattern as the locale store: read once, cache
 * forever, so `useSyncExternalStore` gets a stable value and no effect has to
 * call setState during hydration.
 */

const STORAGE_KEY = "orenda.calm";

let cached: boolean | null = null;
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function subscribeToCalm(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCalmSnapshot(): boolean {
  cached ??= read();
  return cached;
}

export function getServerCalmSnapshot(): boolean {
  return false;
}

export function setCalm(next: boolean): void {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Persisting is a convenience; the in-memory value still drives the UI.
  }
  for (const listener of listeners) listener();
}

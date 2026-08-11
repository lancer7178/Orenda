/**
 * Light / dark preference.
 *
 * Three states, not two: "system" follows the OS (via the CSS
 * `prefers-color-scheme` media query in globals.css), while "light" and "dark"
 * are explicit overrides the header toggle writes. The preference stays on the
 * device in localStorage — like the locale and calm switches, nothing about it
 * is ever sent anywhere.
 *
 * Same load-time snapshot pattern as the other stores: read once, cache, so
 * `useSyncExternalStore` gets a stable value and no effect calls setState
 * during hydration.
 */

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "orenda.theme";
const DEFAULT_PREFERENCE: ThemePreference = "system";

let cached: ThemePreference | null = null;
const listeners = new Set<() => void>();

function isPreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function read(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

/** Picks up the change when Orenda is open in a second tab. */
function handleStorageEvent(event: StorageEvent) {
  if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;
  cached = read();
  applyTheme(cached);
  emit();
}

export function subscribeToTheme(listener: () => void): () => void {
  if (listeners.size === 0 && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

export function getThemeSnapshot(): ThemePreference {
  cached ??= read();
  return cached;
}

export function getServerThemeSnapshot(): ThemePreference {
  return DEFAULT_PREFERENCE;
}

/** Whether the OS currently asks for dark, used to resolve "system". */
export function systemPrefersDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------------------
   `prefers-color-scheme` as an external store.

   Resolving "system" needs the live OS setting, but reading matchMedia during
   render answers differently on the server (always light) than the client,
   which would mismatch on hydration. Exposing it through useSyncExternalStore
   gives the SSR default first, then the real value after mount, with no
   setState-in-effect and no mounted flag.
--------------------------------------------------------------------------- */

export function subscribeToSystemDark(listener: () => void): () => void {
  let query: MediaQueryList;
  try {
    query = window.matchMedia("(prefers-color-scheme: dark)");
  } catch {
    return () => {};
  }
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export function getSystemDarkSnapshot(): boolean {
  return systemPrefersDark();
}

export function getServerSystemDarkSnapshot(): boolean {
  return false;
}

/** The concrete theme in effect for a given preference. */
export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") return systemPrefersDark() ? "dark" : "light";
  return preference;
}

/**
 * Reflects the preference onto the document. "system" clears the attribute so
 * the media query in globals.css takes over; "light"/"dark" pin it. Keeping
 * this in one place means the no-flash inline script and the React effect stay
 * in agreement.
 */
export function applyTheme(preference: ThemePreference): void {
  const root = document.documentElement;
  if (preference === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", preference);
  }
}

export function setTheme(next: ThemePreference): void {
  cached = next;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Persisting is a convenience; the in-memory value still drives the UI.
  }
  applyTheme(next);
  emit();
}

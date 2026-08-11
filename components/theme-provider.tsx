"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  applyTheme,
  getServerSystemDarkSnapshot,
  getServerThemeSnapshot,
  getSystemDarkSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeToSystemDark,
  subscribeToTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme-store";

/**
 * Reads the stored light/dark preference and keeps the document's `data-theme`
 * attribute in sync with it. The inline script in <head> (see layout.tsx) has
 * already set the attribute before paint for explicit choices; this re-asserts
 * it after hydration and, crucially, re-resolves "system" live when the OS
 * theme flips while the tab is open.
 */
export function useTheme(): {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setTheme: (next: ThemePreference) => void;
  toggle: () => void;
} {
  const preference = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  // Live OS setting as an SSR-safe external store: server yields light, the
  // client re-renders with the real value after hydration. This also makes
  // the toggle icon follow an OS theme change while the preference is
  // "system", with no manual media-query effect.
  const systemDark = useSyncExternalStore(
    subscribeToSystemDark,
    getSystemDarkSnapshot,
    getServerSystemDarkSnapshot,
  );

  // Keep the document's data-theme in step with the stored preference:
  // "light"/"dark" pin it, "system" clears it so the CSS media query drives.
  useEffect(() => {
    applyTheme(preference);
  }, [preference]);

  const resolved: ResolvedTheme =
    preference === "system" ? (systemDark ? "dark" : "light") : preference;

  return {
    preference,
    resolved,
    setTheme,
    // Toggling from the current *effective* theme means one tap always flips
    // what the eye sees, whether the starting point was explicit or "system".
    toggle: () => setTheme(resolved === "dark" ? "light" : "dark"),
  };
}

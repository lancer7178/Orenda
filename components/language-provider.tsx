"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { createTranslator, type Translator } from "@/lib/ui-text";
import type { Locale, LocalizedText } from "@/lib/types";

const STORAGE_KEY = "orenda.locale";
const DEFAULT_LOCALE: Locale = "en";

/* ---------------------------------------------------------------------------
   localStorage-backed locale store.

   The language preference is the only thing Orenda persists, and it stays on
   the device — no cookie is sent, so the server has no way to know it. That
   makes the locale an external store the UI subscribes to, which is exactly
   what `useSyncExternalStore` is for: it renders the server snapshot during
   hydration, then swaps to the stored value without a cascading effect.
--------------------------------------------------------------------------- */

let cachedLocale: Locale | null = null;
const listeners = new Set<() => void>();

function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ar";
}

function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : DEFAULT_LOCALE;
  } catch {
    // Private-mode browsers can throw on storage access; the default is fine.
    return DEFAULT_LOCALE;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

/** Picks up the change when the user has Orenda open in a second tab. */
function handleStorageEvent(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  cachedLocale = readStoredLocale();
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorageEvent);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

function getSnapshot(): Locale {
  cachedLocale ??= readStoredLocale();
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function writeLocale(next: Locale) {
  cachedLocale = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Persisting is a convenience; the in-memory value still drives the UI.
  }
  emit();
}

/* --------------------------------------------------------------------------- */

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  /** Chrome copy, by key. */
  t: Translator;
  /** Resolves an authored `LocalizedText` (domain names, band readings, …). */
  tx: (value: LocalizedText) => string;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep the document in sync so `html[lang]` CSS rules, screen readers and
  // text direction all follow the active language.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => writeLocale(next), []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      isRtl: locale === "ar",
      t: createTranslator(locale),
      tx: (value: LocalizedText) => value[locale],
      setLocale,
      toggleLocale: () => setLocale(locale === "en" ? "ar" : "en"),
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a <LanguageProvider>");
  }
  return context;
}

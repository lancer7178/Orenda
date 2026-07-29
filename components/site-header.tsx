"use client";

import Link from "next/link";
import { LeafMark } from "./leaf-mark";
import { useLanguage } from "./language-provider";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect
        x="3.25"
        y="7"
        width="9.5"
        height="6.25"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5.75 7V5.25a2.25 2.25 0 0 1 4.5 0V7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  const { t, toggleLocale, locale } = useLanguage();

  return (
    <header className="border-hairline/60 sticky top-0 z-30 border-b bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-full transition-opacity hover:opacity-70"
        >
          <LeafMark className="text-sage-400 h-6 w-6" />
          <span className="font-display text-ink text-lg leading-none font-semibold tracking-tight">
            {t("brand")}
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="border-sage-200/70 bg-sage-50/60 text-sage-700 hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium sm:inline-flex">
            <LockIcon className="h-3.5 w-3.5" />
            {t("privacyBadge")}
          </span>

          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t("languageToggleAria")}
            className="border-hairline text-ink-soft hover:border-sage-300 hover:text-ink rounded-full border bg-surface px-3.5 py-1.5 text-sm font-medium transition-colors"
          >
            <span className={locale === "en" ? "font-arabic" : undefined}>
              {t("languageToggle")}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

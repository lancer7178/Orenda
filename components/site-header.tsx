"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./language-provider";
import lockup from "@/public/orenda-lockup.png";
import type { Locale } from "@/lib/types";

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

/**
 * Language names are given in their own language — the convention that lets a
 * reader find their language without already knowing the interface language.
 */
const LANGUAGES: Array<{ code: Locale; short: string; name: string }> = [
  { code: "en", short: "EN", name: "English" },
  { code: "ar", short: "ع", name: "العربية" },
];

export function SiteHeader() {
  const { t, locale, setLocale } = useLanguage();

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link
            href="/"
            aria-label={t("brand")}
            className="shrink-0 rounded-lg transition-opacity duration-300 hover:opacity-65"
          >
            <Image
              src={lockup}
              alt={t("brand")}
              priority
              className="h-7 w-auto sm:h-8"
              sizes="160px"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="border-sage-200/60 bg-sage-50/60 text-sage-700 hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium md:inline-flex">
              <LockIcon className="h-3.5 w-3.5" />
              {t("privacyBadge")}
            </span>

            <div
              role="group"
              aria-label={t("languageGroup")}
              className="border-hairline/60 flex items-center gap-0.5 rounded-full border bg-surface/60 p-1"
            >
              {LANGUAGES.map((language) => {
                const isActive = language.code === locale;
                return (
                  <button
                    key={language.code}
                    type="button"
                    lang={language.code}
                    onClick={() => setLocale(language.code)}
                    aria-pressed={isActive}
                    aria-label={language.name}
                    title={language.name}
                    className={[
                      "min-w-9 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 ease-out",
                      isActive
                        ? "bg-sage-100 text-sage-700"
                        : "text-ink-muted hover:bg-sage-50/70 hover:text-ink",
                    ].join(" ")}
                  >
                    {language.short}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* A hairline that fades at both ends, plus a soft wash below it, so the
          header dissolves into the page instead of cutting across it. */}
      <div
        aria-hidden="true"
        className="via-hairline h-px w-full bg-linear-to-r from-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="from-cream/80 h-5 w-full bg-linear-to-b to-transparent"
      />
    </header>
  );
}

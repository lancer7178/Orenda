"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "./language-provider";
import { CalmToggle } from "./calm-toggle";
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
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className="sticky top-0 z-30"
    >
      <div className="bg-cream/80 backdrop-blur-xl" style={{ backdropFilter: "blur(20px) saturate(1.4)" }}>
        {/* Matches the hero's own max-w-6xl / px-5 sm:px-8 exactly, so the
            logo and hero headline share a left edge on the landing page
            instead of the navbar sitting cramped in a narrower strip. */}
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:py-5">
          <Link
            href="/"
            aria-label={t("brand")}
            className="shrink-0 rounded-lg transition-all duration-300 hover:opacity-65 hover:scale-[1.02]"
          >
            <Image
              src={lockup}
              alt={t("brand")}
              priority
              className="h-7 w-auto sm:h-8"
              sizes="160px"
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="border-sage-200/60 bg-sage-50/60 text-sage-700 hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium md:inline-flex"
            >
              <LockIcon className="h-3.5 w-3.5" />
              {t("privacyBadge")}
            </motion.span>

            <CalmToggle />

            <div
              role="group"
              aria-label={t("languageGroup")}
              className="border-hairline/60 relative flex items-center gap-0.5 rounded-full border bg-surface/60 p-1"
            >
              {/* Sliding background indicator */}
              <motion.div
                layout
                className="bg-sage-100 absolute h-[calc(100%-8px)] rounded-full"
                style={{
                  width: `calc(${100 / LANGUAGES.length}% - 4px)`,
                }}
                animate={{
                  x: locale === "en" ? 4 : "calc(100% + 4px)",
                }}
                transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              />

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
                      "relative z-10 min-w-9 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors duration-300 ease-out",
                      isActive
                        ? "text-sage-700"
                        : "text-ink-muted hover:text-ink",
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
    </motion.header>
  );
}

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "./language-provider";
import { LeafMark } from "./leaf-mark";
import { DOMAINS } from "@/lib/domains";
import { QUESTION_COUNT_BY_DOMAIN } from "@/lib/questions";
import type { UIKey } from "@/lib/ui-text";

const rise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const transition = { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const };

const PRINCIPLES: Array<{ title: UIKey; body: UIKey }> = [
  { title: "principleOneTitle", body: "principleOneBody" },
  { title: "principleTwoTitle", body: "principleTwoBody" },
  { title: "principleThreeTitle", body: "principleThreeBody" },
];

const META: UIKey[] = [
  "landingMetaQuestions",
  "landingMetaAreas",
  "landingMetaTime",
  "landingMetaNoTimer",
];

export function LandingScreen() {
  const { t, tx, isRtl } = useLanguage();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pt-14 pb-20 sm:px-8 sm:pt-24">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p
          variants={rise}
          transition={transition}
          className="text-sage-600 flex items-center gap-2.5 text-sm font-medium tracking-wide"
        >
          <span className="bg-sage-400 h-1.5 w-1.5 rounded-full" />
          {t("landingEyebrow")}
        </motion.p>

        <motion.h1
          variants={rise}
          transition={transition}
          className="font-display text-ink mt-6 text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.1]"
        >
          {t("landingTitle")}
        </motion.h1>

        <motion.p
          variants={rise}
          transition={transition}
          className="text-ink-soft mt-6 max-w-xl text-lg leading-relaxed text-pretty"
        >
          {t("landingBody")}
        </motion.p>

        <motion.div
          variants={rise}
          transition={transition}
          className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7"
        >
          <Link
            href="/assessment"
            className="group bg-sage-500 hover:bg-sage-600 shadow-sage-600/15 hover:shadow-sage-600/25 inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            {t("startCta")}
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${
                isRtl ? "-scale-x-100 group-hover:-translate-x-1" : ""
              }`}
            >
              <path
                d="M4 10h11m0 0-4-4m4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <ul className="text-ink-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {META.map((key, index) => (
              <li key={key} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-hairline">
                    ·
                  </span>
                ) : null}
                {t(key)}
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* What the battery covers ------------------------------------------ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ ...transition, delay: 0.1 }}
        className="border-hairline/70 mt-20 border-t pt-10 sm:mt-24"
      >
        <h2 className="font-display text-ink text-2xl font-semibold tracking-tight">
          {t("landingCoverageTitle")}
        </h2>
        <p className="text-ink-soft mt-3 max-w-xl text-[15px] leading-relaxed">
          {t("landingCoverageBody")}
        </p>

        <ol className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {DOMAINS.map((domain, index) => (
            <li
              key={domain.id}
              className="border-hairline/60 flex items-baseline gap-3 border-b pb-4"
            >
              <span className="text-sage-500 text-xs font-semibold tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <h3 className="text-ink text-[15px] font-semibold">
                  {tx(domain.name)}
                </h3>
                <p className="text-ink-muted mt-1 text-xs">
                  {tx(domain.instrument)} · {QUESTION_COUNT_BY_DOMAIN[domain.id]}{" "}
                  {t("questionsWord")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* Principles -------------------------------------------------------- */}
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
        className="mt-16 grid gap-4 sm:grid-cols-3"
      >
        {PRINCIPLES.map((principle, index) => (
          <motion.li
            key={principle.title}
            variants={rise}
            transition={{ ...transition, delay: index * 0.08 }}
            className="border-hairline/70 rounded-3xl border bg-surface/70 p-6 backdrop-blur-sm"
          >
            <span className="bg-sage-100 text-sage-600 mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
              {index + 1}
            </span>
            <h2 className="text-ink text-[15px] font-semibold">
              {t(principle.title)}
            </h2>
            <p className="text-ink-soft mt-2 text-sm leading-relaxed">
              {t(principle.body)}
            </p>
          </motion.li>
        ))}
      </motion.ul>

      <footer className="border-hairline/70 mt-16 border-t pt-8">
        <p className="text-ink-muted flex items-start gap-3 text-xs leading-relaxed">
          <LeafMark className="text-sage-300 mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("disclaimer")}</span>
        </p>
        <p className="text-ink-muted/70 mt-3 ps-7 text-xs italic">
          {t("brand")} — {t("brandMeaning")}.
        </p>
      </footer>
    </main>
  );
}

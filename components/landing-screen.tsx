"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useLanguage } from "./language-provider";
import { LeafMark } from "./leaf-mark";
import { DOMAINS } from "@/lib/domains";
import { QUESTION_COUNT_BY_DOMAIN } from "@/lib/questions";
import type { UIKey } from "@/lib/ui-text";

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const transition = { duration: 0.75, ease: [0.22, 0.61, 0.36, 1] as const };

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
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, 40]);

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — given its own wider stage so the visual has room to breathe
          alongside the text, then the page narrows back to reading width. */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Ambient glow behind hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-150 w-200 -translate-x-1/2 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-sage-200) 60%, transparent), transparent 70%)",
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-y-14 px-5 pt-14 pb-8 sm:px-8 sm:pt-20 md:grid-cols-[1.05fr_0.95fr] md:gap-x-12 lg:pt-24 lg:pb-14"
        >
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.p
              variants={rise}
              transition={transition}
              className="group border-sage-200/60 bg-sage-50/60 text-sage-700 relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-1.5 text-sm font-medium tracking-wide"
            >
              <span className="bg-sage-400 orenda-glow-dot h-1.5 w-1.5 rounded-full" />
              {t("landingEyebrow")}
              {/* Shimmer sweep */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ animation: "shimmer 3s ease-in-out infinite" }}
              />
            </motion.p>

            <motion.h1
              variants={rise}
              transition={transition}
              className="font-display text-ink mt-7 text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.08] lg:text-[4.25rem] lg:leading-[1.06]"
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
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/assessment"
                className="group bg-sage-500 hover:bg-sage-600 inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-elevated)" }}
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

              <a
                href="#coverage"
                className="text-ink-soft hover:text-ink decoration-hairline hover:decoration-ink-muted inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-[15px] font-medium underline underline-offset-4 transition-colors duration-300"
              >
                {t("landingSecondaryCta")}
              </a>
            </motion.div>

            <motion.ul
              variants={rise}
              transition={transition}
              className="text-ink-muted mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
            >
              {META.map((key, index) => (
                <li key={key} className="flex items-center gap-3">
                  {t(key)}
                  {/* Trailing rather than leading: this list wraps onto three
                      lines on a phone, and a leading separator would start
                      those lines with a stray dot. */}
                  {index < META.length - 1 ? (
                    <span aria-hidden="true" className="text-hairline">
                      ·
                    </span>
                  ) : null}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            className="hidden md:block"
          >
            <HeroVisual />
          </motion.div>
        </motion.div>
      </section>

      {/* Everything below reads at a narrower, text-comfortable width. */}
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 sm:px-8">
        {/* What the battery covers ------------------------------------------ */}
        <motion.section
          id="coverage"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
          className="border-hairline/70 scroll-mt-24 border-t pt-10"
        >
          <motion.h2
            variants={rise}
            transition={transition}
            className="font-display text-ink text-2xl font-semibold tracking-tight"
          >
            {t("landingCoverageTitle")}
          </motion.h2>
          <motion.p
            variants={rise}
            transition={transition}
            className="text-ink-soft mt-3 max-w-xl text-[15px] leading-relaxed"
          >
            {t("landingCoverageBody")}
          </motion.p>

          <ol className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {DOMAINS.map((domain, index) => (
              <motion.li
                key={domain.id}
                variants={rise}
                transition={{ ...transition, delay: index * 0.04 }}
                className="group border-hairline/60 flex items-baseline gap-3 rounded-2xl border-b px-3 py-4 transition-all duration-300 hover:bg-sage-50/50"
              >
                <span className="text-sage-500 text-xs font-semibold tabular-nums transition-transform duration-300 group-hover:scale-110">
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
                {/* Hover accent bar */}
                <span
                  aria-hidden="true"
                  className="bg-sage-400 h-6 w-0.5 origin-center scale-y-0 rounded-full opacity-0 transition-all duration-300 group-hover:scale-y-100 group-hover:opacity-60"
                />
              </motion.li>
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
              transition={{ ...transition, delay: index * 0.1 }}
              className="glass-card glass-card-hover group rounded-3xl p-6"
            >
              <span className="bg-sage-100 text-sage-600 mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:scale-105">
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
          {/* Decorative leaf cluster */}
          <div
            aria-hidden="true"
            className="text-sage-200 -mt-12 mb-4 flex justify-center"
          >
            <LeafMark className="h-5 w-5 -rotate-12 opacity-40" />
            <LeafMark className="h-6 w-6 opacity-60" />
            <LeafMark className="-ms-1 h-5 w-5 rotate-12 opacity-40" />
          </div>
          <p className="text-ink-muted flex items-start gap-3 text-xs leading-relaxed">
            <LeafMark className="text-sage-300 mt-0.5 h-4 w-4 shrink-0" />
            <span>{t("disclaimer")}</span>
          </p>
          <p className="text-ink-muted/70 mt-3 ps-7 text-xs italic">
            {t("brand")} — {t("brandMeaning")}.
          </p>
        </footer>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------

/**
 * A decorative echo of the result screen's dial and domain rings — concentric
 * circles slowly breathing, with nine points orbiting the mark for the nine
 * sections. Entirely aria-hidden; it carries mood, not information.
 */
function HeroVisual() {
  const points = Array.from({ length: 9 }, (_, i) => {
    const angle = (i / 9) * 2 * Math.PI - Math.PI / 2;
    const radius = 47;
    return {
      left: `${50 + radius * Math.cos(angle)}%`,
      top: `${50 + radius * Math.sin(angle)}%`,
    };
  });

  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-md">
      {/* Background glow */}
      <div
        className="absolute inset-[6%] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-sage-300) 45%, transparent), transparent)",
        }}
      />

      {/* Outer breathing ring */}
      <motion.div
        animate={{ scale: [1, 1.035, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="border-sage-200/60 absolute inset-[6%] rounded-full border"
      />

      {/* Middle ring with glassmorphism */}
      <motion.div
        animate={{ scale: [1, 1.025, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="border-sage-200/70 absolute inset-[19%] rounded-full border"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,254,252,0.3), transparent 70%)",
        }}
      />

      {/* Dashed inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        className="border-hairline/60 absolute inset-[32%] rounded-full border border-dashed"
      />

      {/* Ghost ring for depth */}
      <div className="border-sage-100/30 absolute inset-[12%] rounded-full border" />
      <div className="border-sage-100/20 absolute inset-[25%] rounded-full border" />

      {/* Orbiting dots */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        {points.map((point, index) => (
          <motion.span
            key={index}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.35,
            }}
            className="bg-sage-400/80 absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={point}
          />
        ))}
      </motion.div>

      {/* Center leaf mark with pulse ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Pulse ring */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-sage-200/30 absolute h-24 w-24 rounded-full"
        />
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-surface ring-1 ring-sage-100"
          style={{
            boxShadow: "var(--shadow-elevated), var(--shadow-glow-sage)",
          }}
        >
          <LeafMark className="text-sage-500 h-10 w-10" />
        </div>
      </div>
    </div>
  );
}

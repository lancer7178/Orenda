import { forwardRef } from "react";
import type { AssessmentState, DomainResult, Locale, ResultLevel, ResultTone } from "@/lib/types";
import type { Translator } from "@/lib/ui-text";

/**
 * A print-only render of the result screen, captured to an image via
 * html2canvas and embedded in the exported PDF (see lib/pdf-export.ts).
 *
 * Every color here is a literal hex/rgba value rather than a Tailwind
 * utility class. html2canvas's CSS parser does not understand `color-mix()`
 * — which is what Tailwind v4 compiles opacity modifiers like `bg-x/10` down
 * to — so any of those classes would rasterize as black or transparent.
 * Plain inline styles sidestep that entirely.
 *
 * Real DOM text (rather than jsPDF's own vector text drawing) is also what
 * makes Arabic work at all: the browser's own text engine handles glyph
 * shaping and bidi ordering, neither of which jsPDF does on its own.
 */

const COLOR = {
  surface: "#fffefc",
  hairline: "#e6e2da",
  ink: "#2d3748",
  inkSoft: "#57616f",
  inkMuted: "#8b93a0",
  sage50: "#f2f5f3",
  sage100: "#e2eae5",
  sage200: "#c6d5cd",
  sage500: "#77907f",
  sage700: "#4a5c52",
} as const;

const TONE_HEX: Record<ResultTone, string> = {
  steady: "#8da399",
  mild: "#7f9aa4",
  moderate: "#b79a6d",
  elevated: "#bf8a72",
  high: "#a9707a",
};

const BAND_HEX: Record<string, string> = {
  settled: TONE_HEX.steady,
  noticeable: TONE_HEX.moderate,
  elevated: TONE_HEX.elevated,
  high: TONE_HEX.high,
};

function hexToRgba(hex: string, alpha: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface PdfExportTemplateProps {
  state: AssessmentState;
  result: ResultLevel;
  resultTone: ResultTone;
  domainResults: DomainResult[];
  topDomains: DomainResult[];
  steadyDomains: DomainResult[];
  showCrisis: boolean;
  maxScore: number;
  locale: Locale;
  isRtl: boolean;
  t: Translator;
  tx: (value: { en: string; ar: string }) => string;
  generatedOn: string;
}

const bodyFont = (isRtl: boolean) =>
  isRtl ? "var(--font-arabic)" : "var(--font-sans)";
const displayFont = (isRtl: boolean) =>
  isRtl ? "var(--font-arabic)" : "var(--font-display)";

export const PdfExportTemplate = forwardRef<HTMLDivElement, PdfExportTemplateProps>(
  function PdfExportTemplate(
    {
      state,
      result,
      resultTone,
      domainResults,
      topDomains,
      steadyDomains,
      showCrisis,
      maxScore,
      locale,
      isRtl,
      t,
      tx,
      generatedOn,
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        dir={isRtl ? "rtl" : "ltr"}
        lang={locale}
        style={{
          width: 794,
          padding: 48,
          background: COLOR.surface,
          color: COLOR.ink,
          fontFamily: bodyFont(isRtl),
          fontSize: 14,
          lineHeight: 1.6,
          textAlign: "start",
        }}
      >
        {/* Header ------------------------------------------------------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9999,
                background: COLOR.sage100,
                color: COLOR.sage700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                style={{ width: 16, height: 16 }}
              >
                <path
                  d="M12 21.5V11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M12 11.5c0-4.2 2.8-7.6 7-8.5.6 4.6-1.4 8.6-5.2 9.4-.7.2-1.3.1-1.8-.1a1.2 1.2 0 0 1 0-.8Z"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
                <path
                  d="M11.6 15.4c-.5-3.1-2.6-5.3-5.7-5.9-.3 3.3 1.2 6 4 6.6.5.1 1 .1 1.4-.1a.9.9 0 0 0 .3-.6Z"
                  fill="currentColor"
                  fillOpacity="0.45"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: displayFont(isRtl),
                fontWeight: 600,
                fontSize: 20,
                color: COLOR.sage700,
              }}
            >
              {t("brand")}
            </span>
          </div>
          <span style={{ fontSize: 11, color: COLOR.inkMuted }}>
            {generatedOn}
          </span>
        </div>

        <div
          style={{
            height: 1,
            background: COLOR.hairline,
            margin: "20px 0 28px",
          }}
        />

        {/* Crisis note ---------------------------------------------------- */}
        {showCrisis ? (
          <div
            style={{
              border: `1px solid ${hexToRgba(TONE_HEX.high, 0.3)}`,
              background: hexToRgba(TONE_HEX.high, 0.07),
              borderRadius: 18,
              padding: "18px 20px",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: TONE_HEX.high,
                marginBottom: 8,
              }}
            >
              {t("crisisTitle")}
            </div>
            <div style={{ fontSize: 13, color: COLOR.inkSoft }}>
              {t("crisisBody")}
            </div>
          </div>
        ) : null}

        {/* Eyebrow + score + headline ------------------------------------- */}
        <div style={{ fontSize: 12, color: COLOR.inkMuted, marginBottom: 14 }}>
          {t("resultEyebrow")}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 9999,
              border: `8px solid ${hexToRgba(TONE_HEX[resultTone], 0.35)}`,
              background: COLOR.sage50,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: displayFont(isRtl),
                fontSize: 32,
                fontWeight: 600,
                lineHeight: 1,
                color: COLOR.ink,
              }}
            >
              {state.totalScore}
            </span>
            <span style={{ fontSize: 10, color: COLOR.inkMuted, marginTop: 4 }}>
              {t("resultOutOf")} {maxScore}
            </span>
          </div>

          <div>
            <div
              style={{
                fontFamily: displayFont(isRtl),
                fontSize: 26,
                fontWeight: 600,
                color: TONE_HEX[resultTone],
                marginBottom: 8,
              }}
            >
              {result.label}
            </div>
            <div style={{ fontSize: 13.5, color: COLOR.inkSoft }}>
              {result.message}
            </div>
          </div>
        </div>

        {/* Next step -------------------------------------------------------- */}
        <div
          style={{
            marginTop: 28,
            borderRadius: 18,
            border: `1px solid ${COLOR.sage200}`,
            background: COLOR.sage50,
            padding: "18px 22px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: COLOR.sage700,
              marginBottom: 6,
            }}
          >
            {t("resultNextStep")}
          </div>
          <div style={{ fontSize: 14, color: COLOR.ink }}>
            {result.actionCall}
          </div>
        </div>

        {/* Top / steady areas ------------------------------------------------ */}
        <div
          style={{
            marginTop: 28,
            display: "flex",
            gap: 32,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                color: COLOR.inkMuted,
                marginBottom: 10,
              }}
            >
              {t("resultTopAreas")}
            </div>
            {topDomains.length > 0 ? (
              <ChipRow domains={topDomains} t={t} tx={tx} />
            ) : (
              <div style={{ fontSize: 12.5, color: COLOR.inkSoft }}>
                {t("resultTopAreasNone")}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                color: COLOR.inkMuted,
                marginBottom: 10,
              }}
            >
              {t("resultSteadyAreas")}
            </div>
            {steadyDomains.length > 0 ? (
              <ChipRow domains={steadyDomains} t={t} tx={tx} />
            ) : (
              <div style={{ fontSize: 12.5, color: COLOR.inkSoft }}>
                {t("resultSteadyNone")}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: COLOR.hairline,
            margin: "32px 0 26px",
          }}
        />

        {/* Full profile --------------------------------------------------- */}
        <div
          style={{
            fontFamily: displayFont(isRtl),
            fontSize: 19,
            fontWeight: 600,
            color: COLOR.ink,
          }}
        >
          {t("resultProfile")}
        </div>
        <div style={{ fontSize: 12.5, color: COLOR.inkMuted, marginTop: 4 }}>
          {t("resultBreakdown")}
        </div>

        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 22 }}>
          {domainResults.map((domainResult) => {
            const bandHex = BAND_HEX[domainResult.band.id] ?? COLOR.sage500;
            return (
              <div key={domainResult.domain.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: COLOR.ink }}>
                    {tx(domainResult.domain.name)}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 500,
                      color: bandHex,
                      background: hexToRgba(bandHex, 0.12),
                      border: `1px solid ${hexToRgba(bandHex, 0.35)}`,
                      borderRadius: 9999,
                      padding: "2px 10px",
                    }}
                  >
                    {t.band(domainResult.band.id)}
                  </span>
                  <span
                    style={{
                      marginInlineStart: "auto",
                      fontSize: 12.5,
                      color: COLOR.inkMuted,
                    }}
                  >
                    {domainResult.score} / {domainResult.maxScore}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    height: 7,
                    borderRadius: 9999,
                    background: COLOR.hairline,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.round(domainResult.ratio * 100)}%`,
                      background: bandHex,
                      borderRadius: 9999,
                    }}
                  />
                </div>

                <div style={{ marginTop: 9, fontSize: 12.5, color: COLOR.inkSoft }}>
                  {tx(domainResult.band.reading)}
                </div>
                <div style={{ marginTop: 2, fontSize: 11, color: COLOR.inkMuted }}>
                  {tx(domainResult.domain.instrument)}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            height: 1,
            background: COLOR.hairline,
            margin: "32px 0 20px",
          }}
        />

        <div style={{ fontSize: 10.5, color: COLOR.inkMuted, lineHeight: 1.7 }}>
          {t("disclaimer")}
        </div>
      </div>
    );
  },
);

function ChipRow({
  domains,
  t,
  tx,
}: {
  domains: DomainResult[];
  t: Translator;
  tx: (value: { en: string; ar: string }) => string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {domains.map((domainResult) => {
        const bandHex = BAND_HEX[domainResult.band.id] ?? COLOR.sage500;
        return (
          <span
            key={domainResult.domain.id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 500,
              color: bandHex,
              background: hexToRgba(bandHex, 0.1),
              border: `1px solid ${hexToRgba(bandHex, 0.35)}`,
              borderRadius: 9999,
              padding: "5px 13px",
            }}
          >
            {tx(domainResult.domain.name)}
            <span style={{ opacity: 0.65 }}>{t.band(domainResult.band.id)}</span>
          </span>
        );
      })}
    </div>
  );
}

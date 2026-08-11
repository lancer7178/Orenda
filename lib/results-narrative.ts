import type { DomainResult, Locale } from "./types";
import type { Translator } from "./ui-text";

/**
 * Human-readable summary lines for the results page. Kept out of the UI so the
 * mapping from profile → sentence stays deterministic and testable: every
 * sentence is built from the actual `DomainResult`s, and the builders return
 * `null` rather than inventing a finding when there is nothing true to say.
 */

/** Locale-correct "A, B and C" joins — ICU handles the Arabic waw for us. */
function formatAreaList(results: DomainResult[], locale: Locale): string {
  const names = results.map((result) => result.domain.name[locale]);
  return new Intl.ListFormat(locale === "ar" ? "ar" : "en", {
    style: "long",
    type: "conjunction",
  }).format(names);
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

/**
 * Names the areas carrying the most weight, gently. `null` when nothing came
 * back elevated, so the caller falls back to its "even picture" reassurance.
 */
export function buildAttentionLine(
  topDomains: DomainResult[],
  locale: Locale,
  t: Translator,
): string | null {
  // Cap at three so the sentence stays a sentence; the chips carry the rest.
  const named = topDomains.slice(0, 3);
  if (named.length === 0) return null;

  const template = t(
    named.length === 1 ? "attentionSentenceOne" : "attentionSentenceMany",
  );
  return fill(template, { areas: formatAreaList(named, locale) });
}

/**
 * Names what is holding steady — a real part of the picture, not just the
 * absence of difficulty. `null` when no area came back settled.
 */
export function buildSteadyLine(
  steadyDomains: DomainResult[],
  locale: Locale,
  t: Translator,
): string | null {
  if (steadyDomains.length === 0) return null;

  // Past three, listing every name reads as a wall — switch to a count so the
  // sentence stays calm and the chips below show exactly which.
  if (steadyDomains.length > 3) {
    return fill(t("steadySentenceMany"), {
      // Force Arabic-Indic digits so the count matches the numerals used
      // elsewhere in the app rather than defaulting to Latin ones.
      count: steadyDomains.length.toLocaleString(
        locale === "ar" ? "ar-u-nu-arab" : "en",
      ),
    });
  }

  const template = t(
    steadyDomains.length === 1 ? "steadySentenceOne" : "steadySentenceFew",
  );
  return fill(template, { areas: formatAreaList(steadyDomains, locale) });
}

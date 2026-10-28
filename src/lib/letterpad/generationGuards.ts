// ─────────────────────────────────────────────
//  lib/letterpad/generationGuards.ts – Deterministic guards for
//  Entire Letterhead (Full-mode) generation.
//
//  WHY THIS FILE EXISTS (2026-10-28 live retest of 48cfd0b): the
//  previous batch's guards lived only in the route and only trusted
//  the model: context lines were blanked and exact-copy values were
//  dropped, but the live retest still showed a previous letter's
//  To/subject/signatory surviving a Fully-AI regeneration, and a
//  typed header value coming back empty. The holes were:
//   (a) the route's copy guards covered To/address only, by BYTE
//       equality — subject, signatory and designation had no guard,
//       and a reworded/case/punctuation variant slipped through;
//   (b) the client applied whatever the route returned with no
//       final check, so any leak (route, model, or stale state)
//       landed on the paper untouched;
//   (c) a personal-type detection (Letter Type left on Student
//       Application) blanked ALL header fields in fillFromAI, even
//       ones the user had explicitly typed;
//   (d) the modal/sidebar "please fill" text was a one-time chat
//       message, so it could never clear when the field was filled.
//
//  The fix is defence in depth: the route guards AND the client
//  scrubs the final applied state (scrubFullForm) on every Full
//  generation, using the same pure functions. These functions are
//  dependency-free on purpose so they can be unit-checked in plain
//  Node without React or Next.js.
// ─────────────────────────────────────────────

const GROUND_STOPWORDS = new Set([
  'the', 'and', 'for', 'from', 'with', 'this', 'that', 'about',
  'regarding', 'please', 'write', 'dear', 'sir', 'madam', 'respected',
  'into', 'upon', 'under', 'over', 'your', 'yours', 'kindly', 'to',
  'of', 'a', 'an', 'in', 'on', 'at', 'by', 'is', 'are', 'be',
]);

/** Normalised comparison form: case, punctuation and whitespace
 *  differences do not make two values different. */
export function normFieldValue(v: string | undefined | null): string {
  return (v || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, ' ').trim().replace(/\s+/g, ' ');
}

/** True when two non-empty values are the same modulo normalisation. */
export function valuesIdentical(a: string | undefined | null, b: string | undefined | null): boolean {
  const na = normFieldValue(a);
  const nb = normFieldValue(b);
  return Boolean(na) && na === nb;
}

function tokensOf(text: string): string[] {
  return (text || '').toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/** True when the new brief itself names the value (a substantive
 *  token, length >= 3, shared between value and brief). A genuine
 *  follow-up naming the recipient therefore keeps it; a copied
 *  previous value for an unrelated brief does not. */
export function groundedInBrief(value: string, brief: string): boolean {
  const briefToks = new Set(tokensOf(brief).filter((t) => t.length >= 3 && !GROUND_STOPWORDS.has(t)));
  return tokensOf(value).filter((t) => t.length >= 3 && !GROUND_STOPWORDS.has(t)).some((t) => briefToks.has(t));
}

export interface ScrubArgs {
  /** Value on the paper before this generation. */
  prev: string;
  /** Value the generation produced for this field. */
  next: string;
  /** Field was explicitly typed by the user (standing veto). */
  edited: boolean;
  /** Field came from a clicked preset (lower tier, still legitimate). */
  preset: boolean;
  /** The new brief text (empty = no scrubbing: the edit path and
   *  other non-generation fills must never be scrubbed). */
  brief: string;
}

/** Client-side final-state scrub for one AI-owned field in Full
 *  mode: a generated value identical to the previous letter's value
 *  is dropped UNLESS the user typed it, a preset set it, or the new
 *  brief itself names it. This runs AFTER the model output lands,
 *  on every generation path, so it catches leaks the route guards
 *  miss (reworded copies the route saw as new, stale state, or a
 *  model that ignored the blanked context). */
export function scrubFullValue({ prev, next, edited, preset, brief }: ScrubArgs): string {
  if (!brief.trim()) return next;
  if (edited || preset) return next;
  if (valuesIdentical(prev, next) && !groundedInBrief(next, brief)) return '';
  return next;
}

/** AI-owned identity fields the scrub covers. Deliberately EXCLUDES
 *  sal/cls (a salutation or closing legitimately repeats across
 *  letters — "Sir" is not a leak), dt (system-seeded today) and
 *  body (free prose, handled by the route's topic rules). */
export const SCRUB_KEYS = [
  'h1', 'h2', 'e1', 'e2', 'dept', 'divn', 'ofc', 'city', 'pin', 'ph',
  'em', 'wb', 'fno', 'ref', 'toD', 'toA', 'sub', 'sn', 'sh', 'sd',
  'sp', 'sc',
] as const;

export type ScrubForm = Record<string, string>;

/** Apply scrubFullValue to every SCRUB_KEYS field of a filled form. */
export function scrubFullForm(
  nextForm: ScrubForm,
  prevForm: ScrubForm,
  editedFields: string[],
  presetFields: string[],
  brief: string,
): ScrubForm {
  if (!brief.trim()) return nextForm;
  const edited = new Set(editedFields);
  const preset = new Set(presetFields);
  const out: ScrubForm = { ...nextForm };
  for (const key of SCRUB_KEYS) {
    out[key] = scrubFullValue({
      prev: prevForm[key] || '',
      next: nextForm[key] || '',
      edited: edited.has(key),
      preset: preset.has(key),
      brief,
    });
  }
  return out;
}

export interface PickFullArgs {
  /** Model-supplied value for this field. */
  ai: string;
  /** Previous letter's value (ground truth from the form). */
  gt: string;
  edited: boolean;
  preset: boolean;
  /** Brief-derived sender value for this field, if any. */
  sender?: string;
  /** True for contact fields (phone/email): never brief-derived. */
  isContact: boolean;
  brief: string;
}

/** Route-side Full-mode pick for one header/contact field, with the
 *  copy guard the previous batch lacked for headers: a model value
 *  identical to the previous letter's value is treated as NO model
 *  value unless the user typed it, a preset set it, or the brief
 *  names it — it then falls through to the brief sender, the preset
 *  value, or blank, never silently back to the previous letter. */
export function pickFullValue({ ai, gt, edited, preset, sender, isContact, brief }: PickFullArgs): string {
  if (edited) return gt;
  const modelVal = valuesIdentical(ai, gt) && !preset && !groundedInBrief(ai, brief) ? '' : ai;
  if (modelVal) return modelVal;
  if (!isContact && sender) return sender;
  if (preset && gt) return gt;
  return '';
}

/** Live missing-fields derivation from the CURRENT form state (not
 *  a generation-time snapshot). Used by the sidebar and modal live
 *  indicators so the warning clears the moment a field is filled
 *  and reappears if it is emptied. Core fields only; the route's
 *  computeMissingFields remains the authority for type-specific
 *  rules (e.g. signatory designation by type). */
export function liveMissing(form: {
  sn?: string; toD?: string; sal?: string; body?: string;
}): string[] {
  const missing: string[] = [];
  const blank = (v?: string) => !v || !v.trim();
  if (blank(form.toD) || (form.toD || '').includes('______')) missing.push('toD');
  if (blank(form.sn)) missing.push('sn');
  if (blank(form.sal) || (form.sal || '').includes('______')) missing.push('sal');
  if (blank(form.body) || (form.body || '').trim().length < 150) missing.push('body');
  if ((form.body || '').includes('______') && !missing.includes('details')) missing.push('details');
  return missing;
}

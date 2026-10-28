// ─────────────────────────────────────────────
//  lib/letterpad/headerLines.ts — header-line dedupe shared by the
//  paper preview and the vector PDF, so both render the same
//  header for the same letter data.
//
//  WHY (2026-10-28, real NOC letter on the preview): the company
//  name printed as two separate centred header lines (the AI had
//  filled English Line 1 AND Line 2 with the identical value) and
//  the office line repeated the company name a third time. An
//  earlier dedupe fix covered dept-duplicating-designation only;
//  it never covered e1==e2 or dept-repeating-the-company.
// ─────────────────────────────────────────────
import { normFieldValue } from './generationGuards';

/** Normalised form for header comparison: case, punctuation and
 *  whitespace differences do not make two lines different. */
export function normHeaderLine(v: string | undefined | null): string {
  return normFieldValue(v);
}

/** True when two header lines are the same line (exact or
 *  near-duplicate). Empty lines are never duplicates of anything. */
export function headerLinesEqual(a: string | undefined | null, b: string | undefined | null): boolean {
  const na = normHeaderLine(a);
  const nb = normHeaderLine(b);
  return Boolean(na) && na === nb;
}

/** Keep the first occurrence of each distinct non-empty line, in
 *  order; later exact/near duplicates are dropped. Typed values
 *  are never altered — a dropped line is only hidden from the
 *  rendered header, the form value itself is untouched and stays
 *  editable in the sidebar (and still appears in the signature
 *  block / footer where it belongs). */
export function dedupeHeaderLines(lines: (string | undefined | null)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const trimmed = (line || '').trim();
    if (!trimmed) continue;
    const norm = normHeaderLine(trimmed);
    if (seen.has(norm)) continue;
    seen.add(norm);
    out.push(trimmed);
  }
  return out;
}

// Tokens that, on their own, add no information beyond "this is an
// office of the company" — used only for the dept-redundancy check
// below, never to drop a line that names a real department
// (e.g. "Sales Department, Acme Corp" keeps its "sales" token and
// is therefore NOT redundant).
const GENERIC_OFFICE_TOKENS = new Set([
  'office', 'of', 'the', 'chief', 'executive', 'officer', 'ceo',
]);

/** True when a dept/office line adds nothing over the company
 *  name(s) already shown in the header: either it IS one of the
 *  company lines, or it is the company name plus only generic
 *  office words (e.g. "Office of the Chief Executive Officer,
 *  Swinfosystems LLP" when "Swinfosystems LLP" is already the
 *  header's company line). Such a line is hidden from the HEADER
 *  only — the value stays in the form, the signature block and
 *  the footer. */
export function headerDeptRedundant(
  dept: string | undefined | null,
  companyLines: (string | undefined | null)[],
): boolean {
  const normDept = normHeaderLine(dept);
  if (!normDept) return false;
  for (const company of companyLines) {
    const normCompany = normHeaderLine(company);
    if (!normCompany || normCompany.length < 4) continue;
    if (normDept === normCompany) return true;
    if (normDept.includes(normCompany)) {
      const remainder = normDept.replace(normCompany, ' ').trim();
      const tokens = remainder.split(/\s+/).filter(Boolean);
      if (tokens.length > 0 && tokens.every((t) => GENERIC_OFFICE_TOKENS.has(t))) {
        return true;
      }
    }
  }
  return false;
}

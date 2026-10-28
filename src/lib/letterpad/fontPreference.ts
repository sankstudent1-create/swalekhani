// ─────────────────────────────────────────────
//  lib/letterpad/fontPreference.ts — the letter font choice,
//  remembered locally, independent of the letter draft.
//  The studio draft autosave already carries `font`, but a New
//  letter clears the draft and picking a template overwrote the
//  font from the theme — so a chosen font never stuck. This key
//  survives both: setFont writes it, and it is re-applied on
//  mount (winning over the draft) and honoured by template loads.
//  Devanagari default: Poppins ('fd2' — Poppins + Noto Serif
//  Devanagari in the paper). Poppins itself has no Devanagari
//  glyphs, so the PDF pairs it with Noto Serif Devanagari for
//  Devanagari fragments; Latin stays Poppins. English default
//  stays '' (the current Outfit/Poppins stack, unchanged).
// ─────────────────────────────────────────────
import type { FontClass } from '@/types/letterpad';

export const FONT_PREF_KEY = 'swalekhani-font-preference-v1';

const VALID: FontClass[] = ['', 'fg', 'fs', 'fd2', 'ft', 'fn'];

export function loadFontPreference(): FontClass | null {
  try {
    const v = window.localStorage.getItem(FONT_PREF_KEY);
    if (v && (VALID as string[]).includes(v)) return v as FontClass;
  } catch { /* privacy mode — no stored preference */ }
  return null;
}

export function saveFontPreference(font: FontClass): void {
  try {
    window.localStorage.setItem(FONT_PREF_KEY, font);
  } catch { /* privacy mode — preference just won't stick */ }
}

const DEVANAGARI = /[\u0900-\u097F]/;

export function isDevanagariText(text: string): boolean {
  return DEVANAGARI.test(text);
}

/** The font a letter should start with when the user has no stored
    preference: Poppins ('fd2') for Devanagari content, the current
    default ('') for everything else. */
export function defaultFontForText(text: string): FontClass {
  return isDevanagariText(text) ? 'fd2' : '';
}

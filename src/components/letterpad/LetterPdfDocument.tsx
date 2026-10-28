// ─────────────────────────────────────────────
// components/letterpad/LetterPdfDocument.tsx
// ── Srot-quality TRUE-VECTOR PDF for Swalekhani letters ──
// @react-pdf/renderer, real vector text (selectable, sharp at any
// zoom — never a rasterised screenshot), true A4 pages
// (595.28 x 841.89 pt via size="A4"), page numbers, and embedded
// fonts. Imported DYNAMICALLY by page.tsx generatePDF (code-split),
// so @react-pdf/renderer and the fonts stay out of the main bundle.
// If vector generation throws, page.tsx falls back to the existing
// raster html2canvas+jsPDF path — the user always gets a PDF.
//
// PARITY WITH THE PAPER (LetterPaper.tsx + LetterPaper.module.css)
// — this document mirrors the on-screen paper, not just its content:
//  * Sizes are converted from the paper's CSS px at the paper's own
//    scale: the paper is 794px wide for a 595.28pt A4 page, so
//    1px = 0.75pt. Body 13.5px → ~10.5pt, header 14px → 10.5pt, etc.
//    Page padding 36pt ≈ the paper's 44–46px side padding, so the
//    PDF content width (523pt) ≈ the paper's body width (526pt).
//  * The header, divider, meta row and footer follow the selected
//    layout (Type-A…F) and footer design, exactly as the paper does
//    — a Type-C letter (blue #06038D headings, side logos, tricolor
//    strip) does NOT come out identical to a Type-A letter.
//  * The paper's selected font (FONT_MAP) maps to the closest
//    embedded PDF font (see resolvePdfFont). Latin serif paper
//    fonts (EB Garamond / Source Serif 4) map to Liberation Serif;
//    DM Sans / Outfit map to Poppins (both geometric sans).
//  * Marathi letters use Baloo 2 (merged Devanagari+Latin static
//    instances, weights 400/700, built from Google Fonts' Baloo 2
//    variable font) — see the Marathi note below.
//  * EMPTY fields render NOTHING. The paper shows grey placeholders
//    as editing affordances; a PDF is an export, so placeholders
//    must never print as if they were real text.
//  * Body numbering is preserved EXACTLY as the paper shows it.
//  * Personal letters (officeType 'personal') get NO header and NO
//    divider, like the paper; their signature shows the name only.
//  * Doctor letters get the patient vitals strip instead of the
//    To/meta rows, like the paper, plus the medico-legal note.
//  * Logos/signatures: <Image> supports PNG/JPEG only — SVG preset
//    logos are SKIPPED rather than breaking generation. Uploaded
//    PNG/JPEG logos render in the header AND as the ghost watermark
//    (only when a logo exists). Draggable logo positions from the
//    paper are NOT reproduced — a PDF is a static export, so logos
//    sit in their layout slots (centred / left / right).
//  * Known gaps vs the paper (documented, not hidden): the advocate
//    scales-of-justice emblem and curved band are not drawn (the
//    divider falls back to a thin line); the NGO side bar is not
//    drawn (only the credentials strip); the doctor ℞ badge is not
//    drawn (the ℞ glyph is absent from the embedded fonts); the
//    paper's DM Mono meta/ref text uses the built-in Courier font.
// ─────────────────────────────────────────────
// MARATHI FONT — why Baloo 2, not Noto Sans Devanagari:
// Noto Sans Devanagari Regular is a light design, and Devanagari
// glyphs render optically smaller than Latin at the same point
// size — so Marathi PDFs looked thin and dull next to the phone
// preview (which uses a heavier system Devanagari). Baloo 2 is a
// Devanagari-first design with much heavier strokes and a larger
// x-height, and it is used at 12pt (vs 10.5pt Latin) with 1.9 line
// height, so Marathi text has the same visual weight and presence
// as the preview. Hindi letters keep Noto Sans Devanagari (their
// verified PDF is unchanged) unless the paper font is a serif
// Devanagari (fd2/ft), which maps to Noto Serif Devanagari.
// ─────────────────────────────────────────────
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Font,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import type { AppState, LetterForm, TemplateType } from '@/types/letterpad';

// ── Fonts (same pattern as Srot's registerPdfFonts: base='' in the
// browser resolves to /fonts/… under public/; a node render check
// passes the absolute public/ directory as base) ─────────────
let fontsRegistered = false;
export function registerLetterPdfFonts(base = '') {
  if (fontsRegistered) return;
  fontsRegistered = true;
  const reg = (family: string, regular: string, bold: string) => {
    Font.register({
      family,
      fonts: [
        { src: `${base}/fonts/${regular}`, fontWeight: 400 },
        { src: `${base}/fonts/${bold}`, fontWeight: 700 },
      ],
    });
  };
  reg('Poppins', 'Poppins-Regular.ttf', 'Poppins-Bold.ttf');
  reg('NotoSansDevanagari', 'NotoSansDevanagari-Regular.ttf', 'NotoSansDevanagari-Bold.ttf');
  reg('NotoSerifDevanagari', 'NotoSerifDevanagari-Regular.ttf', 'NotoSerifDevanagari-Bold.ttf');
  reg('LiberationSerif', 'LiberationSerif-Regular.ttf', 'LiberationSerif-Bold.ttf');
  // Baloo 2: merged Devanagari+Latin static instances (Google Fonts
  // variable font, instantiated at wght 400/700, subsets merged with
  // fontTools — verified: 128 Devanagari + 95 Latin glyphs each).
  reg('Baloo2', 'Baloo2-Regular.ttf', 'Baloo2-Bold.ttf');
}

// ── Language detection ────────────────────────────────────
// Devanagari range anywhere in the letter's own text (not the
// stored generation language — the form does not store one, and
// the paper guesses the same way in LetterPaper). Marathi vs Hindi
// only decides small labels.
const DEVANAGARI = /[\u0900-\u097F]/;
const MARATHI_MARKERS = /आपला नम्र|आपली नम्र|विनंती|मुख्याध्यापक|प्राचार्य/;
function letterLang(form: LetterForm): 'en' | 'hi' | 'mr' {
  const text = `${form.sal} ${form.cls} ${form.body} ${form.sub} ${form.toD} ${form.sn}`;
  if (!DEVANAGARI.test(text)) return 'en';
  return MARATHI_MARKERS.test(text) ? 'mr' : 'hi';
}

// ── Paper font → PDF font ───────────────────────────────
// state.font is FONT_MAP's key in LetterPaper: '' = Outfit/Poppins
// sans, fg = EB Garamond, fs = Source Serif 4, fd2 = Poppins +
// Noto Serif Devanagari, ft = Tiro Devanagari Hindi, fn = DM Sans.
function resolvePdfFont(lang: 'en' | 'hi' | 'mr', fontClass: string): {
  family: string; bodySize: number; bodyLineHeight: number;
} {
  if (lang === 'mr') {
    // Marathi override (see header note): Baloo 2 at a larger size
    // for visual weight, whatever the paper font class is.
    return { family: 'Baloo2', bodySize: 12, bodyLineHeight: 1.9 };
  }
  if (lang === 'hi') {
    if (fontClass === 'fd2' || fontClass === 'ft') {
      return { family: 'NotoSerifDevanagari', bodySize: 11.5, bodyLineHeight: 1.9 };
    }
    return { family: 'NotoSansDevanagari', bodySize: 11.5, bodyLineHeight: 1.9 };
  }
  if (fontClass === 'fg' || fontClass === 'fs') {
    return { family: 'LiberationSerif', bodySize: 10.5, bodyLineHeight: 2.0 };
  }
  return { family: 'Poppins', bodySize: 10.5, bodyLineHeight: 2.0 };
}

// ── Script-aware text ────────────────────────────────────
// No single embedded font covers both scripts: Poppins and
// Liberation Serif have 0 Devanagari glyphs, and Noto Sans/Serif
// Devanagari have 0 Latin letters (verified with fontTools — only
// Baloo 2 covers both). The browser paper hides this with per-glyph
// fallback; a PDF does not fall back, so a Devanagari header on an
// otherwise English letter (or an English proper noun inside a Hindi
// body) used to render as an invisible Helvetica fallback. SegText
// therefore splits every user-content string into Devanagari and
// Latin fragments and sets each fragment's font explicitly:
//   Latin fragment → Poppins (or Liberation Serif for fg/fs papers)
//   Devanagari fragment → Baloo 2 (Marathi), Noto Serif/Sans
//     Devanagari (Hindi), Noto Sans Devanagari (stray Devanagari in
//     an otherwise English letter).
// Static labels are single-script by construction (they localise
// with the body language), so they keep the plain <Text> path.
function resolvePdfScriptFonts(lang: 'en' | 'hi' | 'mr', fontClass: string): {
  latin: string; deva: string;
} {
  const latin = fontClass === 'fg' || fontClass === 'fs' ? 'LiberationSerif' : 'Poppins';
  if (lang === 'mr') return { latin: 'Baloo2', deva: 'Baloo2' };
  if (lang === 'hi') {
    const deva = fontClass === 'fd2' || fontClass === 'ft' ? 'NotoSerifDevanagari' : 'NotoSansDevanagari';
    return { latin, deva };
  }
  return { latin, deva: 'NotoSansDevanagari' };
}

function SegText({ fonts, text, style, latinOverride }: {
  fonts: { latin: string; deva: string };
  text: string;
  style?: any;
  // Meta/ref/signature-contact rows mirror the paper's DM Mono:
  // Latin fragments stay Courier there, Devanagari still switches.
  latinOverride?: string;
}) {
  const parts = text.split(/([\u0900-\u097F]+)/g).filter(Boolean);
  if (parts.length <= 1) return <Text style={style}>{text}</Text>;
  return (
    <Text style={style}>
      {parts.map((p, i) => (
        <Text key={i} style={{ fontFamily: DEVANAGARI.test(p) ? fonts.deva : (latinOverride || fonts.latin) }}>
          {p}
        </Text>
      ))}
    </Text>
  );
}

// Only PNG/JPEG data URIs are usable in <Image> (see header note).
function usableImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (/^data:image\/(png|jpeg|jpg)/i.test(src)) return src;
  return null;
}

// Paper token logic for the Type-B name/org dedupe (same titles
// stripped as LetterPaper's normNameTokens).
const TITLE_WORDS = new Set(['dr', 'adv', 'advocate', 'mr', 'mrs', 'ms', 'shri', 'smt']);
function nameTokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z\u0900-\u097f0-9\s]/g, ' ').split(/\s+/)
    .filter(Boolean).filter((w) => !TITLE_WORDS.has(w));
}
function snSameAsE1(sn: string, e1: string): boolean {
  const a = nameTokens(sn);
  const b = nameTokens(e1);
  if (!a.length || !b.length) return false;
  const bSet = new Set(b);
  return a.every((t) => bSet.has(t));
}

// Paper footer design default: D → minimal, otherwise classic.
type FooterDesign = 'classic' | 'modern' | 'minimal' | 'tricolor' | 'executive';
function footerDesignOf(state: AppState): FooterDesign {
  return state.footerDesign || (state.tpl === 'D' ? 'minimal' : 'classic');
}

// Paper's romantic-personal suppression: To/Sub labels hidden when
// the letter reads as a romantic personal letter.
function isRomanticPersonal(state: AppState): boolean {
  if (state.officeType !== 'personal') return false;
  const f = state.form;
  const hay = (s: string) => s.toLowerCase();
  return hay(f.sal).includes('dearest') || hay(f.sal).includes('darling')
    || hay(f.sal).includes('प्रियतम') || hay(f.cls).includes('forever')
    || hay(f.sub).includes('love') || hay(f.sub).includes('heart')
    || hay(f.toD).includes('love');
}

const BLUE = '#06038D';
const SAFFRON = '#FF6600';

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 36,
    backgroundColor: '#ffffff',
    color: '#111111',
  },
  watermarkWrap: {
    position: 'absolute',
    top: 290,
    left: 158,
    width: 280,
    height: 280,
  },
  watermarkImg: { width: 280, height: 280, opacity: 0.07, transform: 'rotate(-18deg)' },
  // ── Headers ──
  headerCenter: { alignItems: 'center', textAlign: 'center', lineHeight: 1.6, marginBottom: 6 },
  headerHi: { fontSize: 10.5, fontWeight: 700, marginBottom: 1 },
  headerHiC: { fontSize: 14.25, fontWeight: 700, color: BLUE, marginBottom: 1 },
  headerHiD: { fontSize: 16.5, fontWeight: 700, color: BLUE, marginBottom: 1 },
  headerEn: { fontSize: 10.5, fontWeight: 700, marginBottom: 1 },
  headerEnC: { fontSize: 11.25, fontWeight: 700, color: BLUE, marginBottom: 1 },
  headerEnD: { fontSize: 9.75, fontWeight: 700, color: '#222222', marginBottom: 1 },
  headerDept: { fontSize: 10, fontWeight: 700, marginBottom: 1 },
  headerSub: { fontSize: 9, marginBottom: 1 },
  headerSubC: { fontSize: 8.25, color: '#444444', marginBottom: 1 },
  headerAddrRight: { fontSize: 9, color: '#444444', textAlign: 'right', lineHeight: 1.8, marginTop: 3 },
  headerAddrB: { fontSize: 8.5, color: '#333333', textAlign: 'right', lineHeight: 1.8 },
  headerLogoCenter: { width: 54, height: 54, marginBottom: 4 },
  headerLogoSide: { width: 52, height: 52 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  headerRowD: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  headerMidC: { flex: 1, textAlign: 'center', lineHeight: 1.4 },
  headerNamesD: { flex: 1, lineHeight: 1.4 },
  headerAddrD: { textAlign: 'right', fontSize: 8, color: '#444444', lineHeight: 1.75, minWidth: 130 },
  headerAddrDDept: { fontSize: 9.75, fontWeight: 700, color: '#222222' },
  circularBadge: { backgroundColor: BLUE, color: '#ffffff', fontSize: 7, paddingHorizontal: 5, paddingVertical: 1, marginLeft: 8 },
  // ── Dividers ──
  dblLine: { borderTopWidth: 2, borderTopColor: BLUE, marginHorizontal: 27 },
  singleLine: { borderTopWidth: 1, borderTopColor: '#555555', marginHorizontal: 27, marginTop: 3, marginBottom: 8 },
  solidLine: { borderTopWidth: 2, borderTopColor: BLUE, marginBottom: 8 },
  saffronLine: { borderTopWidth: 3, borderTopColor: SAFFRON, marginBottom: 8 },
  thinLine: { borderTopWidth: 1, borderTopColor: '#444444', marginHorizontal: 27, marginTop: 2, marginBottom: 8 },
  triStrip: { flexDirection: 'row', height: 3, marginBottom: 0 },
  tri1: { flex: 1, backgroundColor: '#FF9933' },
  tri2: { flex: 1, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#eeeeee', borderBottomWidth: 1, borderBottomColor: '#eeeeee' },
  tri3: { flex: 1, backgroundColor: '#138808' },
  // ── Meta rows ──
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 8.5,
    color: '#333333',
    backgroundColor: '#FAFAF5',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    marginBottom: 12,
  },
  metaPersonal: { justifyContent: 'flex-end', backgroundColor: 'transparent', borderBottomWidth: 0, paddingHorizontal: 8 },
  // ── Body blocks ──
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#0891b2',
    borderBottomWidth: 1,
    borderBottomColor: '#0891b2',
    paddingVertical: 6,
    marginBottom: 12,
    fontSize: 9,
  },
  ngoStrip: { textAlign: 'center', fontSize: 9, color: '#444444', marginBottom: 10 },
  toBlock: { marginBottom: 10 },
  toLabel: { fontSize: 10, fontWeight: 700, textDecoration: 'underline', marginBottom: 2 },
  toName: { fontSize: 10, fontWeight: 700, marginBottom: 1 },
  toAddr: { fontSize: 10, color: '#333333', lineHeight: 1.85 },
  subRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
    borderBottomColor: '#aaaaaa',
    paddingBottom: 4,
    marginBottom: 10,
  },
  subLabel: { fontSize: 10, fontWeight: 700, marginRight: 6 },
  subText: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', flex: 1 },
  refBlock: { fontSize: 9, color: '#444444', marginBottom: 10 },
  salBlock: { fontSize: 10.5, fontWeight: 700, marginBottom: 8 },
  para: { textAlign: 'justify', marginBottom: 8 },
  closingWrap: { alignSelf: 'flex-end', width: 200, alignItems: 'center', marginTop: 12 },
  closingBlock: { fontSize: 10.5, fontWeight: 700, textAlign: 'center', marginBottom: 4 },
  sigImg: { width: 150, height: 42, objectFit: 'contain', marginBottom: 2 },
  sigName: { fontSize: 11, fontWeight: 700, textAlign: 'center', marginTop: 2 },
  sigLine: { fontSize: 9.5, color: '#333333', textAlign: 'center', marginTop: 1 },
  sigDept: { fontSize: 9, color: '#444444', textAlign: 'center', marginTop: 1 },
  sigContact: { fontSize: 8.5, color: '#666666', textAlign: 'center', marginTop: 2 },
  medicoNote: { fontSize: 9, color: '#0891b2', textAlign: 'center', marginTop: 14 },
  listHead: { fontSize: 10, fontWeight: 700, textDecoration: 'underline', marginTop: 14, marginBottom: 4 },
  listItem: { fontSize: 10, lineHeight: 1.9, marginBottom: 1, paddingLeft: 14 },
  enclBlock: { fontSize: 10, lineHeight: 1.9, marginTop: 14 },
  endorseBox: {
    marginTop: 14, borderWidth: 1, borderColor: '#bbbbbb',
    backgroundColor: '#f9f8f4', paddingHorizontal: 9, paddingVertical: 6,
  },
  endorseHead: { fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#dddddd', paddingBottom: 3, marginBottom: 3 },
  endorseText: { fontSize: 9.5, lineHeight: 1.6 },
  // ── Footer (NO brand — Issue 1). Content mirrors the paper's
  // footer grid (dept • city–PIN • contact), plus page numbers.
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  footerClassic: { borderTopWidth: 2, borderTopColor: '#002147', backgroundColor: '#f8f9fa' },
  footerModern: { borderTopWidth: 1, borderTopColor: '#e2e8f0', color: '#64748b' },
  footerMinimal: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)', color: '#64748b' },
  footerTricolor: { borderTopWidth: 2.5, borderTopColor: '#FF671F' },
  footerTricolorGreen: { height: 2, backgroundColor: '#046A38' },
  footerExecutive: { borderTopWidth: 2, borderTopColor: '#1e293b', backgroundColor: '#f8fafc' },
  footerText: { fontSize: 8.5, color: '#475569' },
  footerPage: { fontSize: 8.5, color: '#666666' },
});

function Header({ state, fonts }: { state: AppState; fonts: { latin: string; deva: string } }) {
  const form = state.form;
  const tpl = state.tpl as TemplateType;
  const logoL = usableImage(state.logoL);
  const logoR = usableImage(state.logoR);
  const logo = logoL || logoR;
  const hiLine = [form.h1?.trim(), form.h2?.trim()].filter(Boolean).join(' / ');
  const addrParts = [form.ofc?.trim(), form.city?.trim()].filter(Boolean) as string[];
  if (addrParts.length === 2 && addrParts[0].toLowerCase() === addrParts[1].toLowerCase()) addrParts.pop();
  const addr = addrParts.join(', ') + (form.pin?.trim() ? (addrParts.length ? ` – ${form.pin.trim()}` : form.pin.trim()) : '');
  const contact = [form.ph?.trim() ? `Phone: ${form.ph.trim()}` : '', form.em?.trim(), form.wb?.trim()]
    .filter(Boolean).join('  ·  ');
  const hasHeader = Boolean(
    logo || hiLine || form.e1?.trim() || form.e2?.trim() || form.dept?.trim()
    || form.divn?.trim() || form.enrolmentNo?.trim() || form.sn?.trim() || form.sh?.trim()
    || form.sd?.trim() || addr || contact,
  );
  if (!hasHeader) return null;

  // Type-C/D person blocks: sh / sn / sd / dept / sc (the paper's C
  // header shows NO e1/e2/office/city — mirrored faithfully here).
  const personLinesC = (
    <View style={styles.headerMidC}>
      {form.sh?.trim() ? <SegText fonts={fonts} text={form.sh.trim()} style={styles.headerHiC} /> : null}
      {form.sn?.trim() ? <SegText fonts={fonts} text={form.sn.trim()} style={styles.headerEnC} /> : null}
      {form.sd?.trim() ? <SegText fonts={fonts} text={form.sd.trim()} style={styles.headerSubC} /> : null}
      {form.dept?.trim() ? <SegText fonts={fonts} text={form.dept.trim()} style={styles.headerSubC} /> : null}
      {form.sc?.trim() ? <SegText fonts={fonts} text={form.sc.trim()} style={styles.headerSubC} /> : null}
      {form.enrolmentNo?.trim() ? <SegText fonts={fonts} text={form.enrolmentNo.trim()} style={styles.headerSubC} /> : null}
    </View>
  );
  const personLinesD = (
    <View style={styles.headerNamesD}>
      {form.sh?.trim() ? <SegText fonts={fonts} text={form.sh.trim()} style={styles.headerHiD} /> : null}
      {form.sn?.trim() ? <SegText fonts={fonts} text={form.sn.trim()} style={styles.headerEnD} /> : null}
      {form.sd?.trim() ? <SegText fonts={fonts} text={form.sd.trim()} style={styles.headerSubC} /> : null}
      {form.sc?.trim() ? <SegText fonts={fonts} text={form.sc.trim()} style={[styles.headerSubC, { color: '#666666' }]} /> : null}
      {form.enrolmentNo?.trim() ? <SegText fonts={fonts} text={form.enrolmentNo.trim()} style={styles.headerSubC} /> : null}
    </View>
  );

  if (tpl === 'C') {
    return (
      <View style={styles.headerRow}>
        {logoL ? <Image src={logoL} style={styles.headerLogoSide} /> : <View style={styles.headerLogoSide} />}
        {personLinesC}
        {logoR ? <Image src={logoR} style={styles.headerLogoSide} /> : <View style={styles.headerLogoSide} />}
      </View>
    );
  }
  if (tpl === 'D') {
    return (
      <View style={styles.headerRowD}>
        {logoL ? <Image src={logoL} style={styles.headerLogoSide} /> : null}
        {personLinesD}
        <View style={styles.headerAddrD}>
          {form.dept?.trim() ? <SegText fonts={fonts} text={form.dept.trim()} style={styles.headerAddrDDept} /> : null}
          {form.ofc?.trim() ? <SegText fonts={fonts} text={form.ofc.trim()} /> : null}
          {(form.city?.trim() || form.pin?.trim()) ? (
            <SegText fonts={fonts} text={[form.city?.trim(), form.pin?.trim()].filter(Boolean).join(' – ')} />
          ) : null}
          {form.ph?.trim() ? <SegText fonts={fonts} text={form.ph.trim()} /> : null}
          {form.em?.trim() ? <SegText fonts={fonts} text={form.em.trim()} /> : null}
        </View>
      </View>
    );
  }
  if (tpl === 'B') {
    // Paper Type-B: centred name block + address top-right (absolute
    // on paper). The address sits in the header's top-right corner
    // here too; the centred block flows below it like the paper's
    // min-height header. Organisation header first when filled,
    // personal name skipped only when it duplicates e1 (paper rule).
    const showOrg = Boolean(form.e1?.trim() || form.e2?.trim() || form.dept?.trim());
    const skipSn = showOrg && form.sn?.trim() && form.e1?.trim() && snSameAsE1(form.sn, form.e1);
    const deptDiffers = Boolean(form.dept?.trim())
      && form.dept.trim().toLowerCase() !== (form.sd?.trim().toLowerCase() || '');
    return (
      <View style={{ position: 'relative', marginBottom: 6 }}>
        <View style={{ position: 'absolute', top: 0, right: 0, width: 170 }}>
          <View style={styles.headerAddrB}>
            {form.ofc?.trim() ? <SegText fonts={fonts} text={form.ofc.trim()} /> : null}
            {(form.city?.trim() || form.pin?.trim()) ? (
              <SegText fonts={fonts} text={[form.city?.trim(), form.pin?.trim()].filter(Boolean).join(' – ')} />
            ) : null}
            {form.ph?.trim() ? <SegText fonts={fonts} text={`Tel: ${form.ph.trim()}`} /> : null}
            {form.em?.trim() ? <SegText fonts={fonts} text={form.em.trim()} /> : null}
            {form.dt?.trim() ? <SegText fonts={fonts} text={form.dt.trim()} /> : null}
          </View>
        </View>
        <View style={[styles.headerCenter, { alignItems: 'center' }]}>
          {logo ? <Image src={logo} style={styles.headerLogoCenter} /> : null}
          {form.sh?.trim() ? <SegText fonts={fonts} text={form.sh.trim()} style={[styles.headerHi, { fontSize: 13.5 }]} /> : null}
          {showOrg && (
            <>
              {form.e1?.trim() ? <SegText fonts={fonts} text={form.e1.trim()} style={styles.headerEn} /> : null}
              {form.e2?.trim() ? <SegText fonts={fonts} text={form.e2.trim()} style={styles.headerSub} /> : null}
              {deptDiffers ? <SegText fonts={fonts} text={form.dept.trim()} style={styles.headerSub} /> : null}
            </>
          )}
          {(!showOrg || form.sn?.trim()) && !skipSn && form.sn?.trim() ? (
            <SegText fonts={fonts} text={form.sn.trim()} style={styles.headerEn} />
          ) : null}
          {form.sd?.trim() ? <SegText fonts={fonts} text={form.sd.trim()} style={styles.headerSub} /> : null}
          {form.enrolmentNo?.trim() ? <SegText fonts={fonts} text={form.enrolmentNo.trim()} style={styles.headerSub} /> : null}
        </View>
      </View>
    );
  }
  // Type-A / E / F: centred header (F adds the CIRCULAR badge).
  return (
    <View style={styles.headerCenter}>
      {logo ? <Image src={logo} style={styles.headerLogoCenter} /> : null}
      {hiLine ? <SegText fonts={fonts} text={hiLine} style={styles.headerHi} /> : null}
      {form.e1?.trim() ? <SegText fonts={fonts} text={form.e1.trim()} style={styles.headerEn} /> : null}
      {form.e2?.trim() ? <SegText fonts={fonts} text={form.e2.trim()} style={styles.headerSub} /> : null}
      {form.dept?.trim() ? (
        <Text style={styles.headerDept}>
          <SegText fonts={fonts} text={form.dept.trim()} />
          {tpl === 'F' ? <Text style={styles.circularBadge}> CIRCULAR </Text> : null}
        </Text>
      ) : null}
      {form.divn?.trim() ? <SegText fonts={fonts} text={form.divn.trim()} style={styles.headerSub} /> : null}
      {form.enrolmentNo?.trim() ? <SegText fonts={fonts} text={form.enrolmentNo.trim()} style={styles.headerSub} /> : null}
      {addr || contact ? (
        <SegText fonts={fonts} text={`${addr}${addr && contact ? '\n' : ''}${contact}`} style={styles.headerAddrRight} />
      ) : null}
    </View>
  );
}

function Divider({ state, isAdvocate }: { state: AppState; isAdvocate: boolean }) {
  const tpl = state.tpl as TemplateType;
  // Paper: advocate divider is a curved band + thin line regardless
  // of layout; the band is not drawn in the PDF (see header note).
  if (isAdvocate) return <View style={styles.thinLine} />;
  if (tpl === 'C') {
    return (
      <View>
        <View style={styles.triStrip}>
          <View style={styles.tri1} />
          <View style={styles.tri2} />
          <View style={styles.tri3} />
        </View>
        <View style={styles.thinLine} />
      </View>
    );
  }
  if (tpl === 'D') return <View style={styles.saffronLine} />;
  if (tpl === 'B') return <View style={styles.solidLine} />;
  // A / E / F: double line + single line, like the paper.
  return (
    <View>
      <View style={styles.dblLine} />
      <View style={styles.singleLine} />
    </View>
  );
}

export function LetterPdfDocument({ state }: { state: AppState }) {
  const form = state.form;
  const lang = letterLang(form);
  const font = resolvePdfFont(lang, state.font || '');
  const fontFamily = font.family;
  const scriptFonts = resolvePdfScriptFonts(lang, state.font || '');
  const tpl = state.tpl as TemplateType;
  const isPersonal = state.officeType === 'personal';
  const isDoctor = state.officeType === 'doctor' || state.officeType === 'clinic';
  const isAdvocate = state.officeType === 'advocate';
  const isNGO = state.officeType === 'ngo-trust';
  const logo = usableImage(state.logoL) || usableImage(state.logoR);
  const sig = usableImage(state.sigUrl);
  const romantic = isRomanticPersonal(state);
  const dateLabel = lang === 'mr' || lang === 'hi' ? 'दिनांक: ' : 'Dated: ';
  const fileLabel = lang === 'mr' ? 'पत्र क्र.: ' : lang === 'hi' ? 'पत्रांक: ' : 'File No.: ';
  const toLabel = lang !== 'en' ? 'प्रति' : 'To';
  const subLabel = lang !== 'en' ? 'विषय: ' : 'Subject: ';
  const refLabel = lang !== 'en' ? 'संदर्भ: ' : 'Ref: ';
  const copyHead = 'Copy forwarded for information and necessary action to:';
  const enclHead = lang === 'mr' ? 'संलग्नके: ' : lang === 'hi' ? 'संलग्नक: ' : 'Enclosures: ';
  const endorseHead = 'Forwarded / Endorsed to:';

  const addrParts = [form.ofc?.trim(), form.city?.trim()].filter(Boolean) as string[];
  if (addrParts.length === 2 && addrParts[0].toLowerCase() === addrParts[1].toLowerCase()) addrParts.pop();
  const addr = addrParts.join(', ') + (form.pin?.trim() ? (addrParts.length ? ` – ${form.pin.trim()}` : form.pin.trim()) : '');
  const station = form.city?.trim() || '';
  const paragraphs = (form.body || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const copyList = (form.copyTo || []).map((c) => String(c || '').trim()).filter(Boolean);
  const showCopy = state.showCopy && copyList.length > 0;
  const showEncl = state.showEncl && Boolean(form.encl?.trim());
  const showEndorse = state.showEndorse && Boolean(form.endorsement?.trim());
  // Paper footer visibility: explicit showFooter wins, otherwise
  // personal letters have no footer.
  const showFooter = state.showFooter !== undefined ? state.showFooter : !isPersonal;
  const fDesign = footerDesignOf(state);
  const footerContent = [
    form.dept?.trim() || '',
    [form.city?.trim(), form.pin?.trim() ? `PIN: ${form.pin.trim()}` : ''].filter(Boolean).join(' – '),
    [form.ph?.trim() ? `Tel: ${form.ph.trim()}` : '', form.em?.trim(), form.wb?.trim()].filter(Boolean).join(' · '),
  ].filter(Boolean).join('  •  ');
  const footerStyle = fDesign === 'modern' ? styles.footerModern
    : fDesign === 'minimal' ? styles.footerMinimal
    : fDesign === 'tricolor' ? styles.footerTricolor
    : fDesign === 'executive' ? styles.footerExecutive
    : styles.footerClassic;

  // Meta row content per layout (paper rules, see LetterPaper):
  // A/E/F: fno | addr | date. B: fno | station (date is in the
  // header). C: fno | station, date. D: fno | date (no station).
  // Personal: date only (label only for Devanagari letters on
  // C/D; bare date otherwise, like the paper). Doctor: no meta row.
  const metaParts: { left: string; mid: string; right: string } | null = (() => {
    if (isDoctor) return null;
    const fno = !isPersonal && form.fno?.trim() ? `${fileLabel}${form.fno.trim()}` : '';
    const dt = form.dt?.trim() ? `${dateLabel}${form.dt.trim()}` : '';
    const dtBare = form.dt?.trim() ? form.dt.trim() : '';
    if (isPersonal) {
      if (tpl === 'B') return { left: '', mid: '', right: dt };
      // C/D personal and A/E/F personal: label only for Devanagari
      // letters, bare date for English personal letters (paper rule).
      return { left: '', mid: '', right: lang !== 'en' ? dt : dtBare };
    }
    if (tpl === 'B') return { left: fno, mid: '', right: station };
    if (tpl === 'C') {
      return { left: fno, mid: '', right: station && dt ? `${station}, ${dt}` : (station || dt) };
    }
    if (tpl === 'D') return { left: fno, mid: '', right: dt };
    return { left: fno, mid: addr, right: dt };
  })();
  const showMeta = metaParts !== null && Boolean(metaParts.left || metaParts.mid || metaParts.right);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily }]}>
        {!isPersonal && (
          <>
            <Header state={state} fonts={scriptFonts} />
            <Divider state={state} isAdvocate={isAdvocate} />
          </>
        )}
        {isNGO && (
          <Text style={styles.ngoStrip}>
            NITI Aayog NGO DARPAN ID | 80G &amp; 12A Approved — Regd. Charitable Public Trust
          </Text>
        )}
        {logo ? (
          <View fixed style={styles.watermarkWrap}>
            <Image src={logo} style={styles.watermarkImg} />
          </View>
        ) : null}

        {/* Doctor vitals strip replaces To/meta rows, like the paper */}
        {isDoctor && (
          <View style={styles.vitalsRow}>
            <SegText fonts={scriptFonts} text={`Pt. Name: ${form.toD?.trim() || ''}`} />
            <SegText fonts={scriptFonts} text={`Age/Sex: ${form.ref?.trim() || ''}`} />
            <SegText fonts={scriptFonts} text={`Weight: ${form.sp?.trim() || ''}`} />
            <SegText fonts={scriptFonts} text={`BP/Pulse: ${form.sc?.trim() || ''}`} />
            <SegText fonts={scriptFonts} text={`Date: ${form.dt?.trim() || ''}`} />
          </View>
        )}

        {/* Meta row */}
        {showMeta && metaParts && (
          <View style={[styles.metaRow, isPersonal ? styles.metaPersonal : {}, { fontFamily: 'Courier' }]}>
            {metaParts.left ? <SegText fonts={scriptFonts} text={metaParts.left} latinOverride="Courier" /> : <View />}
            {metaParts.mid ? <SegText fonts={scriptFonts} text={metaParts.mid} latinOverride="Courier" /> : <View />}
            {metaParts.right ? <SegText fonts={scriptFonts} text={metaParts.right} latinOverride="Courier" /> : <View />}
          </View>
        )}

        {/* To block (not for doctor — patient name is in vitals) */}
        {!isDoctor && (form.toD?.trim() || form.toA?.trim()) && (
          <View style={styles.toBlock}>
            {!romantic && <Text style={styles.toLabel}>{toLabel}</Text>}
            {form.toD?.trim() ? <SegText fonts={scriptFonts} text={form.toD.trim()} style={styles.toName} /> : null}
            {form.toA?.trim()
              ? form.toA.split('\n').map((line, i) => (
                <SegText key={i} fonts={scriptFonts} text={line} style={styles.toAddr} />
              ))
              : null}
          </View>
        )}

        {/* Subject — bold capitals, like the paper */}
        {form.sub?.trim() ? (
          <View style={styles.subRow}>
            {!romantic && <Text style={styles.subLabel}>{subLabel}</Text>}
            <SegText fonts={scriptFonts} text={form.sub.trim()} style={styles.subText} />
          </View>
        ) : null}

        {/* Reference (not for doctor — ref is Age/Sex in vitals) */}
        {form.ref?.trim() && !isDoctor ? (
          <View style={[styles.refBlock, { fontFamily: 'Courier' }]}>
            <SegText fonts={scriptFonts} text={`${refLabel}${form.ref.trim()}`} latinOverride="Courier" />
          </View>
        ) : null}

        {/* Salutation — comma joined with no space before it */}
        {form.sal?.trim() ? (
          <View style={styles.salBlock}>
            <SegText fonts={scriptFonts} text={`${form.sal.trim()},`} />
          </View>
        ) : null}

        {/* Body — paragraphs verbatim: numbering preserved exactly,
            prose stays prose. Justified, like the paper. */}
        {paragraphs.map((p, i) => (
          <SegText
            key={i}
            fonts={scriptFonts}
            text={p}
            style={[styles.para, { fontSize: font.bodySize, lineHeight: font.bodyLineHeight }]}
          />
        ))}

        {/* Closing + signature — right block, centred within itself,
            like the paper's closingAndSig. Personal: name only.
            wrap={false} keeps the whole block on one page: a long
            letter must never strand "Yours faithfully," at the foot
            of one page and the signature on the next. */}
        <View wrap={false} style={styles.closingWrap}>
          {form.cls?.trim() ? (
            <View style={styles.closingBlock}>
              <SegText fonts={scriptFonts} text={`${form.cls.trim()},`} />
            </View>
          ) : null}
          {sig ? <Image src={sig} style={styles.sigImg} /> : null}
          {form.sn?.trim() ? <SegText fonts={scriptFonts} text={form.sn.trim()} style={styles.sigName} /> : null}
          {!isPersonal && form.sd?.trim() ? <SegText fonts={scriptFonts} text={form.sd.trim()} style={styles.sigLine} /> : null}
          {!isPersonal && form.dept?.trim() ? <SegText fonts={scriptFonts} text={form.dept.trim()} style={styles.sigDept} /> : null}
          {!isPersonal && (form.sp?.trim() || form.em?.trim()) ? (
            <SegText
              fonts={scriptFonts}
              text={[form.sp?.trim(), form.em?.trim()].filter(Boolean).join(' | ')}
              style={[styles.sigContact, { fontFamily: 'Courier' }]}
              latinOverride="Courier"
            />
          ) : null}
        </View>
        {isDoctor && (
          <Text style={styles.medicoNote}>* NOT FOR MEDICO-LEGAL PURPOSE · VALID FOR 7 DAYS *</Text>
        )}

        {/* Copy-To */}
        {showCopy ? (
          <View>
            <Text style={styles.listHead}>{copyHead}</Text>
            {copyList.map((c, i) => (
              <SegText key={i} fonts={scriptFonts} text={`${i + 1}. ${c}`} style={styles.listItem} />
            ))}
          </View>
        ) : null}

        {/* Enclosures */}
        {showEncl ? (
          <View style={styles.enclBlock}>
            <SegText fonts={scriptFonts} text={`${enclHead}${form.encl.trim()}`} />
          </View>
        ) : null}

        {/* Endorsement — boxed, like the paper */}
        {showEndorse ? (
          <View style={styles.endorseBox}>
            <Text style={styles.endorseHead}>{endorseHead}</Text>
            <SegText fonts={scriptFonts} text={form.endorsement.trim()} style={styles.endorseText} />
          </View>
        ) : null}

        {/* Footer — NO brand text (Issue 1). Paper footer content
            (dept • city–PIN • contact) + page numbers, every page,
            in the letter's own font. */}
        {showFooter ? (
          fDesign === 'tricolor' ? (
            <View fixed style={[styles.footer, footerStyle, { fontFamily, flexDirection: 'column', alignItems: 'stretch', paddingHorizontal: 0, paddingTop: 0 }]}>
              <View style={styles.footerTricolorGreen} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingHorizontal: 8 }}>
                <SegText fonts={scriptFonts} text={footerContent} style={[styles.footerText, { fontFamily }]} />
                <Text
                  style={[styles.footerPage, { fontFamily }]}
                  render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                />
              </View>
            </View>
          ) : fDesign === 'executive' ? (
              <View fixed style={[styles.footer, footerStyle, { fontFamily, flexDirection: 'column', alignItems: 'stretch' }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', paddingBottom: 3 }}>
                  <SegText fonts={scriptFonts} text={form.dept?.trim() || ''} style={[styles.footerText, { fontFamily, fontWeight: 700 }]} />
                  <SegText fonts={scriptFonts} text={[form.city?.trim(), form.pin?.trim() ? `PIN: ${form.pin.trim()}` : ''].filter(Boolean).join(' – ')} style={[styles.footerText, { fontFamily }]} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 3 }}>
                  <SegText fonts={scriptFonts} text={[form.ph?.trim() ? `Tel: ${form.ph.trim()}` : '', form.em?.trim()].filter(Boolean).join(' · ')} style={[styles.footerText, { fontFamily }]} />
                  <SegText fonts={scriptFonts} text={form.wb?.trim() || ''} style={[styles.footerText, { fontFamily }]} />
                  <Text
                    style={[styles.footerPage, { fontFamily }]}
                    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                  />
                </View>
              </View>
            ) : fDesign === 'minimal' ? (
              <View fixed style={[styles.footer, footerStyle, { fontFamily, justifyContent: 'center' }]}>
                <SegText fonts={scriptFonts} text={footerContent} style={[styles.footerText, { fontFamily }]} />
                <Text style={[styles.footerPage, { fontFamily, marginLeft: 8 }]} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
              </View>
            ) : (
              <View fixed style={[styles.footer, footerStyle, { fontFamily }]}>
                <SegText fonts={scriptFonts} text={footerContent} style={[styles.footerText, { fontFamily }]} />
                <Text
                  style={[styles.footerPage, { fontFamily }]}
                  render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                />
              </View>
            )
        ) : null}
      </Page>
    </Document>
  );
}

/** Build the vector PDF Blob for the current letter state.
    fontsBase: '' in the browser (→ /fonts/… under public/);
    a render check passes the absolute public/ directory. */
export async function buildLetterPdfBlob(
  { state, fontsBase = '' }: { state: AppState; fontsBase?: string },
) {
  registerLetterPdfFonts(fontsBase);
  const blob = await pdf(<LetterPdfDocument state={state} />).toBlob();
  return blob;
}

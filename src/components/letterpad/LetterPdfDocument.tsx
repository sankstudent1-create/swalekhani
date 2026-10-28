// ─────────────────────────────────────────────
// components/letterpad/LetterPdfDocument.tsx
// ── Srot-quality TRUE-VECTOR PDF for Swalekhani letters ──
// Mirrors Srot Finance's engine (src/pdf/chrome.jsx + index.jsx):
// @react-pdf/renderer, real vector text (selectable, sharp at any
// zoom — never a rasterised screenshot), true A4 pages
// (595.28 x 841.89 pt via size="A4"), a fixed header/footer on
// every page, a ghost logo watermark (opacity ~0.07, rotated),
// page numbers, and embedded fonts (Poppins for Latin).
//
// Differences from Srot, on purpose:
//  - The document renders the CURRENT letter form state, in the
//    SAME content order as the on-screen paper: header, File No. /
//    Place / Date, To, Subject (bold capitals), Reference,
//    salutation, body, closing, signature, Copy-To, Enclosures,
//    Endorsement, footer. It is a content mirror, not a pixel
//    replica of one paper layout (Type-A…F) — the paper layouts
//    differ in chrome, the letter content does not.
//  - EMPTY fields render NOTHING. The paper shows grey placeholders
//    ("Title / Company Name", "Designation / Registration", …) as
//    editing affordances; a PDF is an export, so placeholders must
//    never print as if they were real text.
//  - Body numbering is preserved EXACTLY as the paper shows it:
//    numbered paragraphs stay numbered, prose stays prose — the
//    document never adds, strips, or renumbers body paragraphs.
//  - Hindi/Marathi letters use an embedded Noto Sans Devanagari
//    font (public/fonts/), because the default PDF fonts have no
//    Devanagari glyphs (they would render as boxes/tofu). The
//    whole document switches to the Devanagari font when ANY
//    Devanagari text is present (body/subject/salutation/closing/
//    recipient/name) — Noto Sans Devanagari also covers basic
//    Latin, so mixed/bilingual letters stay in one font.
//  - Logos/signatures: @react-pdf/renderer <Image> supports
//    PNG/JPEG only — SVG preset logos (svgToDataUri) are SKIPPED
//    in the vector PDF rather than breaking generation. Uploaded
//    PNG/JPEG logos render in the header AND as the ghost
//    watermark (only when a logo exists).
//  - This module is imported DYNAMICALLY by page.tsx generatePDF
//    (code-split, like Srot's index.jsx), so @react-pdf/renderer
//    and the fonts stay out of the main bundle. If vector
//    generation throws for any reason, page.tsx falls back to the
//    existing raster html2canvas+jsPDF path — the user always gets
//    a PDF, never an error with nothing to download.
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
import type { AppState, LetterForm } from '@/types/letterpad';

// ── Fonts (same pattern as Srot's registerPdfFonts: base='' in the
// browser resolves to /fonts/… under public/; a node render check
// passes the absolute public/ directory as base) ─────────────
let fontsRegistered = false;
export function registerLetterPdfFonts(base = '') {
  if (fontsRegistered) return;
  fontsRegistered = true;
  Font.register({
    family: 'Poppins',
    fonts: [
      { src: `${base}/fonts/Poppins-Regular.ttf`, fontWeight: 400 },
      { src: `${base}/fonts/Poppins-Bold.ttf`, fontWeight: 700 },
    ],
  });
  Font.register({
    family: 'NotoSansDevanagari',
    fonts: [
      { src: `${base}/fonts/NotoSansDevanagari-Regular.ttf`, fontWeight: 400 },
      { src: `${base}/fonts/NotoSansDevanagari-Bold.ttf`, fontWeight: 700 },
    ],
  });
}

// ── Language detection ────────────────────────────────────
// Devanagari range anywhere in the letter's own text (not the
// stored generation language — the form does not store one, and
// the paper guesses the same way in LetterPaper). Marathi vs Hindi
// only decides small labels (पत्र क्र. vs पत्रांक, closing
// placeholders are NOT used here — only real content renders).
const DEVANAGARI = /[\u0900-\u097F]/;
const MARATHI_MARKERS = /आपला नम्र|आपली नम्र|विनंती|मुख्याध्यापक|प्राचार्य/;
function letterLang(form: LetterForm): 'en' | 'hi' | 'mr' {
  const text = `${form.sal} ${form.cls} ${form.body} ${form.sub} ${form.toD} ${form.sn}`;
  if (!DEVANAGARI.test(text)) return 'en';
  return MARATHI_MARKERS.test(text) ? 'mr' : 'hi';
}

// Only PNG/JPEG data URIs are usable in <Image> (see header note).
function usableImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (/^data:image\/(png|jpeg|jpg)/i.test(src)) return src;
  return null;
}

const styles = StyleSheet.create({
  page: {
    // Top padding is now just the margin: the letterhead is flow
    // content, so it needs no reserved fixed-header space.
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56,
    backgroundColor: '#ffffff',
    color: '#111111',
  },
  // Letterhead — FIRST PAGE ONLY, as normal flow content (NOT
  // fixed). A fixed header repeats on every page, but its height
  // varies with how many header lines are filled (logo + up to 7
  // lines), while the page's top padding is fixed — so a tall
  // header overlapped the meta row and the To block in the render
  // check. Flow content stacks naturally at any header height, and
  // a first-page-only letterhead is the normal convention for
  // letters (continuation pages carry only the footer + page
  // number). Footer and watermark stay `fixed` (their heights are
  // constant, so they cannot overlap body text).
  header: {
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#111111',
    paddingBottom: 10,
    marginBottom: 14,
  },
  headerLogo: { width: 44, height: 44, marginBottom: 6 },
  hHi: { fontSize: 11, textAlign: 'center', marginBottom: 2 },
  hEn: { fontSize: 15, fontWeight: 700, textAlign: 'center', marginBottom: 2 },
  hEn2: { fontSize: 12, textAlign: 'center', marginBottom: 2 },
  hDept: { fontSize: 11, textAlign: 'center', marginBottom: 2 },
  hAddr: { fontSize: 9.5, color: '#444444', textAlign: 'center', marginTop: 3 },
  hContact: { fontSize: 9.5, color: '#444444', textAlign: 'center', marginTop: 1 },
  // Ghost watermark — Srot values: opacity 0.07, rotated.
  watermarkWrap: {
    position: 'absolute',
    top: 290,
    left: 158,
    width: 280,
    height: 280,
  },
  watermarkImg: { width: 280, height: 280, opacity: 0.07, transform: 'rotate(-18deg)' },
  // Fixed footer — repeats on every page.
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 56,
    right: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    paddingTop: 8,
  },
  footerBrand: { fontSize: 8.5, fontWeight: 700, color: '#17735F' },
  footerPage: { fontSize: 8.5, color: '#666666' },
  // Body blocks
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    fontSize: 10.5,
  },
  toBlock: { marginBottom: 12 },
  toLabel: { fontSize: 10.5, marginBottom: 2 },
  toName: { fontSize: 11, marginBottom: 2 },
  toAddr: { fontSize: 10.5, color: '#333333' },
  subBlock: { marginBottom: 12 },
  subText: { fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase' },
  refBlock: { fontSize: 10.5, marginBottom: 12 },
  salBlock: { fontSize: 11.5, marginBottom: 10 },
  para: { fontSize: 11.5, lineHeight: 1.55, marginBottom: 10 },
  closingBlock: { fontSize: 11.5, marginTop: 14, marginBottom: 4, textAlign: 'right' },
  sigBlock: { alignItems: 'flex-end', marginTop: 8 },
  sigImg: { width: 120, height: 48, marginBottom: 4 },
  sigName: { fontSize: 11.5, fontWeight: 700 },
  sigLine: { fontSize: 11 },
  sigContact: { fontSize: 10, color: '#444444', marginTop: 2 },
  listHead: { fontSize: 11, fontWeight: 700, marginTop: 16, marginBottom: 6 },
  listItem: { fontSize: 10.5, lineHeight: 1.45, marginBottom: 3, paddingLeft: 14 },
  enclBlock: { fontSize: 10.5, lineHeight: 1.45, marginTop: 16 },
});

function Header({ form, logo }: { form: LetterForm; logo: string | null }) {
  const hiLine = [form.h1?.trim(), form.h2?.trim()].filter(Boolean).join(' / ');
  const enLine2 = form.e2?.trim();
  const addr = [form.ofc?.trim(), form.city?.trim()].filter(Boolean).join(', ')
    + (form.pin?.trim() ? ` – ${form.pin.trim()}` : '');
  const contact = [form.ph?.trim() ? `Phone: ${form.ph.trim()}` : '', form.em?.trim(), form.wb?.trim()]
    .filter(Boolean).join('  ·  ');
  const hasHeader = Boolean(
    logo || hiLine || form.e1?.trim() || enLine2 || form.dept?.trim()
    || form.divn?.trim() || form.enrolmentNo?.trim() || addr || contact,
  );
  if (!hasHeader) return null;
  return (
    <View style={styles.header}>
      {logo ? <Image src={logo} style={styles.headerLogo} /> : null}
      {hiLine ? <Text style={styles.hHi}>{hiLine}</Text> : null}
      {form.e1?.trim() ? <Text style={styles.hEn}>{form.e1.trim()}</Text> : null}
      {enLine2 ? <Text style={styles.hEn2}>{enLine2}</Text> : null}
      {form.dept?.trim() ? <Text style={styles.hDept}>{form.dept.trim()}</Text> : null}
      {form.divn?.trim() ? <Text style={styles.hDept}>{form.divn.trim()}</Text> : null}
      {form.enrolmentNo?.trim() ? <Text style={styles.hDept}>{form.enrolmentNo.trim()}</Text> : null}
      {addr ? <Text style={styles.hAddr}>{addr}</Text> : null}
      {contact ? <Text style={styles.hContact}>{contact}</Text> : null}
    </View>
  );
}

export function LetterPdfDocument({ state }: { state: AppState }) {
  const form = state.form;
  const lang = letterLang(form);
  const isDev = lang !== 'en';
  const fontFamily = isDev ? 'NotoSansDevanagari' : 'Poppins';
  const logo = usableImage(state.logoL) || usableImage(state.logoR);
  const sig = usableImage(state.sigUrl);
  const isPersonal = state.officeType === 'personal';
  const dateLabel = lang === 'mr' || lang === 'hi' ? 'दिनांक: ' : 'Dated: ';
  const fileLabel = lang === 'mr' ? 'पत्र क्र.: ' : lang === 'hi' ? 'पत्रांक: ' : 'File No.: ';
  const placeLabel = isDev ? 'स्थान: ' : 'Place: ';
  const toLabel = isDev ? 'प्रति' : 'To';
  const subLabel = isDev ? 'विषय: ' : 'Subject: ';
  const refLabel = isDev ? 'संदर्भ: ' : 'Ref: ';
  const copyHead = 'Copy forwarded for information and necessary action to:';
  const enclHead = lang === 'mr' ? 'संलग्नके: ' : lang === 'hi' ? 'संलग्नक: ' : 'Enclosures: ';
  const endorseHead = 'Forwarded / Endorsed to:';

  const addr = [form.ofc?.trim(), form.city?.trim()].filter(Boolean).join(', ');
  const paragraphs = (form.body || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const copyList = (form.copyTo || []).map((c) => String(c || '').trim()).filter(Boolean);
  const showCopy = state.showCopy && copyList.length > 0;
  const showEncl = state.showEncl && Boolean(form.encl?.trim());
  const showEndorse = state.showEndorse && Boolean(form.endorsement?.trim());
  const showFooter = state.showFooter !== false;

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily }]}>
        <Header form={form} logo={logo} />
        {logo ? (
          <View fixed style={styles.watermarkWrap}>
            <Image src={logo} style={styles.watermarkImg} />
          </View>
        ) : null}

        {/* File No. / Place / Date — same order as the paper's meta row.
            Personal letters carry only the date, like the paper. */}
        <View style={styles.metaRow}>
          {/* No empty Text nodes at all: even a lone space node
              pulled the default Helvetica into the font table.
              Empty sides render an empty View instead. */}
          <View>
            {!isPersonal && form.fno?.trim() ? (
              <Text>{`${fileLabel}${form.fno.trim()}`}</Text>
            ) : null}
          </View>
          <View>
            {(form.city?.trim() || form.dt?.trim()) ? (
              <Text>
                {!isPersonal && form.city?.trim() ? `${placeLabel}${form.city.trim()}  ` : ''}
                {form.dt?.trim() ? `${dateLabel}${form.dt.trim()}` : ''}
              </Text>
            ) : null}
          </View>
        </View>

        {/* To block */}
        {(form.toD?.trim() || form.toA?.trim()) && (
          <View style={styles.toBlock}>
            <Text style={styles.toLabel}>{toLabel}</Text>
            {form.toD?.trim() ? <Text style={styles.toName}>{form.toD.trim()}</Text> : null}
            {form.toA?.trim()
              ? form.toA.split('\n').map((line, i) => (
                <Text key={i} style={styles.toAddr}>{line}</Text>
              ))
              : null}
          </View>
        )}

        {/* Subject — bold capitals, like the paper */}
        {form.sub?.trim() ? (
          <View style={styles.subBlock}>
            <Text style={styles.subText}>{`${subLabel}${form.sub.trim()}`}</Text>
          </View>
        ) : null}

        {/* Reference */}
        {form.ref?.trim() ? (
          <View style={styles.refBlock}>
            <Text>{`${refLabel}${form.ref.trim()}`}</Text>
          </View>
        ) : null}

        {/* Salutation — comma joined with no space before it */}
        {form.sal?.trim() ? (
          <View style={styles.salBlock}>
            <Text>{`${form.sal.trim()},`}</Text>
          </View>
        ) : null}

        {/* Body — paragraphs verbatim: numbering preserved exactly,
            prose stays prose. No paragraph is added or renumbered. */}
        {paragraphs.map((p, i) => (
          <Text key={i} style={styles.para}>{p}</Text>
        ))}

        {/* Closing + signature — right-aligned, like the paper */}
        {form.cls?.trim() ? (
          <View style={styles.closingBlock}>
            <Text>{`${form.cls.trim()},`}</Text>
          </View>
        ) : null}
        <View style={styles.sigBlock}>
          {sig ? <Image src={sig} style={styles.sigImg} /> : null}
          {form.sn?.trim() ? <Text style={styles.sigName}>{form.sn.trim()}</Text> : null}
          {form.sd?.trim() ? <Text style={styles.sigLine}>{form.sd.trim()}</Text> : null}
          {form.dept?.trim() ? <Text style={styles.sigLine}>{form.dept.trim()}</Text> : null}
          {(form.sp?.trim() || form.em?.trim()) ? (
            <Text style={styles.sigContact}>
              {[form.sp?.trim(), form.em?.trim()].filter(Boolean).join(' | ')}
            </Text>
          ) : null}
        </View>

        {/* Copy-To */}
        {showCopy ? (
          <View>
            <Text style={styles.listHead}>{copyHead}</Text>
            {copyList.map((c, i) => (
              <Text key={i} style={styles.listItem}>{`${i + 1}. ${c}`}</Text>
            ))}
          </View>
        ) : null}

        {/* Enclosures */}
        {showEncl ? (
          <View style={styles.enclBlock}>
            <Text>{`${enclHead}${form.encl.trim()}`}</Text>
          </View>
        ) : null}

        {/* Endorsement */}
        {showEndorse ? (
          <View style={styles.enclBlock}>
            <Text>{`${endorseHead} ${form.endorsement.trim()}`}</Text>
          </View>
        ) : null}

        {/* Footer — every page, with page numbers */}
        {showFooter ? (
          <View fixed style={styles.footer}>
            {/* fontFamily set explicitly: fixed footer Views do not
                reliably inherit the Page fontFamily, and without it
                the footer fell back to Helvetica in the font table. */}
            <Text style={[styles.footerBrand, { fontFamily: 'Poppins' }]}>SWALEKHANI</Text>
            <Text
              style={[styles.footerPage, { fontFamily: 'Poppins' }]}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
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

// ─────────────────────────────────────────────
// components/letterpad/LetterPaper.tsx
// Full inline editing on ALL fields + Live Sidebar Binding + Profession Accents
// ─────────────────────────────────────────────
'use client';
import React, { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import type { AppState, LetterForm, LogoSide } from '@/types/letterpad';
import { headerLinesEqual, headerDeptRedundant } from '@/lib/letterpad/headerLines';
import styles from './LetterPaper.module.css';

interface LetterPaperProps {
 state: AppState;
 onFormChange: (key: keyof LetterForm, value: string) => void;
 onCopyChange: (val: string[]) => void;
 onLogoPos: (side: LogoSide, pos: { x?: number; y?: number; w?: number; placed?: boolean }) => void;
 onLogoRemove?: (side: LogoSide) => void;
 onToggleFooter?: () => void;
 onFooterDesign?: (design: AppState['footerDesign']) => void;
}

const FONT_MAP: Record<string, string> = {
 '': "var(--font-outfit), var(--font-poppins), sans-serif",
 fg: "'EB Garamond', serif",
 fs: "'Source Serif 4', serif",
 fd2: "var(--font-poppins), 'Noto Serif Devanagari', serif",
 ft: "'Tiro Devanagari Hindi', serif",
 fn: "'DM Sans', sans-serif",
};

// ── Inline Editable field ────────────────────
// Continuously syncs from props (sidebar input, deep link, presets, AI)
// while allowing smooth inline editing without cursor jump
interface EditableProps {
 value: string;
 onChange: (v: string) => void;
 className?: string;
 tag?: keyof React.JSX.IntrinsicElements;
 placeholder?: string;
 aiTick?: number;
 multiline?: boolean;
}

function Editable({ value, onChange, className, tag: Tag = 'span', placeholder, aiTick, multiline }: EditableProps) {
 const ref = useRef<HTMLElement>(null);
 const lastTick = useRef<number | undefined>(undefined);

 useLayoutEffect(() => {
 if (ref.current) {
 const formatted = multiline ? (value || '').replace(/\n/g, '<br/>') : (value || '');
 // Only sync innerHTML if not actively focused or if it was forced by aiTick
 if (document.activeElement !== ref.current || (aiTick !== undefined && aiTick !== lastTick.current)) {
 if (ref.current.innerHTML !== formatted) {
 ref.current.innerHTML = formatted;
 }
 }
 lastTick.current = aiTick;
 }
 }, [value, multiline, aiTick]);

 return React.createElement(Tag as string, {
 ref,
 contentEditable: true,
 suppressContentEditableWarning: true,
 className: `${styles.editable} ${className || ''}`.trim(),
 'data-placeholder': placeholder,
 onInput: (e: React.FormEvent<HTMLElement>) => {
 const text = multiline 
 ? (e.currentTarget.innerText || '').replace(/\r\n/g, '\n')
 : (e.currentTarget.textContent || '');
 onChange(text);
 },
 onBlur: (e: React.FocusEvent<HTMLElement>) => {
 const text = multiline 
 ? (e.currentTarget.innerText || '').replace(/\r\n/g, '\n')
 : (e.currentTarget.textContent || '');
 onChange(text);
 },
 });
}

// ── Logo placeholder SVG ────────────────────
function LogoPlaceholder({ icon, label }: { icon: string; label: string }) {
 return (
 <div className={styles.logoPh}>
 <span>{icon}</span>
 <small>{label}</small>
 </div>
 );
}

// ── Draggable logo ───────────────────────────
interface DraggableLogoProps {
 src: string | null;
 side: LogoSide;
 pos: { x: number; y: number; w: number; placed: boolean };
 paperRef: React.RefObject<HTMLDivElement | null>;
 onPos: (side: LogoSide, pos: { x?: number; y?: number; w?: number; placed?: boolean }) => void;
 onRemove: () => void;
}

function DraggableLogo({ src, side, pos, paperRef, onPos, onRemove }: DraggableLogoProps) {
 const divRef = useRef<HTMLDivElement>(null);
 const dragging = useRef(false);
 const resizing = useRef(false);
 const offset = useRef({ x: 0, y: 0 });
 const startW = useRef(0);
 const startX = useRef(0);

 useEffect(() => {
 if (side === 'R' && !pos.placed && paperRef.current) {
 const pw = paperRef.current.offsetWidth;
 onPos('R', { x: pw - pos.w - 44, y: 36, placed: true });
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
 const target = e.target as HTMLElement;
 if (target.classList.contains(styles.resizeHandle) || target.classList.contains(styles.delBtn)) return;
 dragging.current = true;
 const rect = divRef.current!.getBoundingClientRect();
 const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
 const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
 offset.current = { x: cx - rect.left, y: cy - rect.top };
 e.preventDefault();
 }, []);

 useEffect(() => {
 function onMove(e: MouseEvent | TouchEvent) {
 if (!dragging.current || !paperRef.current || !divRef.current) return;
 const paper = paperRef.current.getBoundingClientRect();
 const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
 const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
 const nx = Math.max(0, Math.min(paper.width - pos.w, cx - paper.left - offset.current.x));
 const ny = Math.max(0, Math.min(paper.height - pos.w, cy - paper.top - offset.current.y));
 divRef.current.style.left = nx + 'px';
 divRef.current.style.top = ny + 'px';
 onPos(side, { x: nx, y: ny, placed: true });
 e.preventDefault();
 }
 function onResizeMove(e: MouseEvent | TouchEvent) {
 if (!resizing.current || !divRef.current) return;
 const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
 const delta = cx - startX.current;
 const newW = Math.max(28, Math.min(160, startW.current + delta));
 divRef.current.style.width = newW + 'px';
 divRef.current.style.height = newW + 'px';
 onPos(side, { w: newW });
 e.preventDefault();
 }
 function onUp() { dragging.current = false; resizing.current = false; }
 document.addEventListener('mousemove', onMove);
 document.addEventListener('touchmove', onMove, { passive: false });
 document.addEventListener('mousemove', onResizeMove);
 document.addEventListener('touchmove', onResizeMove, { passive: false });
 document.addEventListener('mouseup', onUp);
 document.addEventListener('touchend', onUp);
 return () => {
 document.removeEventListener('mousemove', onMove);
 document.removeEventListener('touchmove', onMove);
 document.removeEventListener('mousemove', onResizeMove);
 document.removeEventListener('touchmove', onResizeMove);
 document.removeEventListener('mouseup', onUp);
 document.removeEventListener('touchend', onUp);
 };
 }, [pos.w, side, onPos, paperRef]);

 function startResize(e: React.MouseEvent | React.TouchEvent) {
 resizing.current = true;
 startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
 startW.current = pos.w;
 e.preventDefault();
 e.stopPropagation();
 }

 return (
 <div
 ref={divRef}
 className={styles.dlogo}
 style={{ left: pos.x, top: pos.y, width: pos.w, height: pos.w }}
 onMouseDown={startDrag}
 onTouchStart={startDrag}
 >
 {src
 ? <img src={src} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} alt="logo" draggable={false} />
 : <LogoPlaceholder icon={side === 'L' ? '🏛' : '🔏'} label={side === 'L' ? 'Dept Logo' : 'Office Seal'} />
 }
 <div className={styles.resizeHandle} onMouseDown={startResize} onTouchStart={startResize} />
 <button className={styles.delBtn} onClick={onRemove} title="Remove">✕</button>
 </div>
 );
}

// ── Medical Caduceus / Cross SVG Watermark ──────────
function MedicalWatermark() {
 return (
 <svg viewBox="0 0 100 100" className={styles.medicalWatermark} fill="#0891b2" aria-hidden="true">
 <path d="M42 20h16v18h18v16H58v18H42V54H24V38h18V20z" opacity="0.4" />
 <path d="M50 5 L50 95 M35 25 Q50 35 65 25 M35 45 Q50 55 65 45 M35 65 Q50 75 65 65" stroke="#0891b2" strokeWidth="2" fill="none" />
 <circle cx="50" cy="12" r="5" fill="#0891b2" />
 </svg>
 );
}

// ── Advocate Scales of Justice SVG Emblem ──────────
function AdvocateScalesEmblem() {
 return (
 <svg viewBox="0 0 64 64" className={styles.advocateEmblem} fill="currentColor" aria-hidden="true">
 <path d="M32 6 L32 54 M20 54 L44 54 M16 16 L48 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
 <circle cx="32" cy="10" r="3" />
 <path d="M16 16 L10 32 M16 16 L22 32 M10 32 Q16 38 22 32 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
 <path d="M48 16 L42 32 M48 16 L54 32 M42 32 Q48 38 54 32 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
 <path d="M8 48 Q4 32 14 20 M56 48 Q60 32 50 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
 </svg>
 );
}

// ── Main Paper ───────────────────────────────
export default function LetterPaper({ 
 state, 
 onFormChange, 
 onCopyChange, 
 onLogoPos, 
 onLogoRemove,
 onToggleFooter,
 onFooterDesign,
}: LetterPaperProps) {
 const { form, tpl, font, logoL, logoR, posL, posR, sigUrl, showEncl, showCopy, showEndorse, officeType } = state;
 const paperRef = useRef<HTMLDivElement>(null);
 const copyInputRefs = useRef<Array<HTMLInputElement | null>>([]);
 const tick = state.aiTick;

 // ── Copy-To: controlled inputs, one per recipient ──────────
 // The old contentEditable <li> implementation was fragile: pressing
 // Enter inside a contentEditable list item does not reliably produce
 // a '\n' in textContent, so onBlur splitting merged recipients on
 // reload ("1. PMO Divisional Commissioner"). Copy-To is therefore
 // stored as a clean string array (no empty entries, no "1. " prefixes)
 // and rendered as one controlled <input> per recipient plus one blank
 // typing row. The blank row is never stored, so save → reload →
 // render always yields exactly one numbered line per recipient.
 const stripCopyPrefix = (v: string) => v.replace(/^\s*\d+[.)]\s*/, '');
 const copyStored = form.copyTo.map((v) => stripCopyPrefix(v)).filter((v) => v.trim());
 const copyDisplay = [...copyStored, ''];
 const focusCopyInput = (idx: number) => {
   setTimeout(() => {
     const el = copyInputRefs.current[idx] ||
       (paperRef.current?.querySelector(`[data-copy-index="${idx}"]`) as HTMLInputElement | null);
     el?.focus();
   }, 0);
 };
 const updateCopyItem = (idx: number, value: string) => {
   const stripped = stripCopyPrefix(value);
   const updated = [...copyStored];
   if (idx < updated.length) {
     if (!stripped.trim()) updated.splice(idx, 1);
     else updated[idx] = stripped;
   } else if (stripped.trim()) {
     updated.push(stripped);
   }
   onCopyChange(updated);
 };
 const handleCopyKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
   if (e.key === 'Enter') {
     e.preventDefault();
     // Move to the next row; if this was the typing row and it now
     // holds text, onChange already stored it, so a fresh typing row
     // exists at the next index.
     focusCopyInput(idx + 1);
   } else if (e.key === 'Backspace' && !(e.currentTarget.value || '').trim() && idx < copyStored.length) {
     e.preventDefault();
     const updated = [...copyStored];
     updated.splice(idx, 1);
     onCopyChange(updated);
     focusCopyInput(Math.max(0, idx - 1));
   }
 };
 const handleCopyPaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
   const text = e.clipboardData.getData('text');
   if (!/\r?\n/.test(text)) return; // Single line: let the input handle it.
   e.preventDefault();
   const lines = text.split(/\r?\n/).map((l) => stripCopyPrefix(l).trim()).filter(Boolean);
   if (!lines.length) return;
   const updated = [...copyStored];
   if (idx < updated.length) updated.splice(idx, 1, ...lines);
   else updated.push(...lines);
   onCopyChange(updated);
   focusCopyInput(idx + lines.length - 1);
 };

 const isDoctor = officeType === 'doctor' || officeType === 'clinic';
 const isAdvocate = officeType === 'advocate';
 const isNGO = officeType === 'ngo-trust';
 const isSociety = officeType === 'housing-society';

 // Address, composed conditionally: empty parts are skipped (no dangling
 // ', ' or ' – '), and a city that merely repeats the office line is not
 // shown twice. PIN is joined with ' – ', not ', – '.
 const addrParts = [form.ofc?.trim(), form.city?.trim()].filter(Boolean) as string[];
 if (addrParts.length === 2 && addrParts[0].toLowerCase() === addrParts[1].toLowerCase()) addrParts.pop();
 const addr = addrParts.join(', ') + (form.pin?.trim() ? (addrParts.length ? ` – ${form.pin.trim()}` : form.pin.trim()) : '');
 // Station / Place beside the date: the sender's city is the station when
 // no separate place was entered. Nothing is invented — an empty city
 // simply yields no Place line.
 const station = form.city?.trim() || '';
 // Language of the letter, guessed from its own text (the generation
 // language is not stored on the form): Hindi markers are Hindi-only
 // (भवदीय), Marathi markers are Marathi-only (आपला नम्र). Used for
 // the date label and the signatory placeholder, so a Hindi/Marathi
 // letter does not carry English "Dated:" / "Your Name" leftovers.
 const letterText = `${form.sal} ${form.cls} ${form.body} ${form.sub}`;
 const isHindiLetter = /भवदीय|भवदीया|सेवा में/.test(letterText);
 const isMarathiLetter = /आपला नम्र|आपली नम्र|विनंती/.test(letterText);
 const dateLabel = (isHindiLetter || isMarathiLetter) ? 'दिनांक: ' : 'Dated: ';
 // Job A1/A2: paper labels localised to the letter's own language.
 // Marathi takes priority when both markers match (same order as
 // snPlaceholder above); English letters are untouched, real names
 // are never translated — only fixed UI labels/placeholders move.
 // Job A1 root cause: the A/E/F and C/D meta rows suppressed the
 // date label entirely for personal letters, so a Marathi student
 // application (officeType 'personal') showed a bare Devanagari
 // date with no दिनांक: label, while a Hindi complaint (non-
 // personal) got label+value together. The label now renders for
 // personal letters too when the letter itself is Hindi/Marathi;
 // English personal letters keep the old bare-date behaviour.
 const isDevLetter = isHindiLetter || isMarathiLetter;
 const L = isMarathiLetter ? {
   to: 'प्रति', sub: 'विषय:', ref: 'संदर्भ:', fno: 'पत्र क्र.', date: 'दिनांक', encl: 'संलग्नके:',
   toDPh: 'प्राप्तकर्त्याचे पदनाम / नाव', toDPhPersonal: 'प्राप्तकर्ता (उदा. पोस्टमास्तर)',
   toAPh: 'प्राप्तकर्ता कार्यालय / चेंबर पत्ता', subPh: 'विषय',
   sdPh: 'पदनाम / नोंदणी', deptPh: 'विभाग / क्लिनिक', titlePh: 'शीर्षक / कंपनीचे नाव',
   footer: 'पादलेख:', salPh: 'महोदय', clsPh: 'आपला नम्र',
 } : isHindiLetter ? {
   to: 'प्रति', sub: 'विषय:', ref: 'संदर्भ:', fno: 'पत्रांक', date: 'दिनांक', encl: 'संलग्नक:',
   toDPh: 'प्राप्तकर्ता का पदनाम / नाम', toDPhPersonal: 'प्राप्तकर्ता (उदा. पोस्टमास्टर)',
   toAPh: 'प्राप्तकर्ता कार्यालय / चैंबर पता', subPh: 'विषय',
   sdPh: 'पदनाम / पंजीकरण', deptPh: 'विभाग / क्लिनिक', titlePh: 'शीर्षक / कंपनी का नाम',
   footer: 'पादलेख:', salPh: 'महोदय', clsPh: 'भवदीय',
 } : {
   to: 'To', sub: 'Sub:', ref: 'Ref:', fno: 'F.No.', date: 'Date', encl: 'Enclosures:',
   toDPh: 'Recipient Designation / Name', toDPhPersonal: 'Recipient (e.g. The Postmaster)',
   toAPh: 'Recipient Office / Chamber Address', subPh: 'Subject',
   sdPh: 'Designation / Registration', deptPh: 'Department / Clinic', titlePh: 'Title / Company Name',
   footer: 'Footer:', salPh: 'Sir/Madam', clsPh: 'Yours faithfully',
 };
 const snPlaceholder = state.officeType === 'personal'
   ? (isMarathiLetter ? 'तुमचे नाव' : isHindiLetter ? 'आपका नाम' : 'Your Name')
   : (isMarathiLetter ? '(स्वाक्षरीकर्त्याचे नाव)' : isHindiLetter ? '(हस्ताक्षरकर्ता का नाम)' : '(Signatory Name)');
 // Type-B organisation header (Defect 6): Type-B previously rendered
 // ONLY the personal name block (sh/sn/sd), so a company letter on
 // Type-B lost its organisation header entirely. When an organisation
 // header is filled, render it above the name block; when the name
 // and the organisation line are the same person (doctor/advocate
 // presets put the person's name in e1), render it once, not twice.
 const normNameTokens = (s: string) => s.toLowerCase().replace(/[^a-z\u0900-\u097f0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
   .filter((w) => !['dr', 'adv', 'advocate', 'mr', 'mrs', 'ms', 'shri', 'smt'].includes(w));
 const snSameAsE1 = Boolean(form.sn?.trim() && form.e1?.trim()) && (() => {
   const a = new Set(normNameTokens(form.sn));
   const b = new Set(normNameTokens(form.e1));
   if (!a.size || !b.size) return false;
   const [small, big] = a.size <= b.size ? [a, b] : [b, a];
   return [...small].every((t) => big.has(t));
 })();
 const showOrgHeaderB = Boolean(form.e1?.trim() || form.e2?.trim() || form.dept?.trim());
 const deptDiffersFromSdB = Boolean(form.dept?.trim())
   && form.dept.trim().toLowerCase() !== (form.sd?.trim().toLowerCase() || '');
 const headerCityDuplicatesOffice = Boolean(form.ofc?.trim() && form.city?.trim() && form.ofc.trim().toLowerCase() === form.city.trim().toLowerCase());
 // Header-line dedupe (2026-10-28 NOC letter): an AI that fills
 // English Line 1 AND Line 2 (or Hindi Line 1 AND 2) with the
 // identical value used to print the company name twice, and a
 // dept line repeating the company name printed it a third time.
 // Duplicates are hidden from the RENDERED header only — the form
 // values stay intact and editable in the sidebar (and still
 // appear in the signature block / footer where they belong).
 const h1h2Dup = headerLinesEqual(form.h1, form.h2);
 const e1e2Dup = headerLinesEqual(form.e1, form.e2);
 const deptDupCompany = headerDeptRedundant(form.dept, [form.e1, form.e2]);
 const fontFamily = FONT_MAP[font] || FONT_MAP[''];

 // Helper: Editable with correct aiTick wired in
 const E = useCallback(
 (key: keyof LetterForm, className?: string, tag?: keyof React.JSX.IntrinsicElements, placeholder?: string, multiline?: boolean) => (
 <Editable
 key={key}
 value={String(form[key] ?? '')}
 onChange={v => onFormChange(key, v)}
 className={className}
 tag={tag}
 placeholder={placeholder || `[${key}]`}
 aiTick={tick}
 multiline={multiline}
 />
 ),
 [form, onFormChange, tick]);

 // ── Header by template ───────────────────────
 function renderHeader() {
 switch (tpl) {
 case 'A': case 'E': case 'F': return (
 <div className={styles.hA}>
 {/* Blank File No. renders nothing (omit-empty, like the PDF):
     the old unconditional row printed a bare "F.No." label twice
     on the paper — once here, once in the meta row. The sidebar
     File No. field remains the edit path. */}
 {form.fno?.trim() && (
 <div className={styles.hATop}>
 {E('fno', styles.hAFno, 'div', L.fno)}
 <div className={styles.hARslot} />
 </div>
 )}
 <div className={styles.hACenter}>
 {(form.h1 || form.h2) && (
 <div className={styles.hAHi}>
 {E('h1', '', 'span', 'Hindi Heading 1')}
 {form.h2 && !h1h2Dup && <> / {E('h2', '', 'span', 'Hindi Heading 2')}</>}
 </div>
 )}
 {(form.e1 || form.e2) && (
 <div className={styles.hAEn}>
 {E('e1', '', 'span', 'Heading 1')}
 {form.e2 && !e1e2Dup && <> / {E('e2', '', 'span', 'Heading 2')}</>}
 </div>
 )}
 {/* Dept / division lines are only rendered when filled (or when no
     organisation name is filled yet, so the field remains editable
     on a blank letter). Otherwise their grey placeholders showed
     under a filled organisation name — the minor Type-E defect. The
     sidebar Department / Division fields still edit them. */}
 {((form.dept?.trim() && !deptDupCompany) || !(form.e1?.trim() || form.e2?.trim())) && (
 <div className={styles.hADept}>
 {E('dept', '', 'span', L.titlePh)}
 {tpl === 'F' && <span className={styles.circularBadge}>CIRCULAR</span>}
 </div>
 )}
 {form.divn?.trim() && E('divn', styles.hADiv, 'div', 'Subtitle / Branch')}
 {form.enrolmentNo && (
 <div className={styles.advocateEnrolment}>
 {E('enrolmentNo', '', 'span', 'Reg / Enrolment No.')}
 </div>
 )}
 {/* Defect 4: the literal "★★★★" star row is removed entirely.
     It was meant as decoration for a filled header, but it rendered
     as literal placeholder text in generated headers. The real
     decorative rules below (double/single divider lines) are kept. */}
 </div>
 {/* Address/contact block: omitted entirely when every field is
     empty, so a letter with no address never shows "Office City PIN"
     or "Phone: Phone email" as if they were real text (Defect 7).
     Phone/email spans render only when filled — the old spans used
     an unconditional hide-in-print class, which also suppressed
     FILLED phone/email from print. Sidebar fields still edit these
     values when the block is hidden. */}
 {/* Website belongs here too: the old block never rendered wb,
     so the paper header showed phone + email while the PDF showed
     phone + email + website for the same letter. */}
 {(form.ofc?.trim() || form.city?.trim() || form.pin?.trim() || form.ph?.trim() || form.em?.trim() || form.wb?.trim()) && (
 <div className={styles.hAAddr}>
 {E('ofc', '', 'span', 'Office')}
 {/* Separators are print-hidden when a neighbour is empty, so print
     never shows a dangling ', ' or ' – ' for a blank field. */}
 <span className={(!form.ofc?.trim() || !form.city?.trim() || headerCityDuplicatesOffice) ? styles.hideIfEmptyPrint : ''}>{(!headerCityDuplicatesOffice && form.ofc?.trim() && form.city?.trim()) ? ', ' : ''}</span>
 {!headerCityDuplicatesOffice && E('city', '', 'span', 'City')}
 <span className={!(form.ofc?.trim() || form.city?.trim()) || !form.pin?.trim() ? styles.hideIfEmptyPrint : ''}>{(form.ofc?.trim() || form.city?.trim()) && form.pin?.trim() ? ' – ' : ''}</span>
 {E('pin', '', 'span', 'PIN')}<br/>
 {form.ph?.trim() && (<span>{'Phone: '}{E('ph', '', 'span', 'Phone')}&emsp;</span>)}
 {form.em?.trim() && (<span>{E('em', '', 'span', 'email')}</span>)}
 {form.wb?.trim() && (<span>{(form.ph?.trim() || form.em?.trim()) ? ' · ' : ''}{E('wb', '', 'span', 'Website')}</span>)}
 </div>
 )}
 </div>
 );
 case 'B': return (
 <div className={styles.hB}>
 <div className={styles.hBCenter}>
 <div className={styles.hBLogoSlot}>
 {isAdvocate && <AdvocateScalesEmblem />}
 </div>
 <div className={!form.sh?.trim() ? styles.hideIfEmptyPrint : ''}>{E('sh', styles.hBHi, 'div', 'हिन्दी / मराठी नाव')}</div>
 {/* Organisation header first when one is filled (Defect 6): the
     company name/department that Type-B used to drop. The personal
     name line is skipped only when it duplicates the organisation
     line (same person), and only rendered when filled once an
     organisation header exists — otherwise it stays the classic
     personal-name header. */}
 {showOrgHeaderB && (
 <>
 {form.e1?.trim() && (<div className={styles.hBEn}>{E('e1', '', 'div', 'Organisation')}</div>)}
 {form.e2?.trim() && !e1e2Dup && (<div className={styles.hBDg}>{E('e2', '', 'div', 'Organisation Line 2')}</div>)}
 {deptDiffersFromSdB && !deptDupCompany && (<div className={styles.hBDg}>{E('dept', '', 'div', 'Department')}</div>)}
 </>
 )}
 {(!showOrgHeaderB || form.sn?.trim()) && !snSameAsE1 && E('sn', styles.hBEn, 'div', 'Name')}
 {E('sd', styles.hBDg, 'div', L.sdPh)}
 {form.enrolmentNo && (
 <div className={styles.advocateEnrolment}>
 {E('enrolmentNo', '', 'span', 'Reg / Enrolment No.')}
 </div>
 )}
 </div>
 <div className={styles.hBAddr}>
 {E('ofc', '', 'div', 'Office / Chamber')}<br/>
 {E('city', '', 'span', 'City')}<span className={(!form.city?.trim() || !form.pin?.trim()) ? styles.hideIfEmptyPrint : ''}>{form.city?.trim() && form.pin?.trim() ? ' – ' : ''}</span>{E('pin', '', 'span', 'PIN')}<br/>
 <span className={!form.ph?.trim() ? styles.hideIfEmptyPrint : ''}>Tel: {E('ph', '', 'span', 'Phone')}<br/></span>
 <span className={!form.em?.trim() ? styles.hideIfEmptyPrint : ''}>{E('em', '', 'span', 'Email')}<br/></span>
 <span className={!form.wb?.trim() ? styles.hideIfEmptyPrint : ''}>{E('wb', '', 'span', 'Website')}<br/></span>
 {E('dt', '', 'span', L.date)}
 </div>
 </div>
 );
 case 'C': return (
 <div className={styles.hC}>
 <div className={styles.hCRow}>
 <div className={styles.hCLogo} />
 <div className={styles.hCMid}>
 <div className={!form.sh?.trim() ? styles.hideIfEmptyPrint : ''}>{E('sh', styles.hCHi, 'div', 'हिन्दी / मराठी नाव')}</div>
 {E('sn', styles.hCEn, 'div', 'Name')}
 {E('sd', styles.hCDg, 'div', 'Designation')}
 {E('dept', styles.hCSub, 'div', 'Department')}
 <div className={!form.sc?.trim() ? styles.hideIfEmptyPrint : ''}>{E('sc', styles.hCSub, 'div', 'Constituency / Ward')}</div>
 {form.enrolmentNo && (
 <div className={styles.advocateEnrolment}>
 {E('enrolmentNo', '', 'span', 'Reg / Enrolment No.')}
 </div>
 )}
 </div>
 <div className={styles.hCLogo} />
 </div>
 </div>
 );
 case 'D': return (
 <div className={styles.hD}>
 <div className={styles.hDRow}>
 <div className={styles.hDLogo} />
 <div className={styles.hDNames}>
 <div className={!form.sh?.trim() ? styles.hideIfEmptyPrint : ''}>{E('sh', styles.hDHi, 'div', 'हिन्दी / मराठी नाव')}</div>
 {E('sn', styles.hDEn, 'div', 'Name')}
 {E('sd', styles.hDDg, 'div', 'Designation')}
 <div className={!form.sc?.trim() ? styles.hideIfEmptyPrint : ''}>{E('sc', styles.hDCn, 'div', 'Constituency / Circle')}</div>
 {form.enrolmentNo && (
 <div className={styles.advocateEnrolment}>
 {E('enrolmentNo', '', 'span', 'Reg / Enrolment No.')}
 </div>
 )}
 </div>
 <div className={styles.hDAddr}>
 {!deptDupCompany && (<>{E('dept', styles.hDEn, 'div', 'Department')}<br/></>)}
 {E('ofc', '', 'div', 'Office')}<br/>
 {E('city', '', 'span', 'City')}<span className={(!form.city?.trim() || !form.pin?.trim()) ? styles.hideIfEmptyPrint : ''}>{form.city?.trim() && form.pin?.trim() ? ' – ' : ''}</span>{E('pin', '', 'span', 'PIN')}<br/>
 <div className={styles.hideIfEmptyPrint}>{E('ph', '', 'div', 'Phone')}</div>
 <div className={styles.hideIfEmptyPrint}>{E('em', '', 'div', 'email')}</div>
 <div className={styles.hideIfEmptyPrint}>{E('wb', '', 'div', 'Website')}</div>
 </div>
 </div>
 </div>
 );
 default: return null;
 }
 }

 function renderDivider() {
 if (isAdvocate) {
 return (
 <>
 <div className={styles.advocateCurvedBand} />
 <hr className={styles.thinLine}/>
 </>
 );
 }
 switch (tpl) {
 case 'A': case 'E': case 'F': return <><hr className={styles.dblLine}/><hr className={styles.singleLine}/></>;
 case 'B': return <hr className={styles.solidLine}/>;
 case 'C': return (
 <>
 <div className={styles.triStrip}><div className={styles.ts1}/><div className={styles.ts2}/><div className={styles.ts3}/></div>
 <hr className={styles.thinLine}/>
 </>
 );
 case 'D': return <hr className={styles.saffronLine}/>;
 default: return null;
 }
 }

 const isFooterVisible = state.showFooter !== undefined 
 ? state.showFooter 
 : state.officeType !== 'personal';

 const footerDesign = state.footerDesign || (tpl === 'D' ? 'minimal' : tpl === 'C' ? 'classic' : 'classic');

 const footerClass = footerDesign === 'modern' ? `${styles.footer} ${styles.footerModern}` :
 footerDesign === 'minimal' ? `${styles.footer} ${styles.footerMinimal}` :
 footerDesign === 'tricolor' ? `${styles.footer} ${styles.footerTricolor}` :
 footerDesign === 'executive' ? `${styles.footer} ${styles.footerExecutive}` :
 `${styles.footer} ${styles.footerClassic}`;

 return (
 <div className={`${styles.paper} ${state.officeType === 'personal' ? styles.paperPersonal : ''}`} ref={paperRef} style={{ fontFamily }} data-paper="true">
 {/* Side Accent for NGO */}
 {isNGO && <div className={styles.ngoSideBar} />}

 {/* Faint Medical Watermark for Doctor / Clinic */}
 {isDoctor && <MedicalWatermark />}

 {/* Edit hint */}
 <div className={styles.editHint}>✏ Click any text to edit inline</div>

 {/* ── Group for Print Layout (display: table-row-group) ── */}
 <div className={styles.contentWrap}>
 {state.officeType !== 'personal' && (
 <>
 {renderHeader()}
 {renderDivider()}
 </>
 )}

 {/* NGO Credentials Strip */}
 {isNGO && (
 <div className={styles.ngoCredentialsBadge}>
 <span>🏛 NITI Aayog NGO DARPAN ID | 80G &amp; 12A Approved</span>
 <span>Regd. Charitable Public Trust</span>
 </div>
 )}

 {/* Doctor / Clinic Patient Vitals Strip */}
 {isDoctor && (
 <div className={styles.vitalsStrip}>
 <div className={styles.vitalsField}>
 <span className={styles.vitalsLabel}>Pt. Name:</span>
 <Editable value={form.toD || ''} onChange={v => onFormChange('toD', v)} placeholder="Patient Name" aiTick={tick} />
 </div>
 <div className={styles.vitalsField}>
 <span className={styles.vitalsLabel}>Age/Sex:</span>
 <Editable value={form.ref || ''} onChange={v => onFormChange('ref', v)} placeholder="32/M" aiTick={tick} />
 </div>
 <div className={styles.vitalsField}>
 <span className={styles.vitalsLabel}>Weight:</span>
 <Editable value={form.sp || ''} onChange={v => onFormChange('sp', v)} placeholder="68 kg" aiTick={tick} />
 </div>
 <div className={styles.vitalsField}>
 <span className={styles.vitalsLabel}>BP/Pulse:</span>
 <Editable value={form.sc || ''} onChange={v => onFormChange('sc', v)} placeholder="120/80" aiTick={tick} />
 </div>
 <div className={styles.vitalsField}>
 <span className={styles.vitalsLabel}>Date:</span>
 <Editable value={form.dt || ''} onChange={v => onFormChange('dt', v)} placeholder="Date" aiTick={tick} />
 </div>
 </div>
 )}

 {/* Meta row */}
 {(tpl === 'A' || tpl === 'E' || tpl === 'F') && !isDoctor && (
 <div className={`${styles.meta} ${state.officeType === 'personal' ? styles.metaPersonal : ''}`}>
 {state.officeType !== 'personal' && (
 <>
 {form.fno?.trim() && (
 <span>
 {E('fno', '', 'span', L.fno)}
 </span>
 )}
 <span className={!addr?.trim() ? styles.hideIfEmptyPrint : ''}>{addr}</span>
 </>
 )}
 <span className={!form.dt?.trim() ? styles.hideIfEmptyPrint : ''}>
 {/* No station prefix here (Defect 10): the address span in this
     same row already shows the city, so "Mumbai, Dated:" repeated
     it. The Place line survives where the header has no city
     (Type-C below); Type-D drops it for the same reason. */}
 {state.officeType === 'personal' && !isDevLetter ? '' : dateLabel}
 {E('dt', '', 'span', L.date)}
 </span>
 </div>
 )}

 {/* Meta row for layouts B/C/D — previously these had no File No. slot
     at all, so a filled File No. never appeared (including the RTI
     preset, which is Type-B). B already shows the date in its header,
     so B shows File No. + Place only; C/D show File No. + Place, Date.
     The row renders only when at least one of its fields is filled. */}
 {(tpl === 'B' || tpl === 'C' || tpl === 'D') && !isDoctor && (form.fno?.trim() || form.dt?.trim() || station) && (
 <div className={`${styles.meta} ${state.officeType === 'personal' ? styles.metaPersonal : ''}`}>
 {state.officeType !== 'personal' && form.fno?.trim() && (
 <span>
 {E('fno', '', 'span', L.fno)}
 </span>
 )}
 <span className={!station && !(tpl !== 'B' && form.dt?.trim()) && !(tpl === 'B' && state.officeType === 'personal' && form.dt?.trim()) ? styles.hideIfEmptyPrint : ''}>
 {tpl === 'B' ? (state.officeType === 'personal' ? (form.dt?.trim() ? dateLabel : '') : station) : (tpl === 'D' ? '' : (station && form.dt?.trim() ? `${station}, ` : station))}
 {tpl === 'B' && state.officeType === 'personal' && E('dt', '', 'span', L.date)}
 {tpl !== 'B' && (state.officeType === 'personal' ? (isDevLetter && form.dt?.trim() ? dateLabel : '') : (form.dt?.trim() ? dateLabel : ''))}
 {tpl !== 'B' && E('dt', '', 'span', L.date)}
 </span>
 </div>
 )}

 {/* Body */}
 <div className={styles.body}>
 {/* To block — each field is block-level inside a clear container.
     Formerly guarded by `tpl !== 'E'`, so official letters on Type-E
     lost their recipient entirely. It now renders in every layout
     whenever To is filled; when both To fields are empty the print
     stylesheet hides it, preserving the memo look. */}
 {!isDoctor && (
 <div className={`${styles.toBlock} ${(!form.toD?.trim() && !form.toA?.trim()) ? styles.hideIfEmptyPrint : ''}`}>
 {!(state.officeType === 'personal' && (form.sal.toLowerCase().includes('dearest') || form.sal.toLowerCase().includes('darling') || form.sal.toLowerCase().includes('प्रियतम') || form.cls.toLowerCase().includes('forever') || form.sub.toLowerCase().includes('love') || form.sub.toLowerCase().includes('heart') || form.toD.toLowerCase().includes('love'))) && (
 <span className={styles.toLabel}>{L.to}</span>
 )}
 <div className={styles.toInner}>
 <div className={`${styles.toName} ${!form.toD?.trim() ? styles.hideIfEmptyPrint : ''}`}>
 <Editable
 value={form.toD}
 onChange={v => onFormChange('toD', v)}
 tag="span"
 placeholder={state.officeType === 'personal' ? L.toDPhPersonal : L.toDPh}
 aiTick={tick}
 />
 </div>
 {/* Recipient address line omitted when empty and a recipient is
     filled (Defect 7): its placeholder used to read as a real
     address line. On a blank letter it stays as the editing
     affordance; the sidebar To-Address field always edits it. */}
 {(form.toA?.trim() || !form.toD?.trim()) && (
 <div className={styles.toAddr}>
 <Editable
 value={form.toA}
 onChange={v => onFormChange('toA', v)}
 tag="span"
 placeholder={L.toAPh}
 aiTick={tick}
 multiline
 />
 </div>
 )}
 </div>
 </div>
 )}

 {/* Subject */}
 <div className={`${styles.subBlock} ${!form.sub?.trim() ? styles.hideIfEmptyPrint : ''}`}>
 {isDoctor ? (
 <div className={styles.rxBadge}>℞</div>
 ) : (
 !(state.officeType === 'personal' && (form.sal.toLowerCase().includes('dearest') || form.sal.toLowerCase().includes('darling') || form.sal.toLowerCase().includes('प्रियतम') || form.cls.toLowerCase().includes('forever') || form.sub.toLowerCase().includes('love') || form.sub.toLowerCase().includes('heart') || form.toD.toLowerCase().includes('love'))) && (
 <span className={styles.subLabel}>{L.sub}</span>
 )
 )}
 {E('sub', styles.subText, 'span', isDoctor ? 'Diagnosis / Clinical Advice' : L.subPh)}
 </div>

 {/* Reference — only show if there IS a ref value */}
 {form.ref?.trim() && !isDoctor && (
 <div className={styles.refBlock}>
 <strong>{L.ref}</strong>{' '}
 <Editable
 value={form.ref}
 onChange={v => onFormChange('ref', v)}
 tag="span"
 placeholder="Reference / Prior Notice No."
 aiTick={tick}
 />
 </div>
 )}

 {/* Salutation — same fix as the To block: it used to be dropped
     on Type-E even when the user had chosen one. */}
 {(
 <div className={`${styles.salBlock} ${!form.sal?.trim() ? styles.hideIfEmptyPrint : ''}`}>
 {/* Comma joined with no intervening whitespace (Defect 10): a
     space between the salutation and its comma rendered as
     "Respected Sir ,". Same fix in the closing block below. */}
 {E('sal', '', 'span', isDoctor ? 'Patient Advice:' : state.officeType === 'personal' ? 'My Dearest' : L.salPh)}{form.sal?.trim() ? ',' : ''}
 </div>
 )}

 {/* Body text */}
 <Editable
 value={form.body}
 onChange={v => onFormChange('body', v)}
 className={styles.bodyText}
 tag="div"
 placeholder={isDoctor ? "Type clinical findings, prescription dosage, and advice…" : "Click to type letter body, or use AI to generate…"}
 aiTick={tick}
 multiline
 />

 {/* Closing + Signature — right-aligned */}
 {
 <div className={styles.closingAndSig}>
 <div className={`${styles.closingBlock} ${!form.cls?.trim() ? styles.hideIfEmptyPrint : ''}`}>
 <Editable
 value={form.cls}
 onChange={v => onFormChange('cls', v)}
 tag="span"
 placeholder={isDoctor ? "Consulting Physician" : state.officeType === 'personal' ? "Forever yours" : L.clsPh}
 aiTick={tick}
 />{form.cls?.trim() ? ',' : ''}
 </div>
 <div className={styles.sigWrap}>
 <div className={styles.sigSpace}>
 {sigUrl && <img src={sigUrl} className={styles.sigImg} alt="signature" />}
 </div>
 <Editable value={form.sn} onChange={v => onFormChange('sn', v)} tag="div" className={`${styles.sigName} ${!form.sn?.trim() ? styles.hideIfEmptyPrint : ''}`} placeholder={snPlaceholder} aiTick={tick} />
 {state.officeType !== 'personal' && (
 <>
 <Editable value={form.sd} onChange={v => onFormChange('sd', v)} tag="div" className={`${styles.sigDesig} ${!form.sd?.trim() ? styles.hideIfEmptyPrint : ''}`} placeholder={L.sdPh} aiTick={tick} />
 <Editable value={form.dept} onChange={v => onFormChange('dept', v)} tag="div" className={`${styles.sigDept} ${!form.dept?.trim() ? styles.hideIfEmptyPrint : ''}`} placeholder={L.deptPh} aiTick={tick} />
 </>
 )}
 {(form.sp?.trim() || form.em?.trim()) && state.officeType !== 'personal' && (
 <div className={styles.sigContact}>
 {form.sp?.trim() && <Editable value={form.sp} onChange={v => onFormChange('sp', v)} tag="span" placeholder="Phone/Extn" aiTick={tick} />}
 {form.sp?.trim() && form.em?.trim() ? ' | ' : ''}
 {form.em?.trim() && <Editable value={form.em} onChange={v => onFormChange('em', v)} tag="span" placeholder="email" aiTick={tick} />}
 </div>
 )}
 </div>
 </div>
 }

 {/* Doctor Medico-Legal Warning */}
 {isDoctor && (
 <div className={styles.medicoLegalNote}>
 * NOT FOR MEDICO-LEGAL PURPOSE · VALID FOR 7 DAYS *
 </div>
 )}
 </div>{/* end .body */}

 {/* Encl */}
 {showEncl && (
 <div className={styles.enclBlock}>
 {/* Labelled like the PDF (which already prefixes "Enclosures:"):
     the old paper showed bare enclosure text with no label. */}
 <span className={styles.enclLabel}>{L.encl}</span>{' '}
 <Editable
 value={form.encl}
 onChange={v => onFormChange('encl', v)}
 tag="div"
 placeholder="Enclosures…"
 aiTick={tick}
 multiline
 />
 </div>
 )}

 {/* Copy To — one controlled input per recipient (see note above).
     The <ol> numbers the lines; the inputs themselves carry no
     numbers, so hand-typed "1. " prefixes are stripped on input and
     pasted multi-line text is split into separate recipients. The
     final blank row is a typing row only: it is never stored, so it
     never prints and never survives a reload as a phantom recipient. */}
 {showCopy && (
 <div className={styles.copyBlock}>
 <div className={styles.copyHead}>Copy forwarded for information and necessary action to:</div>
 <ol className={styles.copyList}>
 {copyDisplay.map((item, i) => {
   const isTypingRow = i === copyDisplay.length - 1;
   return (
 <li key={`copy-${i}`} className={isTypingRow ? styles.copyInputBlank : ''}>
 <input
 ref={(el) => { copyInputRefs.current[i] = el; }}
 data-copy-index={i}
 className={styles.copyInput}
 value={item}
 placeholder={isTypingRow ? 'Add recipient…' : 'Recipient'}
 aria-label={`Copy recipient ${i + 1}`}
 onChange={(e) => updateCopyItem(i, e.target.value)}
 onKeyDown={(e) => handleCopyKeyDown(i, e)}
 onPaste={(e) => handleCopyPaste(i, e)}
 />
 </li>
   );
 })}
 </ol>
 </div>
 )}

 {/* Endorsement */}
 {showEndorse && (
 <div className={styles.endorseBlock}>
 <div className={styles.endorseHead}>Forwarded / Endorsed to:</div>
 <Editable
 value={form.endorsement}
 onChange={v => onFormChange('endorsement', v)}
 tag="div"
 placeholder="Endorsement details…"
 aiTick={tick}
 multiline
 />
 </div>
 )}

 </div> {/* end .contentWrap */}

 {/* Footer */}
 {isFooterVisible && (
 <div className={footerClass} style={{ fontFamily }}>
 {/* Quick action bar on hover (screen only) */}
 <div className={styles.footerHoverBar}>
 <span style={{ fontSize: 10, opacity: 0.85 }}>{L.footer}</span>
 {onToggleFooter && (
 <button 
 type="button"
 className={styles.footerHoverBtn}
 onClick={(e) => { e.stopPropagation(); onToggleFooter(); }}
 title="Remove footer from letter"
 >
 ✕ Remove
 </button>
 )}
 {onFooterDesign && (
 <select
 className={styles.footerHoverSelect}
 value={state.footerDesign || 'classic'}
 onClick={(e) => e.stopPropagation()}
 onChange={(e) => onFooterDesign(e.target.value as any)}
 >
 <option value="classic">Classic Bar</option>
 <option value="tricolor">🇮🇳 Tricolor</option>
 <option value="modern">Modern Minimal</option>
 <option value="executive">Executive</option>
 </select>
 )}
 </div>

 {footerDesign === 'executive' ? (
 <div className={styles.footerExecInner}>
 <div className={styles.footerExecTop}>
 <span className={styles.footerDeptBold}>
 {form.dept || ''}
 </span>
 <span className={styles.footerLoc}>
 {[form.city, form.pin ? `PIN: ${form.pin}` : ''].filter(Boolean).join(' – ')}
 </span>
 </div>
 <div className={styles.footerExecBottom}>
 <span>{[form.ph ? `Tel: ${form.ph}` : '', form.em].filter(Boolean).join(' · ')}</span>
 <span>{form.wb || ''}</span>
 </div>
 </div>
 ) : footerDesign === 'minimal' ? (
 <div className={styles.footerMinimalInner}>
 <span>
 {[
 form.dept || '',
 [form.city, form.pin ? `PIN: ${form.pin}` : ''].filter(Boolean).join(' – '),
 [form.ph ? `Tel: ${form.ph}` : '', form.em, form.wb].filter(Boolean).join(' · ')
 ].filter(Boolean).join(' • ')}
 </span>
 </div>
 ) : (
 <div className={styles.footerGrid}>
 <span className={styles.footerDept}>
 {form.dept || ''}
 </span>
 <span className={styles.footerLoc}>
 {[form.city, form.pin ? `PIN: ${form.pin}` : ''].filter(Boolean).join(' – ')}
 </span>
 <span className={styles.footerContact}>
 {[form.ph ? `Tel: ${form.ph}` : '', form.em, form.wb].filter(Boolean).join(' · ') || form.wb}
 </span>
 </div>
 )}
 </div>
 )}

 {/* Draggable Logos */}
 {logoL && (
 <DraggableLogo src={logoL} side="L" pos={posL} paperRef={paperRef}
 onPos={onLogoPos} onRemove={() => onLogoRemove?.('L')} />
 )}
 {logoR && (
 <DraggableLogo src={logoR} side="R" pos={posR} paperRef={paperRef}
 onPos={onLogoPos} onRemove={() => onLogoRemove?.('R')} />
 )}
 </div>
 );
}

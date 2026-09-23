// ─────────────────────────────────────────────
//  components/letterpad/LetterPaper.tsx
//  Full inline editing on ALL fields + Live Sidebar Binding + Profession Accents
// ─────────────────────────────────────────────
'use client';
import React, { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import type { AppState, LetterForm, LogoSide } from '@/types/letterpad';
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
  '':    "var(--font-outfit), var(--font-poppins), sans-serif",
  fg:    "'EB Garamond', serif",
  fs:    "'Source Serif 4', serif",
  fd2:   "var(--font-poppins), 'Noto Serif Devanagari', serif",
  ft:    "'Tiro Devanagari Hindi', serif",
  fn:    "'DM Sans', sans-serif",
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
  const divRef   = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset   = useRef({ x: 0, y: 0 });
  const startW   = useRef(0);
  const startX   = useRef(0);

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
      divRef.current.style.top  = ny + 'px';
      onPos(side, { x: nx, y: ny, placed: true });
      e.preventDefault();
    }
    function onResizeMove(e: MouseEvent | TouchEvent) {
      if (!resizing.current || !divRef.current) return;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = cx - startX.current;
      const newW = Math.max(28, Math.min(160, startW.current + delta));
      divRef.current.style.width  = newW + 'px';
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
  const tick     = state.aiTick;

  const isDoctor = officeType === 'doctor' || officeType === 'clinic';
  const isAdvocate = officeType === 'advocate';
  const isNGO = officeType === 'ngo-trust';
  const isPanchayat = officeType === 'gram-panchayat';
  const isPublicRep = officeType === 'political-leader';
  const isSociety = officeType === 'housing-society';

  const addr = [form.ofc, form.city, form.pin ? '– ' + form.pin : ''].filter(Boolean).join(', ');
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
          <div className={styles.hATop}>
            {E('fno', styles.hAFno, 'div', 'F.No.')}
            <div className={styles.hARslot} />
          </div>
          <div className={styles.hACenter}>
            {(form.h1 || form.h2) && (
              <div className={styles.hAHi}>
                {E('h1', '', 'span', state.officeType === 'custom' ? 'Hindi Heading 1' : 'भारत सरकार')}
                {form.h2 && <> / {E('h2', '', 'span', state.officeType === 'custom' ? 'Hindi Heading 2' : 'विभाग')}</>}
              </div>
            )}
            {(form.e1 || form.e2) && (
              <div className={styles.hAEn}>
                {E('e1', '', 'span', state.officeType === 'custom' ? 'Heading 1' : 'Government of India')}
                {form.e2 && <> / {E('e2', '', 'span', state.officeType === 'custom' ? 'Heading 2' : 'Ministry')}</>}
              </div>
            )}
            <div className={styles.hADept}>
              {E('dept', '', 'span', state.officeType === 'custom' ? 'Title / Company Name' : 'Department')}
              {tpl === 'F' && <span className={styles.circularBadge}>CIRCULAR</span>}
            </div>
            {E('divn', styles.hADiv, 'div', state.officeType === 'custom' ? 'Subtitle / Branch' : 'Division / Section')}
            {form.enrolmentNo && (
              <div className={styles.advocateEnrolment}>
                {E('enrolmentNo', '', 'span', 'Reg / Enrolment No.')}
              </div>
            )}
            <div className={styles.hAStars}>★&nbsp;&nbsp;★&nbsp;&nbsp;★&nbsp;&nbsp;★</div>
          </div>
          <div className={styles.hAAddr}>
            {E('ofc', '', 'span', 'Office')}{', '}
            {E('city', '', 'span', 'City')}{' – '}
            {E('pin', '', 'span', 'PIN')}<br/>
            <span className={styles.hideIfEmptyPrint}>{'Phone: '}{E('ph', '', 'span', 'Phone')}&emsp;</span>
            <span className={styles.hideIfEmptyPrint}>{E('em', '', 'span', 'email')}</span>
          </div>
        </div>
      );
      case 'B': return (
        <div className={styles.hB}>
          <div className={styles.hBCenter}>
            <div className={styles.hBLogoSlot}>
              {isAdvocate && <AdvocateScalesEmblem />}
            </div>
            <div className={!form.sh?.trim() ? styles.hideIfEmptyPrint : ''}>{E('sh', styles.hBHi, 'div', 'हिन्दी / मराठी नाव')}</div>
            {E('sn', styles.hBEn, 'div', 'Name')}
            {E('sd', styles.hBDg, 'div', 'Designation / Specialty')}
            {form.enrolmentNo && (
              <div className={styles.advocateEnrolment}>
                {E('enrolmentNo', '', 'span', 'Reg / Enrolment No.')}
              </div>
            )}
          </div>
          <div className={styles.hBAddr}>
            {E('ofc', '', 'div', 'Office / Chamber')}<br/>
            {E('city', '', 'span', 'City')}{' – '}{E('pin', '', 'span', 'PIN')}<br/>
            <span className={!form.ph?.trim() ? styles.hideIfEmptyPrint : ''}>Tel: {E('ph', '', 'span', 'Phone')}<br/></span>
            <span className={!form.em?.trim() ? styles.hideIfEmptyPrint : ''}>{E('em', '', 'span', 'Email')}<br/></span>
            {E('dt', '', 'span', 'Date')}
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
              {E('dept', styles.hDEn, 'div', 'Department')}<br/>
              {E('ofc', '', 'div', 'Office')}<br/>
              {E('city', '', 'span', 'City')}{' – '}{E('pin', '', 'span', 'PIN')}<br/>
              <div className={styles.hideIfEmptyPrint}>{E('ph', '', 'div', 'Phone')}</div>
              <div className={styles.hideIfEmptyPrint}>{E('em', '', 'div', 'email')}</div>
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
              <span className={!form.fno?.trim() ? styles.hideIfEmptyPrint : ''}>
                {E('fno', '', 'span', 'F.No.')}
              </span>
              <span className={!addr?.trim() ? styles.hideIfEmptyPrint : ''}>{addr}</span>
            </>
          )}
          <span className={!form.dt?.trim() ? styles.hideIfEmptyPrint : ''}>
            {state.officeType === 'personal' ? '' : 'Dated: '}
            {E('dt', '', 'span', 'Date')}
          </span>
        </div>
      )}

      {/* Body */}
      <div className={styles.body}>
        {/* To block — each field is block-level inside a clear container */}
        {tpl !== 'E' && !isDoctor && (
          <div className={`${styles.toBlock} ${(!form.toD?.trim() && !form.toA?.trim()) ? styles.hideIfEmptyPrint : ''}`}>
            {!(state.officeType === 'personal' && (form.sal.toLowerCase().includes('dearest') || form.sal.toLowerCase().includes('darling') || form.sal.toLowerCase().includes('प्रियतम') || form.cls.toLowerCase().includes('forever') || form.sub.toLowerCase().includes('love') || form.sub.toLowerCase().includes('heart') || form.toD.toLowerCase().includes('love'))) && (
              <span className={styles.toLabel}>To</span>
            )}
            <div className={styles.toInner}>
              <div className={`${styles.toName} ${!form.toD?.trim() ? styles.hideIfEmptyPrint : ''}`}>
                <Editable
                  value={form.toD}
                  onChange={v => onFormChange('toD', v)}
                  tag="span"
                  placeholder={state.officeType === 'personal' ? "Recipient (e.g. The Postmaster)" : "Recipient Designation / Name"}
                  aiTick={tick}
                />
              </div>
              <div className={`${styles.toAddr} ${!form.toA?.trim() ? styles.hideIfEmptyPrint : ''}`}>
                <Editable
                  value={form.toA}
                  onChange={v => onFormChange('toA', v)}
                  tag="span"
                  placeholder="Recipient Office / Chamber Address"
                  aiTick={tick}
                  multiline
                />
              </div>
            </div>
          </div>
        )}

        {/* Subject */}
        <div className={`${styles.subBlock} ${!form.sub?.trim() ? styles.hideIfEmptyPrint : ''}`}>
          {isDoctor ? (
            <div className={styles.rxBadge}>℞</div>
          ) : (
            !(state.officeType === 'personal' && (form.sal.toLowerCase().includes('dearest') || form.sal.toLowerCase().includes('darling') || form.sal.toLowerCase().includes('प्रियतम') || form.cls.toLowerCase().includes('forever') || form.sub.toLowerCase().includes('love') || form.sub.toLowerCase().includes('heart') || form.toD.toLowerCase().includes('love'))) && (
              <span className={styles.subLabel}>Sub:</span>
            )
          )}
          {E('sub', styles.subText, 'span', isDoctor ? 'Diagnosis / Clinical Advice' : 'Subject')}
        </div>

        {/* Reference — only show if there IS a ref value */}
        {form.ref?.trim() && !isDoctor && (
          <div className={styles.refBlock}>
            <strong>Ref:</strong>{' '}
            <Editable
              value={form.ref}
              onChange={v => onFormChange('ref', v)}
              tag="span"
              placeholder="Reference / Prior Notice No."
              aiTick={tick}
            />
          </div>
        )}

        {/* Salutation */}
        {tpl !== 'E' && (
          <div className={`${styles.salBlock} ${!form.sal?.trim() ? styles.hideIfEmptyPrint : ''}`}>
            {E('sal', '', 'span', isDoctor ? 'Patient Advice:' : state.officeType === 'personal' ? 'My Dearest' : 'Sir/Madam')}
            {form.sal?.trim() ? ',' : ''}
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

        {/* Closing + Signature — right-aligned per GoI format */}
        {!(isPanchayat && form.sc?.trim()) ? (
          <div className={styles.closingAndSig}>
            <div className={`${styles.closingBlock} ${!form.cls?.trim() ? styles.hideIfEmptyPrint : ''}`}>
              <Editable
                value={form.cls}
                onChange={v => onFormChange('cls', v)}
                tag="span"
                placeholder={isDoctor ? "Consulting Physician" : state.officeType === 'personal' ? "Forever yours" : "Yours faithfully"}
                aiTick={tick}
              />
              {form.cls?.trim() ? ',' : ''}
            </div>
            <div className={styles.sigWrap}>
              <div className={styles.sigSpace}>
                {sigUrl && <img src={sigUrl} className={styles.sigImg} alt="signature" />}
              </div>
              <Editable value={form.sn} onChange={v => onFormChange('sn', v)} tag="div" className={`${styles.sigName} ${!form.sn?.trim() ? styles.hideIfEmptyPrint : ''}`} placeholder={state.officeType === 'personal' ? "Your Name" : "(Signatory Name)"} aiTick={tick} />
              {state.officeType !== 'personal' && (
                <>
                  <Editable value={form.sd} onChange={v => onFormChange('sd', v)} tag="div" className={`${styles.sigDesig} ${!form.sd?.trim() ? styles.hideIfEmptyPrint : ''}`} placeholder="Designation / Registration" aiTick={tick} />
                  <Editable value={form.dept} onChange={v => onFormChange('dept', v)} tag="div" className={`${styles.sigDept} ${!form.dept?.trim() ? styles.hideIfEmptyPrint : ''}`} placeholder="Department / Clinic" aiTick={tick} />
                </>
              )}
              {(form.sp?.trim() || form.em?.trim()) && state.officeType !== 'personal' && (
                <div className={styles.sigContact}>
                  {form.sp?.trim() && <Editable value={form.sp} onChange={v => onFormChange('sp', v)} tag="span" placeholder="Phone/Extn" aiTick={tick} />}
                  {form.sp?.trim() && form.em?.trim() ? '  |  ' : ''}
                  {form.em?.trim() && <Editable value={form.em} onChange={v => onFormChange('em', v)} tag="span" placeholder="email" aiTick={tick} />}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Dual Signatures for Gram Panchayat / Joint Authorities */
          <div className={styles.dualSigRow}>
            <div className={styles.dualSigBlock}>
              <div className={styles.sigSpace}>
                {sigUrl && <img src={sigUrl} className={styles.sigImg} alt="signature" />}
              </div>
              <div className={styles.dualSigLine} />
              <div className={styles.sigName}>{form.sn || 'ग्रामसेवक / सचिव'}</div>
              <div className={styles.sigDesig}>{form.sd || 'ग्रामपंचायत कार्यालय'}</div>
            </div>
            <div className={styles.dualSigBlock}>
              <div className={styles.sigSpace} />
              <div className={styles.dualSigLine} />
              <div className={styles.sigName}>{form.sc || 'सरपंच / अध्यक्ष'}</div>
              <div className={styles.sigDesig}>ग्रामपंचायत शिंदेवाडी</div>
            </div>
          </div>
        )}

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

      {/* Copy To */}
      {showCopy && (
        <div className={styles.copyBlock}>
          <div className={styles.copyHead}>Copy to:</div>
          <ol className={styles.copyList}>
            {(form.copyTo.length ? form.copyTo : ['']).map((item, i) => (
              <li
                key={`copy-${i}-${tick || 0}`}
                contentEditable
                suppressContentEditableWarning
                style={{ outline: 'none' }}
                onBlur={e => {
                  const updated = [...form.copyTo];
                  updated[i] = e.currentTarget.textContent || '';
                  onCopyChange(updated);
                }}
              >{item}</li>
            ))}
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
            <span style={{ fontSize: 10, opacity: 0.85 }}>Footer:</span>
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
                  {state.officeType === 'custom' 
                    ? (form.dept || '') 
                    : (form.dept ? (form.dept.toLowerCase().includes('government of india') ? form.dept : `${form.dept} · Government of India`) : 'Government of India')}
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
                  state.officeType === 'custom' ? form.dept : (form.dept ? (form.dept.toLowerCase().includes('government of india') ? form.dept : `${form.dept} · Government of India`) : 'Government of India'),
                  [form.city, form.pin ? `PIN: ${form.pin}` : ''].filter(Boolean).join(' – '),
                  [form.ph ? `Tel: ${form.ph}` : '', form.em, form.wb].filter(Boolean).join(' · ')
                ].filter(Boolean).join('   •   ')}
              </span>
            </div>
          ) : (
            <div className={styles.footerGrid}>
              <span className={styles.footerDept}>
                {state.officeType === 'custom' ? (
                  form.dept || ''
                ) : (
                  (form.dept || 'Government of India') + (form.dept && !form.dept.toLowerCase().includes('government of india') ? ' · Government of India' : '')
                )}
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

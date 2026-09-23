// ─────────────────────────────────────────────
//  components/letterpad/EditToolbar.tsx
// ─────────────────────────────────────────────
'use client';
import React from 'react';
import styles from './EditToolbar.module.css';

interface EditToolbarProps {
  showEncl: boolean;
  showCopy: boolean;
  showEndorse: boolean;
  showFooter?: boolean;
  onToggleEncl: () => void;
  onToggleCopy: () => void;
  onToggleEndorse: () => void;
  onToggleFooter?: () => void;
  onPrint: () => void;
  onPDF: () => void;
  onPNG?: () => void;
  onInsertNumberedPara?: () => void;
  isPersonal?: boolean;
  onTogglePersonal?: () => void;
  pdfBusy?: boolean;
  pngBusy?: boolean;
}

export default function EditToolbar({
  showEncl, showCopy, showEndorse, showFooter,
  onToggleEncl, onToggleCopy, onToggleEndorse, onToggleFooter,
  onPrint, onPDF, onPNG, onInsertNumberedPara, isPersonal, onTogglePersonal, pdfBusy, pngBusy
}: EditToolbarProps) {
  function cmd(command: string, value?: string) {
    document.execCommand(command, false, value);
  }
  function justify(a: string) {
    cmd('justify' + a.charAt(0).toUpperCase() + a.slice(1));
  }
  function setFontSize(sz: string) {
    if (!sz) return;
    cmd('fontSize', '7');
    document.querySelectorAll('[contenteditable] font[size="7"]').forEach((el) => {
      (el as HTMLElement).removeAttribute('size');
      (el as HTMLElement).style.fontSize = sz;
    });
  }
  function handleInsertPara() {
    if (onInsertNumberedPara) {
      onInsertNumberedPara();
      return;
    }
    const el = document.querySelector('[data-paper="true"] [contenteditable]') as HTMLElement | null;
    if (!el) return;
    const count = (el.textContent?.match(/(?:^|\n)\s*\d+\./g) || []).length + 1;
    cmd('insertText', `\n\n${count}. `);
  }
  function insertDate() {
    cmd('insertText', new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }));
  }

  return (
    <div className={styles.toolbar}>
      <span className={styles.label}>Edit</span>
      <button className={styles.btn} onClick={() => cmd('bold')}><b>B</b></button>
      <button className={styles.btn} onClick={() => cmd('italic')}><i>I</i></button>
      <button className={styles.btn} onClick={() => cmd('underline')}><u>U</u></button>
      <div className={styles.sep} />
      <button className={styles.btn} title="Left"    onClick={() => justify('left')}>⬅</button>
      <button className={styles.btn} title="Center"  onClick={() => justify('center')}>↔</button>
      <button className={styles.btn} title="Right"   onClick={() => justify('right')}>➡</button>
      <button className={styles.btn} title="Justify" onClick={() => justify('justify')}>☰</button>
      <div className={styles.sep} />
      <select className={styles.select} onChange={e => setFontSize(e.target.value)} defaultValue="">
        <option value="">Sz</option>
        {['11px','12px','13px','13.5px','14px','15px','16px','18px'].map(s => (
          <option key={s} value={s}>{s.replace('px','')}</option>
        ))}
      </select>
      <div className={styles.sep} />
      <button className={styles.btn} onClick={handleInsertPara} title="Insert numbered paragraph (¶)">¶</button>
      <button className={styles.btn} onClick={insertDate} title="Insert date">📅</button>
      <button className={styles.btn} onClick={() => cmd('removeFormat')} title="Clear formatting">🧹</button>
      <div className={styles.sep} />
      <button className={`${styles.btn} ${showEncl ? styles.btnOn : ''}`} onClick={onToggleEncl}>📎 Encl</button>
      <button className={`${styles.btn} ${showCopy ? styles.btnOn : ''}`} onClick={onToggleCopy}>📋 Copy</button>
      <button className={`${styles.btn} ${showEndorse ? styles.btnOn : ''}`} onClick={onToggleEndorse}>📝 Endorse</button>
      <div className={styles.sep} />
      {onTogglePersonal && (
        <button className={`${styles.btn} ${isPersonal ? styles.btnOn : ''}`} onClick={onTogglePersonal} title="Hide Official Header">
          🚫 Header
        </button>
      )}
      {onToggleFooter && (
        <button 
          className={`${styles.btn} ${showFooter !== false ? styles.btnOn : ''}`} 
          onClick={onToggleFooter} 
          title={showFooter !== false ? "Remove Footer" : "Show Footer"}
        >
          {showFooter !== false ? '📄 Footer' : '🚫 Footer'}
        </button>
      )}
      <div className={styles.sep} />
      <button className={styles.btn} onClick={onPrint} title="Print letter">🖨</button>
      {onPNG && (
        <button className={styles.btn} onClick={onPNG} disabled={pngBusy} title="Download PNG (High-Res Image)">
          {pngBusy ? '⏳' : '🖼 PNG'}
        </button>
      )}
      <button className={`${styles.btn} ${styles.btnPDF}`} onClick={onPDF} disabled={pdfBusy} title="Download Vector PDF">
        {pdfBusy ? '⏳' : '⬇ PDF'}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  components/letterpad/Appbar.tsx
// ─────────────────────────────────────────────
import React from 'react';
import Link from 'next/link';
import { PenTool } from 'lucide-react';
import styles from './Appbar.module.css';

interface AppbarProps {
  onPrint: () => void;
  onPDF: () => void;
  onPNG?: () => void;
  onToggleEndorse: () => void;
  onToggleCopy: () => void;
  lastModel?: string;
  pdfBusy?: boolean;
  pngBusy?: boolean;
}

export default function Appbar({ onPrint, onPDF, onPNG, onToggleEndorse, onToggleCopy, lastModel, pdfBusy, pngBusy }: AppbarProps) {
  // Shorten the model name for display — e.g. "llama-3.3-70b"
  const modelShort = lastModel
    ? lastModel.replace(/-versatile|-instant|-it|-preview/gi, '').replace('llama-', 'L').replace('gemma', 'G')
    : null;

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <PenTool size={16} strokeWidth={2.5} />
        </div>
        <div className={styles.brandText}>
          <div className={`${styles.name} ${styles.swalekhaniName}`}>Swalekhani</div>
          <div className={`${styles.name} ${styles.marathiName}`}>स्वलेखनी</div>
        </div>
        <div className={styles.tag}>🇮🇳 Gov Edition</div>
        {modelShort && (
          <div className={styles.modelBadge} title={`Last generated via: ${lastModel}`}>
            ⚡ {modelShort}
          </div>
        )}
      </div>

      <div className={styles.right}>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onToggleEndorse}>+ Endorse</button>
        <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onToggleCopy}>+ Copy To</button>
        <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnPrint}`} onClick={onPrint}>🖨 Print</button>
        {onPNG && (
          <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onPNG} disabled={pngBusy}>
            {pngBusy ? '⏳ PNG…' : '🖼 PNG'}
          </button>
        )}
        <button className={`${styles.btn} ${styles.btnSaffron}`} onClick={onPDF} disabled={pdfBusy}>{pdfBusy ? '⏳ Generating…' : '⬇ PDF'}</button>
      </div>
    </header>
  );
}

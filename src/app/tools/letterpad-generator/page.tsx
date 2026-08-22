// ─────────────────────────────────────────────
//  tools/letterpad-generator/page.tsx
// ─────────────────────────────────────────────
'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Appbar      from '@/components/letterpad/Appbar';
import Sidebar     from '@/components/letterpad/Sidebar';
import LetterPaper from '@/components/letterpad/LetterPaper';
import EditToolbar from '@/components/letterpad/EditToolbar';
import AIChatAssistant from '@/components/letterpad/AIChatAssistant';
import { useLetterState } from '@/hooks/useLetterState';
import type { LetterForm, LogoSide } from '@/types/letterpad';
import styles from './letterpad-page.module.css';

export default function LetterpadGeneratorPage() {
  const {
    state,
    updateForm,
    setForm,
    setTemplate,
    setFont,
    applyOfficePreset,
    setLogo,
    setLogoPos,
    setSigUrl,
    toggleEncl,
    toggleCopy,
    toggleEndorse,
    fillFromAI,
    lastModel,
  } = useLetterState();

  // ── Mobile tab: 'edit' | 'preview' ──────────
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('preview');
  const [isMobile, setIsMobile] = useState(false);

  // ── Responsive paper scale ───────────────────
  useEffect(() => {
    function updateScale() {
      const vw = window.innerWidth;
      const mobile = vw <= 900;
      setIsMobile(mobile);
      // Desktop: scale = 1, tablet: fit to available width, mobile: tighter
      let scale = 1;
      if (vw <= 480)       scale = Math.max(0.35, (vw - 12) / 794);
      else if (vw <= 640)  scale = Math.max(0.42, (vw - 16) / 794);
      else if (vw <= 900)  scale = Math.max(0.65, (vw - 32) / 794);
      document.documentElement.style.setProperty('--paper-scale', String(scale.toFixed(3)));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // ── PDF Generation — html2canvas + jsPDF for pixel-perfect output ──
  // This bypasses the browser print engine entirely. What you see in
  // preview is exactly what the PDF will contain — on ALL devices.
  const [pdfBusy, setPdfBusy] = useState(false);

  async function generatePDF() {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      // Dynamically import to keep bundle small
      // @ts-ignore - types not strictly needed for this usage
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Set body attribute so globals.css can hide UI artifacts
      document.body.setAttribute('data-generating-pdf', 'true');

      // Find the actual paper element via data attribute (reliable across CSS module builds)
      const paperEl = document.querySelector('[data-paper="true"]') as HTMLElement;
      if (!paperEl) { alert('Could not find paper element'); return; }

      // Temporarily reset scale so we capture at full 794px width
      const savedScale = document.documentElement.style.getPropertyValue('--paper-scale');
      document.documentElement.style.setProperty('--paper-scale', '1');

      // Wait a bit longer for iOS Safari to finish layout reflow
      await new Promise(r => setTimeout(r, 300));

      // Capture at 1.5x for crisp text without hitting iOS canvas memory limits
      const canvas = await html2canvas(paperEl, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false, // Must be false! true causes SecurityError on toDataURL in iOS Safari
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 794,
        logging: false,
      });

      // Restore scale
      document.documentElement.style.setProperty('--paper-scale', savedScale || '1');

      // A4 dimensions in mm
      const A4_W = 210;
      const A4_H = 297;
      const FOOTER_H = 18; // 18mm reserved for footer
      const CONTENT_H = A4_H - FOOTER_H; // 279mm height for content slice

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Calculate how many A4 pages the content spans
      const imgWidth = A4_W;
      const imgHeight = (canvas.height * A4_W) / canvas.width;

      const drawFooter = () => {
        const footerY = A4_H - 12; // 12mm from bottom
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, footerY - 5, A4_W, 20, 'F');
        pdf.setFontSize(9);
        pdf.setTextColor(110, 110, 110);
        const f1 = state.officeType === 'custom' ? state.form.dept : ((state.form.dept || 'Government of India') + ' · Government of India');
        const f2 = state.form.city + (state.form.pin ? ' – ' + state.form.pin : '');
        const f3 = state.form.wb;
        const txt = [f1, f2, f3].filter(Boolean).join('   •   ');
        pdf.text(txt, A4_W / 2, footerY, { align: 'center' });
      };

      // If content fits in one page (leaving room for footer), just place it
      if (imgHeight <= CONTENT_H) {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        drawFooter();
      } else {
        // Multi-page: slice the canvas into CONTENT_H chunks instead of full A4_H chunks
        // This ensures the slice never reaches the bottom 18mm where the footer goes!
        const sliceHeightPx = (CONTENT_H / A4_W) * canvas.width;
        const totalPages = Math.ceil(canvas.height / sliceHeightPx);

        for (let i = 0; i < totalPages; i++) {
          if (i > 0) pdf.addPage();

          // Create a slice canvas for this page
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          const sliceH = Math.min(sliceHeightPx, canvas.height - i * sliceHeightPx);
          sliceCanvas.height = sliceH;

          const ctx = sliceCanvas.getContext('2d')!;
          ctx.drawImage(
            canvas,
            0, i * sliceHeightPx,           // source x, y
            canvas.width, sliceH,            // source w, h
            0, 0,                            // dest x, y
            canvas.width, sliceH             // dest w, h
          );

          const sliceData = sliceCanvas.toDataURL('image/png');
          const sliceMMHeight = (sliceH * A4_W) / canvas.width;
          pdf.addImage(sliceData, 'PNG', 0, 0, imgWidth, sliceMMHeight);
          drawFooter();
        }
      }

      // Save — triggers download on iOS and desktop alike
      pdf.save('letter.pdf');
    } catch (err: any) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed: ' + (err?.message || String(err)) + '\nFalling back to browser print.');
      window.print();
    } finally {
      document.body.removeAttribute('data-generating-pdf');
      setPdfBusy(false);
    }
  }

  // Native print (still available for desktop users who prefer it)
  function doPrint() {
    document.documentElement.style.setProperty('--paper-scale', '1');
    window.print();
    setTimeout(() => {
      const vw = window.innerWidth;
      let scale = 1;
      if (vw <= 480)       scale = Math.max(0.35, (vw - 12) / 794);
      else if (vw <= 640)  scale = Math.max(0.42, (vw - 16) / 794);
      else if (vw <= 900)  scale = Math.max(0.65, (vw - 32) / 794);
      document.documentElement.style.setProperty('--paper-scale', String(scale.toFixed(3)));
    }, 800);
  }

  const handleLogoPos = useCallback((side: LogoSide, pos: object) => {
    setLogoPos(side, pos as Parameters<typeof setLogoPos>[1]);
  }, [setLogoPos]);

  const handleFormChange = useCallback((key: keyof LetterForm, value: string) => {
    updateForm(key, value);
  }, [updateForm]);

  return (
    <div className={styles.letterpadRoot}>
      {/* Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600&family=Tiro+Devanagari+Hindi:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
        rel="stylesheet"
      />

      <Appbar
        onPrint={doPrint}
        onPDF={generatePDF}
        onToggleEndorse={toggleEndorse}
        onToggleCopy={toggleCopy}
        lastModel={lastModel}
        pdfBusy={pdfBusy}
      />

      {/* ── Mobile tab bar ── */}
      {isMobile && (
        <div className={styles.mobileTabBar}>
          <button
            className={`${styles.mobileTab} ${mobileTab === 'edit' ? styles.mobileTabActive : ''}`}
            onClick={() => setMobileTab('edit')}
          >✏️ Edit</button>
          <button
            className={`${styles.mobileTab} ${mobileTab === 'preview' ? styles.mobileTabActive : ''}`}
            onClick={() => setMobileTab('preview')}
          >📄 Preview</button>
          {/* Print & PDF accessible on mobile too */}
          <button className={styles.mobileTabPrint} onClick={doPrint}>🖨 Print</button>
          <button className={`${styles.mobileTabPrint} ${styles.mobileTabPDF}`} onClick={doPrint}>⬇ PDF</button>
        </div>
      )}

      <div className={`${styles.workspace} ${isMobile ? styles.workspaceMobile : ''}`}>

        {/* ── SIDEBAR ── */}
        <div className={`${styles.sidebarCol} ${isMobile && mobileTab !== 'edit' ? styles.hidden : ''}`}>
          <Sidebar
            state={state}
            onUpdateForm={updateForm}
            onTemplate={setTemplate}
            onFont={setFont}
            onOffice={applyOfficePreset}
            onLogo={setLogo}
            onSigApply={setSigUrl}
            onFillAI={fillFromAI}
            onToggleEncl={toggleEncl}
            onToggleCopy={toggleCopy}
            onToggleEndorse={toggleEndorse}
          />
        </div>

        {/* ── PREVIEW AREA ── */}
        <main className={`${styles.preview} ${isMobile && mobileTab !== 'preview' ? styles.hidden : ''}`}>
          {/* Toolbar row */}
          <div className={`${styles.previewTop} ${isMobile ? styles.previewTopMobile : ''}`}>
            {!isMobile && (
              <span className={styles.previewLabel}>
                📄 A4 · Click paper to edit · AI fills all fields · Groq powered
                {lastModel && <> · <span style={{color:'#4ade80'}}>⚡ {lastModel}</span></>}
              </span>
            )}
            <EditToolbar
              showEncl={state.showEncl}
              showCopy={state.showCopy}
              showEndorse={state.showEndorse}
              onToggleEncl={toggleEncl}
              onToggleCopy={toggleCopy}
              onToggleEndorse={toggleEndorse}
              isPersonal={state.officeType === 'personal'}
              onTogglePersonal={() => applyOfficePreset(state.officeType === 'personal' ? 'custom' : 'personal')}
              onPrint={doPrint}
              onPDF={generatePDF}
              pdfBusy={pdfBusy}
            />
          </div>

          {/* Paper */}
          <div className={styles.paperWrap} id="print-area">
            <div className={styles.paperInner}>
              <LetterPaper
                state={state}
                onFormChange={handleFormChange}
                onCopyChange={val => updateForm('copyTo', val)}
                onLogoPos={handleLogoPos}
                onLogoRemove={side => setLogo(side, null)}
              />
            </div>
          </div>
        </main>
      </div>
      
      <AIChatAssistant state={state} onSetForm={setForm} onFillAI={fillFromAI} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  tools/letterpad-generator/page.tsx
// ─────────────────────────────────────────────
'use client';
import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Appbar      from '@/components/letterpad/Appbar';
import Sidebar     from '@/components/letterpad/Sidebar';
import LetterPaper from '@/components/letterpad/LetterPaper';
import EditToolbar from '@/components/letterpad/EditToolbar';
import AIChatAssistant from '@/components/letterpad/AIChatAssistant';
import SoftwareAppSchema from '@/components/seo/SoftwareAppSchema';
import { useLetterState } from '@/hooks/useLetterState';
import { PROFESSION_TEMPLATES } from '@/data/profession-templates';
import type { LetterForm, LogoSide, TemplateType } from '@/types/letterpad';
import styles from './letterpad-page.module.css';

function LetterpadGeneratorInner() {
  const searchParams = useSearchParams();
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
    toggleFooter,
    setFooterDesign,
    fillFromAI,
    lastModel,
  } = useLetterState();

  // ── Initialize from Search Parameters (Templates / Deep links) ──
  useEffect(() => {
    if (!searchParams) return;
    const preset = searchParams.get('preset');
    const templateParam = searchParams.get('template') || searchParams.get('tpl');
    const sub = searchParams.get('sub') || searchParams.get('subject');
    const body = searchParams.get('body');
    const toD = searchParams.get('toD') || searchParams.get('to');
    const toA = searchParams.get('toA');
    const fno = searchParams.get('fno') || searchParams.get('file_no');
    const h1Param = searchParams.get('h1');
    const h2Param = searchParams.get('h2');
    const ofcParam = searchParams.get('ofc');
    const phParam = searchParams.get('ph');
    const emParam = searchParams.get('em');

    if (preset) {
      applyOfficePreset(preset);
    }

    if (templateParam) {
      const lower = templateParam.toLowerCase();
      const upper = templateParam.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E', 'F'].includes(upper)) {
        setTemplate(upper as TemplateType);
      } else if (PROFESSION_TEMPLATES[lower]) {
        const prof = PROFESSION_TEMPLATES[lower];
        const sample = prof.sampleLetters[0];

        // Specific clean signatory defaults
        let defaultSignatory = prof.fields.find(f => f.id === 'name')?.defaultValue || '';
        let defaultDesig = prof.fields.find(f => f.id === 'subTitle' || f.id === 'qualifications' || f.id === 'designation')?.defaultValue || prof.profession;

        if (lower === 'clinic') {
          defaultSignatory = 'Dr. Aarav Sharma, MBBS, MD (Med)';
          defaultDesig = 'Consulting Physician & Medical Director';
        } else if (lower === 'political-leader') {
          defaultSignatory = 'Shri Amit V. Deshmukh';
          defaultDesig = 'Public Representative / Member, Municipal Council';
        }

        const regField = prof.fields.find(f => 
          f.id === 'enrolmentNo' || 
          f.id === 'regNo' || 
          f.id === 'membershipNo' || 
          f.id === 'reraNo' || 
          f.id === 'ceaNo' || 
          f.id === 'trustReg'
        );

        const initialForm: Partial<LetterForm> = {
          e1: prof.fields.find(f => f.id === 'name')?.defaultValue || prof.profession,
          e2: prof.fields.find(f => f.id === 'subTitle' || f.id === 'qualifications' || f.id === 'designation')?.defaultValue || '',
          ofc: prof.fields.find(f => f.id === 'address' || f.id === 'chamberAddress' || f.id === 'officeAddress' || f.id === 'branchAddress')?.defaultValue || '',
          ph: prof.fields.find(f => f.id === 'phone')?.defaultValue || '',
          em: prof.fields.find(f => f.id === 'email')?.defaultValue || '',
          enrolmentNo: regField?.defaultValue || '',
          sn: defaultSignatory,
          sd: defaultDesig,
        };

        if (prof.theme.font === 'serif') {
          setFont('fs');
        } else if (prof.theme.font === 'mono') {
          setFont('fn');
        }

        if (sample) {
          initialForm.sub = sample.subject;
          initialForm.body = sample.body.join('\n\n');
          initialForm.toD = sample.recipient.replace(/^To,\s*\n?/i, '');
          initialForm.fno = sample.fileNo || '';
        }

        // Apply preset office type styling
        applyOfficePreset(lower);
        setForm(initialForm, true);
      }
    }

    if (sub || body || toD || toA || fno || h1Param || h2Param || ofcParam || phParam || emParam) {
      const updates: Partial<LetterForm> = {};
      if (sub) updates.sub = sub;
      if (body) updates.body = body;
      if (toD) updates.toD = toD.replace(/^To,\s*\n?/i, '');
      if (toA) updates.toA = toA;
      if (fno) updates.fno = fno;
      if (h1Param) updates.h1 = h1Param;
      if (h2Param) updates.h2 = h2Param;
      if (ofcParam) updates.ofc = ofcParam;
      if (phParam) updates.ph = phParam;
      if (emParam) updates.em = emParam;
      setForm(updates, true);
    }
  }, [searchParams, applyOfficePreset, setTemplate, setFont, setForm]);

  // ── Mobile tab: 'edit' | 'preview' ──────────
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('preview');
  const [isMobile, setIsMobile] = useState(false);

  // ── Responsive paper scale ───────────────────
  useEffect(() => {
    function updateScale() {
      const vw = window.innerWidth;
      const mobile = vw <= 900;
      setIsMobile(mobile);
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

  // ── Insert Numbered Paragraph (Defect B Fix) ──
  const handleInsertNumberedPara = useCallback(() => {
    const existing = state.form.body || '';
    const matches = existing.match(/(?:^|\n)\s*(\d+)\.\s*/g);
    let nextNum = 1;
    if (matches && matches.length > 0) {
      const nums = matches.map(m => parseInt(m.replace(/\D/g, ''), 10)).filter(n => !isNaN(n));
      if (nums.length > 0) {
        nextNum = Math.max(...nums) + 1;
      }
    }
    const paraPrefix = existing.trim().length === 0 ? `${nextNum}. ` : `\n\n${nextNum}. `;
    const updatedBody = existing + paraPrefix;
    updateForm('body', updatedBody);
  }, [state.form.body, updateForm]);

  // ── PNG Download (Defect C Fix) ──────────────
  const [pngBusy, setPngBusy] = useState(false);

  async function generatePNG() {
    if (pngBusy) return;
    setPngBusy(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      document.body.setAttribute('data-generating-pdf', 'true');

      const paperEl = document.querySelector('[data-paper="true"]') as HTMLElement;
      if (!paperEl) { alert('Could not find paper element'); return; }

      const emptyNodes = paperEl.querySelectorAll('[class*="editable"]');
      const markedNodes: HTMLElement[] = [];
      emptyNodes.forEach(node => {
        const el = node as HTMLElement;
        if (!el.textContent || !el.textContent.trim()) {
          el.setAttribute('data-empty', 'true');
          markedNodes.push(el);
        }
      });

      const savedScale = document.documentElement.style.getPropertyValue('--paper-scale');
      document.documentElement.style.setProperty('--paper-scale', '1');
      await new Promise(r => setTimeout(r, 250));

      const canvas = await html2canvas(paperEl, {
        scale: 2, // High resolution (300 DPI equivalent)
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 794,
        logging: false,
      });

      document.documentElement.style.setProperty('--paper-scale', savedScale || '1');
      markedNodes.forEach(el => el.removeAttribute('data-empty'));

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'swalekhani-letterhead.png';
      link.href = imgData;
      link.click();
    } catch (err: any) {
      console.error('PNG export failed:', err);
      alert('PNG export failed: ' + (err?.message || String(err)));
    } finally {
      document.body.removeAttribute('data-generating-pdf');
      const leftovers = document.querySelectorAll('[data-empty="true"]');
      leftovers.forEach(el => el.removeAttribute('data-empty'));
      setPngBusy(false);
    }
  }

  // ── PDF Generation — html2canvas + jsPDF ──────
  const [pdfBusy, setPdfBusy] = useState(false);

  async function generatePDF() {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      document.body.setAttribute('data-generating-pdf', 'true');

      const paperEl = document.querySelector('[data-paper="true"]') as HTMLElement;
      if (!paperEl) { alert('Could not find paper element'); return; }

      const emptyNodes = paperEl.querySelectorAll('[class*="editable"]');
      const markedNodes: HTMLElement[] = [];
      emptyNodes.forEach(node => {
        const el = node as HTMLElement;
        if (!el.textContent || !el.textContent.trim()) {
          el.setAttribute('data-empty', 'true');
          markedNodes.push(el);
        }
      });

      const savedScale = document.documentElement.style.getPropertyValue('--paper-scale');
      document.documentElement.style.setProperty('--paper-scale', '1');
      await new Promise(r => setTimeout(r, 300));

      const canvas = await html2canvas(paperEl, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 794,
        logging: false,
      });

      document.documentElement.style.setProperty('--paper-scale', savedScale || '1');
      markedNodes.forEach(el => el.removeAttribute('data-empty'));

      const A4_W = 210;
      const A4_H = 297;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgHeight = (canvas.height * A4_W) / canvas.width;

      if (imgHeight <= A4_H + 2) {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, A4_W, A4_H);
      } else {
        const pageHeightPx = (A4_H / A4_W) * canvas.width;
        const totalPages = Math.ceil(canvas.height / pageHeightPx);

        for (let i = 0; i < totalPages; i++) {
          if (i > 0) pdf.addPage();
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          const sliceH = Math.min(pageHeightPx, canvas.height - i * pageHeightPx);
          sliceCanvas.height = pageHeightPx;

          const ctx = sliceCanvas.getContext('2d')!;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, sliceCanvas.width, pageHeightPx);

          ctx.drawImage(
            canvas,
            0, i * pageHeightPx,
            canvas.width, sliceH,
            0, 0,
            canvas.width, sliceH
          );

          const sliceData = sliceCanvas.toDataURL('image/png');
          pdf.addImage(sliceData, 'PNG', 0, 0, A4_W, A4_H);
        }
      }

      pdf.save('letter.pdf');
    } catch (err: any) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed: ' + (err?.message || String(err)) + '\nFalling back to browser print.');
      window.print();
    } finally {
      document.body.removeAttribute('data-generating-pdf');
      const leftovers = document.querySelectorAll('[data-empty="true"]');
      leftovers.forEach(el => el.removeAttribute('data-empty'));
      setPdfBusy(false);
    }
  }

  // Native print
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
        onPNG={generatePNG}
        onToggleEndorse={toggleEndorse}
        onToggleCopy={toggleCopy}
        lastModel={lastModel}
        pdfBusy={pdfBusy}
        pngBusy={pngBusy}
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
          <button className={styles.mobileTabPrint} onClick={doPrint}>🖨 Print</button>
          <button className={`${styles.mobileTabPrint} ${styles.mobileTabPDF}`} onClick={generatePNG} disabled={pngBusy}>🖼 PNG</button>
          <button className={`${styles.mobileTabPrint} ${styles.mobileTabPDF}`} onClick={generatePDF} disabled={pdfBusy}>⬇ PDF</button>
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
            onToggleFooter={toggleFooter}
            onFooterDesign={setFooterDesign}
          />
        </div>

        {/* ── PREVIEW AREA ── */}
        <main className={`${styles.preview} ${isMobile && mobileTab !== 'preview' ? styles.hidden : ''}`}>
          {/* Toolbar row */}
          <div className={`${styles.previewTop} ${isMobile ? styles.previewTopMobile : ''}`}>
            {!isMobile && (
              <span className={styles.previewLabel}>
                📄 A4 · Live Inline Editor · Real-time Sidebar Binding · Groq AI
                {lastModel && <> · <span style={{color:'#4ade80'}}>⚡ {lastModel}</span></>}
              </span>
            )}
            <EditToolbar
              showEncl={state.showEncl}
              showCopy={state.showCopy}
              showEndorse={state.showEndorse}
              showFooter={state.showFooter !== undefined ? state.showFooter : state.officeType !== 'personal'}
              onToggleEncl={toggleEncl}
              onToggleCopy={toggleCopy}
              onToggleEndorse={toggleEndorse}
              onToggleFooter={toggleFooter}
              isPersonal={state.officeType === 'personal'}
              onTogglePersonal={() => applyOfficePreset(state.officeType === 'personal' ? 'custom' : 'personal')}
              onPrint={doPrint}
              onPDF={generatePDF}
              onPNG={generatePNG}
              onInsertNumberedPara={handleInsertNumberedPara}
              pdfBusy={pdfBusy}
              pngBusy={pngBusy}
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
                onToggleFooter={toggleFooter}
                onFooterDesign={setFooterDesign}
              />
            </div>
          </div>
        </main>
      </div>
      
      <AIChatAssistant state={state} onSetForm={setForm} onFillAI={fillFromAI} />
      <SoftwareAppSchema />
    </div>
  );
}

export default function LetterpadGeneratorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090f] text-white flex items-center justify-center font-sans">Loading Swalekhani Studio...</div>}>
      <LetterpadGeneratorInner />
    </Suspense>
  );
}

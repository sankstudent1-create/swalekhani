// ─────────────────────────────────────────────
//  hooks/useLetterState.ts  –  Central state for the letterpad
// ─────────────────────────────────────────────
'use client';
import { useState, useCallback } from 'react';
import type { AppState, LetterForm, TemplateType, FontClass, LogoSide, SigMode, AILetterData } from '@/types/letterpad';
import { DEFAULT_FORM, DEFAULT_LOGO_POS, OFFICE_PRESETS, svgToDataUri } from '@/lib/letterpad/constants';

const INITIAL_STATE: AppState = {
  tpl: 'A',
  font: '',
  officeType: 'dop',
  logoL: null,
  logoR: null,
  posL: { ...DEFAULT_LOGO_POS, x: 42, y: 48, w: 96 },
  posR: { ...DEFAULT_LOGO_POS, x: 656, y: 48, w: 96 },
  sigUrl: null,
  sigMode: 'draw',
  showEncl: false,
  showCopy: false,
  showEndorse: false,
  form: { ...DEFAULT_FORM },
};

export function useLetterState() {
  const [state, setState] = useState<AppState>(() => {
    const dt = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    return { ...INITIAL_STATE, form: { ...DEFAULT_FORM, dt } };
  });
  const [lastModel, setLastModel] = useState<string | undefined>(undefined);

  // ── Form field update ────────────────────────────────
  const updateForm = useCallback(<K extends keyof LetterForm>(key: K, value: LetterForm[K]) => {
    setState(s => ({ ...s, form: { ...s.form, [key]: value } }));
  }, []);

  const setForm = useCallback((form: Partial<LetterForm>, bumpTick: boolean = false) => {
    setState(s => ({ 
      ...s, 
      form: { ...s.form, ...form },
      ...(bumpTick ? { aiTick: (s.aiTick || 0) + 1 } : {})
    }));
  }, []);

  // ── Template ─────────────────────────────────────────
  const setTemplate = useCallback((tpl: TemplateType) => {
    setState(s => ({ ...s, tpl }));
  }, []);

  // ── Font ─────────────────────────────────────────────
  const setFont = useCallback((font: FontClass) => {
    setState(s => ({ ...s, font }));
  }, []);

  // ── Office preset ────────────────────────────────────
  const applyOfficePreset = useCallback((type: string) => {
    const preset = OFFICE_PRESETS[type];
    if (!preset) return;

    const logoL = preset.ll ? svgToDataUri(preset.ll) : null;
    const logoR = preset.lr ? svgToDataUri(preset.lr) : null;

    setState(s => ({
      ...s,
      officeType: type as AppState['officeType'],
      tpl: preset.t,
      logoL,
      logoR,
      posR: { ...s.posR, placed: false }, // trigger auto-placement
      form: {
        ...s.form,
        h1: preset.h1, h2: preset.h2,
        e1: preset.e1, e2: preset.e2,
        dept: preset.dept, divn: preset.divn,
        ofc: preset.ofc, city: preset.city, pin: preset.pin,
        ph: preset.ph, em: preset.em, wb: preset.wb,
      },
    }));
  }, []);

  // ── Logos ─────────────────────────────────────────────
  const setLogo = useCallback((side: LogoSide, src: string | null) => {
    if (side === 'L') setState(s => ({ ...s, logoL: src }));
    else setState(s => ({ ...s, logoR: src, posR: { ...s.posR, placed: false } }));
  }, []);

  const setLogoPos = useCallback((side: LogoSide, pos: Partial<AppState['posL']>) => {
    if (side === 'L') setState(s => ({ ...s, posL: { ...s.posL, ...pos } }));
    else setState(s => ({ ...s, posR: { ...s.posR, ...pos } }));
  }, []);

  // ── Signature ─────────────────────────────────────────
  const setSigUrl = useCallback((url: string | null) => {
    setState(s => ({ ...s, sigUrl: url }));
  }, []);

  const setSigMode = useCallback((mode: SigMode) => {
    setState(s => ({ ...s, sigMode: mode }));
  }, []);

  // ── Section toggles ───────────────────────────────────
  const toggleEncl    = useCallback(() => setState(s => ({ ...s, showEncl:    !s.showEncl })), []);
  const toggleCopy    = useCallback(() => setState(s => ({ ...s, showCopy:    !s.showCopy })), []);
  const toggleEndorse = useCallback(() => setState(s => ({ ...s, showEndorse: !s.showEndorse })), []);

  // ── AI fill — populates fields from AI response ───
  const fillFromAI = useCallback((data: AILetterData, isFull: boolean = false, model?: string) => {
    if (model) setLastModel(model);

    setState(s => {
      const detectedType = (data.detected_type || data.letter_type || '').toLowerCase();
      const isPersonal = data.is_personal === true || 
        ['personal', 'romantic', 'student_app', 'heritage_personal', 'citizen_app'].includes(detectedType);

      let newLogoL = isFull ? null : s.logoL;
      let newLogoR = isFull ? null : s.logoR;
      let targetTpl = s.tpl;

      if (isPersonal) {
        newLogoL = null;
        newLogoR = null;
        targetTpl = 'A';
      } else if (isFull) {
        if (detectedType === 'om') {
          targetTpl = 'E'; // CSMOP Office Memorandum layout
          newLogoL = null;
          newLogoR = svgToDataUri('ashoka');
        } else if (detectedType === 'do') {
          targetTpl = 'B'; // Demi-Official layout
          newLogoL = svgToDataUri('ashoka');
          newLogoR = null;
        } else {
          const fullDeptStr = [
            data.department, data.dept,
            data.dept_english_1, data.e1,
            data.dept_english_2, data.e2
          ].filter(Boolean).join(' ').toLowerCase();

          if (fullDeptStr.includes('post') || fullDeptStr.includes('dak') || fullDeptStr.includes('mail')) {
            newLogoL = svgToDataUri('ip');
            newLogoR = svgToDataUri('ashoka');
          } else if (fullDeptStr.includes('prime minister') || fullDeptStr.includes('pm ')) {
            newLogoL = svgToDataUri('ashoka');
            newLogoR = null;
          } else if (fullDeptStr.includes('parliament') || fullDeptStr.includes('sansad')) {
            newLogoL = svgToDataUri('sansad');
            newLogoR = svgToDataUri('ashoka');
          } else if (fullDeptStr.includes('maharashtra')) {
            newLogoL = svgToDataUri('mh');
            newLogoR = null;
          } else if (fullDeptStr.includes('government of india') || fullDeptStr.includes('ministry') || fullDeptStr.includes('department')) {
            newLogoL = null;
            newLogoR = svgToDataUri('ashoka');
          }
        }
      }

      const enclVal = data.encl ?? (Array.isArray(data.enclList) ? data.enclList.join(', ') : '');
      const copyVal = (data.copyList && data.copyList.length ? data.copyList : (data.copy_to && data.copy_to.length ? data.copy_to : []));

      return {
        ...s,
        tpl: targetTpl,
        officeType: isPersonal ? 'personal' : (isFull ? 'custom' : s.officeType),
        logoL: newLogoL,
        logoR: newLogoR,
        showEncl: isPersonal ? false : (enclVal.trim().length > 0),
        showCopy: isPersonal ? false : (copyVal.length > 0),
        showEndorse: false,
        form: {
          ...s.form,
          h1: isPersonal ? '' : (isFull ? (data.h1 ?? data.dept_hindi_1 ?? '') : (data.h1 ?? data.dept_hindi_1 ?? s.form.h1)),
          h2: isPersonal ? '' : (isFull ? (data.h2 ?? data.dept_hindi_2 ?? '') : (data.h2 ?? data.dept_hindi_2 ?? s.form.h2)),
          e1: isPersonal ? '' : (isFull ? (data.e1 ?? data.dept_english_1 ?? '') : (data.e1 ?? data.dept_english_1 ?? s.form.e1)),
          e2: isPersonal ? '' : (isFull ? (data.e2 ?? data.dept_english_2 ?? '') : (data.e2 ?? data.dept_english_2 ?? s.form.e2)),
          dept: isPersonal ? '' : (isFull ? (data.dept ?? data.department ?? '') : (data.dept ?? data.department ?? s.form.dept)),
          divn: isPersonal ? '' : (isFull ? (data.divn ?? data.division ?? '') : (data.divn ?? data.division ?? s.form.divn)),
          ofc:  isPersonal ? '' : (isFull ? (data.ofc ?? data.office ?? '') : (data.ofc ?? data.office ?? s.form.ofc)),
          city: data.city !== undefined ? data.city : (isPersonal ? '' : (isFull ? '' : s.form.city)),
          pin:  data.pin !== undefined ? data.pin : (isPersonal ? '' : (isFull ? '' : s.form.pin)),
          ph:   isPersonal ? '' : (data.ph ?? data.phone ?? (isFull ? '' : s.form.ph)),
          em:   isPersonal ? '' : (data.em ?? data.email ?? (isFull ? '' : s.form.em)),
          wb:   isPersonal ? '' : (data.wb ?? data.website ?? (isFull ? '' : s.form.wb)),
          fno:  isPersonal ? '' : (data.fno ?? data.file_no ?? (isFull ? '' : s.form.fno)),
          toD:  data.toD ?? data.to_designation ?? (isFull ? '' : s.form.toD),
          toA:  data.toA ?? data.to_address ?? (isFull ? '' : s.form.toA),
          sub:  data.sub ?? data.subject ?? (isFull ? '' : s.form.sub),
          ref:  isPersonal ? '' : (data.ref ?? data.reference ?? (isFull ? '' : s.form.ref)),
          sal:  data.sal ?? data.salutation ?? '',
          cls:  data.cls ?? data.closing ?? '',
          sn:   data.sn ?? data.signatory_name ?? (isFull ? '' : s.form.sn),
          sd:   isPersonal ? '' : (data.sd ?? data.signatory_designation ?? (isFull ? '' : s.form.sd)),
          body: data.body ?? (isFull ? '' : s.form.body),
          encl: isPersonal ? '' : (enclVal || (isFull ? '' : s.form.encl)),
          copyTo: isPersonal ? [] : (copyVal.length > 0 ? copyVal : (isFull ? [] : s.form.copyTo)),
        },
        aiTick: (s.aiTick || 0) + 1,
      };
    });
  }, []);

  return {
    state,
    lastModel,
    updateForm,
    setForm,
    setTemplate,
    setFont,
    applyOfficePreset,
    setLogo,
    setLogoPos,
    setSigUrl,
    setSigMode,
    toggleEncl,
    toggleCopy,
    toggleEndorse,
    fillFromAI,
  };
}

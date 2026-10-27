// ─────────────────────────────────────────────
//  hooks/useLetterState.ts  –  Central state for the letterpad
// ─────────────────────────────────────────────
'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { AppState, LetterForm, TemplateType, FontClass, LogoSide, SigMode, AILetterData } from '@/types/letterpad';
import { DEFAULT_FORM, DEFAULT_LOGO_POS, OFFICE_PRESETS, svgToDataUri } from '@/lib/letterpad/constants';

const DRAFT_KEY = 'swalekhani-studio-draft-v1';

const INITIAL_STATE: AppState = {
  tpl: 'A',
  font: '',
  officeType: 'corporate',
  logoL: null,
  logoR: null,
  posL: { ...DEFAULT_LOGO_POS, x: 42, y: 48, w: 96 },
  posR: { ...DEFAULT_LOGO_POS, x: 656, y: 48, w: 96 },
  sigUrl: null,
  sigMode: 'draw',
  showEncl: false,
  showCopy: false,
  showEndorse: false,
  showFooter: true,
  footerDesign: 'classic',
  form: { ...DEFAULT_FORM },
};

export function useLetterState() {
  const [state, setState] = useState<AppState>(() => {
    const dt = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    return { ...INITIAL_STATE, form: { ...DEFAULT_FORM, dt } };
  });
  const [lastModel, setLastModel] = useState<string | undefined>(undefined);
  const [draftStatus, setDraftStatus] = useState<'fresh' | 'restored' | 'saved'>('fresh');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSave = useRef(true); // skip the initial mount save

  // ── Restore draft once on mount (unless a template/preset deep-link is used) ──
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const hasDeepLink = q.get('preset') || q.get('template') || q.get('tpl');
      if (hasDeepLink) return;
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft && typeof draft === 'object' && draft.form) {
        setState(s => ({ ...s, ...draft, form: { ...s.form, ...draft.form } }));
        setDraftStatus('restored');
      }
    } catch { /* corrupted draft — start fresh */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Autosave draft (debounced; logos/signatures excluded to stay under quota) ──
  useEffect(() => {
    if (skipNextSave.current) { skipNextSave.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const { logoL, logoR, sigUrl, ...rest } = state;
        void logoL; void logoR; void sigUrl;
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
        setDraftStatus('saved');
      } catch { /* quota or privacy mode — stay silent */ }
    }, 1200);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state]);

  const clearDraft = useCallback(() => {
    try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
    setDraftStatus('fresh');
  }, []);

  // ── Start a fresh letter (clears draft + resets state) ──
  // Defensive hardening (see audit note in the report): clear any
  // pending autosave timer, bump aiTick so inline-editable paper fields
  // re-sync even if one was focused, and clear the old model badge.
  // The autosave effect's own cleanup already clears a pending timer
  // on state change, so this is belt-and-braces, not the sole fix.
  const resetLetter = useCallback(() => {
    try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    const dt = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    setState(s => ({ ...INITIAL_STATE, form: { ...DEFAULT_FORM, dt }, aiTick: (s.aiTick || 0) + 1 }));
    setLastModel(undefined);
    setDraftStatus('fresh');
  }, []);

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
      showFooter: type !== 'personal',
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
  const toggleFooter  = useCallback(() => setState(s => {
    const current = s.showFooter !== undefined ? s.showFooter : s.officeType !== 'personal';
    return { ...s, showFooter: !current };
  }), []);
  const setFooterDesign = useCallback((footerDesign: AppState['footerDesign']) => {
    setState(s => ({ ...s, footerDesign }));
  }, []);

  // ── AI fill — populates fields from AI response ───
  // Preserve rule (fixes the "Generate wiped my office details" bug):
  // the AI client maps every missing field to '' (see aiService.ts),
  // so `??` never falls back — an omitted field used to overwrite a
  // filled field with ''. Now a field is replaced ONLY when the AI
  // explicitly supplies a non-blank value; otherwise the existing
  // non-empty value survives, in both Body-Only and Full modes.
  // Personal letters still clear masthead fields on purpose.
  const fillFromAI = useCallback((data: AILetterData, isFull: boolean = false, model?: string) => {
    if (model) setLastModel(model);

    const has = (v?: string | null) => Boolean(v?.trim());
    const keep = (ai: string | undefined, cur: string) => has(ai) ? ai as string : cur;
    const stripLeadingSalutation = (body: string, sal: string) => {
      if (!body) return body;
      const lines = body.split('\n');
      const first = lines[0].trim();
      const salText = sal.trim().replace(/,+\s*$/, '');
      const isSalLine =
        (Boolean(salText) && first.replace(/,+\s*$/, '').toLowerCase() === salText.toLowerCase()) ||
        /^(dear\s+[^,\n]{1,60},|sir,|madam,|sir\/madam,|महोदय,?|महोदया,?|आदरणीय\s+[^,\n]{1,60},?|respected\s+[^,\n]{1,60},?)$/i.test(first);
      return isSalLine ? lines.slice(1).join('\n').replace(/^\n+/, '') : body;
    };

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
        // Corporate refocus: no automatic emblem assignment.
        // Government emblems (ashoka/ip/sansad/mh) removed — logos stay
        // cleared on full AI fills; users upload their own branding.
      }

      const aiEncl = data.encl ?? (Array.isArray(data.enclList) ? data.enclList.join(', ') : '');
      const aiCopy = (data.copyList && data.copyList.length ? data.copyList : (data.copy_to && data.copy_to.length ? data.copy_to : []));
      // The user's chosen salutation survives unless the AI supplies one.
      const salVal = keep(data.sal ?? data.salutation, s.form.sal);
      const bodyVal = stripLeadingSalutation(keep(data.body, s.form.body), salVal);
      const enclVal = isPersonal ? '' : keep(aiEncl, s.form.encl);
      const copyVal = isPersonal ? [] : (aiCopy.length > 0 ? aiCopy : s.form.copyTo);

      return {
        ...s,
        tpl: targetTpl,
        officeType: isPersonal ? 'personal' : (isFull ? 'corporate' : s.officeType),
        logoL: newLogoL,
        logoR: newLogoR,
        showEncl: isPersonal ? false : (enclVal.trim().length > 0 || s.showEncl),
        showCopy: isPersonal ? false : (copyVal.length > 0 || s.showCopy),
        showEndorse: false,
        showFooter: !isPersonal,
        form: {
          ...s.form,
          h1: isPersonal ? '' : keep(data.h1 ?? data.dept_hindi_1, s.form.h1),
          h2: isPersonal ? '' : keep(data.h2 ?? data.dept_hindi_2, s.form.h2),
          e1: isPersonal ? '' : keep(data.e1 ?? data.dept_english_1, s.form.e1),
          e2: isPersonal ? '' : keep(data.e2 ?? data.dept_english_2, s.form.e2),
          dept: isPersonal ? '' : keep(data.dept ?? data.department, s.form.dept),
          divn: isPersonal ? '' : keep(data.divn ?? data.division, s.form.divn),
          ofc:  isPersonal ? '' : keep(data.ofc ?? data.office, s.form.ofc),
          city: isPersonal ? '' : keep(data.city, s.form.city),
          pin:  isPersonal ? '' : keep(data.pin, s.form.pin),
          ph:   isPersonal ? '' : keep(data.ph ?? data.phone, s.form.ph),
          em:   isPersonal ? '' : keep(data.em ?? data.email, s.form.em),
          wb:   isPersonal ? '' : keep(data.wb ?? data.website, s.form.wb),
          fno:  isPersonal ? '' : keep(data.fno ?? data.file_no, s.form.fno),
          toD:  keep(data.toD ?? data.to_designation, s.form.toD),
          toA:  keep(data.toA ?? data.to_address, s.form.toA),
          sub:  keep(data.sub ?? data.subject, s.form.sub),
          ref:  isPersonal ? '' : keep(data.ref ?? data.reference, s.form.ref),
          sal:  salVal,
          cls:  keep(data.cls ?? data.closing, s.form.cls),
          sn:   keep(data.sn ?? data.signatory_name, s.form.sn),
          sh:   isPersonal ? '' : keep(data.sh ?? data.signatory_hindi, s.form.sh),
          sd:   isPersonal ? '' : keep(data.sd ?? data.signatory_designation, s.form.sd),
          sp:   isPersonal ? '' : keep(data.sp ?? data.signatory_phone, s.form.sp),
          sc:   isPersonal ? '' : keep(data.sc ?? data.constituency, s.form.sc),
          body: bodyVal,
          encl: enclVal,
          copyTo: copyVal,
        },
        aiTick: (s.aiTick || 0) + 1,
      };
    });
  }, []);

  return {
    state,
    lastModel,
    draftStatus,
    clearDraft,
    resetLetter,
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
    toggleFooter,
    setFooterDesign,
    fillFromAI,
  };
}

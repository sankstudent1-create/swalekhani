// ─────────────────────────────────────────────
//  hooks/useLetterState.ts  –  Central state for the letterpad
// ─────────────────────────────────────────────
'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { AppState, LetterForm, TemplateType, FontClass, LogoSide, SigMode, AILetterData } from '@/types/letterpad';
import { DEFAULT_FORM, DEFAULT_LOGO_POS, OFFICE_PRESETS, svgToDataUri } from '@/lib/letterpad/constants';
import { isPlaceholderValue } from '@/lib/letterpad/typeProtocols';
import { scrubFullForm } from '@/lib/letterpad/generationGuards';
import { loadFontPreference, saveFontPreference } from '@/lib/letterpad/fontPreference';

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
  userEditedFields: [],
  presetFields: [],
  promptClearTick: 0,
  aiMode: 'content',
  aiType: 'corporate',
  aiLang: 'en',
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

  // ── Re-apply the stored font preference on mount ──
  // Declared after the draft restore so it wins over the draft's
  // font. With no stored preference and a Devanagari draft, the
  // Poppins Devanagari default ('fd2') applies instead.
  useEffect(() => {
    try {
      const pref = loadFontPreference();
      if (pref) {
        setState(s => ({ ...s, font: pref }));
        return;
      }
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft && (draft.aiLang === 'hi' || draft.aiLang === 'mr')) {
          setState(s => ({ ...s, font: 'fd2' }));
        }
      }
    } catch { /* no stored preference — keep the default font */ }
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
    // Belt-and-braces against rehydration: skip the autosave effect's
    // next run, so the cleared state cannot rewrite a draft before a
    // reload, and the removed draft stays removed. The previous
    // failure mode was the 4-second confirm window expiring (a second
    // click after expiry only re-armed the button, so the old draft
    // was still there on reload); the window is now 10 seconds in
    // page.tsx, and this flag covers the save race as well.
    skipNextSave.current = true;
    const dt = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    setState(s => ({ ...INITIAL_STATE, form: { ...DEFAULT_FORM, dt }, userEditedFields: [], presetFields: [], promptClearTick: (s.promptClearTick || 0) + 1, aiTick: (s.aiTick || 0) + 1 }));
    setLastModel(undefined);
    setDraftStatus('fresh');
  }, []);

  // ── Form field update ────────────────────────────────
  // Any value typed through updateForm/setForm (sidebar input, paper
  // inline edit, or an explicit edit instruction) counts as
  // user-edited: Fully-AI generation will preserve it. Preset fields
  // are recorded separately by applyOfficePreset (see presetFields):
  // they survive only when the model gives nothing, below typed
  // fields and below model/brief-sender values.
  const updateForm = useCallback(<K extends keyof LetterForm>(key: K, value: LetterForm[K]) => {
    setState(s => ({
      ...s,
      form: { ...s.form, [key]: value },
      userEditedFields: (s.userEditedFields || []).includes(key as string)
        ? (s.userEditedFields || [])
        : [...(s.userEditedFields || []), key as string],
    }));
  }, []);

  const setForm = useCallback((form: Partial<LetterForm>, bumpTick: boolean = false) => {
    setState(s => ({
      ...s,
      form: { ...s.form, ...form },
      userEditedFields: Array.from(new Set([
        ...(s.userEditedFields || []),
        ...Object.keys(form),
      ])),
      ...(bumpTick ? { aiTick: (s.aiTick || 0) + 1 } : {})
    }));
  }, []);

  // ── Template ─────────────────────────────────────────
  const setTemplate = useCallback((tpl: TemplateType) => {
    setState(s => ({ ...s, tpl }));
  }, []);

  // ── AI Generation Mode (Job A4) ──────────────────────
  // Persisted in AppState so the draft autosave (which stores the
  // whole state minus logos/signatures) restores it on reload. A
  // confirmed New-clear resets it to the 'content' default along
  // with everything else (INITIAL_STATE), which is the fresh-letter
  // behaviour; a plain reload restores the last saved mode.
  const setAiMode = useCallback((aiMode: 'content' | 'full') => {
    setState(s => ({ ...s, aiMode }));
  }, []);

  // ── AI Letter Type / Language (Defect 3) ─────────────
  // Same persistence approach as aiMode: previously Sidebar local
  // state, so a reload reset them to Corporate/English while the
  // draft content (e.g. a Marathi student application) was
  // restored. Now in AppState, so the draft autosave/restore keeps
  // them; a confirmed New-clear resets them via INITIAL_STATE.
  const setAiType = useCallback((aiType: string) => {
    setState(s => ({ ...s, aiType }));
  }, []);
  const setAiLang = useCallback((aiLang: string) => {
    // Switching the AI language to Hindi/Marathi also switches the
    // letter to the Poppins Devanagari default ('fd2') — unless the
    // user has a stored font preference, which always wins.
    setState(s => ({
      ...s,
      aiLang,
      font: (aiLang === 'hi' || aiLang === 'mr') && !loadFontPreference() ? 'fd2' : s.font,
    }));
  }, []);

  // ── Font ─────────────────────────────────────────────
  // A font pick is a preference, not draft content: it is written
  // to its own localStorage key (see fontPreference.ts) so it
  // survives a New letter and template changes, and it is
  // re-applied on mount below, winning over the draft's font.
  const setFont = useCallback((font: FontClass) => {
    saveFontPreference(font);
    setState(s => ({ ...s, font }));
  }, []);

  // ── Office preset ────────────────────────────────────
  // Defect 6: clicking a preset is an explicit user choice, so the
  // fields it fills are recorded in presetFields — the lower tier of
  // user-set fields (see types/letterpad.ts). In Full mode a preset
  // value survives when the model gives nothing, while a model value
  // or brief-named sender still beats it, and previous AI output
  // (in neither list) is replaced. Only non-empty preset values are
  // recorded; a preset placeholder ("Advocate Name") is not real
  // data and is stripped by the route/client placeholder checks
  // rather than preserved as literal text.
  const applyOfficePreset = useCallback((type: string) => {
    const preset = OFFICE_PRESETS[type];
    if (!preset) return;

    const logoL = preset.ll ? svgToDataUri(preset.ll) : null;
    const logoR = preset.lr ? svgToDataUri(preset.lr) : null;
    // Catch (b): clicking an office preset must NEVER overwrite a
    // value the user typed with a preset placeholder ("Your Company
    // Name", "Tagline / Pvt. Ltd." …), and must never write a
    // placeholder value as real form content. A typed non-empty
    // field is kept; a placeholder preset value becomes blank; only
    // a real preset value applied to a non-typed field is recorded
    // as a preset field. (The live case: restoring a header by
    // clicking Corporate overwrote a typed Hindi Line 1 with
    // "Your Company Name" while the un-preset regional name survived.)
    const headerKeys = (['h1', 'h2', 'e1', 'e2', 'dept', 'divn', 'ofc', 'city', 'pin', 'ph', 'em', 'wb'] as const)
      .filter((k) => Boolean(preset[k]));

    setState(s => {
      const nextHeader: Record<string, string> = {};
      const appliedPresetKeys: string[] = [];
      for (const k of headerKeys) {
        const presetVal = preset[k] as string;
        if ((s.userEditedFields || []).includes(k) && s.form[k]?.trim()) {
          nextHeader[k] = s.form[k];
        } else if (isPlaceholderValue(presetVal)) {
          nextHeader[k] = '';
        } else {
          nextHeader[k] = presetVal;
          appliedPresetKeys.push(k);
        }
      }
      return {
        ...s,
        officeType: type as AppState['officeType'],
        tpl: preset.t,
        logoL,
        logoR,
        posR: { ...s.posR, placed: false }, // trigger auto-placement
        showFooter: type !== 'personal',
        presetFields: appliedPresetKeys,
        form: { ...s.form, ...nextHeader },
      };
    });
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
  // brief is the prompt that produced this generation (sidebar
  // prompt or modal text). It powers the client-side final-state
  // scrub below; fills without a brief (e.g. the modal edit path,
  // which deliberately re-applies the current letter's own values)
  // are never scrubbed.
  const fillFromAI = useCallback((data: AILetterData, isFull: boolean = false, model?: string, brief?: string) => {
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
      // Full-mode replace rule (Defect 2), client half: the route
      // already blanks stale AI-owned values for a Full generation,
      // but the old keep() here resurrected them — an AI value of ''
      // fell back to the previous letter's value, so stale names,
      // designations, and cities survived "Entire Letterhead"
      // generations. In Full mode a field the user explicitly typed
      // (userEditedFields) keeps its value; otherwise the AI value
      // wins; otherwise a PRESET value survives (Defect 6 — the
      // route applies the same order, so the two halves agree);
      // otherwise the field is blanked. A preset placeholder
      // ("Advocate Name", "Chamber Address") is not preserved as
      // literal text. Body-Only mode keeps the old preserve rule
      // exactly.
      // SINGLE-USE edited marks (Defect 1 leak): a typed value wins
      // the Full generation it was typed for, but the mark must not
      // live forever — otherwise a value typed for one letter (e.g.
      // a principal recipient and a student signatory typed while
      // setting up a Marathi student application) vetoes replacement
      // in every later, unrelated Entire Letterhead generation, so
      // only the body regenerates and To/signatory/header carry
      // over. After a Full generation applies, the AI-owned fill
      // keys are therefore removed from userEditedFields: the values
      // are now this letter's content, not a standing veto, and the
      // next Full generation replaces them unless the user re-types
      // them for the new letter. (Body-Only generations do not
      // consume marks — their preserve rule is unchanged. A value AI
      // set stays replaceable, as before.)
      const edited = (k: string) => (s.userEditedFields || []).includes(k);
      const preset = (k: string) => (s.presetFields || []).includes(k);
      const fullVal = (key: string, ai: string | undefined, cur: string) =>
        !isFull ? keep(ai, cur) : edited(key) ? cur : (has(ai) ? (ai as string) : (preset(key) && cur && !isPlaceholderValue(cur) ? cur : ''));
      // Personal-type detection must not blank a value the user
      // explicitly typed. The 48cfd0b live failure's second half is
      // this: a Fully-AI regeneration run while Letter Type was
      // still Student Application resolved to a personal type, and
      // fillFromAI blanked every header field — including an
      // English Line 1 the user had just typed — while the body
      // and recipient (which the model had just written from that
      // typed value) survived, so the typed value looked "moved"
      // into the body. Typed header values now survive personal
      // detection exactly as they survive Full mode.
      const personalVal = (key: string, ai: string | undefined, cur: string) =>
        isPersonal ? (edited(key) ? cur : '') : fullVal(key, ai, cur);
      // The user's chosen salutation survives unless the AI supplies one.
      const salVal = fullVal('sal', data.sal ?? data.salutation, s.form.sal);
      const bodyVal = stripLeadingSalutation(keep(data.body, s.form.body), salVal);
      const enclVal = isPersonal ? '' : fullVal('encl', aiEncl, s.form.encl);
      const copyVal = isPersonal ? [] : (!isFull
        ? (aiCopy.length > 0 ? aiCopy : s.form.copyTo)
        : edited('copyTo') ? s.form.copyTo : aiCopy);

      // AI-owned fill keys whose edited marks a Full generation
      // consumes (see the single-use note above). dt is excluded:
      // it is system-seeded today, not a previous letter's value.
      // body is excluded: it uses keep(), not the replace rule.
      const CONSUMED_KEYS = ['h1', 'h2', 'e1', 'e2', 'dept', 'divn', 'ofc', 'city', 'pin', 'ph', 'em', 'wb', 'fno', 'ref', 'toD', 'toA', 'sub', 'sal', 'cls', 'sn', 'sh', 'sd', 'sp', 'sc', 'encl', 'copyTo'];

      // Client-side final-state scrub (the 48cfd0b lesson): the
      // route guards alone did not hold live — a model value equal
      // to the previous letter's value, a reworded copy, or stale
      // state could still land on the paper. So after the fill
      // values are computed, every AI-owned identity field is
      // scrubbed against the PREVIOUS form: an applied value
      // identical to the previous letter's is dropped unless the
      // user typed it, a preset set it, or the new brief names it.
      // Salutations/closings are excluded by the scrub key list
      // (they legitimately repeat), as are date and body. The
      // scrub uses the PRE-consumption edited/preset marks, and
      // only runs when a brief is supplied (generation paths).
      const rawForm = {
          ...s.form,
          h1: personalVal('h1', data.h1 ?? data.dept_hindi_1, s.form.h1),
          h2: personalVal('h2', data.h2 ?? data.dept_hindi_2, s.form.h2),
          e1: personalVal('e1', data.e1 ?? data.dept_english_1, s.form.e1),
          e2: personalVal('e2', data.e2 ?? data.dept_english_2, s.form.e2),
          dept: personalVal('dept', data.dept ?? data.department, s.form.dept),
          divn: personalVal('divn', data.divn ?? data.division, s.form.divn),
          ofc:  personalVal('ofc', data.ofc ?? data.office, s.form.ofc),
          city: personalVal('city', data.city, s.form.city),
          pin:  personalVal('pin', data.pin, s.form.pin),
          ph:   personalVal('ph', data.ph ?? data.phone, s.form.ph),
          em:   personalVal('em', data.em ?? data.email, s.form.em),
          wb:   personalVal('wb', data.wb ?? data.website, s.form.wb),
          fno:  isPersonal ? '' : fullVal('fno', data.fno ?? data.file_no, s.form.fno),
          // Date (Defect 5): the route returns dt already localised
          // for Hindi/Marathi, but fillFromAI never applied it, so
          // the paper kept the client-seeded English date while only
          // the "दिनांक:" label was localised. Apply it in both
          // modes — it is today (system-seeded), never a previous
          // letter's date, and English letters are unaffected
          // because localiseDate passes English through untouched.
          dt:   has(data.dt) ? (data.dt as string) : s.form.dt,
          toD:  fullVal('toD', data.toD ?? data.to_designation, s.form.toD),
          toA:  fullVal('toA', data.toA ?? data.to_address, s.form.toA),
          sub:  fullVal('sub', data.sub ?? data.subject, s.form.sub),
          ref:  isPersonal ? '' : fullVal('ref', data.ref ?? data.reference, s.form.ref),
          sal:  salVal,
          cls:  fullVal('cls', data.cls ?? data.closing, s.form.cls),
          sn:   fullVal('sn', data.sn ?? data.signatory_name, s.form.sn),
          sh:   personalVal('sh', data.sh ?? data.signatory_hindi, s.form.sh),
          sd:   personalVal('sd', data.sd ?? data.signatory_designation, s.form.sd),
          sp:   personalVal('sp', data.sp ?? data.signatory_phone, s.form.sp),
          sc:   personalVal('sc', data.sc ?? data.constituency, s.form.sc),
          body: bodyVal,
          encl: enclVal,
          copyTo: copyVal,
      };
      // Catch (a): a generation must not silently flip visibility
      // flags. Previously fillFromAI forced showFooter off for
      // personal-type generations (and showEndorse off always), so
      // a Fully-AI generation could remove the footer the user had
      // on — the live footer had to be re-enabled by hand. Flags
      // now survive every generation; only an explicit user toggle
      // (or an office-preset click) changes them.
      const finalForm = isFull
        ? scrubFullForm(
            rawForm as unknown as Record<string, string>,
            s.form as unknown as Record<string, string>,
            s.userEditedFields || [],
            s.presetFields || [],
            brief || '',
          )
        : rawForm;
      return {
        ...s,
        tpl: targetTpl,
        userEditedFields: isFull
          ? (s.userEditedFields || []).filter((k) => !CONSUMED_KEYS.includes(k))
          : s.userEditedFields,
        officeType: isPersonal ? 'personal' : (isFull ? 'corporate' : s.officeType),
        logoL: newLogoL,
        logoR: newLogoR,
        showEncl: isPersonal ? false : (enclVal.trim().length > 0 || s.showEncl),
        showCopy: isPersonal ? false : (copyVal.length > 0 || s.showCopy),
        showEndorse: s.showEndorse,
        showFooter: s.showFooter,
        form: { ...rawForm, ...finalForm },
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
    setAiMode,
    setAiType,
    setAiLang,
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

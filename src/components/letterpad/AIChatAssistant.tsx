'use client';
import React, { useState, useRef, useEffect } from 'react';
import type { AppState, LetterForm, AILetterData } from '@/types/letterpad';
import { MISSING_FIELD_LABELS } from '@/lib/letterpad/typeProtocols';
import { AI_LETTER_TYPES } from '@/lib/letterpad/constants';
import { liveMissing, isRetryableAiError, AI_MAX_ATTEMPTS, AI_AUTO_RETRY_DELAY_MS } from '@/lib/letterpad/generationGuards';
import styles from './AIChatAssistant.module.css';

// ── Message model ─────────────────────────────────────────────
// prompt/kind remember WHICH prompt produced an assistant message,
// so Copy / Retry / Edit & resend act per-message. Error messages
// carry retryPrompt/retryKind so a failed send can be retried
// without retyping. Question messages (ask-back flow) carry no
// prompt and therefore get no action row.
interface Message {
  role: 'user' | 'assistant' | 'error';
  text: string;
  prompt?: string;
  kind?: 'generate' | 'edit';
  retryPrompt?: string;
  retryKind?: 'generate' | 'edit';
}

// A pending clarification question: set when a generation returns
// missing required fields. While it is set, sending a message is
// treated as the ANSWER by default (see send()).
interface PendingQuestion {
  fields: string[];
  originalPrompt: string;
}

interface AIChatAssistantProps {
  state: AppState;
  onSetForm: (form: Partial<LetterForm>, bumpTick?: boolean) => void;
  onFillAI: (data: AILetterData, isFull: boolean, model?: string, brief?: string) => void;
  onAiType?: (t: string) => void;
}

const QUICK_CHIPS = [
  { label: '🚩 मराठी ग्राहक तक्रार', text: 'दोषपूर्ण उत्पादनाबाबत कंपनीकडे मराठीत औपचारिक ग्राहक तक्रार पत्र लिहा — बदली किंवा परताव्याची मागणी करा' },
  { label: '🏢 Corporate Circular', text: 'Draft a formal corporate circular to all department heads regarding office attendance and compliance' },
  { label: '📜 मराठी ना-हरकत (NOC)', text: 'कर्मचाऱ्यास पारपत्र (पासपोर्ट) काढण्यासाठी कंपनीचे मराठीत ना-हरकत प्रमाणपत्र (NOC)' },
  { label: '🎓 मराठी रजेचा अर्ज', text: 'शाळेच्या / महाविद्यालयाच्या प्राचार्यांना आजारपणाच्या रजेसाठी विद्यार्थ्याचा सविनय विनंती अर्ज मराठीत' },
  { label: '💌 मराठी भावस्पर्शी पत्र', text: 'वडिलांना / आईस / आप्तस्वकीयांना सस्नेह नमस्कार करणारे मराठीतील आपुलकीचे पत्र' },
  { label: '🇮🇳 हिंदी शिकायत पत्र', text: 'दोषपूर्ण उत्पाद के संबंध में कंपनी को औपचारिक हिंदी शिकायत पत्र लिखें — प्रतिस्थापन या धनवापसी का अनुरोध करें' },
  { label: '🏢 Formal Business Tone', text: 'Polite and strict formal corporate business tone' },
  { label: '📝 Citizen Application', text: 'Write a formal citizen application to an authority (e.g. Bank Manager, Municipal Officer, Collector)' },
  { label: '📜 Employee NOC', text: 'Issue a No Objection Certificate (NOC) for an employee applying for passport or higher education' },
  { label: '💌 Romantic Love Letter', text: 'Write a deeply romantic, emotional love letter for my sweetheart (remove all headers)' },
  { label: '📢 Corporate Circular', text: 'Issue a corporate circular regarding office attendance and compliance to all department heads' },
  { label: '🤝 Semi-Official Letter', text: 'Convert to a warm semi-official format with personal salutation ("Dear Mr./Ms. ...") and subscription ("Yours sincerely")' },
  { label: '⚠️ Show Cause Notice', text: 'Restructure into a formal Show Cause Notice with WHEREAS and NOW THEREFORE clauses' },
  { label: '⏳ Urgent Reminder', text: 'Add an expedited reminder paragraph referencing previous communication awaiting reply' },
  { label: '🎓 Student Application', text: 'Format as respectful student application to Principal with Class, Roll No., and "Yours obediently"' },
];

// One-tap example prompts for a first-time user (design clarity:
// the modal must explain itself, not just show a sparkle icon).
const EXAMPLE_PROMPTS = [
  { label: '📜 NOC request', text: 'Write a letter to the District Collector requesting an NOC for our high-tech project' },
  { label: '🎓 Leave application', text: 'Write a leave application to my school principal for 3 days of sick leave' },
  { label: '🏦 Bank complaint', text: 'Write a complaint to the bank manager about a wrongly charged fee on my account' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function plainErrorText(raw: string): string {
  if (/does not exist|do not have access|not have access/i.test(raw)) {
    return 'The AI model was briefly unavailable. It was retried once automatically — tap Retry below to try again.';
  }
  if (/load failed|failed to fetch|network/i.test(raw)) {
    return 'Could not reach the AI server. It was retried once automatically — check your connection and tap Retry below.';
  }
  return raw;
}

export default function AIChatAssistant({ state, onSetForm, onFillAI, onAiType }: AIChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! I can help you edit this letter or write a completely new one in English, मराठी (Marathi), or हिन्दी (Hindi). Type your request below.' }
  ]);
  const [input, setInput] = useState('');
  const [selectedLang, setSelectedLang] = useState<'auto' | 'mr' | 'hi' | 'en'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  // Set once a modal generation succeeds: gates the live missing
  // line below (before any generation there is nothing to warn
  // about yet — a fresh blank letter is not "missing" anything).
  const [hasGenerated, setHasGenerated] = useState(false);
  const [pendingQ, setPendingQ] = useState<PendingQuestion | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // ── POST with exactly ONE automatic retry ─────────────────────
  // Retry policy (see generationGuards.isRetryableAiError): at
  // most AI_MAX_ATTEMPTS attempts total, a short delay between
  // them, only for retryable failures (network / 5xx / 429 /
  // model-availability). Never a loop, never after a validation
  // error. The caller still shows a manual Retry button on final
  // failure, so the user is never stuck retyping.
  async function postAi(url: string, body: unknown): Promise<{ json: any; status: number }> {
    let lastErr: any = null;
    for (let attempt = 1; attempt <= AI_MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && !json.error) return { json, status: res.status };
        const msg = json.error || `Server error: HTTP ${res.status}`;
        const err: any = new Error(msg);
        err.status = res.status;
        err.__aiFinal = true;
        if (attempt < AI_MAX_ATTEMPTS && isRetryableAiError(msg, res.status)) {
          lastErr = err;
          await sleep(AI_AUTO_RETRY_DELAY_MS);
          continue;
        }
        throw err;
      } catch (e: any) {
        if (e?.__aiFinal) throw e;
        if (attempt < AI_MAX_ATTEMPTS && isRetryableAiError(e?.message || '')) {
          lastErr = e;
          await sleep(AI_AUTO_RETRY_DELAY_MS);
          continue;
        }
        throw e;
      }
    }
    throw lastErr || new Error('AI request failed');
  }

  // ── Edit current letter ───────────────────────────────────────
  // brief = the instruction text. Does NOT append the user message
  // itself — the caller does that (Retry re-runs without duplicating
  // the prompt in the transcript).
  async function doEdit(userText: string) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { json } = await postAi('/api/edit-letter', {
        instruction: userText,
        currentForm: state.form,
        language: selectedLang === 'auto' ? undefined : selectedLang,
      });

      if (json.data) {
        const changes: Partial<LetterForm> = {};
        let changedCount = 0;
        for (const [key, value] of Object.entries(json.data)) {
          if (key in state.form && value !== state.form[key as keyof LetterForm]) {
            (changes as any)[key] = value;
            changedCount++;
          }
        }

        if (changedCount > 0) {
          onSetForm(changes, true); // true = bump aiTick so UI updates
        }

        // If user asked to remove headers or make it personal/love letter, reflect in whole state
        const lower = userText.toLowerCase();
        if (lower.includes('love') || lower.includes('personal') || lower.includes('remove header') || lower.includes('no header')) {
          onFillAI({
            ...json.data,
            detected_type: lower.includes('love') ? 'romantic' : 'personal',
            is_personal: true,
            body: json.data.body || state.form.body,
            salutation: json.data.sal || state.form.sal,
            closing: json.data.cls || state.form.cls,
            signatory_name: json.data.sn || state.form.sn,
          }, true);
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          text: changedCount > 0
            ? `I've updated the letter based on your request. (${changedCount} fields changed)`
            : 'I processed your request but no fields needed changing.',
          prompt: userText,
          kind: 'edit',
        }]);
      } else {
        throw new Error('No data returned from AI');
      }
    } catch (err: any) {
      const raw = err.message || 'An error occurred';
      setMessages(prev => [...prev, { role: 'error', text: plainErrorText(raw), retryPrompt: userText, retryKind: 'edit' }]);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Generate a completely new letter ──────────────────────────
  // brief = the text sent to the route (for an answer, the original
  // prompt + the user's clarification). On success with missing
  // required fields, posts a clarification question and tracks it
  // as pendingQ instead of silently leaving blanks.
  async function doGenerate(brief: string, opts?: { wasAnswer?: boolean }) {
    if (isLoading) return;
    // Captured BEFORE the fetch: the signatory on the paper right now,
    // so the post-generation warning can tell a genuine signatory from
    // one carried over from a previous letter (Defect 2).
    const prevSn = (state.form.sn || '').trim();
    const prevSnTyped = (state.userEditedFields || []).includes('sn');
    setIsLoading(true);
    try {
      const { json } = await postAi('/api/generate-letter', {
        description: brief,
        letterType: 'auto', // Auto-detected in the route (typeProtocols), not corporate
        language: selectedLang === 'auto' ? undefined : selectedLang,
        // Previously {}: the route then had no sender/office context to
        // infer a recipient from. Send the full current form as ground
        // truth; the route's preserve rule keeps filled fields intact.
        currentContext: {
          officeType: state.officeType, template: state.tpl, mode: 'full', form: state.form,
          userEditedFields: state.userEditedFields || [],
          presetFields: state.presetFields || [],
        },
        currentForm: state.form,
        generationMode: 'full',
      });

      if (json.data) {
        // Brief travels with the fill for the client-side scrub (see
        // Sidebar), and the detected type syncs the sidebar Letter
        // Type dropdown (Catch (c)) when it is a real sidebar option —
        // 'citizen_app' has no sidebar option, so it is left alone
        // rather than faked into another type.
        onFillAI(json.data, true, json.model, brief);
        setHasGenerated(true);
        const _detectedForSync = json.detected_type || json.data.detected_type;
        if (onAiType && AI_LETTER_TYPES.some(t => t.value === _detectedForSync)) {
          onAiType(_detectedForSync);
        }
        const typeNameMap: Record<string, string> = {
          citizen_app: 'Citizen Application to Authority (Formal Request)',
          noc: 'No Objection Certificate (NOC)',
          circular: 'Administrative Circular',
          corporate: 'Corporate Business Letter',
          complaint: 'Complaint Letter',
          rti: 'RTI Application',
          rti_reply: 'RTI Reply / PIO Response',
          notice: 'Notice Announcement',
          advisory: 'Advisory / Guidelines',
          forwarding: 'Forwarding / Endorsement Note',
          romantic: 'Heartfelt Love Letter (Headers removed)',
          student_app: 'Student Application to Principal',
          heritage_personal: 'Traditional Family Letter',
          scn: 'Show Cause Notice',
          reminder: 'Urgent Reminder Letter',
          appreciation: 'Letter of Appreciation',
          personal: 'Personal Letter',
          custom: 'Custom Letter'
        };
        const detected = json.detected_type || json.data.detected_type;
        const label = typeNameMap[detected] || 'complete letter';
        // Job A5: align the modal warning with the sidebar's post-fill
        // warning. The route's missing_fields list is computed from the
        // generation, but the modal previously showed it verbatim — so a
        // run could list "signatory designation" even though the filled
        // letter on the paper HAS a designation (the sidebar path, which
        // re-derives its warning from the filled result, listed name
        // only for the same prompt). Filter the route list against the
        // values that actually landed (json.data): a field that is
        // filled in the generated letter can never be listed as missing.
        const _d = json.data as Record<string, unknown>;
        const _filled = (v: unknown) => Boolean(String(v ?? '').trim());
        const missing = (Array.isArray(json.missing_fields) ? json.missing_fields as string[] : []).filter((f: string) => {
          if (f === 'sn') return !_filled(_d.sn ?? _d.signatory_name);
          if (f === 'sd') return !_filled(_d.sd ?? _d.signatory_designation);
          if (f === 'toD') return !_filled(_d.toD ?? _d.to_designation) || String(_d.toD ?? _d.to_designation ?? '').includes('______');
          if (f === 'sal') return !_filled(_d.sal ?? _d.salutation) || String(_d.sal ?? _d.salutation ?? '').includes('______');
          if (f === 'body') return !_filled(_d.body) || String(_d.body ?? '').trim().length < 150;
          if (f === 'details') return String(_d.body ?? '').includes('______');
          return true;
        });
        // Belt-and-braces, as in the Sidebar: blanks in the body warn even
        // if missing_fields came back empty for this model.
        if (String(json.data.body || '').includes('______') && !missing.includes('details')) {
          missing.push('details');
        }
        // Stale-signatory safety net (Defect 2): the route's missing list
        // can only warn about a BLANK signatory. If the generated letter's
        // signatory is byte-identical to the previous letter's, was NOT
        // typed by the user, and the new brief does not name that person,
        // it is a carry-over — it must not silently pass. This is a
        // check-note, not a missing entry: the field is filled, but with
        // the wrong letter's signatory. (A user-typed signatory is theirs
        // by definition, so it never triggers this note.)
        const genSn = String(_d.sn ?? _d.signatory_name ?? '').trim();
        const snTokens = prevSn.toLowerCase().replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ').split(/\s+/).filter((w) => w.length >= 3);
        const briefNamesPrevSn = snTokens.some((t) => brief.toLowerCase().includes(t));
        const staleSn = Boolean(prevSn) && !prevSnTyped && genSn === prevSn && !briefNamesPrevSn;
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: `✨ I have generated a complete ${label} with all necessary sections and authentic formatting!` +
            (missing.length ? ` Please fill in: ${missing.map((f: string) => MISSING_FIELD_LABELS[f] || f).join(', ')}.` : '') +
            (staleSn ? ' Note: the signatory carried over from the previous letter — please check it.' : ''),
          prompt: brief,
          kind: 'generate',
        }]);
        // ── Clarification ask-back ─────────────────────────────
        // Never invent a missing required field: when the generation
        // still needs an identity field (recipient / signatory) or
        // the body carries ______ blanks (purpose, dates, validity,
        // reference details the brief never gave), ASK BACK instead
        // of silently leaving blanks. sd/sal-only gaps are covered
        // by the live missing line and do not block with a question.
        // The question stays pending until answered or skipped; the
        // answer re-runs generation with the clarification appended
        // to the original prompt (see send()).
        const CLARIFY_FIELDS = ['sn', 'toD', 'details'];
        const needAsk = missing.filter((f: string) => CLARIFY_FIELDS.includes(f));
        if (needAsk.length > 0) {
          const fields = needAsk;
          setPendingQ({ fields, originalPrompt: brief });
          setMessages(prev => [...prev, {
            role: 'assistant',
            text: `To finish this letter I still need: ${fields.map((f: string) => MISSING_FIELD_LABELS[f] || f).join(', ')}. Reply with those details below, or tap Skip to leave them blank.`,
          }]);
        } else if (opts?.wasAnswer) {
          // An answered question whose fields are now filled: the
          // question is resolved, so it must not linger.
          setPendingQ(null);
        }
      } else {
        throw new Error('No data returned from AI');
      }
    } catch (err: any) {
      const raw = err.message || 'An error occurred';
      setMessages(prev => [...prev, { role: 'error', text: plainErrorText(raw), retryPrompt: brief, retryKind: 'generate' }]);
      // A failed answer does NOT clear the pending question: the
      // user can retry the same answer (Retry button) or answer
      // again, instead of losing the question.
    } finally {
      setIsLoading(false);
    }
  }

  // ── Send routing ──────────────────────────────────────────────
  // DEFAULT while a question is pending: the message is the ANSWER
  // to that question, not a fresh prompt — it re-runs generation
  // with the clarification appended to the original prompt. Skip /
  // New prompt (in the indicator) clear the question first, so the
  // next send is a fresh prompt again.
  async function send(kind: 'edit' | 'generate') {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    if (pendingQ) {
      const q = pendingQ;
      await doGenerate(`${q.originalPrompt}\n\nUser clarification: ${userText}`, { wasAnswer: true });
      return;
    }
    if (kind === 'edit') await doEdit(userText);
    else await doGenerate(userText);
  }

  async function copyMessage(idx: number, text: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx((c) => (c === idx ? null : c)), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context): the text
      // stays visible in the message for manual selection.
    }
  }

  function retryMessage(m: Message) {
    if (!m.retryPrompt && !m.prompt) return;
    const prompt = m.retryPrompt || m.prompt || '';
    const kind = m.retryKind || m.kind || 'generate';
    if (kind === 'edit') void doEdit(prompt);
    else void doGenerate(prompt);
  }

  if (!isOpen) {
    // Labelled trigger (design clarity): the old trigger was a bare
    // ✨ symbol, which a new user could not be expected to
    // understand. It now says what it does.
    return (
      <div className={`${styles.chatContainer} ${styles.closed}`} onClick={() => setIsOpen(true)} role="button" aria-label="Ask AI to draft your letter">
        <div className={styles.closedIcon}>✨</div>
        <span className={styles.closedLabel}>Ask AI</span>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader} onClick={() => setIsOpen(false)}>
        <div>
          <div className={styles.chatTitle}>✨ Ask AI to draft your letter</div>
          <div className={styles.chatSubtitle}>Describe your letter in plain words — AI drafts it on the paper for you to review.</div>
        </div>
        <button className={styles.closeBtn}>✕</button>
      </div>

      <div className={styles.chatBody}>
        {messages.map((m, i) => (
          <div key={i}>
            <div className={`${styles.message} ${m.role === 'user' ? styles.userMsg : m.role === 'error' ? styles.errorMsg : styles.assistantMsg}`}>
              {m.text}
            </div>
            {/* Per-message actions (assistant messages only, each
                remembering its own prompt): Copy / Retry /
                Edit & resend. Error messages get a Retry button
                instead, resending the failed prompt as-is. */}
            {m.role === 'assistant' && m.prompt && (
              <div className={styles.msgActions}>
                <button type="button" className={styles.msgActionBtn} onClick={() => copyMessage(i, m.text)} disabled={isLoading}>
                  {copiedIdx === i ? '✓ Copied' : '📋 Copy'}
                </button>
                <button type="button" className={styles.msgActionBtn} onClick={() => retryMessage(m)} disabled={isLoading}>
                  ↻ Retry
                </button>
                <button
                  type="button"
                  className={styles.msgActionBtn}
                  disabled={isLoading}
                  onClick={() => {
                    // Edit & resend is a FRESH prompt, not an answer:
                    // it clears any pending question first.
                    setPendingQ(null);
                    setInput(m.prompt || '');
                    inputRef.current?.focus();
                  }}
                >
                  ✏️ Edit &amp; resend
                </button>
              </div>
            )}
            {m.role === 'error' && (m.retryPrompt || m.prompt) && (
              <div className={styles.msgActions}>
                <button type="button" className={styles.msgActionBtn} onClick={() => retryMessage(m)} disabled={isLoading}>
                  ↻ Retry
                </button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistantMsg}`}>
            <div className={styles.typingIndicator}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        )}
        {/* Live missing-fields line (FAIL 2): the generation message
            above is history — its "please fill" text is frozen at
            generation time and can never clear when you fill the
            field, which is exactly the stale badge the live retest
            caught. This line is derived from the CURRENT paper on
            every render: it clears the moment the named field is
            filled and reappears if it is emptied. */}
        {hasGenerated && (() => {
          const live = liveMissing(state.form);
          return (
            <div className={`${styles.message} ${styles.assistantMsg}`}>
              {live.length
                ? `Live check — still to fill: ${live.map((f: string) => MISSING_FIELD_LABELS[f] || f).join(', ')}.`
                : 'Live check — all required fields filled ✓'}
            </div>
          );
        })()}
        <div ref={endRef} />
      </div>

      <div className={styles.chatInputArea}>
        <div className={styles.chipsBar}>
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.chip}
              onClick={() => setInput(chip.text)}
              title={chip.text}
            >
              {chip.label}
            </button>
          ))}
        </div>
        {/* Language selector bar */}
        <div className={styles.langBar}>
          <span className={styles.langLabel}>🌐 भाषा / Lang:</span>
          {(
            [
              { id: 'auto', label: 'Auto' },
              { id: 'mr', label: '🚩 मराठी' },
              { id: 'hi', label: '🇮🇳 हिन्दी' },
              { id: 'en', label: '🇬🇧 English' },
            ] as const
          ).map(l => (
            <button
              key={l.id}
              type="button"
              className={`${styles.langBtn} ${selectedLang === l.id ? styles.langBtnActive : ''}`}
              onClick={() => setSelectedLang(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* One-tap example prompts (design clarity for first use) */}
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Try an example:</span>
          {EXAMPLE_PROMPTS.map((ex) => (
            <button key={ex.label} type="button" className={styles.exampleBtn} onClick={() => setInput(ex.text)}>
              {ex.label}
            </button>
          ))}
        </div>

        {/* Pending-question indicator: while a question is pending,
            sending is an ANSWER by default. Skip leaves the fields
            blank (live line keeps warning); New prompt discards
            the question and starts fresh. */}
        {pendingQ && (
          <div className={styles.pendingBox}>
            <span>
              Answering: still need {pendingQ.fields.map((f: string) => MISSING_FIELD_LABELS[f] || f).join(', ')} — your next message will be sent as the answer.
            </span>
            <span className={styles.pendingActions}>
              <button type="button" className={styles.pendingBtn} onClick={() => setPendingQ(null)} disabled={isLoading}>
                Skip
              </button>
              <button
                type="button"
                className={styles.pendingBtn}
                disabled={isLoading}
                onClick={() => { setPendingQ(null); setInput(''); inputRef.current?.focus(); }}
              >
                New prompt
              </button>
            </span>
          </div>
        )}

        <textarea
          ref={inputRef}
          className={styles.chatInput}
          rows={3}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send('edit');
            }
          }}
          placeholder="e.g. Write a letter to the District Collector requesting an NOC for our high-tech project"
          disabled={isLoading}
        />
        <div className={styles.actionButtons}>
          <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => void send('edit')} disabled={isLoading || !input.trim()} title="Edit current letter">
            ✏️ Edit
          </button>
          <button className={`${styles.actionBtn} ${styles.newBtn}`} onClick={() => void send('generate')} disabled={isLoading || !input.trim()} title="Generate completely new letter">
            ✨ New
          </button>
        </div>
      </div>
    </div>
  );
}

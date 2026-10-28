import { NextRequest, NextResponse } from 'next/server';
import {
  TYPE_PROTOCOLS,
  resolveLetterType,
  inferRecipient,
  salutationFor,
  closingFor,
  synthesizeSubject,
  briefMatchesSubject,
  isDevanagari,
  buildFallbackBody,
  computeMissingFields,
  protocolPrompt,
  stripPlaceholders,
  extractSenderFromBrief,
  isPlaceholderValue,
  looksLikeDateFragment,
  localiseRecipient,
  localiseDate,
  isLegalNotice,
  stripInventedLegalGrounds,
  stripTrailingClosing,
  tokensOf,
  isUngroundedValue,
  type AILang,
  type KnownLetterType,
} from '@/lib/letterpad/typeProtocols';

interface GroqMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface LetterGenerationRequest {
  description: string;
  letterType?: string;
  language?: string;
  templatePreset?: string;
  generationMode?: 'content' | 'full';
  currentForm?: Record<string, unknown>;
  userEditedFields?: string[];
  presetFields?: string[];
  currentContext?: {
    department?: string;
    office?: string;
    city?: string;
    officeType?: string;
    template?: string;
    tpl?: string;
    mode?: 'content' | 'full';
    form?: Record<string, unknown>;
    userEditedFields?: string[];
    presetFields?: string[];
  };
}

// ── Groq model fallback chain (order unchanged) ──────────
const GROQ_FALLBACK_MODELS = [
  'openai/gpt-oss-120b',              // Best quality — try first
  'openai/gpt-oss-20b',               // Fast fallback
  'qwen/qwen3.6-27b',                 // Secondary fallback
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
];

async function callGroqModel(
  messages: GroqMessage[],
  model: string,
  maxTokens: number,
  apiKey: string
): Promise<{ content: string; model: string }> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.4,
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `HTTP ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMsg = errorJson.error?.message || errorText;
    } catch { errorMsg = errorText; }

    const isRateLimit = response.status === 429 ||
      errorMsg.toLowerCase().includes('rate_limit') ||
      errorMsg.toLowerCase().includes('rate limit') ||
      errorMsg.toLowerCase().includes('tokens per') ||
      errorMsg.toLowerCase().includes('exceeded');
    const isAuth = response.status === 401 || response.status === 403;

    const err = new Error(errorMsg) as Error & { isRateLimit?: boolean; isAuth?: boolean; statusCode?: number };
    err.isRateLimit = isRateLimit;
    err.isAuth = isAuth;
    err.statusCode = response.status;
    throw err;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content in Groq API response');
  return { content, model };
}

async function callGroqWithFallback(
  messages: GroqMessage[],
  maxTokens: number = 3000
): Promise<{ content: string; model: string }> {
  const apiKey = process.env.GROQ_API_KEY!;
  const preferredModel = process.env.GROQ_MODEL;

  const models = preferredModel && !GROQ_FALLBACK_MODELS.includes(preferredModel)
    ? [preferredModel, ...GROQ_FALLBACK_MODELS]
    : preferredModel
      ? [preferredModel, ...GROQ_FALLBACK_MODELS.filter(m => m !== preferredModel)]
      : GROQ_FALLBACK_MODELS;

  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const result = await callGroqModel(messages, model, maxTokens, apiKey);
      return result;
    } catch (err) {
      const e = err as Error & { isAuth?: boolean };
      lastError = e;
      // Auth / config errors stop immediately; every other failure
      // (429, 5xx, model-not-found, network) moves to the next model,
      // and only throws after the whole chain is exhausted.
      if (e.isAuth) throw e;
      continue;
    }
  }

  throw lastError ?? new Error('All Groq models exhausted or unavailable');
}

// ── Repair non-JSON model output ─────────────────────────
// Strips markdown fences, extracts the first balanced JSON object
// (brace-counting, string-aware), and retries trailing-comma fixes.
function extractJsonObject(text: string): Record<string, unknown> {
  let cleaned = (text || '').trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/, '');
  const start = cleaned.indexOf('{');
  if (start === -1) throw new Error('Model response contained no JSON object');
  // Balanced-brace scan, respecting quoted strings and escapes.
  let depth = 0;
  let inStr = false;
  let esc = false;
  let end = -1;
  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
    } else {
      if (ch === '"') inStr = true;
      else if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
  }
  if (end !== -1) cleaned = cleaned.slice(start, end + 1);
  else cleaned = cleaned.slice(start);
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    // Trailing-comma repair, then one more parse attempt.
    const repaired = cleaned.replace(/,\s*([}\]])/g, '$1');
    return JSON.parse(repaired) as Record<string, unknown>;
  }
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LetterGenerationRequest;
    const {
      description,
      letterType = 'corporate',
      language = 'en',
      templatePreset = '',
      currentForm = {},
      currentContext = {},
    } = body;
    const generationMode: 'content' | 'full' =
      body.generationMode || currentContext.mode || 'content';

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('[letterpad] GROQ_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: GROQ_API_KEY is not set. Please add it to your Vercel environment variables.' },
        { status: 500 }
      );
    }

    // Full form context: the mode-adjusted form (headers blanked in
    // Full mode) plus, when the client sends it, the original form as
    // ground truth for recipient inference and contact protection.
    const modeForm = currentForm && Object.keys(currentForm).length > 0
      ? currentForm
      : (currentContext.form || {});
    const originalForm = currentContext.form && Object.keys(currentContext.form).length > 0
      ? currentContext.form
      : modeForm;
    const gt = stripPlaceholders(originalForm);
    // Fields the user explicitly typed in this session (sidebar/paper
    // inputs), sent by the client. This is what resolves the old
    // preserve-vs-replace conflict: a typed header is ground truth and
    // is never overwritten, while every other AI-owned field in Full
    // mode is replaced (model value, brief sender, preset, or blank)
    // instead of silently keeping a previous letter's value.
    // Preset fields (Defect 6) are a distinct, lower tier than typed
    // fields: clicking a Company/Doctor/Legal preset is an explicit
    // user choice, so a preset value survives a Fully-AI generation
    // when the model gives nothing for that field — but a model value
    // or a brief-named sender still beats it, and previous AI output
    // (not typed, not preset) is still replaced, never preserved.
    const userEdited = new Set<string>([
      ...(Array.isArray(body.userEditedFields) ? body.userEditedFields : []),
      ...(Array.isArray(currentContext.userEditedFields) ? currentContext.userEditedFields : []),
    ].map((f) => String(f)));
    const presetFields = new Set<string>([
      ...(Array.isArray(body.presetFields) ? body.presetFields : []),
      ...(Array.isArray(currentContext.presetFields) ? currentContext.presetFields : []),
    ].map((f) => String(f)));
    const officeType = currentContext.officeType || templatePreset || '';
    const template = currentContext.template || currentContext.tpl || '';
    const targetPreset = templatePreset || (currentContext as { template?: string }).template || '';

    // Language detection — Devanagari script aware. 'bi' is explicit:
    // it is never dropped to plain English.
    let langParam = (language || 'en').toLowerCase();
    if (langParam === 'auto') langParam = 'en';
    const descLower = (description || '').toLowerCase();
    const hasDevanagari = /[\u0900-\u097F]/.test(description || '');

    const isMarathi =
      langParam === 'mr' ||
      descLower.includes('marathi') ||
      /(मराठी|मध्ये|पत्र लिहा|विनंती अर्ज|रजा अर्ज|महोदय)/.test(description || '') ||
      /\b(liha|patra|arja|pahije|baddal|karave)\b/i.test(description || '');

    const isHindi =
      !isMarathi && (
        langParam === 'hi' ||
        hasDevanagari ||
        descLower.includes('hindi') ||
        /(आवेदन|पत्र लिखें|शिकायत|बिजली|छुट्टी)/.test(description || '') ||
        /\b(likhe|kripya|chahiye|aavedan)\b/i.test(description || '')
      );

    let targetLang: AILang;
    if (langParam === 'bi') targetLang = 'bi';
    else if (isMarathi) targetLang = 'mr';
    else if (isHindi) targetLang = 'hi';
    else targetLang = 'en';
    const secondLang: 'mr' | 'hi' = isMarathi ? 'mr' : 'hi';

    // Type resolution: 'auto'/unknown never silently becomes corporate.
    let { resolved, detected } = resolveLetterType(letterType, description, officeType);
    // Legal-notice override (Defects 1/2): a legal notice is not only
    // the 'notice' letter type. A Custom letter under the Legal
    // preset, or any legal-notice prompt, gets the notice protocol,
    // its grounds ban, and its Dear Sir/Madam + Yours faithfully
    // enforcement — otherwise the previous letterType-keyed checks
    // missed it entirely. SCN/RTI and explicitly chosen non-notice
    // types (appreciation, complaint, etc.) are never overridden.
    const legalNotice = isLegalNotice(description, officeType, letterType);
    if (legalNotice && (resolved === 'custom' || resolved === 'corporate' || resolved === 'notice')) {
      resolved = 'notice';
      detected = 'notice';
    }
    const protocol = TYPE_PROTOCOLS[resolved];
    const recipientFallback = inferRecipient(resolved, {
      toD: gt.toD,
      officeType,
      dept: gt.dept,
      e1: gt.e1,
      ofc: gt.ofc,
    });

    const systemPrompt = `You are an expert official letter drafting specialist for professional, statutory, and administrative correspondence across India (English, Marathi, and Hindi).

CRITICAL GROUND TRUTH & ANTI-HALLUCINATION RULES:
1. SENDER & SIGNATORY GROUND TRUTH:
   - If user-filled signatory fields (Name 'sn', Designation 'sd', Department 'dept', Office 'ofc', City 'city') are provided in the prompt, treat them as IMMUTABLE GROUND TRUTH.
   - Subject and recipient are TOPIC-DEPENDENT and are NOT ground truth from a previous letter: a previous subject/recipient belongs to an earlier, possibly different letter. Generate both fresh from the NEW brief; copy the previous subject or recipient only if the new brief is about the same topic and names the same recipient.
   - NEVER overwrite or invent fake government officials (e.g. NEVER generate invented officials or bureaucrats).
   - NEVER invent fictional ministries, departments, or fake government email addresses (@nic.in, @gov.in). Empty contact fields MUST remain empty — DO NOT hallucinate phone numbers or emails.
   - NEVER invent a person, company, ministry, phone number, email, date, amount, or page count to fill a gap. Use ______ blanks for genuinely unknown details.
   - NEVER derive an office, department, or designation from a date, month, or ordinal in the brief ("from 1st November" is a DATE, not an office — it must never become "Office of the St November" or any designation).
   - NEVER state a diagnosis, medical condition, treatment, legal ground, allegation, date, amount, or deadline the brief does not give. A medical certificate is flowing prose unless the brief asks for numbered points, and must never state a diagnosis the brief does not give. Office timings in a circular are stated exactly as given in the brief, or as ______ if not given — never vague prose in place of timings.
   - NEVER invent a department or designation: use only words from the brief or from user-filled/preset fields. Do NOT invent "Corporate Office", "HR Department", or any similar office when the brief names none — leave it blank.
   - LEGAL NOTICES: if the brief states no grounds, state the grounds as ______ — NEVER list example grounds ("e.g. non-payment of rent, unauthorised sub-letting, damage"). An example list is still an invented allegation.
   - DATES: reproduce every date EXACTLY as given in the brief — never append a year, month, or day the brief does not give ("1st November" stays "1st November", never "1st November 2026").
   - CLOSING: the body must NOT end with a closing phrase — the paper renders the Closing field separately, so a body ending in "Yours faithfully," would print two closings.
2. PROFESSION-AUTHENTIC VOICE:
   - Advocate / Legal: Write in rigorous legal tone (statutory notices, Section 138 NI Act, demand notices, caveat intimations, counsel representations).
   - Clinic / Doctor: Write in authentic medical clinical tone (patient clinical history, diagnosis, treatment recommendation, medical fitness / leave certificates).
   - CA / Tax / Auditor: Write in strict ICAI auditing and financial certification tone.
   - Non-Profit / NGO: Write in formal charitable, CSR funding, or 80G acknowledgment tone.
   - Company / Commercial: Write in crisp executive corporate tone.
3. BILINGUAL & LANGUAGE ACCURACY:
   - If language is Marathi ('mr'):
     * ALL fields (sub, sal, body, cls, toD, toA, sn, sh) MUST be in authentic, grammatically flawless formal MARATHI (मराठी).
     * Salutation: "महोदय," or "आदरणीय महोदय,".
     * Closing: "आपला नम्र," or "आपली नम्र," (NEVER Hindi "भवदीय").
     * Subject: "विषय: ... - बाबत."
   - If language is Hindi ('hi'):
     * ALL fields MUST be in formal Rajbhasha HINDI (हिंदी).
     * Salutation: "महोदय," / "सेवा में,".
     * Closing: "भवदीय," / "भवदीया,".
   - If language is Bilingual ('bi'):
     * Body: every English paragraph followed immediately by its ${secondLang === 'mr' ? 'Marathi (मराठी)' : 'Hindi (हिन्दी)'} equivalent, in the same order.
     * Salutation and closing stay in English ("Sir/Madam", "Yours faithfully").
   - If language is English ('en'):
     * Closing: "Yours faithfully," or "Yours sincerely,".
4. BODY PARAGRAPHS:
   - Generate a single, coherent, professionally phrased letter body. DO NOT repeat or duplicate paragraphs.
   - Use double newlines (\\n\\n) between paragraphs.
5. FORMAT PROTOCOL:
   - Return ONLY a valid JSON object matching the required schema. No markdown backticks, no conversational preamble.

${protocolPrompt(resolved, targetLang, secondLang)}

MANDATORY FIELD RULES (never skip):
- "sub": ALWAYS generate a concise formal subject line derived from the user's request (e.g. "Request for Sick Leave — 2 Days.", "Complaint Regarding Defective Smartphone — Refund Request."). NEVER leave empty. If the user already typed a subject, keep or polish it — never blank it.
- "toD": ALWAYS infer the most likely recipient designation from the request and sender context (fallback: "${recipientFallback}"). NEVER leave empty for a formal letter, and NEVER invent a fake person or company to fill it — use the fallback placeholder when the recipient is genuinely unknown.
- "sal" and "cls" must strictly match the target language and letter type (see rules 3 and the type protocol above).
- "body": no [bracket] placeholders for core facts the user already gave (dates, names, amounts they mentioned must appear as real text). Only use ______ blanks for genuinely unknown details like order numbers.

JSON SCHEMA (return header/contact fields when the ground truth gives them; in Body-Only mode return them exactly as ground truth, never invented; in Entire Letterhead mode derive e1/dept/sd from the SENDER named in the brief itself when the form is empty — never invent phone, email, city, PIN, address, or an emblem/seal):
{
  "detected_type": "string",
  "is_personal": false,
  "h1": "Hindi heading line 1 (or empty)",
  "h2": "Hindi heading line 2 (or empty)",
  "e1": "English heading line 1 (or empty)",
  "e2": "English heading line 2 (or empty)",
  "dept": "Department / office line (e.g. Office of the …) — never repeat the government/organisation name from e1, and never repeat the bare signatory designation from sd (or empty)",
  "divn": "Division / Section (or empty)",
  "ofc": "Office / Building (or empty)",
  "city": "City (or empty)",
  "pin": "PIN (or empty)",
  "ph": "Phone (or empty — never invent)",
  "em": "Email (or empty — never invent)",
  "wb": "Website / Reg info (or empty)",
  "sp": "Signatory phone / extn (or empty)",
  "sc": "Constituency / Circle (or empty)",
  "dt": "Date (or empty)",
  "enrolmentNo": "Statutory / enrolment number (or empty)",
  "fno": "File or Reference Number (or empty)",
  "toD": "Recipient Designation & Organization (always infer, never empty for formal letters)",
  "toA": "Recipient Address (or empty)",
  "sub": "Clear formal subject line (ALWAYS generate, never empty)",
  "ref": "Reference line if applicable (or empty)",
  "sal": "Salutation matching language and type",
  "body": "Single complete letter body with distinct paragraphs separated by \\n\\n",
  "cls": "Closing phrase strictly matching language and type",
  "sn": "Signatory Name (use user-provided name as ground truth)",
  "sh": "Devanagari / Hindi transliteration of signatory name if applicable",
  "sd": "Signatory Designation (use user-provided designation)",
  "enclList": ["Enclosure 1"] or [],
  "copyList": ["Copy recipient 1"] or []
}`;

    // Context hygiene for Full mode: the context lines below are
    // presented to the model as ground truth, so showing it a previous
    // letter's header invites it to copy stale values (the other half
    // of Defect 2). In Full mode the model is therefore shown only
    // fields the user explicitly typed; every other AI-owned field
    // is shown blank, and the model must derive it fresh from the
    // brief or leave it blank. Body-Only mode shows full ground
    // truth, as its promise requires. (dt is system-seeded today, not
    // a previous letter's value, so it is always shown.)
    const AI_OWNED_CTX_FIELDS = [
      'h1', 'h2', 'e1', 'e2', 'dept', 'divn', 'ofc', 'city', 'pin',
      'ph', 'em', 'wb', 'enrolmentNo', 'sn', 'sd', 'sp', 'sh', 'sc',
      'fno', 'ref',
    ];
    const ctx: Record<string, string> = { ...gt };
    if (generationMode === 'full') {
      for (const f of AI_OWNED_CTX_FIELDS) {
        if (!userEdited.has(f)) ctx[f] = '';
      }
    }

    const fullContextLines = [
      `Active Template / Profession: ${targetPreset || officeType || 'General Letter'}`,
      `Office Type: ${officeType || '(not set)'}`,
      `Letter Layout Template: ${template || '(not set)'}`,
      `Generation Mode: ${generationMode === 'full' ? 'Entire Letterhead (headers may be completed from context)' : 'Body & Content Only (header/contact fields are ground truth — return them unchanged, never invented)'}`,
      `Target Language: ${targetLang} (${targetLang === 'mr' ? 'मराठी' : targetLang === 'hi' ? 'हिंदी' : targetLang === 'bi' ? `Bilingual English + ${secondLang === 'mr' ? 'मराठी' : 'हिन्दी'}` : 'English'})`,
      `Hindi Line 1 (h1): "${ctx.h1 || ''}"`,
      `Hindi Line 2 (h2): "${ctx.h2 || ''}"`,
      `English Line 1 (e1): "${ctx.e1 || ''}"`,
      `English Line 2 (e2): "${ctx.e2 || ''}"`,
      `Department (dept): "${ctx.dept || ''}"`,
      `Division / Section (divn): "${ctx.divn || ''}"`,
      `Office / Building (ofc): "${ctx.ofc || ''}"`,
      `City: "${ctx.city || ''}"`,
      `PIN: "${ctx.pin || ''}"`,
      `Phone (ph): "${ctx.ph || ''}"`,
      `Email (em): "${ctx.em || ''}"`,
      `Website / Reg (wb): "${ctx.wb || ''}"`,
      `Enrolment / Statutory No.: "${ctx.enrolmentNo || ''}"`,
      `Signatory Name (sn): "${ctx.sn || ''}"`,
      `Signatory Designation (sd): "${ctx.sd || ''}"`,
      `Signatory Phone / Extn (sp): "${ctx.sp || ''}"`,
      `Signatory Hindi Name (sh): "${ctx.sh || ''}"`,
      `Constituency / Circle (sc): "${ctx.sc || ''}"`,
      `File No. (fno): "${ctx.fno || ''}"`,
      `Date (dt): "${gt.dt || ''}"`,
      `Previous recipient from an earlier letter (NOT ground truth for this generation — do NOT copy it unless the new brief names the same recipient; generate a fresh recipient from the new brief): "${gt.toD || ''}"`,
      `Recipient Address (toA): "${gt.toA || ''}"`,
      `Previous subject from an earlier letter (NOT ground truth for this generation — do NOT copy it unless the new brief is about the same topic; generate a fresh subject from the new brief): "${gt.sub || ''}"`,
      `Reference (ref): "${ctx.ref || ''}"`,
      `Salutation (sal): "${gt.sal || ''}"`,
      `Closing (cls): "${gt.cls || ''}"`,
      `Recipient fallback if the brief does not name one: "${recipientFallback}"`,
    ].join('\n- ');

    const userPrompt = `USER REQUEST & BRIEF:
"${description}"

CONTEXT & GROUND TRUTH FIELDS:
- ${fullContextLines}

INSTRUCTIONS:
- Draft a complete, realistic letter body tailored strictly to this context.
${generationMode === 'full' ? '- ENTIRE LETTERHEAD MODE: Fill header fields (e1, dept) and signatory designation (sd) from the SENDER named in the brief itself, even if the form fields are empty. Do not leave sd/e1/dept blank when the brief names a sender office/designation (for example, a brief saying "from Deputy Chief Minister, Government of Maharashtra" must produce that designation and that government as the letterhead). dept must be the OFFICE (e.g. "Office of the Deputy Chief Minister") — never the government name alone (that is e1) and never the bare designation alone (that is sd). Leave phone, email, city, PIN, and street address blank if not given — never invent them, and never add an emblem/seal.' : ''}
- Use the typed name "${ctx.sn || ''}" directly without hallucinating different officials.
- Do NOT copy the previous subject or previous recipient above into this letter unless the new brief is about the same topic and names the same recipient. Generate a fresh subject and a fresh recipient from the new brief.
- Do NOT generate fake @nic.in or @gov.in emails.
- Return ONLY the JSON object.`;

    // Generation with one repair retry: a non-JSON reply, or a body
    // too short to be a letter, gets one stricter retry before we
    // fall back to deterministic server-side completions.
    let letterData: Record<string, unknown> | null = null;
    let resultModel = '';
    let lastContent = '';
    let lastParseError: Error | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const messages: GroqMessage[] = attempt === 0
        ? [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ]
        : [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
            { role: 'assistant', content: lastContent },
            {
              role: 'user',
              content: 'REPAIR: Your previous reply was not usable as a complete letter (it was not valid JSON, or its body was too short). Return ONLY a valid JSON object matching the schema above, with a complete body of several paragraphs, a subject, a recipient, a salutation, and a closing. Do not invent names, companies, phone numbers, emails, dates, amounts, or page counts; use ______ for unknown details.',
            },
          ];
      const result = await callGroqWithFallback(messages, 3500);
      resultModel = result.model;
      lastContent = result.content;
      try {
        const parsed = extractJsonObject(result.content);
        const parsedBody = str(parsed.body).trim();
        if (parsedBody.length < 150 && attempt === 0) {
          // Parsed, but too short to be a letter — retry once.
          letterData = parsed;
          continue;
        }
        letterData = parsed;
        break;
      } catch (err) {
        lastParseError = err instanceof Error ? err : new Error(String(err));
        letterData = null;
        continue;
      }
    }
    if (!letterData) {
      throw lastParseError ?? new Error('Model returned an invalid JSON response after a retry');
    }

    // Header/contact pick — Full mode now REPLACES instead of
    // patching (Defect 2). The old rule fell back to the original
    // form whenever the model returned nothing, so a previous
    // letter's Deputy Chief Minister, doctor's name, or city (Pune)
    // survived into the next, unrelated letter — even though Entire
    // Letterhead mode promises to replace headers. New order in Full
    // mode, per field: a field the user explicitly typed this session
    // (userEdited) is ground truth and always wins; otherwise the
    // model value wins; otherwise the brief-derived sender (header
    // fields only); otherwise a PRESET value for that field (Defect 6:
    // clicking a preset is an explicit user choice, so it survives
    // when the model gives nothing — but it sits BELOW model and
    // brief-sender, so a new brief's sender still beats an old
    // preset); otherwise BLANK — never the previous letter's value.
    // Body-Only mode is unchanged: ground truth wins exactly,
    // because its promise is "keep my headers".
    // Brief-derived sender (Full mode only, see extractSenderFromBrief):
    // if neither the model nor a typed form value gives a header or
    // designation, the sender named in the brief itself fills it —
    // that is how Entire Letterhead mode keeps its promise without
    // inventing anything. Phone/email/address/city/PIN are never
    // brief-derived.
    const briefSender = generationMode === 'full'
      ? extractSenderFromBrief(description)
      : {};
    const pickHeader = (field: string, aiVal: unknown, gtVal: string, isContact: boolean, senderVal?: string): string => {
      const ai = str(aiVal).trim();
      if (generationMode === 'full') {
        if (userEdited.has(field)) return gtVal;
        if (ai && !isPlaceholderValue(ai)) return ai;
        if (!isContact && senderVal) return senderVal;
        // Preset fallback (Defect 6): gt is placeholder-stripped, so
        // a preset placeholder ("Advocate Name", "Chamber Address")
        // is already '' here and cannot survive as literal text.
        if (presetFields.has(field) && gtVal) return gtVal;
        return '';
      }
      if (isContact && gtVal) return gtVal;
      if (ai && !isPlaceholderValue(ai)) return ai;
      return gtVal;
    };

    // Strip trailing commas from sal/cls — the paper renderer appends its own comma
    const cleanSal = str(letterData.sal).trim().replace(/,+\s*$/, '');
    const cleanCls = str(letterData.cls).trim().replace(/,+\s*$/, '');
    // Language enforcement (Defect 5): for an explicit Marathi/Hindi
    // generation, an English form value must NOT win over the language
    // protocol. Order: AI-supplied language-correct value, then a
    // form value already in that language (an explicit Devanagari
    // dropdown choice still wins over a default), then the language
    // default. English generation keeps the old behaviour. Marathi
    // closing is never Hindi भवदीय; a Hindi generation never keeps
    // an English closing.
    const isNonEnglishGen = targetLang === 'mr' || targetLang === 'hi';
    const langSal = salutationFor(resolved, targetLang);
    const langCls = closingFor(resolved, targetLang);
    // Route-level salutation/closing enforcement (Defect 5). The old
    // English fallback was `ai || gt.sal || langSal`, so a previous
    // letter's salutation/closing leaked into the next letter
    // (a legal notice inherited "Respected Sir / With warm regards"
    // from an appreciation letter; a circular to "All Staff" kept
    // "Sir / Yours faithfully"). Salutation and closing are
    // per-letter, type-dependent values — not identity — so the
    // previous letter's values never win: only a value the user
    // explicitly picked (userEdited) survives; otherwise the type
    // protocol wins where it defines one, else the model value
    // (with the warm pair normalised away for non-appreciation
    // types), else the language default.
    const protocolSalOverride = TYPE_PROTOCOLS[resolved].salutation[targetLang] !== undefined;
    const protocolClsOverride = TYPE_PROTOCOLS[resolved].closing[targetLang] !== undefined;
    const WARM_CLOSINGS = ['with warm regards', 'warm regards', 'with warmest regards'];
    const enforceSal = (ai: string): string => {
      if (isNonEnglishGen) {
        if (ai && isDevanagari(ai)) return ai;
        if (userEdited.has('sal') && gt.sal && isDevanagari(gt.sal)) return gt.sal.replace(/,+\s*$/, '');
        return langSal;
      }
      if (userEdited.has('sal') && gt.sal) return gt.sal.replace(/,+\s*$/, '');
      // Legal notice to a specific recipient: the formal pair, never
      // the warm appreciation pair. (Announcement notices, whose
      // recipient is generic, take the protocol "All Concerned".)
      if (resolved === 'notice' && recipientIsSpecific) return 'Dear Sir/Madam';
      if (protocolSalOverride) return langSal;
      if (resolved === 'appreciation') {
        if (ai && ai !== 'Sir' && ai !== 'Sir/Madam') return ai;
        return langSal;
      }
      return ai || langSal;
    };
    const enforceCls = (ai: string): string => {
      if (targetLang === 'mr' && (ai === 'भवदीय' || ai === 'भवदीया')) return langCls;
      if (isNonEnglishGen) {
        if (ai && isDevanagari(ai)) return ai;
        if (userEdited.has('cls') && gt.cls && isDevanagari(gt.cls)) return gt.cls.replace(/,+\s*$/, '');
        return langCls;
      }
      if (userEdited.has('cls') && gt.cls) return gt.cls.replace(/,+\s*$/, '');
      if (resolved === 'notice' && recipientIsSpecific) return 'Yours faithfully';
      if (protocolClsOverride) return langCls;
      if (resolved === 'appreciation') {
        if (ai && ai !== 'Yours faithfully') return ai;
        return langCls;
      }
      // The warm pair is reserved for appreciation/congratulatory
      // letters: a formal letter carrying it (stale value or model
      // drift) falls back to the standard formal closing.
      if (ai && WARM_CLOSINGS.includes(ai.toLowerCase())) return langCls;
      return ai || langCls;
    };
    const rawBody = str(letterData.body).trim();
    let bodyVal = rawBody.length >= 150
      ? rawBody
      : buildFallbackBody(resolved, description, targetLang, secondLang);
    // Numbering consistency (Defect 9): appreciation/congratulatory
    // letters are flowing prose per the type protocol, but the model
    // nondeterministically numbered them in one path and not the
    // other (same birthday prompt: prose in the modal, numbered in
    // the sidebar). Both paths go through this route, so stripping
    // paragraph-leading numbers here makes the two paths agree.
    // Numbered structure is kept for every other type.
    if (resolved === 'appreciation') {
      bodyVal = bodyVal
        .split('\n\n')
        .map((para) => para.replace(/^\s*\d+[.)]\s+/, ''))
        .join('\n\n');
    }
    // Legal-notice grounds sanitizer (Defect 1): prompt bans alone
    // did not bite — a Custom + Legal-preset notice still asserted
    // breaches as "e.g." examples. Deterministic backstop, applied
    // ONLY to legal notices (not announcement notices): allegation
    // sentences whose trigger words are absent from the brief become
    // a ______ grounds blank (first per paragraph) or are dropped.
    // Grounds the brief DOES state survive untouched.
    if (legalNotice) {
      bodyVal = stripInventedLegalGrounds(bodyVal, description);
    }
    // RTI-reply guarantee (Defect 4a): the appeal paragraph MUST cite
    // "Section 19(1)" by number, whatever model generated the body
    // (including a fallback model that paraphrased it away). Append a
    // standard paragraph only if the citation is absent, using the
    // First Appellate Authority designation from the brief when given.
    if (resolved === 'rti_reply' && !/19\s*\(\s*1\s*\)/.test(bodyVal)) {
      const faaMatch = description.match(/(?:first appellate authority|FAA)\s*:\s*([^.;\n]+)/i);
      const faa = faaMatch ? faaMatch[1].trim() : '______ (First Appellate Authority)';
      bodyVal += `\n\nYou are entitled to file a first appeal under Section 19(1) of the Right to Information Act, 2005, within thirty (30) days from the receipt of this reply, before the First Appellate Authority, ${faa}.`;
    }
    // Subject (Defect 2): the AI subject for THIS brief wins; otherwise
    // synthesize from the brief. synthesizeSubject reuses the previous
    // subject only when the brief matches it — a stale subject from a
    // different topic is never carried over. Office/header fields keep
    // the preserve rule; subject (and recipient below) are the
    // documented exception because they are topic-dependent.
    const subVal = str(letterData.sub).trim() || synthesizeSubject(resolved, description, gt.sub);
    // Recipient: same topic rule. If the topic changed and the model
    // merely copied the previous recipient, use the type fallback
    // instead of the stale recipient.
    // Job A3: in Full mode To follows the SAME replace rule as every
    // other AI-owned field (typed > model > preset > blank/fallback),
    // never a previous letter's value. The old code fell back to
    // gt.toD / gt.toA whenever the model returned nothing and the
    // topic had not changed — that is how "Branch Manager" from one
    // letter carried into the next Fully-AI letter. In Full mode a
    // missing model recipient becomes the type fallback (toD) or
    // blank (toA), unless the user typed it or a preset set it.
    // Body-Only mode keeps the old preserve rule exactly.
    const aiToD = str(letterData.toD).trim();
    const topicChanged = Boolean(gt.sub) && !briefMatchesSubject(description, gt.sub);
    const toDVal = generationMode === 'full'
      ? (userEdited.has('toD') ? gt.toD
        : (aiToD && !(topicChanged && aiToD === gt.toD) ? aiToD
          : (presetFields.has('toD') && gt.toD ? gt.toD : recipientFallback)))
      : (aiToD && !(topicChanged && aiToD === gt.toD)
        ? aiToD
        : topicChanged
          ? recipientFallback
          : aiToD || gt.toD || recipientFallback);
    // Recipient address follows the same topic rule as the recipient:
    // a changed topic never inherits the previous letter's address.
    const aiToA = str(letterData.toA).trim();
    const toAVal = generationMode === 'full'
      ? (userEdited.has('toA') ? gt.toA
        : (aiToA && !(topicChanged && aiToA === gt.toA) ? aiToA
          : (presetFields.has('toA') && gt.toA ? gt.toA : '')))
      : (aiToA && !(topicChanged && aiToA === gt.toA)
        ? aiToA
        : topicChanged
          ? ''
          : aiToA || gt.toA);
    // Whether the recipient is a specific person/office (legal-notice
    // branch of salutation enforcement) as opposed to a group address.
    const GENERIC_RECIPIENTS = new Set([
      'all concerned', 'all department heads', 'all staff',
      'all readers', 'to whom it may concern',
    ]);
    const recipientIsSpecific = Boolean(toDVal)
      && !GENERIC_RECIPIENTS.has(toDVal.trim().toLowerCase())
      && !toDVal.includes('______');
    const salVal = enforceSal(cleanSal);
    const clsVal = enforceCls(cleanCls);
    // Enclosure contradiction (Defect 4, minor): an RTI reply that
    // withholds an item must not also list that same item as an
    // enclosure. Drop enclosure entries matching the withheld phrase
    // from the brief (e.g. "withhold file notings" drops an entry
    // containing "notings").
    let enclListVal: unknown[] = Array.isArray(letterData.enclList)
      ? (letterData.enclList as unknown[])
      : [];
    if (resolved === 'rti_reply') {
      const withholdMatch = description.match(/withhold(?:ing|ed)?\s+(?:the\s+)?([^.;\n]+)/i);
      if (withholdMatch) {
        const keywords = withholdMatch[1].toLowerCase().split(/[^a-z]+/)
          .filter((w) => w.length >= 4 && !['under', 'section', 'with', 'from'].includes(w));
        if (keywords.length) {
          enclListVal = enclListVal.filter((e) => {
            const t = String(e).toLowerCase();
            return !keywords.some((k) => t.includes(k));
          });
        }
      }
    }

    // Header-duplication normalisation (Full mode only; Body-Only
    // keeps ground truth exactly). The model is unreliable about
    // which header slot a sender phrase belongs in: one run put the
    // government name in dept (header printed it twice), another
    // put the bare designation in dept (it then printed twice under
    // the signature, next to the sd line). dept is a single field
    // used in BOTH the header and the signature block, so it must
    // differ from every other line it could duplicate: the heading
    // lines, the signatory designation, and the designation-only
    // part of sd. A duplicated dept is replaced with the
    // brief-derived office ("Office of the …") when one exists,
    // otherwise dropped — never left duplicating another line.
    const normDup = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Designation follows the same Full-mode replace rule as headers:
    // a typed designation wins, otherwise the model, otherwise the
    // brief sender, otherwise a preset value — never the previous
    // letter's designation.
    let sdVal = generationMode === 'full'
      ? (userEdited.has('sd') ? gt.sd : (str(letterData.sd) || briefSender.sd || (presetFields.has('sd') ? gt.sd : '')))
      : (gt.sd ? gt.sd : str(letterData.sd));
    const e1Val = pickHeader('e1', letterData.e1, gt.e1, false, briefSender.e1);
    const e2Val = pickHeader('e2', letterData.e2, gt.e2, false);
    const h1Val = pickHeader('h1', letterData.h1, gt.h1, false);
    const h2Val = pickHeader('h2', letterData.h2, gt.h2, false);
    const deptRaw = pickHeader('dept', letterData.dept, gt.dept, false, briefSender.dept);
    let deptVal = deptRaw;
    if (generationMode === 'full' && deptRaw) {
      const designationOnly = sdVal.split(',')[0].trim();
      const duplicates = [e1Val, e2Val, h1Val, h2Val, sdVal, designationOnly, briefSender.e1 || '']
        .some((other) => other.trim() && normDup(deptRaw) === normDup(other));
      if (duplicates) {
        deptVal = (briefSender.dept
          && normDup(briefSender.dept) !== normDup(e1Val)
          && normDup(briefSender.dept) !== normDup(designationOnly))
          ? briefSender.dept
          : '';
      }
    }
    // Date-fragment guard, backstop to the extractSender guard: a dept
    // or designation that looks like a date is dropped, never
    // rendered as an official office. A value the user literally
    // typed is exempt — the guard targets model/brief-derived values.
    if (!userEdited.has('dept') && looksLikeDateFragment(deptVal)) deptVal = '';
    if (!userEdited.has('sd') && looksLikeDateFragment(sdVal)) sdVal = '';
    // Signatory name, file number, and reference follow the Full-mode
    // replace rule too (a previous letter's file number must not leak
    // into a new letter); the date is system-seeded today, so it is
    // always model-or-current, then localised for Hindi/Marathi.
    const snVal = generationMode === 'full'
      ? (userEdited.has('sn') ? gt.sn : (str(letterData.sn) && !isPlaceholderValue(str(letterData.sn)) ? str(letterData.sn) : ''))
      : (gt.sn ? gt.sn : str(letterData.sn));
    const shVal = generationMode === 'full'
      ? (userEdited.has('sh') ? gt.sh : str(letterData.sh))
      : (str(letterData.sh) || gt.sh);
    const fnoVal = generationMode === 'full'
      ? (userEdited.has('fno') ? gt.fno : str(letterData.fno))
      : (str(letterData.fno) || gt.fno);
    const refVal = generationMode === 'full'
      ? (userEdited.has('ref') ? gt.ref : str(letterData.ref))
      : (str(letterData.ref) || gt.ref);
    const dtVal = localiseDate(str(letterData.dt) || gt.dt, targetLang);
    // Ungrounded dept/designation guard (Defect 7): a model-supplied
    // dept/sd whose substantive words appear nowhere in the brief,
    // in typed fields, or in preset fields is dropped (or replaced
    // with the brief-derived sender office/designation where one
    // exists). Typed, preset, and brief-sender values are exempt —
    // the guard targets model inventions only ("Corporate Office",
    // "HR Department" for a product-launch brief naming neither).
    // TRADEOFF, documented: this also drops legitimate model
    // inferences whose words happen to appear nowhere in the brief /
    // typed / preset fields (e.g. inferring "Legal Department" from
    // an "advocate" brief that never says "legal"). That is the
    // intended price of the no-invention rule: a department the user
    // wants can be typed or preset, and then it survives. The
    // birthday sender case is unaffected — its dept/sd come from the
    // brief sender (or from a model value whose words ARE in the
    // brief), never from an ungrounded invention.
    {
      const allowed = new Set<string>(tokensOf(description));
      for (const f of new Set([...userEdited, ...presetFields])) {
        for (const t of tokensOf(gt[f] || '')) allowed.add(t);
      }
      const aiDept = str(letterData.dept).trim();
      const aiSd = str(letterData.sd).trim();
      if (!userEdited.has('dept') && aiDept && !isPlaceholderValue(aiDept) && deptVal === aiDept
        && isUngroundedValue(deptVal, allowed)) {
        deptVal = (briefSender.dept && normDup(briefSender.dept) !== normDup(e1Val)) ? briefSender.dept : '';
      }
      if (!userEdited.has('sd') && aiSd && sdVal === aiSd
        && isUngroundedValue(sdVal, allowed)) {
        sdVal = briefSender.sd || '';
      }
    }
    // Duplicated closing (Defect 3): the paper always renders the
    // Closing field, so a body ending in a closing phrase printed
    // two closings (sidebar Fully-AI path). Strip trailing closing
    // lines/paragraphs from the body — and trailing signature lines,
    // which the paper also renders separately — in BOTH paths, for
    // all types. A closing inside the body is untouched.
    bodyVal = stripTrailingClosing(bodyVal, [snVal, sdVal]);

    const finalData = {
      ...letterData,
      detected_type: detected,
      letter_type: resolved,
      is_personal: protocol.isPersonal,
      h1: h1Val,
      h2: h2Val,
      e1: e1Val,
      e2: e2Val,
      dept: deptVal,
      divn: pickHeader('divn', letterData.divn, gt.divn, false),
      ofc: pickHeader('ofc', letterData.ofc, gt.ofc, false),
      city: pickHeader('city', letterData.city, gt.city, false),
      pin: pickHeader('pin', letterData.pin, gt.pin, false),
      ph: pickHeader('ph', letterData.ph, gt.ph, true),
      em: pickHeader('em', letterData.em, gt.em, true),
      wb: pickHeader('wb', letterData.wb, gt.wb, false),
      sp: pickHeader('sp', letterData.sp, gt.sp, true),
      sc: pickHeader('sc', letterData.sc, gt.sc, false),
      dt: dtVal,
      enrolmentNo: pickHeader('enrolmentNo', letterData.enrolmentNo, gt.enrolmentNo, false),
      sub: subVal,
      sal: salVal,
      cls: clsVal,
      sn: snVal,
      // Designation (sdVal, computed above): in Full mode a typed
      // designation wins, otherwise the model, otherwise the brief
      // sender — so the sidebar Full path and the chat-modal Full
      // path agree, instead of the modal filling a designation the
      // sidebar left blank. Dept normalisation above compares dept
      // against sdVal, and the date-fragment guard has already
      // dropped any date-like designation.
      sd: sdVal,
      sh: shVal,
      toD: localiseRecipient(toDVal, targetLang),
      toA: toAVal,
      fno: fnoVal,
      ref: refVal,
      body: bodyVal,
      encl: enclListVal.length
        ? enclListVal.join(', ')
        : Array.isArray(letterData.enclList)
          ? '' // List existed but was filtered (e.g. withheld item) — do not resurrect it via the string field.
          : (str(letterData.encl) || ''),
      copy_to: Array.isArray(letterData.copyList) ? (letterData.copyList as unknown[]) : (letterData.copy_to || []),
    };

    const missingFields = computeMissingFields({
      type: resolved,
      toD: finalData.toD,
      sn: finalData.sn,
      sd: finalData.sd,
      sal: finalData.sal,
      body: finalData.body,
      brief: description,
    });

    return NextResponse.json({
      success: true,
      data: { ...finalData, missing_fields: missingFields },
      model: resultModel,
      missing_fields: missingFields,
      detected_type: detected,
      letter_type: resolved,
    });
  } catch (error) {
    console.error('Letter generation error:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate letter' },
      { status: 500 }
    );
  }
}

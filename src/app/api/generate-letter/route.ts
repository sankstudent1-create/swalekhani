import { NextRequest, NextResponse } from 'next/server';
import {
  TYPE_PROTOCOLS,
  resolveLetterType,
  inferRecipient,
  salutationFor,
  closingFor,
  synthesizeSubject,
  buildFallbackBody,
  computeMissingFields,
  protocolPrompt,
  stripPlaceholders,
  isPlaceholderValue,
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
  currentContext?: {
    department?: string;
    office?: string;
    city?: string;
    officeType?: string;
    template?: string;
    tpl?: string;
    mode?: 'content' | 'full';
    form?: Record<string, unknown>;
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
    const { resolved, detected } = resolveLetterType(letterType, description, officeType);
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
   - If user-filled signatory fields (Name 'sn', Designation 'sd', Department 'dept', Office 'ofc', City 'city', Subject 'sub') are provided in the prompt, treat them as IMMUTABLE GROUND TRUTH.
   - NEVER overwrite or invent fake government officials (e.g. NEVER generate invented officials or bureaucrats).
   - NEVER invent fictional ministries, departments, or fake government email addresses (@nic.in, @gov.in). Empty contact fields MUST remain empty — DO NOT hallucinate phone numbers or emails.
   - NEVER invent a person, company, ministry, phone number, email, date, amount, or page count to fill a gap. Use ______ blanks for genuinely unknown details.
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

JSON SCHEMA (return header/contact fields when the ground truth gives them; in Body-Only mode return them exactly as ground truth, never invented):
{
  "detected_type": "string",
  "is_personal": false,
  "h1": "Hindi heading line 1 (or empty)",
  "h2": "Hindi heading line 2 (or empty)",
  "e1": "English heading line 1 (or empty)",
  "e2": "English heading line 2 (or empty)",
  "dept": "Department (or empty)",
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

    const fullContextLines = [
      `Active Template / Profession: ${targetPreset || officeType || 'General Letter'}`,
      `Office Type: ${officeType || '(not set)'}`,
      `Letter Layout Template: ${template || '(not set)'}`,
      `Generation Mode: ${generationMode === 'full' ? 'Entire Letterhead (headers may be completed from context)' : 'Body & Content Only (header/contact fields are ground truth — return them unchanged, never invented)'}`,
      `Target Language: ${targetLang} (${targetLang === 'mr' ? 'मराठी' : targetLang === 'hi' ? 'हिंदी' : targetLang === 'bi' ? `Bilingual English + ${secondLang === 'mr' ? 'मराठी' : 'हिन्दी'}` : 'English'})`,
      `Hindi Line 1 (h1): "${gt.h1 || ''}"`,
      `Hindi Line 2 (h2): "${gt.h2 || ''}"`,
      `English Line 1 (e1): "${gt.e1 || ''}"`,
      `English Line 2 (e2): "${gt.e2 || ''}"`,
      `Department (dept): "${gt.dept || ''}"`,
      `Division / Section (divn): "${gt.divn || ''}"`,
      `Office / Building (ofc): "${gt.ofc || ''}"`,
      `City: "${gt.city || ''}"`,
      `PIN: "${gt.pin || ''}"`,
      `Phone (ph): "${gt.ph || ''}"`,
      `Email (em): "${gt.em || ''}"`,
      `Website / Reg (wb): "${gt.wb || ''}"`,
      `Enrolment / Statutory No.: "${gt.enrolmentNo || ''}"`,
      `Signatory Name (sn): "${gt.sn || ''}"`,
      `Signatory Designation (sd): "${gt.sd || ''}"`,
      `Signatory Phone / Extn (sp): "${gt.sp || ''}"`,
      `Signatory Hindi Name (sh): "${gt.sh || ''}"`,
      `Constituency / Circle (sc): "${gt.sc || ''}"`,
      `File No. (fno): "${gt.fno || ''}"`,
      `Date (dt): "${gt.dt || ''}"`,
      `Recipient (toD): "${gt.toD || ''}"`,
      `Recipient Address (toA): "${gt.toA || ''}"`,
      `Subject (sub): "${gt.sub || ''}"`,
      `Reference (ref): "${gt.ref || ''}"`,
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
- Use the typed name "${gt.sn || ''}" and subject "${gt.sub || ''}" directly without hallucinating different officials.
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

    // Header/contact pick: Body-Only mode keeps ground truth exactly;
    // Full mode may complete organisation fields from the model, but
    // a real phone/email from ground truth always wins over a model
    // invention, and placeholder values are never accepted.
    const pickHeader = (aiVal: unknown, gtVal: string, isContact: boolean): string => {
      const ai = str(aiVal).trim();
      if (generationMode === 'full' && !isContact) {
        if (ai && !isPlaceholderValue(ai)) return ai;
        return gtVal;
      }
      if (isContact && gtVal) return gtVal;
      if (generationMode === 'full' && ai && !isPlaceholderValue(ai)) return ai;
      return gtVal;
    };

    // Strip trailing commas from sal/cls — the paper renderer appends its own comma
    const cleanSal = str(letterData.sal).trim().replace(/,+\s*$/, '');
    const cleanCls = str(letterData.cls).trim().replace(/,+\s*$/, '');
    const salFallback = gt.sal ? gt.sal.replace(/,+\s*$/, '') : salutationFor(resolved, targetLang);
    const clsFallback = gt.cls ? gt.cls.replace(/,+\s*$/, '') : closingFor(resolved, targetLang);
    const rawBody = str(letterData.body).trim();
    const bodyVal = rawBody.length >= 150
      ? rawBody
      : buildFallbackBody(resolved, description, targetLang, secondLang);
    const subVal = synthesizeSubject(resolved, description, str(letterData.sub) || gt.sub);
    const toDVal = str(letterData.toD) || gt.toD || recipientFallback;

    const finalData = {
      ...letterData,
      detected_type: detected,
      letter_type: resolved,
      is_personal: protocol.isPersonal,
      h1: pickHeader(letterData.h1, gt.h1, false),
      h2: pickHeader(letterData.h2, gt.h2, false),
      e1: pickHeader(letterData.e1, gt.e1, false),
      e2: pickHeader(letterData.e2, gt.e2, false),
      dept: pickHeader(letterData.dept, gt.dept, false),
      divn: pickHeader(letterData.divn, gt.divn, false),
      ofc: pickHeader(letterData.ofc, gt.ofc, false),
      city: pickHeader(letterData.city, gt.city, false),
      pin: pickHeader(letterData.pin, gt.pin, false),
      ph: pickHeader(letterData.ph, gt.ph, true),
      em: pickHeader(letterData.em, gt.em, true),
      wb: pickHeader(letterData.wb, gt.wb, false),
      sp: pickHeader(letterData.sp, gt.sp, true),
      sc: pickHeader(letterData.sc, gt.sc, false),
      dt: pickHeader(letterData.dt, gt.dt, false),
      enrolmentNo: pickHeader(letterData.enrolmentNo, gt.enrolmentNo, false),
      sub: subVal,
      sal: cleanSal || salFallback,
      cls: cleanCls || clsFallback,
      sn: gt.sn ? gt.sn : str(letterData.sn),
      sd: gt.sd ? gt.sd : str(letterData.sd),
      sh: str(letterData.sh) || gt.sh,
      toD: toDVal,
      toA: str(letterData.toA) || gt.toA,
      fno: str(letterData.fno) || gt.fno,
      ref: str(letterData.ref) || gt.ref,
      body: bodyVal,
      encl: Array.isArray(letterData.enclList) ? (letterData.enclList as unknown[]).join(', ') : (str(letterData.encl) || ''),
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

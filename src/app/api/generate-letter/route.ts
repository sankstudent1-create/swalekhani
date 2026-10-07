import { NextRequest, NextResponse } from 'next/server';

interface GroqMessage {
  role: 'user' | 'system';
  content: string;
}

interface LetterGenerationRequest {
  description: string;
  letterType?: string;
  language?: string;
  templatePreset?: string;
  currentForm?: Record<string, any>;
  currentContext?: {
    department?: string;
    office?: string;
    city?: string;
    form?: Record<string, any>;
  };
}

// ── Groq model fallback chain ─────────────────────────────────
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

    const err = new Error(errorMsg) as Error & { isRateLimit?: boolean; statusCode?: number };
    err.isRateLimit = isRateLimit;
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
      const e = err as Error & { isRateLimit?: boolean };
      lastError = e;
      if (e.isRateLimit) {
        continue;
      }
      throw e;
    }
  }

  throw lastError ?? new Error('All Groq models exhausted or unavailable');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LetterGenerationRequest;
    const { 
      description, 
      letterType = 'corporate', 
      language = 'en', 
      templatePreset = '',
      currentForm = {},
      currentContext = {} 
    } = body;

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

    const form = currentForm && Object.keys(currentForm).length > 0 
      ? currentForm 
      : (currentContext.form || {});

    const targetPreset = templatePreset || (currentContext as any).template || '';

    // Language detection — Devanagari script aware
    let targetLang = (language || 'en').toLowerCase();
    const descLower = (description || '').toLowerCase();
    const hasDevanagari = /[\u0900-\u097F]/.test(description || '');

    const isMarathi =
      targetLang === 'mr' ||
      descLower.includes('marathi') ||
      /(मराठी|मध्ये|पत्र लिहा|विनंती अर्ज|रजा अर्ज|महोदय)/.test(description || '') ||
      /\b(liha|patra|arja|pahije|baddal|karave)\b/i.test(description || '');

    // Any Devanagari text that isn't Marathi is treated as Hindi (covers
    // बिजली बिल, शिकायत पत्र, छुट्टी आवेदन etc. without keyword lists)
    const isHindi =
      !isMarathi && (
        targetLang === 'hi' ||
        hasDevanagari ||
        descLower.includes('hindi') ||
        /(आवेदन|पत्र लिखें|शिकायत|बिजली|छुट्टी)/.test(description || '') ||
        /\b(likhe|kripya|chahiye|aavedan)\b/i.test(description || '')
      );

    if (isMarathi) {
      targetLang = 'mr';
    } else if (isHindi) {
      targetLang = 'hi';
    }

    const systemPrompt = `You are an expert official letter drafting specialist for professional, statutory, and administrative correspondence across India (English, Marathi, and Hindi).

CRITICAL GROUND TRUTH & ANTI-HALLUCINATION RULES:
1. SENDER & SIGNATORY GROUND TRUTH:
   - If user-filled signatory fields (Name 'sn', Designation 'sd', Department 'dept', Office 'ofc', City 'city', Subject 'sub') are provided in the prompt, treat them as IMMUTABLE GROUND TRUTH.
   - NEVER overwrite or invent fake government officials (e.g. NEVER generate "Shri Rajesh Kumar" or invented bureaucrats).
   - NEVER invent fictional ministries, departments, or fake government email addresses (@nic.in, @gov.in). Empty contact fields MUST remain empty — DO NOT hallucinate phone numbers or emails.
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
   - If language is English ('en'):
     * Closing: "Yours faithfully," or "Yours sincerely,".
4. BODY PARAGRAPHS:
   - Generate a single, coherent, professionally phrased letter body. DO NOT repeat or duplicate paragraphs.
   - Use double newlines (\\n\\n) between paragraphs.
5. FORMAT PROTOCOL:
   - Return ONLY a valid JSON object matching the required schema. No markdown backticks, no conversational preamble.

MANDATORY FIELD RULES (never skip):
- "sub": ALWAYS generate a concise formal subject line derived from the user's request (e.g. "Request for Sick Leave — 2 Days.", "Complaint Regarding Defective Smartphone — Refund Request."). NEVER leave empty. If the user already typed a subject, keep or polish it — never blank it.
- "toD": ALWAYS infer the most likely recipient designation + organisation from the request (e.g. "Customer Service Manager, Flipkart Internet Pvt. Ltd." for a Flipkart complaint, "The Municipal Commissioner" for civic issues, "The Branch Manager" for bank letters). NEVER leave empty unless the request is a personal letter.
- "sal" and "cls" must strictly match the target language (see rules 3).
- "body": no [bracket] placeholders for core facts the user already gave (dates, names, amounts they mentioned must appear as real text). Only use ______ blanks for genuinely unknown details like order numbers.

JSON SCHEMA:
{
  "detected_type": "string",
  "is_personal": false,
  "fno": "File or Reference Number (or empty)",
  "toD": "Recipient Designation & Organization (always infer, never empty for formal letters)",
  "toA": "Recipient Address (or empty)",
  "sub": "Clear formal subject line (ALWAYS generate, never empty)",
  "ref": "Reference line if applicable (or empty)",
  "sal": "Salutation matching language",
  "body": "Single complete letter body with distinct paragraphs separated by \\n\\n",
  "cls": "Closing phrase strictly matching language (Marathi: 'आपला नम्र,', Hindi: 'भवदीय,', English: 'Yours faithfully,')",
  "sn": "Signatory Name (use user-provided name as ground truth)",
  "sh": "Devanagari / Hindi transliteration of signatory name if applicable",
  "sd": "Signatory Designation (use user-provided designation)",
  "enclList": ["Enclosure 1"] or [],
  "copyList": ["Copy recipient 1"] or []
}`;

    const userPrompt = `USER REQUEST & BRIEF:
"${description}"

CONTEXT & GROUND TRUTH FIELDS:
- Active Template / Profession: ${targetPreset || 'General Letter'}
- Target Language: ${targetLang} (${targetLang === 'mr' ? 'मराठी' : targetLang === 'hi' ? 'हिंदी' : 'English'})
- User Provided Signatory Name (sn): "${form.sn || ''}"
- User Provided Signatory Designation (sd): "${form.sd || ''}"
- User Provided Office / Dept: "${form.dept || form.ofc || ''}"
- User Provided Subject (sub): "${form.sub || ''}"
- User Provided Reference (ref): "${form.ref || ''}"
- User Provided Recipient (toD): "${form.toD || ''}"

INSTRUCTIONS:
- Draft a complete, realistic letter body tailored strictly to this context.
- Use the typed name "${form.sn || ''}" and subject "${form.sub || ''}" directly without hallucinating different officials.
- Do NOT generate fake @nic.in or @gov.in emails.
- Return ONLY the JSON object.`;

    const result = await callGroqWithFallback(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      3500
    );

    let cleanedResponse = result.content.trim();
    cleanedResponse = cleanedResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/, '');
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd   = cleanedResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.slice(jsonStart, jsonEnd + 1);
    }

    const letterData = JSON.parse(cleanedResponse.trim());

    // Ensure we don't overwrite user's ground-truth fields if they had them
    // Synthesize a subject from the description if the model left it empty
    const synthSub = (!letterData.sub && description)
      ? description.trim().charAt(0).toUpperCase() + description.trim().slice(1).replace(/\s+/g, ' ').slice(0, 90)
      : '';
    const finalData = {
      ...letterData,
      sub: letterData.sub || form.sub || synthSub,
      sal: letterData.sal || form.sal || (targetLang === 'mr' ? 'महोदय,' : targetLang === 'hi' ? 'महोदय,' : 'Sir/Madam,'),
      cls: letterData.cls || form.cls || (targetLang === 'mr' ? 'आपला नम्र,' : targetLang === 'hi' ? 'भवदीय,' : 'Yours faithfully,'),
      sn: form.sn ? form.sn : (letterData.sn || ''),
      sd: form.sd ? form.sd : (letterData.sd || ''),
      sh: letterData.sh || form.sh || '',
      toD: letterData.toD || form.toD || '',
      toA: letterData.toA || form.toA || '',
      fno: letterData.fno || form.fno || '',
      ref: letterData.ref || form.ref || '',
      body: (letterData.body || '').trim(),
      encl: Array.isArray(letterData.enclList) ? letterData.enclList.join(', ') : (letterData.encl || ''),
      copy_to: Array.isArray(letterData.copyList) ? letterData.copyList : (letterData.copy_to || []),
    };

    return NextResponse.json({
      success: true,
      data: finalData,
      model: result.model,
    });
  } catch (error) {
    console.error('Letter generation error:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate letter' },
      { status: 500 }
    );
  }
}

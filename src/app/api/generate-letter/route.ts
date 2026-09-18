import { NextRequest, NextResponse } from 'next/server';

interface GroqMessage {
  role: 'user' | 'system';
  content: string;
}

interface LetterGenerationRequest {
  description: string;
  letterType?: string;
  language?: string;
  currentContext?: {
    department?: string;
    office?: string;
    city?: string;
  };
}

// ── Groq model fallback chain ─────────────────────────────────
// Ordered by quality → speed. Falls back automatically on rate-limit (429).
const GROQ_FALLBACK_MODELS = [
  'openai/gpt-oss-120b',              // Best quality — try first
  'openai/gpt-oss-20b',               // Fast fallback
  'qwen/qwen3.6-27b',                 // Secondary fallback
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
      temperature: 0.6,
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

  // Build model order: preferred first (if set), then fallback chain
  const models = preferredModel && !GROQ_FALLBACK_MODELS.includes(preferredModel)
    ? [preferredModel, ...GROQ_FALLBACK_MODELS]
    : preferredModel
      ? [preferredModel, ...GROQ_FALLBACK_MODELS.filter(m => m !== preferredModel)]
      : GROQ_FALLBACK_MODELS;

  let lastError: Error | null = null;

  for (const model of models) {
    try {
      console.log(`[groq] Trying model: ${model}`);
      const result = await callGroqModel(messages, model, maxTokens, apiKey);
      console.log(`[groq] Success with model: ${model}`);
      return result;
    } catch (err) {
      const e = err as Error & { isRateLimit?: boolean };
      lastError = e;
      if (e.isRateLimit) {
        console.warn(`[groq] Rate limit on ${model}, trying next model…`);
        continue; // try next model
      }
      // Non-rate-limit error — don't fallback, just throw
      throw e;
    }
  }

  throw lastError ?? new Error('All Groq models exhausted or unavailable');
}


export async function POST(request: NextRequest) {
  // Guard: ensure GROQ_API_KEY is configured in Vercel environment variables
  if (!process.env.GROQ_API_KEY) {
    console.error('[letterpad] GROQ_API_KEY is not set in environment variables');
    return NextResponse.json(
      { error: 'Server configuration error: GROQ_API_KEY is not set. Please add it to your Vercel environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as LetterGenerationRequest;
    const { description, letterType = 'office_order', language = 'en', currentContext = {} } = body;

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert Government of India and State Government official correspondence specialist with exhaustive knowledge of the Central Secretariat Manual of Office Procedure (CSMOP 16th Edition), State Emblem of India (Prohibition of Improper Use) Act 2005, and Indian administrative protocols.

Your task is to generate COMPLETE, AUTHENTIC, and FLAWLESS letters matching official Indian administrative and correspondence standards. You must DETERMINE the correct ministry, department, office, and signatory FROM THE USER'S DESCRIPTION.

CRITICAL: Respond with ONLY a valid JSON object — no markdown, no code fences, no explanations.

The JSON must have exactly these fields:
{
  "h1": "Hindi Line 1 derived from sender context (e.g. भारत सरकार or महाराष्ट्र शासन, or empty for personal)",
  "h2": "Hindi Line 2 — ministry/department in Hindi (or empty for personal)",
  "e1": "English Line 1 (e.g. Government of India or Government of Maharashtra, or empty for personal)",
  "e2": "English Line 2 — ministry/department in English (or empty for personal)",
  "dept": "Full department name derived from user description (or empty for personal)",
  "divn": "Division/Section appropriate to context (e.g. (Establishment Division))",
  "ofc": "Office or building name appropriate to sender",
  "city": "City of sender office",
  "pin": "PIN Code of sender office",
  "ph": "Realistic official phone number",
  "em": "Official email (@gov.in, @nic.in, or institution email)",
  "wb": "Official website",
  "fno": "File Number (e.g. F.No.12-04/2026-Estt(Pay-I) or empty for personal)",
  "toD": "Recipient Designation/Title",
  "toA": "Recipient Office Address (use \\n for line breaks)",
  "sub": "Subject Line — concise, professional, starting with 'Subject: ' or 'विषय: '",
  "ref": "Reference to previous correspondence or empty string",
  "sal": "Salutation ('Sir / Madam', 'Dear Shri [Surname]', 'Respected Principal', 'आदरणीय पिताजी', etc.)",
  "body": "Complete letter body with proper formal paragraphs. Use \\n\\n for paragraph breaks.",
  "cls": "Closing phrase ('Yours faithfully', 'Yours sincerely', 'Yours obediently', 'With warm regards', 'आपका आज्ञाकारी')",
  "sn": "Signatory Name",
  "sd": "Signatory Designation",
  "sp2": "Direct Phone/Extension (optional)",
  "sh": "Hindi/Regional Name of signatory (optional)",
  "sc": "Constituency/Circle (optional)",
  "enclList": ["Enclosure 1", "Enclosure 2"] or [],
  "copyList": ["Copy recipient 1", "Copy recipient 2"] or []
}

CORRESPONDENCE PROTOCOLS (CSMOP 16th Edition & Statutory Standards):
1. OFFICE MEMORANDUM (OM):
   - Strictly written in the 3rd person: "The undersigned is directed to state/convey..."
   - NO salutation (leave sal empty).
   - NO subscription/closing like "Yours faithfully" (leave cls empty).
   - Recipient (To) is typically placed at the bottom-left or addressed to all Ministries/Departments.

2. DEMI-OFFICIAL (D.O.) LETTER:
   - Written by an officer to an officer of equivalent or near-equivalent rank.
   - Salutation must be personal formal: "Dear Shri [Last Name]" or "Dear Dr. [Last Name]".
   - Subscription must be "Yours sincerely" or "With warm regards".
   - Warm, personal yet formal tone; NO rigid numbered bureaucratic paragraphs.

3. SHOW CAUSE NOTICE (SCN):
   - Statutory quasi-judicial structure:
     "WHEREAS..." (states the allegation or breach of rule)
     "AND WHEREAS..." (states evidence or preliminary findings)
     "NOW THEREFORE, the undersigned hereby calls upon you to show cause within [X] days..."
   - Warning of ex-parte decision if reply is not received in time.

4. REMINDER LETTER / LETTER OF URGENCY:
   - Refers specifically to previous unanswered communications: "Please refer to this Ministry's communication of even number dated [Date] regarding [Subject]."
   - Body states: "A reply in this regard is still awaited. It is requested that the requisite report/comments may kindly be expedited."

5. EMPLOYEE NOC (NO OBJECTION CERTIFICATE):
   - Certifies employee's designation, department, length of service, and confirms that the department has "NO OBJECTION" to their passport application / examination / higher studies.
   - States vigilance clearance status.

6. STUDENT APPLICATION TO PRINCIPAL:
   - Respectful, humble academic letter.
   - Salutation: "Respected Principal / Sir".
   - Subscription: "Yours obediently".
   - States student's Class, Roll Number, and clear reason (leave, fee concession, bonafide).
   - LEAVE ALL GOVERNMENT HEADERS EMPTY (h1, h2, e1, e2, dept, divn, ofc).

7. TRADITIONAL / HERITAGE FAMILY LETTER:
   - Deeply cultured, respectful Indian family letter.
   - Traditional salutation: "आदरणीय पिताजी", "पूज्य माताजी", "सादर चरण स्पर्श".
   - Closing: "आपका आज्ञाकारी पुत्र", "आपकी स्नेहमयी पुत्री".
   - Warm inquiries into health and family wellbeing. NO govt headers.

8. ROMANTIC / HEARTFELT PERSONAL LETTER:
   - Deeply affectionate, expressive, poetic personal letter.
   - Warm intimate salutation (e.g. "My Dearest...", "प्रियतम...").
   - Emotional, sincere expression. Completely free of administrative headers.

STATE EMBLEM ACT (2005) COMPLIANCE:
- Personal, academic, student, and romantic letters MUST NOT have government headers or state emblems.
- For official government correspondence, derive authentic Ministry, Department, and National/State context.

RESPOND WITH ONLY THE JSON OBJECT. NO OTHER TEXT.`;

    const letterTypeMap = {
      office_order:      'Office Order (ACC / Departmental)',
      om:                'Office Memorandum (OM)',
      do:                'Demi-Official (D.O.) Letter',
      circular:          'Circular / Standing Directive',
      reminder:          'Reminder Letter (Urgent / Pending)',
      forwarding:        'Forwarding / Endorsement Note',
      scn:               'Show Cause Notice (Statutory / Disciplinary)',
      noc:               'No Objection Certificate (NOC)',
      appreciation:      'Letter of Appreciation (Minister / Gov)',
      notification:      'Public Notification (Gazette Format)',
      advisory:          'Advisory / Policy Guidelines',
      student_app:       'Student Application to Principal',
      heritage_personal: 'Heritage / Traditional Family Letter',
      romantic:          'Romantic / Heartfelt Personal Letter',
      tour:              'Tour Programme',
      pm_do:             'PM Personal D.O. Letter',
      mp_letter:         'MP Constituency Letter',
      personal:          'Personal / School / Unofficial Letter',
      custom:            'Official Government Letter'
    };

    const langNote = language === 'hi' ? 'Write body and relevant fields in formal Hindi (Devanagari).' :
                     language === 'bi' ? 'Write in Bilingual - alternating English and Hindi paragraphs.' :
                     'Write in formal English matching official Government of India style.';

    const isPersonal = ['personal', 'student_app', 'heritage_personal', 'romantic'].includes(letterType);
    const isFull = !currentContext.department && !currentContext.office;

    const userPrompt = `Generate a complete ${letterTypeMap[letterType as keyof typeof letterTypeMap] || 'Government Letter'}.

User Description: "${description}"

${isPersonal
  ? `PERSONAL / ACADEMIC MODE:
- DO NOT add Government headers (leave h1, h2, e1, e2, dept, divn, ofc empty).
- The recipient (toD, toA) must match who the user is writing to.
- Use natural, authentic, respectful, or affectionate body corresponding to the letter style.`
  : `${isFull
      ? `OFFICIAL FULL AI MODE: Determine ALL fields — ministry, department, office, signatory, city, contacts — 100% from the user description.
DO NOT default to India Post or Dept of Posts unless explicitly requested.
Derive the correct Ministry (e.g. Railways, Finance, Defence, Home Affairs, Health, State Gov) from the context.`
      : `Current Sender Context:
- Department: ${currentContext.department}
- Office: ${currentContext.office}
- City: ${currentContext.city}`
    }
- Follow strict CSMOP 16th Edition protocol for ${letterTypeMap[letterType as keyof typeof letterTypeMap] || 'Official Letter'}.`
}
- Language: ${langNote}

RESPOND WITH ONLY THE JSON OBJECT.`;

    const result = await callGroqWithFallback(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      3500
    );

    // Clean response — strip markdown fences if AI adds them
    let cleanedResponse = result.content.trim();
    // Remove code fence wrappers
    cleanedResponse = cleanedResponse
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/,    '');
    // Extract JSON object even if AI adds surrounding text
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd   = cleanedResponse.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.slice(jsonStart, jsonEnd + 1);
    }

    const letterData = JSON.parse(cleanedResponse.trim());

    return NextResponse.json({
      success: true,
      data: letterData,
      model: result.model,   // tells the UI which fallback model was actually used
    });
  } catch (error) {
    console.error('Letter generation error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. The AI response was not valid JSON. Please try again with a different description.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate letter' },
      { status: 500 }
    );
  }
}

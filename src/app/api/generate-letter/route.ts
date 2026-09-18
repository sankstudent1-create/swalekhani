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
// Ordered by quality → speed. Official Groq models.
const GROQ_FALLBACK_MODELS = [
  'llama-3.3-70b-versatile',          // Best quality official Groq model
  'llama-3.1-8b-instant',             // Ultra-fast official fallback
];

function generateFallbackLetter(description: string, letterType: string = 'office_order', language: string = 'en'): Record<string, any> {
  const isPersonal = ['personal', 'student_app', 'heritage_personal', 'romantic'].includes(letterType);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
  const year = now.getFullYear();

  if (letterType === 'student_app') {
    return {
      h1: '', h2: '', e1: '', e2: '', dept: '', divn: '', ofc: '', city: '', pin: '', ph: '', em: '', wb: '',
      fno: '',
      toD: 'The Principal',
      toA: 'School / College of Excellence\nCity, State',
      sub: `Application regarding ${description.slice(0, 50)}`,
      ref: '',
      sal: 'Respected Sir / Madam',
      body: `I am a student of your esteemed institution enrolled in Class XII (Roll No. 21).\n\n2. I am submitting this application to respectfully state that ${description}.\n\n3. In light of the circumstances mentioned above, I humbly request your favorable consideration and kind approval. I shall remain sincerely grateful.`,
      cls: 'Yours obediently',
      sn: 'Student Name',
      sd: 'Class XII (Roll No. 21)',
      enclList: [],
      copyList: []
    };
  }

  if (letterType === 'romantic') {
    return {
      h1: '', h2: '', e1: '', e2: '', dept: '', divn: '', ofc: '', city: '', pin: '', ph: '', em: '', wb: '',
      fno: '',
      toD: '',
      toA: '',
      sub: '',
      ref: '',
      sal: 'My Dearest,',
      body: `Every quiet moment reminds me of you and the joy you bring into my life.\n\n${description}\n\nYou are my steady peace, my constant inspiration, and the person I am most grateful for every single day. Always thinking of you.`,
      cls: 'With all my heart,\nYours forever',
      sn: 'Yours affectionately',
      sd: '',
      enclList: [],
      copyList: []
    };
  }

  if (letterType === 'heritage_personal') {
    return {
      h1: '', h2: '', e1: '', e2: '', dept: '', divn: '', ofc: '', city: '', pin: '', ph: '', em: '', wb: '',
      fno: '',
      toD: '',
      toA: '',
      sub: '',
      ref: '',
      sal: 'आदरणीय पिताजी, सादर चरण स्पर्श।',
      body: `आशा है कि आप सभी घर पर सकुशल और प्रसन्न होंगे। यहाँ सब कुछ ठीक चल रहा है।\n\nविशेष रूप से यह पत्र मैं इसलिए लिख रहा हूँ कि ${description}।\n\nमाताजी को प्रणाम और छोटों को स्नेह। आपके आशीर्वाद की सदैव प्रतीक्षा रहेगी।`,
      cls: 'आपका आज्ञाकारी पुत्र,',
      sn: 'सकेत',
      sd: '',
      enclList: [],
      copyList: []
    };
  }

  if (letterType === 'om') {
    return {
      h1: 'भारत सरकार',
      h2: 'कार्मिक, लोक शिकायत तथा पेंशन मंत्रालय',
      e1: 'Government of India',
      e2: 'Ministry of Personnel, Public Grievances and Pensions',
      dept: 'Department of Personnel and Training',
      divn: '(Establishment Division)',
      ofc: 'North Block',
      city: 'New Delhi',
      pin: '110 001',
      ph: '011-23092471',
      em: 'us-estt@nic.in',
      wb: 'www.persmin.gov.in',
      fno: `F.No. 12/04/${year}-Estt.(Pay-I)`,
      toD: 'All Ministries / Departments of the Government of India',
      toA: 'New Delhi',
      sub: `OFFICE MEMORANDUM — ${description.slice(0, 60)}`,
      ref: '',
      sal: '',
      body: `The undersigned is directed to invite reference to the subject cited above and to state that ${description}.\n\n2. The matter has been carefully considered in consultation with the relevant administrative authorities. All subordinate offices are hereby instructed to ensure strict compliance with these directions.\n\n3. This issues with the approval of the Competent Authority.`,
      cls: '',
      sn: '(R. K. Sharma)',
      sd: 'Under Secretary to the Government of India',
      enclList: [],
      copyList: ['Comptroller and Auditor General of India', 'All Attached/Subordinate Offices', 'Guard File']
    };
  }

  if (letterType === 'do') {
    return {
      h1: 'भारत सरकार',
      h2: 'गृह मंत्रालय',
      e1: 'Government of India',
      e2: 'Ministry of Home Affairs',
      dept: 'Department of Internal Security',
      divn: '',
      ofc: 'North Block',
      city: 'New Delhi',
      pin: '110 001',
      ph: '011-23092011',
      em: 'secy-mha@nic.in',
      wb: 'www.mha.gov.in',
      fno: `D.O. No. 11013/02/${year}-IS.I`,
      toD: 'Shri Rajesh Kumar, IAS',
      toA: 'Chief Secretary\nGovernment of Maharashtra\nMantralaya, Mumbai - 400 032',
      sub: `Consultation regarding ${description.slice(0, 55)}`,
      ref: '',
      sal: 'Dear Shri Rajesh,',
      body: `I am writing to you regarding ${description}.\n\nAs you are aware, coordinated administrative action is essential for the effective execution of this initiative. I would deeply appreciate it if you could personally review the progress and issue suitable directions to expedite the matter.\n\nWith warm personal regards.`,
      cls: 'Yours sincerely,',
      sn: '(Vikram Malhotra)',
      sd: 'Secretary to the Government of India',
      enclList: [],
      copyList: []
    };
  }

  if (letterType === 'scn') {
    return {
      h1: 'भारत सरकार',
      h2: 'संचार मंत्रालय',
      e1: 'Government of India',
      e2: 'Ministry of Communications',
      dept: 'Department of Posts',
      divn: '(Vigilance Division)',
      ofc: 'Dak Bhavan, Sansad Marg',
      city: 'New Delhi',
      pin: '110 001',
      ph: '011-23096000',
      em: 'adg-vig@indiapost.gov.in',
      wb: 'www.indiapost.gov.in',
      fno: `F.No. Vig-14/${year}-SCN`,
      toD: 'The Official Concerned / Agency',
      toA: 'Postal Directorate\nNew Delhi',
      sub: `SHOW CAUSE NOTICE under applicable service rules regarding ${description.slice(0, 50)}`,
      ref: '',
      sal: 'Sir / Madam',
      body: `WHEREAS it has been observed that ${description};\n\nAND WHEREAS the aforementioned act/omission constitutes a prima facie violation of the prescribed conduct rules and official instructions;\n\nNOW THEREFORE, you are hereby called upon to SHOW CAUSE in writing within 15 (fifteen) days from the receipt of this notice as to why disciplinary action should not be initiated against you.\n\nPlease note that in case no reply is received within the stipulated period, it will be presumed that you have no explanation to offer and the matter will be decided ex-parte.`,
      cls: 'Yours faithfully,',
      sn: '(A. K. Srivastava)',
      sd: 'Director (Vigilance) & Competent Authority',
      enclList: ['Inspection findings / Annexure-I'],
      copyList: ['Confidential Record Cell', 'Guard File']
    };
  }

  if (letterType === 'reminder') {
    return {
      h1: 'भारत सरकार',
      h2: 'संचार मंत्रालय',
      e1: 'Government of India',
      e2: 'Ministry of Communications',
      dept: 'Department of Posts',
      divn: '(Establishment Division)',
      ofc: 'Dak Bhavan, Sansad Marg',
      city: 'New Delhi',
      pin: '110 001',
      ph: '011-23096000',
      em: 'adg-estt@indiapost.gov.in',
      wb: 'www.indiapost.gov.in',
      fno: `F.No. 4-12/${year}-Estt (REMINDER-I)`,
      toD: 'The Chief Postmaster General',
      toA: 'All Postal Circles',
      sub: `REMINDER — Expeditious submission of report regarding ${description.slice(0, 50)}`,
      ref: `This Ministry's letter of even number dated 15.${String(now.getMonth() + 1).padStart(2, '0')}.${year}`,
      sal: 'Sir / Madam',
      body: `I am directed to invite your kind attention to this Ministry's communication of even number cited under reference on the subject mentioned above.\n\n2. In this connection, it is intimated that the required report / information concerning ${description} is still awaited despite the lapse of the prescribed period.\n\n3. Since this matter is under time-bound review, it is requested that the pending report may kindly be expedited and transmitted within 3 (three) working days.`,
      cls: 'Yours faithfully,',
      sn: '(P. N. Deshmukh)',
      sd: 'Assistant Director General (Estt.)',
      enclList: [],
      copyList: ['PPS to Secretary (Posts)', 'Guard File']
    };
  }

  // Default Official Letter
  return {
    h1: isPersonal ? '' : 'भारत सरकार',
    h2: isPersonal ? '' : 'संचार मंत्रालय',
    e1: isPersonal ? '' : 'Government of India',
    e2: isPersonal ? '' : 'Ministry of Communications',
    dept: isPersonal ? '' : 'Department of Posts',
    divn: isPersonal ? '' : '(Establishment Section)',
    ofc: isPersonal ? '' : 'Dak Bhavan',
    city: isPersonal ? '' : 'New Delhi',
    pin: isPersonal ? '' : '110 001',
    ph: isPersonal ? '' : '011-23096000',
    em: isPersonal ? '' : 'contact@gov.in',
    wb: isPersonal ? '' : 'www.india.gov.in',
    fno: isPersonal ? '' : `F.No. 22-08/${year}-Admin`,
    toD: 'The Concerned Authority / Officer',
    toA: 'Government Complex\nNew Delhi',
    sub: `Communication regarding ${description.slice(0, 55)}`,
    ref: '',
    sal: 'Sir / Madam',
    body: `I am directed to convey the administrative decision regarding ${description}.\n\n2. The matter has been duly examined in accordance with the established government rules and procedures. Necessary administrative measures have been sanctioned for immediate implementation.\n\n3. This issues with the approval of the Competent Authority.`,
    cls: 'Yours faithfully,',
    sn: '(Authorized Officer)',
    sd: 'Under Secretary to the Government of India',
    enclList: ['As above'],
    copyList: ['Office of the Joint Secretary', 'Guard File']
  };
}

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
  try {
    const body = (await request.json()) as LetterGenerationRequest;
    const { description, letterType = 'office_order', language = 'en', currentContext = {} } = body;

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // If GROQ_API_KEY is not configured, gracefully use the CSMOP Protocol Engine
    if (!process.env.GROQ_API_KEY) {
      console.warn('[letterpad] GROQ_API_KEY not set. Using CSMOP Protocol Engine fallback.');
      const fallbackData = generateFallbackLetter(description, letterType, language);
      return NextResponse.json({
        success: true,
        data: fallbackData,
        model: 'CSMOP Protocol Engine (Add GROQ_API_KEY in Vercel to activate Groq AI)',
      });
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

    // Graceful fallback to CSMOP engine if Groq AI fails or rate limits
    try {
      const fallbackData = generateFallbackLetter(
        (request as any)?._body?.description || 'Official Letter',
        (request as any)?._body?.letterType || 'office_order',
        (request as any)?._body?.language || 'en'
      );
      return NextResponse.json({
        success: true,
        data: fallbackData,
        model: 'CSMOP Protocol Engine (Fallback)',
      });
    } catch {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate letter' },
        { status: 500 }
      );
    }
  }
}

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


function detectLetterIntent(description: string, passedType?: string): { type: string; isPersonal: boolean } {
  if (passedType && passedType !== 'custom' && passedType !== 'auto') {
    const isPers = ['personal', 'student_app', 'heritage_personal', 'romantic'].includes(passedType);
    return { type: passedType, isPersonal: isPers };
  }

  const text = (description || '').toLowerCase();

  // 1. Romantic / Love Letter
  if (
    text.includes('love') || text.includes('romantic') || text.includes('girlfriend') ||
    text.includes('boyfriend') || text.includes('wife') || text.includes('husband') ||
    text.includes('crush') || text.includes('darling') || text.includes('sweetheart') ||
    text.includes('प्रेम') || text.includes('प्रेमपत्र') || text.includes('प्रिया') ||
    text.includes('प्रियकर') || text.includes('प्रेमिका')
  ) {
    return { type: 'romantic', isPersonal: true };
  }

  // 2. Heritage / Traditional Family
  if (
    text.includes('father') || text.includes('mother') || text.includes('parents') ||
    text.includes('family letter') || text.includes('वडिलां') || text.includes('आईस') ||
    text.includes('पिताजी') || text.includes('माताजी') || text.includes('चरण स्पर्श') ||
    text.includes('साष्टांग')
  ) {
    return { type: 'heritage_personal', isPersonal: true };
  }

  // 3. Student Application to Principal / Headmaster
  if (
    text.includes('principal') || text.includes('headmaster') || text.includes('school') ||
    text.includes('college') || text.includes('leave application') || text.includes('fee concession') ||
    text.includes('student') || text.includes('bonafide') || text.includes('मुख्याध्यापक') ||
    text.includes('प्राचार्य') || text.includes('रजेचा अर्ज')
  ) {
    return { type: 'student_app', isPersonal: true };
  }

  // 4. Citizen Application to Authority (Postmaster, Bank Manager, Collector, Police, etc.)
  // When an individual/citizen/resident/customer writes TO an authority (not from the authority)
  const isWritingToAuthority = 
    text.includes('to postmaster') || text.includes('to post master') ||
    text.includes('to branch manager') || text.includes('to bank') ||
    text.includes('to collector') || text.includes('to tehsildar') || text.includes('to commissioner') ||
    text.includes('to the postmaster') || text.includes('to the manager') ||
    text.includes('to the collector') || text.includes('to principal') ||
    text.includes('to officer') || text.includes('to sdo') || text.includes('to bdo') ||
    text.includes('resident of') || text.includes('account holder') ||
    text.includes('खातेदार') || text.includes('नागरिक अर्ज') || text.includes('विनंती अर्ज') ||
    (text.includes('letter by') && text.includes('to')) ||
    (text.includes('write letter by') && text.includes('to')) ||
    (text.includes('by ') && text.includes('to ') && (text.includes('post office') || text.includes('bank') || text.includes('office')));

  const hasCitizenContext =
    text.includes('time deposit') || text.includes('savings account') || text.includes('saving ac') ||
    text.includes('sb account') || text.includes('sb ac') || text.includes('passbook') ||
    text.includes('interest credit') || text.includes('pension') || text.includes('complaint') ||
    text.includes('application') || text.includes('request') || text.includes('credit all my');

  if (isWritingToAuthority || (hasCitizenContext && (text.includes('to ') || text.includes('postmaster') || text.includes('manager')))) {
    return { type: 'citizen_app', isPersonal: true };
  }

  // 5. NOC (No Objection Certificate)
  if (
    text.includes('noc') || text.includes('no objection') || text.includes('अनापत्ति') ||
    text.includes('ना-हरकत') || text.includes('ना हरकत')
  ) {
    return { type: 'noc', isPersonal: false };
  }

  // 6. Circular
  if (text.includes('circular') || text.includes('परिपत्रक') || text.includes('परिपत्र')) {
    return { type: 'circular', isPersonal: false };
  }

  // 7. Notification / Gazette
  if (text.includes('notification') || text.includes('gazette') || text.includes('अधिसूचना') || text.includes('राजपत्र')) {
    return { type: 'notification', isPersonal: false };
  }

  // 8. Show Cause Notice
  if (
    text.includes('show cause') || text.includes('कारणे दाखवा') || text.includes('कारण बताओ') ||
    text.includes('scn') || text.includes('explanation notice')
  ) {
    return { type: 'scn', isPersonal: false };
  }

  // 9. Reminder Letter
  if (text.includes('reminder') || text.includes('स्मरणपत्र') || text.includes('तात्कालिक स्मरण')) {
    return { type: 'reminder', isPersonal: false };
  }

  // 10. Demi-Official (D.O.)
  if (
    text.includes('d.o.') || text.includes('do letter') || text.includes('demi official') ||
    text.includes('अर्ध-शासकीय') || text.includes('अर्ध सरकारी')
  ) {
    return { type: 'do', isPersonal: false };
  }

  // 11. Office Memorandum (OM)
  if (
    text.includes('memorandum') || text.includes('office memo') || text.includes('o.m.') ||
    text.includes(' om ') || text.includes('ज्ञापक') || text.includes('ज्ञापन')
  ) {
    return { type: 'om', isPersonal: false };
  }

  // 12. Appreciation
  if (text.includes('appreciation') || text.includes('commendation') || text.includes('प्रशंसा')) {
    return { type: 'appreciation', isPersonal: false };
  }

  // 13. Advisory
  if (text.includes('advisory') || text.includes('सल्ला')) {
    return { type: 'advisory', isPersonal: false };
  }

  // 14. General personal
  if (text.includes('personal') || text.includes('friend') || text.includes('landlord')) {
    return { type: 'personal', isPersonal: true };
  }

  return { type: 'office_order', isPersonal: false };
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

    if (!process.env.GROQ_API_KEY) {
      console.error('[letterpad] GROQ_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: GROQ_API_KEY is not set. Please add it to your Vercel environment variables.' },
        { status: 500 }
      );
    }

    // Auto-detect intent if custom or auto
    const detectedIntent = detectLetterIntent(description, letterType);
    const targetType = detectedIntent.type;
    const isPersonal = detectedIntent.isPersonal;

    const systemPrompt = `You are an expert Government of India and State Government official correspondence specialist with exhaustive knowledge of the Central Secretariat Manual of Office Procedure (CSMOP 16th Edition), State Emblem of India (Prohibition of Improper Use) Act 2005, and Indian administrative protocols.

Your task is to generate COMPLETE, AUTHENTIC, and FLAWLESS letters matching official Indian administrative, academic, or personal correspondence standards. You must determine the correct ministry, department, office, signatory, and structure from the user's description.

CRITICAL: Respond with ONLY a valid JSON object — no markdown, no code fences, no explanations.

The JSON must have exactly these fields:
{
  "detected_type": "canonical type: romantic | noc | circular | notification | student_app | heritage_personal | scn | om | do | reminder | office_order | personal",
  "is_personal": true or false,
  "h1": "Hindi Line 1 derived from sender context (e.g. भारत सरकार or महाराष्ट्र शासन, or empty for personal/romantic/student)",
  "h2": "Hindi Line 2 — ministry/department in Hindi (or empty for personal/romantic/student)",
  "e1": "English Line 1 (e.g. Government of India or Government of Maharashtra, or empty for personal/romantic/student)",
  "e2": "English Line 2 — ministry/department in English (or empty for personal/romantic/student)",
  "dept": "Full department name derived from user description (or empty for personal/romantic/student)",
  "divn": "Division/Section appropriate to context (or empty for personal)",
  "ofc": "Office or building name appropriate to sender (or empty for personal)",
  "city": "City of sender office (or empty for romantic/personal)",
  "pin": "PIN Code of sender office (or empty for romantic/personal)",
  "ph": "Official phone number (or empty for personal)",
  "em": "Official email (@gov.in, @nic.in, or institution email, or empty for personal)",
  "wb": "Official website (or empty for personal)",
  "fno": "File Number (e.g. F.No.12-04/2026-Estt or empty for personal/romantic/student)",
  "toD": "Recipient Designation/Title or Recipient Name for personal/romantic",
  "toA": "Recipient Address (use \\n for line breaks, or empty for romantic)",
  "sub": "Subject Line (e.g. 'NO OBJECTION CERTIFICATE', 'CIRCULAR', or romantic title like 'Forever in My Heart')",
  "ref": "Reference to previous correspondence or empty string",
  "sal": "Salutation ('Sir / Madam', 'Dear Shri [Surname]', 'Respected Principal', 'My Dearest [Name],', 'आदरणीय पिताजी', etc.)",
  "body": "Complete letter body with authentic paragraphs. Use \\n\\n for paragraph breaks.",
  "cls": "Closing phrase ('Yours faithfully', 'Yours sincerely', 'Yours obediently', 'Forever yours,', 'With all my love,', 'आपका आज्ञाकारी')",
  "sn": "Signatory Name / Sender Name",
  "sd": "Signatory Designation (leave empty for romantic/personal/student)",
  "sp2": "Direct Phone/Extension (optional)",
  "sh": "Hindi/Regional Name of signatory (optional)",
  "sc": "Constituency/Circle (optional)",
  "enclList": ["Enclosure 1", "Enclosure 2"] or [],
  "copyList": ["Copy recipient 1", "Copy recipient 2"] or []
}

CORRESPONDENCE PROTOCOLS & STATUTORY STANDARDS:
1. LOVE / ROMANTIC LETTER:
   - detected_type: "romantic", is_personal: true.
   - ABSOLUTE RULE: DO NOT use any government header or ministry (h1, h2, e1, e2, dept, divn, ofc, fno, ref MUST BE "").
   - NO official enclosures or copy-to lists (enclList: [], copyList: []).
   - Recipient (toD): Name of partner / sweetheart (e.g. "To My Love, [Name]" or "[Name]").
   - Subject (sub): Romantic title (e.g. "To My Beloved", "A Letter From My Heart", "माझ्या लाडक्या [नाव]स...").
   - Salutation (sal): Deeply affectionate ("My Dearest [Name],", "My Darling,", "माझ्या प्रिय [नाव],", "मेरी प्रिय [नाम],").
   - Body: Heartfelt, poetic, emotional, romantic paragraphs.
   - Closing (cls): Passionate closing ("Forever yours,", "With all my love and devotion,", "तुझाच / तुझीच", "तुम्हारा अपना").
   - Signatory (sn): Sender's name. Designation (sd) MUST BE "".

2. EMPLOYEE NOC (NO OBJECTION CERTIFICATE):
   - detected_type: "noc", is_personal: false.
   - Government or Organization masthead (e.g. Department of Personnel, Ministry of Railways, Bank, or State Dept).
   - Official File No (e.g. "F.No. 11012/03/2026-Estt(NOC)").
   - Recipient (toD): "TO WHOMSOEVER IT MAY CONCERN" or specific authority (e.g. "The Regional Passport Officer").
   - Subject (sub): "NO OBJECTION CERTIFICATE (NOC) FOR [PASSPORT / HIGHER STUDIES / EXAM] - REGARDING".
   - Body: Formal certification that [Employee Name], [Designation] is a regular employee. State that this Department has NO OBJECTION to his/her application. Explicitly certify vigilance clearance: "It is further certified that no vigilance / disciplinary proceeding is either pending or contemplated against him/her."
   - Salutation (sal): "" or "To Whomsoever It May Concern,".
   - Closing (cls): "Yours faithfully," or direct Signatory block.

3. ADMINISTRATIVE CIRCULAR:
   - detected_type: "circular", is_personal: false.
   - Subject (sub): "CIRCULAR" or "कार्यालयीन परिपत्रक".
   - Recipient (toD): "1. All Heads of Departments / Circle Heads.\\n2. All Divisional Officers."
   - Salutation (sal): "" (Strict CSMOP rule: No salutation in circulars).
   - Closing (cls): "" (Strict CSMOP rule: No complimentary close in circulars).
   - Body: "Instances have come to notice that... It is reiterated that... Therefore, all concerned are hereby directed to..."
   - Copy To (copyList): All Division Heads, Notice Board, IT Cell for website upload.

4. STATUTORY NOTIFICATION (GAZETTE FORMAT):
   - detected_type: "notification", is_personal: false.
   - Header (h1/e1): "भारत का राजपत्र / THE GAZETTE OF INDIA" (or State Gazette).
   - Subject (sub): "NOTIFICATION" or "अधिसूचना".
   - Salutation: "", Closing: "".
   - Body: "In exercise of the powers conferred by Section [X] of the [Act Name], the Central Government hereby notifies..."

5. SHOW CAUSE NOTICE (SCN):
   - detected_type: "scn", is_personal: false.
   - Subject (sub): "SHOW CAUSE NOTICE" or "कारणे दाखवा नोटीस".
   - Salutation: "", Closing: "".
   - Body: "WHEREAS... AND WHEREAS... NOW THEREFORE, you are hereby directed to show cause within [X] days why disciplinary action should not be initiated against you..."

6. OFFICE MEMORANDUM (OM):
   - detected_type: "om", is_personal: false.
   - Subject (sub): Ends with "- regarding." or "- बाबत."
   - Salutation: "", Closing: "".
   - Body: Strictly 3rd person: "The undersigned is directed to state that... This issues with the approval of the Competent Authority."

7. DEMI-OFFICIAL (D.O.) LETTER:
   - detected_type: "do", is_personal: false.
   - Salutation: "Dear Shri [Surname]," or "Dear Dr. [Surname],".
   - Closing: "Yours sincerely," or "With warm regards,".

8. STUDENT APPLICATION TO PRINCIPAL:
   - detected_type: "student_app", is_personal: true.
   - Leave ALL government headers (h1, h2, e1, e2, dept, divn, ofc, fno) EMPTY "".
   - Recipient: "To,\nThe Principal,\n[School / College Name],\n[City]"
   - Salutation: "Respected Sir/Madam,"
   - Closing: "Yours obediently,"
   - Body: Humble academic leave or fee concession request with Class, Section, and Roll No.

9. CITIZEN / CUSTOMER APPLICATION TO AUTHORITY:
   - detected_type: "citizen_app", is_personal: true.
   - SENDER: The individual, resident, customer, or account holder (e.g. Mrs. Radha Dharpade).
   - RECIPIENT (toD, toA): The official authority and office address (e.g. toD: "The Postmaster", toA: "Gangamasla Post Office,\nGangamasla - 431131").
   - CRITICAL STATUTORY RULE: The citizen is NOT the government or department! Private citizens do not issue orders or file numbers and MUST NOT use State Emblems or Government mastheads (State Emblem of India Act 2005).
   - LEAVE ALL GOVERNMENT HEADERS EMPTY (h1: "", h2: "", e1: "", e2: "", dept: "", divn: "", ofc: "", fno: "", ref: "").
   - Subject (sub): Clear formal subject starting with 'Subject: ' or 'विषय: ' (e.g. "Subject: Application for credit of pending interest of closed Time Deposit accounts into Savings Account No. ... - regarding.").
   - Salutation (sal): "Respected Sir / महोदय," or "Sir,".
   - Body: Formal, respectful, detailed citizen application describing all account numbers, maturity dates, interest amounts, closure dates, explaining any pending credits, and polite request for administrative action.
   - Closing (cls): "Yours faithfully," / "आपली नम्र," / "भवदीय,".
   - Signatory (sn): Name of the applicant (e.g. "Mrs. Radha Dharpade\nResident of At Post Gangamasla").
   - Signatory Designation (sd): "Account Holder / Depositor" or empty.

STATE EMBLEM ACT (2005) COMPLIANCE:
- Personal, academic, student, citizen, and romantic letters MUST NOT have government headers or state emblems.
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
      citizen_app:       'Citizen Application to Authority (Postmaster / Bank / Officer)',
      heritage_personal: 'Heritage / Traditional Family Letter',
      romantic:          'Romantic / Heartfelt Love Letter',
      tour:              'Tour Programme',
      pm_do:             'PM Personal D.O. Letter',
      mp_letter:         'MP Constituency Letter',
      personal:          'Personal / School / Unofficial Letter',
      custom:            'Official Government Letter'
    };

    const langNote = language === 'hi' ? 'Write body and relevant fields in formal Hindi (Devanagari).' :
                     language === 'bi' ? 'Write in Bilingual - alternating English and Hindi paragraphs.' :
                     'Write in formal English matching official Government of India style.';

    const isFull = !currentContext.department && !currentContext.office;

    const userPrompt = `Generate a complete ${letterTypeMap[targetType as keyof typeof letterTypeMap] || 'Letter'}.

User Description: "${description}"
Detected Type: ${targetType} (isPersonal: ${isPersonal})

${isPersonal
  ? `PERSONAL / CITIZEN / ACADEMIC / ROMANTIC MODE:
- The SENDER is an individual / citizen / resident / customer / student (NOT a government department or post office).
- DO NOT add Government headers (leave h1, h2, e1, e2, dept, divn, ofc, fno, ref empty "").
- DO NOT generate file numbers.
- The recipient (toD, toA) must be the office or authority addressed (e.g. The Postmaster, The Branch Manager).
- Formatted as an authentic application to the authority.`
  : `${isFull
      ? `OFFICIAL FULL AI MODE: Determine ALL fields — ministry, department, office, signatory, city, contacts — 100% from the user description.
DO NOT default to India Post or Dept of Posts unless explicitly requested.
Derive the correct Ministry (e.g. Railways, Finance, Defence, Home Affairs, Health, State Gov) from the context.`
      : `Current Sender Context:
- Department: ${currentContext.department}
- Office: ${currentContext.office}
- City: ${currentContext.city}`
    }
- Follow strict CSMOP 16th Edition / Statutory protocol for ${letterTypeMap[targetType as keyof typeof letterTypeMap] || 'Official Letter'}.`
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

    const detected = letterData.detected_type || targetType;
    const isPersonalResult = letterData.is_personal === true || isPersonal;

    // Normalize both short and long keys so any consumer gets 100% complete data
    const normalizedData = {
      ...letterData,
      detected_type: detected,
      letter_type: detected,
      is_personal: isPersonalResult,
      // short keys
      h1: isPersonalResult ? '' : (letterData.h1 || letterData.dept_hindi_1 || ''),
      h2: isPersonalResult ? '' : (letterData.h2 || letterData.dept_hindi_2 || ''),
      e1: isPersonalResult ? '' : (letterData.e1 || letterData.dept_english_1 || ''),
      e2: isPersonalResult ? '' : (letterData.e2 || letterData.dept_english_2 || ''),
      dept: isPersonalResult ? '' : (letterData.dept || letterData.department || ''),
      divn: isPersonalResult ? '' : (letterData.divn || letterData.division || ''),
      ofc: isPersonalResult ? '' : (letterData.ofc || letterData.office || ''),
      city: letterData.city || '',
      pin: letterData.pin || '',
      ph: isPersonalResult ? '' : (letterData.ph || letterData.phone || ''),
      em: isPersonalResult ? '' : (letterData.em || letterData.email || ''),
      wb: isPersonalResult ? '' : (letterData.wb || letterData.website || ''),
      fno: isPersonalResult ? '' : (letterData.fno || letterData.file_no || ''),
      toD: letterData.toD || letterData.to_designation || '',
      toA: letterData.toA || letterData.to_address || '',
      sub: letterData.sub || letterData.subject || '',
      ref: isPersonalResult ? '' : (letterData.ref || letterData.reference || ''),
      sal: letterData.sal || letterData.salutation || '',
      cls: letterData.cls || letterData.closing || '',
      sn: letterData.sn || letterData.signatory_name || '',
      sd: isPersonalResult ? '' : (letterData.sd || letterData.signatory_designation || ''),
      body: letterData.body || '',
      encl: isPersonalResult ? '' : (letterData.encl || (Array.isArray(letterData.enclList) ? letterData.enclList.join(', ') : '')),
      copy_to: isPersonalResult ? [] : (letterData.copyList && letterData.copyList.length ? letterData.copyList : (letterData.copy_to || [])),
      // long keys for backward compatibility
      dept_hindi_1: isPersonalResult ? '' : (letterData.h1 || letterData.dept_hindi_1 || ''),
      dept_hindi_2: isPersonalResult ? '' : (letterData.h2 || letterData.dept_hindi_2 || ''),
      dept_english_1: isPersonalResult ? '' : (letterData.e1 || letterData.dept_english_1 || ''),
      dept_english_2: isPersonalResult ? '' : (letterData.e2 || letterData.dept_english_2 || ''),
      department: isPersonalResult ? '' : (letterData.dept || letterData.department || ''),
      division: isPersonalResult ? '' : (letterData.divn || letterData.division || ''),
      office: isPersonalResult ? '' : (letterData.ofc || letterData.office || ''),
      phone: isPersonalResult ? '' : (letterData.ph || letterData.phone || ''),
      email: isPersonalResult ? '' : (letterData.em || letterData.email || ''),
      website: isPersonalResult ? '' : (letterData.wb || letterData.website || ''),
      file_no: isPersonalResult ? '' : (letterData.fno || letterData.file_no || ''),
      to_designation: letterData.toD || letterData.to_designation || '',
      to_address: letterData.toA || letterData.to_address || '',
      subject: letterData.sub || letterData.subject || '',
      reference: isPersonalResult ? '' : (letterData.ref || letterData.reference || ''),
      salutation: letterData.sal || letterData.salutation || '',
      closing: letterData.cls || letterData.closing || '',
      signatory_name: letterData.sn || letterData.signatory_name || '',
      signatory_designation: isPersonalResult ? '' : (letterData.sd || letterData.signatory_designation || ''),
    };

    return NextResponse.json({
      success: true,
      data: normalizedData,
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

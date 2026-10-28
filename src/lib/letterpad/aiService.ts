// ─────────────────────────────────────────────
//  lib/letterpad/aiService.ts  –  AI letter generation
//  Uses Groq API via server-side /api/generate-letter route.
//  No client-side API keys needed — GROQ_API_KEY is set server-side.
// ─────────────────────────────────────────────
import type { AILetterData, LetterForm, TemplateType } from '@/types/letterpad';

// ── Build user prompt from context ──────────
export function buildPrompt(
  type: string,
  brief: string,
  lang: string,
  form: LetterForm,
  tpl: TemplateType
): string {
  const tMap: Record<string, string> = {
    corporate:         'Corporate Business Letter',
    complaint:         'Complaint Letter',
    rti:               'RTI Application',
    rti_reply:         'RTI Reply / PIO Response',
    circular:          'Circular / Internal Directive',
    reminder:          'Reminder Letter',
    forwarding:        'Forwarding / Endorsement Note',
    scn:               'Show Cause Notice',
    noc:               'No Objection Certificate (NOC)',
    appreciation:      'Letter of Appreciation',
    notice:            'Notice Announcement',
    advisory:          'Advisory / Guidelines',
    student_app:       'Student Application to Principal',
    heritage_personal: 'Heritage / Traditional Family Letter',
    romantic:          'Romantic / Heartfelt Personal Letter',
    personal:          'Personal Letter',
    custom:            'Custom Letter',
  };

  const langNote =
    lang === 'mr' ? 'MANDATORY: Write EVERYTHING in pure, authentic, grammatically flawless formal Marathi (मराठी - Devanagari script). Use standard formal administrative Marathi terminology (प्रति, विषय, संदर्भ, महोदय, आपली/आपला नम्र, शासन निर्णय, इत्यादी).' :
    lang === 'hi' ? 'MANDATORY: Write EVERYTHING in pure, formal Hindi (हिंदी - Devanagari script). Use formal Rajbhasha Hindi terminology (सेवा में, विषय, संदर्भ, महोदय, भवदीय/भवदीया).' :
    lang === 'bi' ? 'Write body in bilingual format (English paragraph then Hindi or Marathi equivalent).' :
    'Write in formal English.';

  const isPersonalType = ['personal', 'student_app', 'heritage_personal', 'romantic'].includes(type);
  const isOfficial = !isPersonalType && type !== 'custom';
  
  let styleNote = 'Standard formal letter with numbered paragraphs for clarity.';
  if (type === 'scn') {
    styleNote = 'Strict Show Cause Notice (SCN): Structured with legal preamble "WHEREAS...", "AND WHEREAS...", and operative command "NOW THEREFORE, the undersigned hereby calls upon... to show cause within [X] days...".';
  } else if (type === 'reminder') {
    styleNote = 'Formal Reminder Letter: Must specifically cite the previous unanswered communication number and date. Starts "This is to invite your attention to our earlier communication of even number dated... A reply in this regard is still awaited."';
  } else if (type === 'complaint') {
    styleNote = 'Formal Complaint Letter: Clearly state the grievance with dates and facts, specify the resolution sought, and keep a firm but courteous tone. Include any reference/ticket numbers.';
  } else if (type === 'rti') {
    styleNote = 'RTI Application (RTI Act, 2005): Plain citizen application addressed to the Public Information Officer. State the information sought in numbered points, mention the application fee payment mode, and keep the format simple — no letterhead.';
  } else if (type === 'rti_reply') {
    styleNote = 'RTI Reply / PIO Response (RTI Act, 2005): Formal reply from the Public Information Officer to the applicant. Number the points to match the application. State what information is enclosed (with page count in the enclosure list) under Section 7. Cite a Section 8 exemption ONLY when the brief states a ground for withholding — never invent one, and never invent facts, dates, or page counts the brief does not give. Always close with first-appeal information under Section 19(1): appeal within 30 days of receipt of this reply, with the First Appellate Authority named by designation. Sign as Public Information Officer with designation and office.';
  } else if (type === 'corporate') {
    styleNote = 'Professional Corporate Business Letter: Formal business tone on company letterhead. Clear subject line, structured numbered paragraphs, and professional closing "Yours faithfully" or "Best regards" as appropriate.';
  } else if (type === 'student_app') {
    styleNote = 'Academic Student Application: Respectful, humble tone addressed to Principal/Dean. Salutation: "Respected Sir / Madam" or "Respected Principal". Closing: "Yours obediently". Mention Class, Roll No., and reason clearly. DO NOT use govt headers.';
  } else if (type === 'heritage_personal') {
    styleNote = 'Traditional Indian Family Letter: Cultured, affectionate, respectful tone. Traditional salutation (e.g. "आदरणीय पिताजी / पूज्य माताजी", "सादर चरण स्पर्श"). Closing: "आपका आज्ञाकारी पुत्र / स्नेही". Inquire about family wellbeing. DO NOT use govt headers.';
  } else if (type === 'romantic') {
    styleNote = 'Romantic & Heartfelt Personal Letter: Emotionally rich, expressive, poetic personal letter between intimate partners. Completely free of any bureaucratic headers, file numbers, or administrative jargon.';
  } else if (type === 'noc') {
    styleNote = 'No Objection Certificate (NOC): Formal certification stating the issuing office has no objection to the stated purpose (e.g. passport application, higher studies, event permission).';
  } else if (type === 'appreciation') {
    styleNote = 'Professional Letter of Appreciation: Warm, formal tone conveying commendation for exceptional service or achievement.';
  }

  return `Generate a complete ${tMap[type] ?? 'letter'} with all fields based ONLY on this brief.

User Brief: "${brief || 'Generate a complete realistic example letter'}"

Letter Style & Protocol: ${styleNote}
Language: ${langNote}

CRITICAL RULES:
1. ${isPersonalType ? 'LEAVE ALL HEADER FIELDS EMPTY (h1, h2, e1, e2, dept, divn, ofc). Private citizens, students, and personal letters use plain formatting with no institutional masthead.' : 'Derive a realistic company / department and office matching the sender context.'}
2. Recipient fields (toD, toA): Must logically correspond to the recipient in the brief.
3. Body: Must strictly follow the specified correspondence protocol above.
4. ${isOfficial ? 'copy_to: 2-3 realistic recipients if applicable. encl: 1-2 realistic enclosures if applicable.' : 'DO NOT add "copy_to" or "encl" fields unless specifically relevant.'}

RESPOND WITH ONLY THE JSON OBJECT.`;
}

// ── Result type includes which Groq model was used ──
export interface AILetterResult {
  data: AILetterData;
  model: string;    // e.g. "llama-3.3-70b-versatile" or a fallback
  missingFields?: string[];
  detectedType?: string;
}

// ── Main function — calls /api/generate-letter route ─
export async function generateLetterWithAI(
  prompt: string,
  letterType: string,
  language: string,
  currentContext: {
    department?: string; office?: string; city?: string;
    officeType?: string; template?: string; tpl?: string;
    mode?: 'content' | 'full'; form?: LetterForm;
    // Forwarded whole to /api/generate-letter: fields the user
    // explicitly typed, which Full mode preserves while replacing
    // everything else AI-owned, plus preset-applied fields, which
    // Full mode preserves only when the model gives nothing.
    userEditedFields?: string[];
    presetFields?: string[];
  },
  onStatus: (msg: string) => void,
  currentForm?: LetterForm,
  templatePreset?: string
): Promise<AILetterResult> {
  onStatus('⏳ Sending to Groq AI server…');

  const res = await fetch('/api/generate-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: prompt,
      letterType,
      language,
      currentContext,
      currentForm,
      templatePreset,
    }),
  });

  const json = await res.json() as {
    success?: boolean;
    data?: Record<string, unknown>;
    error?: string;
    model?: string;
    missing_fields?: string[];
    detected_type?: string;
    letter_type?: string;
  };

  if (!res.ok || json.error) {
    throw new Error(json.error ?? `Server error: HTTP ${res.status}`);
  }
  if (!json.data) {
    throw new Error('AI returned an empty response. Please try again.');
  }

  const modelUsed = json.model || 'Groq AI';
  const missingFields = Array.isArray(json.missing_fields)
    ? (json.missing_fields as string[])
    : (Array.isArray((json.data as Record<string, unknown> | undefined)?.missing_fields)
      ? ((json.data as Record<string, unknown>).missing_fields as string[])
      : []);

  // Map short-key Groq response → AILetterData
  const d = json.data;
  const data: AILetterData = {
    detected_type:         (d.detected_type || letterType) as string,
    letter_type:           (d.letter_type || letterType) as string,
    is_personal:           Boolean(d.is_personal),
    file_no:               (d.fno  || d.file_no  || '') as string,
    fno:                   (d.fno  || d.file_no  || '') as string,
    dt:                    (d.dt || '') as string,
    dept_hindi_1:          (d.h1   || d.dept_hindi_1 || '') as string,
    h1:                    (d.h1   || d.dept_hindi_1 || '') as string,
    dept_hindi_2:          (d.h2   || d.dept_hindi_2 || '') as string,
    h2:                    (d.h2   || d.dept_hindi_2 || '') as string,
    dept_english_1:        (d.e1   || d.dept_english_1 || '') as string,
    e1:                    (d.e1   || d.dept_english_1 || '') as string,
    dept_english_2:        (d.e2   || d.dept_english_2 || '') as string,
    e2:                    (d.e2   || d.dept_english_2 || '') as string,
    department:            (d.dept || d.department || '') as string,
    dept:                  (d.dept || d.department || '') as string,
    division:              (d.divn || d.division || '') as string,
    divn:                  (d.divn || d.division || '') as string,
    office:                (d.ofc  || d.office || '') as string,
    ofc:                   (d.ofc  || d.office || '') as string,
    city:                  (d.city || '') as string,
    pin:                   (d.pin  || '') as string,
    phone:                 (d.ph   || d.phone || '') as string,
    ph:                    (d.ph   || d.phone || '') as string,
    email:                 (d.em   || d.email || '') as string,
    em:                    (d.em   || d.email || '') as string,
    website:               (d.wb   || d.website || '') as string,
    wb:                    (d.wb   || d.website || '') as string,
    to_designation:        (d.toD  || d.to_designation || '') as string,
    toD:                   (d.toD  || d.to_designation || '') as string,
    to_address:            (d.toA  || d.to_address || '') as string,
    toA:                   (d.toA  || d.to_address || '') as string,
    subject:               (d.sub  || d.subject || '') as string,
    sub:                   (d.sub  || d.subject || '') as string,
    reference:             (d.ref  || d.reference || '') as string,
    ref:                   (d.ref  || d.reference || '') as string,
    salutation:            (d.sal  || d.salutation || '') as string,
    sal:                   (d.sal  || d.salutation || '') as string,
    body:                  (d.body || '') as string,
    closing:               (d.cls  || d.closing || '') as string,
    cls:                   (d.cls  || d.closing || '') as string,
    signatory_name:        (d.sn   || d.signatory_name || '') as string,
    sn:                    (d.sn   || d.signatory_name || '') as string,
    signatory_hindi:       (d.sh   || d.signatory_hindi || '') as string,
    sh:                    (d.sh   || d.signatory_hindi || '') as string,
    signatory_designation: (d.sd   || d.signatory_designation || '') as string,
    sd:                    (d.sd   || d.signatory_designation || '') as string,
    signatory_phone:       (d.sp   || d.signatory_phone || '') as string,
    sp:                    (d.sp   || d.signatory_phone || '') as string,
    constituency:          (d.sc   || d.constituency || '') as string,
    sc:                    (d.sc   || d.constituency || '') as string,
    encl: (Array.isArray(d.enclList)
      ? (d.enclList as string[]).join('\n')
      : (d.encl || '')) as string,
    copy_to: (Array.isArray(d.copyList)
      ? d.copyList as string[]
      : Array.isArray(d.copy_to)
        ? d.copy_to as string[]
        : []) as string[],
    missing_fields: missingFields,
  };

  const shortModel = modelUsed.split('/').pop() ?? modelUsed;
  onStatus(`✓ Letter generated! (via ${shortModel})`);

  return {
    data,
    model: modelUsed,
    missingFields,
    detectedType: (json.detected_type as string | undefined) || (d.detected_type as string | undefined),
  };
}

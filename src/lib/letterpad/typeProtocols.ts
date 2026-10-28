// ─────────────────────────────────────────────
//  lib/letterpad/typeProtocols.ts – Single source of truth for AI
//  letter-type protocols, used by the generate-letter route (the
//  prompt the model actually receives). Server-safe: no React, no DOM.
//  No government emblem/seal logic lives here – "official" means a
//  properly formatted organisation letterhead, user-uploaded logo only.
// ─────────────────────────────────────────────

export type AILang = 'en' | 'mr' | 'hi' | 'bi';

export const KNOWN_LETTER_TYPES = [
  'corporate', 'complaint', 'rti', 'rti_reply', 'notice', 'circular',
  'reminder', 'scn', 'noc', 'appreciation', 'advisory', 'forwarding',
  'student_app', 'heritage_personal', 'romantic', 'personal', 'custom',
] as const;

export type KnownLetterType = (typeof KNOWN_LETTER_TYPES)[number];

export interface TypeProtocol {
  label: string;
  isPersonal: boolean;
  /** Generic designation used only when no recipient can be inferred. */
  recipientFallback: string;
  /** Body structure the model must follow, in order. */
  structure: string[];
  /** Fields/details the body must contain (from the brief, never invented). */
  required: string[];
  /** What the model must NOT invent for this type. */
  mustNot: string[];
  /** Short subject prefix used only by the server-side fallback. */
  subjectPrefix: string;
  /** Salutation override by language ('' = use the language default). */
  salutation: Partial<Record<AILang, string>>;
  closing: Partial<Record<AILang, string>>;
}

const COMMON_MUST_NOT = [
  'ministries, departments, officials, phone numbers, emails, dates, amounts, or page counts the user did not give',
  'a fake @nic.in / @gov.in email or a government seal/emblem',
  // Material facts are brief-only: a diagnosis, medical condition,
  // legal ground, or allegation the brief does not state must never
  // appear (live QA: a medical certificate invented "mild viral
  // infection", a legal notice invented rent-default grounds, a Hindi
  // complaint invented a bill date and a deadline).
  'a diagnosis, medical condition, legal ground, allegation, date, amount, or deadline the brief does not give',
];

export const TYPE_PROTOCOLS: Record<KnownLetterType, TypeProtocol> = {
  corporate: {
    label: 'Corporate Business Letter',
    isPersonal: false,
    recipientFallback: 'The Manager',
    structure: ['Purpose of writing', 'Facts / background', 'Specific request or proposal', 'Expected action and timeline', 'Courteous close'],
    required: ['subject', 'recipient designation', 'numbered paragraphs, one point each'],
    mustNot: COMMON_MUST_NOT,
    subjectPrefix: 'Request',
    salutation: {}, closing: {},
  },
  complaint: {
    label: 'Complaint Letter',
    isPersonal: false,
    recipientFallback: 'The Customer Service Manager',
    structure: ['Grievance with dates and facts', 'Reference / ticket / order details given in the brief (______ if not given)', 'Resolution sought (replacement, refund, repair)', 'Deadline for resolution (______ if not given)', 'Courteous but firm close'],
    required: ['grievance', 'resolution sought'],
    mustNot: [...COMMON_MUST_NOT, 'an order number, ticket number, purchase date, bill date, or deadline not in the brief'],
    subjectPrefix: 'Complaint Regarding',
    salutation: {}, closing: {},
  },
  rti: {
    label: 'RTI Application',
    isPersonal: false,
    recipientFallback: 'The Public Information Officer',
    structure: ['Request under Section 6(1) of the RTI Act, 2005', 'Information sought, in numbered points', 'Application fee payment mode (Rs 10 where applicable; BPL exemption only if stated)', 'Request for reply within 30 days under Section 7(1)', 'Applicant address and signature block'],
    required: ['Section 6(1) citation', 'numbered information points', 'fee mode', '30-day period'],
    mustNot: [...COMMON_MUST_NOT, 'a fee amount other than the one stated (Central fee is Rs 10; state fees vary)'],
    subjectPrefix: 'Application under Section 6(1) of the RTI Act, 2005',
    salutation: {}, closing: {},
  },
  rti_reply: {
    label: 'RTI Reply / PIO Response',
    isPersonal: false,
    recipientFallback: 'The Applicant',
    structure: ['Point-by-point reply matching the application', 'Information enclosed under Section 7, with a page-count enclosure list', 'Any withholding, with the Section 8 ground ONLY if the brief states it', 'First-appeal information under Section 19(1): appeal within 30 days of receipt, First Appellate Authority named by designation', 'PIO signature block with designation and office'],
    required: ['Section 7 enclosure list', 'Section 19(1) appeal information'],
    mustNot: [...COMMON_MUST_NOT, 'a Section 8 exemption ground the brief does not state', 'facts, dates, or page counts the brief does not give'],
    subjectPrefix: 'Reply to RTI Application',
    salutation: {}, closing: {},
  },
  notice: {
    label: 'Notice Announcement',
    isPersonal: false,
    recipientFallback: 'All Concerned',
    structure: ['Announcement / decision', 'Effective date (______ if not given)', 'Who it applies to', 'Action required, if any'],
    required: ['announcement', 'audience'],
    // A legal notice to a named recipient is generated under this
    // type when the brief says "legal notice": its grounds must come
    // only from the brief, and the route enforces the formal
    // Dear Sir/Madam + Yours faithfully pair for a specific
    // recipient (never the warm appreciation pair).
    mustNot: [...COMMON_MUST_NOT, 'legal grounds, allegations, or rent-default claims not in the brief'],
    subjectPrefix: 'Notice',
    salutation: { en: 'All Concerned', mr: 'सर्व संबंधित', hi: 'सभी संबंधित', bi: 'All Concerned' },
    closing: {},
  },
  circular: {
    label: 'Circular / Internal Directive',
    isPersonal: false,
    recipientFallback: 'All Department Heads',
    // Timings are the point of an office-timings circular: state them
    // exactly as given, or as a ______ blank — never vague prose in
    // place of timings, and never derive an office or designation
    // from a date in the brief (live QA: "from 1st November" became
    // the fake office "Office of the St November").
    structure: ['Directive / policy', 'Who it applies to', 'Effective date and timings exactly as given in the brief (______ if not given)', 'Compliance required and consequence of non-compliance, if stated'],
    required: ['directive', 'audience', 'timings exactly as given in the brief, or ______ if not given'],
    mustNot: [...COMMON_MUST_NOT, 'an office, department, or designation derived from a date, month, or ordinal in the brief'],
    subjectPrefix: 'Circular',
    salutation: { en: 'All Concerned', mr: 'सर्व संबंधित', hi: 'सभी संबंधित', bi: 'All Concerned' },
    // A circular to a group never takes "Sir / Yours faithfully":
    // the salutation is the group address and the closing is the
    // distinct formal "Yours sincerely", enforced at route level.
    closing: { en: 'Yours sincerely', mr: 'आपला नम्र', hi: 'भवदीय', bi: 'Yours sincerely' },
  },
  reminder: {
    label: 'Reminder Letter (Urgent / Pending)',
    isPersonal: false,
    recipientFallback: 'The Manager',
    structure: ['Reference to the earlier communication (number and date; ______ if not given)', 'Statement that a reply is still awaited', 'Restated request', 'New deadline for reply'],
    required: ['prior reference', 'restated request'],
    mustNot: [...COMMON_MUST_NOT, 'a prior letter number or date not in the brief'],
    subjectPrefix: 'Reminder',
    salutation: {}, closing: {},
  },
  scn: {
    label: 'Show Cause Notice',
    isPersonal: false,
    recipientFallback: '______ (Name and designation of the person called upon to show cause)',
    structure: ['WHEREAS allegations, each in a separate paragraph', 'AND WHEREAS the conduct / rule relied on', 'NOW THEREFORE the undersigned hereby calls upon the recipient to show cause within ______ days', 'Consequence if no reply is received'],
    required: ['allegation', 'days to reply (______ if not given)'],
    mustNot: [...COMMON_MUST_NOT, 'an allegation, rule, or deadline not in the brief'],
    subjectPrefix: 'Show Cause Notice',
    salutation: {}, closing: {},
  },
  noc: {
    label: 'No Objection Certificate (NOC)',
    isPersonal: false,
    recipientFallback: 'To Whom It May Concern',
    structure: ['Certification that the issuing office has no objection', 'Purpose of the NOC (passport, higher studies, event, etc.)', 'Name of the person concerned (______ if not given)', 'Validity period (______ if not given)'],
    required: ['purpose of the NOC', 'person concerned'],
    mustNot: [...COMMON_MUST_NOT, 'a purpose or validity period not in the brief'],
    subjectPrefix: 'No Objection Certificate',
    salutation: { en: 'To Whom It May Concern', mr: 'ज्यांना लागू आहे त्यांना', hi: 'जिसे भी संबंधित हो', bi: 'To Whom It May Concern' },
    closing: {},
  },
  appreciation: {
    label: 'Letter of Appreciation',
    isPersonal: false,
    recipientFallback: '______ (Name of the person being appreciated)',
    // Congratulatory letters (birthday wishes, felicitations) use a
    // warmer salutation/closing than the generic formal default. The
    // route only applies these when neither the model nor an explicit
    // user choice supplies a different, non-generic value — see
    // route.ts. Marathi/Hindi values stay in their own language and
    // never cross (Marathi closing is never Hindi भवदीय).
    structure: ['Warm congratulations / good wishes, naming the occasion', 'Commendation and the specific achievement or service (or, for a birthday, good wishes for health and success)', 'Encouragement / thanks'],
    required: ['occasion (birthday, felicitation, achievement)', 'specific achievement or good wishes'],
    mustNot: [...COMMON_MUST_NOT, 'an achievement, award, or date not in the brief'],
    subjectPrefix: 'Letter of Appreciation',
    salutation: { en: 'Respected Sir', mr: 'आदरणीय महोदय', hi: 'आदरणीय महोदय', bi: 'Respected Sir' },
    closing: { en: 'With warm regards', mr: 'सस्नेह', hi: 'सस्नेह', bi: 'With warm regards' },
  },
  advisory: {
    label: 'Advisory / Guidelines',
    isPersonal: false,
    recipientFallback: 'All Concerned',
    structure: ['Guidance / advisory', 'Who it applies to', 'Steps to follow', 'Contact for clarification (only if given)'],
    required: ['guidance', 'audience'],
    mustNot: COMMON_MUST_NOT,
    subjectPrefix: 'Advisory',
    salutation: { en: 'All Concerned', mr: 'सर्व संबंधित', hi: 'सभी संबंधित', bi: 'All Concerned' },
    closing: {},
  },
  forwarding: {
    label: 'Forwarding / Endorsement Note',
    isPersonal: false,
    recipientFallback: 'The Officer concerned',
    structure: ['What is being forwarded (document, with reference)', 'Why it is forwarded', 'Action requested (information / necessary action)'],
    required: ['document forwarded', 'action requested'],
    mustNot: COMMON_MUST_NOT,
    subjectPrefix: 'Forwarding Letter',
    salutation: {}, closing: {},
  },
  student_app: {
    label: 'Student Application (To Principal / College)',
    isPersonal: true,
    recipientFallback: 'The Principal',
    structure: ['Respectful request', 'Class, Roll No., and reason (______ for any not given)', 'Period / dates (______ if not given)', 'Humble close'],
    required: ['class / roll number if given', 'reason'],
    mustNot: [...COMMON_MUST_NOT, 'a class, roll number, or date not in the brief'],
    subjectPrefix: 'Application',
    salutation: { en: 'Respected Sir/Madam', mr: 'आदरणीय महोदय', hi: 'आदरणीय महोदय', bi: 'Respected Sir/Madam' },
    closing: { en: 'Yours obediently', mr: 'आपला नम्र', hi: 'आपका आज्ञाकारी', bi: 'Yours obediently' },
  },
  heritage_personal: {
    label: 'Heritage / Traditional Family Letter',
    isPersonal: true,
    recipientFallback: '______ (Family member addressed)',
    structure: ['Affectionate greeting and enquiry about wellbeing', 'Family news / purpose of writing', 'Warm close'],
    required: ['wellbeing enquiry'],
    mustNot: [...COMMON_MUST_NOT, 'bureaucratic headers, file numbers, or administrative jargon'],
    subjectPrefix: 'Family Letter',
    salutation: { en: 'Dear ______', mr: 'सस्नेह नमस्कार', hi: 'सादर प्रणाम', bi: 'Dear ______' },
    closing: { en: 'Yours affectionately', mr: 'आपला स्नेही', hi: 'आपका स्नेही', bi: 'Yours affectionately' },
  },
  romantic: {
    label: 'Romantic / Heartfelt Personal Letter',
    isPersonal: true,
    recipientFallback: '______ (Beloved)',
    structure: ['Affectionate opening', 'Feelings / memories', 'Loving close'],
    required: [],
    mustNot: [...COMMON_MUST_NOT, 'bureaucratic headers, file numbers, or administrative jargon'],
    subjectPrefix: 'Personal Letter',
    salutation: { en: 'My Dearest', mr: 'प्रिय', hi: 'प्रिय', bi: 'My Dearest' },
    closing: { en: 'Yours lovingly', mr: 'सस्नेह', hi: 'सस्नेह', bi: 'Yours lovingly' },
  },
  personal: {
    label: 'General Personal Letter',
    isPersonal: true,
    recipientFallback: '______ (Recipient)',
    structure: ['Purpose of writing', 'Details', 'Courteous close'],
    required: [],
    mustNot: COMMON_MUST_NOT,
    subjectPrefix: 'Personal Letter',
    salutation: {}, closing: {},
  },
  custom: {
    label: 'Custom Letter',
    isPersonal: false,
    recipientFallback: '______ (Recipient)',
    structure: ['Purpose of writing', 'Facts / background', 'Request or statement', 'Close'],
    required: [],
    mustNot: COMMON_MUST_NOT,
    subjectPrefix: 'Letter',
    salutation: {}, closing: {},
  },
};

// ── Language defaults ──────────────────────────
const LANG_SAL: Record<AILang, string> = {
  en: 'Sir/Madam', mr: 'महोदय', hi: 'महोदय', bi: 'Sir/Madam',
};
const LANG_CLS: Record<AILang, string> = {
  // Marathi closing is NEVER Hindi भवदीय; Hindi closing is भवदीय.
  en: 'Yours faithfully', mr: 'आपला नम्र', hi: 'भवदीय', bi: 'Yours faithfully',
};

export function salutationFor(type: KnownLetterType, lang: AILang): string {
  return TYPE_PROTOCOLS[type].salutation[lang] ?? LANG_SAL[lang];
}
export function closingFor(type: KnownLetterType, lang: AILang): string {
  return TYPE_PROTOCOLS[type].closing[lang] ?? LANG_CLS[lang];
}

// ── Auto-detection ─────────────────────────────
export function detectLetterType(
  brief: string,
  officeType?: string
): KnownLetterType {
  const b = (brief || '').toLowerCase();
  const has = (...res: RegExp[]) => res.some((r) => r.test(b));
  if (has(/rti.*(reply|response|jawab)|reply.*rti|pio.*reply/)) return 'rti_reply';
  if (has(/\brti\b/, /right to information/, /माहिती.*अधिकार/, /सूचना.*अधिकार/)) return 'rti';
  if (has(/show cause/, /\bscn\b/, /कारण.*दाखवा/)) return 'scn';
  if (has(/\bnoc\b/, /no objection/, /ना-हरकत/)) return 'noc';
  if (has(/student/, /principal/, /school/, /college/, /class\b/, /roll/, /प्राचार्य/, /विद्यार्थी/, /शाळा/, /महाविद्यालय/)) return 'student_app';
  if (has(/complaint/, /defective/, /refund/, /तक्रार/, /शिकायत/)) return 'complaint';
  if (has(/reminder/, /follow[- ]?up/, /pending.*(payment|invoice|reply)/, /अनुस्मरण/)) return 'reminder';
  if (has(/circular/, /all department/, /all staff/, /परिपत्रक/)) return 'circular';
  if (has(/notice/, /announcement/, /सूचना/)) return 'notice';
  if (has(/advisory/, /guidelines/, /मार्गदर्शक/)) return 'advisory';
  // Congratulatory / birthday letters are appreciation letters, not
  // generic corporate letters. This must run before romantic /
  // heritage / personal, so "happy birthday wishes" from an office
  // holder to another office holder is not silently reported as a
  // Corporate Business Letter. The chat modal sends letterType='auto',
  // so without these keywords it fell back to corporate — that was
  // the live birthday-test defect, not a sidebar-type leak (the modal
  // never receives the sidebar's Letter Type; it only sends 'auto').
  if (has(/birthday/, /birth day/, /congratulat/, /felicitat/, /\bwishes\b/, /best wishes/, /greetings/, /वाढदिवस/, /जन्मदिन/, /बधाई/, /शुभकामना/, /शुभेच्छा/)) return 'appreciation';
  if (has(/appreciation/, /commend/, /congrat/, /अभिनंदन/)) return 'appreciation';
  if (has(/forward/, /endorsement/, /पृष्ठांकन/)) return 'forwarding';
  if (has(/love/, /sweetheart/, /beloved/, /प्रेमपत्र/)) return 'romantic';
  if (has(/father/, /mother/, /family/, /वडील/, /आई/, /आप्त/, /भावस्पर्शी/, /कुटुंब/)) return 'heritage_personal';
  if (has(/personal letter/)) return 'personal';
  // A bare leave request from a school context is a student application;
  // otherwise it is an employee (corporate) leave application.
  if (has(/leave/) && officeType === 'school') return 'student_app';
  return 'corporate';
}

export function resolveLetterType(
  requested: string | undefined,
  brief: string,
  officeType?: string
): { resolved: KnownLetterType; detected: string } {
  const req = (requested || '').toLowerCase().trim();
  if ((KNOWN_LETTER_TYPES as readonly string[]).includes(req)) {
    return { resolved: req as KnownLetterType, detected: req };
  }
  if (req === 'citizen_app') {
    // Legacy chat-modal type: no separate protocol; use the corporate
    // protocol but keep the original label for the UI.
    return { resolved: 'corporate', detected: 'citizen_app' };
  }
  // 'auto', '' or any unknown value: detect from the brief, never
  // silently fall back to corporate.
  return { resolved: detectLetterType(brief, officeType), detected: detectLetterType(brief, officeType) };
}

// ── Legal-notice detection (Defect 1/2) ───────────
// A legal notice is NOT only the 'notice' letter type. The live
// retest used Letter Type = Custom with the Legal preset, so
// notice-protocol enforcement keyed on letterType missed it entirely
// and the body invented grounds with a "Sir," salutation. A brief is
// a legal notice when it says "legal notice", or when it says
// "notice" in a legal/advocate context (tenant, vacate, evict) or
// under the Legal/Advocate preset. SCN/RTI types are never overridden
// by this — they have their own protocols.
export function isLegalNotice(
  brief: string,
  officeType?: string,
  requestedType?: string
): boolean {
  const b = (brief || '').toLowerCase();
  if (!b) return false;
  if (/legal notice/.test(b)) return true;
  const legalPreset = officeType === 'legal' || officeType === 'advocate';
  if (/notice/.test(b) && (legalPreset || /tenant|vacat|evict|advocate|legal/.test(b))) return true;
  return false;
}

// ── Token helpers for the ungrounded-value guard ──
const GENERIC_FILLER_TOKENS = new Set([
  'office', 'department', 'dept', 'division', 'section', 'team',
  'branch', 'headquarters', 'hq', 'group', 'unit', 'centre', 'center',
  'services', 'bureau', 'cell', 'desk', 'wing', 'of', 'the', 'and', 'for',
]);

export function tokensOf(text: string): string[] {
  return (text || '').toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * True when a model-supplied department/designation is grounded in
 * nothing the user gave: none of its substantive (non-filler) words
 * appears in the allowed vocabulary (brief + typed-field values +
 * preset-field values). A value made only of filler words ("Office",
 * "Corporate Office" with no "corporate" in the brief) is ungrounded.
 * Callers exempt typed, preset, and brief-sender values — this guard
 * is for model inventions only.
 */
export function isUngroundedValue(value: string, allowedTokens: Set<string>): boolean {
  const substantive = tokensOf(value).filter((t) => !GENERIC_FILLER_TOKENS.has(t) && t.length >= 2);
  if (substantive.length === 0) return true;
  return !substantive.some((t) => allowedTokens.has(t));
}

// ── Invented legal-grounds sanitizer (Defect 1) ───
// Model "example" grounds ("e.g. non-payment of rent, unauthorised
// sub-letting, damage") smuggle invented allegations into a legal
// notice even when the prompt-level ban is present. This is a
// deterministic backstop, applied only to legal notices: any sentence
// asserting an allegation whose trigger words do not appear in the
// brief is replaced by a ______ grounds blank (first one per
// paragraph) or dropped (subsequent ones). A ground the brief DOES
// state (e.g. "for non-payment of rent") survives untouched.
const ALLEGATION_GROUPS: Array<{ re: RegExp; triggers: string[] }> = [
  { re: /non[\s-]?payment|unpaid|rent[^.]{0,30}due|arrears|fail(?:ed|ure) to pay|default(?:ed)? in (?:payment|rent)/i,
    triggers: ['non-payment', 'nonpayment', 'unpaid', 'arrears', 'failed to pay', 'failure to pay', 'rent due', 'default'] },
  { re: /sub[\s-]?let|subleas/i,
    triggers: ['sub-let', 'sublet', 'sub-letting', 'subletting', 'sub-lease', 'sublease'] },
  { re: /damage(?:d)? to|caused damage/i,
    triggers: ['damage', 'damaged'] },
  { re: /breach|violat|contravention/i,
    triggers: ['breach', 'violation', 'violated', 'contravention'] },
  { re: /nuisance|illegal (?:use|activity)/i,
    triggers: ['nuisance', 'illegal'] },
  { re: /unauthori[sz]ed (?:occupation|use|construction)/i,
    triggers: ['unauthorised', 'unauthorized'] },
];

export function stripInventedLegalGrounds(body: string, brief: string): string {
  const briefLower = (brief || '').toLowerCase();
  const hasTrigger = (triggers: string[]) => triggers.some((t) => briefLower.includes(t));
  // Protect abbreviations from the sentence splitter: without this,
  // "Rs. 50,000" splits after "Rs" and "e.g. non-payment..." splits
  // after "e", leaving stray fragments behind after replacement.
  const protect = (t: string) => t
    .replace(/\bRs\./g, 'Rs\u0001')
    .replace(/\be\.g\./gi, 'eg\u0001')
    .replace(/\bi\.e\./gi, 'ie\u0001')
    .replace(/\bDr\./g, 'Dr\u0001')
    .replace(/\bAdv\./g, 'Adv\u0001')
    .replace(/\bMr\./g, 'Mr\u0001')
    .replace(/\bMrs\./g, 'Mrs\u0001')
    .replace(/\bMs\./g, 'Ms\u0001');
  const restore = (t: string) => t.replace(/\u0001/g, '.');
  const splitSentences = (text: string): string[] => {
    const protectedText = protect(text);
    const out = protectedText.match(/[^.!?]+[.!?]+["')\]]*\s*/g);
    if (!out) return text ? [text] : [];
    const joined = out.join('');
    if (joined.length < protectedText.length) out.push(protectedText.slice(joined.length));
    return out.map(restore);
  };
  return (body || '').split('\n\n').map((para) => {
    let replaced = false;
    const sentences = splitSentences(para);
    const kept: string[] = [];
    for (const sent of sentences) {
      const group = ALLEGATION_GROUPS.find((g) => g.re.test(sent));
      if (group && !hasTrigger(group.triggers)) {
        if (!replaced) {
          const num = sent.match(/^\s*\d+[.)]\s*/)?.[0] || '';
          const trail = sent.match(/\s*$/)?.[0] || '';
          kept.push(`${num}The grounds for this notice are: ______.${trail}`);
          replaced = true;
        }
        // Subsequent invented-ground sentences are dropped, not blanked.
        continue;
      }
      kept.push(sent);
    }
    return kept.join('').trim();
  }).filter(Boolean).join('\n\n');
}

// ── Trailing-closing stripper (Defect 3) ──────────
// The paper always renders the Closing field, so a generated body
// that itself ends with a closing ("Yours faithfully,") prints TWO
// closings. Strip trailing closing-only lines/paragraphs from the
// body (and trailing signature lines matching the signatory, which
// the paper also renders separately). A closing inside the body text
// (not at the end) is untouched.
const CLOSING_PHRASES = [
  'yours faithfully', 'yours sincerely', 'yours obediently',
  'yours affectionately', 'yours lovingly', 'yours truly',
  'with warm regards', 'with warmest regards', 'warm regards',
  'regards', 'sincerely', 'faithfully',
  'भवदीय', 'भवदीया', 'आपला नम्र', 'आपली नम्र', 'सस्नेह',
  'आपका आज्ञाकारी', 'आपला विश्वासू', 'कळावे, आपला नम्र',
];

export function stripTrailingClosing(body: string, signatureLines: string[] = []): string {
  const norm = (s: string) => s.trim().replace(/[,.\s]+$/, '').toLowerCase();
  const sigNorms = new Set(signatureLines.map(norm).filter(Boolean));
  let paras = (body || '').trim().split(/\n\n+/);
  let changed = true;
  while (changed && paras.length) {
    changed = false;
    const last = paras[paras.length - 1];
    const lines = last.split('\n');
    // Pop trailing lines that are a closing phrase or a signature line.
    while (lines.length) {
      const tail = norm(lines[lines.length - 1]);
      if (CLOSING_PHRASES.includes(tail) || (tail && sigNorms.has(tail))) {
        lines.pop();
        changed = true;
      } else break;
    }
    if (lines.length === 0) {
      paras.pop();
      changed = true;
      continue;
    }
    const rejoined = lines.join('\n').trim();
    if (rejoined !== last.trim()) paras[paras.length - 1] = rejoined;
    // Trailing closing as a final sentence ("... . Yours faithfully,").
    const m = paras[paras.length - 1].match(/^(.*?[.!?])\s*([A-Za-z\u0900-\u097f][^.]*?)[,\s]*$/);
    if (m && CLOSING_PHRASES.includes(norm(m[2]))) {
      paras[paras.length - 1] = m[1].trim();
      changed = true;
    }
  }
  return paras.join('\n\n').trim();
}

// ── Recipient inference ────────────────────────
export interface RecipientCtx {
  toD?: string;
  officeType?: string;
  dept?: string;
  e1?: string;
  ofc?: string;
}

export function inferRecipient(type: KnownLetterType, ctx: RecipientCtx): string {
  if (ctx.toD && ctx.toD.trim()) return ctx.toD.trim();
  // School context overrides generic corporate recipients.
  if (ctx.officeType === 'school' &&
    ['corporate', 'custom', 'reminder', 'forwarding', 'complaint'].includes(type)) {
    return 'The Principal';
  }
  return TYPE_PROTOCOLS[type].recipientFallback;
}

// ── Sender extraction from the brief (Full-letterhead mode only) ──
// When a user writes "Write a letter from deputy chief minister,
// Government of Maharashtra to the Prime Minister for birthday
// wishes", the sender office and designation ARE given — in the brief,
// not in the form. The model was previously not told to derive a
// header from the brief, so Entire Letterhead mode returned a blank
// header (placeholders only) despite promising to replace headers.
// This deterministic fallback fills sd/dept/e1 from the brief's own
// words only: no person name, no phone, no email, no address, no
// city/PIN, no emblem/seal, and nothing not present in the brief.
// It is used only in Full mode, after the model output and after any
// user-filled form value, so it can never overwrite real user data
// or a model value with an invention.
const DESIGNATION_SPELLING: Record<string, string> = {
  minster: 'minister',
  ministar: 'minister',
  cheif: 'chief',
  goverment: 'government',
  prim: 'prime',
};

function titleCaseDesignation(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => DESIGNATION_SPELLING[w] || w)
    .map((w) => (w === 'of' ? 'of' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
    .replace(/\s+Of\s+/g, ' of ')
    .trim();
}

// ── Date-fragment guard (Defect 1) ───────────────────────
// A department or designation must never be a date. The live circular
// case proves why: "new office timings from 1st November" was parsed
// as a sender segment, title-cased ("1st" → "St") into the fake office
// "Office of the St November" and designation "St November", which
// then rendered in the header, signature, and footer. Any value whose
// tokens contain a month name, or which starts with an ordinal
// (1st/2nd/3rd…), or which is just an ordinal + one word ("St
// November"), is a date fragment, not an office. Token-exact month
// matching keeps real names safe: "St. Mary's Hospital" has no month
// token, and "Mayfair" is one token, not the month "May".
const MONTH_TOKENS = [
  'january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december',
  'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept',
  'oct', 'nov', 'dec',
];

export function looksLikeDateFragment(v?: string | null): boolean {
  const t = (v || '').toLowerCase().trim();
  if (!t) return false;
  const tokens = t.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  if (tokens.some((tok) => MONTH_TOKENS.includes(tok))) return true;
  if (/^\d{1,2}\s*(st|nd|rd|th)\b/.test(t)) return true;
  if (tokens.length <= 2 && /^(st|nd|rd|th)$/.test(tokens[0] || '')) return true;
  return false;
}

export interface BriefSender {
  sd?: string;
  dept?: string;
  e1?: string;
}

export function extractSenderFromBrief(brief: string): BriefSender {
  const text = (brief || '').trim();
  if (!text) return {};
  // "from <sender> to <recipient>" is the clearest pattern; fall back
  // to "from <sender> for ..." / end of brief.
  const fromTo = text.match(/from\s+(.+?)\s+to\s+/i);
  const fromFor = text.match(/from\s+(.+?)\s+for\s+/i);
  const fromEnd = text.match(/from\s+(.+?)\s*$/i);
  const segmentRaw = (fromTo?.[1] || fromFor?.[1] || fromEnd?.[1] || '').trim();
  if (!segmentRaw || segmentRaw.length > 80) return {};
  // Date-fragment guard: a "from <date>" phrase ("from 1st November")
  // is a date, never a sender office. Without this, title-casing
  // turns "1st November" into the fake designation "St November".
  if (looksLikeDateFragment(segmentRaw)) return {};
  // Split off "Government of X" / "gov of X" / "of X" at the end.
  const govMatch = segmentRaw.match(/^(.*?)[,\s]+(?:gov(?:ernment)?|govt)\s+of\s+(.+)$/i)
    || segmentRaw.match(/^(.*?)[,\s]+government\s+of\s+(.+)$/i);
  let designationRaw = segmentRaw;
  let govPlace = '';
  if (govMatch) {
    designationRaw = govMatch[1];
    govPlace = govMatch[2];
  } else {
    const ofMatch = segmentRaw.match(/^(.*?)\s+of\s+([A-Za-z][A-Za-z\s]+)$/);
    if (ofMatch) {
      designationRaw = ofMatch[1];
      govPlace = ofMatch[2];
    }
  }
  designationRaw = designationRaw.replace(/^the\s+/i, '').trim();
  govPlace = govPlace.replace(/,+$/, '').trim();
  if (!designationRaw) return {};
  // A comma inside the sender segment ("Collector, Pune District")
  // separates designation from place — keep it as a comma, not a
  // run-together phrase, and keep the office name designation-only.
  const commaParts = designationRaw.split(',').map((p) => p.trim()).filter(Boolean);
  const designation = commaParts.length > 1 && !govPlace
    ? `${titleCaseDesignation(commaParts[0])}, ${titleCaseDesignation(commaParts.slice(1).join(' '))}`
    : titleCaseDesignation(designationRaw);
  if (!designation) return {};
  // Only trust the segment if it looks like a designation/office:
  // a known designation word, or a short office phrase. Anything
  // longer or vaguer is left blank rather than guessed.
  const known = /(chief minister|prime minister|minister|governor|collector|postmaster|manager|principal|secretary|director|mayor|chairman|chairperson|president|commissioner|officer|head)/i;
  if (!known.test(designation) && designation.split(' ').length > 4) return {};
  const govName = govPlace ? `Government of ${titleCaseDesignation(govPlace)}` : '';
  const sd = govName ? `${designation}, ${govName}` : designation;
  const officeName = commaParts.length > 1 && !govPlace
    ? titleCaseDesignation(commaParts[0])
    : designation;
  return {
    sd,
    dept: `Office of the ${officeName}`,
    e1: govName || undefined,
  };
}

// ── Placeholder preset values (not real data) ──
const PLACEHOLDER_VALUES = [
  'your company name', 'your startup name', 'your full name', 'advocate name',
  'registered office address', 'office address', 'chamber address',
  'hospital address', 'residential address', 'tagline / pvt. ltd.',
  'info@company.com', 'hello@startup.com', 'you@email.com',
  'www.company.com', 'www.startup.com',
  '+91-22-0000 0000', '+91-80-0000 0000', '+91-00000 00000',
];

export function isPlaceholderValue(v?: string | null): boolean {
  if (!v) return true;
  const t = v.trim().toLowerCase();
  if (!t) return true;
  if (PLACEHOLDER_VALUES.includes(t)) return true;
  if (/^your\s/.test(t)) return true;
  if (/^\+91-0+/.test(t)) return true;
  return false;
}

/** Ground truth with preset placeholder values stripped to ''. */
export function stripPlaceholders(form: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(form || {})) {
    const s = typeof v === 'string' ? v : '';
    out[k] = isPlaceholderValue(s) ? '' : s;
  }
  return out;
}

// ── Topic matching: does a new brief belong to a previous subject? ──
// Subject and recipient are TOPIC-DEPENDENT, unlike sender/office
// identity (name, department, address), which is stable across letters.
// A previous subject must only be reused when the new brief is empty,
// generic ("Draft a complete formal letter"), or about the same topic.
// Otherwise reusing it produces the live bug where a complaint letter
// kept the previous sick-leave subject above a phone-complaint body.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'for', 'to', 'of', 'on', 'in', 'about', 'regarding',
  'please', 'write', 'draft', 'generate', 'prepare', 'letter', 'formal',
  'application', 'request', 'reply', 'response',
]);

function briefTokens(text: string): string[] {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/).filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

export function briefMatchesSubject(brief: string, subject?: string): boolean {
  const b = (brief || '').trim();
  if (!b) return true;
  if (/^draft a complete formal letter$/i.test(b)) return true;
  const sub = (subject || '').trim();
  if (!sub) return false;
  const bTokens = briefTokens(b);
  const sTokens = new Set(briefTokens(sub));
  if (bTokens.length === 0) return true;
  // Same topic if every substantive brief word appears in the subject,
  // or at least one substantive word overlaps (e.g. "sick leave" vs
  // "Application for Sick Leave" overlaps on sick + leave).
  if (bTokens.every((t) => sTokens.has(t))) return true;
  return bTokens.some((t) => sTokens.has(t));
}

export function isDevanagari(v?: string | null): boolean {
  return /[\u0900-\u097F]/.test(v || '');
}

// ── Localisation for Hindi/Marathi letters (Defect 8) ─────
// The model is told to write everything in the target language, but
// it still returns English generic recipients ("The Customer Service
// Manager", "The Principal") and the client seeds the date in English
// ("27 October 2026"). Exact-match translation of GENERIC designations
// only — a real name or a specific organisation is never translated,
// and nothing is ever crossed between Marathi and Hindi.
const RECIPIENT_LOCALISATION: Record<string, { mr: string; hi: string }> = {
  'the customer service manager': { mr: 'ग्राहक सेवा व्यवस्थापक', hi: 'ग्राहक सेवा प्रबंधक' },
  'the principal': { mr: 'प्राचार्य', hi: 'प्राचार्य' },
  'the manager': { mr: 'व्यवस्थापक', hi: 'प्रबंधक' },
  'the public information officer': { mr: 'जन माहिती अधिकारी', hi: 'लोक सूचना अधिकारी' },
  'the applicant': { mr: 'अर्जदार', hi: 'आवेदक' },
  'all concerned': { mr: 'सर्व संबंधित', hi: 'सभी संबंधित' },
  'all department heads': { mr: 'सर्व विभाग प्रमुख', hi: 'सभी विभाग प्रमुख' },
  'all staff': { mr: 'सर्व कर्मचारी', hi: 'सभी कर्मचारी' },
  'to whom it may concern': { mr: 'ज्यांना लागू आहे त्यांना', hi: 'जिसे भी संबंधित हो' },
};

export function localiseRecipient(toD: string, lang: AILang): string {
  if (lang !== 'mr' && lang !== 'hi') return toD;
  const key = (toD || '').trim().replace(/,+\s*$/, '').toLowerCase();
  const hit = RECIPIENT_LOCALISATION[key];
  return hit ? hit[lang] : toD;
}

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const toDevanagariDigits = (s: string) => s.replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
const MONTH_NAMES: Record<string, { mr: string; hi: string }> = {
  january: { mr: 'जानेवारी', hi: 'जनवरी' },
  february: { mr: 'फेब्रुवारी', hi: 'फ़रवरी' },
  march: { mr: 'मार्च', hi: 'मार्च' },
  april: { mr: 'एप्रिल', hi: 'अप्रैल' },
  may: { mr: 'मे', hi: 'मई' },
  june: { mr: 'जून', hi: 'जून' },
  july: { mr: 'जुलै', hi: 'जुलाई' },
  august: { mr: 'ऑगस्ट', hi: 'अगस्त' },
  september: { mr: 'सप्टेंबर', hi: 'सितंबर' },
  october: { mr: 'ऑक्टोबर', hi: 'अक्टूबर' },
  november: { mr: 'नोव्हेंबर', hi: 'नवंबर' },
  december: { mr: 'डिसेंबर', hi: 'दिसंबर' },
};
const MONTH_ABBREV: Record<string, string> = {
  jan: 'january', feb: 'february', mar: 'march', apr: 'april',
  jun: 'june', jul: 'july', aug: 'august', sep: 'september',
  sept: 'september', oct: 'october', nov: 'november', dec: 'december',
};

/** "27 October 2026" → "२७ ऑक्टोबर २०२६" (mr) / "२७ अक्टूबर २०२६" (hi).
 * Also handles "October 27, 2026". Unmatched values pass through
 * untouched. The VALUE is converted, not just the label: an earlier
 * pass localised only "दिनांक:" while the value stayed in English
 * digits, because the client never applied the route's dt at all. */
export function localiseDate(dt: string, lang: AILang): string {
  if (lang !== 'mr' && lang !== 'hi') return dt;
  const raw = (dt || '').trim();
  const m = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
    || raw.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (!m) return dt;
  // m[1]/m[2] are day/month in the first form, month/day in the second.
  const isMonthFirst = /^[A-Za-z]/.test(raw);
  const day = isMonthFirst ? m[2] : m[1];
  const monthWord = isMonthFirst ? m[1] : m[2];
  const year = m[3];
  const monthKey = MONTH_ABBREV[monthWord.toLowerCase()] || monthWord.toLowerCase();
  const month = MONTH_NAMES[monthKey];
  if (!month) return dt;
  return `${toDevanagariDigits(day)} ${month[lang]} ${toDevanagariDigits(year)}`;
}

// ── Subject fallback (server-side, model output is primary) ──
// NOTE: existingSub is the PREVIOUS letter's subject, not ground truth
// for this generation. It is reused only when the brief matches it
// (see briefMatchesSubject); otherwise a fresh subject is synthesized
// from the new brief. The AI-supplied subject, when present, always
// wins over both — the route passes it before calling this.
export function synthesizeSubject(type: KnownLetterType, brief: string, existingSub?: string): string {
  if (existingSub && existingSub.trim() && briefMatchesSubject(brief, existingSub)) {
    return existingSub.trim();
  }
  let b = (brief || '').trim().replace(/\s+/g, ' ');
  b = b.replace(/^(please\s+)?(write|draft|generate|prepare)\s+(a\s+)?(formal\s+)?(letter\s+)?(about|for|regarding|on)\s+/i, '');
  // Avoid "Complaint Regarding — Complaint defective…" duplication:
  // strip a leading type word the user already typed.
  const stripLead: Partial<Record<KnownLetterType, RegExp>> = {
    rti: /^rti\s+/i,
    rti_reply: /^rti\s+(reply|response)\s+/i,
    scn: /^show\s+cause\s+notice\s+/i,
    noc: /^noc\s+(for\s+)?/i,
    circular: /^circular\s+/i,
    complaint: /^complaint\s+/i,
    reminder: /^reminder\s+/i,
    notice: /^notice\s+/i,
    advisory: /^advisory\s+/i,
    appreciation: /^(letter\s+of\s+)?appreciation\s+/i,
    forwarding: /^forwarding\s+/i,
  };
  const strip = stripLead[type];
  if (strip) b = b.replace(strip, '');
  b = b.replace(/[.\s]+$/, '');
  if (!b) return TYPE_PROTOCOLS[type].label;
  const titled = b.charAt(0).toUpperCase() + b.slice(1);
  const sub = `${TYPE_PROTOCOLS[type].subjectPrefix} — ${titled}`;
  return sub.length > 120 ? sub.slice(0, 117).replace(/\s+\S*$/, '') : sub;
}

// ── Body fallback (only when the model body is missing/too short) ──
export function buildFallbackBody(
  type: KnownLetterType,
  brief: string,
  lang: AILang,
  secondLang: 'mr' | 'hi'
): string {
  const topic = (brief || 'this matter').trim().replace(/\s+/g, ' ');
  const p = TYPE_PROTOCOLS[type];
  // Personal letters must never fall back to a formal request template.
  if (type === 'romantic' || type === 'heritage_personal') {
    if (lang === 'mr') {
      return type === 'romantic'
        ? 'प्रिय,\n\nमी तुला हे पत्र प्रेमाने लिहीत आहे. तुझ्या आठवणी मनात नेहमी असतात.\n\nतुझी काळजी घे, लवकर भेटू.'
        : 'सस्नेह नमस्कार,\n\nतुम्ही सर्वजण सुखरूप असाल अशी आशा करतो. घरातील सर्वांची खुशाली कळवावी.\n\nतुमची काळजी घ्या.';
    }
    if (lang === 'hi') {
      return type === 'romantic'
        ? 'प्रिय,\n\nमैं यह पत्र तुम्हें प्रेम से लिख रहा हूँ। तुम्हारी यादें हमेशा मन में रहती हैं।\n\nअपना ख्याल रखना।'
        : 'सादर प्रणाम,\n\nआप सभी कुशल होंगे, ऐसी आशा करता हूँ। घर के सभी लोगों की कुशलता बताना।\n\nअपना ख्याल रखना।';
    }
    const en = type === 'romantic'
      ? `My dearest,\n\nI am writing to you with all my love, thinking of ${topic}.\n\nTake care of yourself, and know that you are always in my thoughts.`
      : `Dear family,\n\nI hope you are all in good health and happiness. I am writing regarding ${topic}.\n\nPlease write back with everyone's news. Take care.`;
    if (lang === 'bi') {
      return `${en}\n\n${secondLang === 'mr' ? 'प्रिय, मी तुला हे पत्र प्रेमाने लिहीत आहे.' : 'प्रिय, मैं यह पत्र तुम्हें प्रेम से लिख रहा हूँ।'}`;
    }
    return en;
  }
  if (lang === 'mr') {
    return [
      `${topic} या विषयासंदर्भात हे पत्र लिहीत आहे.`,
      `या प्रकरणी आवश्यक ती माहिती / कार्यवाही पुढीलप्रमाणे अपेक्षित आहे: ______ (तारीख, संदर्भ किंवा रक्कम येथे नमूद करावी).`,
      `कृपया या विषयी आवश्यक कार्यवाही करावी आणि कळवावे. आपल्या सहकार्याबद्दल धन्यवाद.`,
    ].join('\n\n');
  }
  if (lang === 'hi') {
    return [
      `${topic} के विषय में यह पत्र लिखा जा रहा है।`,
      `इस प्रकरण में आवश्यक जानकारी / कार्रवाई इस प्रकार अपेक्षित है: ______ (तारीख, संदर्भ या राशि यहाँ लिखें)।`,
      `कृपया इस विषय में आवश्यक कार्रवाई करें और सूचित करें। आपके सहयोग के लिए धन्यवाद।`,
    ].join('\n\n');
  }
  const en = [
    `I am writing regarding ${topic}.`,
    `The details of this matter are as follows: ______ (please fill in the date, reference number, or amount, as applicable). ${p.structure.slice(1).join('. ')}.`,
    `I request you to take the necessary action in this regard and inform me accordingly. Thank you for your cooperation.`,
  ].join('\n\n');
  if (lang === 'bi') {
    const second = secondLang === 'mr'
      ? `${topic} या विषयासंदर्भात हे पत्र लिहीत आहे. कृपया या विषयी आवश्यक कार्यवाही करावी.`
      : `${topic} के विषय में यह पत्र लिखा जा रहा है। कृपया इस विषय में आवश्यक कार्रवाई करें।`;
    return `${en}\n\n${second}`;
  }
  return en;
}

// ── Missing fields (for the UI warning) ────────
export function computeMissingFields(
  args: {
    type: KnownLetterType;
    toD: string;
    sn: string;
    sd: string;
    sal: string;
    body: string;
    brief: string;
  }
): string[] {
  const missing: string[] = [];
  const { type, toD, sn, sd, sal, body, brief } = args;
  if (!toD.trim() || toD.includes('______')) missing.push('toD');
  // An RTI reply addressed only to the generic "The Applicant" is not
  // a complete reply — a real reply goes to a named applicant. Flag it
  // so the UI warns instead of presenting it as finished.
  if (type === 'rti_reply' && toD.trim() === TYPE_PROTOCOLS.rti_reply.recipientFallback) {
    if (!missing.includes('toD')) missing.push('toD');
  }
  if (!sn.trim()) missing.push('sn');
  if (!TYPE_PROTOCOLS[type].isPersonal &&
    ['corporate', 'complaint', 'circular', 'notice', 'advisory', 'forwarding', 'scn', 'noc', 'appreciation', 'reminder', 'rti_reply'].includes(type) &&
    !sd.trim()) {
    missing.push('sd');
  }
  if (!sal.trim() || sal.includes('______')) missing.push('sal');
  if (!body.trim() || body.trim().length < 150) missing.push('body');
  const words = (brief || '').trim().split(/\s+/).filter(Boolean).length;
  if (words > 0 && words <= 5 && !TYPE_PROTOCOLS[type].isPersonal && type !== 'romantic') {
    missing.push('details');
  }
  // A body that still contains ______ blanks is not finished, whatever
  // the model was or however long the brief was. This is the fix for
  // the live RTI-reply case: its brief was long (so the ≤5-word rule
  // did not fire), yet its body contained a blank — and no warning
  // appeared. The warning must not depend on which model generated it.
  if (body.includes('______') && !TYPE_PROTOCOLS[type].isPersonal) {
    if (!missing.includes('details')) missing.push('details');
  }
  return missing;
}

/** Human-readable labels for missing_fields, used by the UI warning. */
export const MISSING_FIELD_LABELS: Record<string, string> = {
  toD: 'recipient',
  sn: 'signatory name',
  sd: 'signatory designation',
  sal: 'salutation',
  body: 'letter body',
  details: 'dates / amounts / reference details (your prompt was very short)',
};

export function protocolPrompt(type: KnownLetterType, lang: AILang, secondLang: 'mr' | 'hi'): string {
  const p = TYPE_PROTOCOLS[type];
  const langNote =
    lang === 'mr' ? 'MANDATORY: Write EVERYTHING in pure, authentic, grammatically flawless formal Marathi (मराठी - Devanagari script). Use standard formal administrative Marathi terminology (प्रति, विषय, संदर्भ, महोदय, आपला नम्र, इत्यादी). Marathi closing is NEVER Hindi भवदीय.' :
    lang === 'hi' ? 'MANDATORY: Write EVERYTHING in pure, formal Hindi (हिंदी - Devanagari script). Use formal Rajbhasha Hindi terminology (सेवा में, विषय, संदर्भ, महोदय, भवदीय/भवदीया).' :
    lang === 'bi' ? `BILINGUAL: Write the body in bilingual format — every English paragraph followed immediately by its ${secondLang === 'mr' ? 'Marathi (मराठी)' : 'Hindi (हिन्दी)'} equivalent, in the same order. Salutation and closing stay in English.` :
    'Write in formal English.';
  const rtiReplyMust = type === 'rti_reply'
    ? `\nMANDATORY CITATION: The appeal paragraph MUST contain the exact text 'Section 19(1)' — a paraphrase like 'first appeal within 30 days' without the section number is NOT sufficient. Name the First Appellate Authority by designation.`
    : '';
  return `LETTER TYPE: ${p.label}
${langNote}${rtiReplyMust}
PREFERRED SALUTATION (use this unless the brief or the user explicitly chose another): ${salutationFor(type, lang)}.
PREFERRED CLOSING (use this unless the brief or the user explicitly chose another): ${closingFor(type, lang)}.
BODY STRUCTURE (follow in order): ${p.structure.join(' → ')}.
REQUIRED IN THIS LETTER: ${p.required.length ? p.required.join('; ') : 'none beyond a complete body'}.
NEVER INVENT: ${p.mustNot.join('; ')}.
SHORT-PROMPT RULE: The brief may be only 2–5 words. Expand it into a COMPLETE letter anyway — subject, recipient, salutation, closing, and a body of several paragraphs. Number paragraphs ONLY where the type protocol calls for numbered structure (formal office letters, RTI points, notices); appreciation/congratulatory letters and medical certificates use FLOWING PROSE, never numbered paragraphs, unless the brief explicitly asks for numbering. Use ______ blanks ONLY for details the brief genuinely does not give (dates, amounts, reference numbers, names); never invent a person, company, ministry, phone number, email, date, amount, or page count to fill a gap. If the recipient cannot be determined from the brief or the sender context, return toD as a clearly fillable placeholder (see recipient fallback), not a fake name.
ANTI-HALLUCINATION (MATERIAL FACTS): Diagnosis, medical conditions, treatments, legal grounds, allegations, dates, amounts, and deadlines come ONLY from the brief — otherwise use ______ blanks. A medical certificate is flowing prose unless the brief asks otherwise, and must NEVER state a diagnosis the brief does not give. An office, department, or designation must come from a NAMED sender in the brief or a user-filled field — NEVER derive one from a date, month, or ordinal in the brief (e.g. "1st November" is a date, not an office). NEVER invent a department or designation the brief does not name (do NOT invent "Corporate Office", "HR Department", or any similar office — if the brief names no department/designation, leave it blank). A LEGAL NOTICE with no grounds in the brief must state its grounds as ______ — NEVER list example grounds ("e.g. non-payment of rent, unauthorised sub-letting, damage") to fill the gap; an example list is still an invented allegation. DATES: reproduce every date EXACTLY as given in the brief — never append a year, month, or day the brief does not give (a brief saying "1st November" must never become "1st November 2026"). CLOSING: the body must NOT end with a closing phrase — the paper renders the Closing field separately, so a body ending in "Yours faithfully," would print two closings.`;
}

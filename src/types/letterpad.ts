// ─────────────────────────────────────────────
//  types/letterpad.ts  –  All shared TypeScript types for Letterpad
// ─────────────────────────────────────────────

export type TemplateType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type OfficeType =
  | 'dop' | 'pm' | 'minister' | 'mp' | 'mla'
  | 'district' | 'rms' | 'savings' | 'custom' | 'personal';
export type FontClass = '' | 'fg' | 'fs' | 'fd2' | 'ft' | 'fn';
export type SigMode = 'draw' | 'type' | 'upload';
export type LogoSide = 'L' | 'R';
export type AILetterType =
  | 'office_order' | 'om' | 'do' | 'circular' | 'reminder'
  | 'forwarding' | 'scn' | 'noc' | 'appreciation' | 'tour'
  | 'notice' | 'advisory' | 'notification' | 'student_app'
  | 'heritage_personal' | 'romantic' | 'citizen_app' | 'personal'
  | 'pm_do' | 'mp_letter' | 'custom' | 'auto';
export type AILanguage = 'en' | 'hi' | 'mr' | 'bi';

// ── Letter form state (all sidebar fields) ──────────────
export interface LetterForm {
  // Ministry/Office
  h1: string;       // Hindi line 1
  h2: string;       // Hindi line 2
  e1: string;       // English line 1
  e2: string;       // English line 2
  dept: string;
  divn: string;
  ofc: string;
  city: string;
  pin: string;
  ph: string;
  em: string;
  wb: string;
  // Signatory
  sn: string;       // Name
  sd: string;       // Designation
  sp: string;       // Phone
  sh: string;       // Hindi name
  sc: string;       // Constituency
  // Letter meta
  fno: string;
  dt: string;
  toD: string;
  toA: string;
  sub: string;
  ref: string;
  sal: string;
  cls: string;
  // Body
  body: string;
  // Extras
  encl: string;
  copyTo: string[];
  endorsement: string;
}

// ── Logo position/size on paper ─────────────────────────
export interface LogoPos {
  x: number;
  y: number;
  w: number;
  placed: boolean;
}

export type FooterDesign = 'classic' | 'modern' | 'minimal' | 'tricolor' | 'executive';

// ── Full app state ──────────────────────────────────────
export interface AppState {
  tpl: TemplateType;
  font: FontClass;
  officeType: OfficeType;
  logoL: string | null;   // data URI
  logoR: string | null;
  posL: LogoPos;
  posR: LogoPos;
  sigUrl: string | null;
  sigMode: SigMode;
  showEncl: boolean;
  showCopy: boolean;
  showEndorse: boolean;
  showFooter?: boolean;
  footerDesign?: FooterDesign;
  form: LetterForm;
  aiTick?: number;
}

// ── AI response JSON shape ──────────────────────────────
export interface AILetterData {
  detected_type?: string;
  letter_type?: string;
  is_personal?: boolean;
  file_no?: string;
  fno?: string;
  dept_hindi_1?: string;
  h1?: string;
  dept_hindi_2?: string;
  h2?: string;
  dept_english_1?: string;
  e1?: string;
  dept_english_2?: string;
  e2?: string;
  department?: string;
  dept?: string;
  division?: string;
  divn?: string;
  office?: string;
  ofc?: string;
  city?: string;
  pin?: string;
  phone?: string;
  ph?: string;
  email?: string;
  em?: string;
  website?: string;
  wb?: string;
  to_designation?: string;
  toD?: string;
  to_address?: string;
  toA?: string;
  subject?: string;
  sub?: string;
  reference?: string;
  ref?: string;
  salutation?: string;
  sal?: string;
  body: string;
  closing?: string;
  cls?: string;
  signatory_name?: string;
  sn?: string;
  signatory_designation?: string;
  sd?: string;
  encl?: string;
  enclList?: string[];
  copy_to?: string[];
  copyList?: string[];
}

// ── Office preset data ──────────────────────────────────
export interface OfficePreset {
  h1: string; h2: string;
  e1: string; e2: string;
  dept: string; divn: string;
  ofc: string; city: string; pin: string;
  ph: string; em: string; wb: string;
  ll: string | null;  // logo preset key
  lr: string | null;
  t: TemplateType;
}

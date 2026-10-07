// ─────────────────────────────────────────────
//  lib/letterpad/constants.ts  –  All static data & SVGs
// ─────────────────────────────────────────────
import type { OfficePreset, LetterForm, TemplateType, LogoPos } from '@/types/letterpad';
import type { CSSProperties } from 'react';

// ── SVG Logos ────────────────────────────────
// (Government seal artwork removed during corporate refocus.)

export const SVG_LOGOS: Record<string, string> = {};

export function svgToDataUri(key: string): string {
  const svg = SVG_LOGOS[key];
  if (!svg) return '';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ── Office Presets ────────────────────────────
export const OFFICE_PRESETS: Record<string, OfficePreset> = {
  corporate: { h1:'Your Company Name', h2:'', e1:'Tagline / Pvt. Ltd.', e2:'', dept:'', divn:'', ofc:'Registered Office Address', city:'Mumbai', pin:'400 001', ph:'+91-22-0000 0000', em:'info@company.com', wb:'www.company.com', ll:null, lr:null, t:'A' },
  startup:   { h1:'Your Startup Name', h2:'', e1:'Tagline / Pvt. Ltd.', e2:'', dept:'', divn:'', ofc:'Office Address', city:'Bengaluru', pin:'560 001', ph:'+91-80-0000 0000', em:'hello@startup.com', wb:'www.startup.com', ll:null, lr:null, t:'B' },
  personal:  { h1:'Your Full Name', h2:'', e1:'', e2:'', dept:'', divn:'', ofc:'Residential Address', city:'', pin:'', ph:'+91-00000 00000', em:'you@email.com', wb:'', ll:null, lr:null, t:'B' },
  legal:     { h1:'Advocate Name', h2:'', e1:'Advocate & Legal Consultant', e2:'', dept:'', divn:'', ofc:'Chamber Address', city:'', pin:'', ph:'', em:'', wb:'', ll:null, lr:null, t:'B' },
  healthcare:{ h1:'Clinic / Hospital Name', h2:'', e1:'Multi-Speciality Clinic', e2:'', dept:'', divn:'', ofc:'Hospital Address', city:'', pin:'', ph:'+91-00000 00000', em:'', wb:'', ll:null, lr:null, t:'B' },
  complaint: { h1:'', h2:'', e1:'', e2:'', dept:'', divn:'', ofc:'', city:'', pin:'', ph:'', em:'', wb:'', ll:null, lr:null, t:'B' },
  rti:       { h1:'', h2:'', e1:'', e2:'', dept:'', divn:'', ofc:'', city:'', pin:'', ph:'', em:'', wb:'', ll:null, lr:null, t:'B' },
  company:  { h1:'', h2:'', e1:'Apex Enterprise Solutions Pvt. Ltd.', e2:'Technology & Corporate Consulting', dept:'Headquarters', divn:'(Operations & Strategy)', ofc:'Level 5, Cyber Park', city:'Bengaluru', pin:'560 100', ph:'+91-80-41234567', em:'contact@apexsolutions.in', wb:'www.apexsolutions.in', ll:null, lr:null, t:'B' },
  school:   { h1:'विद्या ददाति विनयं', h2:'ज्ञानं परमं बलम्', e1:'Delhi Model Public Academy', e2:'Affiliated to CBSE, New Delhi', dept:'Office of the Principal', divn:'(Academic Administration)', ofc:'Sector 12, Institutional Area', city:'New Delhi', pin:'110 075', ph:'011-28080000', em:'principal@delhimodel.edu.in', wb:'www.delhimodel.edu.in', ll:null, lr:null, t:'A' },
  doctor:   { h1:'', h2:'', e1:'Dr. Aarav Sharma, MBBS, MD (Med)', e2:'Consultant Physician & Cardiologist', dept:'CareWell Medical Clinic', divn:'(Outpatient Dept)', ofc:'Plot 42, Health Plaza, Ring Road', city:'Mumbai', pin:'400 053', ph:'+91-9820012345', em:'dr.aarav@carewellclinic.in', wb:'Reg No: MMC-2015-08-3421', ll:null, lr:null, t:'B' },
  shop:     { h1:'', h2:'', e1:'Shree Ganesh Commercial Trading Co.', e2:'Wholesale & Retail Distributors', dept:'Commercial Sales Department', divn:'', ofc:'Shop No. 18, Central Market', city:'Pune', pin:'411 002', ph:'+91-20-24450000', em:'orders@shreeganeshtraders.in', wb:'GSTIN: 27AABCS1234F1Z8', ll:null, lr:null, t:'A' },
};

// ── Default form values ───────────────────────
export const DEFAULT_FORM: LetterForm = {
  h1: '',
  h2: '',
  e1: '',
  e2: '',
  dept: '',
  divn: '',
  ofc: '',
  city: '',
  pin: '',
  ph: '',
  em: '',
  wb: '',
  enrolmentNo: '',
  sn: '',
  sd: '',
  sp: '',
  sh: '',
  sc: '',
  fno: '',
  dt: '',
  toD: '',
  toA: '',
  sub: '',
  ref: '',
  sal: 'Sir',
  cls: 'Yours faithfully',
  body: '',
  encl: '',
  copyTo: [],
  endorsement: '',
};

export const DEFAULT_LOGO_POS: LogoPos = { x: 42, y: 14, w: 68, placed: false };

export const TEMPLATE_INFO: Record<TemplateType, { label: string; desc: string }> = {
  A: { label: 'Type-A · Classic DoP / Dak Bhavan', desc: 'FileNo left · Logo right · Stars divider' },
  B: { label: 'Type-B · PM / Senior Official',     desc: 'Emblem center · Address top-right' },
  C: { label: 'Type-C · MP / Sansad Member',       desc: 'Dual logos · Bilingual name center' },
  D: { label: 'Type-D · MLA / State Assembly',     desc: 'Emblem left · Prominent name' },
  E: { label: 'Type-E · Office Memorandum (OM)',   desc: 'No To-block · Wide distribution' },
  F: { label: 'Type-F · Circular / General Order', desc: 'CIRCULAR badge · Numbered' },
};

export const FONT_OPTIONS: Array<{ key: string; label: string; style: CSSProperties }> = [
  { key: '',    label: 'Outfit (Default)', style: { fontFamily: "var(--font-outfit), var(--font-poppins), sans-serif" } },
  { key: 'fg',  label: 'EB Garamond',      style: { fontFamily: "'EB Garamond', serif" } },
  { key: 'fs',  label: 'Source Serif',     style: { fontFamily: "'Source Serif 4', serif" } },
  { key: 'fd2', label: 'पोप्पिंस (Poppins)',style: { fontFamily: "var(--font-poppins), sans-serif" } },
  { key: 'ft',  label: 'तिरो',             style: { fontFamily: "'Tiro Devanagari Hindi', serif" } },
  { key: 'fn',  label: 'DM Sans',          style: { fontFamily: "'DM Sans', sans-serif" } },
];

export const SALUTATION_OPTIONS = [
  'Sir', 'Madam', 'Sir/Madam', 'Dear Sir', 'Dear Shri',
  'महोदय', 'महोदया', 'आदरणीय महोदय', 'सस्नेह नमस्कार', 'प्रति / सेवा में', 'पूज्य / तीर्थरूप', 'प्रिय'
];
export const CLOSING_OPTIONS = [
  'Yours faithfully', 'Yours sincerely', 'Yours obediently', 'With warm regards',
  'आपला नम्र', 'आपली नम्र', 'आपला विश्वासू', 'आपला कृपाभिलाषी', 'कळावे, आपला नम्र', 'भवदीय', 'भवदीया', 'सस्नेह,'
];

export const AI_LETTER_TYPES: Array<{ value: string; label: string }> = [
  { value: 'corporate',          label: 'Corporate Business Letter' },
  { value: 'complaint',          label: 'Complaint Letter' },
  { value: 'rti',                label: 'RTI Application' },
  { value: 'notice',             label: 'Notice Announcement' },
  { value: 'circular',           label: 'Circular / Internal Directive' },
  { value: 'reminder',           label: 'Reminder Letter (Urgent / Pending)' },
  { value: 'scn',                label: 'Show Cause Notice' },
  { value: 'noc',                label: 'No Objection Certificate (NOC)' },
  { value: 'appreciation',       label: 'Letter of Appreciation' },
  { value: 'advisory',           label: 'Advisory / Guidelines' },
  { value: 'forwarding',         label: 'Forwarding / Endorsement Note' },
  { value: 'student_app',        label: 'Student Application (To Principal / College)' },
  { value: 'heritage_personal',  label: 'Heritage / Traditional Family Letter' },
  { value: 'romantic',           label: 'Romantic / Heartfelt Personal Letter' },
  { value: 'personal',           label: 'General Personal Letter' },
  { value: 'custom',             label: 'Custom Letter' },
];

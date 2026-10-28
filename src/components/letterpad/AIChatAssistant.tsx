'use client';
import React, { useState, useRef, useEffect } from 'react';
import type { AppState, LetterForm, AILetterData } from '@/types/letterpad';
import { MISSING_FIELD_LABELS } from '@/lib/letterpad/typeProtocols';
import styles from './AIChatAssistant.module.css';

interface Message {
 role: 'user' | 'assistant' | 'error';
 text: string;
}

interface AIChatAssistantProps {
 state: AppState;
 onSetForm: (form: Partial<LetterForm>, bumpTick?: boolean) => void;
 onFillAI: (data: AILetterData, isFull: boolean, model?: string) => void;
}

const QUICK_CHIPS = [
 { label: '🚩 मराठी ग्राहक तक्रार', text: 'दोषपूर्ण उत्पादनाबाबत कंपनीकडे मराठीत औपचारिक ग्राहक तक्रार पत्र लिहा — बदली किंवा परताव्याची मागणी करा' },
 { label: '🏢 Corporate Circular', text: 'Draft a formal corporate circular to all department heads regarding office attendance and compliance' },
 { label: '📜 मराठी ना-हरकत (NOC)', text: 'कर्मचाऱ्यास पारपत्र (पासपोर्ट) काढण्यासाठी कंपनीचे मराठीत ना-हरकत प्रमाणपत्र (NOC)' },
 { label: '🎓 मराठी रजेचा अर्ज', text: 'शाळेच्या / महाविद्यालयाच्या प्राचार्यांना आजारपणाच्या रजेसाठी विद्यार्थ्याचा सविनय विनंती अर्ज मराठीत' },
 { label: '💌 मराठी भावस्पर्शी पत्र', text: 'वडिलांना / आईस / आप्तस्वकीयांना सस्नेह नमस्कार करणारे मराठीतील आपुलकीचे पत्र' },
 { label: '🇮🇳 हिंदी शिकायत पत्र', text: 'दोषपूर्ण उत्पाद के संबंध में कंपनी को औपचारिक हिंदी शिकायत पत्र लिखें — प्रतिस्थापन या धनवापसी का अनुरोध करें' },
 { label: '🏢 Formal Business Tone', text: 'Polite and strict formal corporate business tone' },
 { label: '📝 Citizen Application', text: 'Write a formal citizen application to an authority (e.g. Bank Manager, Municipal Officer, Collector)' },
 { label: '📜 Employee NOC', text: 'Issue a No Objection Certificate (NOC) for an employee applying for passport or higher education' },
 { label: '💌 Romantic Love Letter', text: 'Write a deeply romantic, emotional love letter for my sweetheart (remove all headers)' },
 { label: '📢 Corporate Circular', text: 'Issue a corporate circular regarding office attendance and compliance to all department heads' },
 { label: '🤝 Semi-Official Letter', text: 'Convert to a warm semi-official format with personal salutation ("Dear Mr./Ms. ...") and subscription ("Yours sincerely")' },
 { label: '⚠️ Show Cause Notice', text: 'Restructure into a formal Show Cause Notice with WHEREAS and NOW THEREFORE clauses' },
 { label: '⏳ Urgent Reminder', text: 'Add an expedited reminder paragraph referencing previous communication awaiting reply' },
 { label: '🎓 Student Application', text: 'Format as respectful student application to Principal with Class, Roll No., and "Yours obediently"' },
];

export default function AIChatAssistant({ state, onSetForm, onFillAI }: AIChatAssistantProps) {
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState<Message[]>([
 { role: 'assistant', text: 'Hi! I can help you edit this letter or write a completely new one in English, मराठी (Marathi), or हिन्दी (Hindi). Type your request below.' }
 ]);
 const [input, setInput] = useState('');
 const [selectedLang, setSelectedLang] = useState<'auto' | 'mr' | 'hi' | 'en'>('auto');
 const [isLoading, setIsLoading] = useState(false);
 const endRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (isOpen) {
 endRef.current?.scrollIntoView({ behavior: 'smooth' });
 }
 }, [messages, isOpen]);

 const handleEdit = async () => {
 if (!input.trim() || isLoading) return;
 const userText = input.trim();
 setInput('');
 setMessages(prev => [...prev, { role: 'user', text: userText }]);
 setIsLoading(true);

 try {
 const res = await fetch('/api/edit-letter', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 instruction: userText,
 currentForm: state.form,
 language: selectedLang === 'auto' ? undefined : selectedLang
 })
 });

 const json = await res.json();
 
 if (!res.ok || json.error) {
 throw new Error(json.error || 'Failed to edit letter');
 }

 if (json.data) {
 const changes: Partial<LetterForm> = {};
 let changedCount = 0;
 for (const [key, value] of Object.entries(json.data)) {
 if (key in state.form && value !== state.form[key as keyof LetterForm]) {
 (changes as any)[key] = value;
 changedCount++;
 }
 }
 
 if (changedCount > 0) {
 onSetForm(changes, true); // true = bump aiTick so UI updates
 }

 // If user asked to remove headers or make it personal/love letter, reflect in whole state
 const lower = userText.toLowerCase();
 if (lower.includes('love') || lower.includes('personal') || lower.includes('remove header') || lower.includes('no header')) {
 onFillAI({
 ...json.data,
 detected_type: lower.includes('love') ? 'romantic' : 'personal',
 is_personal: true,
 body: json.data.body || state.form.body,
 salutation: json.data.sal || state.form.sal,
 closing: json.data.cls || state.form.cls,
 signatory_name: json.data.sn || state.form.sn,
 }, true);
 }
 
 setMessages(prev => [...prev, { 
 role: 'assistant', 
 text: changedCount > 0 
 ? `I've updated the letter based on your request. (${changedCount} fields changed)` 
 : 'I processed your request but no fields needed changing.'
 }]);
 } else {
 throw new Error('No data returned from AI');
 }
 
 } catch (err: any) {
 setMessages(prev => [...prev, { role: 'error', text: err.message || 'An error occurred' }]);
 } finally {
 setIsLoading(false);
 }
 };

 const handleGenerateNew = async () => {
 if (!input.trim() || isLoading) return;
 const userText = input.trim();
 setInput('');
 setMessages(prev => [...prev, { role: 'user', text: userText }]);
 setIsLoading(true);

 try {
 const res = await fetch('/api/generate-letter', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 description: userText,
 letterType: 'auto', // Auto-detected in the route (typeProtocols), not corporate
 language: selectedLang === 'auto' ? undefined : selectedLang,
 // Previously {}: the route then had no sender/office context to
 // infer a recipient from. Send the full current form as ground
 // truth; the route's preserve rule keeps filled fields intact.
 currentContext: {
   officeType: state.officeType, template: state.tpl, mode: 'full', form: state.form,
   userEditedFields: state.userEditedFields || [],
   presetFields: state.presetFields || [],
 },
 currentForm: state.form,
 generationMode: 'full',
 })
 });

 const json = await res.json();
 
 if (!res.ok || json.error) {
 throw new Error(json.error || 'Failed to generate new letter');
 }

 if (json.data) {
 onFillAI(json.data, true, json.model);
 const typeNameMap: Record<string, string> = {
 citizen_app: 'Citizen Application to Authority (Formal Request)',
 noc: 'No Objection Certificate (NOC)',
 circular: 'Administrative Circular',
 corporate: 'Corporate Business Letter',
 complaint: 'Complaint Letter',
 rti: 'RTI Application',
 rti_reply: 'RTI Reply / PIO Response',
 notice: 'Notice Announcement',
 advisory: 'Advisory / Guidelines',
 forwarding: 'Forwarding / Endorsement Note',
 romantic: 'Heartfelt Love Letter (Headers removed)',
 student_app: 'Student Application to Principal',
 heritage_personal: 'Traditional Family Letter',
 scn: 'Show Cause Notice',
 reminder: 'Urgent Reminder Letter',
 appreciation: 'Letter of Appreciation',
 personal: 'Personal Letter',
 custom: 'Custom Letter'
 };
 const detected = json.detected_type || json.data.detected_type;
 const label = typeNameMap[detected] || 'complete letter';
 // Job A5: align the modal warning with the sidebar's post-fill
 // warning. The route's missing_fields list is computed from the
 // generation, but the modal previously showed it verbatim — so a
 // run could list "signatory designation" even though the filled
 // letter on the paper HAS a designation (the sidebar path, which
 // re-derives its warning from the filled result, listed name
 // only for the same prompt). Filter the route list against the
 // values that actually landed (json.data): a field that is
 // filled in the generated letter can never be listed as missing.
 const _d = json.data as Record<string, unknown>;
 const _filled = (v: unknown) => Boolean(String(v ?? '').trim());
 const missing = (Array.isArray(json.missing_fields) ? json.missing_fields as string[] : []).filter((f: string) => {
   if (f === 'sn') return !_filled(_d.sn ?? _d.signatory_name);
   if (f === 'sd') return !_filled(_d.sd ?? _d.signatory_designation);
   if (f === 'toD') return !_filled(_d.toD ?? _d.to_designation) || String(_d.toD ?? _d.to_designation ?? '').includes('______');
   if (f === 'sal') return !_filled(_d.sal ?? _d.salutation) || String(_d.sal ?? _d.salutation ?? '').includes('______');
   if (f === 'body') return !_filled(_d.body) || String(_d.body ?? '').trim().length < 150;
   if (f === 'details') return String(_d.body ?? '').includes('______');
   return true;
 });
 // Belt-and-braces, as in the Sidebar: blanks in the body warn even
 // if missing_fields came back empty for this model.
 if (String(json.data.body || '').includes('______') && !missing.includes('details')) {
   missing.push('details');
 }
 setMessages(prev => [...prev, {
 role: 'assistant',
 text: `✨ I have generated a complete ${label} with all necessary sections and authentic formatting!` +
   (missing.length ? ` Please fill in: ${missing.map((f: string) => MISSING_FIELD_LABELS[f] || f).join(', ')}.` : '')
 }]);
 } else {
 throw new Error('No data returned from AI');
 }
 
 } catch (err: any) {
 setMessages(prev => [...prev, { role: 'error', text: err.message || 'An error occurred' }]);
 } finally {
 setIsLoading(false);
 }
 };

 if (!isOpen) {
 return (
 <div className={`${styles.chatContainer} ${styles.closed}`} onClick={() => setIsOpen(true)}>
 <div className={styles.closedIcon}>✨</div>
 </div>
 );
 }

 return (
 <div className={styles.chatContainer}>
 <div className={styles.chatHeader} onClick={() => setIsOpen(false)}>
 <div className={styles.chatTitle}>✨ AI Assistant</div>
 <button className={styles.closeBtn}>✕</button>
 </div>
 
 <div className={styles.chatBody}>
 {messages.map((m, i) => (
 <div key={i} className={`${styles.message} ${m.role === 'user' ? styles.userMsg : m.role === 'error' ? styles.errorMsg : styles.assistantMsg}`}>
 {m.text}
 </div>
 ))}
 {isLoading && (
 <div className={`${styles.message} ${styles.assistantMsg}`}>
 <div className={styles.typingIndicator}>
 <div className={styles.dot}></div>
 <div className={styles.dot}></div>
 <div className={styles.dot}></div>
 </div>
 </div>
 )}
 <div ref={endRef} />
 </div>

 <div className={styles.chatInputArea}>
 <div className={styles.chipsBar}>
 {QUICK_CHIPS.map((chip, idx) => (
 <button
 key={idx}
 type="button"
 className={styles.chip}
 onClick={() => setInput(chip.text)}
 title={chip.text}
 >
 {chip.label}
 </button>
 ))}
 </div>
 {/* Language selector bar */}
 <div className={styles.langBar}>
 <span className={styles.langLabel}>🌐 भाषा / Lang:</span>
 {(
 [
 { id: 'auto', label: 'Auto' },
 { id: 'mr', label: '🚩 मराठी' },
 { id: 'hi', label: '🇮🇳 हिन्दी' },
 { id: 'en', label: '🇬🇧 English' },
 ] as const
 ).map(l => (
 <button
 key={l.id}
 type="button"
 className={`${styles.langBtn} ${selectedLang === l.id ? styles.langBtnActive : ''}`}
 onClick={() => setSelectedLang(l.id)}
 >
 {l.label}
 </button>
 ))}
 </div>

 <textarea 
 className={styles.chatInput}
 rows={3}
 value={input}
 onChange={e => setInput(e.target.value)}
 onKeyDown={e => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleEdit();
 }
 }}
 placeholder="Type instruction here... (Shift+Enter for new line)"
 disabled={isLoading}
 />
 <div className={styles.actionButtons}>
 <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={handleEdit} disabled={isLoading || !input.trim()} title="Edit current letter">
 ✏️ Edit
 </button>
 <button className={`${styles.actionBtn} ${styles.newBtn}`} onClick={handleGenerateNew} disabled={isLoading || !input.trim()} title="Generate completely new letter">
 ✨ New
 </button>
 </div>
 </div>
 </div>
 );
}

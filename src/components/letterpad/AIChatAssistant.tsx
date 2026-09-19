'use client';
import React, { useState, useRef, useEffect } from 'react';
import type { AppState, LetterForm, AILetterData } from '@/types/letterpad';
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
  { label: '🚩 मराठी नागरिक अर्ज', text: 'गंगामासला येथील पोस्टमास्तर यांना मुदत ठेव खात्याचे थकीत व्याज बचत खात्यात जमा करण्याबाबत श्रीमती राधा धारपडे यांचा मराठीत सविनय अर्ज लिहा' },
  { label: '🏛️ महाराष्ट्र शासन आदेश', text: 'महाराष्ट्र शासन सामान्य प्रशासन विभाग अंतर्गत अधिकृत परिपत्रक व शासकीय आदेश मराठीत तयार करा' },
  { label: '📜 मराठी ना-हरकत (NOC)', text: 'कर्मचाऱ्यास पारपत्र (पासपोर्ट) काढण्यासाठी कार्यालयाचे मराठीत ना-हरकत प्रमाणपत्र (NOC)' },
  { label: '🎓 मराठी रजेचा अर्ज', text: 'शाळेच्या / महाविद्यालयाच्या प्राचार्यांना आजारपणाच्या रजेसाठी विद्यार्थ्याचा सविनय विनंती अर्ज मराठीत' },
  { label: '💌 मराठी भावस्पर्शी पत्र', text: 'वडिलांना / आईस / आप्तस्वकीयांना सस्नेह नमस्कार करणारे मराठीतील आपुलकीचे पत्र' },
  { label: '🇮🇳 हिंदी आवेदन पत्र', text: 'डाकपाल महोदय को बचत खाते में लंबित ब्याज जमा करने हेतु औपचारिक हिंदी आवेदन पत्र लिखें' },
  { label: '🏛️ Formal CSMOP', text: 'Polite and strict official Government of India CSMOP administrative tone' },
  { label: '📝 Citizen Application', text: 'Write a formal citizen application to an authority (e.g. Postmaster, Bank Manager, Municipal Officer, Collector)' },
  { label: '📜 Employee NOC', text: 'Issue an official No Objection Certificate (NOC) for employee applying for passport or higher education' },
  { label: '💌 Romantic Love Letter', text: 'Write a deeply romantic, emotional love letter for my sweetheart (remove all govt headers)' },
  { label: '📢 Administrative Circular', text: 'Issue an administrative circular regarding office attendance and compliance to all HODs' },
  { label: '📋 Convert to OM', text: 'Convert this to Office Memorandum style: 3rd person ("The undersigned is directed to..."), no salutation, no closing' },
  { label: '🤝 D.O. Letter', text: 'Convert to Demi-Official (D.O.) format with personal salutation ("Dear Shri...") and subscription ("Yours sincerely")' },
  { label: '⚠️ Show Cause Notice', text: 'Restructure into a statutory Show Cause Notice with WHEREAS and NOW THEREFORE clauses' },
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
          letterType: 'auto', // Auto-detect NOC, Love Letter, Circular, OM, DO, Student App, etc.
          language: selectedLang === 'auto' ? undefined : selectedLang,
          currentContext: {} // Start fresh
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
          notification: 'Statutory Gazette Notification',
          romantic: 'Heartfelt Love Letter (Headers removed)',
          student_app: 'Student Application to Principal',
          heritage_personal: 'Traditional Family Letter',
          scn: 'Show Cause Notice (Quasi-Judicial Format)',
          om: 'Office Memorandum (3rd Person CSMOP Format)',
          do: 'Demi-Official (D.O.) Letter',
          reminder: 'Urgent Reminder Letter',
          appreciation: 'Letter of Appreciation',
          office_order: 'Official Order'
        };
        const label = typeNameMap[json.data.detected_type] || 'complete letter';
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: `✨ I have generated a complete ${label} with all necessary sections and authentic formatting!`
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

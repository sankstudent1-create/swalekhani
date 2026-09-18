import React, { useState } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, AlertCircle, BookOpen, Wand2, X, Check, ArrowRight, Key } from 'lucide-react';
import { draftLetterLocally, polishAdministrativeText, draftWithGemini } from '../services/aiDrafter';
import { auditDocument, ADMINISTRATIVE_VOCABULARY } from '../data/protocolRules';

export function AIAssistantModal({
  isOpen,
  onClose,
  docState,
  onApplyDraft,
  onApplyPolishedText,
  uiLang = 'mr'
}) {
  const [activeTab, setActiveTab] = useState('drafter'); // drafter | audit | vocab
  const [prompt, setPrompt] = useState('');
  const [targetLang, setTargetLang] = useState(uiLang);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('swalekhani_gemini_key') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [rawTextToPolish, setRawTextToPolish] = useState('');
  const [polishedResult, setPolishedResult] = useState('');

  if (!isOpen) return null;

  const auditReport = auditDocument(docState);

  const samplePrompts = [
    { label: 'रस्ता दुरुस्तीबाबत तक्रार', query: 'परिसरातील रस्त्यांची तातडीने दुरुस्ती व डांबरीकरण करण्याबाबत मनपा आयुक्तांना पत्र' },
    { label: 'पाणी पुरवठा तक्रार', query: 'वारंवार होणारा अनियमित व कमी दाबाने पाणीपुरवठा सुरळीत करणेबाबत' },
    { label: 'क्रीडांगण अनुदान मागणी', query: 'शाळेच्या नवीन क्रीडांगण व साहित्यासाठी विशेष निधी/अनुदान मंजूर करणेबाबत' },
    { label: 'एनओसी (NOC) दाखला अर्ज', query: 'बांधकाम परवानग्या व अधिकृत ना-हरकत प्रमाणपत्र (NOC) मिळण्याबाबत अर्ज' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('कृपया पत्र कशाबाबत आहे ते थोडक्यात लिहा.');
      return;
    }

    setErrorMessage('');
    setIsGenerating(true);

    try {
      if (apiKey.trim()) {
        // Save key locally
        localStorage.setItem('swalekhani_gemini_key', apiKey.trim());
        const geminiResult = await draftWithGemini({
          apiKey: apiKey.trim(),
          prompt,
          letterType: docState.templateType,
          language: targetLang,
          authorityRole: docState.authorityType
        });
        setGeneratedResult(geminiResult);
      } else {
        // Local smart rule-based drafter
        const localResult = draftLetterLocally({
          topic: prompt,
          letterType: docState.templateType,
          language: targetLang
        });
        setGeneratedResult(localResult);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'मसुदा तयार करताना त्रुटी आली. ऑफलाइन पद्धतीचा वापर केला जाईल.');
      const localResult = draftLetterLocally({
        topic: prompt,
        letterType: docState.templateType,
        language: targetLang
      });
      setGeneratedResult(localResult);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToLetter = () => {
    if (generatedResult) {
      onApplyDraft(generatedResult);
      onClose();
    }
  };

  const handlePolish = () => {
    if (!rawTextToPolish.trim()) return;
    const res = polishAdministrativeText(rawTextToPolish, targetLang);
    setPolishedResult(res);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="ai-badge-pulse">
              <Sparkles size={20} className="text-amber-500" />
            </div>
            <div>
              <h2 className="modal-title">स्वलेखनी AI - शासकीय पत्र सहाय्यक</h2>
              <p className="modal-subtitle">
                कायदेशीर अशोक स्तंभ नियम (२००५) व CSMOP शासकीय पत्रव्यवहार मानकांनुसार
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'drafter' ? 'active' : ''}`}
            onClick={() => setActiveTab('drafter')}
          >
            <Wand2 size={16} />
            मसुदा तयार करा (AI Drafter)
          </button>
          <button
            className={`modal-tab ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldCheck size={16} />
            प्रोटोकॉल तपासणी (Audit)
            {auditReport.issues.length > 0 && (
              <span className={`tab-badge ${auditReport.isCompliant ? 'badge-warning' : 'badge-danger'}`}>
                {auditReport.issues.length}
              </span>
            )}
          </button>
          <button
            className={`modal-tab ${activeTab === 'vocab' ? 'active' : ''}`}
            onClick={() => setActiveTab('vocab')}
          >
            <BookOpen size={16} />
            प्रशासकीय शब्दकोश व भाषा
          </button>
        </div>

        {/* Tab Body */}
        <div className="modal-body">
          {activeTab === 'drafter' && (
            <div className="drafter-panel">
              <div className="form-group">
                <label className="form-label">पत्राचा विषय / उद्दिष्ट थोडक्यात सांगा:</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="उदा. आमच्या भागात वारंवार वीज जाते, याबाबत महावितरण कार्यकारी अभियंत्यांना पत्र तयार करा..."
                />
              </div>

              {/* Sample Prompt Chips */}
              <div className="prompt-chips">
                <span className="chips-label">उदाहरणे:</span>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="chip-btn"
                    onClick={() => setPrompt(p.query)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Generation Settings Row */}
              <div className="grid-2-cols" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">भाषा निवडा:</label>
                  <select
                    className="form-select"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    <option value="mr">मराठी (Marathi Official)</option>
                    <option value="hi">हिंदी (Hindi Administrative)</option>
                    <option value="en">English (Official CSMOP)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Key size={14} /> Gemini API Key (पर्यायी / Optional):
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="की नसली तरी ऑफलाइन स्मार्ट AI चालेल"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <Wand2 size={18} />
                {isGenerating ? 'AI मसुदा तयार करत आहे...' : 'अधिकृत मसुदा तयार करा (Generate Draft)'}
              </button>

              {/* Preview Result */}
              {generatedResult && (
                <div className="generated-preview-box">
                  <div className="preview-header">
                    <h4>तयार केलेला मसुदा (Generated Preview):</h4>
                    <button className="btn btn-primary btn-sm" onClick={handleApplyToLetter}>
                      <Check size={16} />
                      पत्रात हा मजकूर वापरा (Apply to Letter)
                    </button>
                  </div>
                  <div className="preview-content">
                    <p><strong>विषय:</strong> {generatedResult.subject}</p>
                    <p><strong>संबोधन:</strong> {generatedResult.salutation || '---'}</p>
                    <div style={{ margin: '0.5rem 0' }}>
                      <strong>मजकूर:</strong>
                      {generatedResult.paragraphs.map((para, i) => (
                        <p key={i} style={{ marginTop: '0.25rem' }}>{i === 0 ? '' : `${i + 1}. `}{para}</p>
                      ))}
                    </div>
                    <p><strong>शेवट:</strong> {generatedResult.subscription || '---'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="audit-panel">
              <div className="audit-summary-card">
                <div className="audit-status-icon">
                  {auditReport.isCompliant && auditReport.issues.length === 0 ? (
                    <ShieldCheck size={36} className="text-emerald-500" />
                  ) : auditReport.isCompliant ? (
                    <AlertTriangle size={36} className="text-amber-500" />
                  ) : (
                    <AlertCircle size={36} className="text-rose-500" />
                  )}
                </div>
                <div>
                  <h3 className="audit-status-heading">
                    {auditReport.isCompliant && auditReport.issues.length === 0
                      ? 'दस्तऐवज पूर्णतः कायदेशीर व प्रोटोकॉल सुसंगत आहे!'
                      : auditReport.isCompliant
                      ? 'काही किरकोळ बाबींची पूर्तता आवश्यक आहे.'
                      : 'सावधान: कायदेशीर किंवा गंभीर त्रुटी आढळल्या आहेत!'}
                  </h3>
                  <p className="audit-status-desc">
                    राज्यचिन्ह कायदा २००५ आणि CSMOP मानकांनुसार तपासणी अहवाल खालीलप्रमाणे आहे.
                  </p>
                </div>
              </div>

              {/* Issues List */}
              <div className="issues-list">
                {auditReport.issues.length === 0 ? (
                  <div className="issue-item compliant">
                    <Check size={18} className="text-emerald-600" />
                    <div>
                      <strong>सर्व अटी पूर्ण:</strong> अशोक स्तंभ अधिकृत नियमानुसार आहे, जावक क्रमांक व दिनांक वैध आहेत.
                    </div>
                  </div>
                ) : (
                  auditReport.issues.map((issue, idx) => (
                    <div key={idx} className={`issue-item severity-${issue.severity.toLowerCase()}`}>
                      {issue.severity === 'CRITICAL' ? (
                        <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
                      ) : issue.severity === 'WARNING' ? (
                        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
                      )}
                      <div>
                        <div className="issue-title">{issue.title}</div>
                        <div className="issue-msg">{issue.message}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reference legal guidelines */}
              <div className="legal-reference-box">
                <h4>कायद्याची प्रमुख तत्त्वे (State Emblem of India Act, 2005):</h4>
                <ul>
                  <li>अशोक स्तंभाखाली <strong>"सत्यमेव जयते"</strong> हे देवनागरीत असणे कायद्याने सक्तीचे आहे.</li>
                  <li>खाजगी नागरिक, शाळा, कंपन्या किंवा वकिलांनी राष्ट्रीय चिन्ह वापरणे फौजदारी गुन्हा आहे (कलम ३ व ७).</li>
                  <li>कनिष्ठ शासकीय कार्यालयांनी (उदा. तहसील, मनपा, जि.प.) स्वतःचे किंवा राज्य शासनाचे अधिकृत बोधचिन्ह वापरावे.</li>
                  <li>शासकीय पत्रव्यवहारात जावक क्रमांक (Outward No.) व दिनांक अनिवार्य मानले जातात.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'vocab' && (
            <div className="vocab-panel">
              <div className="polisher-section">
                <h4>शासकीय भाषा शुद्धीकरण व रूपांतर (Tone Polisher):</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  सामान्य बोलीभाषेतील मजकूर टाका; AI त्यास शासकीय औपचारिक भाषेत रूपांतरित करेल.
                </p>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={rawTextToPolish}
                  onChange={(e) => setRawTextToPolish(e.target.value)}
                  placeholder="उदा. मी हे पत्र लिहीत आहे कारण आमच्या भागात खूप दिवस झाले काम झाले नाही..."
                />
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '0.5rem' }}
                  onClick={handlePolish}
                >
                  <Wand2 size={16} />
                  शासकीय भाषेत रूपांतर करा (Polish to Officialese)
                </button>

                {polishedResult && (
                  <div className="polished-result-box" style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                      रूपांतरित औपचारिक भाषा:
                    </div>
                    <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '4px', margin: '0.25rem 0' }}>
                      {polishedResult}
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onApplyPolishedText(polishedResult);
                        onClose();
                      }}
                    >
                      <Check size={14} /> पत्रात समाविष्ट करा
                    </button>
                  </div>
                )}
              </div>

              <div className="vocab-dictionary-section" style={{ marginTop: '1.5rem' }}>
                <h4>प्रशासकीय शब्दसंग्रह (Ready-to-use Official Phrases):</h4>
                {ADMINISTRATIVE_VOCABULARY.map((group, gIdx) => (
                  <div key={gIdx} className="vocab-group">
                    <h5 className="vocab-group-title">{group.category}</h5>
                    <div className="vocab-terms-grid">
                      {group.terms.map((term, tIdx) => (
                        <div key={tIdx} className="vocab-term-card">
                          <div className="term-mr">{term.mr}</div>
                          <div className="term-en">{term.en}</div>
                          <button
                            className="term-copy-btn"
                            onClick={() => {
                              onApplyPolishedText(term.mr);
                              onClose();
                            }}
                            title="पत्रात जोडा"
                          >
                            <ArrowRight size={14} /> पत्रात जोडा
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Globe,
  Edit3,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Layout,
  Layers,
  Upload,
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './index.css';

import { AUTHORITY_TYPES, EMBLEMS_CONFIG, auditDocument } from './data/protocolRules';
import { LETTER_TEMPLATES } from './data/letterTemplates';
import { RenderEmblem, RtiLogo } from './components/Emblems';
import { AIAssistantModal } from './components/AIAssistantModal';

const fonts = [
  { name: 'Marathi Default (Tiro Devanagari)', value: "'Tiro Devanagari Marathi', serif" },
  { name: 'Marathi/Hindi (Mukta)', value: "'Mukta', sans-serif" },
  { name: 'Gujarati/Devanagari (Hind)', value: "'Hind Vadodara', sans-serif" },
  { name: 'English Formal (Inter)', value: "'Inter', sans-serif" },
  { name: 'English Modern (Poppins)', value: "'Poppins', sans-serif" },
  { name: 'English Serif (Merriweather)', value: "'Merriweather', serif" }
];

export default function App() {
  const [uiLang, setUiLang] = useState('en'); // default en/mr
  const [sidebarTab, setSidebarTab] = useState('templates'); // templates | authority | details
  const [selectedFont, setSelectedFont] = useState(fonts[3].value); // Inter for official English letters
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Active template selection
  const [activeTemplateId, setActiveTemplateId] = useState('FORMAL_GOV');
  const initialTemplate = LETTER_TEMPLATES[0];

  // Authority & Emblem State
  const [authorityType, setAuthorityType] = useState(initialTemplate.authorityId);
  const [emblemType, setEmblemType] = useState(initialTemplate.defaultEmblem);
  const [customLogoUrl, setCustomLogoUrl] = useState(null);

  // Layout style (STANDARD_LETTER | DO_BILINGUAL | CABINET_ORDER | STATE_ORDER)
  const [layoutStyle, setLayoutStyle] = useState(initialTemplate.layoutStyle || 'STANDARD_LETTER');

  // Document Fields State
  const [headerTop, setHeaderTop] = useState(initialTemplate.defaultData.headerTop);
  const [orgName, setOrgName] = useState(initialTemplate.defaultData.orgName);
  const [department, setDepartment] = useState(initialTemplate.defaultData.department);
  const [address, setAddress] = useState(initialTemplate.defaultData.address);
  const [outwardNo, setOutwardNo] = useState(initialTemplate.defaultData.outwardNo);
  const [letterDate, setLetterDate] = useState(initialTemplate.defaultData.letterDate);
  const [recipient, setRecipient] = useState(initialTemplate.defaultData.recipient);
  const [subject, setSubject] = useState(initialTemplate.defaultData.subject);
  const [reference, setReference] = useState(initialTemplate.defaultData.reference);
  const [salutation, setSalutation] = useState(initialTemplate.defaultData.salutation);
  const [paragraphs, setParagraphs] = useState(initialTemplate.defaultData.paragraphs);
  const [subscription, setSubscription] = useState(initialTemplate.defaultData.subscription);
  const [signatoryName, setSignatoryName] = useState(initialTemplate.defaultData.signatoryName);
  const [signatoryDesignation, setSignatoryDesignation] = useState(initialTemplate.defaultData.signatoryDesignation);
  const [signatoryTel, setSignatoryTel] = useState(initialTemplate.defaultData.signatoryTel || 'Tel: 011-23096060');
  const [enclosures, setEnclosures] = useState(initialTemplate.defaultData.enclosures);
  const [copiesTo, setCopiesTo] = useState(initialTemplate.defaultData.copiesTo);
  const [footerText, setFooterText] = useState('Prepared in accordance with CSMOP (Central Secretariat Manual of Office Procedure)');

  const documentRef = useRef(null);

  // Document state bundle for audit
  const docState = {
    authorityType,
    emblemType,
    templateType: activeTemplateId,
    outwardNo,
    letterDate,
    subject,
    reference,
    salutation,
    paragraphs,
    subscription,
    signatoryName,
    signatoryDesignation,
    signatoryTel,
    copiesTo
  };

  const auditReport = auditDocument(docState);

  // Handle Template Switch
  const handleSelectTemplate = (tmpl) => {
    setActiveTemplateId(tmpl.id);
    setLayoutStyle(tmpl.layoutStyle || 'STANDARD_LETTER');
    setAuthorityType(tmpl.authorityId);
    setEmblemType(tmpl.defaultEmblem);

    setHeaderTop(tmpl.defaultData.headerTop);
    setOrgName(tmpl.defaultData.orgName);
    setDepartment(tmpl.defaultData.department);
    setAddress(tmpl.defaultData.address);
    setOutwardNo(tmpl.defaultData.outwardNo);
    setLetterDate(tmpl.defaultData.letterDate);
    setRecipient(tmpl.defaultData.recipient);
    setSubject(tmpl.defaultData.subject);
    setReference(tmpl.defaultData.reference);
    setSalutation(tmpl.defaultData.salutation);
    setParagraphs(tmpl.defaultData.paragraphs);
    setSubscription(tmpl.defaultData.subscription);
    setSignatoryName(tmpl.defaultData.signatoryName);
    setSignatoryDesignation(tmpl.defaultData.signatoryDesignation);
    setSignatoryTel(tmpl.defaultData.signatoryTel || '');
    setEnclosures(tmpl.defaultData.enclosures);
    setCopiesTo(tmpl.defaultData.copiesTo);
  };

  // Handle Custom Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogoUrl(event.target.result);
        setEmblemType('CUSTOM');
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply AI Draft into the active letter
  const handleApplyDraft = (draft) => {
    if (draft.subject) setSubject(draft.subject);
    if (draft.salutation !== undefined) setSalutation(draft.salutation);
    if (draft.paragraphs && draft.paragraphs.length > 0) setParagraphs(draft.paragraphs);
    if (draft.subscription !== undefined) setSubscription(draft.subscription);
    if (draft.enclosures) setEnclosures(draft.enclosures);
    if (draft.copiesTo) setCopiesTo(draft.copiesTo);
  };

  const handleApplyPolishedText = (text) => {
    setParagraphs((prev) => [...prev, text]);
  };

  const handleUpdateParagraph = (index, value) => {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  };

  const handleAddParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const handleRemoveParagraph = (index) => {
    if (paragraphs.length <= 1) return;
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const element = documentRef.current;
    const opt = {
      margin: 0,
      filename: `${(outwardNo || orgName || 'Official_Letter').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const currentAuthority = AUTHORITY_TYPES[authorityType] || AUTHORITY_TYPES.PRIVATE_CITIZEN_NGO;

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <Edit3 className="text-primary" size={24} />
            Swalekhani
          </h1>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', background: '#dbeafe', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
            Universal 2026
          </span>
        </div>

        {/* Sidebar Nav Tabs */}
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab-btn ${sidebarTab === 'templates' ? 'active' : ''}`}
            onClick={() => setSidebarTab('templates')}
          >
            <Layout size={18} />
            Templates
          </button>
          <button
            className={`sidebar-tab-btn ${sidebarTab === 'authority' ? 'active' : ''}`}
            onClick={() => setSidebarTab('authority')}
          >
            <ShieldCheck size={18} />
            Authority & Emblem
          </button>
          <button
            className={`sidebar-tab-btn ${sidebarTab === 'details' ? 'active' : ''}`}
            onClick={() => setSidebarTab('details')}
          >
            <Layers size={18} />
            Letter Details
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="sidebar-content">
          {/* Quick Legal Status Banner */}
          {auditReport.isCompliant && auditReport.issues.length === 0 ? (
            <div className="legal-banner compliant">
              <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-600" />
              <div>
                <strong>Legal & Protocol Compliant:</strong> Fully aligns with State Emblem Act 2005 & official correspondence protocols.
              </div>
            </div>
          ) : auditReport.isCompliant ? (
            <div className="legal-banner warning">
              <AlertTriangle size={18} className="flex-shrink-0 text-amber-600" />
              <div>
                <strong>Action Recommended:</strong> Check outward reference number or signatory details.
              </div>
            </div>
          ) : (
            <div className="legal-banner danger">
              <AlertCircle size={18} className="flex-shrink-0 text-rose-600" />
              <div>
                <strong>Emblem Act (2005) Violation:</strong> Lion Capital of Asoka is restricted to authorized constitutional/secretariat ranks.
              </div>
            </div>
          )}

          {/* TAB 1: TEMPLATES */}
          {sidebarTab === 'templates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Category Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <button
                  className={`chip-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('ALL')}
                  style={{ background: selectedCategory === 'ALL' ? '#1e3a8a' : '#f1f5f9', color: selectedCategory === 'ALL' ? '#fff' : '#334155' }}
                >
                  All ({LETTER_TEMPLATES.length})
                </button>
                <button
                  className={`chip-btn ${selectedCategory === 'GOVERNMENT' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('GOVERNMENT')}
                  style={{ background: selectedCategory === 'GOVERNMENT' ? '#1e3a8a' : '#f1f5f9', color: selectedCategory === 'GOVERNMENT' ? '#fff' : '#334155' }}
                >
                  Govt & Orders
                </button>
                <button
                  className={`chip-btn ${selectedCategory === 'DIPLOMATIC' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('DIPLOMATIC')}
                  style={{ background: selectedCategory === 'DIPLOMATIC' ? '#1e3a8a' : '#f1f5f9', color: selectedCategory === 'DIPLOMATIC' ? '#fff' : '#334155' }}
                >
                  Ministerial
                </button>
                <button
                  className={`chip-btn ${selectedCategory === 'CERTIFICATES' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('CERTIFICATES')}
                  style={{ background: selectedCategory === 'CERTIFICATES' ? '#1e3a8a' : '#f1f5f9', color: selectedCategory === 'CERTIFICATES' ? '#fff' : '#334155' }}
                >
                  NOC & Gazette
                </button>
                <button
                  className={`chip-btn ${selectedCategory === 'ACADEMIC' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('ACADEMIC')}
                  style={{ background: selectedCategory === 'ACADEMIC' ? '#1e3a8a' : '#f1f5f9', color: selectedCategory === 'ACADEMIC' ? '#fff' : '#334155' }}
                >
                  Student & School
                </button>
                <button
                  className={`chip-btn ${selectedCategory === 'PERSONAL' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('PERSONAL')}
                  style={{ background: selectedCategory === 'PERSONAL' ? '#1e3a8a' : '#f1f5f9', color: selectedCategory === 'PERSONAL' ? '#fff' : '#334155' }}
                >
                  Family & Love
                </button>
              </div>

              {/* Template Items */}
              {LETTER_TEMPLATES
                .filter(tmpl => selectedCategory === 'ALL' || tmpl.category === selectedCategory)
                .map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    style={{
                      padding: '0.8rem 0.95rem',
                      borderRadius: '8px',
                      border: activeTemplateId === tmpl.id ? '2px solid #1e3a8a' : '1px solid #e2e8f0',
                      background: activeTemplateId === tmpl.id ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: activeTemplateId === tmpl.id ? '#1e3a8a' : '#0f172a' }}>
                      {tmpl.title[uiLang] || tmpl.title.en}
                    </div>
                    <div style={{ fontSize: '0.735rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {tmpl.description[uiLang] || tmpl.description.en}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 2: AUTHORITY & EMBLEMS */}
          {sidebarTab === 'authority' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label">1. Authority / Official Rank Level:</label>
                <select
                  className="form-select"
                  value={authorityType}
                  onChange={(e) => {
                    const newAuth = e.target.value;
                    setAuthorityType(newAuth);
                    const authCfg = AUTHORITY_TYPES[newAuth];
                    if (authCfg) {
                      setEmblemType(authCfg.defaultEmblem);
                    }
                  }}
                >
                  {Object.values(AUTHORITY_TYPES).map((auth) => (
                    <option key={auth.id} value={auth.id}>
                      {auth.name[uiLang] || auth.name.en}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.725rem', color: '#64748b', fontStyle: 'italic' }}>
                  {currentAuthority.description[uiLang] || currentAuthority.description.en}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">2. Official Crest / Emblem Selection:</label>
                <select
                  className="form-select"
                  value={emblemType}
                  onChange={(e) => setEmblemType(e.target.value)}
                >
                  {Object.values(EMBLEMS_CONFIG).map((emb) => {
                    const isAllowed = currentAuthority.allowedEmblems.includes(emb.id);
                    return (
                      <option key={emb.id} value={emb.id}>
                        {emb.title[uiLang] || emb.title.en} {!isAllowed ? '🔒 (Legally Restricted)' : ''}
                      </option>
                    );
                  })}
                </select>

                {emblemType === 'ASHOKA_EMBLEM' && !currentAuthority.isGovAuthorized && (
                  <div className="alert alert-danger" style={{ padding: '0.5rem', fontSize: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', marginTop: '0.4rem' }}>
                    <strong>Caution:</strong> Section 3 & 7 of the State Emblem Act, 2005 strictly forbids private entities from using the National Emblem.
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">3. Custom Institutional Logo:</label>
                <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
                  <Upload size={14} /> Upload Custom Logo (.PNG / .JPG)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {customLogoUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                    <img src={customLogoUrl} alt="Preview" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4, border: '1px solid #e2e8f0' }} />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setCustomLogoUrl(null)}
                      style={{ color: '#ef4444' }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569' }}>
                <strong>Legal Citation:</strong> {currentAuthority.legalNote}
              </div>
            </div>
          )}

          {/* TAB 3: LETTER DETAILS */}
          {sidebarTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Header Top (Government Identity):</label>
                <input
                  type="text"
                  className="form-input"
                  value={headerTop}
                  onChange={(e) => setHeaderTop(e.target.value)}
                  placeholder="Government of India / Office of Chief Secretary"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ministry / Office Name:</label>
                <input
                  type="text"
                  className="form-input"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Ministry of Communications / Secretariat of the ACC"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Wing:</label>
                <input
                  type="text"
                  className="form-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department of Posts / DoPT"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Address & Location:</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dak Bhavan, Sansad Marg, New Delhi-110 001"
                />
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">File No. / Outward No.:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={outwardNo}
                    onChange={(e) => setOutwardNo(e.target.value)}
                    placeholder="No. 20-5/2016-SPB-II"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date (दिनांक):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={letterDate}
                    onChange={(e) => setLetterDate(e.target.value)}
                    placeholder="Dated 27th March, 2017"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Recipient (To / प्रति):</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="All Chief Postmaster(s) General..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject (विषय):</label>
                <input
                  type="text"
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="... regarding."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reference (संदर्भ):</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Department OM No. ... dated ..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Salutation (Leave empty for Orders/Memos):</label>
                <input
                  type="text"
                  className="form-input"
                  value={salutation}
                  onChange={(e) => setSalutation(e.target.value)}
                  placeholder="Sir/Madam, / Dear CPMG,"
                />
              </div>

              {/* Paragraphs */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Paragraphs (Unnumbered Para 1, Numbered 2+):</label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleAddParagraph}
                    style={{ color: '#1e3a8a', fontWeight: 600 }}
                  >
                    <Plus size={14} /> Add Para
                  </button>
                </div>
                {paragraphs.map((para, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem', color: '#64748b' }}>
                      {idx === 0 ? 'Para 1' : `${idx + 1}.`}
                    </span>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={para}
                      onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                    />
                    {paragraphs.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ color: '#94a3b8', marginTop: '0.35rem' }}
                        onClick={() => handleRemoveParagraph(idx)}
                        title="Delete Para"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid-2-cols">
                <div className="form-group">
                  <label className="form-label">Subscription (Yours faithfully / sincerely):</label>
                  <input
                    type="text"
                    className="form-input"
                    value={subscription}
                    onChange={(e) => setSubscription(e.target.value)}
                    placeholder="Yours faithfully,"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Signatory Name:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    placeholder="A. N. Nanda / Satya Narayana Dash"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Designation & Department:</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={signatoryDesignation}
                  onChange={(e) => setSignatoryDesignation(e.target.value)}
                  placeholder="Secretary to the Government of India"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telephone / Email Contact:</label>
                <input
                  type="text"
                  className="form-input"
                  value={signatoryTel}
                  onChange={(e) => setSignatoryTel(e.target.value)}
                  placeholder="Tel: 011-23096060"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Copy to:- / Distribution List (प्रतिलिपि):</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={copiesTo}
                  onChange={(e) => setCopiesTo(e.target.value)}
                  placeholder="1. Cabinet Secretary.\n2. Principal Secretary to PM."
                />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Toolbar */}
        <header className="toolbar">
          <div className="toolbar-group">
            <Globe size={18} className="text-secondary" />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.25rem 0.5rem', fontWeight: 600 }}
              value={uiLang}
              onChange={(e) => setUiLang(e.target.value)}
            >
              <option value="en">English (EN)</option>
              <option value="mr">मराठी (MR)</option>
              <option value="hi">हिंदी (HI)</option>
            </select>

            <div className="divider-vertical"></div>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.25rem 0.5rem', fontWeight: 500 }}
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              title="Font Family"
            >
              {fonts.map((f) => (
                <option key={f.name} value={f.value}>{f.name}</option>
              ))}
            </select>

            <div className="divider-vertical"></div>

            <button className="btn-icon" onClick={() => execCommand('bold')} title="Bold">
              <Bold size={17} />
            </button>
            <button className="btn-icon" onClick={() => execCommand('italic')} title="Italic">
              <Italic size={17} />
            </button>
            <button className="btn-icon" onClick={() => execCommand('underline')} title="Underline">
              <Underline size={17} />
            </button>

            <div className="divider-vertical"></div>

            <button className="btn-icon" onClick={() => execCommand('justifyLeft')} title="Align Left">
              <AlignLeft size={17} />
            </button>
            <button className="btn-icon" onClick={() => execCommand('justifyCenter')} title="Align Center">
              <AlignCenter size={17} />
            </button>
            <button className="btn-icon" onClick={() => execCommand('justifyRight')} title="Align Right">
              <AlignRight size={17} />
            </button>
            <button className="btn-icon" onClick={() => execCommand('justifyFull')} title="Justify">
              <AlignJustify size={17} />
            </button>
          </div>

          <div className="toolbar-group">
            {/* AI Assistant Button */}
            <button
              className="btn btn-ai"
              onClick={() => setIsAiModalOpen(true)}
              style={{ borderRadius: '20px' }}
            >
              <Sparkles size={16} />
              Swalekhani AI (Drafter & Audit)
            </button>

            {/* Protocol Audit Status Quick Button */}
            <button
              className={`btn btn-sm ${auditReport.isCompliant ? 'btn-secondary' : 'btn-danger'}`}
              onClick={() => setIsAiModalOpen(true)}
              title="Audit & Legal Status"
              style={{ border: auditReport.isCompliant ? '1px solid #cbd5e1' : '1px solid #ef4444' }}
            >
              {auditReport.isCompliant ? (
                <>
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Protocol OK</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span style={{ color: '#b91c1c' }}>Legal Warning</span>
                </>
              )}
            </button>

            <div className="divider-vertical"></div>

            <button className="btn btn-ghost" onClick={handlePrint} title="Print Document">
              <Printer size={18} />
              Print
            </button>

            <button
              className="btn btn-primary"
              onClick={handleExportPDF}
              title="Export as PDF"
              style={{ boxShadow: '0 4px 14px 0 rgba(30, 58, 138, 0.3)' }}
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="canvas-container">
          <div className="a4-canvas" ref={documentRef} style={{ fontFamily: selectedFont }}>
            
            {/* 1. D.O. LETTER BILINGUAL MASTHEAD (Image 2 Specimen) */}
            {layoutStyle === 'DO_BILINGUAL' ? (
              <div className="do-masthead-container">
                <div className="do-masthead-grid">
                  {/* Left Column: Officer Details & RTI Logo */}
                  <div className="do-col-left">
                    <div className="do-officer-name-hi">ए. एन. नन्द</div>
                    <div className="do-officer-desig-hi">सचिव</div>
                    <div className="do-officer-name-en">{signatoryName || 'A. N. Nanda'}</div>
                    <div className="do-officer-desig-en">Secretary</div>
                    <div className="do-officer-contact">
                      <div>फोन/Tel. : {signatoryTel || '(+91-11) 2309 6060'}</div>
                      <div>फैक्स/Fax. : (+91-11) 2309 6077</div>
                      <div>ई-मेल/E-mail : secretary-posts@indiapost.gov.in</div>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <RtiLogo size={36} />
                    </div>
                  </div>

                  {/* Center Column: Authorized Ashoka Lion Capital */}
                  <div className="do-col-center">
                    <RenderEmblem type="ASHOKA_EMBLEM" size={78} />
                  </div>

                  {/* Right Column: Ministry Hierarchy in Hindi & English */}
                  <div className="do-col-right">
                    <div className="do-dept-hi">डाक विभाग</div>
                    <div className="do-dept-hi">संचार मन्त्रालय</div>
                    <div className="do-dept-hi">भारत सरकार</div>
                    <div className="do-dept-hi" style={{ fontSize: '0.75rem', fontWeight: 600 }}>डाक भवन, संसद मार्ग, नई दिल्ली-110001</div>
                    <div className="do-dept-en" style={{ marginTop: '0.4rem' }}>Department of Posts</div>
                    <div className="do-dept-en">Ministry of Communications</div>
                    <div className="do-dept-en">Government of India</div>
                    <div className="do-dept-en" style={{ fontSize: '0.75rem' }}>Dak Bhawan, Sansad Marg, New Delhi-110001</div>
                  </div>
                </div>

                {/* D.O. Ref and Date Bar */}
                <div className="do-ref-date-bar">
                  <div><strong>{outwardNo || 'D.O. No. 18-18/2017-BD&MD'}</strong></div>
                  <div><strong>{letterDate || '30th June, 2017'}</strong></div>
                </div>
              </div>
            ) : layoutStyle === 'APPRECIATION_LETTER' ? (
              /* 2. MINISTERIAL APPRECIATION LETTER (Tripura Specimen) */
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="do-masthead-grid">
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>
                    <div style={{ fontSize: '1.2rem' }}>{signatoryName || 'Pranajit Singha Roy'}</div>
                    <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>{signatoryDesignation || 'Minister'}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <RenderEmblem type="ASHOKA_EMBLEM" size={78} />
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#334155', lineHeight: 1.35 }}>
                    <div style={{ fontWeight: 700 }}>{orgName}</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{department}</div>
                    <div style={{ marginTop: '0.2rem' }}>{address}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.95rem', fontWeight: 600, margin: '1.25rem 0' }}>{letterDate}</div>
                <div style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '4px', margin: '1.5rem 0', color: '#0f172a' }}>
                  APPRECIATION LETTER
                </div>
              </div>
            ) : layoutStyle === 'EMBASSY_ADVISORY' ? (
              /* 3. DIPLOMATIC EMBASSY ADVISORY (Tehran Specimen) */
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <RenderEmblem type="ASHOKA_EMBLEM" size={78} />
                <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem', color: '#0f172a' }}>{orgName || 'EMBASSY OF INDIA'}</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#334155' }}>{department || 'TEHRAN'}</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', textDecoration: 'underline', textUnderlineOffset: '4px', margin: '0.75rem 0' }}>ADVISORY</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{letterDate}</div>
              </div>
            ) : layoutStyle === 'EMPLOYEE_NOC' ? (
              /* 4. NO OBJECTION CERTIFICATE */
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {emblemType !== 'NONE' && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <RenderEmblem type={emblemType} logoUrl={customLogoUrl} orgName={orgName} size={82} />
                  </div>
                )}
                <div className="std-center-title">
                  {headerTop && <div className="std-gov-india">{headerTop}</div>}
                  {orgName && <div className="std-ministry">{orgName}</div>}
                  {department && <div className="std-dept">{department}</div>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', padding: '0.4rem 0', margin: '0.75rem 0', fontWeight: 600, fontSize: '0.9rem' }}>
                  <div>{outwardNo}</div>
                  <div>{letterDate}</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '4px', margin: '1.25rem 0', color: '#0f172a' }}>
                  ना-हरकत प्रमाणपत्र (NO OBJECTION CERTIFICATE)
                </div>
              </div>
            ) : layoutStyle === 'ACADEMIC_LETTER' ? (
              /* 5. STUDENT TO PRINCIPAL APPLICATION */
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
                {letterDate}
              </div>
            ) : layoutStyle === 'TRADITIONAL_LETTER' ? (
              /* 6. TRADITIONAL INDIAN HERITAGE LETTER */
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', textAlign: 'right', fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'pre-line', color: '#475569' }}>
                {address || 'पुणे,\nदिनांक: १८ सप्टेंबर २०२६'}
              </div>
            ) : layoutStyle === 'ROMANTIC_LETTER' ? (
              /* 7. VINTAGE ROMANTIC LOVE LETTER */
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', textAlign: 'right', fontSize: '0.95rem', fontStyle: 'italic', color: '#9d174d', whiteSpace: 'pre-line' }}>
                {address || 'शांत सायंकाळ,\n१८ सप्टेंबर'}
              </div>
            ) : layoutStyle === 'REMINDER_LETTER' ? (
              /* 8. REMINDER LETTER (Railway Board Specimen) */
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                  <div className="urgency-indicator-stamp">
                    <div>MOST IMMEDIATE</div>
                    <div style={{ textDecoration: 'underline', fontWeight: 800 }}>REMINDER-1</div>
                  </div>
                </div>

                <div className="std-gov-header" style={{ borderBottom: 'none', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    {outwardNo}
                  </div>
                  <div className="std-center-title">
                    {headerTop && <div className="std-gov-india">{headerTop}</div>}
                    {orgName && <div className="std-ministry">{orgName}</div>}
                    {department && <div className="std-dept">{department}</div>}
                  </div>
                  <div className="std-right-address">
                    {address && <div style={{ whiteSpace: 'pre-line' }}>{address}</div>}
                    {letterDate && <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{letterDate}</div>}
                  </div>
                </div>
              </div>
            ) : layoutStyle === 'SHOW_CAUSE_NOTICE' ? (
              /* 9. SHOW CAUSE NOTICE (District Collectorate Specimen) */
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {emblemType !== 'NONE' && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <RenderEmblem type={emblemType} logoUrl={customLogoUrl} orgName={orgName} size={82} />
                  </div>
                )}
                <div className="std-center-title">
                  {headerTop && <div className="std-gov-india">{headerTop}</div>}
                  {orgName && <div className="std-ministry">{orgName}</div>}
                  {department && <div className="std-dept" style={{ whiteSpace: 'pre-line' }}>{department}</div>}
                  {address && <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>{address}</div>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', padding: '0.4rem 0', marginTop: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  <div>{outwardNo}</div>
                  <div>{letterDate}</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '4px', margin: '1.25rem 0', color: '#0f172a' }}>
                  SHOW CAUSE NOTICE
                </div>
              </div>
            ) : layoutStyle === 'CIRCULAR' ? (
              /* 10. CIRCULAR (Dept of Personnel / Census Specimen) */
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {emblemType !== 'NONE' && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <RenderEmblem type={emblemType} logoUrl={customLogoUrl} orgName={orgName} size={82} />
                  </div>
                )}
                <div className="std-center-title">
                  {headerTop && <div className="std-gov-india">{headerTop}</div>}
                  {orgName && <div className="std-ministry">{orgName}</div>}
                  {department && <div className="std-dept">{department}</div>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.75rem 0', fontWeight: 700, fontSize: '0.95rem' }}>
                  <div>{outwardNo}</div>
                  <div>{letterDate}</div>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '4px', margin: '1rem 0', color: '#0f172a' }}>
                  CIRCULAR
                </div>
              </div>
            ) : layoutStyle === 'OFFICE_MEMO' ? (
              /* 11. OFFICE MEMORANDUM (Consumer Affairs / Sikkim Specimen) */
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div className="std-center-title">
                  {outwardNo && <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{outwardNo}</div>}
                  {headerTop && <div className="std-gov-india">{headerTop}</div>}
                  {orgName && <div className="std-ministry">{orgName}</div>}
                  {department && <div className="std-dept">{department}</div>}
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#334155', marginTop: '0.5rem' }}>
                  {address && <div>{address}</div>}
                  {letterDate && <div style={{ fontWeight: 700 }}>{letterDate}</div>}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '4px', margin: '1.25rem 0', color: '#0f172a' }}>
                  OFFICE MEMORANDUM
                </div>
              </div>
            ) : layoutStyle === 'CABINET_ORDER' || layoutStyle === 'STATE_ORDER' ? (
              /* 12. CABINET / STATE EXECUTIVE ORDER (Images 3, 4, 5 Specimens) */
              <div className="acc-order-header">
                {outwardNo && <div className="acc-file-no">{outwardNo}</div>}
                {headerTop && <div className="acc-header-top">{headerTop}</div>}
                {orgName && <div className="acc-org-name" style={{ whiteSpace: 'pre-line' }}>{orgName}</div>}
                {department && <div className="acc-dept-name" style={{ whiteSpace: 'pre-line' }}>{department}</div>}
                
                {/* 5-Asterisks Separator (CSMOP Order rule) */}
                <div className="acc-asterisks">*****</div>
                
                {letterDate && <div className="acc-date-right">{letterDate}</div>}
                {reference && <div className="acc-ref-box">{reference}</div>}
              </div>
            ) : (
              /* 13. STANDARD OFFICIAL LETTER (Image 1 Specimen - Dept of Posts) */
              <div className="std-gov-header">
                {/* Left Top: Inward / Receipt Stamp placeholder */}
                <div className="std-stamp-box">
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>RECEIPT / INWARD</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e3a8a' }}>{letterDate}</div>
                </div>

                {/* Center: File No. and Department Hierarchy */}
                <div className="std-center-title">
                  {outwardNo && <div className="std-file-no">{outwardNo}</div>}
                  {headerTop && <div className="std-gov-india">{headerTop}</div>}
                  {orgName && <div className="std-ministry">{orgName}</div>}
                  {department && <div className="std-dept">{department}</div>}
                </div>

                {/* Right: Address & Dated */}
                <div className="std-right-address">
                  {address && <div style={{ whiteSpace: 'pre-line' }}>{address}</div>}
                  {letterDate && <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{letterDate}</div>}
                </div>
              </div>
            )}

            {/* Recipient Block (To) - Shown at Top for Letters & Notices, but Bottom-Left for O.M. */}
            {recipient && layoutStyle !== 'OFFICE_MEMO' && (
              <div className="gov-recipient-block" style={{ marginTop: '1.25rem' }}>
                <div style={{ fontWeight: 700 }}>To</div>
                <div style={{ whiteSpace: 'pre-line', paddingLeft: '1.25rem', marginTop: '0.2rem' }}>
                  {recipient}
                </div>
              </div>
            )}

            {/* Subject (विषय) */}
            {subject && layoutStyle !== 'SHOW_CAUSE_NOTICE' && layoutStyle !== 'CIRCULAR' && (
              <div className="gov-subject-ref-block">
                <div className="gov-subject-line">
                  <strong>Subject:</strong> {subject}
                </div>
                {reference && layoutStyle !== 'CABINET_ORDER' && (
                  <div className="gov-reference-line">
                    <strong>Reference:</strong> {reference}
                  </div>
                )}
              </div>
            )}

            {/* Salutation */}
            {salutation && <div className="gov-salutation">{salutation}</div>}

            {/* Body Content */}
            <div
              className="gov-body-content"
              contentEditable={true}
              suppressContentEditableWarning={true}
            >
              {paragraphs.map((para, index) => (
                <p key={index} style={{ whiteSpace: 'pre-line' }}>
                  {/* For Show Cause Notice and Memo, no automated numbers unless intended */}
                  {layoutStyle === 'SHOW_CAUSE_NOTICE' || layoutStyle === 'OFFICE_MEMO' ? (
                    para
                  ) : index === 0 ? (
                    para
                  ) : (
                    `${index + 1}. ${para}`
                  )}
                </p>
              ))}
            </div>

            {/* Primary Subscription & Signatory */}
            <div className="gov-signatory-wrapper">
              <div className="gov-signatory-block" style={{ textAlign: layoutStyle === 'ROMANTIC_LETTER' ? 'right' : 'center' }}>
                {subscription && (
                  <div
                    className="gov-subscription"
                    style={{
                      fontStyle: layoutStyle === 'ROMANTIC_LETTER' ? 'italic' : 'normal',
                      color: layoutStyle === 'ROMANTIC_LETTER' ? '#831843' : '#0f172a'
                    }}
                  >
                    {subscription}
                  </div>
                )}
                <div className="signature-line" style={{ height: '35px' }}></div>
                {signatoryName && (
                  <div
                    className="gov-signatory-name"
                    style={{
                      color: layoutStyle === 'APPRECIATION_LETTER' ? '#15803d' : layoutStyle === 'ROMANTIC_LETTER' ? '#9d174d' : '#0f172a',
                      fontFamily: layoutStyle === 'ROMANTIC_LETTER' ? "'Playfair Display', serif" : 'inherit'
                    }}
                  >
                    {layoutStyle === 'ROMANTIC_LETTER' ? signatoryName : `(${signatoryName})`}
                  </div>
                )}
                {signatoryDesignation && (
                  <div className="gov-signatory-designation" style={{ whiteSpace: 'pre-line' }}>
                    {signatoryDesignation}
                  </div>
                )}
                {signatoryTel && layoutStyle !== 'ROMANTIC_LETTER' && (
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.15rem' }}>
                    {signatoryTel}
                  </div>
                )}
              </div>
            </div>

            {/* Recipient for Office Memorandum (Placed at Bottom-Left per CSMOP) */}
            {recipient && layoutStyle === 'OFFICE_MEMO' && (
              <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                <div style={{ whiteSpace: 'pre-line' }}>{recipient}</div>
              </div>
            )}

            {/* Endorsement / Distribution / Copy to:- (CSMOP Double Signature Protocol) */}
            {copiesTo && (
              <div className="gov-bottom-sections" style={{ marginTop: '1.75rem' }}>
                <div className="gov-section-title">
                  {layoutStyle === 'SHOW_CAUSE_NOTICE' ? 'Copy for kind information to:' : 'Copy to:-'}
                </div>
                <div style={{ whiteSpace: 'pre-line', paddingLeft: '0.5rem', lineHeight: 1.6 }}>
                  {copiesTo}
                </div>

                {/* For Orders: The Second Endorsement Signature Block */}
                {(layoutStyle === 'CABINET_ORDER' || layoutStyle === 'STATE_ORDER') && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <div className="gov-signatory-block">
                      <div className="signature-line" style={{ height: '30px' }}></div>
                      <div className="gov-signatory-name">({signatoryName})</div>
                      <div className="gov-signatory-designation" style={{ whiteSpace: 'pre-line' }}>
                        {signatoryDesignation}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Page Continuation Marker (from Image 2) */}
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b', marginTop: '1.5rem', fontWeight: 600 }}>
              Contd...2/-
            </div>

            {/* Footer Note */}
            {footerText && (
              <div className="gov-footer-note">
                {footerText}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        docState={docState}
        onApplyDraft={handleApplyDraft}
        onApplyPolishedText={handleApplyPolishedText}
        uiLang={uiLang}
      />
    </div>
  );
}

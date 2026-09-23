export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  type?: 'text' | 'tel' | 'email';
}

export interface SampleLetter {
  title: string;
  description: string;
  recipient: string;
  subject: string;
  date?: string;
  fileNo?: string;
  body: string[];
  signoff: string;
}

export interface ProfessionTemplate {
  slug: string;
  profession: string;
  title: string;
  category: 'Legal' | 'Medical' | 'Business' | 'Public' | 'Education';
  badge: string;
  targetKeyword: string;
  shortDesc: string;
  introText: string;
  theme: {
    primary: string; // Tailwind color name
    primaryHex: string;
    accentHex: string;
    bgGlow: string;
    font: 'serif' | 'sans' | 'mono';
    headerLayout: 'classic' | 'modern' | 'minimal' | 'tricolor' | 'bordered';
  };
  fields: TemplateField[];
  languages: ('en' | 'hi' | 'mr')[];
  bilingualDefaults?: {
    hi?: {
      header1: string;
      header2: string;
      dept: string;
      designation: string;
    };
    mr?: {
      header1: string;
      header2: string;
      dept: string;
      designation: string;
    };
  };
  sampleLetters: SampleLetter[];
  formatGuide: {
    title: string;
    rule: string;
    importance: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSlugs: string[];
}

export const PROFESSION_TEMPLATES: Record<string, ProfessionTemplate> = {
  'advocate': {
    slug: 'advocate',
    profession: 'Advocate & Legal Practitioner',
    title: 'Advocate Letterhead Format & Legal Notice Pad Maker',
    category: 'Legal',
    badge: 'Bar Council Standard',
    targetKeyword: 'advocate letterhead format',
    shortDesc: 'Standard legal letterhead format for High Court and District Court Advocates, Legal Advisors, and Law Chambers with Bar Council Enrolment numbering.',
    introText: 'In legal practice across India, an advocate’s letterhead serves as an official medium for statutory legal notices, formal case intimations, affidavits, and inter-counsel communications. Under the Bar Council of India (BCI) standards, a legal practitioner letterhead must maintain strict decorum: prominently stating the advocate’s full name, academic qualifications, State Bar Council enrolment number, court affiliations, and chamber address without promotional solicitation. Swalekhani provides advocates with verified, high-resolution letterhead layouts ready for instant digital drafting or high-precision legal printing.',
    theme: {
      primary: 'amber',
      primaryHex: '#d97706',
      accentHex: '#92400e',
      bgGlow: 'bg-amber-500/10',
      font: 'serif',
      headerLayout: 'classic'
    },
    fields: [
      { id: 'name', label: 'Advocate Name', placeholder: 'e.g. Adv. Rajeshwar S. Deshmukh', defaultValue: 'Adv. Rajeshwar S. Deshmukh' },
      { id: 'qualifications', label: 'Qualifications', placeholder: 'e.g. B.A., LL.M. (Constitutional Law)', defaultValue: 'B.A., LL.M. (Corporate & Criminal Laws)' },
      { id: 'enrolmentNo', label: 'Bar Council Enrolment No.', placeholder: 'e.g. MAH/1842/2012', defaultValue: 'MAH/1842/2012' },
      { id: 'court', label: 'Court / Chamber Jurisdiction', placeholder: 'e.g. Bombay High Court & District Courts', defaultValue: 'High Court of Judicature at Bombay & Sessions Court' },
      { id: 'chamberAddress', label: 'Chamber Address', placeholder: 'Chamber No., Bar Room, City, PIN', defaultValue: 'Chamber No. 14, 2nd Floor, Lawyers Chambers Block, High Court Complex, Fort, Mumbai - 400032' },
      { id: 'phone', label: 'Contact Number', placeholder: '+91 98765 43210', defaultValue: '+91 98220 14890', type: 'tel' },
      { id: 'email', label: 'Official Email', placeholder: 'adv.rajeshwar@lawchambers.in', defaultValue: 'chambers.deshmukh@lawyer.in', type: 'email' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Statutory Legal Notice under Section 138 NI Act',
        description: 'Formal demand notice issued on behalf of client for dishonour of cheque.',
        recipient: 'To,\nMr. Sunil Kumar Verma,\nProprietor, M/s Verma Enterprises,\nPlot No. 45, MIDC Area, Pune - 411018.',
        subject: 'STATUTORY LEGAL DEMAND NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881',
        fileNo: 'REF: RD/LEGAL/2026/104',
        body: [
          'Under instructions from and on behalf of my client, M/s Horizon Buildcon Pvt. Ltd., having its registered office at Nariman Point, Mumbai, I hereby serve upon you this statutory demand notice:',
          '1. That in discharge of your legally enforceable debt and liability for supply of raw construction material, you issued Cheque No. 448192 dated 10th February 2026 for ₹8,50,000/- drawn on State Bank of India in favour of my client.',
          '2. That on presentation for encashment, the said cheque was dishonoured and returned unpaid by the banker with memo dated 25th February 2026 stating "Funds Insufficient".',
          '3. You are hereby called upon to pay the aforesaid outstanding sum of ₹8,50,000/- (Rupees Eight Lakh Fifty Thousand Only) to my client within fifteen (15) days of the receipt of this notice, failing which my client shall initiate criminal prosecution against you under Section 138 of the Negotiable Instruments Act, 1881 entirely at your cost and risk.'
        ],
        signoff: 'Yours faithfully,\n\n[Signature]\nAdv. Rajeshwar S. Deshmukh\nCounsel for the Complainant'
      },
      {
        title: 'Formal Reply to Legal Notice',
        description: 'Categorical denial and legal reply to baseless allegations.',
        recipient: 'To,\nAdv. K. L. Mehra,\nChamber No. 302, District Court Compound,\nThane (West) - 400601.',
        subject: 'REPLY TO YOUR NOTICE DATED 12.01.2026 ON BEHALF OF SH. ALOK VERMA',
        fileNo: 'REF: RD/REPLY/2026/088',
        body: [
          'Under instructions from my client, Shri Alok Verma, resident of Thane, I hereby provide this categorical reply to your legal notice dated 12th January 2026 served on behalf of your client Shri Manish Gupta:',
          '1. That all allegations, claims, and demands raised in your notice are false, misconceived, and vehemently denied as if specifically set out and traversed herein.',
          '2. That your client has suppressed material contractual terms and has already received complete reconciliation for the completed scope of work as per voucher receipts dated 05.11.2025.',
          '3. Your client is hereby advised to withdraw the frivolous claims immediately. Should your client institute any unmerited litigation, the same shall be defended with exemplary costs.'
        ],
        signoff: 'Yours faithfully,\n\n[Signature]\nAdv. Rajeshwar S. Deshmukh\nAdvocate for Respondent'
      }
    ],
    formatGuide: [
      { title: 'Bar Council Enrolment Number', rule: 'Must state State Bar Council ID (e.g., MAH/1234/2015 or D/1234/2018) in the header.', importance: 'Statutory Requirement' },
      { title: 'Chamber & Court Affiliation', rule: 'List specific court complex and physical chamber address for official postal notices.', importance: 'Service Compliance' },
      { title: 'No Solicitation / Promotional Taglines', rule: 'Keep header strictly restricted to name, degrees, courts, and contacts as per BCI Rule 36.', importance: 'Ethics Compliance' },
      { title: 'Reference / File Dispatch Number', rule: 'Include a unique reference tracking code on the left margin for tracking postal acknowledgments.', importance: 'Procedural Record' },
      { title: 'Clear Signature & Office Seal Area', rule: 'Leave ample lower margin (35mm) for client counter-signatures and advocate seal.', importance: 'Filing Standard' }
    ],
    faqs: [
      { question: 'What details must be present on an advocate letterhead in India?', answer: 'An advocate letterhead must feature the Advocate’s Name, Qualifications (e.g. LL.B., LL.M.), Bar Council Enrolment Number, Designated Courts of Practice, Chamber Address, Contact Number, and Email Address.' },
      { question: 'Can an advocate include promotional slogans or practice claims on their letterhead?', answer: 'No. Under Rule 36 of Section IV of the Bar Council of India Rules, advocates in India are strictly barred from commercial advertising, touting, or promotional slogans on their stationery.' },
      { question: 'Is an advocate letterhead format valid for issuing Section 138 NI Act notices?', answer: 'Yes. Legal demand notices issued on an advocate letterhead with file reference numbers, dates, and registered postal tracking are standard evidence in Indian magistrate courts.' },
      { question: 'What font is best for advocate and law chamber letterheads?', answer: 'Traditional serif typography such as Merriweather, Garamond, Times New Roman, or Georgia conveys legal authority and clarity for court records.' },
      { question: 'Can I print advocate letterheads directly on standard A4 executive bond paper?', answer: 'Yes, Swalekhani formats letterpads to standard ISO A4 margins (210mm x 297mm) with balanced 15mm-20mm printable bounds suitable for 100-120 GSM executive bond paper.' },
      { question: 'How can I customize this advocate letterhead with Swalekhani?', answer: 'Click "Use this Template" to open Swalekhani Studio where you can adjust chamber addresses, insert firm monograms, draft with AI, and export print-ready vector PDFs.' }
    ],
    relatedSlugs: ['ca-accountant', 'real-estate-dealer', 'freelancer']
  },

  'ca-accountant': {
    slug: 'ca-accountant',
    profession: 'Chartered Accountant & Audit Firm',
    title: 'Chartered Accountant Letterhead Format & CA Audit Pad Maker',
    category: 'Legal',
    badge: 'ICAI Compliant',
    targetKeyword: 'chartered accountant letterhead format',
    shortDesc: 'Professional letterhead format for Chartered Accountants, Audit Firms, Tax Practitioners, and ICAI Members with FRN and UDIN citation lines.',
    introText: 'Chartered Accountants and statutory audit firms in India operate under rigorous professional ethics set forth by the Institute of Chartered Accountants of India (ICAI). A CA letterhead is an essential statutory document used for issuing statutory audit reports, tax audit certificates, net worth certifications, bank compliance letters, and representations before the Income Tax Appellate Tribunal (ITAT) and MCA. This format includes dedicated placeholders for Member Name, ICAI Membership Number, Firm Registration Number (FRN), and Unique Document Identification Number (UDIN).',
    theme: {
      primary: 'blue',
      primaryHex: '#1e40af',
      accentHex: '#1e3a8a',
      bgGlow: 'bg-blue-500/10',
      font: 'sans',
      headerLayout: 'modern'
    },
    fields: [
      { id: 'name', label: 'CA / Firm Name', placeholder: 'e.g. M/s K. S. Sharma & Associates', defaultValue: 'K. S. Sharma & Associates' },
      { id: 'subTitle', label: 'Designation / Specialty', placeholder: 'Chartered Accountants', defaultValue: 'Chartered Accountants' },
      { id: 'membershipNo', label: 'ICAI Membership No. (FCA/ACA)', placeholder: 'e.g. FCA 104829', defaultValue: 'FCA No: 104829' },
      { id: 'frn', label: 'Firm Registration No. (FRN)', placeholder: 'e.g. 128490W', defaultValue: 'FRN: 128490W' },
      { id: 'officeAddress', label: 'Office Address', placeholder: 'Suite / Office No, Building, City, PIN', defaultValue: 'Suite 402, Trade Square, Senapati Bapat Marg, Lower Parel, Mumbai - 400013' },
      { id: 'phone', label: 'Office Telephone', placeholder: '+91 22 2490 1122', defaultValue: '+91 22 2490 1122', type: 'tel' },
      { id: 'email', label: 'Official Audit Email', placeholder: 'ca.kssharma@icai.org', defaultValue: 'audit@kssharma.in', type: 'email' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Net Worth Certificate for Bank / Visa Facility',
        description: 'Statutory certificate certifying verified asset valuation and net worth.',
        recipient: 'To Whomsoever It May Concern',
        subject: 'NET WORTH CERTIFICATE OF SHRI VIKRAM ADITYA MEHTA',
        fileNo: 'UDIN: 26104829BGTA9821',
        body: [
          'We have verified the books of accounts, title deeds, bank statements, and tax returns produced before us by Shri Vikram Aditya Mehta, resident of Mumbai, and certify that his Net Worth as on 31st December 2025 is as under:',
          '1. Immovable Real Estate Properties (Fair Market Value): ₹4,20,00,000/-',
          '2. Movable Financial Assets (Shares, Mutual Funds, Bank FDs): ₹1,85,50,000/-',
          '3. Less: Liabilities & Bank Borrowings: (₹45,00,000/-)',
          'TOTAL NET WORTH CERTIFIED: ₹5,60,50,000/- (Rupees Five Crore Sixty Lakh Fifty Thousand Only).',
          'This certificate is issued at the specific request of the client for submission to banking authorities and is backed by registered valuer reports.'
        ],
        signoff: 'For K. S. Sharma & Associates\nChartered Accountants\n\n[Signature & ICAI Seal]\nCA K. S. Sharma (Proprietor)\nMembership No: 104829\nUDIN: 26104829BGTA9821'
      },
      {
        title: 'Statutory Audit Engagement Letter',
        description: 'Formal engagement letter defining scope and terms of annual company audit.',
        recipient: 'To,\nThe Board of Directors,\nM/s Apex Logistics India Private Limited,\nAndheri East, Mumbai - 400069.',
        subject: 'ENGAGEMENT LETTER FOR STATUTORY AUDIT FOR FY 2025-26',
        fileNo: 'REF: KSA/AUDIT/2026/04',
        body: [
          'We refer to your letter dated 15th January 2026 regarding our appointment as Statutory Auditors of M/s Apex Logistics India Pvt Ltd under Section 139 of the Companies Act, 2013.',
          '1. We confirm our acceptance and willingness to conduct the statutory audit for the financial year ending 31st March 2026 in accordance with Standards on Auditing (SAs) issued by the ICAI.',
          '2. Management is responsible for preparation of financial statements that give a true and fair view and for maintaining internal financial controls.',
          '3. We shall issue our Independent Auditor’s Report upon completion of substantive testing and verification.'
        ],
        signoff: 'Yours faithfully,\nFor K. S. Sharma & Associates\nChartered Accountants\n\n[Signature]\nCA K. S. Sharma, FCA'
      }
    ],
    formatGuide: [
      { title: 'Firm Registration Number (FRN)', rule: 'Mandatory display of ICAI FRN for partnership and proprietary CA firms.', importance: 'Statutory Compliance' },
      { title: 'Dedicated UDIN Space', rule: 'Provide a visible line at the top or signature block for the 18-digit UDIN.', importance: 'ICAI Mandate' },
      { title: 'Partner / Proprietor FCA Designation', rule: 'Clearly designate Fellow Chartered Accountant (FCA) or Associate (ACA).', importance: 'Professional Transparency' },
      { title: 'Branch Office Address Footer', rule: 'Include registered head office and branch offices in a clean multi-column footer.', importance: 'Firm Identity' },
      { title: 'Clean Geometric Sans Font', rule: 'Use clear typography like Inter or Roboto for tabular and numerical clarity.', importance: 'Readability' }
    ],
    faqs: [
      { question: 'Is a UDIN mandatory on certificates issued on a CA letterhead?', answer: 'Yes. As per ICAI mandate, every certificate, audit report, and attestation issued by a practicing Chartered Accountant must contain a valid 18-digit UDIN.' },
      { question: 'Can an individual CA use "Chartered Accountants" plural on the letterhead?', answer: 'Only partnership and multi-member firms can use "Chartered Accountants". A sole proprietor must state "Chartered Accountant" or their registered proprietary firm name.' },
      { question: 'What color palette is recommended for accounting firm stationery?', answer: 'Corporate navy blue (#1e40af), deep slate, or charcoal with clean white backgrounds provides a credible, audit-grade appearance.' },
      { question: 'How do I download a vector PDF of this CA letterhead?', answer: 'Click "Use this Template", customize your firm numbers, and click "Export Vector PDF" in the Swalekhani draft editor.' }
    ],
    relatedSlugs: ['advocate', 'contractor-builder', 'freelancer']
  },

  'real-estate-dealer': {
    slug: 'real-estate-dealer',
    profession: 'Real Estate Consultant & Property Broker',
    title: 'Real Estate Letterhead Format & Property Dealer Pad Maker',
    category: 'Business',
    badge: 'RERA Compliant',
    targetKeyword: 'real estate letterhead format',
    shortDesc: 'Commercial letterhead template for Real Estate Brokers, Property Consultants, Realtors, and Housing Advisors with RERA Agent Registration numbers.',
    introText: 'Under the Real Estate (Regulation and Development) Act (RERA), property consultants, brokers, and channel partners are mandated to present their registered RERA Agent Number on all transaction communications, quotation slips, property booking forms, and allotment letters. A polished real estate letterhead instills trust in buyers, investors, and developers during high-value property deals. Swalekhani’s real estate format provides an executive modern aesthetic with dual logo slots, corporate credentials, and transaction-ready sample letters.',
    theme: {
      primary: 'emerald',
      primaryHex: '#059669',
      accentHex: '#065f46',
      bgGlow: 'bg-emerald-500/10',
      font: 'sans',
      headerLayout: 'modern'
    },
    fields: [
      { id: 'name', label: 'Company / Agency Name', placeholder: 'e.g. Prime Habitat Realty Advisors', defaultValue: 'Prime Habitat Realty Advisors' },
      { id: 'subTitle', label: 'Agency Tagline / Scope', placeholder: 'RERA Registered Property Consultants', defaultValue: 'RERA Registered Real Estate Consultants & Channel Partners' },
      { id: 'reraNo', label: 'MahaRERA / RERA Reg. No.', placeholder: 'e.g. A51900028491', defaultValue: 'RERA Reg No: A51900028491' },
      { id: 'gstin', label: 'GSTIN Number', placeholder: 'e.g. 27AABCP1234F1Z8', defaultValue: 'GSTIN: 27AABCP1234F1Z8' },
      { id: 'address', label: 'Corporate Office Address', placeholder: 'Commercial Tower, Sector, City, PIN', defaultValue: 'Unit 305, Platina Heights, Golf Course Extension Road, Sector 56, Gurugram - 122011' },
      { id: 'phone', label: 'Sales Helpline / WhatsApp', placeholder: '+91 98110 99887', defaultValue: '+91 98110 99887', type: 'tel' },
      { id: 'email', label: 'Inquiry Email', placeholder: 'contact@primehabitat.in', defaultValue: 'deals@primehabitat.in', type: 'email' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Property Expression of Interest & Booking Confirmation',
        description: 'Formal allotment acknowledgment issued to prospective home buyers.',
        recipient: 'To,\nMr. & Mrs. Sameer Kapoor,\nTower B, Flat 1204, Palm Greens,\nGurugram - 122002.',
        subject: 'BOOKING CONFIRMATION & EXPRESSION OF INTEREST FOR 3BHK RESIDENCY',
        fileNo: 'REF: PHR/BOOK/2026/192',
        body: [
          'We thank you for booking your dream home through Prime Habitat Realty Advisors in the prestigious project "Elysium Heights" developed by Apex Lifespaces (RERA No: RC/REP/HARERA/GGM/2024/45).',
          '1. Unit Details: Unit No. 1402, 14th Floor, Tower Emerald, Super Built-up Area: 1850 Sq. Ft.',
          '2. Total Agreed Consideration: ₹1,65,00,000/- (Rupees One Crore Sixty-Five Lakh Only) excluding stamp duty and registration.',
          '3. Booking Amount Received: Cheque No. 589124 for ₹5,00,000/- dated 18.02.2026.',
          'Formal Builder-Buyer Agreement (BBA) shall be executed within 21 days upon clearance of the initial installment.'
        ],
        signoff: 'Warm regards,\nFor Prime Habitat Realty Advisors\n\n[Authorized Signatory]\nManish Goel (Principal Consultant)\nRERA No: A51900028491'
      },
      {
        title: 'Exclusive Brokerage Representation Mandate',
        description: 'Client engagement letter for marketing commercial or residential inventory.',
        recipient: 'To,\nDirector, M/s Surya Logipark LLP,\nUdyog Vihar Phase 4, Gurugram.',
        subject: 'EXCLUSIVE LEASING & MARKETING MANDATE FOR 45,000 SQ. FT. WAREHOUSE',
        fileNo: 'REF: PHR/MANDATE/2026/077',
        body: [
          'We are pleased to confirm our appointment as your exclusive leasing advisors for your state-of-the-art Grade-A warehousing facility located at NH-48 Highway Corridor.',
          '1. Scope: Sourcing verified corporate 3PL and logistics tenants, lease negotiation, and agreement coordination.',
          '2. Agency Fee: 01 Month’s gross rent upon execution of registered lease deed.',
          'We look forward to executing rapid occupancy with verified corporate tenancies.'
        ],
        signoff: 'Yours sincerely,\nFor Prime Habitat Realty Advisors\n\n[Signature]\nAuthorized Channel Partner'
      }
    ],
    formatGuide: [
      { title: 'Prominent RERA Registration Number', rule: 'Must display State RERA Agent ID on all correspondence and quotes.', importance: 'Legal Mandate' },
      { title: 'GSTIN & Legal Status', rule: 'Mention GST Identification Number for commercial brokerage transparency.', importance: 'Tax Compliance' },
      { title: 'Project Association Disclaimers', rule: 'Clarify status as Authorized Channel Partner / Real Estate Agent.', importance: 'Consumer Protection' },
      { title: 'Branch & Market Presence', rule: 'List coverage areas (e.g. Gurugram, Delhi NCR, Mumbai MMR).', importance: 'Market Credibility' }
    ],
    faqs: [
      { question: 'Is RERA registration mandatory on real estate dealer letterheads in India?', answer: 'Yes. Under RERA Section 10, real estate agents cannot facilitate sales without quoting their official RERA registration number on all promotional materials and stationery.' },
      { question: 'Can real estate agents include developer logos on their letterpad?', answer: 'Agents can include their own agency logo in the header and mention authorized developer affiliations in the footer or text body.' },
      { question: 'What documents do brokers issue on their official letterhead?', answer: 'Brokers use letterheads for Expression of Interest (EOI) letters, brokerage invoices, NOC requests, property valuation summaries, and mandate agreements.' }
    ],
    relatedSlugs: ['contractor-builder', 'housing-society', 'ca-accountant']
  },

  'coaching-classes': {
    slug: 'coaching-classes',
    profession: 'Coaching Institute & Academy',
    title: 'Coaching Classes Letterhead Format & Institute Pad Maker',
    category: 'Education',
    badge: 'Academic Standard',
    targetKeyword: 'coaching classes letterhead format',
    shortDesc: 'Official letterhead design for Educational Institutes, Coaching Academies, Tuition Classes, IIT-JEE/NEET Centers, and Skill Academies.',
    introText: 'Educational institutes, private coaching centers, and competitive exam academies require professional letterheads for issuing student admission confirmations, fee receipts, performance appraisals, scholarship awards, and faculty appointment orders. An organized academic letterhead displays the institute’s registered name, ISO certifications, branch locations, and student counseling helplines, establishing authority and academic excellence. Swalekhani offers clean educational templates with crest emblems and bilingual text support.',
    theme: {
      primary: 'indigo',
      primaryHex: '#4338ca',
      accentHex: '#312e81',
      bgGlow: 'bg-indigo-500/10',
      font: 'sans',
      headerLayout: 'modern'
    },
    fields: [
      { id: 'name', label: 'Institute Name', placeholder: 'e.g. Zenith Academy of Sciences', defaultValue: 'Zenith Academy of Sciences' },
      { id: 'subTitle', label: 'Course Offerings / Tagline', placeholder: 'IIT-JEE | NEET-UG | Foundation & Olympiads', defaultValue: 'Premier Institute for IIT-JEE, NEET-UG & Foundation Courses' },
      { id: 'regNo', label: 'Govt / MSME Reg. No.', placeholder: 'e.g. Reg. No. MH/PUN/2019/00482', defaultValue: 'Regd. Under MSME: UDYAM-MH-26-0048192' },
      { id: 'branchAddress', label: 'Main Campus Address', placeholder: 'Campus Address, City, PIN', defaultValue: 'Central Campus: Knowledge Park, FC Road, Shivajinagar, Pune - 411005' },
      { id: 'phone', label: 'Student Helpline / Office', placeholder: '+91 20 2553 4400', defaultValue: '+91 20 2553 4400', type: 'tel' },
      { id: 'email', label: 'Admissions Email', placeholder: 'admissions@zenithacademy.in', defaultValue: 'info@zenithacademy.in', type: 'email' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Merit Scholarship & Admission Offer Letter',
        description: 'Formal letter offering batch admission and tuition fee concession.',
        recipient: 'To,\nMaster Aryan S. Patil (Roll No: ZAS-2026-904),\nFlat 102, Shivalik Towers, Kothrud, Pune.',
        subject: 'ADMISSION OFFER & 40% MERIT SCHOLARSHIP — TWO-YEAR IIT-JEE BATCH',
        fileNo: 'REF: ZAS/ADM/2026/842',
        body: [
          'Congratulations! On the basis of your outstanding performance in the Zenith Talent Search Examination (ZTSE 2026) securing All-India Rank 42, we are pleased to offer you admission into our Two-Year Target JEE (Advanced) Batch 2026-2028.',
          '1. Batch Allotment: Champions Super-30 Batch (Offline Classroom Programme).',
          '2. Scholarship Concession: 40% waiver on total tuition fee component.',
          '3. Orientation Date: Classes commence on Monday, 07th April 2026 at FC Road Campus.',
          'Please submit required academic marksheets and fee installment before 25th March 2026 to confirm your seat.'
        ],
        signoff: 'Yours sincerely,\nFor Zenith Academy of Sciences\n\n[Signature & Institute Seal]\nDr. P. V. Kulkarni (Academic Director)'
      },
      {
        title: 'Course Completion & Bonafide Certificate',
        description: 'Official certificate verifying student attendance and syllabus completion.',
        recipient: 'To Whomsoever It May Concern',
        subject: 'BONAFIDE & ATTENDANCE CERTIFICATE',
        fileNo: 'REF: ZAS/BONA/2026/112',
        body: [
          'This is to certify that Miss Ananya R. Joshi was a bonafide student of Zenith Academy of Sciences enrolled in the NEET-UG Intensive Test Series for academic session 2025-26.',
          'During her tenure at the institute, her attendance in weekly mock simulations was 96.5% and her conduct was exemplary.',
          'We wish her the very best in all her medical entrance examinations.'
        ],
        signoff: 'For Zenith Academy of Sciences\n\n[Signature]\nCentre Head / Controller of Exams'
      }
    ],
    formatGuide: [
      { title: 'Academic Accreditation / MSME Number', rule: 'State institute registration details and educational society backing.', importance: 'Student Confidence' },
      { title: 'Helpline & Counseling Contacts', rule: 'Include dedicated admissions and student support WhatsApp numbers.', importance: 'Accessibility' },
      { title: 'Branch Network Footer', rule: 'List regional classroom centers and laboratory facilities.', importance: 'Institutional Scale' }
    ],
    faqs: [
      { question: 'Can coaching classes issue valid bonafide certificates on their letterpad?', answer: 'Yes, coaching academies routinely issue bonafide attendance certificates, scholarship letters, and test result cards on their official letterheads.' },
      { question: 'What fields should an educational institute include in the header?', answer: 'Institute Name, Tagline/Courses (e.g. JEE/NEET/CA Foundation), Registration Number, Campus Address, Contact Numbers, and Website URL.' }
    ],
    relatedSlugs: ['school-letterpad', 'freelancer', 'ngo-trust']
  },

  'clinic': {
    slug: 'clinic',
    profession: 'Polyclinic & Healthcare Centre',
    title: 'Clinic Letterhead Format & Doctor Polyclinic Pad Maker',
    category: 'Medical',
    badge: 'NMC & CEA Compliant',
    targetKeyword: 'clinic letterhead format',
    shortDesc: 'Standard healthcare letterhead and prescription pad format for Polyclinics, Diagnostic Centers, Dental Clinics, and Multi-Specialty Health Centers.',
    introText: 'Medical clinics, polyclinics, and outpatient healthcare facilities require clinical stationery compliant with the National Medical Commission (NMC) regulations and Clinical Establishments Act (CEA). A clinic letterhead must clearly feature the clinic name, clinical establishment registration number, panel of consulting physicians with their medical council registration numbers, OPD consulting hours, emergency contact lines, and diagnostic facilities. Swalekhani provides doctor and polyclinic formats designed for clean prescription and diagnostic referral drafting.',
    theme: {
      primary: 'cyan',
      primaryHex: '#0891b2',
      accentHex: '#0e7490',
      bgGlow: 'bg-cyan-500/10',
      font: 'sans',
      headerLayout: 'minimal'
    },
    fields: [
      { id: 'name', label: 'Clinic / Diagnostic Name', placeholder: 'e.g. CareWell Multi-Specialty Clinic', defaultValue: 'CareWell Multi-Specialty Clinic & Diagnostics' },
      { id: 'subTitle', label: 'Departments / Specialists', placeholder: 'e.g. General Medicine | Pediatrics | Orthopedics', defaultValue: 'General Medicine | Cardiology | Pediatrics & Pathology' },
      { id: 'ceaNo', label: 'Clinical Est. Reg. No. (CEA)', placeholder: 'e.g. CEA/MH/PUN/2022/918', defaultValue: 'Reg No: CEA/MH/PUN/2022/918' },
      { id: 'doctorsList', label: 'Consulting Physicians', placeholder: 'Dr. A. Sharma MBBS MD | Dr. P. Rao MS', defaultValue: 'Dr. Aarav Sharma, MBBS, MD (Medicine) [MMC: 2011/04/1049]\nDr. Priya Rao, DNB (Pediatrics) [MMC: 2015/08/2190]' },
      { id: 'address', label: 'Clinic Address', placeholder: 'Floor, Complex, Road, City, PIN', defaultValue: 'Shop 10-12, Ground Floor, Sai Plaza, Opp Metro Pillar 44, Kothrud, Pune - 411038' },
      { id: 'phone', label: 'Appointments & Emergency', placeholder: '+91 20 2544 9900', defaultValue: '+91 20 2544 9900 / +91 98221 00444', type: 'tel' },
      { id: 'timings', label: 'OPD Timings', placeholder: 'Mon-Sat: 9AM - 1PM & 5PM - 9PM', defaultValue: 'Mon-Sat: 09:00 AM - 01:00 PM & 05:30 PM - 09:30 PM (Sunday Closed)' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Medical Fitness & Leave Recommendation Certificate',
        description: 'Statutory medical certificate for employee illness and fitness to resume duties.',
        recipient: 'To Whomsoever It May Concern',
        subject: 'MEDICAL CERTIFICATE & FITNESS DECLARATION',
        fileNo: 'REF: CW/MED/2026/748',
        body: [
          'This is to certify that Mr. Dinesh K. Bhosale, aged 38 years, residing at Pune, has been under my medical care and treatment for Acute Bronchitis and Febrile Illness from 10th February 2026 to 18th February 2026.',
          '1. In view of the clinical condition, the patient was advised complete bed rest and medication during the said period of nine (09) days.',
          '2. I have examined him today on 19th February 2026 and certify that he has clinically recovered and is now medically FIT to resume his normal official duties.'
        ],
        signoff: 'Yours faithfully,\n\n[Signature & Medical Seal]\nDr. Aarav Sharma, MBBS, MD (Med)\nReg No: MMC 2011/04/1049'
      },
      {
        title: 'Diagnostic Lab Referral & Patient Summary',
        description: 'Clinical referral slip for advanced radiodiagnosis and cardiac evaluation.',
        recipient: 'To,\nThe Chief Radiologist / Cardiologist,\nApex Heart & Diagnostic Institute, Pune.',
        subject: 'PATIENT CLINICAL REFERRAL — ADVANCED CARDIAC WORKUP',
        fileNo: 'REF: CW/REF/2026/092',
        body: [
          'Referring Patient: Mrs. Nalini G. Deshpande, 56 Yrs / Female (OPD No: 44810).',
          'Clinical Summary: Patient presents with exertional dyspnea (NYHA Class II) and atypical chest heaviness since 2 weeks. Resting ECG shows non-specific ST-T wave changes in inferior leads.',
          'Requested Investigations: 2D-Echocardiography with Doppler study, TMT (Treadmill Test), and Serum Lipid Profile.',
          'Kindly evaluate and share diagnostic reports for further therapeutic management.'
        ],
        signoff: 'With regards,\nCareWell Multi-Specialty Clinic\n\n[Signature]\nConsulting Physician'
      }
    ],
    formatGuide: [
      { title: 'Clinical Establishment Act (CEA) Number', rule: 'Mandatory display of municipal or state health department registration.', importance: 'Statutory Requirement' },
      { title: 'Doctor Name & Council Registration', rule: 'Must list consulting doctors alongside their State Medical Council Reg No.', importance: 'NMC Ethics 2023' },
      { title: 'OPD Hours & Emergency Helpline', rule: 'State consultation shifts and 24x7 ambulance/emergency contacts clearly.', importance: 'Patient Safety' }
    ],
    faqs: [
      { question: 'What is the difference between a doctor pad and a clinic letterhead?', answer: 'A doctor letterpad is tailored for a single practitioner, while a clinic letterhead accommodates multiple consulting doctors, diagnostic specialties, and clinical registration numbers.' },
      { question: 'Is this clinic letterhead compliant with NMC guidelines?', answer: 'Yes. It adheres to the NMC Code of Medical Ethics 2023, requiring registered practitioner names, verified medical degrees, and council registration numbers.' }
    ],
    relatedSlugs: ['doctor-letterpad', 'advocate', 'ca-accountant']
  },

  'restaurant-hotel': {
    slug: 'restaurant-hotel',
    profession: 'Restaurant, Hotel & Hospitality',
    title: 'Restaurant & Hotel Letterhead Format | Hospitality Pad Maker',
    category: 'Business',
    badge: 'FSSAI Compliant',
    targetKeyword: 'restaurant letterhead format',
    shortDesc: 'Hospitality letterhead template for Restaurants, Hotels, Resorts, Cafes, Banquet Halls, and Caterers with FSSAI License numbers.',
    introText: 'Hospitality establishments including luxury hotels, multi-cuisine restaurants, boutique resorts, and catering enterprises require sophisticated stationery for issuing banquet event quotations, corporate room bookings, vendor purchase orders, and catering agreements. An elegant hospitality letterhead features the brand crest, FSSAI 14-digit food safety license number, GSTIN, star classification, and front-desk concierge contacts. Swalekhani offers curated hospitality templates with rich visual styling.',
    theme: {
      primary: 'rose',
      primaryHex: '#e11d48',
      accentHex: '#9f1239',
      bgGlow: 'bg-rose-500/10',
      font: 'serif',
      headerLayout: 'classic'
    },
    fields: [
      { id: 'name', label: 'Hotel / Restaurant Name', placeholder: 'e.g. The Grand Heritage Hotel & Suites', defaultValue: 'The Grand Heritage Hotel & Suites' },
      { id: 'subTitle', label: 'Cuisine / Facility Type', placeholder: 'Luxury Stay | Fine Dining | Banquet & Events', defaultValue: 'Luxury Accommodation | Fine Dining & Banquet Halls' },
      { id: 'fssai', label: 'FSSAI License No.', placeholder: 'e.g. FSSAI Lic No: 11522044000192', defaultValue: 'FSSAI Lic No: 11522044000192' },
      { id: 'gstin', label: 'GSTIN Number', placeholder: 'e.g. 27AAACG4419K1Z4', defaultValue: 'GSTIN: 27AAACG4419K1Z4' },
      { id: 'address', label: 'Property Address', placeholder: 'Resort Road, City, PIN', defaultValue: 'Heritage Boulevard, Opp Lake View, Civil Lines, Jaipur - 302006' },
      { id: 'phone', label: 'Concierge & Reservations', placeholder: '+91 141 2620 4400', defaultValue: '+91 141 2620 4400', type: 'tel' },
      { id: 'email', label: 'Reservations Email', placeholder: 'reservations@grandheritage.com', defaultValue: 'events@grandheritage.com', type: 'email' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Banquet & Wedding Event Booking Confirmation',
        description: 'Formal contract confirming banquet hall reservation and catering menu.',
        recipient: 'To,\nMr. Virendra S. Shekhawat,\nB-44, Malviya Nagar, Jaipur.',
        subject: 'BANQUET RESERVATION CONFIRMATION — ROYAL PALM BALLROOM (18TH APRIL 2026)',
        fileNo: 'REF: GHH/BANQ/2026/089',
        body: [
          'We are delighted to confirm the reservation of the Royal Palm Ballroom at The Grand Heritage Hotel for your daughter’s wedding reception on Saturday, 18th April 2026.',
          '1. Event Timings: 06:30 PM to 11:30 PM (Guaranteed Minimum Guests: 350 Persons).',
          '2. Menu Plan: Royal Heritage Multi-Cuisine Buffet with live chaat and dessert counters.',
          '3. Package Rate: ₹1,650/- per plate plus applicable GST.',
          '4. Advance Deposit Received: ₹2,00,000/- vide Bank Transfer UTR: HDFC990148201.',
          'Our banquet coordinator shall assist with setup requirements and audio-visual arrangements.'
        ],
        signoff: 'Warm regards,\nFor The Grand Heritage Hotel & Suites\n\n[Signature]\nVikramaditya Rathore (Banquet Sales Manager)'
      },
      {
        title: 'Corporate Room Booking & Tariff Quotation',
        description: 'Formal corporate rate agreement for business executives and conferences.',
        recipient: 'To,\nThe Head - Corporate Travel,\nM/s Infosys Limited, Tech Park, Jaipur.',
        subject: 'SPECIAL CORPORATE TARIFF AGREEMENT — FY 2026-27',
        fileNo: 'REF: GHH/CORP/2026/14',
        body: [
          'We are pleased to offer preferred corporate room tariffs for your visiting executives at The Grand Heritage Hotel & Suites:',
          '1. Deluxe Executive Room: ₹4,500/- per night (Inclusive of buffet breakfast & high-speed Wi-Fi).',
          '2. Heritage Suite: ₹8,000/- per night (Includes airport transfers & lounge access).',
          '3. Cancellation: Free cancellation up to 24 hours prior to scheduled check-in.'
        ],
        signoff: 'Yours sincerely,\nFor The Grand Heritage Hotel\n\n[Signature]\nDirector of Sales & Marketing'
      }
    ],
    formatGuide: [
      { title: 'FSSAI License Display', rule: 'Must display the 14-digit FSSAI food safety license on all dining and catering stationery.', importance: 'Food Safety Act' },
      { title: 'GSTIN & Legal Business Entity', rule: 'State corporate trade name and GST details for commercial invoicing.', importance: 'Tax Compliance' },
      { title: 'Hospitality Typography', rule: 'Serif or elegant display typography reflects premium service standards.', importance: 'Brand Value' }
    ],
    faqs: [
      { question: 'Is FSSAI number compulsory on restaurant letterpads?', answer: 'Yes. Under Food Safety and Standards (FSSAI) regulations, food business operators must quote their 14-digit license number on all official communications and invoices.' },
      { question: 'Can hotels use this template for banquet agreements and receipts?', answer: 'Yes, this template is pre-structured for event bookings, corporate room tariffs, vendor orders, and catering confirmations.' }
    ],
    relatedSlugs: ['shop-letterpad', 'company-letterpad', 'freelancer']
  },

  'ngo-trust': {
    slug: 'ngo-trust',
    profession: 'NGO, Non-Profit & Charitable Trust',
    title: 'NGO Letterhead Format & Charitable Trust Pad Maker',
    category: 'Public',
    badge: '80G / 12A Compliant',
    targetKeyword: 'ngo letterhead format',
    shortDesc: 'Official letterhead format for NGOs, Non-Profit Organizations, Charitable Trusts, Foundations, and Societies with 80G, 12A, and NGO Darpan IDs.',
    introText: 'Non-Governmental Organizations (NGOs), Section 8 Non-Profit Companies, and Charitable Public Trusts in India must maintain transparent stationery for donor acknowledgments, CSR grant applications, government representations, and tax exemption certificates. An official NGO letterhead must prominently display the Trust Registration Number, NITI Aayog NGO DARPAN Unique ID, Section 80G and 12A Income Tax Exemption approvals, and FCRA registration where applicable. Swalekhani provides compliant non-profit letterhead designs.',
    theme: {
      primary: 'teal',
      primaryHex: '#0d9488',
      accentHex: '#115e59',
      bgGlow: 'bg-teal-500/10',
      font: 'sans',
      headerLayout: 'modern'
    },
    fields: [
      { id: 'name', label: 'NGO / Trust Name', placeholder: 'e.g. Samarthya Foundation', defaultValue: 'Samarthya Rural Development Foundation' },
      { id: 'subTitle', label: 'Mission / Non-Profit Status', placeholder: 'Registered Charitable Public Trust', defaultValue: 'Registered Charitable Public Trust | Empowering Rural Communities' },
      { id: 'trustReg', label: 'Trust / Society Reg. No.', placeholder: 'e.g. Trust Reg: E-34190/Pune', defaultValue: 'Regd. Under Bombay Public Trust Act (Reg: E-34190/Pune)' },
      { id: 'darpanId', label: 'NGO DARPAN / 80G / 12A ID', placeholder: 'NITI Aayog DARPAN: MH/2020/024819', defaultValue: 'NITI Aayog DARPAN: MH/2020/024819 | 80G & 12A Approved' },
      { id: 'address', label: 'Registered Office Address', placeholder: 'Office Address, City, PIN', defaultValue: '401, Seva Sadan, Near Shivaji Chowk, Satara Road, Pune - 411037' },
      { id: 'phone', label: 'Contact Phone / WhatsApp', placeholder: '+91 20 2422 5500', defaultValue: '+91 20 2422 5500 / +91 98500 11223', type: 'tel' },
      { id: 'email', label: 'Official Trust Email', placeholder: 'contact@samarthya.org', defaultValue: 'trust@samarthyafoundation.org', type: 'email' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'CSR Grant Proposal & Project Request',
        description: 'Formal funding application submitted to corporate CSR committees.',
        recipient: 'To,\nThe Head - Corporate Social Responsibility (CSR),\nM/s Bharat Forge Limited, Mundhwa, Pune.',
        subject: 'PROJECT PROPOSAL FOR SOLAR-POWERED DRINKING WATER UNITS IN 10 VILLAGES',
        fileNo: 'REF: SRDF/CSR/2026/042',
        body: [
          'Samarthya Rural Development Foundation is a registered public trust working since 2014 in water conservation, rural health, and girl-child education in drought-affected regions of Western Maharashtra.',
          '1. Project Scope: Installation of 10 community solar-powered water filtration units benefiting 12,500 villagers across Purandar taluka.',
          '2. Estimated Budget: Total project outlay of ₹35,00,000/- with detailed BOQ and maintenance plan.',
          '3. Tax Exemption: Donations to our foundation are eligible for 50% deduction under Section 80G of the Income Tax Act, 1961.',
          'We request an opportunity to present this impactful initiative before your CSR review committee.'
        ],
        signoff: 'Yours sincerely,\nFor Samarthya Rural Development Foundation\n\n[Signature]\nShri Mohan G. Kulkarni (Managing Trustee)'
      },
      {
        title: 'Donation Acknowledgment & 80G Tax Exemption Letter',
        description: 'Official receipt and certification for philanthropic donations.',
        recipient: 'To,\nMr. Aniket R. Joshi,\nDirector, M/s Joshi Infotech Solutions,\nBaner, Pune - 411045.',
        subject: 'ACKNOWLEDGMENT OF CHARITABLE DONATION & 80G CERTIFICATION',
        fileNo: 'REF: SRDF/80G/2026/891',
        body: [
          'We gratefully acknowledge the receipt of your generous philanthropic contribution of ₹1,00,000/- (Rupees One Lakh Only) received vide Cheque No. 441029 dated 15th January 2026 towards our Rural Education Scholarship Fund.',
          '1. NGO PAN: AABTS4419E | 12A Registration No: PN/CIT/12A/2016-17/1049.',
          '2. Section 80G Order No: PN/CIT(Exempt)/80G/2019-20/4482 valid indefinitely as per CBDT circulars.',
          'Your support directly funds school kits, science laboratory equipment, and digital books for 50 underprivileged rural students.'
        ],
        signoff: 'With profound gratitude,\nFor Samarthya Rural Development Foundation\n\n[Signature & Trust Stamp]\nTreasurer / Secretary'
      }
    ],
    formatGuide: [
      { title: 'Trust / Society Registration Details', rule: 'Must state Society Registration Act 1860 or Public Trust Act registration number.', importance: 'Legal Proof' },
      { title: 'NITI Aayog NGO DARPAN ID', rule: 'Display Unique DARPAN ID for government grants and CSR eligibility.', importance: 'CSR Requirement' },
      { title: 'Section 80G & 12A Approvals', rule: 'Quote 80G order numbers on all donor receipts and acknowledgments.', importance: 'Donor Tax Deduction' }
    ],
    faqs: [
      { question: 'What details are mandatory on an Indian NGO letterhead?', answer: 'Trust/Society Registration Number, NGO DARPAN Unique ID, PAN Number, Section 80G/12A approval details, registered address, and managing trustee names.' },
      { question: 'Can NGOs issue 80G tax exemption receipts on this letterhead?', answer: 'Yes, this format includes statutory fields to issue formal donation acknowledgments with 80G deduction citations.' }
    ],
    relatedSlugs: ['housing-society', 'gram-panchayat', 'school-letterpad']
  },

  'contractor-builder': {
    slug: 'contractor-builder',
    profession: 'Civil Contractor & Builder',
    title: 'Contractor Letterhead Format & Builder Construction Pad Maker',
    category: 'Business',
    badge: 'PWD / CPWD Registered',
    targetKeyword: 'contractor letterhead format',
    shortDesc: 'Heavy-duty commercial letterhead for Civil Contractors, Builders, Infrastructure Developers, Electrical Contractors, and PWD/CPWD Vendors.',
    introText: 'Civil contractors, infrastructure developers, building contractors, and specialized engineering vendors require authoritative stationery for submitting government tender bids, technical bid quotations, work completion certificates, subcontractor agreements, and material procurement orders. A robust contractor letterhead features the company name, PWD / CPWD Contractor Class Registration, GSTIN, MSME Udyam ID, and engineering certifications. Swalekhani delivers high-clarity construction letterhead templates.',
    theme: {
      primary: 'amber',
      primaryHex: '#b45309',
      accentHex: '#78350f',
      bgGlow: 'bg-amber-500/10',
      font: 'sans',
      headerLayout: 'modern'
    },
    fields: [
      { id: 'name', label: 'Company / Firm Name', placeholder: 'e.g. Sahyadri Infracon & Developers', defaultValue: 'Sahyadri Infracon & Engineering Works' },
      { id: 'subTitle', label: 'Contractor Category & Scope', placeholder: 'Govt. Approved Class-I Civil & Infra Contractor', defaultValue: 'Govt. Approved Class-I Civil, Road & Infrastructure Contractors' },
      { id: 'pwdClass', label: 'PWD / CPWD / MES Class Reg.', placeholder: 'e.g. PWD Class-I (Super) Reg: PWD/MH/2021/448', defaultValue: 'PWD Maharashtra Class-I Reg. No: PWD/MH/2021/448' },
      { id: 'gstin', label: 'GSTIN Number', placeholder: 'e.g. 27AAGCS9912Q1ZN', defaultValue: 'GSTIN: 27AAGCS9912Q1ZN' },
      { id: 'address', label: 'Head Office Address', placeholder: 'Industrial Estate, City, PIN', defaultValue: 'Plot No. 18, MIDC Industrial Area, Satpur, Nashik - 422007' },
      { id: 'phone', label: 'Project Helpline / Phone', placeholder: '+91 253 2355 1100', defaultValue: '+91 253 2355 1100 / +91 94222 55660', type: 'tel' },
      { id: 'email', label: 'Tenders & Billing Email', placeholder: 'tenders@sahyadriinfra.com', defaultValue: 'projects@sahyadriinfra.com', type: 'email' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Tender Quotation & Technical Bid Submission',
        description: 'Official bid submission letter addressed to government executive engineers.',
        recipient: 'To,\nThe Executive Engineer,\nPublic Works Division (PWD),\nCivil Lines, Nashik - 422001.',
        subject: 'SUBMISSION OF TECHNICAL & FINANCIAL BID FOR TENDER NO: PWD/NSK/ROAD/2026/08',
        fileNo: 'REF: SIEW/TENDER/2026/184',
        body: [
          'Sir, with reference to E-Tender Notice No. PWD/NSK/ROAD/2026/08 for the work of "Widening and Asphaltation of Trimbak-Nashik State Highway (Km 12/00 to 24/00)", we hereby submit our formal tender bid:',
          '1. We confirm that our firm holds valid PWD Class-I contractor registration and has completed similar infrastructure works exceeding ₹25 Crores in the last 3 financial years.',
          '2. Earnest Money Deposit (EMD) of ₹2,50,000/- and tender fee have been submitted online vide Treasury Challan No. MH-990481.',
          '3. All required machinery ownership affidavits, asphalt batch mix plant certificates, and bar-chart work schedules are enclosed.'
        ],
        signoff: 'Yours faithfully,\nFor Sahyadri Infracon & Engineering Works\n\n[Signature & Firm Seal]\nSanjay T. Deshmukh (Managing Partner)\nClass-I Govt. Contractor'
      },
      {
        title: 'Work Completion & Final Handover Certificate',
        description: 'Formal completion certification for commercial and residential construction.',
        recipient: 'To,\nM/s Godavari Agro Products Ltd.,\nMIDC Industrial Zone, Nashik.',
        subject: 'WORK COMPLETION CERTIFICATE — INDUSTRIAL WAREHOUSE SHED NO. 4',
        fileNo: 'REF: SIEW/COMPL/2026/092',
        body: [
          'We are pleased to certify that the construction of Industrial PEB Warehouse Shed No. 4 (Built-up Area: 35,000 Sq. Ft.) has been fully completed on 15th February 2026 in strict conformity with approved structural drawings and specifications.',
          '1. All RCC flooring, PEB structural erection, and stormwater drainage systems have passed load testing.',
          '2. The defect liability period of 12 months commences from the date of this handover.'
        ],
        signoff: 'For Sahyadri Infracon & Engineering Works\n\n[Signature]\nChief Project Engineer'
      }
    ],
    formatGuide: [
      { title: 'PWD / CPWD Contractor Class', rule: 'Must state valid Class (e.g. Class-I, Class-II) and department registration.', importance: 'Tender Eligibility' },
      { title: 'GSTIN & PAN Numbers', rule: 'Mandatory display of GSTIN for statutory public works tax deductions (TDS).', importance: 'Tax Compliance' },
      { title: 'Plant & Laboratory Affiliations', rule: 'Include ready-mix plant and heavy machinery base locations.', importance: 'Technical Scoring' }
    ],
    faqs: [
      { question: 'What details are required on a civil contractor letterhead?', answer: 'Contractor Name, Class Registration (PWD/CPWD/MES), GSTIN, MSME Udyam Number, Registered Office Address, Phone, and Email.' },
      { question: 'Is this contractor format valid for government e-procurement tenders?', answer: 'Yes, the layout matches CPWD and State PWD technical bid submission standards.' }
    ],
    relatedSlugs: ['real-estate-dealer', 'shop-letterpad', 'company-letterpad']
  },

  'housing-society': {
    slug: 'housing-society',
    profession: 'Co-operative Housing Society (CHS)',
    title: 'Housing Society Letterhead Format & CHS Office Pad Maker',
    category: 'Public',
    badge: 'Co-op Societies Act',
    targetKeyword: 'housing society letterhead format',
    shortDesc: 'Standard official letterhead format for Co-operative Housing Societies (CHS), Apartment Owners Associations (AOA), and Resident Welfare Associations (RWA).',
    introText: 'Co-operative Housing Societies (CHS) and Resident Welfare Associations (RWA) in India are governed by State Co-operative Societies Acts (such as the Maharashtra Co-operative Societies Act, 1960). Society office-bearers (Chairman, Secretary, Treasurer) must issue legally binding documents on official society stationery, including Maintenance Dues Notices, Society NOCs for property transfer/sale, Parking Allotments, Annual General Meeting (AGM) notices, and representations to municipal corporations. Swalekhani provides verified CHS letterhead templates.',
    theme: {
      primary: 'blue',
      primaryHex: '#2563eb',
      accentHex: '#1d4ed8',
      bgGlow: 'bg-blue-500/10',
      font: 'sans',
      headerLayout: 'classic'
    },
    fields: [
      { id: 'name', label: 'Society Full Legal Name', placeholder: 'e.g. Gokuldham Co-op. Housing Society Ltd.', defaultValue: 'Gokuldham Co-operative Housing Society Ltd.' },
      { id: 'regNo', label: 'Co-op. Registration Number', placeholder: 'e.g. BOM/HSG/TC/1290/2010', defaultValue: 'Regd. No. BOM/HSG/TC/1290/2010 (Dated: 14.06.2010)' },
      { id: 'address', label: 'Society Premises Address', placeholder: 'Plot / Survey No, Sector, City, PIN', defaultValue: 'CTS No. 448/12, Off Link Road, Borivali (West), Mumbai - 400092' },
      { id: 'officeBearers', label: 'Key Office Bearers', placeholder: 'Chairman | Secretary | Treasurer', defaultValue: 'Chairman: Shri A. K. Mehta | Hon. Secretary: Shri R. N. Sharma | Treasurer: Smt. S. P. Joshi' },
      { id: 'email', label: 'Society Official Email', placeholder: 'gokuldham.chs@gmail.com', defaultValue: 'office@gokuldhamchs.in', type: 'email' },
      { id: 'phone', label: 'Society Office Contact', placeholder: '+91 22 2890 4411', defaultValue: '+91 22 2890 4411', type: 'tel' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Society No-Objection Certificate (NOC) for Flat Sale / Mortgage',
        description: 'Official statutory NOC issued to flat owner for bank loan or sale deed.',
        recipient: 'To Whomsoever It May Concern',
        subject: 'NO-OBJECTION CERTIFICATE (NOC) FOR SALE OF FLAT NO. B-402',
        fileNo: 'REF: GCHS/NOC/2026/048',
        body: [
          'This is to certify that Shri Arvind S. Kadam is the registered bonafide member and owner of Flat No. B-402 (Carpet Area: 720 Sq. Ft.) in Gokuldham Co-op Housing Society Ltd., holding Share Certificate No. 84 (Distinctive Nos. 416 to 420).',
          '1. The society has NO OBJECTION to the transfer / sale of the said flat to the prospective purchaser Shri Nilesh V. Patil or mortgage with any scheduled commercial bank.',
          '2. All society maintenance charges, municipal taxes, and sinking fund dues have been cleared up to 31st March 2026 and no outstanding dues are pending against the said flat.'
        ],
        signoff: 'For Gokuldham Co-op Housing Society Ltd.\n\n[Signature]\nHon. Secretary\n\n[Signature]\nChairman'
      },
      {
        title: 'Notice for Annual General Body Meeting (AGM)',
        description: 'Statutory notice and agenda for general body meeting of members.',
        recipient: 'To,\nAll Respected Members,\nGokuldham Co-op Housing Society Ltd.',
        subject: 'NOTICE FOR 16TH ANNUAL GENERAL BODY MEETING (AGM) ON 26.04.2026',
        fileNo: 'REF: GCHS/AGM/2026/02',
        body: [
          'Notice is hereby given that the 16th Annual General Body Meeting of Gokuldham CHS Ltd. will be held on Sunday, 26th April 2026 at 10:30 AM in the Society Clubhouse to transact the following business:',
          '1. To read and confirm the minutes of the previous Annual General Meeting.',
          '2. To receive, consider, and adopt the Audited Statement of Accounts for FY 2025-26.',
          '3. To approve the annual budget and discuss structural building repair proposals.',
          'All members are requested to attend promptly.'
        ],
        signoff: 'By Order of the Managing Committee,\n\n[Signature]\nHon. Secretary'
      }
    ],
    formatGuide: [
      { title: 'Full Registered Society Name & Registration Date', rule: 'Must state complete legal name with "Co-operative Housing Society Ltd." suffix.', importance: 'Statutory Identity' },
      { title: 'Dual Signatures of Office Bearers', rule: 'Leave space for both Chairman and Hon. Secretary signatures and round society seal.', importance: 'Legal Validity' },
      { title: 'CTS / Plot Survey Reference', rule: 'Include revenue plot and survey numbers in the address block.', importance: 'Municipal Records' }
    ],
    faqs: [
      { question: 'Why is an official letterhead mandatory for housing society NOCs?', answer: 'Banks, sub-registrar offices, and municipal corporations require society NOCs and share transfers to be printed on registered society letterheads bearing the signature of authorized office-bearers.' },
      { question: 'Can housing societies issue maintenance receipts using this format?', answer: 'Yes, the format is designed for notices, NOCs, receipts, and AGM communications.' }
    ],
    relatedSlugs: ['ngo-trust', 'gram-panchayat', 'real-estate-dealer']
  },

  'political-leader': {
    slug: 'political-leader',
    profession: 'Public Representative',
    title: 'Public Representative Letterhead Format | Lokpratinidhi Pad Maker',
    category: 'Public',
    badge: 'Constituency Standard',
    targetKeyword: 'public representative letterhead format',
    shortDesc: 'Official letterhead format for Public Representatives, Ward Corporators, Zilla Parishad Members, and Community Leaders with bilingual Devanagari typography.',
    introText: 'Elected public representatives, municipal corporators, panchayat samiti members, and community leaders utilize official letterheads for submitting public grievance petitions, recommendation letters for citizens, development scheme requests, and developmental fund sanctions. Swalekhani provides a strictly neutral, generic "Public Representative / लोकप्रतिनिधी" format that supports English, Hindi (हिंदी), and Marathi (मराठी) bilingual headers, customizable color accents, and dedicated constituency and ward fields without any political party names or symbols.',
    theme: {
      primary: 'orange',
      primaryHex: '#ea580c',
      accentHex: '#c2410c',
      bgGlow: 'bg-orange-500/10',
      font: 'sans',
      headerLayout: 'modern'
    },
    fields: [
      { id: 'name', label: 'Representative Name', placeholder: 'e.g. Shri Amit V. Deshmukh', defaultValue: 'Shri Amit V. Deshmukh' },
      { id: 'designation', label: 'Elected Designation', placeholder: 'e.g. Public Representative / Member of Municipal Council', defaultValue: 'Public Representative / Member, Municipal Council' },
      { id: 'constituency', label: 'Constituency / Ward Name', placeholder: 'e.g. Ward No. 14, Central Assembly Constituency', defaultValue: 'Ward No. 14, Shivajinagar Constituency' },
      { id: 'officeAddress', label: 'Public Liaison Office (जनसंपर्क कार्यालय)', placeholder: 'Office Address, City, PIN', defaultValue: 'Public Liaison Office (जनसंपर्क कार्यालय), Near Shivaji Statue, Station Road, Pune - 411004' },
      { id: 'phone', label: 'Helpline / Contact Number', placeholder: '+91 98220 99887', defaultValue: '+91 98220 99887', type: 'tel' },
      { id: 'email', label: 'Official Correspondence Email', placeholder: 'amit.deshmukh@publicoffice.in', defaultValue: 'office.amitdeshmukh@gmail.com', type: 'email' }
    ],
    languages: ['en', 'hi', 'mr'],
    bilingualDefaults: {
      hi: {
        header1: 'जनप्रतिनिधि कार्यालय',
        header2: 'वार्ड क्र. 14, शिवाजीनगर विधानसभा क्षेत्र',
        dept: 'जनसंपर्क एवं लोकसेवा विभाग',
        designation: 'सदस्य, नगर परिषद'
      },
      mr: {
        header1: 'लोकप्रतिनिधी कार्यालय',
        header2: 'प्रभाग क्र. १४, शिवाजीनगर विधानसभा मतदारसंघ',
        dept: 'जनसंपर्क व नागरी विकास विभाग',
        designation: 'नगरसेवक / लोकप्रतिनिधी'
      }
    },
    sampleLetters: [
      {
        title: 'Representation for Drinking Water Pipeline Upgradation',
        description: 'Formal representation addressed to Municipal Commissioner for civic works.',
        recipient: 'The Hon’ble Municipal Commissioner,\nPune Municipal Corporation,\nShivajinagar, Pune - 411005.',
        subject: 'URGENT REPRESENTATION FOR UPGRADATION OF DRINKING WATER PIPELINE IN WARD NO. 14',
        fileNo: 'REF: PLO/CIVIC/2026/194',
        body: [
          'Respected Sir, I draw your immediate attention to the acute drinking water shortage faced by over 8,000 residents of Anand Nagar and Shanti Colony in Ward No. 14 over the past two months due to low pressure in the existing 100mm supply line.',
          '1. In view of the rising population, an immediate replacement of the old pipeline with a 250mm ductile iron pipeline is urgently necessitated.',
          '2. I request your good office to sanction the technical estimate and release administrative approval under the Urban Infrastructure Development Head on priority.'
        ],
        signoff: 'With regards,\n\n[Signature]\nShri Amit V. Deshmukh\nPublic Representative / Corporator'
      },
      {
        title: 'Citizen Character & Recommendation Certificate',
        description: 'Letter of recommendation for deserving students or medical assistance.',
        recipient: 'To Whomsoever It May Concern',
        subject: 'RECOMMENDATION LETTER FOR FINANCIAL AID UNDER CHIEF MINISTER MEDICAL RELIEF FUND',
        fileNo: 'REF: PLO/REC/2026/088',
        body: [
          'I have known Shri Santosh M. Gaikwad, resident of Ward No. 14, Pune, for over 10 years. He is a law-abiding citizen belonging to an economically weaker family.',
          'His son Master Prathamesh Gaikwad is currently undergoing specialized pediatric cardiac surgery at Deenanath Mangeshkar Hospital. The family requires urgent financial support.',
          'I strongly recommend his application for financial assistance under the Chief Minister Medical Relief Fund.'
        ],
        signoff: 'Yours faithfully,\n\n[Signature & Seal]\nPublic Representative'
      }
    ],
    formatGuide: [
      { title: 'Neutral Non-Party Presentation', rule: 'Must not display any political party logos, party flags, or commercial slogans.', importance: 'Civic Decorum' },
      { title: 'Bilingual Header Support', rule: 'Features Devanagari Hindi/Marathi alongside English for regional administrative ease.', importance: 'Regional Compliance' },
      { title: 'Public Liaison Office (जनसंपर्क कार्यालय) Address', rule: 'Clearly state constituency contact office for direct citizen grievance drop-ins.', importance: 'Public Access' }
    ],
    faqs: [
      { question: 'Does this template contain political party logos?', answer: 'No. The Swalekhani public representative format is 100% generic, professional, and compliant with administrative guidelines without party flags, names, or symbols.' },
      { question: 'Can I generate letters in Hindi or Marathi on this letterpad?', answer: 'Yes, Swalekhani natively supports bilingual English-Hindi and English-Marathi Devanagari typography.' }
    ],
    relatedSlugs: ['gram-panchayat', 'government-letterpad', 'housing-society']
  },

  'gram-panchayat': {
    slug: 'gram-panchayat',
    profession: 'Gram Panchayat & Village Administration',
    title: 'Gram Panchayat Letterhead Format & Sarpanch Pad Maker',
    category: 'Public',
    badge: 'Panchayati Raj Standard',
    targetKeyword: 'gram panchayat letterhead format',
    shortDesc: 'Authentic tricolor letterhead format for Gram Panchayat Offices, Sarpanch, Gram Sevak, and Village Administrative Councils with bilingual Devanagari headers.',
    introText: 'Gram Panchayats are constitutional local self-governing bodies established under the 73rd Amendment of the Constitution of India. Village administrative letters—such as Residence Certificates (रहिवासी दाखला), Birth & Death Intimations, Gram Sabha Resolutions (ग्रामसभा ठराव), NOC for rural electricity/construction, and BPL verifications—must be issued on the official letterhead of the Gram Panchayat bearing the joint authority of the Sarpanch and Gram Sevak / Panchayat Secretary. Swalekhani’s Gram Panchayat template features a distinguished Indian tricolor top accent ribbon and full Devanagari bilingual layouts.',
    theme: {
      primary: 'amber',
      primaryHex: '#d97706',
      accentHex: '#b45309',
      bgGlow: 'bg-amber-500/10',
      font: 'sans',
      headerLayout: 'tricolor'
    },
    fields: [
      { id: 'name', label: 'Gram Panchayat Name (English)', placeholder: 'e.g. Office of Gram Panchayat Shindewadi', defaultValue: 'Office of Gram Panchayat Shindewadi' },
      { id: 'devanagariHeader', label: 'Gram Panchayat Name (मराठी / हिंदी)', placeholder: 'ग्रामपंचायत कार्यालय शिंदेवाडी', defaultValue: 'ग्रामपंचायत कार्यालय शिंदेवाडी' },
      { id: 'panchayatSamiti', label: 'Taluka & District Details', placeholder: 'Tal. Haveli, Dist. Pune (महाराष्ट्र)', defaultValue: 'पं. स. हवेली, जि. पुणे (महाराष्ट्र शासन)' },
      { id: 'sarpanchName', label: 'Sarpanch / Upsarpanch Name', placeholder: 'सरपंच: सौ. सुनिता आर. शिंदे', defaultValue: 'सरपंच: सौ. सुनिता आर. शिंदे | उपसरपंच: श्री. विकास के. पवार' },
      { id: 'gramSevak', label: 'Gram Sevak / Secretary Name', placeholder: 'ग्रामसेवक: श्री. एस. एम. कुलकर्णी', defaultValue: 'ग्रामसेवक / सचिव: श्री. एस. एम. कुलकर्णी' },
      { id: 'address', label: 'Panchayat Office Address', placeholder: 'Gram Panchayat Bhavan, Post, Taluka, Dist, PIN', defaultValue: 'मु. पो. शिंदेवाडी, ता. हवेली, जि. पुणे - ४१२२०५' },
      { id: 'phone', label: 'Office Contact Number', placeholder: '+91 20 2744 1100', defaultValue: '+91 20 2744 1100', type: 'tel' }
    ],
    languages: ['mr', 'hi', 'en'],
    bilingualDefaults: {
      mr: {
        header1: 'ग्रामपंचायत कार्यालय शिंदेवाडी',
        header2: 'पंचायत समिती हवेली, जिल्हा परिषद पुणे',
        dept: 'ग्रामविकास व जलसंधारण विभाग',
        designation: 'सरपंच / ग्रामविकास अधिकारी'
      },
      hi: {
        header1: 'ग्राम पंचायत कार्यालय शिंदेवाडी',
        header2: 'पंचायत समिति हवेली, जिला परिषद पुणे',
        dept: 'ग्रामीण विकास विभाग',
        designation: 'सरपंच / ग्राम सचिव'
      }
    },
    sampleLetters: [
      {
        title: 'Residence & Character Certificate (रहिवासी दाखला)',
        description: 'Official village residency certificate required for government schemes and admissions.',
        recipient: 'दाखला देण्यात येतो की (To Whomsoever It May Concern)',
        subject: 'रहिवासी व चारित्र्य प्रमाणपत्र (RESIDENCE CERTIFICATE)',
        fileNo: 'जावक क्र: ग्रा.पं.शिं/प्रमाणपत्र/२०२६/१४२',
        body: [
          'दाखला देण्यात येतो की, श्री. सचिन संभाजी सावंत, वय ३२ वर्षे, हे मु. पो. शिंदेवाडी, ता. हवेली, जि. पुणे येथील कायमचे रहिवासी आहेत.',
          '१. ते सदर गावामध्ये मागील १५ वर्षांपासून आपल्या कुटुंबासह वास्तव्यास असून ग्रामपंचायत दप्तरी त्यांची नोंद आहे.',
          '२. त्यांची गावात कोणतीही गुन्हेगारी नोंद नसून त्यांचे चारित्र्य उत्तम आहे.',
          'हा दाखला त्यांच्या वैयक्तिक कामकाजास्तव व सरकारी योजनेच्या अर्जाकरिता देण्यात येत आहे.'
        ],
        signoff: 'ठिकाण: शिंदेवाडी\nदिनांक: २४/०२/२०२६\n\n[स्वाक्षरी व शिक्का]\nग्रामसेवक / सचिव\nग्रामपंचायत शिंदेवाडी\n\n[स्वाक्षरी व शिक्का]\nसरपंच\nग्रामपंचायत शिंदेवाडी'
      },
      {
        title: 'Gram Sabha Resolution Intimation (ग्रामसभा ठराव)',
        description: 'Official extract of resolution passed during monthly Gram Sabha.',
        recipient: 'प्रति,\nमा. गटविकास अधिकारी (BDO) साहेब,\nपंचायत समिती हवेली, जि. पुणे.',
        subject: 'ग्रामसभेत मंजूर करण्यात आलेल्या ठरावाची सत्यप्रत सादर करणेबाबत..',
        fileNo: 'जावक क्र: ग्रा.पं.शिं/ग्रामसभा/२०२६/८८',
        body: [
          'महोदय, मौजे शिंदेवाडी येथे दिनांक २६ जानेवारी २०२६ रोजी प्रजासत्ताक दिनानिमित्त आयोजित करण्यात आलेल्या विशेष ग्रामसभेत खालीलप्रमाणे ठराव सर्वानुमते मंजूर करण्यात आला आहे:',
          'ठराव क्र. ०४: गावातील अंतर्गत सिमेंट काँक्रीट रस्ते व सौर पथदिवे बसविण्याच्या विकास आराखड्यास सर्व ग्रामस्थांच्या उपस्थितीत एकमुखाने मंजुरी देण्यात आली.',
          'कृपया सदर ठराव पुढील प्रशासकीय मान्यतेसाठी स्वीकारण्यात यावा ही नम्र विनंती.'
        ],
        signoff: 'आपले नम्र,\n\n[स्वाक्षरी]\nसरपंच / ग्रामसेवक\nग्रामपंचायत शिंदेवाडी'
      }
    ],
    formatGuide: [
      { title: 'Tricolor Top Border Accent', rule: 'Features saffron, white, and green ribbon reflecting Indian local governance.', importance: 'National Identity' },
      { title: 'Bilingual Devanagari Typography', rule: 'Must present Gram Panchayat name prominently in Marathi or Hindi alongside English.', importance: 'State Language Compliance' },
      { title: 'Joint Signatures of Sarpanch & Gram Sevak', rule: 'Provide distinct blocks for Sarpanch and Gram Sevak signatures and official round seal.', importance: 'Panchayati Raj Act' }
    ],
    faqs: [
      { question: 'What certificates are issued on a Gram Panchayat letterhead?', answer: 'Gram Panchayats issue Residence Certificates (रहिवासी दाखला), No-Dues Certificates, Gram Sabha Resolutions, Birth/Death Intimations, and Water Connection NOCs.' },
      { question: 'Does this template feature the Indian tricolor accent?', answer: 'Yes, this template includes a distinguished saffron-white-green border accent and bilingual headers tailored for village governance.' }
    ],
    relatedSlugs: ['political-leader', 'government-letterpad', 'housing-society']
  },

  'freelancer': {
    slug: 'freelancer',
    profession: 'Freelancer & Digital Consultant',
    title: 'Freelancer Letterhead Format & Independent Consultant Pad Maker',
    category: 'Business',
    badge: 'Modern Executive',
    targetKeyword: 'freelancer letterhead format',
    shortDesc: 'Sleek, minimalist letterhead format for Freelancers, Software Engineers, UI/UX Designers, Digital Marketers, and Independent Consultants.',
    introText: 'Independent consultants, freelance software developers, creative designers, copywriters, and digital strategists require modern, polished stationery for sending client proposals, statements of work (SOW), project milestones, service quotes, and formal invoices. A minimalist, typography-focused freelancer letterhead establishes executive credibility with international and domestic clients. Swalekhani offers modern dark and light freelancer presets with custom branding.',
    theme: {
      primary: 'violet',
      primaryHex: '#7c3aed',
      accentHex: '#6d28d9',
      bgGlow: 'bg-violet-500/10',
      font: 'sans',
      headerLayout: 'minimal'
    },
    fields: [
      { id: 'name', label: 'Your Full Name / Brand', placeholder: 'e.g. Neil Sharma', defaultValue: 'Neil Sharma' },
      { id: 'subTitle', label: 'Professional Title', placeholder: 'Full Stack Engineer & Cloud Architect', defaultValue: 'Senior Full Stack Engineer & Cloud Consultant' },
      { id: 'panGst', label: 'PAN / GST / MSME ID (Optional)', placeholder: 'e.g. PAN: ABCDE1234F', defaultValue: 'PAN: ABCDE1234F | Udyam-MH-26-009182' },
      { id: 'portfolio', label: 'Portfolio / GitHub / LinkedIn', placeholder: 'neilsharma.dev', defaultValue: 'https://neilsharma.dev | github.com/neilsharma' },
      { id: 'location', label: 'Location / City, Country', placeholder: 'Bengaluru, India (Remote Available)', defaultValue: 'Bengaluru, Karnataka, India - 560102' },
      { id: 'phone', label: 'Direct Phone / WhatsApp', placeholder: '+91 98450 11223', defaultValue: '+91 98450 11223', type: 'tel' },
      { id: 'email', label: 'Client Inquiries Email', placeholder: 'hello@neilsharma.dev', defaultValue: 'consulting@neilsharma.dev', type: 'email' }
    ],
    languages: ['en'],
    sampleLetters: [
      {
        title: 'Client Project Proposal & Scope of Work (SOW)',
        description: 'Comprehensive project quotation and sprint milestone breakdown.',
        recipient: 'To,\nThe Chief Technology Officer (CTO),\nM/s FinTech Nova Inc., San Francisco, CA / Bengaluru.',
        subject: 'PROJECT PROPOSAL: NEXT.JS & NODE.JS CLOUD ARCHITECTURE UPGRADE',
        fileNo: 'REF: NS/PROP/2026/014',
        body: [
          'Thank you for the opportunity to present this technical architecture proposal for upgrading your web platform to Next.js 16 (App Router) and Serverless microservices.',
          '1. Scope of Deliverables: Migration of core checkout funnels, sub-50ms latency optimization, and automated CI/CD deployment pipelines.',
          '2. Project Timeline: 6 Weeks structured in three bi-weekly sprints.',
          '3. Professional Fee: Flat fixed fee of ₹2,80,000/- ($3,400 USD) payable 40% upfront and 30% per milestone.',
          'Looking forward to engineering high-performance software for FinTech Nova.'
        ],
        signoff: 'Best regards,\n\n[Digital Signature]\nNeil Sharma\nCloud & Full Stack Architect'
      },
      {
        title: 'Project Completion & Intellectual Property (IP) Transfer',
        description: 'Formal signoff confirming deliverable handover and full copyright release.',
        recipient: 'To,\nMr. David Miller,\nFounder & CEO, ScaleUp Media LLC.',
        subject: 'FINAL PROJECT HANDOVER & IP RELEASE CERTIFICATION',
        fileNo: 'REF: NS/IP/2026/08',
        body: [
          'This certifies that all deliverables under Contract #2025-SM-092 for the development of the ScaleUp Analytics Dashboard have been completed, code reviewed, and deployed to production.',
          '1. Full source code repository access and documentation have been transferred.',
          '2. Upon settlement of the final milestone invoice, all intellectual property rights and code ownership stand irrevocably transferred to ScaleUp Media LLC.'
        ],
        signoff: 'Sincerely,\n\n[Signature]\nNeil Sharma'
      }
    ],
    formatGuide: [
      { title: 'Minimalist Modern Typography', rule: 'Clean geometric typography gives a contemporary tech-consultant look.', importance: 'Design Standard' },
      { title: 'Portfolio & GitHub Presence', rule: 'Include verified links to online portfolio, LinkedIn, and open-source contributions.', importance: 'Client Credibility' },
      { title: 'Tax & Invoicing Identifiers', rule: 'Include PAN and MSME registration for domestic and international wire settlements.', importance: 'Invoicing Compliance' }
    ],
    faqs: [
      { question: 'Why do freelancers need an official letterhead?', answer: 'A branded letterhead elevates proposals, contracts, NDA signoffs, and statements of work (SOW) above casual emails, winning higher-ticket enterprise clients.' },
      { question: 'Can freelancers use this format for commercial invoices?', answer: 'Yes, the layout accommodates invoice numbers, bank account details, and UPI IDs in the footer.' }
    ],
    relatedSlugs: ['advocate', 'ca-accountant', 'company-letterpad']
  }
};

export const ALL_PROFESSION_SLUGS = Object.keys(PROFESSION_TEMPLATES);

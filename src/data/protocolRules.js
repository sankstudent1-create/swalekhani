/**
 * Official Indian Government Correspondence Protocols and Legal Regulations
 * Based on:
 * 1. The State Emblem of India (Prohibition of Improper Use) Act, 2005
 * 2. The State Emblem of India (Regulation of Use) Rules, 2007 (Amended 2010)
 * 3. Central Secretariat Manual of Office Procedure (CSMOP - 16th Edition, DARPG)
 * 4. Actual Government Specimens:
 *    - Dept of Posts (Official Letter & D.O. Letter)
 *    - Cabinet Secretariat ACC (Executive Orders)
 *    - Railway Board (Most Immediate Reminder-1)
 *    - District Collectorate (Show Cause Notice - Whereas/Therefore)
 *    - Staff Selection Commission (Important Notice)
 *    - Dept of Personnel & SCERT (Circular & Office Order)
 */

export const AUTHORITY_TYPES = {
  CONSTITUTIONAL_MINISTER: {
    id: 'CONSTITUTIONAL_MINISTER',
    name: {
      mr: 'घटनात्मक पद / मंत्री (केंद्रीय / राज्य)',
      hi: 'संवैधानिक पद / मंत्री (केंद्रीय / राज्य)',
      en: 'Constitutional Authority / Minister (Union / State)'
    },
    description: {
      mr: 'राष्ट्रपती, पंतप्रधान, राज्यपाल, मुख्यमंत्री, केंद्रीय/राज्य मंत्री, सर्वोच्च/उच्च न्यायालय न्यायाधीश',
      hi: 'राष्ट्रपति, प्रधानमंत्री, राज्यपाल, मुख्यमंत्री, केंद्रीय/राज्य मंत्री, मुख्य न्यायाधीश',
      en: 'President, PM, Governor, CM, Union/State Ministers, Chief Justice & Judges'
    },
    allowedEmblems: ['ASHOKA_EMBLEM', 'STATE_SEAL', 'CUSTOM'],
    defaultEmblem: 'ASHOKA_EMBLEM',
    isGovAuthorized: true,
    legalNote: 'Authorized under Schedule I of State Emblem of India Rules, 2007 for official stationery.'
  },
  GOV_SECRETARIAT: {
    id: 'GOV_SECRETARIAT',
    name: {
      mr: 'सचिवालय / मंत्रालय (सचिव / सहसचिव दर्जा)',
      hi: 'सचिवालय / मंत्रालय (सचिव / संयुक्त सचिव स्तर)',
      en: 'Secretariat / Ministry (Secretary / Joint Secy & above)'
    },
    description: {
      mr: 'केंद्रीय सहसचिव व वरील / राज्य शासन सचिव, प्रधान सचिव, मुख्य सचिव दर्जाचे अधिकारी',
      hi: 'केंद्रीय संयुक्त सचिव व ऊपर / राज्य सचिव, मुख्य सचिव स्तर के अधिकारी',
      en: 'Officers of the rank of Joint Secretary & above (Centre) or Secretary & above (State)'
    },
    allowedEmblems: ['ASHOKA_EMBLEM', 'STATE_SEAL', 'BHARAT_SARKAR'],
    defaultEmblem: 'ASHOKA_EMBLEM',
    isGovAuthorized: true,
    legalNote: 'Authorized for D.O. letters and official stationery under Schedule II of Emblem Rules, 2007.'
  },
  GOV_FIELD_OFFICE: {
    id: 'GOV_FIELD_OFFICE',
    name: {
      mr: 'जिल्हा प्रशासन / विभाग (जिल्हाधिकारी, जि.प., मनपा)',
      hi: 'जिला प्रशासन / अधीनस्थ कार्यालय (कलेक्टर, जि.प., निगम)',
      en: 'District Administration / Field Office (Collectorate, ZP, MC)'
    },
    description: {
      mr: 'जिल्हाधिकारी, तहसीलदार, गटविकास अधिकारी, महानगरपालिका आयुक्त, पोलीस अधीक्षक कार्यालय',
      hi: 'जिलाधिकारी, तहसीलदार, बीडीओ, नगर निगम आयुक्त, पुलिस अधीक्षक कार्यालय',
      en: 'District Collector, Tahsildar, Municipal Commissioner, SP, Regional Directors'
    },
    allowedEmblems: ['STATE_SEAL', 'BHARAT_SARKAR', 'CUSTOM'],
    defaultEmblem: 'STATE_SEAL',
    isGovAuthorized: true,
    legalNote: 'Must use designated State Seal / Departmental crest on office stationery rather than personal Ashoka letterhead.'
  },
  ELECTED_REPRESENTATIVE: {
    id: 'ELECTED_REPRESENTATIVE',
    name: {
      mr: 'लोकप्रतिनिधी (खासदार / आमदार / नगरसेवक)',
      hi: 'जनप्रतिनिधि (सांसद / विधायक / पार्षद)',
      en: 'Elected Representative (MP / MLA / Corporator)'
    },
    description: {
      mr: 'लोकसभा/राज्यसभा खासदार, विधानसभा/विधानपरिषद आमदार, महापौर, नगरसेवक',
      hi: 'सांसद, विधायक, विधान परिषद सदस्य, महापौर, पार्षद',
      en: 'Members of Parliament, Legislative Assembly/Council, Mayors, Corporators'
    },
    allowedEmblems: ['VIDHAN_MANDAL', 'STATE_SEAL', 'CUSTOM'],
    defaultEmblem: 'VIDHAN_MANDAL',
    isGovAuthorized: true,
    legalNote: 'Authorized to use official Legislature/Parliamentary insignia for constituency business. National emblem on private business is strictly prohibited.'
  },
  PRIVATE_CITIZEN_NGO: {
    id: 'PRIVATE_CITIZEN_NGO',
    name: {
      mr: 'नागरिक / खाजगी संस्था / शाळा / NGO',
      hi: 'नागरिक / निजी संस्था / स्कूल / एनजीओ',
      en: 'Citizen / Private Org / School / NGO'
    },
    description: {
      mr: 'सामान्य नागरिक, खाजगी कंपन्या, शाळा/महाविद्यालये, वकील, सामाजिक संस्था',
      hi: 'नागरिक, निजी कंपनियां, विद्यालय/कॉलेज, अधिवक्ता, स्वयंसेवी संस्थाएं',
      en: 'Citizens, private firms, educational institutions, advocates, trusts'
    },
    allowedEmblems: ['CUSTOM', 'NONE'],
    defaultEmblem: 'CUSTOM',
    isGovAuthorized: false,
    legalNote: 'Prohibited from using the State Emblem of India under Section 3 & 7 of the Act, 2005. Misuse attracts imprisonment up to 2 years.'
  }
};

export const EMBLEMS_CONFIG = {
  ASHOKA_EMBLEM: {
    id: 'ASHOKA_EMBLEM',
    title: {
      mr: 'भारताचे राष्ट्रीय चिन्ह (अशोक स्तंभ)',
      hi: 'भारत का राष्ट्रीय प्रतीक (अशोक स्तम्भ)',
      en: 'State Emblem of India (Lion Capital)'
    },
    mottoRequired: true,
    mottoText: 'सत्यमेव जयते',
    legalRestriction: 'Allowed only for authorized Constitutional bodies, Ministers, & designated Secretaries (Act 2005).'
  },
  STATE_SEAL: {
    id: 'STATE_SEAL',
    title: {
      mr: 'महाराष्ट्र शासन राजमुद्रा',
      hi: 'महाराष्ट्र शासन राजमुद्रा (राज्य मुहर)',
      en: 'Maharashtra State Official Seal'
    },
    mottoRequired: true,
    mottoText: 'प्रतिपच्चंद्रलेखेव वर्धिष्णुर्विश्ववंदिता महाराष्ट्रस्य राज्यस्य मुद्रा भद्राय राजते',
    legalRestriction: 'Used for Government of Maharashtra departments, collectorates, and official publications.'
  },
  BHARAT_SARKAR: {
    id: 'BHARAT_SARKAR',
    title: {
      mr: 'भारत सरकार अधिकृत मुद्रा',
      hi: 'भारत सरकार आधिकारिक मुहर',
      en: 'Government of India Standard Seal'
    },
    mottoRequired: true,
    mottoText: 'सत्यमेव जयते',
    legalRestriction: 'Used for Central Government offices and public notices.'
  },
  VIDHAN_MANDAL: {
    id: 'VIDHAN_MANDAL',
    title: {
      mr: 'विधिमंडळ / संसद बोधचिन्ह',
      hi: 'विधानमंडल / संसद प्रतीक',
      en: 'Legislature / Parliamentary Crest'
    },
    mottoRequired: false,
    mottoText: '',
    legalRestriction: 'For legislative business of MPs and MLAs.'
  },
  CUSTOM: {
    id: 'CUSTOM',
    title: {
      mr: 'स्वतःचा लोगो / संस्था चिन्ह',
      hi: 'कस्टम लोगो / संस्था प्रतीक',
      en: 'Custom Logo / School / Org Seal'
    },
    mottoRequired: false,
    mottoText: '',
    legalRestriction: 'Permitted for all citizens, private companies, schools, and organizations.'
  },
  NONE: {
    id: 'NONE',
    title: {
      mr: 'चिन्ह नाही (फक्त शीर्षक)',
      hi: 'कोई प्रतीक नहीं (केवल शीर्षक)',
      en: 'No Emblem (Header Only)'
    },
    mottoRequired: false,
    mottoText: '',
    legalRestriction: 'Universal'
  }
};

/**
 * Protocol Auditor - Checks the active document for compliance with legal regulations & CSMOP standards
 */
export function auditDocument(docState) {
  const issues = [];
  const {
    authorityType,
    emblemType,
    outwardNo,
    letterDate,
    subject,
    templateType,
    paragraphs = [],
    salutation = '',
    subscription = '',
    signatoryName = '',
    copiesTo = ''
  } = docState;

  const authority = AUTHORITY_TYPES[authorityType] || AUTHORITY_TYPES.PRIVATE_CITIZEN_NGO;

  // 1. Legal Emblem Act 2005 Check
  if (emblemType === 'ASHOKA_EMBLEM') {
    if (!authority.isGovAuthorized || (authorityType !== 'CONSTITUTIONAL_MINISTER' && authorityType !== 'GOV_SECRETARIAT')) {
      issues.push({
        severity: 'CRITICAL',
        code: 'EMBLEM_ACT_VIOLATION',
        title: 'अशोक स्तंभ वापर नियम उल्लंघन (Emblem Act 2005 Violation)',
        message: 'भारतीय राज्यचिन्ह (अशोक स्तंभ) चा वापर खाजगी नागरिक, संस्था किंवा कनिष्ठ कार्यालयांसाठी बेकायदेशीर आहे. यामुळे २ वर्षांचा तुरुंगवास किंवा दंडाची तरतूद आहे (कलम ७).'
      });
    }
  }

  // 2. Outward Reference Number Check
  if (authority.isGovAuthorized && (!outwardNo || outwardNo.trim().length === 0)) {
    issues.push({
      severity: 'WARNING',
      code: 'MISSING_OUTWARD_NO',
      title: 'जावक क्रमांक आवश्यक (Missing Outward/File Ref No)',
      message: 'शासकीय पत्रव्यवहारात नोंदणीसाठी "जावक क्र." किंवा "File Ref No." असणे अनिवार्य आहे (CSMOP Para 56).'
    });
  }

  // 3. Date Check
  if (!letterDate || letterDate.trim().length === 0) {
    issues.push({
      severity: 'WARNING',
      code: 'MISSING_DATE',
      title: 'पत्रावर दिनांक आवश्यक (Date Missing)',
      message: 'कायदेशीर वैधतेसाठी पत्रावर दिनांक असणे अनिवार्य आहे.'
    });
  }

  // 4. Order / Memo / Notice Protocol Checks (CSMOP)
  if (['ACC_ORDER', 'OFFICE_MEMO', 'STATE_ORDER', 'CIRCULAR', 'IMPORTANT_NOTICE', 'SHOW_CAUSE_NOTICE'].includes(templateType)) {
    if (salutation && salutation.trim().length > 0) {
      issues.push({
        severity: 'INFO',
        code: 'ORDER_NO_SALUTATION',
        title: 'आदेश, नोटीस व ज्ञापनात महोदय/संबोधन नसते (No Salutation)',
        message: 'CSMOP मानकांनुसार कार्यालयीन आदेश, सूचना, परिपत्रक व कारणे दाखवा नोटीसमध्ये "महोदय" किंवा "Sir" संबोधन वापरले जात नाही.'
      });
    }
    if (subscription && subscription.trim().length > 0 && templateType !== 'SHOW_CAUSE_NOTICE') {
      issues.push({
        severity: 'INFO',
        code: 'ORDER_NO_SUBSCRIPTION',
        title: 'आदेश/ज्ञापनात "आपला नम्र" नसते (No Complimentary Close)',
        message: 'आदेश, परिपत्रक व ज्ञापनात "Yours faithfully" किंवा "आपला नम्र" नसते, केवळ स्वाक्षरी, नाव व पदनाम असते.'
      });
    }
  }

  // 5. Show Cause Notice Statutory Check
  if (templateType === 'SHOW_CAUSE_NOTICE') {
    const textCombined = paragraphs.join(' ');
    if (!textCombined.includes('Whereas') && !textCombined.includes('ज्याअर्थी')) {
      issues.push({
        severity: 'WARNING',
        code: 'SHOW_CAUSE_WHEREAS_MISSING',
        title: 'कारणे दाखवा नोटीसमध्ये "Whereas / ज्याअर्थी" आवश्यक',
        message: 'कारणे दाखवा नोटीस ही वैधानिक (statutory) स्वरूपाची असल्याने तिची रचना "Whereas..." (ज्याअर्थी...) व "Therefore..." (त्याअर्थी...) या स्वरूपात असणे आवश्यक आहे.'
      });
    }
  }

  // 6. Reminder Letter Check
  if (templateType === 'REMINDER_LETTER') {
    const textCombined = paragraphs.join(' ');
    if (!textCombined.toLowerCase().includes('awaited') && !textCombined.includes('प्रतीक्षेत') && !textCombined.includes('प्रलंबित')) {
      issues.push({
        severity: 'INFO',
        code: 'REMINDER_FORMULA_SUGGESTION',
        title: 'स्मरणपत्रात प्रलंबिततेचा उल्लेख आवश्यक',
        message: 'स्मरणपत्रात "... माहिती अद्याप या कार्यालयास प्राप्त झालेली नसून ती प्रतीक्षेत आहे (information is still awaited)" असा स्पष्ट उल्लेख असणे अपेक्षित आहे.'
      });
    }
  }

  // 7. Signatory Details
  if (!signatoryName || signatoryName.trim().length === 0) {
    issues.push({
      severity: 'INFO',
      code: 'MISSING_SIGNATORY',
      title: 'स्वाक्षरीकर्त्याचे नाव आवश्यक',
      message: 'पत्राच्या शेवटी स्वाक्षरी करणाऱ्या व्यक्तीचे पूर्ण नाव कंसात (in brackets) व पदनाम असणे शिष्टाचार मानला जातो.'
    });
  }

  return {
    isCompliant: issues.filter(i => i.severity === 'CRITICAL').length === 0,
    issues
  };
}

/**
 * Common official administrative terminology dictionary (प्रशासकीय शब्दसंग्रह)
 */
export const ADMINISTRATIVE_VOCABULARY = [
  {
    category: 'सुरवात / Opening Formulas (CSMOP)',
    terms: [
      { mr: 'उपरोक्त विषयान्वये सविनय कळविण्यात येते की...', en: 'I am directed to refer to this Department\'s letter of even number dated...', hi: 'उपर्युक्त विषयान्तर्गत मुझे यह सूचित करने का निर्देश हुआ है कि...' },
      { mr: 'अधोस्वाक्षरीकारास हे कळविण्याचे निर्देश झाले आहेत की... (O.M.)', en: 'The undersigned is directed to say that... (Office Memorandum)', hi: 'अधोहस्ताक्षरी को यह सूचित करने का निर्देश हुआ है कि...' },
      { mr: 'कृपया उपरोक्त संदर्भातील पत्राचे अवलोकन व्हावे. सदर माहिती अद्याप प्रतीक्षेत आहे... (Reminder)', en: 'Please refer to above subjected letter of even no. dated... The information called for therein is still awaited.', hi: 'कृपया उपर्युक्त संदर्भित पत्र का अवलोकन करें। वांछित सूचना अभी भी प्रतीक्षारत है।' },
      { mr: 'ज्याअर्थी, अधोस्वाक्षरीकारांनी आदेश निर्गमित केले होते... (Show Cause)', en: 'Whereas the undersigned had issued Orders vide Order No. ... dated ... regarding ...', hi: 'चूंकि, अधोहस्ताक्षरी द्वारा आदेश संख्या ... दिनांक ... जारी किया गया था...' }
    ]
  },
  {
    category: 'संदर्भ व वैधानिक आदेश / Statutory Directives',
    terms: [
      { mr: 'हे सक्षम प्राधिकाऱ्यांच्या मान्यतेने निर्गमित करण्यात येत आहे.', en: 'This issues with the approval of the Competent Authority.', hi: 'यह सक्षम प्राधिकारी के अनुमोदन से जारी किया जाता है।' },
      { mr: 'त्याअर्थी, आपणास याद्वारे कारणे दाखविण्याचे निर्देश देण्यात येत आहेत की...', en: 'Therefore, you are hereby directed to show cause in detail as to why action should not be initiated...', hi: 'अतः आपको एतद्द्वारा कारण बताओ निर्देश दिया जाता है कि क्यों न आपके विरुद्ध कार्रवाई की जाए...' },
      { mr: 'सदर माहिती विहित मुदतीत सादर करण्यात यावी ही विनंती.', en: 'It is requested that the same may please be sent to the undersigned expeditiously.', hi: 'अनुरोध है कि उक्त सूचना अविलंब प्रेषित करने का कष्ट करें।' }
    ]
  },
  {
    category: 'पृष्ठांकन व वितरण / Endorsement & Copies',
    terms: [
      { mr: 'प्रतिलिपि माहितीसाठी व योग्य त्या कार्यवाहीसाठी अग्रेषित (Copy forwarded to:-)', en: 'Copy forwarded for information and necessary action to:-', hi: 'प्रतिलिपि सूचनार्थ एवं आवश्यक कार्रवाई हेतु प्रेषित:-' },
      { mr: 'तातडीचे / स्मरणपत्र-१ (MOST IMMEDIATE / REMINDER-1)', en: 'MOST IMMEDIATE / REMINDER-1', hi: 'अति तात्कालिक / स्मरण पत्र-१' },
      { mr: 'आपला नम्र / भवदीय (शासकीय पत्रासाठी)', en: 'Yours faithfully (For Official Letters)', hi: 'भवदीय' }
    ]
  }
];

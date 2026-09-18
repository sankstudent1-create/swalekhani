/**
 * Swalekhani AI Drafting and Protocol Assistant Engine
 * Enhanced with Indian Government correspondence rules (CSMOP 16th Ed.):
 * - Show Cause Notices (Whereas / Therefore structure)
 * - Reminder Letters (Most Immediate Reminder-1 / Information awaited)
 * - Circulars (General instructions across departments)
 * - Office Memorandums (The undersigned is directed to say that... / Competent Authority approval)
 * - Official Letters & D.O. Letters
 */

const TOPIC_PRESETS = [
  {
    keywords: ['show cause', 'कारणे दाखवा', 'नोटीस', 'negligence', 'dereliction', 'कसुरी', 'शिस्तभंग'],
    category: 'SHOW_CAUSE_NOTICE',
    subject: {
      mr: 'कारणे दाखवा नोटीस (SHOW CAUSE NOTICE)',
      hi: 'कारण बताओ नोटिस (SHOW CAUSE NOTICE)',
      en: 'SHOW CAUSE NOTICE'
    },
    paras: {
      en: [
        'Whereas the undersigned had issued explicit directives vide Office Order of even number regarding strict compliance with administrative duties and timely execution of official tasks.',
        'Whereas as per the latest verification report and official records, you have failed to adhere to the aforementioned directions, exhibiting gross negligence and dereliction of assigned responsibilities.',
        'Therefore, you are hereby directed to show cause in detail as to why appropriate disciplinary action under the applicable service rules and conduct regulations should not be initiated against you. Your written explanation must reach this office within 3 days, failing which ex-parte proceedings will be initiated.'
      ],
      mr: [
        'ज्याअर्थी, अधोस्वाक्षरीकारांद्वारे कार्यालयीन आदेशान्वये प्रशासकीय कामकाज व कर्तव्यांचे विहित मुदतीत पालन करण्याबाबत स्पष्ट निर्देश देण्यात आले होते.',
        'ज्याअर्थी, तपासणी अहवाल व कार्यालयीन नोंदीनुसार आपण नमूद केलेल्या निर्देशांचे जाणीवपूर्वक उल्लंघन केले असून कर्तव्यात गंभीर कसूर व हलगर्जीपणा केल्याचे निष्पन्न झाले आहे.',
        'त्याअर्थी, आपणास याद्वारे कारणे दाखविण्याचे निर्देश देण्यात येत आहेत की, सेवानियमांनुसार आपल्याविरुद्ध शिस्तभंगविषयक कार्यवाही का सुरू करण्यात येऊ नये? याबाबत आपला लेखी खुलासा हे पत्र मिळाल्यापासून ३ दिवसांत सादर करावा, अन्यथा एकतर्फी कारवाई करण्यात येईल.'
      ],
      hi: [
        'चूंकि, अधोहस्ताक्षरी द्वारा पूर्व कार्यालयीन आदेश के माध्यम से शासकीय कर्तव्यों एवं दायित्वों के समयबद्ध निर्वहन हेतु स्पष्ट निर्देश जारी किए गए थे।',
        'चूंकि, समीक्षा रिपोर्ट एवं आधिकारिक अभिलेखों के अनुसार आपके द्वारा उक्त निर्देशों की अवहेलना की गई है तथा शासकीय कार्य में घोर लापरवाही एवं कर्तव्यहीनता परिलक्षित हुई है।',
        'अतः आपको एतद्द्वारा कारण बताओ निर्देश दिया जाता है कि सेवा नियमावली के प्रावधानों के अधीन आपके विरुद्ध अनुशासनात्मक कार्रवाई क्यों न प्रारंभ की जाए? अपना लिखित स्पष्टीकरण ३ दिनों के भीतर प्रस्तुत करें।'
      ]
    }
  },
  {
    keywords: ['reminder', 'स्मरण', 'लंबित', 'awaited', 'expedite', 'तात्कालिक'],
    category: 'REMINDER_LETTER',
    subject: {
      mr: 'माहिती व अहवाल सादर करणेबाबत - तातडीचे स्मरणपत्र-१.',
      hi: 'सूचना एवं रिपोर्ट प्रस्तुत करने बाबत - अति तात्कालिक स्मरण पत्र-१।',
      en: 'Submission of requisite information and compliance report- Most Immediate Reminder-1.'
    },
    paras: {
      en: [
        'Please refer to this Department\'s letter of even number on the subject cited above. The information called for therein from your office is still awaited.',
        'It is requested that the requisite consolidated statement and detailed report may kindly be furnished to the undersigned expeditiously, as the matter is to be placed before the higher authorities.',
        'For any technical clarification in this regard, the concerned nodal officer may be contacted immediately.'
      ],
      mr: [
        'कृपया उपरोक्त विषयावरील या कार्यालयाच्या समक्रमांकित पत्राचे अवलोकन व्हावे. सदर पत्राद्वारे मागविण्यात आलेली माहिती व अहवाल अद्याप या कार्यालयास प्राप्त झालेला नसून तो प्रतीक्षेत आहे.',
        'सदर प्रकरण उच्चस्तरावर प्रलंबित असल्याने आवश्यक ती माहिती व अहवाल तात्काळ या कार्यालयास सादर करावा, ही विनंती.',
        'सदर बाबीस सर्वोच्च प्राधान्य देण्यात यावे.'
      ],
      hi: [
        'कृपया उपर्युक्त विषयान्तर्गत इस कार्यालय के समसंख्यक पत्र का अवलोकन करने का कष्ट करें। उक्त पत्र द्वारा मांगी गई वांछित सूचना अभी तक इस कार्यालय को अप्राप्त है।',
        'अतः आपसे पुनः अनुरोध है कि मांगी गई रिपोर्ट प्राथमिकता के आधार पर अधोहस्ताक्षरी को अविलंब उपलब्ध कराने का कष्ट करें।',
        'प्रकरण उच्च स्तर पर समीक्षाधीन होने के कारण इसे सर्वोच्च प्राथमिकता दें।'
      ]
    }
  },
  {
    keywords: ['circular', 'परिपत्रक', 'guidelines', 'मार्गदर्शक', 'सूचना', 'सर्व'],
    category: 'CIRCULAR',
    subject: {
      mr: 'प्रशासकीय कामकाजात पारदर्शकता व वेळेच्या पालनाबाबत सर्वसाधारण परिपत्रक.',
      hi: 'प्रशासनिक कार्यप्रणाली में पारदर्शिता एवं समयबद्धता के संबंध में परिपत्रक।',
      en: 'General Circular regarding strict compliance of administrative instructions and timelines.'
    },
    paras: {
      en: [
        'Instances have come to the notice of the Government that despite several instructions issued from time to time, the prescribed administrative guidelines are not being adhered to in letter and spirit by subordinate offices.',
        'It is reiterated that all official matters and public grievances must be redressed within the stipulated service guarantee timelines without unnecessary procedural delays.',
        'Therefore, all Heads of Departments and Controlling Officers are requested to personally review the pending cases every week and ensure strict compliance.'
      ],
      mr: [
        'शासनाच्या निदर्शनास आले आहे की, वेळोवेळी स्पष्ट सूचना निर्गमित करूनही प्रशासकीय कामकाजात व नागरिक सेवा पुरविण्यात विहित कालमर्यादेचे काटेकोर पालन होत नाही.',
        'सर्व विभाग प्रमुखांनी हे लक्षात घ्यावे की, प्रशासकीय पारदर्शकता व गतिमानतेसाठी नागरिक सनदेनुसार प्रत्येक प्रकरणाचा निपटारा वेळेत होणे अनिवार्य आहे.',
        'यास्तव, सर्व नियंत्रण अधिकाऱ्यांनी आपल्या अधिनस्त कार्यालयांमधील प्रलंबित प्रकरणांचा साप्ताहिक आढावा घेऊन नियमांचे तंतोतंत पालन सुनिश्चित करावे.'
      ],
      hi: [
        'शासन के संज्ञान में यह तथ्य आया है कि समय-समय पर जारी दिशा-निर्देशों के उपरांत भी अधीनस्थ कार्यालयों द्वारा निर्धारित प्रक्रियाओं का शत-प्रतिशत अनुपालन नहीं किया जा रहा है।',
        'अतः समस्त विभागाध्यक्षों को निर्देशित किया जाता है कि वे जनसमस्याओं एवं विभागीय कार्यों का समयबद्ध निस्तारण सुनिश्चित करें।',
        'प्रत्येक नियंत्रण अधिकारी अपने स्तर पर लंबित पत्रावलियों की साप्ताहिक समीक्षा करे तथा अनुपालन आख्या प्रेषित करे।'
      ]
    }
  },
  {
    keywords: ['service', 'representation', 'तक्रार', 'कर्मचारी', 'हक्क', 'leave', 'grievance'],
    category: 'SERVICE_MATTERS',
    subject: {
      mr: 'शासकीय कर्मचाऱ्यांच्या सेवाविषयक बाबींवरील निवेदनाबाबत.',
      hi: 'सरकारी सेवकों के सेवा संबंधी मामलों पर अभ्यावेदन के संबंध में।',
      en: 'Representation from Government servant on service matters- regarding.'
    },
    paras: {
      en: [
        "I am directed to refer to this Department's instructions of even number on the subject cited above wherein detailed guidelines were issued on direct submission of representations by Government servants.",
        "It is reiterated that as per the existing instructions, wherever in any matter connected with his service rights or conditions, a Government servant wishes to seek redressal of a grievance, the proper course is to address his immediate official superior through proper official channels.",
        "Such submission of representations including through email or outside channels directly to higher authorities by-passing the prescribed channel of communication has to be viewed seriously and disciplinary action should be taken against those who violate these instructions under Rule 3(1)(iii) of the Central Civil Services (Conduct) Rules, 1964."
      ],
      mr: [
        'उपरोक्त विषयान्वये सविनय कळविण्यात येते की, शासकीय कर्मचाऱ्यांच्या सेवाविषयक मागण्या व निवेदने सादर करण्याबाबत विहित कार्यपद्धतीचे निर्देश यापूर्वीच निर्गमित करण्यात आले आहेत.',
        'तथापि, अनेक कर्मचारी विहित मार्ग डावलून परस्पर वरिष्ठ कार्यालयांकडे अर्ज सादर करीत असल्याचे निदर्शनास आले आहे. कर्मचाऱ्यांनी आपल्या सेवाविषयक तक्रारी केवळ कार्यालय प्रमुखांमार्फतच सादर करणे बंधनकारक आहे.',
        'यास्तव, विहित कार्यपद्धतीचा भंग करणाऱ्यांवर शिस्तभंगविषयक नियमांनुसार योग्य ती प्रशासकीय कार्यवाही करण्यात यावी, असे निर्देश देण्यात येत आहेत.'
      ],
      hi: [
        'उपर्युक्त विषयान्तर्गत मुझे यह सूचित करने का निर्देश हुआ है कि सरकारी सेवकों द्वारा सेवा संबंधी अभ्यावेदन उचित माध्यम से प्रस्तुत किए जाने के संबंध में पूर्व में स्पष्ट दिशा-निर्देश जारी किए गए हैं।',
        'अतः यह पुनः दोहराया जाता है कि किसी भी सेवा अधिकार या शिकायत के निवारण हेतु उचित माध्यम अपने निकटतम उच्चाधिकारी अथवा विभागाध्यक्ष के माध्यम से ही आवेदन प्रस्तुत किया जाए।',
        'विहित चैनल की अनदेखी कर सीधे उच्चाधिकारियों को आवेदन प्रेषित करना अनुशासनहीनता माना जाएगा।'
      ]
    }
  }
];

export function draftLetterLocally({ topic, letterType, language = 'mr' }) {
  const normalized = (topic || '').toLowerCase();
  let matched = TOPIC_PRESETS.find(p => p.keywords.some(k => normalized.includes(k)));

  const lang = ['mr', 'hi', 'en'].includes(language) ? language : 'mr';

  if (!matched) {
    if (letterType === 'SHOW_CAUSE_NOTICE') {
      matched = TOPIC_PRESETS[0]; // Fallback to Show Cause pattern
    } else if (letterType === 'REMINDER_LETTER') {
      matched = TOPIC_PRESETS[1]; // Fallback to Reminder pattern
    } else if (letterType === 'CIRCULAR') {
      matched = TOPIC_PRESETS[2]; // Fallback to Circular pattern
    } else {
      matched = {
        subject: {
          mr: `${topic || 'महत्त्वाच्या विषया'}बाबत योग्य ती कार्यवाही करणेबाबत.`,
          hi: `${topic || 'आवश्यक विषय'} के संदर्भ में उचित कार्रवाई करने के संबंध में।`,
          en: `${topic || 'Appropriate administrative action on the subject matter'}- regarding.`
        },
        paras: {
          mr: [
            `उपरोक्त विषयान्वये सविनय कळविण्यात येते की, ${topic || 'सदर विषयाबाबत'} वस्तुस्थिती आपल्या निदर्शनास आणणे अत्यंत आवश्यक झाले आहे.`,
            'या संदर्भातील सर्व प्राथमिक बाबींची पाहणी करण्यात आली असून नियम व निकषांनुसार सदर काम तातडीने मार्गी लागणे आवश्यक आहे.',
            'तरी जनहित व शासकीय नियमांचा विचार करून या प्रकरणी त्वरित सकारात्मक निर्णय घेऊन योग्य ती कार्यवाही करावी, ही नम्र विनंती.'
          ],
          hi: [
            `उपर्युक्त विषयान्तर्गत सविनय सूचित किया जाता है कि ${topic || 'उक्त संदर्भ में'} वास्तविक स्थिति आपके संज्ञान में लाना अत्यंत आवश्यक है।`,
            'इस संबंध में सभी मूलभूत तथ्यों का अवलोकन कर लिया गया है तथा नियमानुसार अग्रिम कार्रवाई अपेक्षित है।',
            'अतः आपसे विनम्र अनुरोध है कि जनहित को ध्यान में रखते हुए इस संदर्भ में शीघ्र सकारात्मक निर्णय लेने की कृपा करें।'
          ],
          en: [
            `I am directed to refer to the subject cited above and state that the matter concerning ${topic || 'the stated issue'} requires priority consideration.`,
            'All statutory conditions and preliminary field observations have been scrutinized under existing administrative guidelines.',
            'It is requested that appropriate instructions may kindly be issued to competent authorities to initiate necessary action at an early date.'
          ]
        }
      };
    }
  }

  const subject = matched.subject[lang];
  const paragraphs = matched.paras[lang];

  let salutation = 'महोदय,';
  let subscription = 'आपला नम्र,';

  if (lang === 'hi') {
    salutation = 'महोदय,';
    subscription = 'भवदीय,';
  } else if (lang === 'en') {
    salutation = 'Sir/Madam,';
    subscription = 'Yours faithfully,';
  }

  if (letterType === 'DO_LETTER') {
    salutation = lang === 'en' ? 'Dear Colleague,' : lang === 'hi' ? 'प्रिय महोदय,' : 'प्रिय श्री...,';
    subscription = lang === 'en' ? 'Yours sincerely,' : lang === 'hi' ? 'सस्नेह / सादर,' : 'आपला स्नेही,';
  } else if (['SHOW_CAUSE_NOTICE', 'REMINDER_LETTER', 'CIRCULAR', 'OFFICE_MEMO', 'IMPORTANT_NOTICE'].includes(letterType)) {
    salutation = '';
    subscription = '';
  }

  return {
    subject,
    salutation,
    paragraphs,
    subscription
  };
}

export function polishAdministrativeText(text, lang = 'mr') {
  if (!text) return '';
  let polished = text;

  if (lang === 'mr') {
    const replacements = [
      { from: /मी हे पत्र लिहीत आहे कारण/gi, to: 'उपरोक्त विषयान्वये सविनय कळविण्यात येते की,' },
      { from: /लवकर काम करा/gi, to: 'प्राधान्याने योग्य ती कार्यवाही करावी' },
      { from: /खूप दिवस झाले काम झाले नाही/gi, to: 'सदर प्रकरण दीर्घ कालावधीपासून प्रलंबित आहे' },
      { from: /तुम्हाला नोटीस देतो/gi, to: 'आपणास याद्वारे कारणे दाखविण्याचे निर्देश देण्यात येत आहेत की' }
    ];
    replacements.forEach(r => { polished = polished.replace(r.from, r.to); });
  } else if (lang === 'en') {
    const replacements = [
      { from: /i am writing this letter because/gi, to: 'I am directed to refer to the subject cited above and state that' },
      { from: /do it fast/gi, to: 'may kindly be expedited on top priority' },
      { from: /we give you notice/gi, to: 'you are hereby directed to show cause as to why action should not be initiated' },
      { from: /information is not given/gi, to: 'the information called for therein is still awaited' }
    ];
    replacements.forEach(r => { polished = polished.replace(r.from, r.to); });
  }

  return polished;
}

export async function draftWithGemini({ apiKey, prompt, letterType, language = 'mr', authorityRole = '' }) {
  if (!apiKey) throw new Error('Please provide a valid Gemini API Key.');

  const systemPrompt = `You are "Swalekhani AI", a specialized Indian Government administrative drafting assistant trained in CSMOP (Central Secretariat Manual of Office Procedure 16th Ed.) and State Secretariat rules.
Generate a formal, authentic Indian Government communication in ${language === 'mr' ? 'Marathi (मराठी)' : language === 'hi' ? 'Hindi (हिंदी)' : 'English'}.

Letter Type: ${letterType}
User Request: ${prompt}
Authority Role: ${authorityRole}

Key Protocols:
1. For SHOW CAUSE NOTICE: Strictly follow "Whereas [order/rule]... Whereas [breach/failure]... Therefore, you are hereby directed to show cause in detail as to why action should not be initiated within [N] days...". NO salutation, NO subscription.
2. For REMINDER LETTER: Mark urgency (MOST IMMEDIATE / REMINDER-1), reference previous communication, state "The information called for therein is still awaited. Kindly arrange to provide...".
3. For CIRCULAR: Titled CIRCULAR, state general observations ("Instances have come to notice... It is reiterated that... Therefore, all HODs are requested to...").
4. For OFFICE MEMORANDUM: Third person ("The undersigned is directed to say that..."), end with "This issues with the approval of the competent authority.".
5. For OFFICIAL LETTER: Para 1 unnumbered ("I am directed to refer to..."), subject ends with "- regarding." or "- बाबत.", Salutation "Sir/Madam", Subscription "Yours faithfully".

Respond strictly in JSON format:
{
  "subject": "Official concise subject",
  "salutation": "Salutation or empty if Order/Notice/Memo",
  "paragraphs": [
    "Paragraph 1",
    "Paragraph 2",
    "Paragraph 3"
  ],
  "subscription": "Subscription or empty if Order/Notice/Memo",
  "enclosures": "Optional enclosures list or empty",
  "copiesTo": "Optional copy to list or empty"
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.25 }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini');

  return JSON.parse(rawText);
}

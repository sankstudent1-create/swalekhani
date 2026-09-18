/**
 * Universal Correspondence & Letterpad Templates for Swalekhani
 * Categorized into:
 * 1. Official Government & Ministries (CSMOP, D.O., Orders, Reminders, Show Cause)
 * 2. Ministerial & Diplomatic (Letter of Appreciation, Embassy Advisory)
 * 3. Official Certificates & Gazette (NOC, Gazette Notification)
 * 4. Academic & School (Student to Principal Applications)
 * 5. Traditional & Heritage Personal Letters (तीर्थरूप आई-वडिलांस / सादर चरण स्पर्श)
 * 6. Romantic & Personal Letters (प्रेमपत्र / Vintage Love Letter)
 */

export const TEMPLATE_CATEGORIES = {
  GOVERNMENT: { id: 'GOVERNMENT', label: { mr: 'शासकीय व मंत्रालय', hi: 'सरकारी एवं मंत्रालय', en: 'Government & Ministry' } },
  DIPLOMATIC: { id: 'DIPLOMATIC', label: { mr: 'राजनैतिक व मंत्री', hi: 'राजनयिक एवं मंत्री', en: 'Ministerial & Diplomatic' } },
  CERTIFICATES: { id: 'CERTIFICATES', label: { mr: 'दाखले व राजपत्र', hi: 'प्रमाणपत्र एवं गजट', en: 'Certificates & Gazette' } },
  ACADEMIC: { id: 'ACADEMIC', label: { mr: 'शालेय व शैक्षणिक', hi: 'शैक्षणिक एवं स्कूल', en: 'Academic & School' } },
  PERSONAL: { id: 'PERSONAL', label: { mr: 'पारंपरिक व वैयक्तिक', hi: 'पारंपरिक एवं व्यक्तिगत', en: 'Personal & Heritage' } }
};

export const LETTER_TEMPLATES = [
  // ==========================================
  // 1. MINISTERIAL & DIPLOMATIC SPECIMENS
  // ==========================================
  {
    id: 'APPRECIATION_LETTER',
    category: 'DIPLOMATIC',
    authorityId: 'CONSTITUTIONAL_MINISTER',
    layoutStyle: 'APPRECIATION_LETTER',
    title: {
      mr: 'शासकीय प्रशंसा पत्र (Minister Appreciation Letter - Tripura Specimen)',
      hi: 'प्रशंसा पत्र (Minister Appreciation Letter)',
      en: 'Letter of Appreciation (Minister Level Specimen)'
    },
    description: {
      mr: 'मंत्र्यांद्वारे उल्लेखनीय सामाजिक/प्रशासकीय कार्याबद्दल दिलेले गौरव पत्र (अशोक स्तंभ व हिरवी स्वाक्षरी).',
      hi: 'विशिष्ट सामाजिक व शासकीय सेवाओं की सराहना हेतु मंत्री द्वारा जारी प्रशंसा पत्र।',
      en: 'Issued by Ministers to commend outstanding civic/volunteer work during emergencies.'
    },
    defaultEmblem: 'ASHOKA_EMBLEM',
    defaultData: {
      headerTop: '',
      orgName: 'Government of Tripura',
      department: 'Department of Agriculture, Tourism & Transport\nSecretariat, New Capital Complex, Agartala - 799006',
      address: 'Phone: 0381-2413366 | Fax: 0381-3263 | M: 9436131299',
      outwardNo: '',
      letterDate: 'Dated, Agartala, the 26th June, 2020',
      recipient: '',
      subject: 'APPRECIATION LETTER',
      reference: '',
      salutation: '',
      paragraphs: [
        'I offer my heartiest gratitude to the volunteers of Nehru Yuva Kendra, Gomati District, Udaipur for working tirelessly in the district to control the spread of COVID-19. During the crisis period of lockdown, they have visited different parts of the district and distributed leaflets for creating awareness among the people about the spread of COVID-19 and also for maintaining social distancing. They have also distributed essential commodities to the poor people of the district and study materials to the kids of the downtrodden people.',
        'I really express my appreciation towards them for this commendable job and applause them for this great endeavour.',
        'Hope, they will continue to do so in near future too.'
      ],
      subscription: '',
      signatoryName: 'PRANAJIT SINGHA ROY',
      signatoryDesignation: 'Minister\nGovernment of Tripura',
      signatoryTel: 'Phone: 0381-2413366',
      enclosures: '',
      copiesTo: ''
    }
  },
  {
    id: 'EMBASSY_ADVISORY',
    category: 'DIPLOMATIC',
    authorityId: 'CONSTITUTIONAL_MINISTER',
    layoutStyle: 'EMBASSY_ADVISORY',
    title: {
      mr: 'राजनैतिक सल्ला / इशारा पत्र (Embassy of India Advisory - Tehran Specimen)',
      hi: 'दूतावास परामर्श पत्र (Embassy Advisory Specimen)',
      en: 'Diplomatic Mission Advisory (Embassy of India)'
    },
    description: {
      mr: 'भारतीय दूतावास व परराष्ट्र मंत्रालयाद्वारे नागरिकांसाठी सुरक्षिततेचा इशारा (Ashoka Emblem & Emergency Contact).',
      hi: 'विदेश स्थित भारतीय दूतावास द्वारा नागरिकों हेतु जारी आपातकालीन यात्रा परामर्श।',
      en: 'Official advisory issued by Indian Embassies abroad with emergency hotlines and evacuation guidance.'
    },
    defaultEmblem: 'ASHOKA_EMBLEM',
    defaultData: {
      headerTop: '',
      orgName: 'EMBASSY OF INDIA',
      department: 'TEHRAN',
      address: 'Email: cons.tehran@mea.gov.in',
      outwardNo: '',
      letterDate: '08 April 2026',
      recipient: '',
      subject: 'ADVISORY',
      reference: 'Advisory of 07 April 2026',
      salutation: '',
      paragraphs: [
        'In continuation of the advisory of 07 April 2026, and in light of recent developments, Indian nationals still in Iran are strongly advised to expeditiously exit Iran, in coordination with the Embassy and using the routes suggested by the Embassy.',
        'It is again reiterated that there should be no attempt to approach any international land border without prior consultation and coordination with the Embassy.',
        'The Embassy\'s emergency numbers are below:\n\nMobile Numbers:\n+989128109115              +989128109109\n+989128109102              +989932179359'
      ],
      subscription: '',
      signatoryName: '',
      signatoryDesignation: 'Consular Wing\nEmbassy of India, Tehran',
      signatoryTel: 'Email: cons.tehran@mea.gov.in',
      enclosures: '',
      copiesTo: ''
    }
  },
  {
    id: 'PUBLIC_ADVISORY',
    category: 'GOVERNMENT',
    authorityId: 'GOV_SECRETARIAT',
    layoutStyle: 'PUBLIC_ADVISORY',
    title: {
      mr: 'सार्वजनिक सतर्कता इशारा (Advisory on Fake Appointments - Postal Specimen)',
      hi: 'सार्वजनिक सतर्कता परामर्श (Departmental Public Advisory)',
      en: 'Public Advisory against Fraudulent Letters'
    },
    description: {
      mr: 'बनावट नियुक्ती पत्रांपासून सावध राहण्यासाठी नागरिकांना दिलेला इशारा (***** विभाजकासह).',
      hi: 'फर्जी भर्ती पत्रों एवं धोखाधड़ी से बचाव हेतु मंत्रालय द्वारा जारी परामर्श।',
      en: 'Advising public and candidates against unauthorized fraudulent communications.'
    },
    defaultEmblem: 'NONE',
    defaultData: {
      headerTop: 'Government of India',
      orgName: 'Ministry of Communications',
      department: 'Department of Posts',
      address: 'Dak Bhawan, Sansad Marg, New Delhi 110011',
      outwardNo: 'F. No. W-04/16/2018-SPN-I',
      letterDate: 'December 11, 2019',
      recipient: '',
      subject: 'ADVISORY ON FAKE LETTER OF SELECTION FOR APPOINTMENT AS POSTAL ASSISTANT / SORTING ASSISTANT',
      reference: '',
      salutation: '',
      paragraphs: [
        'It has been brought to the knowledge of Department of Posts, Ministry of Communications, Government of India that fake letters have been issued to many persons purportedly on behalf of this Department conveying selection for appointment as Postal Assistant / Sorting Assistant on the basis of Combined Higher Secondary Level Examination. A sample copy of such fake letter is attached for information.',
        'Since the Combined Higher Secondary Level Examination is conducted by Staff Selection Commission (SSC), all concerned are hereby advised to refer to the results published by SSC on its official website, employment news, etc., and do not fall prey to any fake communication(s) by unauthorised person(s).',
        'After publication of results by SSC in designated medium, Department of Posts initiate further action, details of which are published on its website, viz. indiapost.gov.in, for information of selected candidates.',
        'Therefore, all concerned are hereby advised to visit official website of SSC for results and thereafter candidates recommended by SSC for appointment in Department of Posts should visit its website for further instructions.'
      ],
      subscription: '',
      signatoryName: 'Satya Narayana Dash',
      signatoryDesignation: 'Director (SPN)\nDepartment of Posts',
      signatoryTel: 'Tel: 011-23096060',
      enclosures: '1. Sample copy of fake appointment letter.',
      copiesTo: ''
    }
  },

  // ==========================================
  // 2. CERTIFICATES & GAZETTE
  // ==========================================
  {
    id: 'EMPLOYEE_NOC',
    category: 'CERTIFICATES',
    authorityId: 'GOV_FIELD_OFFICE',
    layoutStyle: 'EMPLOYEE_NOC',
    title: {
      mr: 'ना-हरकत प्रमाणपत्र (NOC for Passport / Higher Studies / Job)',
      hi: 'अनापत्ति प्रमाण पत्र (No Objection Certificate - Employee)',
      en: 'No Objection Certificate (NOC for Employee)'
    },
    description: {
      mr: 'शासकीय कर्मचाऱ्यांना पासपोर्ट काढण्यासाठी किंवा इतर पदासाठी अर्ज करण्यास अधिकृत ना-हरकत प्रमाणपत्र.',
      hi: 'सरकारी कर्मचारियों को पासपोर्ट अथवा अन्य परीक्षा में सम्मिलित होने हेतु एनओसी।',
      en: 'Statutory certificate permitting employee to apply for passport or external examination.'
    },
    defaultEmblem: 'STATE_SEAL',
    defaultData: {
      headerTop: 'महाराष्ट्र शासन / GOVERNMENT OF MAHARASHTRA',
      orgName: 'जिल्हाधिकारी कार्यालय, पुणे',
      department: 'सामान्य प्रशासन विभाग (आस्थापना शाखा)',
      address: 'जिल्हाधिकारी कार्यालय परिसर, पुणे - ४११००१',
      outwardNo: 'जा.क्र. जिपु/आस्था-१/एनओसी/२०२६/४१२',
      letterDate: 'दिनांक: १८ सप्टेंबर २०२६',
      recipient: '',
      subject: 'ना-हरकत प्रमाणपत्र (NO OBJECTION CERTIFICATE)',
      reference: 'संबंधित कर्मचाऱ्यांचा विनंती अर्ज दिनांक १० ऑगस्ट २०२६.',
      salutation: '',
      paragraphs: [
        'प्रमाणित करण्यात येते की, श्री. सचिन सुरेश मोहिते हे या कार्यालयात दिनांक १५ जून २०१५ पासून \'वरिष्ठ लिपिक\' (वेतनश्रेणी स्तर एस-८) या पदावर नियमित सेवेत कार्यरत आहेत.',
        'सदर कर्मचाऱ्यांनी आंतरराष्ट्रीय पारपत्र (Passport) काढण्यासाठी / उच्च शिक्षणासाठी ना-हरकत प्रमाणपत्र मिळण्याबाबत अर्ज केला आहे.',
        'सदर कर्मचाऱ्यांविरुद्ध या कार्यालयात कोणतीही विभागीय चौकशी, फौजदारी खटला अथवा दक्षता चौकशी प्रलंबित नाही. सदर कर्मचाऱ्यांनी पासपोर्ट काढण्यास / परीक्षेस बसण्यास या कार्यालयाची कोणतीही हरकत नाही.'
      ],
      subscription: '',
      signatoryName: 'राजेश पाटील, भा.प्र.से.',
      signatoryDesignation: 'जिल्हाधिकारी व सक्षम प्राधिकारी,\nपुणे',
      signatoryTel: 'फोन: ०२०-२६१२२११',
      enclosures: '',
      copiesTo: '१. प्रादेशिक पासपोर्ट अधिकारी, पुणे.\n२. संबंधित कर्मचारी, आस्थापना शाखा.'
    }
  },
  {
    id: 'GAZETTE_NOTIFICATION',
    category: 'CERTIFICATES',
    authorityId: 'GOV_SECRETARIAT',
    layoutStyle: 'CABINET_ORDER',
    title: {
      mr: 'शासकीय राजपत्र अधिसूचना (Gazette of India Notification)',
      hi: 'भारत का राजपत्र अधिसूचना (Gazette Notification)',
      en: 'Gazette of India Statutory Notification'
    },
    description: {
      mr: 'भारताचे राजपत्र (असाधारण) मध्ये प्रसिद्धीसाठीची वैधानिक कायदेशीर अधिसूचना.',
      hi: 'सांविधिक नियमों एवं सेवा शर्तों के प्रकाशन हेतु आधिकारिक गजट अधिसूचना।',
      en: 'Statutory publication in the Gazette of India under Constitutional provisions.'
    },
    defaultEmblem: 'NONE',
    defaultData: {
      headerTop: 'THE GAZETTE OF INDIA : EXTRAORDINARY',
      orgName: 'MINISTRY OF PERSONNEL, PUBLIC GRIEVANCES AND PENSIONS',
      department: '(Department of Personnel and Training)\nNOTIFICATION',
      address: 'New Delhi, the 18th September, 2026',
      outwardNo: 'G.S.R. 542(E)',
      letterDate: 'New Delhi, the 18th September, 2026',
      recipient: '',
      subject: '',
      reference: '',
      salutation: '',
      paragraphs: [
        'In exercise of the powers conferred by the proviso to article 309 and clause (5) of article 148 of the Constitution, and after consultation with the Comptroller and Auditor General in relation to persons serving in the Indian Audit and Accounts Department, the President hereby makes the following rules further to amend the Central Civil Services Rules, namely:-',
        '1. (1) These rules may be called the Central Civil Services (Amendment) Rules, 2026.\n(2) They shall come into force on the date of their publication in the Official Gazette.',
        '2. In the principal rules, in rule 14, in sub-rule (8), the existing provisions shall be substituted in accordance with the Schedule annexed hereto.'
      ],
      subscription: '',
      signatoryName: 'V. K. Trivedi',
      signatoryDesignation: 'Joint Secretary to the Government of India',
      signatoryTel: 'Tel: 011-23091122',
      enclosures: '',
      copiesTo: 'The Manager, Government of India Press, Mayapuri, New Delhi for publication in Part II, Section 3, Sub-section (i) of the Gazette of India.'
    }
  },

  // ==========================================
  // 3. ACADEMIC & SCHOOL APPLICATIONS
  // ==========================================
  {
    id: 'STUDENT_PRINCIPAL',
    category: 'ACADEMIC',
    authorityId: 'PRIVATE_CITIZEN_NGO',
    layoutStyle: 'ACADEMIC_LETTER',
    title: {
      mr: 'विद्यार्थी अर्ज - मुख्याध्यापक / प्राचार्य (Leave / Fee Concession)',
      hi: 'प्रार्थना पत्र - प्रधानाचार्य (School / College Application)',
      en: 'Application by Student to Principal (Leave / Fee Concession)'
    },
    description: {
      mr: 'विद्यार्थ्यांनी रजा, फी सवलत किंवा दाखल्यासाठी मुख्याध्यापक/प्राचार्यांना करावयाचा औपचारिक अर्ज.',
      hi: 'अवकाश, शुल्क मुक्ति या स्थानांतरण प्रमाण पत्र हेतु प्रधानाचार्य को प्रार्थना पत्र।',
      en: 'Classic structured student application with roll number, class, and parent signature.'
    },
    defaultEmblem: 'NONE',
    defaultData: {
      headerTop: '',
      orgName: '',
      department: '',
      address: '',
      outwardNo: '',
      letterDate: 'दिनांक: १८ सप्टेंबर २०२६',
      recipient: 'मा. मुख्याध्यापक महोदय,\nसरस्वती माध्यमिक विद्यालय,\nशिवाजीनगर, पुणे - ४११०१६.',
      subject: 'आजारी असल्यामुळे ३ दिवसांची रजा मिळणेबाबत अर्ज.',
      reference: '',
      salutation: 'आदरणीय सर / मॅडम,',
      paragraphs: [
        'मी आपल्या विद्यालयातील इयत्ता १० वी \'अ\' चा विद्यार्थी असून माझा हजेरी क्रमांक २४ आहे. या अर्जाद्वारे मी आपणास सविनय कळवू इच्छितो की, मला काल रात्रीपासून तीव्र ताप व सर्दीचा त्रास होत आहे.',
        'डॉक्टरांनी मला तपासणीअंती ३ दिवस पूर्ण विश्रांती घेण्याचा सल्ला दिला आहे. त्या कारणास्तव मी दिनांक १९ सप्टेंबर ते २१ सप्टेंबर २०२६ या कालावधीत विद्यालयात उपस्थित राहू शकत नाही.',
        'तरी कृपया माझे ३ दिवसांचे रजा अर्ज मंजूर करावा, ही नम्र विनंती. डॉक्टरांचे वैद्यकीय प्रमाणपत्र सोबत जोडले आहे.'
      ],
      subscription: 'आपला आज्ञाधारक विद्यार्थी,',
      signatoryName: 'रोहन सुनील देशमुख',
      signatoryDesignation: 'इयत्ता: १० वी (तुकडी \'अ\'), हजेरी क्र. २४\nपालकांची स्वाक्षरी: [ सुनील देशमुख ]',
      signatoryTel: 'पालक मो. ९८२२०१२३४५',
      enclosures: '१. डॉक्टरांचे वैद्यकीय प्रमाणपत्र.',
      copiesTo: ''
    }
  },

  // ==========================================
  // 4. TRADITIONAL & HERITAGE FAMILY LETTERS
  // ==========================================
  {
    id: 'TRADITIONAL_FAMILY',
    category: 'PERSONAL',
    authorityId: 'PRIVATE_CITIZEN_NGO',
    layoutStyle: 'TRADITIONAL_LETTER',
    title: {
      mr: 'पारंपरिक कौटुंबिक पत्र (तीर्थरूप वडिलांस साष्टांग नमस्कार)',
      hi: 'पारंपरिक पारिवारिक पत्र (पूज्य पिताजी, सादर चरण स्पर्श)',
      en: 'Traditional Indian Heritage Letter (Inland / Postcard Style)'
    },
    description: {
      mr: 'जुनी सुसंस्कृत पत्रलेखन शैली (तीर्थरूप/तीर्थस्वरूप, साष्टांग नमस्कार, लहानांना गोड पापे).',
      hi: 'पूज्य माता-पिता को सादर चरण स्पर्श एवं छोटों को शुभाशीर्वाद वाली पारंपरिक शैली।',
      en: 'Evocative, culturally rich vintage letter with classic Indian greetings and blessings.'
    },
    defaultEmblem: 'NONE',
    defaultData: {
      headerTop: '',
      orgName: '',
      department: '',
      address: 'पुणे,\nदिनांक: १८ सप्टेंबर २०२६',
      outwardNo: '',
      letterDate: '',
      recipient: '',
      subject: '',
      reference: '',
      salutation: 'तीर्थरूप बाबांच्या सेवेस,\nसाष्टांग नमस्कार विनंती विशेष.',
      paragraphs: [
        'येथे मी कुशल असून आपण सर्वजण मजेत असाल अशी आशा आहे. माझे शिक्षण व अभ्यास अत्यंत व्यवस्थित सुरू आहे. नुकत्याच झालेल्या घटक चाचणीत मला वर्गात प्रथम क्रमांक मिळाला आहे.',
        'हॉस्टेलमधील जेवणही चांगले असून आरोग्याची व्यवस्थित काळजी घेत आहे. आपण आपल्या तब्येतीची काळजी घ्यावी, वेळेवर औषधे घ्यावीत ही आईला व आपणास कळकळीची विनंती.',
        'दिवाळीच्या सुट्टीत मी नक्की गावी येणार आहे. घरच्या सर्वांना, काका-काकूंना माझा नमस्कार सांगावा आणि लहान चिंटूला खूप खूप गोड पापे व शुभाशीर्वाद.'
      ],
      subscription: 'आपला आज्ञाधारक मुलगा,',
      signatoryName: 'आनंद',
      signatoryDesignation: '',
      signatoryTel: '',
      enclosures: '',
      copiesTo: ''
    }
  },

  // ==========================================
  // 5. ROMANTIC & PERSONAL LOVE LETTER
  // ==========================================
  {
    id: 'VINTAGE_LOVE_LETTER',
    category: 'PERSONAL',
    authorityId: 'PRIVATE_CITIZEN_NGO',
    layoutStyle: 'ROMANTIC_LETTER',
    title: {
      mr: 'मनस्वी प्रेमपत्र (Vintage Poetic Love Letter)',
      hi: 'प्रेम पत्र (Poetic Romantic Letter)',
      en: 'Vintage Handwritten Love Letter'
    },
    description: {
      mr: 'भावनिक, काव्यात्मक आणि मनस्पर्शी प्रेमपत्र (शाही, सुंदर फॉन्ट, शासकीय खुणांशिवाय).',
      hi: 'हृदयस्पर्शी, भावुक एवं काव्यात्मक निजी प्रेम पत्र।',
      en: 'Soulful, poetic romantic letter without official bureaucratic clutter.'
    },
    defaultEmblem: 'NONE',
    defaultData: {
      headerTop: '',
      orgName: '',
      department: '',
      address: 'शांत सायंकाळ,\n१८ सप्टेंबर',
      outwardNo: '',
      letterDate: '',
      recipient: '',
      subject: '',
      reference: '',
      salutation: 'माझ्या प्रिय सखे,',
      paragraphs: [
        'कधी कधी शब्दांना भावनांचे ओझे पेलवत नाही, तरीही आज मनातील प्रत्येक स्पंदन तुला सांगायचा हा छोटासा प्रयत्न. दिवसभराच्या धकाधकीतही तुझ्या एका हसऱ्या आठवणीने मनाला मिळणारी शांतता मी शब्दात कशी मांडू?',
        'तुझा सहवास म्हणजे वसंतातील मंद सुगंधी वाऱ्यासारखा आहे. आयुष्याच्या या प्रवासात तुझा हात हातात असणे हीच माझ्यासाठी जगातील सर्वात मोठी समृद्धी आहे.',
        'तुझ्या येण्याने माझे आयुष्य किती सुंदर झाले आहे हे तुला सांगायला हे एक पत्र अपुरे आहे... मी नेहमी तुझ्यावर असाच अथांग प्रेम करत राहीन.'
      ],
      subscription: 'फक्त आणि फक्त तुझाच,',
      signatoryName: 'तुझा...',
      signatoryDesignation: '',
      signatoryTel: '',
      enclosures: '',
      copiesTo: ''
    }
  },

  // ==========================================
  // 6. PREVIOUS CORE GOVERNMENT SPECIMENS
  // ==========================================
  {
    id: 'REMINDER_LETTER',
    category: 'GOVERNMENT',
    authorityId: 'GOV_SECRETARIAT',
    layoutStyle: 'REMINDER_LETTER',
    urgencyHeader: 'MOST IMMEDIATE\nREMINDER-1',
    title: {
      mr: 'तातडीचे स्मरणपत्र (Most Immediate Reminder-1 - Railway Board)',
      hi: 'अति तात्कालिक स्मरण पत्र (Most Immediate Reminder-1)',
      en: 'Most Immediate Reminder Letter (Railway Board Specimen)'
    },
    description: {
      mr: 'माहिती किंवा अहवाल प्रलंबित असताना पाठविले जाणारे तातडीचे स्मरणपत्र.',
      hi: 'लंबित सूचना एवं रिपोर्टों को त्वरित प्राप्त करने हेतु स्मरण पत्र।',
      en: 'Features top-right "MOST IMMEDIATE / REMINDER-1" stamp and awaited formula.'
    },
    defaultEmblem: 'NONE',
    defaultData: {
      headerTop: 'भारत सरकार GOVERNMENT OF INDIA',
      orgName: 'रेल मंत्रालय MINISTRY OF RAILWAYS',
      department: '(रेलवे बोर्ड) (RAILWAY BOARD)',
      address: 'R.No. 258, Raisina Marg, Rail Bhawan, New Delhi - 110001',
      outwardNo: 'No. 2014/PL/38/1',
      letterDate: 'Dated 03.07.2014',
      recipient: 'The Chief Traffic Planning Managers,\nCentral Railway, Mumbai.             North Western Railway, Jaipur.\nEast Coast Railway, Bhubaneswar.     South Central Railway, Secunderabad.\nEastern Railway, Kolkata.            Western Railway, Mumbai.',
      subject: 'Line Capacity Statement and System Maps for 2013-14',
      reference: 'No. 2014/PL/38/1 dated 21.04.2014',
      salutation: '',
      paragraphs: [
        'Please refer to above subjected letter of even no. dated 21.04.2014. The information called for therein from your Railway is still awaited. Kindly arrange to provide ten copies of line capacity statement for the year 2013-14 along with coloured divisional system maps.',
        'It is requested that the same may please be sent to the undersigned expeditiously. For further enquiry may please contact Shri Anshu Bhatnagar, TI (Planning), mobile no. 9650030620.'
      ],
      subscription: '',
      signatoryName: 'Devendra Singh',
      signatoryDesignation: 'Executive Director (Planning)\nRailway Board',
      signatoryTel: 'Tele/Fax- 011-23383354\nEmail: edplg@rb.railnet.gov.in',
      enclosures: '1. Format overleaf.',
      copiesTo: ''
    }
  },
  {
    id: 'SHOW_CAUSE_NOTICE',
    category: 'GOVERNMENT',
    authorityId: 'GOV_FIELD_OFFICE',
    layoutStyle: 'SHOW_CAUSE_NOTICE',
    title: {
      mr: 'कारणे दाखवा नोटीस (Show Cause Notice - District Collector)',
      hi: 'कारण बताओ नोटिस (Show Cause Notice - DC Specimen)',
      en: 'Show Cause Notice (District Magistrate / Collectorate)'
    },
    description: {
      mr: 'कर्तव्यात कसूर किंवा नियमांचे उल्लंघन केल्याप्रकरणी वैधानिक कारणे दाखवा नोटीस.',
      hi: 'कर्तव्य में लापरवाही या अनुशासनहीनता पर विहित वैधानिक नोटिस।',
      en: 'Statutory notice structured with "Whereas... Whereas... Therefore you are directed to show cause...".'
    },
    defaultEmblem: 'STATE_SEAL',
    defaultData: {
      headerTop: 'GOVERNMENT OF SIKKIM',
      orgName: 'OFFICE OF THE DISTRICT COLLECTOR, EAST',
      department: 'DISTRICT ADMINISTRATIVE CENTRE, SICHEY\nGANGTOK - 737101',
      address: 'Visit us @ https://eastsikkim.nic.in | Email: dceast-sk@nic.in | Phone: 03592-284444',
      outwardNo: 'No: 1886 /DC(E)/2020',
      letterDate: 'Dated: 11/07/2020',
      recipient: 'Sh. V.K. Seth,\nThe Officer Commanding,\n130 RCC GREF.',
      subject: 'SHOW CAUSE NOTICE',
      reference: 'Order No. 1826/DC(E)/2020 dated 19/04/2020',
      salutation: '',
      paragraphs: [
        'Whereas the undersigned had issued Orders vide Order No. 1826/DC(E)/2020 dated 19/04/2020 regarding accommodation of all drivers and helpers transporting essential commodities.',
        'Whereas as per the report submitted by the Sub Divisional Magistrate, you have not adhered to the aforementioned orders regarding quarantining of employees and containing the spread of infection.',
        'Therefore, you are hereby directed to show cause in detail as to why action under section 51 of the Disaster Management Act, 2005 and section 188 of Indian Penal Code, 1860 should not be initiated against you within 3 days.'
      ],
      subscription: '',
      signatoryName: 'Raj Yadav, IAS',
      signatoryDesignation: 'District Magistrate cum District Collector,\nEast District',
      signatoryTel: 'Phone: 03592-284444',
      enclosures: '1. Inspection report of SDM.',
      copiesTo: 'Copy for kind information to:\n1. The Chief Secretary, Government of Sikkim.\n2. The Superintendent of Police, East.'
    }
  },
  {
    id: 'CIRCULAR',
    category: 'GOVERNMENT',
    authorityId: 'GOV_SECRETARIAT',
    layoutStyle: 'CIRCULAR',
    title: {
      mr: 'कार्यालयीन परिपत्रक (Circular - Dept of Personnel / Census)',
      hi: 'कार्यालयीन परिपत्रक (Circular - Guidelines)',
      en: 'Administrative Circular (Policy Guidelines)'
    },
    description: {
      mr: 'सर्व विभाग प्रमुख किंवा सचिवांना एकाच वेळी मार्गदर्शक तत्त्वे जारी करणारे परिपत्रक.',
      hi: 'समस्त विभागाध्यक्षों व अधिकारियों को प्रशासनिक दिशा-निर्देश प्रसारित करने हेतु।',
      en: 'Wide circulation across all HODs/DCs regarding service rules or operations.'
    },
    defaultEmblem: 'STATE_SEAL',
    defaultData: {
      headerTop: 'GOVERNMENT OF SIKKIM',
      orgName: 'DEPARTMENT OF PERSONNEL',
      department: 'GANGTOK - 737101',
      address: '',
      outwardNo: 'No. 2320 /GEN/DOP',
      letterDate: 'Date: 07/06/2021',
      recipient: '',
      subject: 'CIRCULAR',
      reference: '',
      salutation: '',
      paragraphs: [
        'Instances have come to the notice of the Government that despite several instructions issued from time to time for strict compliance of the transfer orders, employees are still not complying with transfer orders.',
        'It is reiterated that all transfer orders are made after careful consideration of manpower requirements in public interest and hence must be complied with immediately.',
        'Therefore, all Heads of the Departments/Secretaries are requested to relieve such transferred employees within 5 days.'
      ],
      subscription: '',
      signatoryName: 'K.C. Lepcha, IAS',
      signatoryDesignation: 'Secretary\nDepartment of Personnel',
      signatoryTel: '',
      enclosures: '',
      copiesTo: 'Copy to:\n1. All Secretaries/HODs.\n2. Secretary to HCM.\n3. District Collectors.'
    }
  },
  {
    id: 'FORMAL_GOV',
    category: 'GOVERNMENT',
    authorityId: 'GOV_SECRETARIAT',
    layoutStyle: 'STANDARD_LETTER',
    title: {
      mr: 'शासकीय पत्र (Official Letter - CSMOP / Dept of Posts)',
      hi: 'सरकारी पत्र (Official Letter - CSMOP Form)',
      en: 'Official Government Letter (Dept of Posts)'
    },
    description: {
      mr: 'टपाल खाते व केंद्रीय मंत्रालयांचे अधिकृत शासकीय पत्र (Unnumbered Para 1 & "I am directed to...").',
      hi: 'केंद्रीय/राज्य मंत्रालयों एवं अधीनस्थ कार्यालयों के मध्य औपचारिक पत्राचार।',
      en: 'Standard for central/state ministries, attached offices, and statutory authorities.'
    },
    defaultEmblem: 'NONE',
    defaultData: {
      headerTop: 'Government of India',
      orgName: 'Ministry of Communications',
      department: 'Department of Posts',
      address: 'Dak Bhavan, Sansad Marg, New Delhi-110 001',
      outwardNo: 'No. 20-5/2016-SPB-II',
      letterDate: 'Dated 27th March, 2017',
      recipient: 'All Chief Postmaster(s) General,\nAll Postmaster(s) General,\nDirector, RAKNPA, Ghaziabad.',
      subject: 'Representation from Government servant on service matters- regarding.',
      reference: "Department's letter of even number dated 13.10.2016",
      salutation: 'Sir/Madam,',
      paragraphs: [
        "I am directed to refer to this Department's letter of even number dated 13.10.2016 wherein instructions have been issued on direct submission of representations by Government servants for their service matters.",
        "It is, therefore, reiterated that as per the existing instruction, wherever a Government servant wishes to seek redressal of a grievance, the proper course is to address his immediate official superior.",
        "Such submission of representations including through email directly to other authorities by-passing the prescribed channel of communication has to be viewed seriously under Rule 3 (1) (iii) of CCS (Conduct) Rules, 1964."
      ],
      subscription: 'Yours faithfully,',
      signatoryName: 'Satya Narayana Dash',
      signatoryDesignation: 'Director (SPN)\nDepartment of Posts',
      signatoryTel: 'Tel: 011-23096060',
      enclosures: '',
      copiesTo: '1. All CPMGs for information and necessary action.'
    }
  },
  {
    id: 'DO_LETTER',
    category: 'GOVERNMENT',
    authorityId: 'GOV_SECRETARIAT',
    layoutStyle: 'DO_BILINGUAL',
    title: {
      mr: 'अर्ध-शासकीय पत्र (Demi-Official / D.O. Letter - Secretary)',
      hi: 'अर्ध-सरकारी पत्र (D.O. Letter - Bilingual Masthead)',
      en: 'Demi-Official (D.O.) Letter (Secretary Level)'
    },
    description: {
      mr: 'वरिष्ठ सनदी अधिकारी (सचिव/सहसचिव) द्वारे वैयक्तिक लक्षवेधनासाठी (अशोक स्तंभ व RTI लोगोयुक्त).',
      hi: 'वरिष्ठ सचिव स्तर के अधिकारियों द्वारा व्यक्तिगत ध्यान आकृष्ट करने हेतु।',
      en: 'Features central gold Ashoka Emblem, bilingual officer masthead, RTI logo, and intimate tone.'
    },
    defaultEmblem: 'ASHOKA_EMBLEM',
    defaultData: {
      headerTop: '',
      orgName: 'Department of Posts / डाक विभाग',
      department: 'Ministry of Communications / संचार मन्त्रालय\nGovernment of India / भारत सरकार',
      address: 'Dak Bhawan, Sansad Marg, New Delhi-110001',
      outwardNo: 'D.O. No. 18-18/2017-BD&MD',
      letterDate: '30th June, 2017',
      recipient: '',
      subject: '',
      reference: 'Heads of Circles Conference 2017 held at Ahmedabad',
      salutation: 'Dear CPMG,',
      paragraphs: [
        "This is in continuation of the Heads of Circles Conference 2017 held at Ahmedabad. The Conference has been fruitful in terms of the discussions held and in defining the roadmap for the Department.",
        "I would like to reiterate some of the important issues outlined by the Hon'ble Minister which should be dealt with utmost priority:-\n\ni. IPPB branches rollout by September 2017.\nii. Parcel network expansion.\niii. Transit timeline reduction."
      ],
      subscription: 'Yours sincerely,',
      signatoryName: 'A. N. Nanda',
      signatoryDesignation: 'Secretary to the Government of India\nDepartment of Posts',
      signatoryTel: 'Tel: (+91-11) 2309 6060',
      enclosures: '',
      copiesTo: ''
    }
  }
];

import { useEffect, useState, useRef, useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../i18n';
import { useAuth } from '../context/auth-context';
import LoginModal from '../components/LoginModal';
import { showToast } from '../components/toast-service';
import './Services.css';
import grihaPraveshImg from '../assets/ghruha pravesha pooja.jpg';
import bhoomiPoojaImg from '../assets/bhoomi pooja.jpg';
import grihaPraveshamImg from '../assets/grihapravesham.PNG';
import vastuShantiImg from '../assets/vastu shanti.png';
import shankuStapanaImg from '../assets/shanku sthapana.jpg';
import vivahPoojaImg from '../assets/marraige.jpg';
import namkaranImg from '../assets/namakarnam.jpg';
import sudarshanaHomamImg from '../assets/sudarshanahomam.jpg';
import chandiHomamImg from '../assets/chandi-homam.jpg';
import vrathamImg from '../assets/vratham.PNG';
import pindaPoojaImg from '../assets/pinda pooja.png';
import templesImg from '../assets/temples.jpg';
import narayanavrathamImg from '../assets/narayanavratham.jpg';
import navagrahaImg from '../assets/nagrahapooja.jpg';

// ─── TRANSLATION HELPER ───────────────────────────────────────────────────────
const t = (val, lang) => {
  if (!val) return val;
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') return val[lang] || val.en || val;
  return val;
};

// ─── UI TEXT ──────────────────────────────────────────────────────────────────
const UI_TEXT = {
  en: {
    home: "Home", allServices: "All Services",
    heroTag: "Dharma Sankalpam — Vedic Ritual Services",
    heroTitle: "Sacred Pooja Services",
    heroTitleMain: "Sacred ", heroTitleEm: "Pooja", heroTitleSuffix: " Services",
    heroDesc: "Every ceremony performed with Vedic shastrokta paddati and Agama pramanam by Sri Daruri Vishnuvardhana Charyulu",
    heroSubDesc: "Experience divine rituals from anywhere in the world — home visits, temple ceremonies, or live online video poojas",
    bookOffline: "Book Offline Pooja", joinOnline: "Join Online Pooja",
    searchPlaceholder: "Search poojas, homams, vrathams...",
    servicesFound: "services found", serviceFound: "service found",
    viewDetails: "View Details →",
    needCustom: "Need a custom pooja?",
    notFinding: "Not finding the ceremony you need? Contact us for a custom arrangement.",
    callUs: "Call 8179960741",
    searchWithin: "Search within", poojasFound: "poojas", poojaFound: "pooja",
    readMore: "Read More", bookNow: "Book Now", poojas: "Poojas", priests: "Priests", rating: "Rating",
    callPriest: "Call Priest", whatsapp: "WhatsApp",
    aboutPooja: "About This Pooja", importance: "Importance & Spiritual Benefits",
    bestTime: "Best Time to Perform", samagri: "Required Pooja Samagri",
    samagriNote: "Please arrange the following items before the priest's arrival. Fresh samagri is recommended.",
    process: "Step-by-Step Ritual Process", pricingPackages: "Pricing Packages",
    bookPackage: "Book This Package",
    travelNoteMain: "Travel charges extra beyond 50 km from Hyderabad. Beyond 100 km, total sambhavana changes. Contact for exact quote.",
    faqs: "Frequently Asked Questions", testimonials: "Devotee Testimonials",
    yourPriest: "Your Priest", relatedPoojas: "Related Poojas", quickBooking: "Quick Booking",
    startingFrom: "Starting from", duration: "Duration", category: "Category",
    languageLabel: "Language", languageVal: "Telugu / Sanskrit",
    location: "Location", locationVal: "At your home",
    whatsappEnquiry: "WhatsApp Enquiry",
    jaiSrimannarayana: "Jai Srimannarayana",
    comingSoon: "Dharmasankalpam.in (Coming Soon)",
    travelNoteTitle: "Travel Note",
    travelNoteText: "Within Hyderabad: No extra charge\n50–100 km: Car travel charges extra\nBeyond 100 km: Sambhavana changes\n\nContact for exact quote.",
    bookPooja: "Book a Pooja",
    onlineAvail: "Online Available", offlineAvail: "Home Visit",
    bothAvail: "Online & Offline",
    howOnlineWorks: "How Online Pooja Works",
    onlineDesc: "Participate in sacred rituals from anywhere in the world through live video",
    step1: "Choose a Pooja", step2: "Select Date & Time", step3: "Receive Meeting Link",
    step4: "Join Live Ritual", step5: "Receive Blessings & Digital Prasadam Details",
    trustTitle: "Why Thousands Choose Us",
    verifiedPriests: "Verified Priests", securePay: "Secure Payments",
    support247: "24/7 Support", successPoojas: "Successful Poojas",
    satisfaction: "Satisfaction Rate", onlineOffline: "Online & Offline",
    serviceModes: "Our Service Modes",
    homePooja: "Home Pooja", templePooja: "Temple Pooja",
    onlinePooja: "Online Pooja", personalizedPooja: "Personalized Ritual",
    homePoojaDesc: "Experienced priests visit your location at the auspicious muhurtham",
    templePoojaDesc: "Poojas performed at partner temples with full traditional setup",
    onlinePoojaDesc: "Live video participation through Zoom, Google Meet or integrated streaming",
    personalizedDesc: "Customized poojas tailored to your specific requirements and horoscope",
    faqOnline: "How does Online Pooja work?",
    faqOnlineA: "Our priests perform the pooja at a designated sacred space while you join via video call (Zoom/Google Meet). You can actively participate, witness all rituals, and receive prasad details digitally.",
    faqCountry: "Can I join from another country?",
    faqCountryA: "Absolutely! Devotees from USA, UK, Australia, Singapore and across the world have participated. We schedule based on your time zone.",
    faqItems: "What items are required for online rituals?",
    faqItemsA: "We send a digital samagri list in advance. For online poojas, the priest arranges the major items. You may need some basic items like a lamp, flowers, and incense at your location.",
    faqRecording: "Will recordings be available?",
    faqRecordingA: "Yes, we provide a recording of the pooja session for your lifelong keepsake. Digital prasad details and mantras are also shared.",
    faqPriests: "How are priests assigned?",
    faqPriestsA: "Sri Daruri Vishnuvardhana Charyulu personally performs or supervises all rituals. For large events, additional verified priests from our network are assigned.",
  },
  te: {
    home: "హోమ్", allServices: "అన్ని సేవలు",
    heroTag: "ధర్మ సంకల్పం — వేద కర్మల సేవలు",
    heroTitle: "పవిత్ర పూజా సేవలు",
    heroTitleMain: "పవిత్ర ", heroTitleEm: "పూజా", heroTitleSuffix: " సేవలు",
    heroDesc: "ప్రతి కర్మ శ్రీ దారూరి విష్ణువర్ధన చార్యులు గారిచే వేద శాస్త్రోక్త పద్ధతిలో నిర్వహించబడుతుంది",
    heroSubDesc: "ప్రపంచంలో ఎక్కడ నుండైనా పవిత్ర కర్మలలో పాల్గొనండి — ఇంటి సందర్శన, ఆలయ కర్మలు, లేదా లైవ్ ఆన్లైన్ వీడియో పూజలు",
    bookOffline: "ఆఫ్‌లైన్ పూజ బుక్ చేయండి", joinOnline: "ఆన్లైన్ పూజలో చేరండి",
    searchPlaceholder: "పూజలు, హోమాలు, వ్రతాలు అన్వేషించండి...",
    servicesFound: "సేవలు కనుగొనబడ్డాయి", serviceFound: "సేవ కనుగొనబడింది",
    viewDetails: "వివరాలు చూడండి →",
    needCustom: "కస్టమ్ పూజ కావాలా?",
    notFinding: "కావాల్సిన పూజ దొరకలేదా? కస్టమ్ ఏర్పాటు కోసం మమ్మల్ని సంప్రదించండి.",
    callUs: "కాల్ 8179960741",
    searchWithin: "ఇందులో వెతకండి", poojasFound: "పూజలు", poojaFound: "పూజ",
    readMore: "మరింత చదవండి", bookNow: "ఇప్పుడే బుక్ చేయండి", poojas: "పూజలు", priests: "పండితులు", rating: "రేటింగ్",
    callPriest: "పండితుడికి కాల్ చేయండి", whatsapp: "వాట్సాప్",
    aboutPooja: "ఈ పూజ గురించి", importance: "ప్రాముఖ్యత & ఆధ్యాత్మిక ప్రయోజనాలు",
    bestTime: "నిర్వహించడానికి ఉత్తమ సమయం", samagri: "అవసరమైన పూజా సామాగ్రి",
    samagriNote: "దయచేసి పండితులు రాకముందే కింది వస్తువులను ఏర్పాటు చేయండి.",
    process: "దశలవారీ పూజా విధానం", pricingPackages: "ధరలు & ప్యాకేజీలు",
    bookPackage: "ఈ ప్యాకేజీని బుక్ చేయండి",
    travelNoteMain: "హైదరాబాద్ నుండి 50 కి.మీ దాటితే ప్రయాణ ఖర్చులు అదనం.",
    faqs: "తరచుగా అడిగే ప్రశ్నలు", testimonials: "భక్తుల అభిప్రాయాలు",
    yourPriest: "మీ పండితుడు", relatedPoojas: "సంబంధిత పూజలు", quickBooking: "త్వరిత బుకింగ్",
    startingFrom: "ప్రారంభ ధర", duration: "వ్యవధి", category: "వర్గం",
    languageLabel: "భాష", languageVal: "తెలుగు / సంస్కృతం",
    location: "స్థానం", locationVal: "మీ ఇంట",
    whatsappEnquiry: "వాట్సాప్ ఎంక్వయిరీ",
    jaiSrimannarayana: "జై శ్రీమన్నారాయణ", comingSoon: "Dharmasankalpam.in (త్వరలో వస్తోంది)",
    travelNoteTitle: "ప్రయాణ సూచన",
    travelNoteText: "హైదరాబాద్ లోపల: అదనపు ఛార్జీ లేదు\n50–100 కి.మీ: కారు ప్రయాణ ఖర్చులు అదనం\n100 కి.మీ దాటితే: సంభావన మారుతుంది",
    bookPooja: "పూజ బుక్ చేయండి",
    onlineAvail: "ఆన్లైన్ అందుబాటులో", offlineAvail: "ఇంటి సందర్శన",
    bothAvail: "ఆన్లైన్ & ఆఫ్‌లైన్",
    howOnlineWorks: "ఆన్లైన్ పూజ ఎలా పని చేస్తుంది",
    onlineDesc: "లైవ్ వీడియో ద్వారా ప్రపంచంలో ఎక్కడ నుండైనా పవిత్ర కర్మలలో పాల్గొనండి",
    step1: "పూజను ఎంచుకోండి", step2: "తేది & సమయం ఎంచుకోండి", step3: "మీటింగ్ లింక్ పొందండి",
    step4: "లైవ్ కర్మలో చేరండి", step5: "ఆశీర్వాదాలు & డిజిటల్ ప్రసాద వివరాలు పొందండి",
    trustTitle: "వేలాది మంది మనల్ని ఎందుకు ఎంచుకుంటారు",
    verifiedPriests: "ధృవీకరించబడిన పండితులు", securePay: "సురక్షిత చెల్లింపులు",
    support247: "24/7 సహాయం", successPoojas: "విజయవంతమైన పూజలు",
    satisfaction: "సంతృప్తి రేటు", onlineOffline: "ఆన్లైన్ & ఆఫ్‌లైన్",
    serviceModes: "మా సేవా విధానాలు",
    homePooja: "ఇంటి పూజ", templePooja: "ఆలయ పూజ",
    onlinePooja: "ఆన్లైన్ పూజ", personalizedPooja: "వ్యక్తిగత కర్మ",
    homePoojaDesc: "అనుభవజ్ఞులైన పండితులు మీ ఇంటికి వస్తారు",
    templePoojaDesc: "భాగస్వామ్య ఆలయాలలో పూజలు నిర్వహించబడతాయి",
    onlinePoojaDesc: "జూమ్, గూగుల్ మీట్ ద్వారా లైవ్ వీడియో పాల్గొనడం",
    personalizedDesc: "మీ అవసరాలు మరియు జాతకానికి అనుగుణంగా అనుకూలీకరించిన పూజలు",
    faqOnline: "ఆన్లైన్ పూజ ఎలా పని చేస్తుంది?",
    faqOnlineA: "మా పండితులు నిర్ణీత పవిత్ర స్థలంలో పూజ చేస్తారు, మీరు వీడియో కాల్ ద్వారా చేరతారు.",
    faqCountry: "మరొక దేశం నుండి చేరవచ్చా?",
    faqCountryA: "అవశ్యం! USA, UK, ఆస్ట్రేలియా, సింగపూర్ నుండి భక్తులు పాల్గొన్నారు.",
    faqItems: "ఆన్లైన్ కర్మలకు ఏ వస్తువులు అవసరం?",
    faqItemsA: "మేము ముందుగా డిజిటల్ సామాగ్రి జాబితా పంపుతాము.",
    faqRecording: "రికార్డింగ్ అందుబాటులో ఉంటుందా?",
    faqRecordingA: "అవును, మేము పూజా సెషన్ రికార్డింగ్ అందిస్తాము.",
    faqPriests: "పండితులను ఎలా నియమిస్తారు?",
    faqPriestsA: "శ్రీ దారూరి విష్ణువర్ధన చార్యులు గారు నేరుగా నిర్వహిస్తారు.",
  },
  hi: {
    home: "होम", allServices: "सभी सेवाएं",
    heroTag: "धर्म संकल्पम — वैदिक अनुष्ठान सेवाएं",
    heroTitle: "पवित्र पूजा सेवाएं",
    heroTitleMain: "पवित्र ", heroTitleEm: "पूजा", heroTitleSuffix: " सेवाएं",
    heroDesc: "प्रत्येक समारोह श्री दारुरी विष्णुवर्धन चार्युलु द्वारा वैदिक शास्त्रोक्त पद्धति से किया जाता है",
    heroSubDesc: "दुनिया के किसी भी कोने से पवित्र अनुष्ठानों में भाग लें — घर पर, मंदिर में, या लाइव ऑनलाइन वीडियो पूजा",
    bookOffline: "ऑफलाइन पूजा बुक करें", joinOnline: "ऑनलाइन पूजा में शामिल हों",
    searchPlaceholder: "पूजा, होम, व्रत खोजें...",
    servicesFound: "सेवाएं मिलीं", serviceFound: "सेवा मिली",
    viewDetails: "विवरण देखें →",
    needCustom: "कस्टम पूजा चाहिए?",
    notFinding: "अपनी आवश्यक पूजा नहीं मिल रही? कस्टम व्यवस्था के लिए संपर्क करें।",
    callUs: "कॉल 8179960741",
    searchWithin: "में खोजें", poojasFound: "पूजाएं", poojaFound: "पूजा",
    readMore: "और पढ़ें", bookNow: "अभी बुक करें", poojas: "पूजाएं", priests: "पंडित", rating: "रेटिंग",
    callPriest: "पंडित जी को कॉल करें", whatsapp: "व्हाट्सएप",
    aboutPooja: "इस पूजा के बारे में", importance: "महत्व और आध्यात्मिक लाभ",
    bestTime: "करने का सबसे अच्छा समय", samagri: "आवश्यक पूजा सामग्री",
    samagriNote: "कृपया पंडित जी के आने से पहले निम्नलिखित वस्तुओं की व्यवस्था करें।",
    process: "चरण-दर-चरण अनुष्ठान प्रक्रिया", pricingPackages: "मूल्य निर्धारण पैकेज",
    bookPackage: "यह पैकेज बुक करें",
    travelNoteMain: "हैदराबाद से 50 किमी से आगे यात्रा शुल्क अतिरिक्त।",
    faqs: "अक्सर पूछे जाने वाले प्रश्न", testimonials: "भक्तों के प्रशंसापत्र",
    yourPriest: "आपके पंडित", relatedPoojas: "संबंधित पूजा", quickBooking: "त्वरित बुकिंग",
    startingFrom: "शुरुआती कीमत", duration: "अवधि", category: "श्रेणी",
    languageLabel: "भाषा", languageVal: "तेलुगु / संस्कृत",
    location: "स्थान", locationVal: "आपके घर पर",
    whatsappEnquiry: "व्हाट्सएप पूछताछ",
    jaiSrimannarayana: "जय श्रीमन्नारायण", comingSoon: "Dharmasankalpam.in (जल्द आ रहा है)",
    travelNoteTitle: "यात्रा नोट",
    travelNoteText: "हैदराबाद के भीतर: कोई अतिरिक्त शुल्क नहीं\n50–100 किमी: कार यात्रा शुल्क अतिरिक्त\n100 किमी से आगे: संभावना बदल जाती है",
    bookPooja: "पूजा बुक करें",
    onlineAvail: "ऑनलाइन उपलब्ध", offlineAvail: "घर पर आना",
    bothAvail: "ऑनलाइन और ऑफलाइन",
    howOnlineWorks: "ऑनलाइन पूजा कैसे काम करती है",
    onlineDesc: "लाइव वीडियो के माध्यम से दुनिया में कहीं से भी पवित्र अनुष्ठानों में भाग लें",
    step1: "पूजा चुनें", step2: "तारीख और समय चुनें", step3: "मीटिंग लिंक प्राप्त करें",
    step4: "लाइव अनुष्ठान में शामिल हों", step5: "आशीर्वाद और डिजिटल प्रसाद विवरण प्राप्त करें",
    trustTitle: "हजारों लोग हमें क्यों चुनते हैं",
    verifiedPriests: "सत्यापित पंडित", securePay: "सुरक्षित भुगतान",
    support247: "24/7 सहायता", successPoojas: "सफल पूजाएं",
    satisfaction: "संतुष्टि दर", onlineOffline: "ऑनलाइन और ऑफलाइन",
    serviceModes: "हमारे सेवा मोड",
    homePooja: "घर पूजा", templePooja: "मंदिर पूजा",
    onlinePooja: "ऑनलाइन पूजा", personalizedPooja: "व्यक्तिगत अनुष्ठान",
    homePoojaDesc: "अनुभवी पंडित आपके घर आते हैं",
    templePoojaDesc: "साझेदार मंदिरों में पूजा की जाती है",
    onlinePoojaDesc: "Zoom, Google Meet के माध्यम से लाइव भागीदारी",
    personalizedDesc: "आपकी विशिष्ट आवश्यकताओं के अनुसार अनुकूलित पूजा",
    faqOnline: "ऑनलाइन पूजा कैसे काम करती है?",
    faqOnlineA: "हमारे पंडित एक पवित्र स्थान पर पूजा करते हैं और आप वीडियो कॉल के माध्यम से जुड़ते हैं।",
    faqCountry: "क्या मैं दूसरे देश से जुड़ सकता हूं?",
    faqCountryA: "बिल्कुल! USA, UK, ऑस्ट्रेलिया, सिंगापुर से भक्त जुड़े हैं।",
    faqItems: "ऑनलाइन अनुष्ठान के लिए क्या चाहिए?",
    faqItemsA: "हम पहले से डिजिटल सामग्री सूची भेजते हैं।",
    faqRecording: "क्या रिकॉर्डिंग उपलब्ध होगी?",
    faqRecordingA: "हां, हम पूजा सत्र की रिकॉर्डिंग प्रदान करते हैं।",
    faqPriests: "पंडितों को कैसे नियुक्त किया जाता है?",
    faqPriestsA: "श्री दारुरी विष्णुवर्धन चार्युलु व्यक्तिगत रूप से करते या निर्देशित करते हैं।",
  }
};

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "gruha-pravesham",
    title: { en: "Gruha Pravesham", te: "గృహ ప్రవేశం", hi: "गृह प्रवेश" },
    subtitle: { en: "Griha Pravesh & Vastu", te: "గృహ ప్రవేశం & వాస్తు", hi: "गृह प्रवेश और वास्तु" },
    description: { en: "Sacred home entry rituals for blessings and positive energy", te: "ఆశీర్వాదాలు మరియు సానుకూల శక్తి కోసం పవిత్ర గృహ ప్రవేశ ఆచారాలు", hi: "आशीर्वाद और सकारात्मक ऊर्जा के लिए पवిత्ర गृह प्रवेश अनुष्ठान" },
    color: "#C8860C", image: grihaPraveshImg, count: 4,
    badge: { en: "Home Visit", te: "ఇంటి సందర్శన", hi: "घर पर" },
    mode: "offline",
  },
  {
    id: "homam-services",
    title: { en: "Homam Services", te: "హోమం సేవలు", hi: "होमम सेवाएं" },
    subtitle: { en: "Sacred Fire Rituals", te: "పవిత్ర అగ్ని కర్మలు", hi: "पवित्र अग्नि अनुष्ठान" },
    description: { en: "Powerful fire ceremonies invoking divine blessings and protection", te: "దైవిక ఆశీర్వాదాలు మరియు రక్షణను ఆహ్వానించే శక్తివంతమైన అగ్ని వేడుకలు", hi: "दिव्य आशीर्वाद और सुरक्षा का आह्वान करने वाले शक्तिशाली अग्नि समारोह" },
    color: "#C0392B", image: sudarshanaHomamImg, count: 9,
    badge: { en: "Online & Offline", te: "ఆన్లైన్ & ఆఫ్‌లైన్", hi: "ऑनलाइन और ऑफलाइन" },
    mode: "both",
  },
  {
    id: "Child Rituals",
    title: { en: "Child Rituals", te: "పిల్లల ఆచారాలు", hi: "बाल अनुष्ठान" },
    subtitle: { en: "Child Samskaras", te: "పిల్లల సంస్కారాలు", hi: "बाल संस्कार" },
    description: { en: "Traditional samskaras from conception through education and spiritual initiation", te: "గర్భధారణ నుండి విద్య మరియు ఆధ్యాత్మిక దీక్ష వరకు సాంప్రదాయ సంస్కారాలు", hi: "गर्भाधान से लेकर शिक्षा और आध्यात्मिक दीक्षा तक पारंपरिक संस्कार" },
    color: "#6C3483", image: namkaranImg, count: 9,
    badge: { en: "Home Visit", te: "ఇంటి సందర్శన", hi: "घर पर" },
    mode: "offline",
  },
  {
    id: "vivaha-poojas",
    title: { en: "Vivaha & Marriage", te: "వివాహ పూజలు", hi: "विवाह और शादी" },
    subtitle: { en: "Wedding Rituals", te: "వివాహ ఆచారాలు", hi: "शादी की रस्में" },
    description: { en: "Traditional Vedic wedding ceremonies and related auspicious rituals", te: "సాంప్రదాయ వేద వివాహ వేడుకలు మరియు సంబంధిత పవిత్ర ఆచారాలు", hi: "पारंपरिक वैदिक विवाह समारोह और संबंधित शुभ अनुष्ठान" },
    color: "#B7770D", image: vivahPoojaImg, count: 4,
    badge: { en: "Home Visit", te: "ఇంటి సందర్శన", hi: "घर पर" },
    mode: "offline",
  },
  {
    id: "temple-devotional",
    title: { en: "Temple & Devotional", te: "ఆలయం & భక్తి", hi: "मंदिर और भक्ति" },
    subtitle: { en: "Deity Rituals", te: "దేవత ఆచారాలు", hi: "देवता अनुष्ठान" },
    description: { en: "Temple consecrations, idol installations and Brahmotsavams", te: "ఆలయ ప్రతిష్ఠలు, విగ్రహాల ప్రతిష్ఠాపనలు మరియు బ్రహ్మోత్సవాలు", hi: "मंदिर प्रतिष्ठापन, मूर्ति स्थापना और ब्रह्मोत्सव" },
    color: "#117A65", image: templesImg, count: 4,
    badge: { en: "Temple", te: "ఆలయం", hi: "मंदिर" },
    mode: "temple",
  },
  {
    id: "festival-poojas",
    title: { en: "Festival Special", te: "పండుగ ప్రత్యేకం", hi: "त्योहार विशेष" },
    subtitle: { en: "Seasonal Poojas", te: "కాలానుగుణ పూజలు", hi: "मौसमी पूजा" },
    description: { en: "Celebrate sacred festivals with traditional Vedic observances", te: "సాంప్రదాయ వేద ఆచారాలతో పవిత్ర పండుగలను జరుపుకోండి", hi: "पारंपरिक वैदिक अनुष्ठानों के साथ पवित्र त्योहार मनाएं" },
    color: "#784212", image: vrathamImg, count: 6,
    badge: { en: "Online & Offline", te: "ఆన్లైన్ & ఆఫ్‌లైన్", hi: "ऑनलाइन और ऑफलाइन" },
    mode: "both",
  },
  {
    id: "Final & Memorial Rituals",
    title: { en: "Final & Memorial Rituals", te: "అంతిమ & స్మారక ఆచారాలు", hi: "अंतिम और स्मारक अनुष्ठान" },
    subtitle: { en: "Last Rites & Ancestral Remembrance", te: "అంతిమ సంస్కారాలు & పూర్వీకుల స్మరణ", hi: "अंतिम संस्कार और पैतृक स्मरण" },
    description: { en: "Sacred ceremonies for the departed and ancestral remembrance", te: "మరణించిన వారి మరియు పూర్వీకుల స్మరణ కోసం పవిత్ర వేడుకలు", hi: "दिवंगत और पैतृक स्मरण के लिए पवित्र समारोह" },
    color: "#1A5276", image: pindaPoojaImg, count: 4,
    badge: { en: "Home Visit", te: "ఇంటి సందర్శన", hi: "घर पर" },
    mode: "offline",
  },
];

// ─── SUB POOJAS ───────────────────────────────────────────────────────────────
const SUB_POOJAS = {
  "gruha-pravesham": [
    { id: "bhoomi-pooja", title: { en: "Bhoomi Pooja", te: "భూమి పూజ", hi: "भूमि पूजा" }, subtitle: "भूमि पूजा", summary: { en: "Sacred ground-breaking ceremony before construction, seeking Mother Earth's blessings", te: "నిర్మాణానికి ముందు భూమాత ఆశీర్వాదం కోరుతూ పవిత్ర భూమి పూజ", hi: "निर्माण से पहले धरती माता का आशीर्वाद मांगने के लिए पवित्र भूमि पूजा" }, duration: { en: "1–2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "₹2,500", benefits: { en: ["Removes Vastu doshas", "Ensures structural stability", "Divine protection"], te: ["వాస్తు దోషాలను తొలగిస్తుంది", "నిర్మాణ స్థిరత్వాన్ని నిర్ధారిస్తుంది", "దైవిక రక్షణ"], hi: ["वास्तु दोष दूर करता है", "संरचनात्मक स्थिरता", "दैवीय सुरक्षा"] }, image: bhoomiPoojaImg, mode: "offline", rating: "4.9" },
    { id: "vastu-shanti", title: { en: "Vastu Shanti", te: "వాస్తు శాంతి", hi: "वास्तु शांति" }, subtitle: "वास्तु शांति", summary: { en: "Harmonize the five elements in your home and eliminate all directional doshas", te: "మీ ఇంట పంచభూతాలను సమతుల్యం చేసి వాస్తు దోషాలను తొలగించండి", hi: "अपने घर में पांच तत्वों को सुसंगत करें और सभी दोष दूर करें" }, duration: { en: "2–3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "₹3,500", benefits: { en: ["Peace & harmony", "Health improvement", "Positive energy flow"], te: ["శాంతి & సామరస్యం", "ఆరోగ్య మెరుగుదల", "సానుకూల శక్తి ప్రవాహం"], hi: ["शांति और सद्भाव", "स्वास्थ्य में सुधार", "सकारात्मक ऊर्जा"] }, image: vastuShantiImg, mode: "offline", rating: "4.8" },
    { id: "gruha-pravesham-muhurtham", title: { en: "Gruha Pravesham", te: "గృహ ప్రవేశం", hi: "गृह प्रवेश" }, subtitle: "गृह प्रवेश", summary: { en: "Auspicious home entry ceremony with Vedic mantras, Ganapathi pooja and Vastu rituals", te: "వేద మంత్రాలు, గణపతి పూజ మరియు వాస్తు కర్మలతో పవిత్ర గృహ ప్రవేశ వేడుక", hi: "वैदिक मंत्रों, गणपति पूजा और वास्तु अनुष्ठानों के साथ शुभ गृह प्रवेश" }, duration: { en: "2–3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "₹3,500", benefits: { en: ["Removes evil eye", "Family prosperity", "Ancestral blessings"], te: ["దిష్టిని తొలగిస్తుంది", "కుటుంబ శ్రేయస్సు", "పూర్వీకుల ఆశీర్వాదాలు"], hi: ["बुरी नज़र दूर करता है", "पारिवारिक समृद्धि", "पैतृक आशीर्वाद"] }, image: grihaPraveshamImg, mode: "offline", rating: "5.0" },
    { id: "Shanku Sthapana", title: { en: "Shanku Sthapana", te: "షంకు స్థాపన", hi: "शंकु स्थापना" }, subtitle: "शंकु स्थापना", summary: { en: "Shanku Sthapana is a traditional Hindu ritual performed before the construction of a house begins", te: "రక్షణ మరియు శ్రేయస్సు కోసం గృహంలో పవిత్ర షంకును స్థాపించడం", hi: "रक्षा और समृद्धि के लिए घर में पवित्र शंकु की स्थापना" }, duration: { en: "1–2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "₹2,500", benefits: { en: ["Fulfills all wishes", "Removes sins", "Blesses family"], te: ["అన్ని కోరికలను తీరుస్తుంది", "పాపాలను తొలగిస్తుంది", "కుటుంబాన్ని ఆశీర్వదిస్తుంది"], hi: ["सभी मनोकामनाएं पूरी करता है", "पापों को दूर करता है", "परिवार को आशीर्वाद"] }, image: shankuStapanaImg, mode: "offline", rating: "4.9" },
  ],
  "Child Rituals": [
    { id: "garbhadhana", title: { en: "Garbhadhana", te: "గర్భాధానం", hi: "गर्भाधान" }, subtitle: "గర్భాధానం", summary: { en: "Sacred conception samskara seeking divine blessings for a healthy and virtuous child", te: "ఆరోగ్యవంతమైన, సద్గుణ సంతానం కోసం దైవ ఆశీర్వాదాలు కోరే పవిత్ర సంస్కారం", hi: "स्वस्थ और सद्गुणी संतान के लिए दिव्य आशीर्वाद मांगने वाला पवित्र संस्कार" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Blessings for progeny", "Family prosperity", "Auspicious beginning"], te: ["సంతాన ఆశీర్వాదం", "కుటుంబ శ్రేయస్సు", "శుభ ప్రారంభం"], hi: ["संतान का आशीर्वाद", "परिवार की समृद्धि", "शुभ आरंभ"] }, image: namkaranImg, mode: "offline", rating: "4.9" },
    { id: "pumsavana", title: { en: "Pumsavana", te: "పుంసవనం", hi: "पुंसवन" }, subtitle: "పుంసవనం", summary: { en: "Prenatal samskara performed for the well-being and healthy development of the baby", te: "శిశువు ఆరోగ్యం మరియు శ్రేయస్సు కోసం నిర్వహించే గర్భకాల సంస్కారం", hi: "शिशु के स्वास्थ्य और शुभ विकास के लिए किया जाने वाला गर्भकालीन संस्कार" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Baby's well-being", "Mother's protection", "Positive energy"], te: ["శిశువు శ్రేయస్సు", "తల్లి రక్షణ", "సానుకూల శక్తి"], hi: ["शिशु का कल्याण", "माता की रक्षा", "सकारात्मक ऊर्जा"] }, image: namkaranImg, mode: "offline", rating: "4.8" },
    { id: "seemantham", title: { en: "Seemantham", te: "సీమంతం", hi: "सीमन्तम्" }, subtitle: "సీమంతం", summary: { en: "Traditional ceremony for expecting mothers, invoking blessings for safe delivery", te: "సురక్షిత ప్రసవం కోసం ఆశీర్వాదాలు కోరే గర్భిణీ స్త్రీల పవిత్ర సంస్కారం", hi: "सुरक्षित प्रसव के आशीर्वाद के लिए गर्भवती माताओं का पारंपरिक संस्कार" }, duration: { en: "2-3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "Contact", benefits: { en: ["Safe delivery", "Mother and child blessings", "Family joy"], te: ["సురక్షిత ప్రసవం", "తల్లి బిడ్డకు ఆశీర్వాదం", "కుటుంబ ఆనందం"], hi: ["सुरक्षित प्रसव", "माता और शिशु का आशीर्वाद", "पारिवारिक आनंद"] }, image: namkaranImg, mode: "offline", rating: "4.9" },
    { id: "jatakarma", title: { en: "Jatakarma", te: "జాతకర్మ", hi: "जातकर्म" }, subtitle: "జాతకర్మ", summary: { en: "Birth ceremony welcoming the newborn with Vedic mantras and blessings", te: "వేద మంత్రాలు మరియు ఆశీర్వాదాలతో నవజాత శిశువును స్వాగతించే జనన సంస్కారం", hi: "वैदिक मंत्रों और आशीर्वादों से नवजात शिशु का स्वागत करने वाला जन्म संस्कार" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Newborn blessings", "Health and protection", "Auspicious welcome"], te: ["శిశువుకు ఆశీర్వాదం", "ఆరోగ్యం మరియు రక్షణ", "శుభ స్వాగతం"], hi: ["नवजात का आशीर्वाद", "स्वास्थ्य और रक्षा", "शुभ स्वागत"] }, image: namkaranImg, mode: "offline", rating: "4.9" },
    { id: "namakarana", title: { en: "Namakarana", te: "నామకరణం", hi: "नामकरण" }, subtitle: "నామకరణం", summary: { en: "Naming ceremony for the child with horoscope-based blessings and family rituals", te: "జాతక ఆధారిత ఆశీర్వాదాలు మరియు కుటుంబ కర్మలతో శిశువు నామకరణ సంస్కారం", hi: "जन्मपत्री आधारित आशीर्वाद और पारिवारिक विधियों के साथ शिशु का नामकरण संस्कार" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Auspicious name", "Family blessings", "Good fortune"], te: ["శుభ నామం", "కుటుంబ ఆశీర్వాదం", "శుభ ఫలితం"], hi: ["शुभ नाम", "परिवार का आशीर्वाद", "सौभाग्य"] }, image: namkaranImg, mode: "offline", rating: "5.0" },
    { id: "annaprashana", title: { en: "Annaprashana", te: "అన్నప్రాశన", hi: "अन्नप्राशन" }, subtitle: "అన్నప్రాశన", summary: { en: "First-rice feeding ceremony blessing the child's nourishment, health, and growth", te: "శిశువు ఆహారం, ఆరోగ్యం మరియు పెరుగుదల కోసం ఆశీర్వదించే మొదటి అన్నప్రాశన సంస్కారం", hi: "बच्चे के पोषण, स्वास्थ्य और विकास के लिए प्रथम अन्न ग्रहण संस्कार" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Healthy growth", "Food blessings", "Child prosperity"], te: ["ఆరోగ్యకర పెరుగుదల", "అన్న ఆశీర్వాదం", "శిశువు శ్రేయస్సు"], hi: ["स्वस्थ विकास", "अन्न का आशीर्वाद", "बाल समृद्धि"] }, image: namkaranImg, mode: "offline", rating: "4.8" },
    { id: "choula-mundan", title: { en: "Choula / Mundan", te: "చౌల / ముండనం", hi: "चौल / मुंडन" }, subtitle: "చౌల / ముండనం", summary: { en: "First tonsure ceremony performed for purification, health, and spiritual growth", te: "శుద్ధి, ఆరోగ్యం మరియు ఆధ్యాత్మిక వికాసం కోసం నిర్వహించే మొదటి ముండన సంస్కారం", hi: "शुद्धि, स्वास्थ्य और आध्यात्मिक विकास के लिए किया जाने वाला प्रथम मुंडन संस्कार" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Purification", "Health blessings", "Spiritual growth"], te: ["శుద్ధి", "ఆరోగ్య ఆశీర్వాదం", "ఆధ్యాత్మిక వికాసం"], hi: ["शुद्धि", "स्वास्थ्य का आशीर्वाद", "आध्यात्मिक विकास"] }, image: namkaranImg, mode: "offline", rating: "4.9" },
    { id: "aksharabhyasam", title: { en: "Aksharabhyasam", te: "అక్షరాభ్యాసం", hi: "अक्षराभ्यास" }, subtitle: "అక్షరాభ్యాసం", summary: { en: "Initiation into learning, invoking Saraswati Devi for knowledge and wisdom", te: "జ్ఞానం మరియు విద్య కోసం సరస్వతి దేవిని ప్రార్థిస్తూ విద్యారంభ సంస్కారం", hi: "ज्ञान और बुद्धि के लिए सरस्वती देवी का आह्वान करते हुए विद्यारंभ संस्कार" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Education blessings", "Wisdom", "Good learning"], te: ["విద్యా ఆశీర్వాదం", "జ్ఞానం", "మంచి అభ్యాసం"], hi: ["विद्या का आशीर्वाद", "बुद्धि", "अच्छी शिक्षा"] }, image: namkaranImg, mode: "offline", rating: "4.8" },
    { id: "upanayanam", title: { en: "Upanayanam", te: "ఉపనయనం", hi: "उपनयन" }, subtitle: "ఉపనయనం", summary: { en: "Sacred thread ceremony marking spiritual initiation and Vedic learning", te: "ఆధ్యాత్మిక దీక్ష మరియు వేద అధ్యయనానికి ప్రారంభమైన పవిత్ర యజ్ఞోపవీత సంస్కారం", hi: "आध्यात्मिक दीक्षा और वैदिक अध्ययन का आरंभ कराने वाला पवित्र यज्ञोपवीत संस्कार" }, duration: { en: "3-4 hrs", te: "3-4 గంటలు", hi: "3-4 घंटे" }, price: "Contact", benefits: { en: ["Spiritual initiation", "Vedic learning", "Discipline"], te: ["ఆధ్యాత్మిక దీక్ష", "వేద అధ్యయనం", "క్రమశిక్షణ"], hi: ["आध्यात्मिक दीक्षा", "वैदिक अध्ययन", "अनुशासन"] }, image: namkaranImg, mode: "offline", rating: "5.0" },
  ],
  "homam-services": [
    { id: "sudarshana-homam", title: { en: "Sudarshana Narasimha Homam", te: "సుదర్శన నరసింహ హోమం", hi: "सुदर्शन नरसिम्हा होमम" }, subtitle: "सुदर्शन होम", summary: { en: "Powerful protective homam invoking Lord Sudarshana and Narasimha to destroy evil forces", te: "చెడు శక్తులను నాశనం చేయడానికి సుదర్శన మరియు నరసింహ స్వామిని ఆహ్వానించే శక్తివంతమైన హోమం", hi: "बुरी ताकतों को नष्ट करने के लिए भगवान सुदर्शन और नरसिम्हा का आह्वान" }, duration: { en: "3–4 hrs", te: "3-4 గంటలు", hi: "3-4 घंटे" }, price: "₹35,000", benefits: { en: ["Protection from evil", "Removes black magic", "Health & victory"], te: ["చెడు నుండి రక్షణ", "బ్లాక్ మ్యాజిక్ తొలగిస్తుంది", "ఆరోగ్యం & విజయం"], hi: ["बुराई से सुरक्षा", "काला जादू दूर करता है", "स्वास्थ्य और जीत"] }, image: sudarshanaHomamImg, mode: "both", rating: "5.0" },
    { id: "chandi-homam", title: { en: "Chandi Homam", te: "చండీ హోమం", hi: "चंडी होमम" }, subtitle: "चण्डी होम", summary: { en: "Supreme goddess ritual invoking Devi Chandi for ultimate protection and power", te: "అంతిమ రక్షణ మరియు శక్తి కోసం చండీ దేవిని ఆహ్వానించే గొప్ప కర్మ", hi: "परम सुरक्षा और शक्ति के लिए देवी चंडी का आह्वान करने वाला सर्वोच्च अनुष्ठान" }, duration: { en: "4–6 hrs", te: "4-6 గంటలు", hi: "4-6 घंटे" }, price: "₹45,000", benefits: { en: ["Removes enemies", "Ultimate protection", "Goddess blessings"], te: ["శత్రువులను తొలగిస్తుంది", "అంతిమ రక్షణ", "అమ్మవారి ఆశీర్వాదాలు"], hi: ["दुश्मनों को दूर करता है", "परम सुरक्षा", "देवी का आशीर्वाद"] }, image: chandiHomamImg, mode: "both", rating: "4.9" },
    { id: "ganapathi-homam", title: { en: "Ganapathi Homam", te: "గణపతి హోమం", hi: "गणपति होमम" }, subtitle: "गणपति होम", summary: { en: "Invocation of Lord Ganesha to remove obstacles and ensure success in all endeavors", te: "అడ్డంకులను తొలగించడానికి మరియు అన్ని పనులలో విజయం సాధించడానికి వినాయకుడిని ఆహ్వానించడం", hi: "बाधाओं को दूर करने और सभी प्रयासों में सफलता के लिए भगवान गणेश का आह्वान" }, duration: { en: "1–2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "₹5,000", benefits: { en: ["Removes obstacles", "Success in ventures", "Intelligence"], te: ["అడ్డంకులను తొలగిస్తుంది", "వ్యాపారాలలో విజయం", "జ్ఞానం"], hi: ["बाधाओं को दूर करता है", "उपक्रमों में सफलता", "बुद्धिमत्ता"] }, image: sudarshanaHomamImg, mode: "both", rating: "4.9" },
    { id: "navagraha-homam", title: { en: "Navagraha Homam", te: "నవగ్రహ హోమం", hi: "नवग्रह होमम" }, subtitle: "नवग्रह होम", summary: { en: "Nine-planet fire ceremony to balance planetary influences and bring harmony", te: "గ్రహ ప్రభావాలను సమతుల్యం చేయడానికి మరియు సామరస్యాన్ని తీసుకురావడానికి తొమ్మిది గ్రహాల హోమం", hi: "ग्रहों के प्रभावों को संतुलित करने और सद्भाव लाने के लिए नौ-ग्रह अग्नि समारोह" }, duration: { en: "3–4 hrs", te: "3-4 గంటలు", hi: "3-4 घंटे" }, price: "₹5,000", benefits: { en: ["Planetary balance", "Removes doshas", "Career growth"], te: ["గ్రహ సమతుల్యత", "దోషాలను తొలగిస్తుంది", "కెరీర్ వృద్ధి"], hi: ["ग्रहों का संतुलन", "दोष दूर करता है", "करियर में वृद्धि"] }, image: navagrahaImg, mode: "both", rating: "4.8" },
    { id: "lakshmi-homam", title: { en: "Lakshmi Homam", te: "లక్ష్మీ హోమం", hi: "लक्ष्मी होमम" }, subtitle: "लक्ष्मी होम", summary: { en: "Sacred fire ritual to invoke Goddess Lakshmi for wealth, prosperity and abundance", te: "సంపద, శ్రేయస్సు మరియు సమృద్ధి కోసం లక్ష్మీ దేవిని ప్రార్థించే పవిత్ర అగ్ని కర్మ", hi: "धन, समृद्धि और बहुतायत के लिए देवी लक्ष्मी का आह्वान करने वाला पवित्र अग्नि अनुष्ठान" }, duration: { en: "2–3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "₹8,000", benefits: { en: ["Wealth & prosperity", "Business growth", "Removes poverty"], te: ["సంపద & శ్రేయస్సు", "వ్యాపార వృద్ధి", "పేదరికాన్ని తొలగిస్తుంది"], hi: ["धन और समृद्धि", "व्यापार में वृद्धि", "गरीबी दूर करता है"] }, image: sudarshanaHomamImg, mode: "both", rating: "5.0" },
    { id: "mrityunjaya-homam", title: { en: "Mrityunjaya Homam", te: "మృత్యుంజయ హోమం", hi: "मृत्युंजय होमम" }, subtitle: "मृत्युञ्जय होम", summary: { en: "Invoking Lord Shiva to conquer illness, fear and death — a life-saving ritual", te: "అనారోగ్యం, భయం మరియు మరణాన్ని జయించడానికి శివుని ప్రార్థించడం - ప్రాణాలను రక్షించే ఆచారం", hi: "बीमारी, भय और मृत्यु पर विजय पाने के लिए भगवान शिव का आह्वान" }, duration: { en: "2–3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "₹10,000", benefits: { en: ["Health recovery", "Long life", "Fear removal"], te: ["ఆరోగ్య పునరుద్ధరణ", "దీర్ఘాయువు", "భయ నివారణ"], hi: ["स्वास्थ्य में सुधार", "लंबी उम्र", "भय निवारण"] }, image: chandiHomamImg, mode: "both", rating: "4.9" },
    { id: "putrakameshti-homam", title: { en: "Putrakameshti Homam", te: "పుత్రకామేష్టి హోమం", hi: "पुत्रकामेष्टि होमम" }, subtitle: "पुत्रकामेष्टि होम", summary: { en: "Ancient Vedic ritual for childless couples seeking divine blessings for progeny", te: "సంతానం కోసం దైవిక ఆశీర్వాదాలు కోరే పిల్లలు లేని జంటల కోసం పురాతన వేద కర్మ", hi: "संतान प्राप्ति के लिए दिव्य आशीर्वाद चाहने वाले निःसंतान जोड़ों के लिए प्राचीन वैदिक अनुष्ठान" }, duration: { en: "4–5 hrs", te: "4-5 గంటలు", hi: "4-5 घंटे" }, price: "₹15,000", benefits: { en: ["Blessing for children", "Removes pitru dosha", "Family joy"], te: ["సంతాన ప్రాప్తి", "పితృ దోష నివారణ", "కుటుంబ ఆనందం"], hi: ["बच्चों के लिए आशीर्वाद", "पितृ दोष दूर करता है", "पारिवारिक खुशी"] }, image: sudarshanaHomamImg, mode: "offline", rating: "4.9" },
    { id: "nakshatra-shanti", title: { en: "Nakshatra Shanti", te: "నక్షత్ర శాంతి", hi: "नक्षत्र शांति" }, subtitle: "नक्षत्र शांति", summary: { en: "Birth-star pacification ritual to neutralize negative star influences", te: "ప్రతికూల నక్షత్ర ప్రభావాలను తటస్తం చేయడానికి జన్మ నక్షత్ర శాంతి కర్మ", hi: "नकारात्मक तारा प्रभावों को बेअसर करने के लिए जन्म-तारा शांति अनुष्ठान" }, duration: { en: "2–3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "₹6,000", benefits: { en: ["Star alignment", "Mental peace", "Removes bad luck"], te: ["నక్షత్ర అనుకూలత", "మానసిక శాంతి", "దురదృష్టాన్ని తొలగిస్తుంది"], hi: ["तारा संरेखण", "मानसिक शांति", "दुर्भाग्य दूर करता है"] }, image: navagrahaImg, mode: "both", rating: "4.8" },
    { id: "rahu-ketu-shanti", title: { en: "Rahu-Ketu Shanti", te: "రాహు-కేతు శాంతి", hi: "राहु-केतु शांति" }, subtitle: "राहु-केतु शांति", summary: { en: "Remedy for the shadow planets Rahu and Ketu causing delay, confusion and obstacles", te: "ఆలస్యం, గందరగోళం మరియు అడ్డంకులను కలిగించే నీడ గ్రహాలు రాహు మరియు కేతువులకు పరిహారం", hi: "देरी, भ्रम और बाधाओं का कारण बनने वाले छाया ग्रहों राहु और केतु के लिए उपाय" }, duration: { en: "3–4 hrs", te: "3-4 గంటలు", hi: "3-4 घंटे" }, price: "₹8,000", benefits: { en: ["Clears confusion", "Removes delays", "Mental clarity"], te: ["గందరగోళాన్ని తొలగిస్తుంది", "ఆలస్యాలను నివారిస్తుంది", "మానసిక స్పష్టత"], hi: ["भ्रम दूर करता है", "देरी को दूर करता है", "मानसिक स्पष्टता"] }, image: navagrahaImg, mode: "both", rating: "4.9" },
  ],
  "vivaha-poojas": [
    { id: "nischitartham", title: { en: "Nischitartham (Engagement)", te: "నిశ్చితార్థం (ఎంగేజ్‌మెంట్)", hi: "निश्चितार्थम (सगाई)" }, subtitle: "निश्चितार्थम्", summary: { en: "Sacred engagement ceremony with Vedic rituals, ring exchange and family blessings", te: "వేద కర్మలు, ఉంగరాల మార్పిడి మరియు కుటుంబ ఆశీర్వాదాలతో పవిత్ర నిశ్చితార్థ వేడుక", hi: "वैदिक अनुष्ठानों, अंगूठी के आदान-प्रदान और पारिवारिक आशीर्वाद के साथ पवित्र सगाई समारोह" }, duration: { en: "2–3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "₹5,000", benefits: { en: ["Auspicious beginning", "Family union", "Divine sanction"], te: ["శుభారంభం", "కుటుంబ కలయిక", "దైవిక ఆమోదం"], hi: ["शुभ शुरुआत", "पारिवारिक मिलन", "दिव्य स्वीकृति"] }, image: vivahPoojaImg, mode: "offline", rating: "4.9" },
    { id: "vivaha-pooja", title: { en: "Vivaha Pooja", te: "వివాహ పూజ", hi: "विवाह पूजा" }, subtitle: "विवाह", summary: { en: "Complete traditional Vedic wedding with Saptapadi, Kanyadaanam and all rituals", te: "సప్తపది, కన్యాదానం మరియు అన్ని కర్మలతో సంపూర్ణ సాంప్రదాయ వేద వివాహం", hi: "सप्तपदी, कन्यादान और सभी अनुष्ठानों के साथ पूर्ण पारंपरिक वैदिक विवाह" }, duration: { en: "4–6 hrs", te: "4-6 గంటలు", hi: "4-6 घंटे" }, price: "₹8,000", benefits: { en: ["Sacred union", "7 vows", "Ancestral blessings"], te: ["పవిత్ర కలయిక", "7 ప్రమాణాలు", "పూర్వీకుల ఆశీర్వాదాలు"], hi: ["पवित्र मिलन", "7 वचन", "पैतृक आशीर्वाद"] }, image: vivahPoojaImg, mode: "offline", rating: "5.0" },
    { id: "srinivasa-kalyanam", title: { en: "Srinivasa Kalyanam", te: "శ్రీనివాస కళ్యాణం", hi: "श्रीनिवास कल्याणम" }, subtitle: "श्रीनिवास कल्याणम्", summary: { en: "Celestial wedding of Lord Venkateswara — performed with 2 to 6 pandits in three grand packages", te: "వెంకటేశ్వర స్వామి దివ్య వివాహం - 2 నుండి 6 పండితులతో మూడు గొప్ప ప్యాకేజీలలో ప్రదర్శించబడుతుంది", hi: "भगवान वेंकटेश्वर का खगोलीय विवाह — 2 से 6 पंडितों के साथ तीन भव्य पैकेजों में किया जाता है" }, duration: { en: "2–4 hrs", te: "2-4 గంటలు", hi: "2-4 घंटे" }, price: "₹25,000+", benefits: { en: ["Wish fulfillment", "Divine grace", "Family prosperity"], te: ["కోరిక నెరవేరుతుంది", "దైవిక కృప", "కుటుంబ శ్రేయస్సు"], hi: ["मनोकामना पूर्ति", "दिव्य कृपा", "पारिवारिक समृद्धि"] }, image: vivahPoojaImg, mode: "both", rating: "4.9" },
    { id: "traditional-wedding", title: { en: "Shastriya Vivaha Vidhanam", te: "శాస్త్రీయ వివాహ విధానం", hi: "शास्त्रीय विवाह विधानम" }, subtitle: "शास्त्रीय विवाह", summary: { en: "Traditional wedding rituals performed strictly according to Vedic scriptures", te: "వేద గ్రంథాల ప్రకారం ఖచ్చితంగా నిర్వహించే సాంప్రదాయ వివాహ ఆచారాలు", hi: "वैदिक शास्त्रों के अनुसार कड़ाई से किए गए पारंपरिक विवाह अनुष्ठान" }, duration: { en: "5–8 hrs", te: "5-8 గంటలు", hi: "5-8 घंटे" }, price: "₹12,000", benefits: { en: ["Vedic sanctity", "All sub-rituals", "Lifetime bond"], te: ["వేద పవిత్రత", "అన్ని ఉప-ఆచారాలు", "జీవితకాల బంధం"], hi: ["वैदिक पवित्रता", "सभी उप-अनुष्ठान", "आजीवन बंधन"] }, image: vivahPoojaImg, mode: "offline", rating: "5.0" },
  ],
  "temple-devotional": [
    { id: "devalaya-pratishta", title: { en: "Devalaya Pratishta", te: "దేవాలయ ప్రతిష్ఠ", hi: "देवालय प्रतिष्ठा" }, subtitle: "देवालय प्रतिष्ठा", summary: { en: "Sacred temple consecration ceremony with Prana Pratishtha of all deities", te: "అన్ని దేవతల ప్రాణ ప్రతిష్ఠతో పవిత్ర దేవాలయ ప్రతిష్ఠ వేడుక", hi: "सभी देवताओं की प्राण प्रतिष्ठा के साथ पवित्र मंदिर प्रतिष्ठा समारोह" }, duration: { en: "1–3 days", te: "1-3 రోజులు", hi: "1-3 दिन" }, price: "Custom", benefits: { en: ["Divine presence", "Community blessings", "Permanent sanctity"], te: ["దైవిక ఉనికి", "సంఘం ఆశీర్వాదాలు", "శాశ్వత పవిత్రత"], hi: ["दिव्य उपस्थिति", "सामुदायिक आशीर्वाद", "स्थायी पवित्रता"] }, image: templesImg, mode: "temple", rating: "5.0" },
    { id: "vigraha-pratishta", title: { en: "Vigraha Pratishta", te: "విగ్రహ ప్రతిష్ఠ", hi: "विग्रह प्रतिष्ठा" }, subtitle: "विग्रह प्रतिष्ठा", summary: { en: "Installation of divine idol with life-breathing (Prana Pratishtha) rituals", te: "ప్రాణ ప్రతిష్ఠ ఆచారాలతో దైవిక విగ్రహ ప్రతిష్ట", hi: "प्राण प्रतिष्ठा अनुष्ठानों के साथ दिव्य मूर्ति की स्थापना" }, duration: { en: "4–6 hrs", te: "4-6 గంటలు", hi: "4-6 घंटे" }, price: "₹15,000+", benefits: { en: ["Deity installation", "Prana infusion", "Divine activation"], te: ["దేవతా ప్రతిష్ఠాపన", "ప్రాణ ఇన్ఫ్యూషన్", "దైవిక క్రియాశీలత"], hi: ["देवता स्थापना", "प्राण संचार", "दिव्य सक्रियण"] }, image: templesImg, mode: "temple", rating: "4.9" },
    { id: "kumbhabhishekam", title: { en: "Kumbhabhishekam", te: "కుంభాభిషేకం", hi: "कुम्भाभिषेकम" }, subtitle: "कुंभाभिषेकम्", summary: { en: "Grand temple re-consecration ceremony with sacred water pot abhishekam", te: "పవిత్ర జల పాత్ర అభిషేకంతో గొప్ప దేవాలయ పునః ప్రతిష్ట వేడుక", hi: "पवित्र जल कलश अभिषेक के साथ भव्य मंदिर पुनः प्रतिष्ठा समारोह" }, duration: { en: "Full day", te: "పూర్తి రోజు", hi: "पूरा दिन" }, price: "Custom", benefits: { en: ["Temple renewal", "Divine blessings", "Community merit"], te: ["ఆలయ పునరుద్ధరణ", "దైవిక ఆశీర్వాదాలు", "సంఘం యోగ్యత"], hi: ["मंदिर का नवीनीकरण", "दिव्य आशीर्वाद", "सामुदायिक योग्यता"] }, image: templesImg, mode: "temple", rating: "5.0" },
    { id: "brahmotsavam", title: { en: "Brahmotsavam & Kalyanotsavam", te: "బ్రహ్మోత్సవం & కల్యాణోత్సవం", hi: "ब्रह्मोत्सवम और कल्याणोत्सवम" }, subtitle: "ब्रह्मोत्सवम्", summary: { en: "Grand temple festival celebrations with processions and divine wedding ceremonies", te: "ఊరేగింపులు మరియు దైవిక వివాహ వేడుకలతో గొప్ప దేవాలయ పండుగ వేడుకలు", hi: "जुलूस और दिव्य विवाह समारोहों के साथ भव्य मंदिर उत्सव समारोह" }, duration: { en: "Multi-day", te: "బహుళ రోజులు", hi: "कई दिन" }, price: "Custom", benefits: { en: ["Festival grace", "Community joy", "Divine presence"], te: ["పండుగ దయ", "కమ్యూనిటీ ఆనందం", "దైవిక ఉనికి"], hi: ["त्योहार की कृपा", "सामुदायिक खुशी", "दिव्य उपस्थिति"] }, image: templesImg, mode: "temple", rating: "4.9" },
  ],
  "festival-poojas": [
    { id: "satyanarayana-vratham-festival", title: { en: "Satyanarayana Vratham", te: "సత్యనారాయణ వ్రతం", hi: "सत्यनारायण व्रत" }, subtitle: "सत्यनारायण व्रत", summary: { en: "Monthly and festival-occasion Satyanarayana pooja for wish fulfillment", te: "కోరికల నెరవేర్పు కోసం నెలవారీ మరియు పండుగ సందర్భంగా సత్యనారాయణ పూజ", hi: "मनोकामना पूर्ति के लिए मासिक और त्योहार के अवसर पर सत्यनारायण पूजा" }, duration: { en: "2–3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "₹3,500", benefits: { en: ["Wishes granted", "Peace & joy", "Removes sins"], te: ["కోరికలు తీరతాయి", "శాంతి & ఆనందం", "పాపాలను తొలగిస్తుంది"], hi: ["मनोकामनाएं पूरी होती हैं", "शांति और खुशी", "पाप दूर करता है"] }, image: narayanavrathamImg, mode: "both", rating: "5.0" },
    { id: "varalakshmi-vratham", title: { en: "Varalakshmi Vratham", te: "వరలక్ష్మీ వ్రతం", hi: "वरलक्ष्मी व्रत" }, subtitle: "वरलक्ष्मी व्रत", summary: { en: "Auspicious Lakshmi ritual performed by married women for family welfare and prosperity", te: "కుటుంబ సంక్షేమం మరియు శ్రేయస్సు కోసం వివాహిత మహిళలు చేసే పవిత్ర లక్ష్మీ వ్రతం", hi: "पारिवारिक कल्याण और समृद्धि के लिए विवाहित महिलाओं द्वारा किया जाने वाला शुभ लक्ष्मी अनुष्ठान" }, duration: { en: "2–3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "₹3,000", benefits: { en: ["Family welfare", "Wealth", "Husband's longevity"], te: ["కుటుంబ సంక్షేమం", "సంపద", "భర్త దీర్ఘాయువు"], hi: ["पारिवारिक कल्याण", "धन", "पति की लंबी उम्र"] }, image: vrathamImg, mode: "both", rating: "4.9" },
    { id: "shravana-masa-vrathalu", title: { en: "Shravana Masa Vrathalu", te: "శ్రావణ మాస వ్రతాలు", hi: "श्रावण मास व्रत" }, subtitle: "श्रावण मास व्रत", summary: { en: "Sacred monthly observances during the auspicious month of Shravana", te: "పవిత్రమైన శ్రావణ మాసంలో పవిత్ర నెలవారీ ఆచారాలు", hi: "श्रावण के शुभ महीने के दौरान पवित्र मासिक अनुष्ठान" }, duration: { en: "1–2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "₹2,000", benefits: { en: ["Monthly blessings", "Shiva devotion", "Fasting merit"], te: ["నెలవారీ ఆశీర్వాదాలు", "శివ భక్తి", "ఉపవాస యోగ్యత"], hi: ["मासिक आशीर्वाद", "शिव भक्ति", "उपवास की योग्यता"] }, image: vrathamImg, mode: "both", rating: "4.8" },
    { id: "karthika-deeparadhana", title: { en: "Karthika Deeparadhana", te: "కార్తీక దీపారాధన", hi: "कार्तिक दीपाराधना" }, subtitle: "कार्तिक दीपाराधना", summary: { en: "Festival of lights Shiva worship during the sacred month of Karthika", te: "పవిత్రమైన కార్తీక మాసంలో దీపాల పండుగ శివారాధన", hi: "कार्तिक के पवित्र महीने के दौरान रोशनी का त्योहार शिव पूजा" }, duration: { en: "1–2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "₹2,500", benefits: { en: ["Shiva blessings", "Removes darkness", "Spiritual merit"], te: ["శివుని ఆశీర్వాదాలు", "చీకటిని పారద్రోలుతుంది", "ఆధ్యాత్మిక యోగ్యత"], hi: ["शिव का आशीर्वाद", "अंधेरा दूर करता है", "आध्यात्मिक योग्यता"] }, image: vrathamImg, mode: "both", rating: "4.9" },
    { id: "ekadashi-poojas", title: { en: "Ekadashi Poojas", te: "ఏకాదశి పూజలు", hi: "एकादशी पूजा" }, subtitle: "एकादशी पूजा", summary: { en: "Bi-monthly Vishnu poojas on the sacred 11th lunar day for moksha and liberation", te: "మోక్షం కోసం పవిత్రమైన 11వ రోజున ద్వైమాసిక విష్ణు పూజలు", hi: "मोक्ष और मुक्ति के लिए पवित्र 11वें चंद्र दिन पर द्विमासिक विष्णु पूजा" }, duration: { en: "1–2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "₹2,000", benefits: { en: ["Moksha path", "Vishnu blessings", "Fasting merit"], te: ["మోక్ష మార్గం", "విష్ణువు ఆశీర్వాదం", "ఉపవాస యోగ్యత"], hi: ["मोक्ष मार्ग", "विष्णु का आशीर्वाद", "उपवास की योग्यता"] }, image: narayanavrathamImg, mode: "both", rating: "4.8" },
    { id: "all-devata-poojas", title: { en: "All Devata Poojas", te: "సర్వ దేవతా పూజలు", hi: "सभी देवता पूजा" }, subtitle: "सर्व देवता पूजा", summary: { en: "Custom poojas for any deity — Ganesha, Shiva, Vishnu, Devi, Surya and all Navagrahas", te: "వినాయకుడు, శివుడు, విష్ణువు, దేవి, సూర్యుడు మరియు నవగ్రహాలకు కస్టమ్ పూజలు", hi: "किसी भी देवता - गणेश, शिव, विष्णु, देवी, सूर्य और सभी नवग्रहों के लिए कस्टम पूजा" }, duration: { en: "As required", te: "అవసరమైన విధంగా", hi: "आवश्यकतानुसार" }, price: "Custom", benefits: { en: ["Deity-specific boons", "Flexible scheduling", "Custom rituals"], te: ["దేవతకు నిర్దిష్టమైన వరాలు", "సౌకర్యవంతమైన షెడ్యూలింగ్", "అనుకూల ఆచారాలు"], hi: ["देवता-विशिष्ट वरदान", "लचीला शेड्यूलिंग", "कस्टम अनुष्ठान"] }, image: navagrahaImg, mode: "both", rating: "4.9" },
  ],
  "Final & Memorial Rituals": [
    { id: "pinda-pradhanam", title: { en: "Pinda Pradhanam", te: "పిండప్రదానం", hi: "पिंड प्रदानम्" }, subtitle: "పిండప్రదానం", summary: { en: "Sacred offering of pindas for departed souls, performed for peace and onward journey", te: "పితృదేవతల శాంతి మరియు ఉత్తమ గతి కోసం నిర్వహించే పవిత్ర పిండప్రదానం", hi: "दिवंगत आत्मा की शांति और सद्गति के लिए किया जाने वाला पवित्र पिंड प्रदान" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Ancestor peace", "Pitru blessings", "Spiritual completion"], te: ["పితృ శాంతి", "పితృ ఆశీర్వాదం", "ఆధ్యాత్మిక సంపూర్ణత"], hi: ["पितृ शांति", "पितृ आशीर्वाद", "आध्यात्मिक पूर्णता"] }, image: pindaPoojaImg, mode: "offline", rating: "5.0" },
    { id: "masikam", title: { en: "Masikam", te: "మాసికం", hi: "मासिकम्" }, subtitle: "మాసికం", summary: { en: "Monthly memorial ritual observed after death as part of traditional Vedic rites", te: "మరణానంతరం సంప్రదాయ వేద కర్మల్లో భాగంగా నిర్వహించే మాసిక పితృకర్మ", hi: "मृत्यु के बाद वैदिक परंपरा के अनुसार किया जाने वाला मासिक श्राद्ध कर्म" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Monthly remembrance", "Ritual continuity", "Family peace"], te: ["మాసిక స్మరణ", "కర్మ కొనసాగింపు", "కుటుంబ శాంతి"], hi: ["मासिक स्मरण", "कर्म की निरंतरता", "परिवार की शांति"] }, image: pindaPoojaImg, mode: "offline", rating: "4.9" },
    { id: "thaddinam", title: { en: "Thaddinam", te: "తద్దినం", hi: "तद्दिनम्" }, subtitle: "తద్దినం", summary: { en: "Memorial rite performed on the prescribed day for departed ancestors", te: "పితృదేవతల కోసం నిర్ణీత దినాన నిర్వహించే సంప్రదాయ స్మార్త పితృకర్మ", hi: "दिवंगत पितरों के लिए निर्धारित तिथि पर किया जाने वाला पारंपरिक श्राद्ध कर्म" }, duration: { en: "1-2 hrs", te: "1-2 గంటలు", hi: "1-2 घंटे" }, price: "Contact", benefits: { en: ["Ancestor remembrance", "Pitru satisfaction", "Family blessings"], te: ["పితృ స్మరణ", "పితృ తృప్తి", "కుటుంబ ఆశీర్వాదం"], hi: ["पितृ स्मरण", "पितृ तृप्ति", "परिवार का आशीर्वाद"] }, image: pindaPoojaImg, mode: "offline", rating: "4.8" },
    { id: "annual-shraddham", title: { en: "Annual Shraddham", te: "వార్షిక శ్రాద్ధం", hi: "वार्षिक श्राद्धम्" }, subtitle: "వార్షిక శ్రాద్ధం", summary: { en: "Annual ancestral rite performed every year on the tithi for departed family members", te: "పితృదేవతల తిథి నాడు ప్రతి సంవత్సరం నిర్వహించే వార్షిక శ్రాద్ధ కర్మ", hi: "दिवंगत परिवारजनों की तिथि पर प्रत्येक वर्ष किया जाने वाला वार्षिक श्राद्ध" }, duration: { en: "2-3 hrs", te: "2-3 గంటలు", hi: "2-3 घंटे" }, price: "Contact", benefits: { en: ["Annual pitru blessings", "Family harmony", "Traditional observance"], te: ["వార్షిక పితృ ఆశీర్వాదం", "కుటుంబ సామరస్యం", "సంప్రదాయ ఆచరణ"], hi: ["वार्षिक पितृ आशीर्वाद", "परिवारिक सद्भाव", "परंपरागत पालन"] }, image: pindaPoojaImg, mode: "offline", rating: "4.9" },
  ],
};

const POOJA_DETAILS = {};

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useTiltEffect() {
  const cardRef = useRef(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const MAX_TILT = 6;
    let rafId = null;
    const onMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(900px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) translateY(-8px) scale(1.02)`;
        card.style.transition = 'transform 0.1s linear, box-shadow 0.1s linear';
      });
    };
    const onMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease';
    };
    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseleave', onMouseLeave);
    return () => { card.removeEventListener('mousemove', onMouseMove); card.removeEventListener('mouseleave', onMouseLeave); if (rafId) cancelAnimationFrame(rafId); };
  }, []);
  return cardRef;
}

function createRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  circle.className = 'ds-ripple';
  circle.style.left = `${e.clientX - rect.left}px`;
  circle.style.top = `${e.clientY - rect.top}px`;
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 700);
}

// ─── MODE BADGE ───────────────────────────────────────────────────────────────
function ModeBadge({ mode, ui }) {
  const map = {
    both: { label: ui.bothAvail, color: '#117A65', bg: 'rgba(17,122,101,0.12)', icon: '' },
    offline: { label: ui.offlineAvail, color: '#C8860C', bg: 'rgba(200,134,12,0.12)', icon: '' },
    temple: { label: ui.templePooja, color: '#784212', bg: 'rgba(120,66,18,0.12)', icon: '' },
    online: { label: ui.onlineAvail, color: '#1A5276', bg: 'rgba(26,82,118,0.12)', icon: '' },
  };
  const cfg = map[mode] || map.offline;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40`, borderRadius: 20, padding: '3px 10px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em' }}>
      <span>{cfg.icon}</span> {cfg.label}
    </span>
  );
}

// ─── RATING STARS ─────────────────────────────────────────────────────────────
function Stars({ rating }) {
  const r = parseFloat(rating) || 4.9;
  return (
    <span style={{ display: 'inline-flex', gap: 1, alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(r) ? '#F0C040' : '#ddd', fontSize: '0.7rem' }}>★</span>
      ))}
      <span style={{ color: '#8B6530', fontSize: '0.68rem', marginLeft: 2 }}>{r}</span>
    </span>
  );
}

// ─── SUB CARD ─────────────────────────────────────────────────────────────────
function SubCard({ pooja, language, ui, onSelect }) {
  const cardRef = useTiltEffect();
  return (
    <div className="ds-sub-card" ref={cardRef} onClick={() => onSelect(pooja)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onSelect(pooja)}>
      <div className="ds-sub-card-imgwrap">
        <img className="ds-sub-card-img" src={pooja.image} alt={t(pooja.title, language)} loading="lazy" />
        <div style={{ position: 'absolute', top: 10, right: 10 }}><ModeBadge mode={pooja.mode || 'offline'} ui={ui} /></div>
        <div className="ds-sub-card-rating-pill"><Stars rating={pooja.rating} /></div>
      </div>
      <div className="ds-sub-card-body">
        <h3 className="ds-sub-card-title">{t(pooja.title, language)}</h3>
        <p className="ds-sub-card-desc">{t(pooja.summary, language)}</p>
        <div className="ds-sub-card-meta">
          <span className="ds-meta-tag">⏱ {t(pooja.duration, language)}</span>
          <span className="ds-meta-tag ds-price-tag">{pooja.price}</span>
        </div>
        <div className="ds-sub-card-benefits">
          {(t(pooja.benefits, language) || []).slice(0, 3).map(b => <span className="ds-benefit-chip" key={b}>{b}</span>)}
        </div>
        <button className="ds-card-btn" onClick={e => { e.stopPropagation(); createRipple(e); onSelect(pooja); }}>
          <span>{ui.readMore}</span><span style={{ marginLeft: 6 }}>→</span>
        </button>
      </div>
    </div>
  );
}

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ds-faq-item">
      <div className="ds-faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className={`ds-faq-arrow${open ? ' open' : ''}`}>▼</span>
      </div>
      <div className={`ds-faq-body${open ? ' open' : ''}`}>
        <div className="ds-faq-a">{a}</div>
      </div>
    </div>
  );
}

// Small local copy of the advance-amount logic used on the main Booking page,
// so this quick modal doesn't need to import across files.
function quickAdvanceAmount(poojaType = "") {
  const lower = poojaType.toLowerCase();
  if (lower.includes('homam') || lower.includes('havan')) return 1000;
  if (lower.includes('muhurtham') || lower.includes('kalyanam')) return 700;
  return 500;
}

function newBookingId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'bk_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
function BookingModal({ onClose, poojaName = "", language = "en", user }) {
  const ui = UI_TEXT[language] || UI_TEXT.en;
  const [form, setForm] = useState({ name: "", phone: "", date: "", city: "", type: "offline" });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (!user) {
      setError("Please login to book a pooja.");
      return;
    }
    setError("");
    setSaving(true);
    const id = newBookingId();
    const nowIso = new Date().toISOString();
    try {
      await setDoc(doc(db, "booking_requests", id), {
        // security-rule ownership + admin panel fields
        uid: user.uid,
        booking_id: id,
        customer_name: form.name,
        customer_email: user.email || "",
        customer_phone: form.phone,
        service_name: poojaName || "Pooja Booking",
        price: quickAdvanceAmount(poojaName),
        booking_date: form.date,
        booking_time: "",
        booking_status: "pending",
        payment_status: "unpaid",
        invoice_number: "",
        // extra site-specific fields
        city: form.city,
        mode: form.type, // 'offline' (home visit) or 'online'
        source: "services_quick_booking_modal",
        created_at: nowIso,
        // backward-compatible fields for MyBookings.jsx
        userId: user.uid,
        createdAt: nowIso,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Quick booking save failed:", err);
      setError("Something went wrong saving your request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ds-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ds-modal">
        <div className="ds-modal-head">
          <span> {ui.bookPooja}{poojaName ? ` — ${poojaName}` : ''}</span>
          <button className="ds-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ds-modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
              <p style={{ fontWeight: 700, color: 'var(--ds-maroon)', marginBottom: '0.5rem' }}>{ui.jaiSrimannarayana}</p>
              <p style={{ color: 'var(--ds-text)', lineHeight: 1.6 }}>Your booking request has been received. Sri Daruri Vishnuvardhana Charyulu will contact you shortly at <strong>{form.phone}</strong>.</p>
            </div>
          ) : (
            <>
              <div className="ds-form-row">
                <label className="ds-label">Service Type</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['offline', 'online'].map(ty => (
                    <button key={ty} onClick={() => setForm(f => ({ ...f, type: ty }))} style={{ flex: 1, padding: '0.5rem', border: `2px solid ${form.type === ty ? 'var(--ds-gold)' : 'var(--ds-border)'}`, borderRadius: 6, background: form.type === ty ? 'var(--ds-gold-pale)' : '#fff', color: 'var(--ds-maroon)', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s' }}>
                      {ty === 'offline' ? ' Home Visit' : ' Online Video'}
                    </button>
                  ))}
                </div>
              </div>
              {[{ label: 'Your Name', key: 'name', ph: 'Enter full name' }, { label: 'Phone Number', key: 'phone', ph: '+91 98765 43210' }, { label: 'City / Location', key: 'city', ph: 'Hyderabad, Secunderabad...' }].map(f => (
                <div className="ds-form-row" key={f.key}>
                  <label className="ds-label">{f.label}</label>
                  <input className="ds-input" placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="ds-form-row">
                <label className="ds-label">Preferred Date</label>
                <input className="ds-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              {error && <p style={{ color: '#b91c1c', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>}
              <button className="ds-submit-btn" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ONLINE STEPS SECTION ─────────────────────────────────────────────────────
function OnlineStepsSection({ ui }) {
  const steps = [
    { n: '01', label: ui.step1, icon: '1' },
    { n: '02', label: ui.step2, icon: '2' },
    { n: '03', label: ui.step3, icon: '3' },
    { n: '04', label: ui.step4, icon: '4' },
    { n: '05', label: ui.step5, icon: '5' },
  ];
  return (
    <section className="ds-online-section">
      <div className="ds-online-inner">
        <h2 className="ds-section-title">{ui.howOnlineWorks}</h2>
        <p className="ds-section-desc">{ui.onlineDesc}</p>
        <div className="ds-steps-row">
          {steps.map((s, i) => (
            <div className="ds-step" key={s.n} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="ds-step-icon">{s.icon}</div>
              
              <div className="ds-step-label">{s.label}</div>
              {i < steps.length - 1 && <div className="ds-step-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TRUST SECTION ────────────────────────────────────────────────────────────
function TrustSection({ ui }) {
  const stats = [
    { icon: '‍', value: '50+', label: ui.verifiedPriests },
    { icon: '', value: '100%', label: ui.securePay },
    { icon: '', value: '24/7', label: ui.support247 },
    { icon: '', value: '5000+', label: ui.successPoojas },
    { icon: '⭐', value: '4.9/5', label: ui.satisfaction },
    { icon: '', value: 'Global', label: ui.onlineOffline },
  ];
  return (
    <section className="ds-trust-section">
      <h2 className="ds-section-title" style={{ color: '#fff' }}>{ui.trustTitle}</h2>
      <div className="ds-trust-grid">
        {stats.map((s, i) => (
          <div className="ds-trust-card" key={s.label} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="ds-trust-icon">{s.icon}</div>
            <div className="ds-trust-value">{s.value}</div>
            <div className="ds-trust-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── BREADCRUMB ───────────────────────────────────────────────────────────────
function Breadcrumb({ items }) {
  return (
    <div className="ds-breadcrumb">
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span style={{ color: 'var(--ds-gold)', margin: '0 2px' }}>›</span>}
          <span className={i === items.length - 1 ? 'ds-bc-active' : 'ds-bc-link'} onClick={item.onClick} style={{ cursor: item.onClick ? 'pointer' : 'default' }}>{item.label}</span>
        </span>
      ))}
    </div>
  );
}

// ─── LEVEL 1 — HERO + CATEGORIES ─────────────────────────────────────────────
function Level1({ onSelectCategory, onBook, initialSearch = "" }) {
  const { language } = useLanguage();
  const ui = UI_TEXT[language] || UI_TEXT.en;
  const [search, setSearch] = useState(initialSearch);

  const filtered = CATEGORIES.filter(c =>
    t(c.title, language).toLowerCase().includes(search.toLowerCase()) ||
    t(c.description, language).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* HERO */}
      <section className="ds-hero">
        <div className="ds-hero-content-side">
          <div className="ds-hero-content">
            <div className="ds-hero-tag"> {ui.heroTag}</div>
            <h1 className="ds-hero-title">
              {ui.heroTitleMain}<span className="ds-hero-em">{ui.heroTitleEm}</span>{ui.heroTitleSuffix}
            </h1>
            <p className="ds-hero-desc">{ui.heroDesc}</p>
            <p className="ds-hero-subdesc">{ui.heroSubDesc}</p>
            <div className="ds-hero-ctas">
              <button className="ds-btn-gold" onClick={onBook} onMouseDown={createRipple}>
                <span></span> {ui.bookOffline}
              </button>
              <button className="ds-btn-outline" onClick={onBook} onMouseDown={createRipple}>
                <span></span> {ui.joinOnline}
              </button>
            </div>
            <div className="ds-hero-stats">
              {[['5000+', ui.poojas], ['50+', ui.priests], ['4.9★', ui.rating]].map(([v, l]) => (
                <div className="ds-hero-stat" key={l}><span className="ds-hero-stat-val">{v}</span><span className="ds-hero-stat-lbl">{l}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + CATEGORIES */}
      <section className="ds-cats-section">
       
        <h2 className="ds-section-title">{ui.allServices}</h2>
        <div className="ds-search-bar">
          <span className="ds-search-icon"></span>
          <input className="ds-search-input" placeholder={ui.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="ds-cats-grid">
          {filtered.map((cat, idx) => (
            <div className="ds-cat-card" key={cat.id} onClick={() => onSelectCategory(cat)} style={{ animationDelay: `${idx * 0.06}s` }}>
              <div className="ds-cat-img-wrap">
                <img className="ds-cat-img" src={cat.image} alt={t(cat.title, language)} loading="lazy" />
                <div className="ds-cat-overlay" />
                <div className="ds-cat-icon-overlay">{cat.icon}</div>
              </div>
              <div className="ds-cat-body">
                <h3 className="ds-cat-title">{t(cat.title, language)}</h3>
                <p className="ds-cat-desc">{t(cat.description, language)}</p>
                <button className="ds-cat-btn">{ui.viewDetails}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW ONLINE WORKS */}
      <OnlineStepsSection ui={ui} />

      {/* TRUST */}
      <TrustSection ui={ui} />

      {/* FAQ */}
      <section className="ds-faq-section">
        
        <h2 className="ds-section-title">{ui.faqs}</h2>
        <div className="ds-faq-list">
          {[
            [ui.faqOnline, ui.faqOnlineA],
            [ui.faqCountry, ui.faqCountryA],
            [ui.faqItems, ui.faqItemsA],
            [ui.faqRecording, ui.faqRecordingA],
            [ui.faqPriests, ui.faqPriestsA],
          ].map(([q, a], i) => <FAQItem key={i} q={q} a={a} />)}
        </div>
      </section>

      {/* CUSTOM POOJA CTA */}
      <div className="ds-cta-banner">
        <div className="ds-cta-content">
          <p style={{ color: 'rgba(255,255,255,0.88)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>{ui.notFinding}</p>
          <button className="ds-btn-gold" onClick={onBook} onMouseDown={createRipple}>{ui.callUs}</button>
        </div>
      </div>
    </div>
  );
}

// ─── LEVEL 2 — SUB POOJAS ─────────────────────────────────────────────────────
function Level2({ category, onBack, onSelectPooja }) {
  const { language } = useLanguage();
  const ui = UI_TEXT[language] || UI_TEXT.en;
  const [search, setSearch] = useState("");
  const poojas = SUB_POOJAS[category.id] || [];
  const query = search.toLowerCase();
  const filtered = poojas.filter(p =>
    t(p.title, language).toLowerCase().includes(query) ||
    t(p.summary, language).toLowerCase().includes(query)
  );

  return (
    <div>
      <Breadcrumb items={[{ label: ui.allServices, onClick: onBack }, { label: t(category.title, language) }]} />
      <div className="ds-l2-hero" style={{ background: `linear-gradient(135deg, ${category.color}22 0%, var(--ds-cream) 100%)` }}>
        <div className="ds-l2-hero-icon">{category.icon}</div>
        <div>
          
          <h1 className="ds-l2-title">{t(category.title, language)}</h1>
          <p className="ds-l2-desc">{t(category.description, language)}</p>
        </div>
      </div>
      <div className="ds-search-bar" style={{ margin: '0 2rem 0.5rem' }}>
        <span className="ds-search-icon"></span>
        <input className="ds-search-input" placeholder={`${ui.searchWithin} ${t(category.title, language)}...`} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="ds-sub-grid">
        {filtered.map((pooja) => (
          <SubCard key={pooja.id} pooja={pooja} language={language} ui={ui} onSelect={onSelectPooja} />
        ))}
      </div>
    </div>
  );
}

// ─── LEVEL 3 — DETAIL PAGE ────────────────────────────────────────────────────
function Level3({ category, pooja, onBackToL1, onBackToL2, onBook }) {
  const { language } = useLanguage();
  const ui = UI_TEXT[language] || UI_TEXT.en;

  const defaultDetails = {
    about: { en: `${t(pooja.title, 'en')} is a sacred Vedic ritual performed according to shastrokta paddhati. This pooja invokes divine blessings, removes obstacles, and ensures prosperity for the performer and their family. Sri Daruri Vishnuvardhana Charyulu performs this with utmost devotion and Vedic precision.`, te: `${t(pooja.title, 'te')} అనేది శాస్త్రోక్త పద్ధతి ప్రకారం నిర్వహించబడే పవిత్ర వేద కర్మ.`, hi: `${t(pooja.title, 'hi')} एक पवित्र वैदिक अनुष्ठान है।` },
    importance: { en: "This pooja holds immense significance in Hindu tradition. Regular performance ensures divine grace, removes planetary afflictions, and brings peace, prosperity and spiritual merit to the family.", te: "హిందూ సంప్రదాయంలో ఈ పూజకు ఎంతో ప్రాముఖ్యత ఉంది.", hi: "हिंदू परंपरा में इस पूजा का अत्यधिक महत्व है।" },
    bestTime: { en: "Contact our priest for the most auspicious muhurtham based on your birth star, date and purpose.", te: "మీ జన్మ నక్షత్రం ఆధారంగా ముహూర్తం కోసం మా పండితుడిని సంప్రదించండి.", hi: "अपने जन्म नक्षत्र के आधार पर मुहूर्त के लिए हमारे पंडित जी से संपर्क करें।" },
    samagri: { en: ["Flowers 2 kg", "Fruits 5 varieties", "Betel leaves 120", "Kalasha (copper pot)", "Incense and camphor", "Cloth pieces", "Coconut 5", "Turmeric and kumkum"], te: ["పూలు 2 కిలోలు", "పండ్లు 5 రకాలు", "తమలపాకులు 120", "కలశం", "ధూపం మరియు కర్పూరం", "వస్త్ర ముక్కలు", "కొబ్బరికాయలు 5", "పసుపు మరియు కుంకుమ"], hi: ["फूल 2 किलो", "फल 5 प्रकार", "पान के पत्ते 120", "कलश", "अगरबत्ती और कपूर", "कपड़े के टुकड़े", "नारियल 5", "हल्दी और कुमकुम"] },
    process: [
      { step: "1", title: { en: "Ganapathi Pooja", te: "గణపతి పూజ", hi: "गणपति पूजा" }, desc: { en: "Invocation of obstacle-remover Lord Ganesha", te: "విఘ్నాలను తొలగించే వినాయకుడి ఆవాహన", hi: "विघ्नहर्ता भगवान गणेश का आह्वान" } },
      { step: "2", title: { en: "Sankalpa", te: "సంకల్పం", hi: "संकल्प" }, desc: { en: "Statement of intent by the yajamana", te: "యజమాని ద్వారా సంకల్పం", hi: "यजमान द्वारा संकल्प" } },
      { step: "3", title: { en: "Main Pooja", te: "ప్రధాన పూజ", hi: "मुख्य पूजा" }, desc: { en: "Core ritual with mantras and offerings", te: "మంత్రాలు మరియు నైవేద్యాలతో ప్రధాన కర్మ", hi: "मंत्रों और प्रसाद के साथ मुख्य अनुष्ठान" } },
      { step: "4", title: { en: "Mangala Arati", te: "మంగళ హారతి", hi: "मंगल आरती" }, desc: { en: "Conclusion with lamps and prasad distribution", te: "దీపాలు మరియు ప్రసాదం పంపిణీతో ముగింపు", hi: "दीपक और प्रसाद वितरण के साथ समापन" } },
    ],
    faqs: [
      { q: { en: "How long does this pooja take?", te: "ఈ పూజకు ఎంత సమయం పడుతుంది?", hi: "इस पूजा में कितना समय लगता है?" }, a: { en: `This pooja typically takes ${t(pooja.duration, 'en')}.`, te: `ఈ పూజకు సాధారణంగా ${t(pooja.duration, 'te')} పడుతుంది.`, hi: `इस पूजा में आमतौर पर ${t(pooja.duration, 'hi')} लगते हैं।` } },
      { q: { en: "What is the pricing?", te: "ధర ఎంత?", hi: "कीमत क्या है?" }, a: { en: `Starting price is ${pooja.price}. Call 8179960741 for exact pricing.`, te: `ప్రారంభ ధర ${pooja.price}. ఖచ్చితమైన ధర కోసం 8179960741 కు కాల్ చేయండి.`, hi: `शुरुआती कीमत ${pooja.price} है। सटीक मूल्य के लिए 8179960741 पर कॉल करें।` } },
      { q: { en: "Can I book this service online?", te: "ఈ సేవను ఆన్లైన్‌లో బుక్ చేయవచ్చా?", hi: "क्या मैं यह सेवा ऑनलाइन बुक कर सकता हूं?" }, a: { en: "Yes! You can book via WhatsApp, phone call, or our website. We will confirm the booking within 2 hours.", te: "అవును! మీరు వాట్సాప్, ఫోన్ లేదా మా వెబ్‌సైట్ ద్వారా బుక్ చేయవచ్చు.", hi: "हां! आप व्हाट्सएप, फोन या हमारी वेबसाइट के माध्यम से बुक कर सकते हैं।" } },
    ],
    packages: [
      { name: { en: "Standard", te: "ప్రామాణికం", hi: "मानक" }, price: pooja.price, features: { en: ["1 Pandit", `${t(pooja.duration, 'en')}`, "All mantras", "Prasad preparation"], te: ["1 పండితుడు", `${t(pooja.duration, 'te')}`, "అన్ని మంత్రాలు", "ప్రసాదం తయారీ"], hi: ["1 पंडित", `${t(pooja.duration, 'hi')}`, "सभी मंत्र", "प्रसाद की तैयारी"] } },
      { name: { en: "Premium", te: "ప్రీమియం", hi: "प्रीमियम" }, price: "Contact", features: { en: ["2+ Pandits", "Extended rituals", "Video recording", "Premium samagri"], te: ["2+ పండితులు", "విస్తరించిన కర్మలు", "వీడియో రికార్డింగ్", "ప్రీమియం సామాగ్రి"], hi: ["2+ पंडित", "विस्तारित अनुष्ठान", "वीडियो रिकॉर्डिंग", "प्रीमियम सामग्री"] } },
    ],
    testimonials: [
      { name: "Srinivasa Rao", city: "Hyderabad", rating: 5, text: { en: "Exceptional service by Sri Vishnuvardhana Charyulu. Highly recommended!", te: "శ్రీ విష్ణువర్ధన చార్యులు గారి అసాధారణ సేవ. అత్యంత సిఫార్సు చేయబడింది!", hi: "श्री विष्णुवर्धन चार्युलु द्वारा असाधारण सेवा। अत्यधिक अनुशंसित!" } },
      { name: "Lakshmi Devi", city: "Warangal", rating: 5, text: { en: "Joined the online pooja from USA and it felt like being present there. Divine experience!", te: "USA నుండి ఆన్లైన్ పూజలో చేరాను, అక్కడ ఉన్నట్లే అనిపించింది. దివ్యమైన అనుభవం!", hi: "USA से ऑनलाइन पूजा में शामिल हुई और वहाँ मौजूद होने जैसा महसूस हुआ!" } },
    ],
    priest: { name: "Daruri Vishnuvardhana Charyulu", exp: "15+ years", phone: "8179960741", instagram: "@vishnu_daruri", specialization: "Vedic rituals, Vaishnava tradition" },
  };

  const details = (POOJA_DETAILS && POOJA_DETAILS[pooja.id]) ? POOJA_DETAILS[pooja.id] : defaultDetails;

  return (
    <div>
      <Breadcrumb items={[
        { label: ui.allServices, onClick: onBackToL1 },
        { label: t(category.title, language), onClick: onBackToL2 },
        { label: t(pooja.title, language) },
      ]} />
      <div className="ds-l3-hero">
        <img src={pooja.image} alt={t(pooja.title, language)} className="ds-l3-hero-img" />
        <div className="ds-l3-hero-overlay" />
        <div className="ds-l3-hero-content">
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <ModeBadge mode={pooja.mode || 'offline'} ui={ui} />
            <Stars rating={pooja.rating} />
          </div>
          <h1 className="ds-l3-hero-title">{t(pooja.title, language)}</h1>
          <p className="ds-l3-hero-sub">{t(pooja.summary, language)}</p>
          <div className="ds-l3-ctas">
            <button className="ds-btn-gold" onClick={onBook} onMouseDown={createRipple}>{ui.bookNow}</button>
            <a className="ds-btn-outline" href="tel:8179960741">{ui.callPriest}</a>
            <a className="ds-btn-outline" href="https://wa.me/918179960741" target="_blank" rel="noreferrer">{ui.whatsapp}</a>
          </div>
        </div>
      </div>

      <div className="ds-l3-layout">
        <div className="ds-l3-main">
          {/* About */}
          <div className="ds-section-card">
            <div className="ds-section-card-head"> {ui.aboutPooja}</div>
            <div className="ds-section-card-body"><p>{t(details.about, language)}</p></div>
          </div>
          {/* Importance */}
          <div className="ds-section-card">
            <div className="ds-section-card-head">✨ {ui.importance}</div>
            <div className="ds-section-card-body">
              <p>{t(details.importance, language)}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {(t(pooja.benefits, language) || []).map(b => <span key={b} className="ds-benefit-chip ds-benefit-chip-lg">{b}</span>)}
              </div>
            </div>
          </div>
          {/* Best Time */}
          <div className="ds-section-card">
            <div className="ds-section-card-head"> {ui.bestTime}</div>
            <div className="ds-section-card-body"><p>{t(details.bestTime, language)}</p></div>
          </div>
          {/* Samagri */}
          <div className="ds-section-card">
            <div className="ds-section-card-head"> {ui.samagri}</div>
            <div className="ds-section-card-body">
              <p style={{ marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--ds-text-light)' }}>{ui.samagriNote}</p>
              <div className="ds-samagri-grid">
                {(t(details.samagri, language) || []).map((item, i) => (
                  <div className="ds-samagri-item" key={i}><span className="ds-samagri-dot" />{item}</div>
                ))}
              </div>
            </div>
          </div>
          {/* Process */}
          <div className="ds-section-card">
            <div className="ds-section-card-head"> {ui.process}</div>
            <div className="ds-section-card-body">
              <div className="ds-process-steps">
                {details.process.map(step => (
                  <div className="ds-process-step" key={step.step}>
                    <div className="ds-step-num-circle">{step.step}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--ds-maroon)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{t(step.title, language)}</div>
                      <div style={{ color: 'var(--ds-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t(step.desc, language)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Packages */}
          <div className="ds-section-card">
            <div className="ds-section-card-head"> {ui.pricingPackages}</div>
            <div className="ds-section-card-body">
              <div className="ds-packages-grid">
                {details.packages.map((pkg, i) => (
                  <div className={`ds-package-card${i === 1 ? ' ds-package-featured' : ''}`} key={i}>
                    {i === 1 && <div className="ds-pkg-popular">POPULAR</div>}
                    <div className="ds-pkg-name">{t(pkg.name, language)}</div>
                    <div className="ds-pkg-price">{pkg.price}</div>
                    <ul className="ds-pkg-features">
                      {(t(pkg.features, language) || []).map(f => <li key={f}><span style={{ color: 'var(--ds-gold)' }}>✓</span> {f}</li>)}
                    </ul>
                    <button className="ds-pkg-btn" onClick={onBook}>{ui.bookPackage}</button>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ds-text-light)', textAlign: 'center' }}>{ui.travelNoteMain}</p>
            </div>
          </div>
          {/* Testimonials */}
          <div className="ds-section-card">
            <div className="ds-section-card-head"> {ui.testimonials}</div>
            <div className="ds-section-card-body">
              <div className="ds-testi-grid">
                {details.testimonials.map((testi, i) => (
                  <div className="ds-testi-card" key={i}>
                    <div style={{ marginBottom: '0.5rem' }}><Stars rating={testi.rating} /></div>
                    <p className="ds-testi-text">"{t(testi.text, language)}"</p>
                    <div style={{ fontWeight: 700, color: 'var(--ds-maroon)', fontSize: '0.82rem' }}>{testi.name}</div>
                    <div style={{ color: 'var(--ds-text-light)', fontSize: '0.7rem' }}>{testi.city}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* FAQ */}
          <div className="ds-section-card">
            <div className="ds-section-card-head">❓ {ui.faqs}</div>
            <div className="ds-section-card-body">
              {details.faqs.map((faq, i) => <FAQItem key={i} q={t(faq.q, language)} a={t(faq.a, language)} />)}
            </div>
          </div>
          {/* Priest */}
          <div className="ds-section-card">
            <div className="ds-section-card-head">‍⚕️ {ui.yourPriest}</div>
            <div className="ds-section-card-body">
              <div className="ds-priest-card">
                <div className="ds-priest-avatar"></div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ds-maroon)', marginBottom: '0.25rem' }}>{details.priest.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ds-text)' }}> {details.priest.phone}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ds-text)' }}> {details.priest.instagram}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ds-text)' }}>⏳ {details.priest.exp} experience</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ds-text-light)', fontStyle: 'italic', marginTop: '0.25rem' }}>{details.priest.specialization}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Related */}
          <div className="ds-section-card">
            <div className="ds-section-card-head"> {ui.relatedPoojas}</div>
            <div className="ds-section-card-body">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {(SUB_POOJAS[category.id] || []).filter(p => p.id !== pooja.id).slice(0, 4).map(rel => (
                  <span key={rel.id} className="ds-related-tag">{t(rel.title, language)} →</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="ds-l3-sidebar">
          <div className="ds-sidebar-card">
            <div className="ds-sidebar-head"> {ui.quickBooking}</div>
            <div className="ds-sidebar-body">
              <div className="ds-sidebar-price">
                <div className="ds-sidebar-price-lbl">{ui.startingFrom}</div>
                <div className="ds-sidebar-price-val">{pooja.price}</div>
              </div>
              <div className="ds-sidebar-divider" />
              <div className="ds-sidebar-info">
                {[
                  [ui.duration, t(pooja.duration, language)],
                  [ui.category, t(category.title, language)],
                  [ui.languageLabel, ui.languageVal],
                  [ui.location, ui.locationVal],
                ].map(([lbl, val]) => (
                  <div className="ds-sidebar-row" key={lbl}>
                    <span className="ds-sidebar-row-lbl">{lbl}</span>
                    <span className="ds-sidebar-row-val">{val}</span>
                  </div>
                ))}
              </div>
              <div className="ds-sidebar-divider" />
              <button className="ds-sidebar-btn ds-sidebar-btn-gold" onClick={onBook} onMouseDown={createRipple}>{ui.bookNow}</button>
              <a className="ds-sidebar-btn ds-sidebar-btn-wa" href="https://wa.me/918179960741" target="_blank" rel="noreferrer"> {ui.whatsappEnquiry}</a>
              <a className="ds-sidebar-btn ds-sidebar-btn-call" href="tel:8179960741"> {ui.callUs}</a>
              <p className="ds-sidebar-note">{ui.jaiSrimannarayana}<br />{ui.comingSoon}</p>
            </div>
          </div>
          <div className="ds-sidebar-travel">
            <div style={{ fontWeight: 700, color: 'var(--ds-maroon)', marginBottom: '0.5rem', fontSize: '0.82rem' }}> {ui.travelNoteTitle}</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--ds-text)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{ui.travelNoteText}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
const getSearchFromUrl = () => {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('search')?.trim() || '';
};

export default function ServicesModule() {
  const [level, setLevel] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();
  const [initialSearch, setInitialSearch] = useState(() => getSearchFromUrl());
  const { language } = useLanguage();

  useEffect(() => {
    const syncSearch = () => {
      const query = getSearchFromUrl();
      setInitialSearch(query);
      if (query) { setLevel(1); setSelectedCategory(null); setSelectedPooja(null); }
    };
    window.addEventListener('popstate', syncSearch);
    window.addEventListener('app:navigate', syncSearch);
    return () => { window.removeEventListener('popstate', syncSearch); window.removeEventListener('app:navigate', syncSearch); };
  }, []);

  const goToL1 = useCallback(() => { setLevel(1); setSelectedCategory(null); setSelectedPooja(null); }, []);
  const goToL2 = useCallback((cat) => { setSelectedCategory(cat); setLevel(2); setSelectedPooja(null); }, []);
  const goToL3 = useCallback((pooja) => { setSelectedPooja(pooja); setLevel(3); }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [level]);

  const handleBook = useCallback(() => {
    if (!user) { setShowLogin(true); showToast('Please login to continue booking poojas.', 'info'); }
    else setShowBooking(true);
  }, [user]);

  return (
    <>
      <div className="ds-app">
        {level === 1 && <Level1 initialSearch={initialSearch} onSelectCategory={goToL2} onBook={handleBook} />}
        {level === 2 && selectedCategory && <Level2 category={selectedCategory} onBack={goToL1} onSelectPooja={goToL3} />}
        {level === 3 && selectedCategory && selectedPooja && <Level3 category={selectedCategory} pooja={selectedPooja} onBackToL1={goToL1} onBackToL2={() => goToL2(selectedCategory)} onBook={handleBook} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        {showBooking && <BookingModal poojaName={selectedPooja ? t(selectedPooja.title, 'en') : ""} onClose={() => setShowBooking(false)} language={language} user={user} />}
      </div>
    </>
  );
}
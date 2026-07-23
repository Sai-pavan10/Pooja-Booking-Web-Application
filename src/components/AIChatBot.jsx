﻿import { useState, useEffect, useRef, useCallback } from 'react';
import './AIChatBot.css';
import logo from '../assets/logo.PNG';
import { useLanguage } from '../i18n';

// ── Service Knowledge Base ──────────────────────────────────────────────────
const SERVICES = {
  // Gruha Pravesham Category
  bhoomi_pooja: {
    name: 'Bhoomi Pooja',
    subtitle: 'Sacred Land Worship',
    emoji: '',
    description: 'Sacred ground-breaking ceremony before construction, seeking Mother Earth\'s blessings to remove Vastu doshas and ensure structural stability.',
    keywords: ['bhoomi', 'bhoomi pooja', 'land', 'construction', 'ground breaking', 'bhumi'],
  },
  vastu_shanti: {
    name: 'Vastu Shanti',
    subtitle: 'Harmony & Energy Cleansing',
    emoji: '',
    description: 'Harmonize the five elements in your home and eliminate all directional doshas for peace, harmony, and positive energy flow.',
    keywords: ['vastu', 'vastu shanti', 'energy', 'negative', 'harmony', 'home', 'cleanse', 'house'],
  },
  gruha_pravesham: {
    name: 'Gruha Pravesham',
    subtitle: 'House Warming Ceremony',
    emoji: '',
    description: 'Auspicious home entry ceremony with Vedic mantras, Ganapathi pooja and Vastu rituals for family prosperity.',
    keywords: ['gruha pravesham', 'griha pravesh', 'house warming', 'new house', 'home entry'],
  },
  shanku_sthapana: {
    name: 'Shanku Sthapana',
    subtitle: 'Sacred Foundation-Laying',
    emoji: '',
    description: 'A traditional ritual performed before construction begins to invoke divine blessings for stability, success, and harmony.',
    keywords: ['shanku', 'sthapana', 'foundation', 'foundation laying', 'divine', 'stability'],
  },

  // Child Rituals
  garbhadhana: {
    name: 'Garbhadhana',
    subtitle: 'Sacred Conception Ritual',
    emoji: '',
    description: 'Sacred conception samskara seeking divine blessings for a healthy and virtuous child.',
    keywords: ['garbhadhana', 'conception', 'child', 'conception ritual', 'parenthood'],
  },
  pumsavana: {
    name: 'Pumsavana',
    subtitle: 'Prenatal Blessing Ceremony',
    emoji: '',
    description: 'Prenatal samskara performed for the well-being and healthy development of the baby.',
    keywords: ['pumsavana', 'pregnancy', 'blessing', 'unborn', 'prenatal'],
  },
  seemantham: {
    name: 'Seemantham',
    subtitle: 'Traditional Baby Shower',
    emoji: '',
    description: 'Traditional ceremony for expecting mothers, invoking blessings for safe delivery.',
    keywords: ['seemantham', 'baby shower', 'pregnant', 'delivery', 'baby', 'expecting'],
  },
  jatakarma: {
    name: 'Jatakarma',
    subtitle: 'Birth Ceremony',
    emoji: '',
    description: 'Birth ceremony welcoming the newborn with Vedic mantras and blessings.',
    keywords: ['jatakarma', 'birth', 'newborn', 'welcome baby'],
  },
  namakarana: {
    name: 'Namakarana',
    subtitle: 'Naming Ceremony',
    emoji: '',
    description: 'Naming ceremony for the child with horoscope-based blessings and family rituals.',
    keywords: ['namakarana', 'namkaran', 'naming', 'name', 'baby name'],
  },
  annaprashana: {
    name: 'Annaprashana',
    subtitle: 'First-Rice Feeding',
    emoji: '',
    description: 'First-rice feeding ceremony blessing the child\'s nourishment, health, and growth.',
    keywords: ['annaprashana', 'annaprashan', 'first rice', 'feeding', 'solid food'],
  },
  choula: {
    name: 'Choula / Mundan',
    subtitle: 'First Tonsure Ceremony',
    emoji: '✂️',
    description: 'First tonsure ceremony performed for purification, health, and spiritual growth.',
    keywords: ['choula', 'mundan', 'tonsure', 'hair cut', 'first haircut'],
  },
  aksharabhyasam: {
    name: 'Aksharabhyasam',
    subtitle: 'Initiation into Learning',
    emoji: '',
    description: 'Initiation into learning, invoking Saraswati Devi for knowledge and wisdom.',
    keywords: ['aksharabhyasam', 'learning', 'education', 'saraswati', 'vidyarambham'],
  },
  upanayanam: {
    name: 'Upanayanam',
    subtitle: 'Sacred Thread Ceremony',
    emoji: '',
    description: 'Sacred thread ceremony marking spiritual initiation and Vedic learning.',
    keywords: ['upanayanam', 'thread ceremony', 'sacred thread', 'janeu', 'yajnopavitam'],
  },

  // Homam Services
  sudarshana_homam: {
    name: 'Sudarshana Narasimha Homam',
    subtitle: 'Protective Fire Ritual',
    emoji: '',
    description: 'Powerful protective homam invoking Lord Sudarshana and Narasimha to destroy evil forces and black magic.',
    keywords: ['sudarshana', 'narasimha', 'homam', 'havan', 'protection', 'evil eye', 'black magic'],
  },
  chandi_homam: {
    name: 'Chandi Homam',
    subtitle: 'Supreme Goddess Ritual',
    emoji: '',
    description: 'Supreme goddess ritual invoking Devi Chandi for ultimate protection, power, and removing enemies.',
    keywords: ['chandi', 'chandi homam', 'devi', 'goddess', 'ultimate protection'],
  },
  ganapathi_homam: {
    name: 'Ganapathi Homam',
    subtitle: 'Obstacle Removal',
    emoji: '',
    description: 'Invocation of Lord Ganesha to remove obstacles and ensure success in all endeavors.',
    keywords: ['ganapathi', 'ganesh', 'ganapati', 'homam', 'obstacles', 'success'],
  },
  navagraha_homam: {
    name: 'Navagraha Homam',
    subtitle: 'Nine-Planet Pacification',
    emoji: '',
    description: 'Nine-planet fire ceremony to balance planetary influences, bring harmony, and career growth.',
    keywords: ['navagraha', 'nine planets', 'planets', 'homam', 'astrology', 'dosha'],
  },
  lakshmi_homam: {
    name: 'Lakshmi Homam',
    subtitle: 'Wealth & Prosperity',
    emoji: '',
    description: 'Sacred fire ritual to invoke Goddess Lakshmi for wealth, prosperity, and abundance.',
    keywords: ['lakshmi', 'homam', 'wealth', 'prosperity', 'money', 'business'],
  },
  mrityunjaya_homam: {
    name: 'Mrityunjaya Homam',
    subtitle: 'Life-Saving Ritual',
    emoji: '️',
    description: 'Invoking Lord Shiva to conquer illness, fear, and death — a life-saving ritual for health recovery.',
    keywords: ['mrityunjaya', 'maha mrityunjaya', 'shiva', 'health', 'healing', 'homam', 'life saving'],
  },
  putrakameshti_homam: {
    name: 'Putrakameshti Homam',
    subtitle: 'Progeny Blessings',
    emoji: '',
    description: 'Ancient Vedic ritual for childless couples seeking divine blessings for progeny.',
    keywords: ['putrakameshti', 'homam', 'childless', 'progeny', 'children'],
  },
  nakshatra_shanti: {
    name: 'Nakshatra Shanti',
    subtitle: 'Birth-Star Pacification',
    emoji: '⭐',
    description: 'Birth-star pacification ritual to neutralize negative star influences and bring mental peace.',
    keywords: ['nakshatra', 'shanti', 'star', 'birth star', 'pacification'],
  },
  rahu_ketu_shanti: {
    name: 'Rahu-Ketu Shanti',
    subtitle: 'Shadow Planet Remedy',
    emoji: '',
    description: 'Remedy for the shadow planets Rahu and Ketu causing delay, confusion, and obstacles.',
    keywords: ['rahu', 'ketu', 'shanti', 'shadow planets', 'delays', 'confusion'],
  },

  // Dosha Nivarana
  kala_sarpa_dosha: {
    name: 'Kala Sarpa Dosha Nivarana',
    subtitle: 'Snake Curse Remedy',
    emoji: '',
    description: 'Relief from Kala Sarpa Dosha causing repeated failures and misfortune.',
    keywords: ['kala sarpa', 'sarpa', 'dosha', 'nivarana', 'snake curse'],
  },
  pitru_dosha: {
    name: 'Pitru Dosha Nivarana',
    subtitle: 'Ancestral Debt Removal',
    emoji: '️',
    description: 'Ancestral debt removal through Pinda Pradhanam and Tarpanam rituals for family harmony.',
    keywords: ['pitru', 'dosha', 'ancestor', 'debt', 'curse', 'nivarana'],
  },
  mangalik_dosha: {
    name: 'Mangalik Dosha Nivarana',
    subtitle: 'Mars Affliction Remedy',
    emoji: '',
    description: 'Mars affliction remedies for harmonious marital life and relationship peace.',
    keywords: ['mangalik', 'mangal', 'kuja', 'dosha', 'marriage delay', 'nivarana'],
  },
  graha_shanti: {
    name: 'Graha Shanti Pooja',
    subtitle: 'Overall Life Improvement',
    emoji: '✨',
    description: 'Comprehensive nine-planet pacification for overall life improvement and career success.',
    keywords: ['graha shanti', 'graha', 'shanti', 'planets', 'peace'],
  },

  // Vivaha Poojas
  nischitartham: {
    name: 'Nischitartham (Engagement)',
    subtitle: 'Sacred Engagement',
    emoji: '',
    description: 'Sacred engagement ceremony with Vedic rituals, ring exchange, and family blessings.',
    keywords: ['nischitartham', 'engagement', 'ring', 'ceremony', 'pre wedding'],
  },
  vivaha_pooja: {
    name: 'Vivaha Pooja / Marriage',
    subtitle: 'Complete Vedic Wedding',
    emoji: '',
    description: 'Complete traditional Vedic wedding with Saptapadi, Kanyadaanam, and all rituals.',
    keywords: ['vivaha', 'marriage', 'wedding', 'saptapadi', 'kanyadaan', 'pooja'],
  },
  srinivasa_kalyanam: {
    name: 'Srinivasa Kalyanam',
    subtitle: 'Celestial Wedding',
    emoji: '',
    description: 'Celestial wedding of Lord Venkateswara — performed to seek divine grace and family prosperity.',
    keywords: ['srinivasa', 'kalyanam', 'venkateswara', 'balaji', 'celestial wedding'],
  },

  // Temple & Devotional
  devalaya_pratishta: {
    name: 'Devalaya Pratishta',
    subtitle: 'Temple Consecration',
    emoji: '️',
    description: 'Sacred temple consecration ceremony with Prana Pratishtha of all deities.',
    keywords: ['devalaya', 'pratishta', 'temple', 'consecration'],
  },
  vigraha_pratishta: {
    name: 'Vigraha Pratishta',
    subtitle: 'Idol Installation',
    emoji: '',
    description: 'Installation of divine idol with life-breathing (Prana Pratishtha) rituals.',
    keywords: ['vigraha', 'pratishta', 'idol', 'installation', 'murti'],
  },
  kumbhabhishekam: {
    name: 'Kumbhabhishekam',
    subtitle: 'Temple Re-consecration',
    emoji: '',
    description: 'Grand temple re-consecration ceremony with sacred water pot abhishekam.',
    keywords: ['kumbhabhishekam', 'abhishekam', 'temple renewal'],
  },

  // Festival Poojas
  satyanarayana_vratham: {
    name: 'Satyanarayana Vratham',
    subtitle: 'Wish Fulfillment',
    emoji: '',
    description: 'Monthly and festival-occasion Satyanarayana pooja for wish fulfillment and peace.',
    keywords: ['satyanarayana', 'vratham', 'katha', 'vishnu', 'full moon', 'poornima'],
  },
  varalakshmi_vratham: {
    name: 'Varalakshmi Vratham',
    subtitle: 'Auspicious Lakshmi Ritual',
    emoji: '',
    description: 'Auspicious Lakshmi ritual performed by married women for family welfare and prosperity.',
    keywords: ['varalakshmi', 'vratham', 'lakshmi', 'women', 'welfare'],
  },
  karthika_deeparadhana: {
    name: 'Karthika Deeparadhana',
    subtitle: 'Festival of Lights',
    emoji: '',
    description: 'Festival of lights Shiva worship during the sacred month of Karthika.',
    keywords: ['karthika', 'deeparadhana', 'deepam', 'shiva', 'karthik month'],
  },

  // Final & Memorial
  pinda_pradhanam: {
    name: 'Pinda Pradhanam',
    subtitle: 'Offering Ritual for Ancestors',
    emoji: '',
    description: 'A ritual where sacred rice offerings are made for peace and liberation of departed souls.',
    keywords: ['pinda', 'pradhanam', 'ancestor', 'offering', 'departed', 'souls', 'rice'],
  },
  masikam: {
    name: 'Masikam',
    subtitle: 'Monthly Memorial Ceremony',
    emoji: '',
    description: 'Monthly rites conducted after death to honor and pray for departed souls.',
    keywords: ['masikam', 'monthly', 'memorial', 'death', 'honor'],
  },
  thaddinam: {
    name: 'Thaddinam',
    subtitle: 'Annual Remembrance Ritual',
    emoji: '️',
    description: 'Traditional ceremony performed on the exact tithi of the departed ancestor.',
    keywords: ['thaddinam', 'death anniversary', 'remembrance', 'tithi'],
  },
  annual_shraddham: {
    name: 'Annual Shraddham',
    subtitle: 'Yearly Ancestor Offering',
    emoji: '',
    description: 'Performed annually to seek blessings and spiritual peace for ancestors.',
    keywords: ['shraddham', 'shraddha', 'yearly', 'ancestor', 'peace', 'annual shraddham'],
  },

  // Business Prosperity
  lakshmi_kubera_pooja: {
    name: 'Lakshmi Kubera Pooja',
    subtitle: 'Wealth & Business Growth',
    emoji: '',
    description: 'Dual invocation of Wealth Goddess and Lord of Treasures for business prosperity and debt freedom.',
    keywords: ['lakshmi kubera', 'kubera', 'lakshmi', 'business', 'wealth', 'debt'],
  },
  udyoga_aradhana: {
    name: 'Udyoga Aradhana',
    subtitle: 'Office / Shop Inauguration',
    emoji: '',
    description: 'Office or shop inauguration pooja with Ganapathi and Lakshmi invocation for success.',
    keywords: ['udyoga', 'aradhana', 'office', 'shop', 'inauguration', 'business opening'],
  },
  vyapara_vriddhi: {
    name: 'Vyapara Vriddhi Pooja',
    subtitle: 'Business Expansion',
    emoji: '',
    description: 'Business expansion ritual to accelerate growth, attract abundance, and increase sales.',
    keywords: ['vyapara', 'vriddhi', 'business expansion', 'growth', 'sales'],
  },
};

// ── Service Translations ────────────────────────────────────────────────────
const SERVICE_TRANSLATIONS = {
  te: {
    bhoomi_pooja: {
      name: 'భూమి పూజ',
      subtitle: 'పవిత్ర భూమి పూజ',
      description: 'నిర్మాణం ముందు భూమిని ఆశీర్వాదం చేసుకుంటున్న పవిత్ర పూజ, వాస్తు దోషాలను నివారించి నిర్మాణం యొక్క స్థితిస్థాపకతను నిశ్చితం చేస్తుంది.',
    },
    vastu_shanti: {
      name: 'వాస్తు శాంతి',
      subtitle: 'సామరస్య మరియు శక్తి శుద్ధీకరణ',
      description: 'మీ ఇంటిలో ఐదు అంశాలను సమన్వయం చేయండి మరియు శాంతి, సామరస్యం, సానుకూల శక్తి ప్రవాహానికి దిశ దోషాలను తొలగించండి.',
    },
    gruha_pravesham: {
      name: 'గృహ ప్రవేశం',
      subtitle: 'ఇంటి ఆవిష్కరణ సమारోహం',
      description: 'వేద మంత్రాలు, గణపతి పూజ మరియు వాస్తు కర్మలతో కుటుంబ సమృద్ధికి శుభ ఇంటి ప్రవేశ సమారోహం.',
    },
    seemantham: {
      name: 'సీమంతం',
      subtitle: 'సాంప్రదాయిక బేబీ షవర్',
      description: 'ఆశీర్వాద కోసం ఆశించిన తల్లుల కోసం సాంప్రదాయిక సమారోహం, సురక్షితమైన డెలివరీ కోసం ఆశీర్వాదాలను ఆహ్వానిస్తుంది.',
    },
    shanku_sthapana: {
      name: 'శాంక్ స్థాపన',
      subtitle: 'పవిత్ర ఆధారశిల విసర్జన',
      description: 'నిర్మాణం ప్రారంభానికి ముందు దేవ ఆశీర్వాదాలను ఆహ్వానించేందుకు ప్రదర్శించిన సాంప్రదాయిక కర్మ, స్థితిస్థాపకత, విజయం మరియు సామరస్యం కోసం.',
    },
  },
  hi: {
    bhoomi_pooja: {
      name: 'भूमि पूजा',
      subtitle: 'पवित्र भूमि पूजन',
      description: 'निर्माण से पहले भूमि का आशीर्वाद लेने वाला पवित्र पूजा, वास्तु दोषों को हटाकर संरचनात्मक स्थिरता सुनिश्चित करता है।',
    },
    vastu_shanti: {
      name: 'वास्तु शांति',
      subtitle: 'सामंजस्य और ऊर्जा शुद्धिकरण',
      description: 'आपके घर में पाँचों तत्वों को सामंजस्य करें और शांति, सुरक्षा, सकारात्मक ऊर्जा प्रवाह के लिए दिशा दोषों को समाप्त करें।',
    },
    gruha_pravesham: {
      name: 'गृह प्रवेश',
      subtitle: 'घर का उद्घाटन समारोह',
      description: 'वैदिक मंत्र, गणपति पूजा और वास्तु कर्मों के साथ पारिवारिक समृद्धि के लिए शुभ घर प्रवेश समारोह।',
    },
    seemantham: {
      name: 'सीमंतम',
      subtitle: 'पारंपरिक बेबी शावर',
      description: 'आशीर्वाद के लिए गर्भवती माताओं के लिए पारंपरिक समारोह, सुरक्षित प्रसव के लिए आशीर्वाद आमंत्रित करता है।',
    },
    shanku_sthapana: {
      name: 'शंख स्थापना',
      subtitle: 'पवित्र नींव रखना',
      description: 'निर्माण शुरू होने से पहले दिव्य आशीर्वाद का आह्वान करने के लिए किया जाने वाला पारंपरिक अनुष्ठान, स्थिरता, सफलता और सामंजस्य के लिए।',
    },
  },
};

// Helper function to get localized service
function getLocalizedService(service, language) {
  if (!language || language === 'en') return service;
  const translations = SERVICE_TRANSLATIONS[language];
  if (!translations || !translations[Object.keys(SERVICES).find(key => SERVICES[key] === service)]) {
    return service;
  }
  const serviceKey = Object.keys(SERVICES).find(key => SERVICES[key] === service);
  const translated = translations[serviceKey];
  return translated ? { ...service, ...translated } : service;
}

// ── FAQ Knowledge Base ───────────────────────────────────────────────────────
const FAQS = [
  {
    keywords: ['muhurtham', 'muhurta', "today's muhurtham", 'auspicious time', 'auspicious date'],
    answer:
      "Today's auspicious Muhurtham timings are curated by our learned pandits based on the Panchang. Please contact our priests directly or visit the Contact page for personalized Muhurtham guidance tailored to your ceremony.",
  },
  {
    keywords: ['contact', 'priest', 'pandit', 'phone', 'call', 'reach', 'contact priest'],
    answer:
      'You can connect with our experienced Pandits through the Contact page. Our priests are available to guide you on all pooja arrangements, timings, and spiritual preparations.',
  },
  {
    keywords: ['price', 'cost', 'fee', 'charges', 'how much', 'pricing'],
    answer:
      'Our pooja service pricing varies based on the ceremony type, duration, and requirements. Please visit the Pricing page or contact our team for a personalized quote. We ensure transparent and reasonable charges.',
  },
  {
    keywords: ['view services', 'services', 'all services', 'what services', 'what poojas'],
    answer:
      'We offer a wide range of sacred pooja services including life ceremonies (Samskaras), ancestral rites, griha pravesh rituals, and more. Visit our Services page to explore all offerings.',
  },
];

// ── Booking keywords ─────────────────────────────────────────────────────────
const BOOKING_KEYWORDS = [
  'book', 'booking', 'book pooja', 'i want to book', 'schedule pooja',
  'schedule', 'reserve', 'appointment', 'i want to perform', 'perform',
  'బుక్', 'బుక్ చేయండి', 'పూజ బుక్', 'పూజను బుక్', 'సెడ్యూల్', 'రిజర్వ్',
];

// ── Greeting & Quick Actions ─────────────────────────────────────────────────
const BOT_COPY = {
  en: {
    welcome: 'Namaskaram! Welcome to Dharma Sankalpam. How may I help you with your pooja services today?',
    greeting: 'Namaskaram! I am your Dharma Sankalpam Assistant. I can help you explore our sacred pooja services, guide you through booking, or connect you with our learned Pandits. How may I serve you today?',
    help: 'I can assist you with:\n\n• Pooja service information & descriptions\n• Guiding you to book a service\n• Connecting you with our Pandits\n• Muhurtham & auspicious timing queries\n• Pricing information\n\nFeel free to ask about any of our sacred services!',
    fallback: "Namaskaram! I seek your forgiveness — I couldn't quite understand your query. You may ask me about specific pooja services like Bhoomi Pooja, Vastu Shanti, or Seemantham, or type 'Book' to schedule a ceremony. I am here to serve you.",
    booking: 'You can now proceed to book your pooja service.\n\nOur team will guide you through selecting the date, ceremony details, and pandit preference.',
    bookingWithService: 'You can now proceed to book {service} — our Pandits will guide you through the ceremony arrangements.',
    servicePrompt: 'Would you like to book this service?',
    bookButton: 'Book',
    navigating: 'Navigating to Booking...',
    quickActions: [
      { label: 'View Services', value: 'view services' },
      { label: 'Book Pooja', value: 'book pooja' },
      { label: 'Contact Priest', value: 'contact priest' },
      { label: "Today's Muhurtham", value: "today's muhurtham" },
    ],
    quickReplies: [
      { label: 'Bhoomi Pooja', value: 'Tell me about Bhoomi Pooja' },
      { label: 'Vastu Shanti', value: 'What is Vastu Shanti?' },
      { label: 'Seemantham', value: 'Tell me about Seemantham' },
      { label: 'Shanku Sthapana', value: 'What is Shanku Sthapana?' },
    ],
  },
  te: {
    welcome: 'నమస్కారం! ధర్మ సంకల్పమ్‌కు స్వాగతం. మీ పూజా సేవల గురించి నేను ఎలా సహాయ చేయగలను?',
    greeting: 'నమస్కారం! నేను మీ ధర్మ సంకల్పమ్ సహాయకుడిని. పూజా సేవలను అన్వేషించడంలో, బుకింగ్ జరుపడంలో మరియు మా పండితులతో సహాయ చేయగలను. నేను మీకు ఎలా సేవ చేయవచ్చు?',
    help: 'నేను ఈ విధంగా సహాయ చేయగలను:\n\n• పూజా సేవ సమాచారం మరియు వివరాలు\n• సేవను బుక్ చేయడంలో మార్గదర్శకత్వం\n• మా పండితులతో సంప్రదింపు\n• ముహూర్తం మరియు శుభ సమయం ప్రశ్నలు\n• ధరల సమాచారం\n\nమీకు కావలసిన ఏదైనా పవిత్ర పూజ గురించి అడగండి!',
    fallback: 'నమస్కారం! మీ ప్రశ్నను నేను పూర్తిగా అర్థం చేసుకోలేకపోయాను. భూమి పూజ, వాస్తు శాంతి, లేదా సీమంతం వంటి ప్రత్యేక పూజల గురించి అడగండి, లేదా బుక్ అని టైప్ చేయండి. నేను మీకు సేవ చేయడానికి సిద్ధంగా ఉన్నాను.',
    booking: 'ఇప్పుడు మీరు మీ పూజా సేవను బుక్ చేయవచ్చు.\n\nమా బృందం తేదీ, వేడుక వివరాలు మరియు పండిత ఎంపికను ఎంచుకోవడంలో మీకు మార్గదర్శనం చేస్తుంది.',
    bookingWithService: 'ఇప్పుడు మీరు {service} పూజను బుక్ చేయవచ్చు — మా పండితులు వేడుక ఏర్పాట్లలో మీకు సహాయ చేస్తారు.',
    servicePrompt: 'ఈ సేవను బుక్ చేయాలనుకుంటున్నారా?',
    bookButton: 'బుక్ చేయండి',
    navigating: 'బుకింగ్‌కు వెళ్లడం...',
    quickActions: [
      { label: 'సేవలను చూడండి', value: 'view services' },
      { label: 'పూజ బుక్ చేయండి', value: 'book pooja' },
      { label: 'పండితుడిని సంప్రదించండి', value: 'contact priest' },
      { label: 'ఈరోజు ముహూర్తం', value: "today's muhurtham" },
    ],
    quickReplies: [
      { label: 'భూమి పూజ', value: 'Tell me about Bhoomi Pooja' },
      { label: 'వాస్తు శాంతి', value: 'What is Vastu Shanti?' },
      { label: 'సీమంతం', value: 'Tell me about Seemantham' },
      { label: 'శాంక్ స్థాపన', value: 'What is Shanku Sthapana?' },
    ],
  },
  hi: {
    welcome: 'नमस्ते! धर्म संकल्पम में आपका स्वागत है। आज आपकी पूजा सेवा के लिए मैं आपकी कैसे सहायता कर सकता हूँ?',
    greeting: 'नमस्ते! मैं आपका धर्म संकल्पम सहायक हूँ। मैं आपकी पूजा सेवाओं को खोजने, बुकिंग में मार्गदर्शन करने, या हमारे पंडितों से जुड़ने में मदद कर सकता हूँ। आज मैं आपकी कैसे सेवा कर सकता हूँ?',
    help: 'मैं आपकी इस तरह सहायता कर सकता हूँ:\n\n• पूजा सेवा की जानकारी और विवरण\n• सेवा बुक करने में मार्गदर्शन\n• हमारे पंडितों से संपर्क\n• मुहूर्त और शुभ समय के सवाल\n• कीमत की जानकारी\n\nकिसी भी पवित्र पूजा के बारे में पूछें!',
    fallback: 'नमस्ते! मुझे क्षमा करें — मुझे आपका सवाल समझ में नहीं आया। आप मुझे भूमि पूजा, वास्तु शांति, या सीमंथम जैसे विशिष्ट पूजा सेवाओं के बारे में पूछ सकते हैं, या बुक लिखकर शेड्यूल कर सकते हैं। मैं आपकी सेवा के लिए यहाँ हूँ।',
    booking: 'अब आप अपनी पूजा सेवा बुक करने के लिए आगे बढ़ सकते हैं।\n\nहमारी टीम आपको तिथि, प्रकार और पंडित पसंद चुनने में मार्गदर्शन करेगी।',
    bookingWithService: 'अब आप {service} पूजा बुक कर सकते हैं — हमारे पंडित आपके पूजा आयोजन में मार्गदर्शन करेंगे।',
    servicePrompt: 'क्या आप इस सेवा को बुक करना चाहते हैं?',
    bookButton: 'बुक करें',
    navigating: 'बुकिंग पर जा रहे हैं...',
    quickActions: [
      { label: 'सेवाएं देखें', value: 'view services' },
      { label: 'पूजा बुक करें', value: 'book pooja' },
      { label: 'पंडित से संपर्क करें', value: 'contact priest' },
      { label: 'आज का मुहूर्त', value: "today's muhurtham" },
    ],
    quickReplies: [
      { label: 'भूमा पूजा', value: 'Tell me about Bhoomi Pooja' },
      { label: 'वास्तु शांति', value: 'What is Vastu Shanti?' },
      { label: 'सीमान्तम', value: 'Tell me about Seemantham' },
      { label: 'शंख स्थापना', value: 'What is Shanku Sthapana?' },
    ],
  },
};

const createWelcomeMessage = (language = 'en') => ({
  id: 'welcome',
  sender: 'bot',
  text: BOT_COPY[language]?.welcome || BOT_COPY.en.welcome,
  timestamp: new Date(),
});

// ── Bot Logic ────────────────────────────────────────────────────────────────
function getBotResponse(input, language = 'en') {
  const text = input.toLowerCase().trim();
  const copy = BOT_COPY[language] || BOT_COPY.en;

  // Check booking intent first
  const isBooking = BOOKING_KEYWORDS.some((kw) => text.includes(kw));

  // Check for service mentions in booking requests
  if (isBooking) {
    // Try to find specific service mentioned alongside booking
    for (const svc of Object.values(SERVICES)) {
      if (svc.keywords.some((kw) => text.includes(kw))) {
        return {
          type: 'booking_with_service',
          service: svc,
          navigate: '/booking',
          answer: copy.bookingWithService.replace('{service}', svc.name),
        };
      }
    }
    return { type: 'booking', navigate: '/booking', answer: copy.booking };
  }

  // Check service queries
  for (const svc of Object.values(SERVICES)) {
    if (svc.keywords.some((kw) => text.includes(kw))) {
      return { type: 'service', service: svc };
    }
  }

  // Check FAQs
  for (const faq of FAQS) {
    if (faq.keywords.some((kw) => text.includes(kw))) {
      return { type: 'faq', answer: faq.answer };
    }
  }

  // Greetings
  if (/^(hi|hello|namaste|namaskaram|jai|hari|pranaam|greetings|hey|hola|om)\b/.test(text)) {
    return {
      type: 'greeting',
      answer: copy.greeting,
    };
  }

  // Help
  if (text.includes('help') || text.includes('what can you do')) {
    return {
      type: 'help',
      answer: copy.help,
    };
  }

  // Default fallback
  return {
    type: 'fallback',
    answer: copy.fallback,
  };
}

function formatTimestamp(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ── Component ────────────────────────────────────────────────────────────────
export default function AIChatBot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [createWelcomeMessage('en')]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Reset welcome message when language changes
  useEffect(() => {
    setMessages([createWelcomeMessage(language)]);
  }, [language]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const displayedMessages = messages.length === 1 && messages[0]?.id === 'welcome'
    ? [createWelcomeMessage(language)]
    : messages;

  const hasNewMessage = !isOpen && displayedMessages.length > 1;

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const navigate = useCallback((path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('app:navigate'));
  }, []);

  const addBotMessage = useCallback((text, extra = {}) => {
    const msg = {
      id: Date.now() + Math.random(),
      sender: 'bot',
      text,
      timestamp: new Date(),
      ...extra,
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const processResponse = useCallback(
    (response) => {
      switch (response.type) {
        case 'service': {
          const { service: svc } = response;
          const localizedSvc = getLocalizedService(svc, language);
          const copy = BOT_COPY[language] || BOT_COPY.en;
          addBotMessage(
            `${localizedSvc.emoji} **${localizedSvc.name}**\n_${localizedSvc.subtitle}_\n\n${localizedSvc.description}\n\n${copy.servicePrompt}`,
            { serviceCard: localizedSvc }
          );
          break;
        }
        case 'booking': {
          addBotMessage(response.answer || (BOT_COPY[language] || BOT_COPY.en).booking, { isBooking: true });
          setTimeout(() => navigate('/booking'), 1800);
          break;
        }
        case 'booking_with_service': {
          const { service: svc } = response;
          const localizedSvc = getLocalizedService(svc, language);
          addBotMessage(
            `**${localizedSvc.name}** — _${localizedSvc.subtitle}_\n\n${response.answer || (BOT_COPY[language] || BOT_COPY.en).bookingWithService.replace('{service}', localizedSvc.name)}`,
            { isBooking: true }
          );
          setTimeout(() => navigate('/booking'), 1800);
          break;
        }
        case 'faq':
        case 'greeting':
        case 'help':
        case 'fallback': {
          addBotMessage(response.answer);
          break;
        }
        default:
          addBotMessage(response.answer || (BOT_COPY[language] || BOT_COPY.en).greeting);
      }
    },
    [addBotMessage, language, navigate]
  );

  const sendMessage = useCallback(
    (text) => {
      const trimmed = (text || inputValue).trim();
      if (!trimmed) return;

      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'user',
          text: trimmed,
          timestamp: new Date(),
        },
      ]);
      setInputValue('');
      setIsTyping(true);

      // Simulate typing delay
      const delay = 900 + Math.random() * 700;
      setTimeout(() => {
        setIsTyping(false);
        const response = getBotResponse(trimmed, language);
        processResponse(response);
      }, delay);
    },
    [inputValue, language, processResponse]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (value) => sendMessage(value);

  // Render message text with basic markdown-like formatting
  const renderText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold **text**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const formatted = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part.replace(/_(.*?)_/g, '$1')
      );
      // Italic _text_ (simple pass)
      return (
        <span key={i}>
          {formatted}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        className={`chatbot-fab ${isOpen ? 'chatbot-fab--open' : ''}`}
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        aria-label="Open Dharma Sankalpam Assistant"
      >
        {isOpen ? (
          <span className="chatbot-fab__close">✕</span>
        ) : (
          <>
            <img src={logo} alt="Assistant Logo" className="chatbot-fab__icon-img" />
            <span className="chatbot-fab__ripple" />
            {hasNewMessage && <span className="chatbot-fab__badge" />}
          </>
        )}
      </button>

      {/* ── Chat Panel ── */}
      <div className={`chatbot-panel ${isOpen ? 'chatbot-panel--open' : ''} ${isMinimized ? 'chatbot-panel--minimized' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header__left">
            <div className="chatbot-avatar">
              <img src={logo} alt="Bot Avatar" className="chatbot-avatar__img" />
              <span className="chatbot-avatar__status" />
            </div>
            <div className="chatbot-header__info">
              <h3 className="chatbot-header__name">Dharma Sankalpam</h3>
              <p className="chatbot-header__sub">
                <span className="chatbot-header__dot" />
                Assistant • Always here to serve
              </p>
            </div>
          </div>
          <div className="chatbot-header__actions">
            <button
              className="chatbot-header__btn"
              onClick={() => setIsMinimized((v) => !v)}
              aria-label="Minimize"
            >
              {isMinimized ? '▲' : '▼'}
            </button>
            <button
              className="chatbot-header__btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="chatbot-messages">
              {/* Decorative top motif */}
              <div className="chatbot-messages__motif">
                <span></span> Shri Ganeshaya Namah <span></span>
              </div>

              {displayedMessages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`chatbot-msg chatbot-msg--${msg.sender}`}
                  style={{ animationDelay: `${idx === displayedMessages.length - 1 ? 0 : 0}ms` }}
                >
                  {msg.sender === 'bot' && (
                    <div className="chatbot-msg__avatar"></div>
                  )}
                  <div className="chatbot-msg__bubble-wrap">
                    <div className="chatbot-msg__bubble">
                      <p className="chatbot-msg__text">{renderText(msg.text)}</p>
                      {msg.serviceCard && (
                        <button
                          className="chatbot-msg__book-btn"
                          onClick={() => sendMessage(`${(BOT_COPY[language] || BOT_COPY.en).bookButton} ${msg.serviceCard.name}`)}
                        >
                          {(BOT_COPY[language] || BOT_COPY.en).bookButton} {msg.serviceCard.name}
                        </button>
                      )}
                      {msg.isBooking && (
                        <div className="chatbot-msg__booking-chip">
                          <span>{(BOT_COPY[language] || BOT_COPY.en).navigating}</span>
                        </div>
                      )}
                    </div>
                    <span className="chatbot-msg__time">{formatTimestamp(msg.timestamp)}</span>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="chatbot-msg__avatar chatbot-msg__avatar--user"></div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="chatbot-msg chatbot-msg--bot">
                  <div className="chatbot-msg__avatar"></div>
                  <div className="chatbot-msg__bubble-wrap">
                    <div className="chatbot-msg__bubble chatbot-msg__bubble--typing">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (shown when only welcome message) */}
            {messages.length === 1 && (
              <div className="chatbot-quick-actions">
                <p className="chatbot-quick-actions__label">{language === 'te' ? 'త్వరిత చర్యలు' : language === 'hi' ? 'त्वरित क्रियाएँ' : 'Quick Actions'}</p>
                <div className="chatbot-quick-actions__grid">
                  {(BOT_COPY[language] || BOT_COPY.en).quickActions.map((action) => (
                    <button
                      key={action.value}
                      className="chatbot-quick-actions__btn"
                      onClick={() => handleQuickAction(action.value)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Quick Replies */}
            <div className="chatbot-suggestions">
              {(BOT_COPY[language] || BOT_COPY.en).quickReplies.map((r) => (
                <button
                  key={r.value}
                  className="chatbot-suggestions__chip"
                  onClick={() => handleQuickAction(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="chatbot-input-area">
              <div className="chatbot-input-wrap">
                <input
                  ref={inputRef}
                  className="chatbot-input"
                  type="text"
                  placeholder="Ask about our pooja services…"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={300}
                />
                <button
                  className={`chatbot-send-btn ${inputValue.trim() ? 'chatbot-send-btn--active' : ''}`}
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim()}
                  aria-label="Send"
                >
                  <span className="chatbot-send-btn__icon">➤</span>
                </button>
              </div>
              <p className="chatbot-input-area__footer">
                Dharma Sankalpam · Spiritual Services
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}




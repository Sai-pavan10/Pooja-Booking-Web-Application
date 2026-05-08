import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
import './Pricing.css';

const PLANS = {
  en: [
    {
      name: '🌸 Shanti Package',
      price: '₹15,116',
      highlight: false,
      features: [
        'Included ✅',
        '3 Pandits',
        'Sri Sudarshana Idol',
        'Travel Expenses 🚗 (within 50 km in Hyderabad)',
        'Not Included ❌ Sudarshana Yantra Mandalam',
        'Pooja Samagri',
        'Flowers & Garlands 💐',
        'Fruits 🍎',
      ],
    },
    {
      name: '💮 Sankalpasiddhi Package',
      price: '₹25,116',
      highlight: true,
      features: [
        'Included ✅',
        '4 Pandits',
        'Sudarshana Idol + Narasimha Swami Idol',
        'Sudarshana Yantra Mandalam 🔱',
        'Pooja Samagri',
        'Flowers, Garlands 💐 & Fruits 🍎',
        'Travel Expenses 🚗 (within 50 km in Hyderabad)',
      ],
    },
    {
      name: '🔥 Maha Raksha Package',
      price: '₹50,116',
      highlight: false,
      badge: 'Valid for one year',
      features: [
        'Everything in Sankalpasiddhi Package ✅',
        'Additional Services and Blessings',
        'Full year Vedic assistance',
        'Special Muhurtham fixing',
        'Including all Pooja Samagri',
        'Valid for one year',
      ],
    },
  ],
  te: [
    {
      name: '🌸 శాంతి ప్యాకేజీ',
      nameEn: 'Shanti Package',
      price: '₹15,116',
      highlight: false,
      features: [
        'ఇంక్లూడ్డ్ ✅',
        'పూజారులు 3',
        'శ్రీ సుదర్శన విగ్రహం',
        'ప్రయాణ ఖర్చులు 🚗 (హైదరాబాద్ 50 km పరిధిలో మాత్రమే)',
        'నాట్ ఇంక్లూడింగ్ ❌ సుదర్శన యంత్ర మండలం',
        'పూజా సామాగ్రి',
        'పూలు అండ్ పూలమాలలు 💐',
        'పండ్లు 🍎',
      ],
    },
    {
      name: '💮 సంకల్పసిద్ధి ప్యాకేజీ',
      nameEn: 'Sankalpasiddhi Package',
      price: '₹25,116',
      highlight: true,
      features: [
        'ఇంక్లూడ్డ్ ✅',
        'పూజారులు 4',
        'సుదర్శన విగ్రహం + నరసింహా స్వామి విగ్రహం',
        'సుదర్శన యంత్ర మండలం 🔱',
        'పూజా సామాగ్రి',
        'పూలు,పూలమాలలు 💐 పండ్లు 🍎',
        'ప్రయాణ ఖర్చులు 🚗 (హైదరాబాద్ పరిధిలో 50 km లోపల మాత్రమే)',
      ],
    },
    {
      name: '🔥 మహా రక్ష ప్యాకేజీ',
      nameEn: 'Maha Raksha Package',
      price: '₹50,116',
      highlight: false,
      badge: 'Valid for one year',
      features: [
        'సంకల్పసిద్ధి ప్యాకేజీలో అన్నీ ✅',
        'అదనపు సేవలు మరియు ఆశీర్వాదాలు',
        'పూర్తి సంవత్సర వైధిక సహాయం',
        'ప్రత్యేక ముహూర్తం నిర్ణయం',
        'అన్ని పూజా సామాగ్రి సహా',
        'ఒక సంవత్సరం పాటు చెల్లుబాటు అవుతుంది',
      ],
    },
  ],
  hi: [
    {
      name: '🌸 शांति पैकेज',
      nameEn: 'Shanti Package',
      price: '₹15,116',
      highlight: false,
      features: [
        'शामिल ✅',
        '3 पंडित',
        'श्री सुदर्शन मूर्ति',
        'यात्रा खर्च 🚗 (हैदराबाद 50 km के भीतर)',
        'शामिल नहीं ❌ सुदर्शन यंत्र मंडल',
        'पूजा सामग्री',
        'फूल और मालाएं 💐',
        'फल 🍎',
      ],
    },
    {
      name: '💮 संकल्पसिद्धि पैकेज',
      nameEn: 'Sankalpasiddhi Package',
      price: '₹25,116',
      highlight: true,
      features: [
        'शामिल ✅',
        '4 पंडित',
        'सुदर्शन मूर्ति + नरसिम्हा स्वामी मूर्ति',
        'सुदर्शन यंत्र मंडल 🔱',
        'पूजा सामग्री',
        'फूल, मालाएं 💐 और फल 🍎',
        'यात्रा खर्च 🚗 (हैदराबाद 50 km के भीतर)',
      ],
    },
    {
      name: '🔥 महा रक्षा पैकेज',
      nameEn: 'Maha Raksha Package',
      price: '₹50,116',
      highlight: false,
      badge: 'एक वर्ष के लिए मान्य',
      features: [
        'संकल्पसिद्धि पैकेज में सब कुछ ✅',
        'अतिरिक्त सेवाएँ और आशीर्वाद',
        'पूरे वर्ष वैदिक सहायता',
        'विशेष मुहूर्त निर्धारण',
        'सभी पूजा सामग्री सहित',
        'एक वर्ष के लिए मान्य',
      ],
    },
  ]
};

const TEXT = {
  en: {
    tag: "Plans & Pricing",
    title: "Pooja Packages",
    intro: "Choose a package that suits your needs — each package includes complete Vedic rituals, experienced Pandits, and all pooja materials.",
    popular: "⭐ Most Popular",
    estimated: "Estimated Price",
    book: "Select & Book →",
    customNote: "🕉 Contact us if you need a custom package",
    requestCustom: "Request Custom Package"
  },
  te: {
    tag: "Plans & Pricing",
    title: "పూజా ప్యాకేజీలు (Pooja Packages)",
    intro: "మీ అవసరాలకు అనుగుణంగా ప్యాకేజీని ఎంచుకోండి — ప్రతి ప్యాకేజీలో పూర్తి వేద కర్మలు, అనుభవజ్ఞులైన పండితులు మరియు అన్ని పూజా సామాగ్రి ఉంటాయి.",
    popular: "⭐ Most Popular",
    estimated: "సంభావన (Estimated Price)",
    book: "Select & Book →",
    customNote: "🕉 కస్టమ్ ప్యాకేజీ కావాలంటే మాతో సంప్రదించండి",
    requestCustom: "Request Custom Package"
  },
  hi: {
    tag: "Plans & Pricing",
    title: "पूजा पैकेज (Pooja Packages)",
    intro: "अपनी आवश्यकताओं के अनुसार एक पैकेज चुनें — प्रत्येक पैकेज में संपूर्ण वैदिक अनुष्ठान, अनुभवी पंडित और सभी पूजा सामग्री शामिल हैं।",
    popular: "⭐ Most Popular",
    estimated: "अनुमानित मूल्य (Estimated Price)",
    book: "Select & Book →",
    customNote: "🕉 यदि आपको कस्टम पैकेज की आवश्यकता है तो हमसे संपर्क करें",
    requestCustom: "Request Custom Package"
  }
};

export default function Pricing() {
  const { language } = useLanguage();
  const currentPlans = PLANS[language] || PLANS.en;
  const currentText = TEXT[language] || TEXT.en;
  const cardsRef = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    cardsRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [language]);

  const handleBook = () => {
    window.history.pushState({}, '', '/booking');
    window.dispatchEvent(new Event('app:navigate'));
  };

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <div className="section-header reveal" ref={(el) => (cardsRef.current[0] = el)}>
          <p className="section-tag">{currentText.tag}</p>
          <h2 className="section-title">{currentText.title}</h2>
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-lotus">🪷</span>
            <span className="divider-line right" />
          </div>
          <p className="section-intro">{currentText.intro}</p>
        </div>

        <div className="pricing-grid">
          {currentPlans.map((plan, i) => (
            <div
              key={`${language}-${i}`}
              className={`pricing-card reveal${plan.highlight ? ' highlight' : ''}`}
              ref={(el) => (cardsRef.current[i + 1] = el)}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {plan.highlight && <div className="pricing-badge">{currentText.popular}</div>}
              {plan.badge && <div className="pricing-badge validity">{plan.badge}</div>}
              <h3 className="plan-name">{plan.name}</h3>
              {plan.nameEn && <p className="plan-name-en">{plan.nameEn}</p>}
              <p className="plan-note">{currentText.estimated}</p>
              <div className="plan-price">{plan.price}</div>
              <ul className="plan-features">
                {plan.features.map((f, fi) => (
                  <li key={fi}>{f}</li>
                ))}
              </ul>
              <button 
                className="service-btn" 
                onClick={handleBook}
                style={{ backgroundColor: 'brown', color: 'white', borderColor: 'brown' }}
              >
                {currentText.book}
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-note reveal" ref={(el) => (cardsRef.current[currentPlans.length + 1] = el)}>
          <span>{currentText.customNote}</span>
          <button 
            className="btn-secondary" 
            onClick={handleBook}
            style={{ backgroundColor: 'brown', color: 'white', borderColor: 'brown' }}
          >
            {currentText.requestCustom}
          </button>
        </div>
      </div>
    </section>
  );
}

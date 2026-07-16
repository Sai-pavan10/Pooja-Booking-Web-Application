import { useEffect, useRef } from 'react';
import { t, useLanguage } from '../i18n';
import './Pandit.css';

const PANDITS = [
  {
    name: { en: 'Pandit Ramesh Sharma', te: 'పండిత్ రమేష్ శర్మ', hi: 'पंडित रमेश शर्मा' },
    title: { en: 'Vedic Acharya', te: 'వేద ఆచార్యులు', hi: 'वैदिक आचार्य' },
    exp: { en: '22 yrs', te: '22 సంవత్సరాలు', hi: '22 वर्ष' },
    specialty: { en: 'Havan & Yagna Rituals', te: 'హవనం & యజ్ఞ కర్మలు', hi: 'हवन और यज्ञ अनुष्ठान' },
    lang: { en: 'Hindi, Sanskrit, Telugu', te: 'హిందీ, సంస్కృతం, తెలుగు', hi: 'हिंदी, संस्कृत, तेलुगु' },
    rating: '4.9',
    reviews: 248,
    bio: { en: 'Trained at Varanasi gurukul with mastery in all major yagnas and shanti homas.', te: 'వారణాసి గురుకులంలో శిక్షణ పొంది, ప్రధాన యజ్ఞాలు మరియు శాంతి హోమాలలో నైపుణ్యం కలవారు.', hi: 'वाराणसी गुरुकुल में प्रशिक्षित, प्रमुख यज्ञों और शांति होमों में निपुण।' },
    badges: [{ en: 'Vedic Scholar', te: 'వేద పండితులు', hi: 'वैदिक विद्वान' }, { en: 'Havan Expert', te: 'హవన నిపుణులు', hi: 'हवन विशेषज्ञ' }],
  },
  {
    name: { en: 'Pandit Suresh Joshi', te: 'పండిత్ సురేష్ జోషి', hi: 'पंडित सुरेश जोशी' },
    title: { en: 'Jyotish & Puja Acharya', te: 'జ్యోతిష్య & పూజా ఆచార్యులు', hi: 'ज्योतिष एवं पूजा आचार्य' },
    exp: { en: '18 yrs', te: '18 సంవత్సరాలు', hi: '18 वर्ष' },
    specialty: { en: 'Navgraha & Kundali Puja', te: 'నవగ్రహ & కుండలి పూజ', hi: 'नवग्रह और कुंडली पूजा' },
    lang: { en: 'Hindi, Sanskrit, Marathi', te: 'హిందీ, సంస్కృతం, మరాఠీ', hi: 'हिंदी, संस्कृत, मराठी' },
    rating: '4.8',
    reviews: 192,
    bio: { en: 'Expert in Jyotisha with deep knowledge of graha shanti and astrological remedies.', te: 'గ్రహ శాంతి మరియు జ్యోతిష్య పరిహారాలపై లోతైన జ్ఞానం కలిగిన జ్యోతిష్య నిపుణులు.', hi: 'ग्रह शांति और ज्योतिषीय उपायों के गहन ज्ञान वाले ज्योतिष विशेषज्ञ।' },
    badges: [{ en: 'Astrology Expert', te: 'జ్యోతిష్య నిపుణులు', hi: 'ज्योतिष विशेषज्ञ' }, { en: 'Navgraha Specialist', te: 'నవగ్రహ నిపుణులు', hi: 'नवग्रह विशेषज्ञ' }],
  },
  {
    name: { en: 'Pandit Venkata Rao', te: 'పండిత్ వెంకట రావు', hi: 'पंडित वेंकट राव' },
    title: { en: 'Agama Shastra Acharya', te: 'ఆగమ శాస్త్ర ఆచార్యులు', hi: 'आगम शास्त्र आचार्य' },
    exp: { en: '25 yrs', te: '25 సంవత్సరాలు', hi: '25 वर्ष' },
    specialty: { en: 'South Indian Traditions', te: 'దక్షిణ భారత సంప్రదాయాలు', hi: 'दक्षिण भारतीय परंपराएं' },
    lang: { en: 'Telugu, Tamil, Sanskrit', te: 'తెలుగు, తమిళం, సంస్కృతం', hi: 'तेलुगु, तमिल, संस्कृत' },
    rating: '5.0',
    reviews: 311,
    bio: { en: 'Deeply versed in Agama Shastra, specializing in South Indian temple-style rituals.', te: 'దక్షిణ భారత ఆలయ సంప్రదాయ కర్మలలో నైపుణ్యం కలిగిన ఆగమ శాస్త్ర పండితులు.', hi: 'दक्षिण भारतीय मंदिर-शैली के अनुष्ठानों में विशेषज्ञ आगम शास्त्र विद्वान।' },
    badges: [{ en: 'Agama Specialist', te: 'ఆగమ నిపుణులు', hi: 'आगम विशेषज्ञ' }, { en: 'Top Rated', te: 'అత్యున్నత రేటింగ్', hi: 'सर्वोच्च रेटिंग' }],
  },
  {
    name: { en: 'Pandit Mahesh Upadhyay', te: 'పండిత్ మహేష్ ఉపాధ్యాయ్', hi: 'पंडित महेश उपाध्याय' },
    title: { en: 'Vivah & Samskara Specialist', te: 'వివాహ & సంస్కార నిపుణులు', hi: 'विवाह एवं संस्कार विशेषज्ञ' },
    exp: { en: '15 yrs', te: '15 సంవత్సరాలు', hi: '15 वर्ष' },
    specialty: { en: 'Weddings & Samskaras', te: 'వివాహాలు & సంస్కారాలు', hi: 'विवाह और संस्कार' },
    lang: { en: 'Hindi, Sanskrit, Gujarati', te: 'హిందీ, సంస్కృతం, గుజరాతీ', hi: 'हिंदी, संस्कृत, गुजराती' },
    rating: '4.9',
    reviews: 175,
    bio: { en: 'Performs all 16 samskaras with attention to regional customs and family traditions.', te: 'ప్రాంతీయ ఆచారాలు, కుటుంబ సంప్రదాయాలకు అనుగుణంగా 16 సంస్కారాలను నిర్వహిస్తారు.', hi: 'क्षेत्रीय रीति-रिवाजों और पारिवारिक परंपराओं के अनुसार सभी 16 संस्कार करते हैं।' },
    badges: [{ en: 'Vivah Expert', te: 'వివాహ నిపుణులు', hi: 'विवाह विशेषज्ञ' }, { en: 'Samskara Specialist', te: 'సంస్కార నిపుణులు', hi: 'संस्कार विशेषज्ञ' }],
  },
];

export default function Pandits() {
  const { content, language } = useLanguage();
  const text = content.pandits;
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="pandits" className="pandits-section">
      <div className="container">
        <div className="section-header reveal" ref={(el) => (refs.current[0] = el)}>
          <p className="section-tag">{text.tag}</p>
          <h2 className="section-title">{text.title}</h2>
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-lotus"></span>
            <span className="divider-line right" />
          </div>
          <p className="section-intro">{text.intro}</p>
        </div>

        <div className="pandits-grid">
          {PANDITS.map((p, i) => (
            <div
              key={p.name.en}
              className="pandit-card reveal"
              ref={(el) => (refs.current[i + 1] = el)}
              style={{ transitionDelay: `${(i % 2) * 0.12}s` }}
            >
              <div className="pandit-header">
                <div className="pandit-avatar">
                <span></span>
                  <div className="pandit-avatar-ring" />
                </div>
                <div className="pandit-header-info">
                  <h3 className="pandit-name">{t(p.name, language)}</h3>
                  <p className="pandit-title-label">{t(p.title, language)}</p>
                  <div className="pandit-rating">
                    <span className="stars">{'★'.repeat(5)}</span>
                    <span className="rating-num">{p.rating}</span>
                    <span className="rating-count">({p.reviews} {text.reviews})</span>
                  </div>
                </div>
              </div>

              <p className="pandit-bio">{t(p.bio, language)}</p>

              <div className="pandit-meta">
                <div className="meta-row">
                  <span className="meta-key">{text.specialty}</span>
                  <span className="meta-val">{t(p.specialty, language)}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">{text.experience}</span>
                  <span className="meta-val">{t(p.exp, language)}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">{text.languages}</span>
                  <span className="meta-val">{t(p.lang, language)}</span>
                </div>
              </div>

              <div className="pandit-badges">
                {p.badges.map((b) => (
                  <span key={b.en} className="pandit-badge">{t(b, language)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

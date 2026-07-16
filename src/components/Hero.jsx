import { useRef, useState } from 'react';
import './Hero.css';
import { useLanguage } from '../i18n';
import heroImg from '../assets/heroimg.png';
import heroVideo from '../assets/herovdo.mp4';

const HERO_COPY = {
  en: {
    script: '{ Vedic Dharma }',
    quote: '"Your pooja sankalpam is our responsibility"',
    search: 'Search......Pooja/ Vratham/ Homam',
    eyebrow: 'Not just a website...',
    headline: 'A dharmic companion for your sacred pooja journey!',
    categories: ["All pooja's", "All Vratham's", "All Homama's", 'Pitru Karyam'],
    location: 'Hyderabad, Telangana',
    serviceArea: 'All India Service',
    bookNow: 'BOOK NOW',
    bookNowSub: 'Reserve Your Pooja',
    whatsapp: 'WHATSAPP',
    whatsappSub: 'Chat With Us',
    videoCta: 'Book Srinivasa Kalyanam',
  },
  te: {
    script: '{ వేదోక్త ధర్మమూలం }',
    quote: '"మీ పూజ సంకల్పం - మా యొక్క బాధ్యత"',
    search: 'శోధించండి... పూజ/ వ్రాతమ్/ హోమం',
    eyebrow: 'ఇది వెబ్సైట్ కాదు...',
    headline: 'మీ పూజ సంకల్పానికి ధర్మబద్ధమైన ఆయుధం!',
    categories: ["All pooja's", "All Vratham's", "All Homama's", 'Pitru Karyam'],
    location: 'హైదరాబాద్, తెలంగాణ',
    serviceArea: 'అన్ని భారత సేవ',
    bookNow: 'ఇప్పుడే బుక్ చేయండి',
    bookNowSub: 'మీ పూజను రిజర్వ్ చేయండి',
    whatsapp: 'వాట్సాప్',
    whatsappSub: 'మాతో చాట్ చేయండి',
    videoCta: 'శ్రీనివాస కళ్యాణం బుక్ చేయండి',
  },
  hi: {
    script: '{ वैदिक धर्म }',
    quote: '"आपकी पूजा का संकल्प हमारी जिम्मेदारी"',
    search: 'खोजें... पूजा/ व्रत/ होम',
    eyebrow: 'यह सिर्फ वेबसाइट नहीं...',
    headline: 'आपकी पूजा यात्रा के लिए एक धार्मिक साथी!',
    categories: ["All pooja's", "All Vratham's", "All Homama's", 'Pitru Karyam'],
    location: 'हैदराबाद, तेलंगाना',
    serviceArea: 'सभी भारत सेवा',
    bookNow: 'अभी बुक करें',
    bookNowSub: 'अपनी पूजा बुक करें',
    whatsapp: 'व्हाट्सएप',
    whatsappSub: 'हमसे बात करें',
    videoCta: 'श्रीनिवास कल्याणम बुक करें',
  },
};

// TODO: replace with the business's real WhatsApp number (country code + number, no + or spaces)
const WHATSAPP_NUMBER = '+91 8179960741';

export default function Hero() {
  const { language, setLanguage } = useLanguage();
  const copy = HERO_COPY[language] || HERO_COPY.en;
  const [searchQuery, setSearchQuery] = useState('');

  // ── Hero video: show the "Book Srinivasa Kalyanam" CTA once
  // the clip finishes playing ──
  const videoRef = useRef(null);
  const [showVideoCta, setShowVideoCta] = useState(false);

  const handleNavigate = (href) => {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('app:navigate'));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    handleNavigate(`/services?search=${encodeURIComponent(query)}`);
  };

  const handleBookNow = () => {
    handleNavigate('/booking');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer');
  };

  const handleVideoEnded = () => {
    setShowVideoCta(true);
  };

  return (
    <section id="hero" className="hero-section hero-home-theme">
      <div className="hero-language-tabs" aria-label="Select language">
        <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
        <button className={language === 'te' ? 'active' : ''} onClick={() => setLanguage('te')}>TL</button>
        <button className={language === 'hi' ? 'active' : ''} onClick={() => setLanguage('hi')}>हि</button>
      </div>

      <div className="hero-poster">
        <p className="hero-script-line">{copy.script}</p>
        <h1 className="hero-sankalpam-line">{copy.quote}</h1>

        <img className="hero-deity-image" src={heroImg} alt="Pooja deities and acharyas" />

        <div className="hero-bottom-copy">
          <p>{copy.eyebrow}</p>
          <strong>{copy.headline}</strong>
        </div>
      </div>

      {/* ── Location + quick action buttons ── */}
      <div className="hero-info-actions">
        <div className="hero-location-row">
          <span className="hero-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {copy.location}
          </span>
          <span className="hero-divider">|</span>
          <span className="hero-service-area">
            <span className="hero-flag" aria-hidden="true">🇮🇳</span>
            {copy.serviceArea}
          </span>
        </div>

        <div className="hero-cta-row">
          <button className="hero-cta-book" onClick={handleBookNow}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span className="hero-cta-text">
              <strong>{copy.bookNow}</strong>
              <small>{copy.bookNowSub}</small>
            </span>
          </button>

          <button className="hero-cta-whatsapp" onClick={handleWhatsApp}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.2 8.2 0 0 1 2.41 5.83c0 4.55-3.7 8.2-8.25 8.2Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.12-.56.12-.16.25-.64.8-.78.96-.15.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14-.01-.31-.01-.47-.01a.9.9 0 0 0-.65.31c-.23.25-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.2 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
            </svg>
            <span className="hero-cta-text">
              <strong>{copy.whatsapp}</strong>
              <small>{copy.whatsappSub}</small>
            </span>
          </button>
        </div>

        {/* ✅ autoComplete="off" blocks browser autofill dark overlay */}
        <form className="hero-search-bar-top" onSubmit={handleSearch} autoComplete="off">
          <span aria-hidden="true">⌕</span>
          {/* ✅ type="text" instead of type="search" — avoids browser search-input dark styles */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.search}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <button type="button" className="hero-search-filter" aria-label="Filter search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </button>
        </form>
      </div>

      <div className="hero-video-frame">
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
        />

        {showVideoCta && (
          <div className="hero-video-cta-overlay">
            <button className="hero-video-cta-btn" onClick={handleBookNow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>{copy.videoCta}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

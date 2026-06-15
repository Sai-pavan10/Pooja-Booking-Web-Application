import { useState } from 'react';
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
  },
  te: {
    script: '{ వేదోక్త ధర్మమూలం }',
    quote: '"మీ పూజ సంకల్పం - మా యొక్క బాధ్యత"',
    search: 'Search......Pooja/ Vratham/ Homam',
    eyebrow: 'ఇది వెబ్సైట్ కాదు...',
    headline: 'మీ పూజ సంకల్పానికి ధర్మబద్ధమైన ఆయుధం!',
    categories: ["All pooja's", "All Vratham's", "All Homama's", 'Pitru Karyam'],
  },
  hi: {
    script: '{ वैदिक धर्म }',
    quote: '"आपकी पूजा का संकल्प हमारी जिम्मेदारी"',
    search: 'Search......Pooja/ Vratham/ Homam',
    eyebrow: 'यह सिर्फ वेबसाइट नहीं...',
    headline: 'आपकी पूजा यात्रा के लिए एक धार्मिक साथी!',
    categories: ["All pooja's", "All Vratham's", "All Homama's", 'Pitru Karyam'],
  },
};

export default function Hero() {
  const { language, setLanguage } = useLanguage();
  const copy = HERO_COPY[language] || HERO_COPY.en;
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <section id="hero" className="hero-section hero-home-theme">
      <div className="hero-language-tabs" aria-label="Select language">
        <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
        <button className={language === 'te' ? 'active' : ''} onClick={() => setLanguage('te')}>TL</button>
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
      </form>

      <div className="hero-poster">
        <p className="hero-script-line">{copy.script}</p>
        <h1 className="hero-sankalpam-line">{copy.quote}</h1>

        <img className="hero-deity-image" src={heroImg} alt="Pooja deities and acharyas" />

        <div className="hero-bottom-copy">
          <p>{copy.eyebrow}</p>
          <strong>{copy.headline}</strong>
        </div>
      </div>

      <div className="hero-video-frame">
        <video src={heroVideo} autoPlay muted loop playsInline />
      </div>
    </section>
  );
}

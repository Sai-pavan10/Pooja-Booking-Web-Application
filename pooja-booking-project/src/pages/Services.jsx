import { useEffect, useRef } from 'react';
import { getServiceItems, useLanguage } from '../i18n';
import './Services.css';

const SERVICE_META = [
  { icon: '🏠', price: '₹3,500', duration: '2–3 hrs', popular: false },
  { icon: '💍', price: '₹8,000', duration: '4–6 hrs', popular: true },
  { icon: '🔥', price: '₹4,500', duration: '3–4 hrs', popular: false },
  { icon: '⭐', price: '₹5,000', duration: '3–4 hrs', popular: false },
  { icon: '👶', price: '₹2,500', duration: '1–2 hrs', popular: false },
  { icon: '🪔', price: '₹3,000', duration: '1–2 hrs', popular: false },
  { icon: '🙏', price: '₹3,116', duration: '2 hrs', popular: false },
  { icon: '🔱', price: '₹35,000', duration: '1 hr', popular: false },
];

export default function Services() {
  const { language, content } = useLanguage();
  const text = content.services;
  const services = getServiceItems(language).map(([title, subtitle, description], index) => ({
    ...SERVICE_META[index],
    title,
    subtitle,
    description,
    duration: SERVICE_META[index]?.duration || text.durations?.[index] || '',
  }));
  const cardsRef = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.15 }
    );
    cardsRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [language]);

  const handleBook = () => {
    window.history.pushState({}, '', '/booking');
    window.dispatchEvent(new Event('app:navigate'));
  };

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-header reveal" ref={(el) => (cardsRef.current[0] = el)}>
          <p className="section-tag">{text.tag}</p>
          <h2 className="section-title">{text.title}</h2>
          <div className="divider">
            <span className="divider-line" />
            
            <span className="divider-line right" />
          </div>
          <p className="section-intro">{text.intro}</p>
        </div>

        <div className="services-grid">
          {services.map((svc, i) => (
            <div
              key={svc.title}
              className={`service-card reveal${svc.popular ? ' popular' : ''}`}
              ref={(el) => (cardsRef.current[i + 1] = el)}
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              {svc.popular && <div className="popular-badge">* {text.popular}</div>}
              <div className="service-icon-wrap">
                <span className="service-icon">{svc.icon}</span>
              </div>
              <h3 className="service-title">{svc.title}</h3>
              <p className="service-subtitle">{svc.subtitle}</p>
              <p className="service-desc">{svc.description}</p>
              <div className="service-meta">
                <span className="meta-item">{svc.duration}</span>
                <span className="meta-price">{svc.price}</span>
              </div>
              <button className="service-btn" onClick={handleBook}>
                {text.book}
              </button>
            </div>
          ))}
        </div>

        <div className="services-note reveal" ref={(el) => (cardsRef.current[services.length + 1] = el)}>
          <span>{text.note}</span>
          <button className="btn-secondary" onClick={handleBook}>
            {text.custom}
          </button>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import { getServiceItems, useLanguage } from '../i18n';
import { useAuth } from '../context/auth-context';
import logo from '../assets/logo.PNG';
import LoginModal from "../components/LoginModal";
import { showToast } from '../components/toast-service';
import './Home.css';

const navigateTo = (href) => {
  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event('app:navigate'));
};

export default function Home() {
  const { language, content } = useLanguage();
  const { user } = useAuth();
  const home = content.home;
  const servicePreviews = getServiceItems(language).slice(0, 4);
  const refs = useRef([]);
  const [showLogin, setShowLogin] = useState(false);

  // ── Carousel state/refs for services slider ──
  const sliderRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeSlide, setActiveSlide] = useState(0);

  // Show login popup after 5 seconds if not logged in
  useEffect(() => {
    if (user) return;
    const timer = setTimeout(() => setShowLogin(true), 5000);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        }),
      { threshold: 0.1 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [language]);

  // Track which slide is active while the user swipes/scrolls the services carousel
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let raf = null;
    const handleScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { scrollLeft, clientWidth } = el;
        let closestIndex = 0;
        let closestDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const center = Math.abs((card.offsetLeft - scrollLeft) - clientWidth * 0.05);
          if (center < closestDist) {
            closestDist = center;
            closestIndex = i;
          }
        });
        setActiveSlide(closestIndex);
      });
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [servicePreviews.length]);

  const scrollToSlide = (i) => {
    const card = cardRefs.current[i];
    const el = sliderRef.current;
    if (!card || !el) return;
    el.scrollTo({ left: card.offsetLeft - 12, behavior: 'smooth' });
    setActiveSlide(i);
  };

  // Use this before any booking action
  function handleBookNow() {
    if (!user) {
      setShowLogin(true);
      showToast('Please login to continue booking poojas.', 'info');
      return;
    }
    navigateTo('/booking');
  }

  return (
    <>
      <Hero />

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}

      <section className="home-services-preview">
        <div className="container">
          <div className="section-header reveal" ref={(el) => (refs.current[0] = el)}>
            <p className="section-tag">{home.servicesTag}</p>
            <h2 className="section-title">{home.servicesTitle}</h2>
            <div className="divider"></div>
            <p className="section-intro">{home.servicesIntro}</p>
          </div>

          {/* ── Sliding carousel ── */}
          <div className="home-service-grid" ref={sliderRef}>
            {servicePreviews.map(([title, , text, image], i) => (
              <article
                className="home-service-card reveal"
                key={title}
                ref={(el) => {
                  refs.current[i + 1] = el;
                  cardRefs.current[i] = el;
                }}
                style={{ transitionDelay: `${i * 0.12}s`, animationDelay: `${i * 0.12}s` }}
              >
                {/* ── Image Panel ── */}
                <div className="svc-image-wrap">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      className="svc-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="svc-image-placeholder">
                      <span className="svc-icon">✦</span>
                    </div>
                  )}
                  {/* Animated gold overlay on image */}
                  <div className="svc-image-overlay" />
                </div>

                {/* ── Content Panel ── */}
                <div className="svc-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <button className="btn-primary svc-btn" onClick={handleBookNow}>
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* ── Dot pagination ── */}
          <div className="home-service-dots" role="tablist" aria-label="Service slides">
            {servicePreviews.map((_, i) => (
              <button
                key={i}
                className={`home-service-dot ${activeSlide === i ? 'active' : ''}`}
                onClick={() => scrollToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={activeSlide === i}
                role="tab"
              />
            ))}
          </div>

          <div className="home-preview-action reveal" ref={(el) => (refs.current[5] = el)}>
            <button className="btn-primary" onClick={() => navigateTo('/services')}>
              {home.viewServices}
            </button>
          </div>
        </div>
      </section>

      <section className="home-about-preview">
        <div className="container container--align-right home-about-grid">

          {/* ── Floating Logo (no box) ── */}
          <div className="home-about-logo-wrap reveal" ref={(el) => (refs.current[6] = el)}>
            <img src={logo} alt="Dharma Sankalpam Logo" className="home-about-logo" />
            <strong>10+</strong>
            <p>{home.years}</p>
          </div>

          <div
            className="home-about-copy reveal"
            ref={(el) => (refs.current[7] = el)}
            style={{ transitionDelay: '0.1s' }}
          >
            <p className="section-tag">{home.aboutTag}</p>
            <h2 className="section-title">{home.aboutTitle}</h2>
            <p>{home.aboutText}</p>
            <div className="home-about-points">
              {home.points.map((point) => <span key={point}>{point}</span>)}
            </div>
            <button className="btn-primary" onClick={() => navigateTo('/about')}>
              {home.learn}
            </button>
          </div>
        </div>
      </section>

      <section className="home-reviews-preview">
        <div className="container">
          <div className="section-header reveal" ref={(el) => (refs.current[8] = el)}>
            <p className="section-tag">{home.reviewsTag}</p>
            <h2 className="section-title">{home.reviewsTitle}</h2>
            {/* The gold line (divider) was removed as requested */}
          </div>
          <div className="home-review-grid">
            {home.reviews.map(([name, city, text], i) => (
              <article
                className="home-review-card reveal"
                key={name}
                ref={(el) => (refs.current[i + 9] = el)}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="home-review-stars">★★★★★</div>
                <p className="home-review-text">"{text}"</p>
                <div>
                  <h3>{name}</h3>
                  <span>{city}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="home-preview-action reveal" ref={(el) => (refs.current[11] = el)}>
            <button className="btn-primary" onClick={() => navigateTo('/reviews')}>
              {home.readReviews}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
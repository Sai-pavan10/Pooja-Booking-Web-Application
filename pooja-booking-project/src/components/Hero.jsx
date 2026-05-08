import './Hero.css';
import { useLanguage } from '../i18n';
import homamImg from '../assets/homam.jpg';
import srinivasaImg from '../assets/srinivasa pooja image.jpg';

export default function Hero() {
  const { content } = useLanguage();
  const hero = content.hero;
  const handleNavigate = (href) => {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('app:navigate'));
  };

  return (
    <section id="hero" className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <style>
        {`
          @keyframes hero-bg-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .hero-bg-slider {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
          }
          .hero-image-track {
            display: flex;
            width: 400vw;
            height: 100%;
            animation: hero-bg-scroll 40s linear infinite;
          }
          .hero-image-track img {
            width: 100vw;
            height: 100%;
            object-fit: cover;
            opacity: 0.3;
          }
          .hero-bg-mandala, .hero-particles, .hero-content {
            position: relative;
            z-index: 1;
          }
        `}
      </style>
      <div className="hero-bg-slider" aria-hidden="true">
        <div className="hero-image-track">
          <img src={homamImg} alt="" />
          <img src={srinivasaImg} alt="" />
          <img src={homamImg} alt="" />
          <img src={srinivasaImg} alt="" />
        </div>
      </div>

      <div className="hero-bg-mandala" aria-hidden="true">
        <div className="mandala-ring ring-1" />
        <div className="mandala-ring ring-2" />
        <div className="mandala-ring ring-3" />
      </div>

      <div className="hero-particles" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span key={i} className={`particle p-${i + 1}`}>*</span>
        ))}
      </div>

      <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', margin: '0 auto' }}>
        <p className="hero-tag">{hero.tag}</p>

        <h1 className="hero-title">
          <span className="hero-title-sub">{hero.sub}</span>
          <span className="hero-title-main">{hero.main}</span>
          <span className="hero-title-accent">{hero.accent}</span>
        </h1>

        <div className="hero-divider">
          
        </div>

        <p className="hero-description">
          {hero.desc}
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-num">500+</span>
            <span className="stat-label">{hero.performed}</span>
          </div>
          <div className="hero-stat-divider">|</div>
          <div className="hero-stat">
            <span className="stat-num">50+</span>
            <span className="stat-label">{hero.pandits}</span>
          </div>
          <div className="hero-stat-divider">|</div>
          <div className="hero-stat">
            <span className="stat-num">20+</span>
            <span className="stat-label">{hero.types}</span>
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn-primary" onClick={() => handleNavigate('/booking')}>
            {hero.book}
          </button>
          <button className="btn-secondary" onClick={() => handleNavigate('/services')}>
            {hero.services}
          </button>
        </div>
      </div>

    </section>
  );
}

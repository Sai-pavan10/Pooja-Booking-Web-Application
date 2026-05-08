import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import './Gallery.css';

const ITEM_META = [
  { emoji: '', wide: true },
  { emoji: '*', wide: false },
  { emoji: '', wide: false },
  { emoji: '*', wide: false },
  { emoji: '', wide: false },
  { emoji: '*', wide: true },
  { emoji: '', wide: false },
  { emoji: '*', wide: false },
];

export default function Gallery() {
  const { content } = useLanguage();
  const gallery = content.gallery;
  const refs = useRef([]);
  const [lightbox, setLightbox] = useState(null);
  const items = gallery.items.map(([title, subtitle], index) => ({ ...ITEM_META[index], title, subtitle }));

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [content]);

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header reveal" ref={(el) => (refs.current[0] = el)}>
          <p className="section-tag">{gallery.tag}</p>
          <h2 className="section-title">{gallery.title}</h2>
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-lotus"></span>
            <span className="divider-line right" />
          </div>
          <p className="section-intro">{gallery.intro}</p>
        </div>

        <div className="gallery-grid">
          {items.map((item, i) => (
            <div
              key={item.title}
              className={`gallery-card reveal${item.wide ? ' wide' : ''}`}
              ref={(el) => (refs.current[i + 1] = el)}
              style={{ transitionDelay: `${(i % 4) * 0.08}s` }}
              onClick={() => setLightbox(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setLightbox(item)}
            >
              <div className="gallery-emoji-bg">{item.emoji}</div>
              <div className="gallery-overlay">
                <div className="gallery-overlay-content">
                  <span className="gallery-overlay-icon">{item.emoji}</span>
                  <p className="gallery-overlay-title">{item.title}</p>
                  <p className="gallery-overlay-sub">{item.subtitle}</p>
                </div>
              </div>
              <div className="gallery-bottom">
                <p className="gallery-title">{item.title}</p>
                <p className="gallery-sub">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>x</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-visual">{lightbox.emoji}</div>
            <h3 className="lightbox-title">{lightbox.title}</h3>
            <p className="lightbox-sub">{lightbox.subtitle}</p>
          </div>
        </div>
      )}
    </section>
  );
}

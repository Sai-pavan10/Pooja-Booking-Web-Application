import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
import './About.css';

export default function About() {
  const { content } = useLanguage();
  const about = content.about;
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [content]);

  return (
    <section id="about" className="about-section">
      <div className="about-bg-pattern" aria-hidden="true" />

      <div className="container">
        <div className="about-grid">
          <div className="about-visual reveal" ref={(el) => (refs.current[0] = el)}>
            <div className="about-temple-card">
              <div className="temple-top">
                
                <div className="temple-glow" />
              </div>
              <div className="temple-body">
                <p className="temple-quote">{about.quote}</p>
                <span className="temple-attribution">{about.tradition}</span>
              </div>
            </div>
            <div className="about-badge-stack">
              <div className="about-badge">
                <span className="badge-num">10+</span>
                <span className="badge-label">{about.years}</span>
              </div>
              <div className="about-badge gold">
                <span className="badge-num">4.9 ★</span>
                <span className="badge-label">{about.rating}</span>
              </div>
            </div>
          </div>

          <div className="about-content">
            <div className="reveal" ref={(el) => (refs.current[1] = el)}>
              <p className="section-tag">{about.tag}</p>
              <h2 className="section-title">{about.title}</h2>
              <div className="divider" style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                
              </div>
              <p className="about-para">{about.p1}</p>
              <p className="about-para">{about.p2}</p>
            </div>

            <div className="values-grid">
              {about.values.map(([title, desc], i) => (
                <div
                  key={title}
                  className="value-item reveal"
                  ref={(el) => (refs.current[i + 2] = el)}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  
                  <div>
                    <h4 className="value-title">{title}</h4>
                    <p className="value-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

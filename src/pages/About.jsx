import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
import aboutPagePic from '../assets/About page pic.jpeg';
import './About.css'; // Assuming this is the correct path

export default function About() {
  const { content} = useLanguage(); // Call useLanguage once and destructure both content and language
  const about = content.about; // This remains the same
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        }),
      { threshold: 0.12 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [content]);

  return (
    <section id="about" className="about-section">
      <div className="about-bg-pattern" aria-hidden="true" />

      <div className="container">

        {/* ── SECTION HEADER ── */}
        <div className="about-header reveal" ref={(el) => (refs.current[0] = el)}>
          <p className="section-tag">{about.tag || 'Our Commitment'}</p>
          <h2 className="section-title">{about.title || 'What is Dharma Sankalpam?'}</h2>
          <p className="about-subtitle">
            {about.subtitle}
          </p>
        </div>

        {/* ── TWO-COLUMN GRID ── */}
        <div className="about-grid">

          {/* LEFT — Visual column */}
          <div className="about-visual reveal" ref={(el) => (refs.current[1] = el)}>

            {/* Shloka card */}
            <div className="about-temple-card">
              <div className="temple-top">
                <img
                  className="temple-top-image"
                  src={aboutPagePic}
                  alt="Temple pooja ceremony"
                />
                <div className="temple-glow" />
              </div>
              <div className="temple-body">
                <p className="shloka-label">{about.shlokaDevanagari}</p>
                <p className="shloka-verse">{about.shlokaVerse}</p>
                <div className="shloka-divider" />
                <div className="shloka-meaning">
                  {about.shlokaMeaningLines.map((line, i) => (
                    <p key={i} className="shloka-meaning-line">{line}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Founder attribution */}
            <div className="founder-card reveal" ref={(el) => (refs.current[2] = el)}>
              <div className="founder-avatar" aria-hidden="true">🔱</div> {/* This is an emoji, not translatable */}
              <div className="founder-info">
                <span className="founder-name">{about.founderName}</span>
                <span className="founder-role">{about.founderRole}</span>
                <span className="founder-salutation">{about.founderSalutation}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="about-badge-stack">
              <div className="about-badge">
                <span className="badge-num">10+</span>
                <span className="badge-label">{about.years || 'Years of Service'}</span>
              </div>
              <div className="about-badge gold">
                <span className="badge-num">4.9 ★</span>
                <span className="badge-label">{about.rating || 'Devotee Rating'}</span>
              </div>
              <div className="about-badge">
                <span className="badge-num">100%</span>
                <span className="badge-label">{about.vedicAuthenticity}</span>
              </div>
              <div className="about-badge gold">
                <span className="badge-num">∞</span>
                <span className="badge-label">{about.dharmicCommitment}</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Content column */}
          <div className="about-content">

            {/* The problem */}
            <div className="reveal" ref={(el) => (refs.current[3] = el)}>
              <div className="content-block">
                <h3 className="content-block-title">
                  <span className="block-icon">⚠️</span> {about.problemHeading}
                </h3>
                <p className="about-para">
                  {about.problemP1}
                </p>
                <p className="about-para">
                  {about.problemP2}
                </p>
              </div>
            </div>

            {/* Values grid */}
            <div className="values-grid">
              {about.dharmaValues.map(([icon, title, desc], i) => (
                <div
                  key={title}
                  className="value-item reveal"
                  ref={(el) => (refs.current[i + 4] = el)}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="value-icon" aria-hidden="true">{icon}</div>
                  <div>
                    <h4 className="value-title">{title}</h4>
                    <p className="value-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vision block */}
            <div className="vision-block reveal" ref={(el) => (refs.current[8] = el)}>
              <div className="vision-header">
                <span className="vision-icon" aria-hidden="true">🌟</span>
                <h3 className="vision-title">{about.visionTitle}</h3>
              </div>
              <p className="vision-intro">
                {about.visionIntro}
              </p>
              <ul className="vision-list">
                {about.visionPoints.map((pt) => (
                  <li key={pt} className="vision-point">
                    <span className="vision-check" aria-hidden="true">✔️</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="vision-closing">
                <em>{about.visionClosing}</em>
                <strong> {about.visionClosingBold}</strong>
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

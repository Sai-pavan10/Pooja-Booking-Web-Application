import { useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
import './Pandit.css';

const PANDITS = [
  {
    name: 'Pandit Ramesh Sharma',
    title: 'Vedic Acharya',
    exp: '22 yrs',
    specialty: 'Havan & Yagna Rituals',
    lang: 'Hindi, Sanskrit, Telugu',
    rating: '4.9',
    reviews: 248,
    bio: 'Trained at Varanasi gurukul with mastery in all major yagnas and shanti homas.',
    badges: ['Vedic Scholar', 'Havan Expert'],
  },
  {
    name: 'Pandit Suresh Joshi',
    title: 'Jyotish & Puja Acharya',
    exp: '18 yrs',
    specialty: 'Navgraha & Kundali Puja',
    lang: 'Hindi, Sanskrit, Marathi',
    rating: '4.8',
    reviews: 192,
    bio: 'Expert in Jyotisha with deep knowledge of graha shanti and astrological remedies.',
    badges: ['Astrology Expert', 'Navgraha Specialist'],
  },
  {
    name: 'Pandit Venkata Rao',
    title: 'Agama Shastra Acharya',
    exp: '25 yrs',
    specialty: 'South Indian Traditions',
    lang: 'Telugu, Tamil, Sanskrit',
    rating: '5.0',
    reviews: 311,
    bio: 'Deeply versed in Agama Shastra, specializing in South Indian temple-style rituals.',
    badges: ['Agama Specialist', 'Top Rated'],
  },
  {
    name: 'Pandit Mahesh Upadhyay',
    title: 'Vivah & Samskara Specialist',
    exp: '15 yrs',
    specialty: 'Weddings & Samskaras',
    lang: 'Hindi, Sanskrit, Gujarati',
    rating: '4.9',
    reviews: 175,
    bio: 'Performs all 16 samskaras with attention to regional customs and family traditions.',
    badges: ['Vivah Expert', 'Samskara Specialist'],
  },
];

export default function Pandits() {
  const { content } = useLanguage();
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
              key={p.name}
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
                  <h3 className="pandit-name">{p.name}</h3>
                  <p className="pandit-title-label">{p.title}</p>
                  <div className="pandit-rating">
                    <span className="stars">{'★'.repeat(5)}</span>
                    <span className="rating-num">{p.rating}</span>
                    <span className="rating-count">({p.reviews} {text.reviews})</span>
                  </div>
                </div>
              </div>

              <p className="pandit-bio">{p.bio}</p>

              <div className="pandit-meta">
                <div className="meta-row">
                  <span className="meta-key">{text.specialty}</span>
                  <span className="meta-val">{p.specialty}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">{text.experience}</span>
                  <span className="meta-val">{p.exp}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-key">{text.languages}</span>
                  <span className="meta-val">{p.lang}</span>
                </div>
              </div>

              <div className="pandit-badges">
                {p.badges.map((b) => (
                  <span key={b} className="pandit-badge">{b}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

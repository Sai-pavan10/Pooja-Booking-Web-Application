import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    name: 'Priya Venkataraman',
    city: 'Hyderabad',
    pooja: 'Griha Pravesh',
    text: 'Pandit Venkata Rao performed our Griha Pravesh with such devotion and precision. Every mantra was chanted beautifully, and the energy in our new home felt completely transformed. Highly recommended!',
    rating: 5,
    avatar: '👩',
  },
  {
    name: 'Rajesh & Sunita Mehta',
    city: 'Mumbai',
    pooja: 'Vivah Puja',
    text: 'Our wedding ceremony was everything we dreamed of. Pandit Mahesh explained every step in detail and made sure our families understood the significance. It was sacred, beautiful, and unforgettable.',
    rating: 5,
    avatar: '👫',
  },
  {
    name: 'Anand Krishnamurthy',
    city: 'Bengaluru',
    pooja: 'Satyanarayan Katha',
    text: 'The Satyanarayan Katha organized through Dharma Sankalpam was exceptional. The pandit arrived on time, brought all samagri, and performed the complete katha and havan flawlessly. Will book again.',
    rating: 5,
    avatar: '👨',
  },
  {
    name: 'Lakshmi Devi Nair',
    city: 'Chennai',
    pooja: 'Navgraha Puja',
    text: 'I was going through a difficult period and the Navgraha Puja organized by Dharma Sankalpam made a perceptible difference. The pandit was deeply knowledgeable and compassionate throughout.',
    rating: 5,
    avatar: '👩‍🦳',
  },
  {
    name: 'Sanjay Gupta',
    city: 'Delhi',
    pooja: 'Vastu Shanti',
    text: 'We had heard horror stories about late pandits or inadequate preparation. Dharma Sankalpam was a breath of fresh air — everything was organized perfectly, and our Vastu Shanti was performed beautifully.',
    rating: 5,
    avatar: '👨‍💼',
  },
  {
    name: 'Meera Iyer',
    city: 'Pune',
    pooja: 'Namkaran Sanskar',
    text: 'The naming ceremony for our daughter was a deeply moving experience. The pandit was patient with the entire family and ensured the ceremony honored our Tamil Brahmin traditions perfectly.',
    rating: 5,
    avatar: '👩‍🍼',
  },
];

export default function Testimonials() {
  const { content } = useLanguage();
  const text = content.testimonials;
  const [activeIdx, setActiveIdx] = useState(0);
  const refs = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (i) => {
    setActiveIdx(i);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIdx((idx) => (idx + 1) % TESTIMONIALS.length);
    }, 4500);
  };

  const t = TESTIMONIALS[activeIdx];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-header reveal" ref={(el) => (refs.current[0] = el)}>
          <p className="section-tag">{text.tag}</p>
          <h2 className="section-title">{text.title}</h2>
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-lotus">🌸</span>
            <span className="divider-line right" />
          </div>
        </div>

        <div className="testimonials-layout reveal" ref={(el) => (refs.current[1] = el)}>
          {/* Main featured testimonial */}
          <div className="testimonial-featured" key={activeIdx}>
            <div className="testi-quote-mark">"</div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-footer">
              <div className="testi-avatar">{t.avatar}</div>
              <div>
                <p className="testi-name">{t.name}</p>
                <p className="testi-meta">{t.city} · {t.pooja}</p>
                <div className="testi-stars">{'★'.repeat(t.rating)}</div>
              </div>
            </div>
          </div>

          {/* Side list */}
          <div className="testimonials-list">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={i}
                className={`testi-mini${i === activeIdx ? ' active' : ''}`}
                onClick={() => goTo(i)}
              >
                <span className="mini-avatar">{item.avatar}</span>
                <div className="mini-body">
                  <p className="mini-name">{item.name}</p>
                  <p className="mini-pooja">{item.pooja}</p>
                </div>
                <div className="mini-stars">{'★'.repeat(item.rating)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="testimonial-dots reveal" ref={(el) => (refs.current[2] = el)}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`dot${i === activeIdx ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

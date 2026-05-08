import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import './Contact.css';

function FaqItem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={'faq-item' + (isOpen ? ' open' : '')}>
      <button className="faq-q" onClick={() => setIsOpen((o) => !o)}>
        <span>{q}</span>
        <span className="faq-icon">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <p className="faq-a">{a}</p>}
    </div>
  );
}

export default function Contact() {
  const { content } = useLanguage();
  const contact = content.contact;
  const refs = useRef([]);
  const contacts = contact.labels.map((label, index) => ({
    label,
    value: contact.values[index],
    link: index === 0 ? 'tel:+919876543210' : index === 1 ? 'mailto:booking@dharmasankalpam.in' : null,
  }));

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [content]);

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header reveal" ref={(el) => (refs.current[0] = el)}>
          <p className="section-tag">{contact.tag}</p>
          <h2 className="section-title">{contact.title}</h2>
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-lotus"></span>
            <span className="divider-line right" />
          </div>
        </div>

        <div className="contact-layout">
          <div className="contact-cards reveal" ref={(el) => (refs.current[1] = el)}>
            <h3 className="contact-sub-title">{contact.reach}</h3>
            <p className="contact-intro-text">{contact.intro}</p>
            <div className="contact-grid">
              {contacts.map((c) => (
                <div key={c.label} className="contact-card">
                  <span className="contact-icon"></span>
                  <div>
                    <p className="contact-label" style={{ color: 'brown' }}>{c.label}</p>
                    {c.link ? <a href={c.link} className="contact-value link">{c.value}</a> : <p className="contact-value">{c.value}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="contact-social">
              <p className="social-label">{contact.follow}</p>
              <div className="social-links">
                {['Facebook', 'Instagram', 'YouTube', 'Twitter'].map((s) => (
                  <a key={s} href="#" className="social-link">{s}</a>
                ))}
              </div>
            </div>

            <div className="contact-map" style={{ marginTop: '2rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(200, 150, 12, 0.3)' }}>
              <iframe
                title="Dharma Sankalpam Location"
                src="https://maps.google.com/maps?q=Road%20no.%208,%20Sri%20Sai%20Narayana%20colony,%20Nagole,%20Hyderabad,%20Telangana%20500068&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="250"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="contact-faq reveal" ref={(el) => (refs.current[2] = el)}>
            <h3 className="contact-sub-title">{contact.faqTitle}</h3>
            <div className="faq-list">
              {contact.faqs.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

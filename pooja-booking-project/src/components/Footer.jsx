import React from 'react';
import './Footer.css';
import { getServiceItems, useLanguage } from '../i18n';
import logo from '../assets/logo.PNG';

const navigateTo = (href) => {
  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event('app:navigate'));
};

export default function Footer() {
  const { language, content } = useLanguage();
  const footer = content.footer;
  const nav = content.nav;
  const footerLinks = {
    [footer.service]: [
      ...getServiceItems(language).slice(0, 5).map(([label]) => ({ label, href: '/services' })),
      { label: content.services.custom, href: '/booking' },
    ],
    [footer.quick]: [
      { label: nav.links[2], href: '/about' },
      { label: nav.links[3], href: '/pandits' },
      { label: nav.links[4], href: '/gallery' },
      { label: nav.links[5], href: '/testimonials' },
      { label: nav.mobileBook, href: '/booking' },
      { label: nav.links[6], href: '/contact' },
    ],
    [footer.cities]: [
      { label: 'Hyderabad', href: '/contact' },
      { label: 'Mumbai', href: '/contact' },
      { label: 'Bengaluru', href: '/contact' },
      { label: 'Delhi', href: '/contact' },
      { label: 'Chennai', href: '/contact' },
      { label: 'Pune', href: '/contact' },
    ],
  };
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={logo} alt="Dharma Sankalpam Logo" className="footer-logo-img" />
                <div>
                  <p className="footer-logo-name">Dharma Sankalpam</p>
                  <p className="footer-logo-sub">{nav.sub}</p>
                </div>
              </div>
              <p className="footer-brand-desc">
                {footer.desc}
              </p>
              <div className="footer-om">
                
              </div>
            </div>

            {Object.entries(footerLinks).map(([heading, items]) => (
              <div key={heading} className="footer-col">
                <h4 className="footer-col-heading">{heading}</h4>
                <ul className="footer-col-list">
                  {items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo(item.href);
                        }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            Copyright {new Date().getFullYear()} Dharma Sankalpam. {footer.copy}
          </p>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/refund">Refund Policy</a>
          </div>
          <button className="scroll-top-btn" onClick={scrollTop} aria-label="Scroll to top">
            &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
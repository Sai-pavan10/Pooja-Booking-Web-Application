import { useEffect, useState } from 'react';
import { LANGUAGES, useLanguage } from '../i18n';
import logo from '../assets/logo.PNG';
import './Navbar.css';

const NAV_LINKS = [
  { key: 0, href: '/' },
  { key: 1, href: '/services' },
  { key: 2, href: '/about' },
  { key: 3, href: '/pandits' },
  { key: 4, href: '/gallery' },
  { key: 5, href: '/testimonials' },
  { key: 6, href: '/contact' },
  { key: 7, href: '/pricing', labels: { en: 'Plans & Pricing', te: 'ప్యాకేజీలు & ధరలు', hi: 'योजनाएं और मूल्य' } },
];

const navigateTo = (href) => {
  if (window.location.pathname === href) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event('app:navigate'));
};

export default function Navbar() {
  const { language, setLanguage, content } = useLanguage();
  const nav = content.nav;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(window.location.pathname || '/');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onLocationChange = () => setActive(window.location.pathname || '/');
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('app:navigate', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('app:navigate', onLocationChange);
    };
  }, []);

  const handleNav = (href) => {
    setActive(href);
    setMenuOpen(false);
    navigateTo(href);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    const query = searchQuery.toLowerCase().trim();
    
    const match = NAV_LINKS.find(
      (link) => {
        const linkText = nav.links[link.key] || (link.labels ? link.labels[language] || link.labels.en : link.label);
        return linkText?.toLowerCase().includes(query);
      }
    );

    if (match) {
      handleNav(match.href);
      setSearchQuery('');
    } else if ('booking'.includes(query) || nav.book?.toLowerCase().includes(query)) {
      handleNav('/booking');
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <a
          className="nav-logo"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/');
          }}
          style={{ whiteSpace: 'nowrap' }}
        >
          <div className="nav-logo-icon">
            <img src={logo} alt="Dharma Sankalpam logo" />
          </div>
          <div>
            <div className="nav-logo-text">Dharma Sankalpam</div>
            <div className="nav-logo-sub">{nav.sub}</div>
          </div>
        </a>

        <form 
          onSubmit={handleSearch} 
          className="nav-search-form"
        >
          <input
            type="search"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nav-search-input"
          />
        </form>

        <ul className="nav-links" style={{ whiteSpace: 'nowrap' }}>
          {NAV_LINKS.map(({ key, href, label, labels }) => (
            <li key={href}>
              <a
                href={href}
                className={active === href ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(href);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: language === 'te' ? '0.85rem' : undefined
                }}
              >
              {nav.links[key] || (labels ? labels[language] || labels.en : label)}
              </a>
            </li>
          ))}
        </ul>

        <label className="language-select-wrap" style={{ minWidth: '100px' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label={nav.language}
            style={{ width: '100%' }}
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <a
          className="nav-book-btn"
          href="/booking"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/booking');
          }}
          style={{
            whiteSpace: 'nowrap',
            fontSize: language === 'te' ? '0.85rem' : undefined
          }}
        >
          {nav.book}
        </a>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>
      </nav>

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(({ key, href, label, labels }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              handleNav(href);
            }}
          >
          {nav.links[key] || (labels ? labels[language] || labels.en : label)}
          </a>
        ))}
        <label className="mobile-language-select">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label={nav.language}
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <a
          href="/booking"
          className="mobile-book-btn"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/booking');
          }}
        >
          {nav.mobileBook}
        </a>
      </div>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { LANGUAGES, useLanguage } from '../i18n';
import { useAuth } from '../context/auth-context';
import LoginModal from './LoginModal';
import { showToast } from '../components/toast-service';
import logo from '../assets/logo.PNG';
import './Navbar.css';

const NAV_LINKS = [
  { key: 1, href: '/services' },
  { key: 2, href: '/about' },
  { key: 3, href: '/pandits' },
  { key: 4, href: '/gallery' },
  { key: 5, href: '/reviews' },
  { key: 6, href: '/contact' },
  { key: 7, href: '/pricing', labels: { en: 'Plans & Pricing', te: 'ప్యాకేజీలు & ధరలు', hi: 'योजनाएं और मूल्य' } },
];

const MOBILE_BOTTOM_LABELS = {
  home:     { en: 'Home',     te: 'హోమ్',          hi: 'होम' },
  services: { en: 'Services', te: 'సేవలు',          hi: 'सेवाएं' },
  book:     { en: 'Book Now', te: 'బుక్ చేయండి',   hi: 'बुक करें' },
  packages: { en: 'Packages', te: 'ప్యాకేజీలు',     hi: 'पैकेज' },
  contact:  { en: 'Contact',  te: 'సంప్రదించండి',   hi: 'संपर्क' },
};

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
  const { user, userProfile, logout } = useAuth();
  const nav = content.nav;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(window.location.pathname || '/');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Display name: prefer Firestore profile, fallback to Firebase displayName or email
  const displayName = userProfile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNav = (href) => {
    setActive(href);
    setMenuOpen(false);
    navigateTo(href);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigateTo('/');
    showToast('You have been logged out.', 'info');
  };

  return (
    <>
      <style>{`
        .nav-logo-icon img {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .nav-logo:hover .nav-logo-icon img {
          transform: scale(1.15) rotate(-5deg);
        }
        .nav-links a, .nav-book-btn, .language-select-wrap select {
          font-size: 0.85rem !important;
        }
        :lang(te) .nav-links a, :lang(te) .nav-book-btn, :lang(te) .language-select-wrap select {
          font-size: 1.05rem !important;
          letter-spacing: 0.03em;
        }
        :lang(en) .nav-logo-text { font-size: 1.1rem; }
        :lang(en) .nav-logo-sub  { font-size: 0.65rem; }

        /* Profile dropdown */
        .nav-profile { position: relative; }
        .nav-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(240,192,64,0.12);
          border: 1px solid rgba(240,192,64,0.35);
          border-radius: 50px;
          padding: 0.35rem 0.9rem 0.35rem 0.45rem;
          color: #F0C040;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          transition: all 0.25s;
          white-space: nowrap;
          max-width: 180px;
        }
        .nav-profile-btn:hover {
          background: rgba(240,192,64,0.2);
          border-color: #F0C040;
        }
        .nav-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8860c, #F0C040);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #1a0a00;
          flex-shrink: 0;
        }
        .nav-profile-name {
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px;
        }
        .nav-chevron {
          font-size: 0.6rem;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .nav-chevron.open { transform: rotate(180deg); }

        .nav-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: linear-gradient(160deg, rgba(74,13,26,0.98), rgba(30,6,14,0.99));
          border: 1px solid rgba(200,150,12,0.35);
          border-radius: 14px;
          min-width: 180px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          z-index: 2000;
          animation: dd-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes dd-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nav-dropdown-user {
          padding: 0.9rem 1rem;
          border-bottom: 1px solid rgba(200,150,12,0.15);
        }
        .nav-dropdown-user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #F0C040;
          display: block;
        }
        .nav-dropdown-user-email {
          font-size: 0.7rem;
          color: rgba(255,220,150,0.5);
          display: block;
          margin-top: 0.15rem;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          color: rgba(255,220,150,0.8);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          text-decoration: none;
        }
        .nav-dropdown-item:hover {
          background: rgba(240,192,64,0.1);
          color: #F0C040;
        }
        .nav-dropdown-item.logout { color: #fca5a5; }
        .nav-dropdown-item.logout:hover { background: rgba(220,38,38,0.12); color: #f87171; }

        /* Login button for unauthenticated */
        .nav-login-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(240,192,64,0.1);
          border: 1px solid rgba(240,192,64,0.4);
          border-radius: 50px;
          padding: 0.4rem 1rem;
          color: #F0C040;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .nav-login-btn:hover {
          background: rgba(240,192,64,0.2);
          border-color: #F0C040;
          transform: translateY(-1px);
        }

        /* Responsive styles for tablets and small screens */
        @media (max-width: 1024px) {
          .nav-profile-btn {
            padding: 0.32rem 0.7rem 0.32rem 0.4rem;
            font-size: 0.75rem;
            max-width: 140px;
          }
          .nav-avatar {
            width: 24px;
            height: 24px;
            font-size: 0.62rem;
          }
          .nav-chevron {
            font-size: 0.55rem;
          }
          .nav-dropdown {
            min-width: 160px;
            right: -5px;
          }
        }

        @media (max-width: 480px) {
          .nav-profile-btn {
            padding: 0.28rem 0.6rem 0.28rem 0.35rem;
            font-size: 0.68rem;
            max-width: 120px;
          }
          .nav-avatar {
            width: 22px;
            height: 22px;
            font-size: 0.58rem;
          }
          .nav-chevron {
            font-size: 0.5rem;
          }
          .nav-profile-name {
            display: none;
          }
          .nav-dropdown {
            min-width: 150px;
            right: 0;
            top: calc(100% + 6px);
          }
          .nav-dropdown-user-name {
            font-size: 0.78rem;
          }
          .nav-dropdown-user-email {
            font-size: 0.65rem;
          }
          .nav-dropdown-item {
            padding: 0.6rem 0.8rem;
            font-size: 0.78rem;
            gap: 0.5rem;
          }
        }
      `}</style>

      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <a className="nav-logo" href="/"
          onClick={e => { e.preventDefault(); handleNav('/'); }}
          style={{ whiteSpace: 'nowrap' }}>
          <div className="nav-logo-icon">
            <img src={logo} alt="Dharma Sankalpam logo" />
          </div>
          <div>
            <div className="nav-logo-text">Dharma Sankalpam</div>
            <div className="nav-logo-sub">{nav.sub}</div>
          </div>
        </a>

        <ul className="nav-links" style={{ whiteSpace: 'nowrap' }}>
          {NAV_LINKS.map(({ key, href, label, labels }) => (
            <li key={href}>
              <a href={href} className={active === href ? 'active' : ''}
                onClick={e => { e.preventDefault(); handleNav(href); }}
                style={{ whiteSpace: 'nowrap' }}>
                {nav.links[key] || (labels ? labels[language] || labels.en : label)}
              </a>
            </li>
          ))}
        </ul>

        <label className="language-select-wrap" style={{ minWidth: '100px' }}>
          <select value={language} onChange={e => setLanguage(e.target.value)} aria-label={nav.language} style={{ width: '100%' }}>
            {LANGUAGES.map(item => (
              <option key={item.code} value={item.code}>{item.label}</option>
            ))}
          </select>
        </label>

        {/* Auth section */}
        {user ? (
          <div className="nav-profile" ref={dropdownRef}>
            <button className="nav-profile-btn" onClick={() => setDropdownOpen(o => !o)}>
              <span className="nav-avatar">{initials}</span>
              <span className="nav-profile-name">{displayName.split(' ')[0]}</span>
              <span className={`nav-chevron${dropdownOpen ? ' open' : ''}`}>▼</span>
            </button>
            {dropdownOpen && (
              <div className="nav-dropdown">
                <div className="nav-dropdown-user">
                  <span className="nav-dropdown-user-name">{displayName}</span>
                  <span className="nav-dropdown-user-email">{user.email}</span>
                </div>
                <button className="nav-dropdown-item" onClick={() => { setDropdownOpen(false); handleNav('/my-bookings'); }}>
                  My Bookings
                </button>
                <button className="nav-dropdown-item logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="nav-login-btn" onClick={() => setShowLoginModal(true)}>
            Login
          </button>
        )}

        <a className="nav-book-btn" href="/booking"
          onClick={e => { e.preventDefault(); handleNav('/booking'); }}
          style={{ whiteSpace: 'nowrap' }}>
          {nav.book}
        </a>

        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>
      </nav>

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(({ key, href, label, labels }) => (
          <a key={href} href={href} onClick={e => { e.preventDefault(); handleNav(href); }}>
            {nav.links[key] || (labels ? labels[language] || labels.en : label)}
          </a>
        ))}
        {user ? (
          <>
            <a href="/my-bookings" onClick={e => { e.preventDefault(); handleNav('/my-bookings'); }}>
              My Bookings
            </a>
            <button style={{ background: 'none', border: 'none', color: '#fca5a5', padding: '0.75rem 1.5rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
              onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button style={{ background: 'none', border: 'none', color: '#F0C040', padding: '0.75rem 1.5rem', textAlign: 'left', cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => { setMenuOpen(false); setShowLoginModal(true); }}>
            Login / Sign Up
          </button>
        )}
        <label className="mobile-language-select">
          <select value={language} onChange={e => setLanguage(e.target.value)} aria-label={nav.language}>
            {LANGUAGES.map(item => (
              <option key={item.code} value={item.code}>{item.label}</option>
            ))}
          </select>
        </label>
        <a href="/booking" className="mobile-book-btn"
          onClick={e => { e.preventDefault(); handleNav('/booking'); }}>
          {nav.mobileBook}
        </a>
      </div>

      <div className="mobile-bottom-nav">
        <a href="/" onClick={e => { e.preventDefault(); handleNav('/'); }} className={active === '/' ? 'active' : ''}>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
          </span>
          <span>{MOBILE_BOTTOM_LABELS.home[language] || MOBILE_BOTTOM_LABELS.home.en}</span>
        </a>
        <a href="/services" onClick={e => { e.preventDefault(); handleNav('/services'); }} className={active === '/services' ? 'active' : ''}>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </span>
          <span>{MOBILE_BOTTOM_LABELS.services[language] || MOBILE_BOTTOM_LABELS.services.en}</span>
        </a>
        <a href="/booking" onClick={e => { e.preventDefault(); handleNav('/booking'); }} className={active === '/booking' ? 'active' : ''}>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
          </span>
          <span>{MOBILE_BOTTOM_LABELS.book[language] || MOBILE_BOTTOM_LABELS.book.en}</span>
        </a>
        <a href="/pricing" onClick={e => { e.preventDefault(); handleNav('/pricing'); }} className={active === '/pricing' ? 'active' : ''}>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
          </span>
          <span>{MOBILE_BOTTOM_LABELS.packages[language] || MOBILE_BOTTOM_LABELS.packages.en}</span>
        </a>
        <a href="/contact" onClick={e => { e.preventDefault(); handleNav('/contact'); }} className={active === '/contact' ? 'active' : ''}>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </span>
          <span>{MOBILE_BOTTOM_LABELS.contact[language] || MOBILE_BOTTOM_LABELS.contact.en}</span>
        </a>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}

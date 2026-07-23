import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/auth-context';
import LoginModal from '../components/LoginModal';
import { useLanguage } from '../i18n';
import './MyBookings.css';

const COPY = {
  en: { loginTitle: 'Login to View Your Bookings', loginBody: 'Please login to see your pooja booking history and status updates.', login: 'Login / Sign Up', account: 'My Account', title: 'My Bookings', welcome: 'Namaste, {name} — here are all your sacred pooja bookings.', loading: 'Loading your bookings...', empty: 'No Bookings Yet', emptyBody: "You haven't booked any pooja services yet. Browse our services and make your first booking!", browse: 'Browse Poojas →', another: '+ Book Another Pooja', view: 'View Details →', details: 'Booking Details', close: 'Close' },
  te: { loginTitle: 'మీ బుకింగ్‌లను చూడటానికి లాగిన్ చేయండి', loginBody: 'మీ పూజ బుకింగ్ చరిత్ర, స్థితి నవీకరణలను చూడటానికి లాగిన్ చేయండి.', login: 'లాగిన్ / నమోదు', account: 'నా ఖాతా', title: 'నా బుకింగ్‌లు', welcome: 'నమస్తే, {name} — మీ పూజ బుకింగ్‌లు ఇక్కడ ఉన్నాయి.', loading: 'మీ బుకింగ్‌లు లోడ్ అవుతున్నాయి...', empty: 'ఇంకా బుకింగ్‌లు లేవు', emptyBody: 'మీరు ఇంకా పూజ సేవలను బుక్ చేయలేదు. సేవలను చూసి మీ మొదటి బుకింగ్ చేయండి!', browse: 'పూజలను చూడండి →', another: '+ మరో పూజ బుక్ చేయండి', view: 'వివరాలు చూడండి →', details: 'బుకింగ్ వివరాలు', close: 'మూసివేయండి' },
  hi: { loginTitle: 'अपनी बुकिंग देखने के लिए लॉग इन करें', loginBody: 'अपनी पूजा बुकिंग का इतिहास और स्थिति अपडेट देखने के लिए लॉग इन करें।', login: 'लॉग इन / साइन अप', account: 'मेरा खाता', title: 'मेरी बुकिंग', welcome: 'नमस्ते, {name} — आपकी सभी पूजा बुकिंग यहां हैं।', loading: 'आपकी बुकिंग लोड हो रही हैं...', empty: 'अभी कोई बुकिंग नहीं', emptyBody: 'आपने अभी तक कोई पूजा सेवा बुक नहीं की है। सेवाएं देखें और अपनी पहली बुकिंग करें!', browse: 'पूजाएं देखें →', another: '+ एक और पूजा बुक करें', view: 'विवरण देखें →', details: 'बुकिंग विवरण', close: 'बंद करें' },
};

// Keys match the actual `booking_status` values written by Booking.jsx /
// Services.jsx and updated by the admin panel (server.js): pending,
// confirmed, completed, cancelled, rejected.
const STATUS_COLORS = {
  pending:   { label: 'Pending',   bg: '#7c2d12', color: '#fed7aa', dot: '#f97316' },
  confirmed: { label: 'Confirmed', bg: '#14532d', color: '#bbf7d0', dot: '#22c55e' },
  completed: { label: 'Completed', bg: '#1e3a5f', color: '#bfdbfe', dot: '#3b82f6' },
  cancelled: { label: 'Cancelled', bg: '#7f1d1d', color: '#fecaca', dot: '#ef4444' },
  rejected:  { label: 'Rejected',  bg: '#7f1d1d', color: '#fecaca', dot: '#ef4444' },
};

const navigateTo = (href) => {
  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event('app:navigate'));
};

export default function MyBookings() {
  const { user, userProfile } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language] || COPY.en;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const displayName = userProfile?.fullName || user?.displayName || 'Devotee';

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    const loadBookings = async () => {
      try {
        const q = query(
          collection(db, 'booking_requests'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        if (!mounted) return;
        setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        if (!mounted) return;
        setError('Could not load bookings. Please try again.');
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBookings();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <section className="mybookings-section">
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} redirectAfterLogin="/my-bookings" />}
        <div className="mybookings-empty">
          <div className="mybookings-empty-icon"></div>
          <h2>{copy.loginTitle}</h2>
          <p>{copy.loginBody}</p>
          <button className="mb-login-btn" onClick={() => setShowLogin(true)}>
            {copy.login}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mybookings-section">
      {selected && <BookingDetailModal booking={selected} copy={copy} onClose={() => setSelected(null)} />}

      <div className="mybookings-header">
        <div className="mybookings-mandala" aria-hidden="true" />
        <p className="mb-tag">{copy.account}</p>
        <h1 className="mb-title">{copy.title}</h1>
        <div className="mb-divider">
          <span className="mb-line" />
          <span className="mb-lotus"></span>
          <span className="mb-line" />
        </div>
        <p className="mb-welcome">{copy.welcome.replace('{name}', displayName)}</p>
      </div>

      <div className="mybookings-container">
        {/* Stats bar */}
        {bookings.length > 0 && (
          <div className="mb-stats">
            {['pending','confirmed','completed','cancelled','rejected'].map(s => {
              const count = bookings.filter(b => (b.booking_status || 'pending') === s).length;
              if (!count) return null;
              const c = STATUS_COLORS[s] || STATUS_COLORS.pending;
              return (
                <div key={s} className="mb-stat-chip" style={{ background: c.bg + '55', border: `1px solid ${c.dot}44` }}>
                  <span className="mb-stat-dot" style={{ background: c.dot }} />
                  <span style={{ color: c.color }}>{count} {c.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="mb-loading">
            <div className="mb-spinner" />
            <p>{copy.loading}</p>
          </div>
        )}

        {error && <div className="mb-error">{error}</div>}

        {!loading && !error && bookings.length === 0 && (
          <div className="mybookings-empty">
            <div className="mybookings-empty-icon"></div>
            <h2>{copy.empty}</h2>
            <p>{copy.emptyBody}</p>
            <button className="mb-login-btn" onClick={() => navigateTo('/services')}>
              {copy.browse}
            </button>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="mb-grid">
            {bookings.map(b => (
              <BookingCard key={b.id} booking={b} copy={copy} onViewDetails={() => setSelected(b)} />
            ))}
          </div>
        )}

        <div className="mb-actions">
          <button className="mb-book-btn" onClick={() => navigateTo('/services')}>
            {copy.another}
          </button>
        </div>
      </div>
    </section>
  );
}

function BookingCard({ booking: b, copy, onViewDetails }) {
  const status = b.booking_status || 'pending';
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const dateStr = b.booking_date || (b.createdAt?.toDate ? b.createdAt.toDate().toLocaleDateString('en-IN') : '—');

  return (
    <div className="mb-card">
      <div className="mb-card-top">
        <div className="mb-card-pooja">
          <span className="mb-card-icon"></span>
          <div>
            <h3 className="mb-card-name">{b.service_name || 'Pooja Booking'}</h3>
            <span className="mb-card-id">ID: {(b.booking_id || b.id).slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
        <div className="mb-status-badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.dot}66` }}>
          <span className="mb-status-dot" style={{ background: c.dot }} />
          {c.label}
        </div>
      </div>

      <div className="mb-card-details">
        <div className="mb-detail"><span></span> {dateStr}</div>
        {b.booking_time && <div className="mb-detail"><span></span> {b.booking_time}</div>}
        {b.city && <div className="mb-detail"><span></span> {b.city}</div>}
        {b.pandit && <div className="mb-detail"><span></span> {b.pandit}</div>}
      </div>

      <button className="mb-view-btn" onClick={onViewDetails}>
        {copy.view}
      </button>
    </div>
  );
}

function BookingDetailModal({ booking: b, copy, onClose }) {
  const status = b.booking_status || 'pending';
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;

  const fields = [
    ['Booking ID', b.booking_id || b.id],
    ['Pooja / Event', b.service_name],
    ['Name', b.customer_name],
    ['Email', b.customer_email],
    ['Mobile', b.customer_phone],
    ['Date', b.booking_date],
    ['Time', b.booking_time],
    ['City', b.city],
    ['Address', b.address],
    ['Pandit', b.pandit],
    ['Nakshatram', b.nakshatram],
    ['Gotram', b.gotram],
    ['Special Instructions', b.message],
    ['Advance Paid', b.price ? `₹${b.price}` : null],
    ['Payment Status', b.payment_status],
  ].filter(([, v]) => v);

  return (
    <div className="bd-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bd-card">
        <div className="bd-header">
          <div className="bd-title-row">
            <h2>{copy.details}</h2>
            <div className="mb-status-badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.dot}66` }}>
              <span className="mb-status-dot" style={{ background: c.dot }} />
              {c.label}
            </div>
          </div>
          <button className="bd-close" onClick={onClose}>✕</button>
        </div>
        <div className="bd-body">
          {fields.map(([label, value]) => (
            <div key={label} className="bd-row">
              <span className="bd-label">{label}</span>
              <span className="bd-value">{value}</span>
            </div>
          ))}
        </div>
        <div className="bd-footer">
          <button className="mb-book-btn" onClick={onClose}>{copy.close}</button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/auth-context';
import LoginModal from '../components/LoginModal';
import './MyBookings.css';

const STATUS_COLORS = {
  'Pending':          { bg: '#7c2d12', color: '#fed7aa', dot: '#f97316' },
  'Awaiting Payment': { bg: '#713f12', color: '#fef08a', dot: '#eab308' },
  'Confirmed':        { bg: '#14532d', color: '#bbf7d0', dot: '#22c55e' },
  'Completed':        { bg: '#1e3a5f', color: '#bfdbfe', dot: '#3b82f6' },
  'Cancelled':        { bg: '#7f1d1d', color: '#fecaca', dot: '#ef4444' },
};

const navigateTo = (href) => {
  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event('app:navigate'));
};

export default function MyBookings() {
  const { user, userProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const displayName = userProfile?.fullName || user?.displayName || 'Devotee';

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchBookings();
  }, [user]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setError('Could not load bookings. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <section className="mybookings-section">
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} redirectAfterLogin="/my-bookings" />}
        <div className="mybookings-empty">
          <div className="mybookings-empty-icon"></div>
          <h2>Login to View Your Bookings</h2>
          <p>Please login to see your pooja booking history and status updates.</p>
          <button className="mb-login-btn" onClick={() => setShowLogin(true)}>
            Login / Sign Up
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mybookings-section">
      {selected && <BookingDetailModal booking={selected} onClose={() => setSelected(null)} />}

      <div className="mybookings-header">
        <div className="mybookings-mandala" aria-hidden="true" />
        <p className="mb-tag">My Account</p>
        <h1 className="mb-title">My Bookings</h1>
        <div className="mb-divider">
          <span className="mb-line" />
          <span className="mb-lotus"></span>
          <span className="mb-line" />
        </div>
        <p className="mb-welcome">Namaste, <strong>{displayName}</strong> — here are all your sacred pooja bookings.</p>
      </div>

      <div className="mybookings-container">
        {/* Stats bar */}
        {bookings.length > 0 && (
          <div className="mb-stats">
            {['Pending','Confirmed','Completed','Cancelled'].map(s => {
              const count = bookings.filter(b => b.status === s).length;
              if (!count) return null;
              const c = STATUS_COLORS[s] || STATUS_COLORS.Pending;
              return (
                <div key={s} className="mb-stat-chip" style={{ background: c.bg + '55', border: `1px solid ${c.dot}44` }}>
                  <span className="mb-stat-dot" style={{ background: c.dot }} />
                  <span style={{ color: c.color }}>{count} {s}</span>
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="mb-loading">
            <div className="mb-spinner" />
            <p>Loading your bookings...</p>
          </div>
        )}

        {error && <div className="mb-error">{error}</div>}

        {!loading && !error && bookings.length === 0 && (
          <div className="mybookings-empty">
            <div className="mybookings-empty-icon"></div>
            <h2>No Bookings Yet</h2>
            <p>You haven't booked any pooja services yet. Browse our services and make your first booking!</p>
            <button className="mb-login-btn" onClick={() => navigateTo('/services')}>
              Browse Poojas →
            </button>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="mb-grid">
            {bookings.map(b => (
              <BookingCard key={b.id} booking={b} onViewDetails={() => setSelected(b)} />
            ))}
          </div>
        )}

        <div className="mb-actions">
          <button className="mb-book-btn" onClick={() => navigateTo('/services')}>
            + Book Another Pooja
          </button>
        </div>
      </div>
    </section>
  );
}

function BookingCard({ booking: b, onViewDetails }) {
  const status = b.status || 'Pending';
  const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  const dateStr = b.date || (b.createdAt?.toDate ? b.createdAt.toDate().toLocaleDateString('en-IN') : '—');

  return (
    <div className="mb-card">
      <div className="mb-card-top">
        <div className="mb-card-pooja">
          <span className="mb-card-icon"></span>
          <div>
            <h3 className="mb-card-name">{b.poojaName || b.poojaType || 'Pooja Booking'}</h3>
            <span className="mb-card-id">ID: {b.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
        <div className="mb-status-badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.dot}66` }}>
          <span className="mb-status-dot" style={{ background: c.dot }} />
          {status}
        </div>
      </div>

      <div className="mb-card-details">
        <div className="mb-detail"><span></span> {dateStr}</div>
        {b.time && <div className="mb-detail"><span></span> {b.time}</div>}
        {b.city && <div className="mb-detail"><span></span> {b.city}</div>}
        {b.pandit && <div className="mb-detail"><span></span> {b.pandit}</div>}
      </div>

      <button className="mb-view-btn" onClick={onViewDetails}>
        View Details →
      </button>
    </div>
  );
}

function BookingDetailModal({ booking: b, onClose }) {
  const status = b.status || 'Pending';
  const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;

  const fields = [
    ['Booking ID', b.id],
    ['Pooja / Event', b.poojaName || b.poojaType],
    ['Name', b.userName || b.name],
    ['Email', b.userEmail || b.email],
    ['Mobile', b.userPhone || b.phone],
    ['Date', b.date],
    ['Time', b.time],
    ['City', b.city],
    ['Address', b.address],
    ['Pandit', b.pandit],
    ['Nakshatram', b.nakshatram],
    ['Gotram', b.gotram],
    ['Special Instructions', b.message || b.instructions],
    ['Advance Paid', b.advanceAmount ? `₹${b.advanceAmount}` : null],
  ].filter(([, v]) => v);

  return (
    <div className="bd-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bd-card">
        <div className="bd-header">
          <div className="bd-title-row">
            <h2>Booking Details</h2>
            <div className="mb-status-badge" style={{ background: c.bg, color: c.color, border: `1px solid ${c.dot}66` }}>
              <span className="mb-status-dot" style={{ background: c.dot }} />
              {status}
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
          <button className="mb-book-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

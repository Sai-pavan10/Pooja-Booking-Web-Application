import { useEffect, useRef, useState } from 'react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/auth-context";
import { getServiceItems, useLanguage } from '../i18n';
import LoginModal from "../components/LoginModal";
import { showToast } from '../components/toast-service';
import './Booking.css';

// ─── STRIPE CONFIG ────────────────────────────────────────────────────────────
const STRIPE_LINKS = {
  default:   'https://buy.stripe.com/YOUR_DEFAULT_LINK',
  homam:     'https://buy.stripe.com/YOUR_HOMAM_LINK',
  muhurtham: 'https://buy.stripe.com/YOUR_MUHURTHAM_LINK',
};

function getStripeLink(poojaType) {
  const lower = poojaType.toLowerCase();
  if (lower.includes('homam') || lower.includes('havan')) return STRIPE_LINKS.homam;
  if (lower.includes('muhurtham') || lower.includes('kalyanam')) return STRIPE_LINKS.muhurtham;
  return STRIPE_LINKS.default;
}

const ADVANCE_AMOUNT = { default: 500, homam: 1000, muhurtham: 700 };

function getAdvanceAmount(poojaType) {
  const lower = poojaType.toLowerCase();
  if (lower.includes('homam') || lower.includes('havan')) return ADVANCE_AMOUNT.homam;
  if (lower.includes('muhurtham') || lower.includes('kalyanam')) return ADVANCE_AMOUNT.muhurtham;
  return ADVANCE_AMOUNT.default;
}
// ──────────────────────────────────────────────────────────────────────────────

const PANDITS_LIST = [
  'Pandit Ramesh Sharma',
  'Pandit Suresh Joshi',
  'Pandit Venkata Rao',
  'Pandit Mahesh Upadhyay',
];

const EMPTY = {
  name: '', phone: '', email: '', address: '', nakshatram: '', gotram: '',
  poojaType: '', pandit: '', date: '', time: '', location: '', city: '',
  muhurthamFrom: '', muhurthamTo: '', dob: '', message: '',
};

const STEP = { FORM: 'form', CONFIRM: 'confirm', PAYING: 'paying', SUCCESS: 'success' };

function safeLocalStorage(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

export default function Booking() {
  const { user, userProfile } = useAuth();
  const { language, content } = useLanguage();
  const text = content.booking;

  const poojaTypes = [
    ...getServiceItems(language).map(([title]) => title),
    'Sri Satyanarayana Swami Vratham',
    'Sri Sudhrashana Homam',
    'Rudrabhishek',
    'Ganesh Puja',
    'Vastu Shanti',
    'Custom / Other',
  ];

  // ── Single form declaration — auto-filled from userProfile ────────────────
  const [form, setForm] = useState(() => Object.assign({}, EMPTY, {
    name:  (userProfile && userProfile.fullName)  || (user && user.displayName) || '',
    email: (userProfile && userProfile.email)     || (user && user.email)       || '',
    phone: (userProfile && userProfile.mobile)    || '',
  }));
  // ─────────────────────────────────────────────────────────────────────────

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [step, setStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('payment') === 'success' ? STEP.SUCCESS : STEP.FORM;
  });

  const [bookingId, setBookingId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      return safeLocalStorage('pendingBookingId') || null;
    }
    return null;
  });

  const refs = useRef([]);

  // Auto-fill is handled by the lazy useState initializer above.
  // No useEffect needed — avoids cascading render warning.

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = text.errors[0];
    if (!/^\d{10}$/.test(form.phone)) e.phone = text.errors[1];
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = text.errors[2];
    if (!form.poojaType) e.poojaType = text.errors[3];
    if (!form.date) e.date = text.errors[4];
    if (!form.time) e.time = text.errors[5];
    if (!form.city.trim()) e.city = text.errors[6];
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!user) { setShowLogin(true); showToast('Please login to continue booking poojas.', 'info'); return; }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(STEP.CONFIRM);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userName: form.name,
        userEmail: form.email,
        userPhone: form.phone,
        address: form.address,
        nakshatram: form.nakshatram,
        gotram: form.gotram,
        poojaName: form.poojaType,
        pandit: form.pandit,
        date: form.date,
        time: form.time,
        location: form.location,
        city: form.city,
        muhurthamFrom: form.muhurthamFrom,
        muhurthamTo: form.muhurthamTo,
        dob: form.dob,
        message: form.message,
        status: "Awaiting Payment",
        advanceAmount: getAdvanceAmount(form.poojaType),
        createdAt: serverTimestamp(),
      });

      localStorage.setItem('pendingBookingId', docRef.id);
      setBookingId(docRef.id);

      const stripeLink = getStripeLink(form.poojaType);
      const successUrl = encodeURIComponent(
        `${window.location.origin}${window.location.pathname}?payment=success&bookingId=${docRef.id}`
      );
      const cancelUrl = encodeURIComponent(
        `${window.location.origin}${window.location.pathname}?payment=cancelled`
      );

      const stripeUrl =
        `${stripeLink}` +
        `?prefilled_email=${encodeURIComponent(form.email)}` +
        `&client_reference_id=${docRef.id}` +
        `&success_url=${successUrl}` +
        `&cancel_url=${cancelUrl}`;

      setStep(STEP.PAYING);
      window.location.href = stripeUrl;
    } catch (err) {
      console.error("Booking save failed:", err);
      setErrors({ submit: "Something went wrong. Please try again." });
      setStep(STEP.FORM);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `*Muhurtham / Pooja Booking Request*\n\n` +
      (form.name     ? `Name: ${form.name}\n` : '') +
      (form.phone    ? `Phone: ${form.phone}\n` : '') +
      (form.email    ? `Email: ${form.email}\n` : '') +
      (form.address  ? `Address: ${form.address}\n` : '') +
      (form.poojaType ? `Pooja / Event: ${form.poojaType}\n` : '') +
      (form.date     ? `Date: ${form.muhurthamFrom || form.date} to ${form.muhurthamTo || form.date}\n` : '') +
      (form.city     ? `City: ${form.city}\n` : '') +
      (form.message  ? `Note: ${form.message}` : '')
    );
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  // ── SUCCESS SCREEN ──────────────────────────────────────────────────────────
  if (step === STEP.SUCCESS) {
    return (
      <section id="booking" className="booking-section">
        <div className="container">
          <div className="booking-success reveal visible">
            <div className="success-icon"></div>
            <h3 className="success-title">Booking Confirmed & Payment Received!</h3>
            <p className="success-msg">
              Thank you <strong>{form.name || 'Devotee'}</strong>. Your advance payment has been
              received and your <strong>{form.poojaType || 'pooja'}</strong> booking is now
              confirmed. We will call you within 2 hours to finalise the schedule.
            </p>
            {bookingId && (
              <p className="success-booking-id">Booking ID: <code>{bookingId}</code></p>
            )}
            <p className="success-sub">{text.successSub}</p>
            <button
              className="btn-primary"
              onClick={() => {
                setForm(EMPTY);
                setStep(STEP.FORM);
                localStorage.removeItem('pendingBookingId');
                window.history.replaceState({}, '', window.location.pathname);
              }}
            >
              {text.another}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── PAYMENT CONFIRMATION PANEL ──────────────────────────────────────────────
  if (step === STEP.CONFIRM || step === STEP.PAYING) {
    const advance = getAdvanceAmount(form.poojaType);
    return (
      <section id="booking" className="booking-section">
        <div className="container">
          <div className="payment-confirm-card reveal visible">
            <div className="payment-confirm-header">
              <span className="payment-lock-icon"></span>
              <h3>Review & Pay Advance</h3>
              <p className="payment-secure-label">Secured by Stripe</p>
            </div>

            <div className="payment-summary">
              <h4>Booking Summary</h4>
              <div className="summary-grid">
                <div className="summary-row"><span>Name</span><strong>{form.name}</strong></div>
                <div className="summary-row"><span>Pooja / Event</span><strong>{form.poojaType}</strong></div>
                <div className="summary-row"><span>Date</span><strong>{form.date}</strong></div>
                <div className="summary-row"><span>Time</span><strong>{form.time}</strong></div>
                <div className="summary-row"><span>City</span><strong>{form.city}</strong></div>
                {form.pandit && <div className="summary-row"><span>Pandit</span><strong>{form.pandit}</strong></div>}
                {form.nakshatram && <div className="summary-row"><span>Nakshatram</span><strong>{form.nakshatram}</strong></div>}
              </div>
            </div>

            <div className="payment-amount-box">
              <div className="amount-label">Advance Amount to Pay Now</div>
              <div className="amount-value">Rs.{advance.toLocaleString('en-IN')}</div>
              <div className="amount-note">Balance due on the day of the pooja</div>
            </div>

            <div className="payment-methods">
              <span>Pay via</span>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                alt="Stripe"
                className="stripe-logo"
              />
              <span className="payment-method-icons"> UPI · Cards · Net Banking · Wallets</span>
            </div>

            {errors.submit && <p className="booking-error">{errors.submit}</p>}

            <div className="payment-actions">
              <button
                className="btn-secondary"
                onClick={() => setStep(STEP.FORM)}
                disabled={loading || step === STEP.PAYING}
              >
                ← Edit Booking
              </button>
              <button
                className="btn-pay"
                onClick={handlePayNow}
                disabled={loading || step === STEP.PAYING}
              >
                {step === STEP.PAYING
                  ? '⏳ Redirecting to Stripe...'
                  : `Pay Rs.${advance.toLocaleString('en-IN')} Now ->`}
              </button>
            </div>

            <p className="payment-disclaimer">
              You will be redirected to Stripe's secure checkout. Your card details are never
              stored on our servers. After successful payment, your booking status will be
              updated automatically.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ── BOOKING FORM ────────────────────────────────────────────────────────────
  return (
    <>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      <section id="booking" className="booking-section">
        <div className="booking-bg-mandala" aria-hidden="true" />
        <div className="container">

          <div className="section-header reveal" ref={(el) => (refs.current[0] = el)}>
            <p className="section-tag" style={{ color: 'var(--maroon)' }}>{text.tag}</p>
            <h2 className="section-title" style={{ color: 'var(--maroon-dark)' }}>{text.title}</h2>
            <div className="divider">
              <span className="divider-line" />
              <span className="divider-lotus"></span>
              <span className="divider-line right" />
            </div>
            <p className="section-intro" style={{ color: 'var(--text-mid)' }}>{text.intro}</p>
          </div>

          <div className="payment-info-banner reveal" ref={(el) => (refs.current[98] = el)}>
            <span className="banner-icon"></span>
            <span>
              {text.securePaymentBanner}
            </span>
          </div>

          {!user && (
            <div className="auth-notice reveal" ref={(el) => (refs.current[99] = el)}>
              <span>Please</span>
              <button className="auth-notice-btn" onClick={() => setShowLogin(true)}>
                login or register
              </button>
              <span>to save your booking to your account.</span>
            </div>
          )}

          {errors.submit && <p className="booking-error">{errors.submit}</p>}

          <form
            className="booking-form reveal"
            ref={(el) => (refs.current[1] = el)}
            onSubmit={handleProceedToPayment}
            noValidate
          >
            <div className="form-row">
              <div className={`form-field${errors.name ? ' error' : ''}`}>
                <label htmlFor="name">{text.labels[0]} <span>*</span></label>
                <input
                  id="name" name="name" type="text"
                  placeholder={text.placeholders[0]}
                  value={form.name} onChange={handleChange}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className={`form-field${errors.phone ? ' error' : ''}`}>
                <label htmlFor="phone">{text.labels[1]} <span>*</span></label>
                <input
                  id="phone" name="phone" type="tel"
                  placeholder={text.placeholders[1]}
                  value={form.phone} onChange={handleChange} maxLength={10}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-field full">
              <label htmlFor="address">{text.labels[8] || 'Your Address (మీ చిరునామా)'}</label>
              <input
                id="address" name="address" type="text"
                placeholder="Enter your address"
                value={form.address} onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="nakshatram">మీ నక్షత్రం (Nakshatram)</label>
                <input
                  id="nakshatram" name="nakshatram" type="text"
                  placeholder="If known, enter your Nakshatram"
                  value={form.nakshatram} onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="gotram">మీ గోత్రం (Gotram)</label>
                <input
                  id="gotram" name="gotram" type="text"
                  placeholder="Enter Gotram (if known)"
                  value={form.gotram} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className={`form-field${errors.email ? ' error' : ''}`}>
                <label htmlFor="email">{text.labels[2]} <span>*</span></label>
                <input
                  id="email" name="email" type="email"
                  placeholder={text.placeholders[2]}
                  value={form.email} onChange={handleChange}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className={`form-field${errors.poojaType ? ' error' : ''}`}>
                <label htmlFor="poojaType">{text.labels[3]} <span>*</span></label>
                <select id="poojaType" name="poojaType" value={form.poojaType} onChange={handleChange}>
                  <option value="">{text.selectPooja}</option>
                  {poojaTypes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.poojaType && <span className="field-error">{errors.poojaType}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-field${errors.date ? ' error' : ''}`}>
                <label htmlFor="date">{text.labels[4]} <span>*</span></label>
                <input
                  id="date" name="date" type="date"
                  min={minDateStr} value={form.date} onChange={handleChange}
                />
                {errors.date && <span className="field-error">{errors.date}</span>}
              </div>
              <div className={`form-field${errors.time ? ' error' : ''}`}>
                <label htmlFor="time">{text.labels[5]} <span>*</span></label>
                <select id="time" name="time" value={form.time} onChange={handleChange}>
                  <option value="">{text.selectTime}</option>
                  <option>06:00 AM</option>
                  <option>07:00 AM</option>
                  <option>09:00 AM</option>
                  <option>11:00 AM</option>
                  <option>04:00 PM</option>
                  <option>06:00 PM</option>
                </select>
                {errors.time && <span className="field-error">{errors.time}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="pandit">{text.labels[6]}</label>
                <select id="pandit" name="pandit" value={form.pandit} onChange={handleChange}>
                  <option value="">{text.anyAvailable}</option>
                  {PANDITS_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className={`form-field${errors.city ? ' error' : ''}`}>
                <label htmlFor="city">{text.labels[7]} <span>*</span></label>
                <input
                  id="city" name="city" type="text"
                  placeholder={text.placeholders[3]}
                  value={form.city} onChange={handleChange}
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
            </div>

            <div className="form-field full">
              <label htmlFor="location">{text.labels[8]}</label>
              <input
                id="location" name="location" type="text"
                placeholder={text.placeholders[4]}
                value={form.location} onChange={handleChange}
              />
            </div>

            <div className="form-field full">
              <label>కావలసిన ముహూర్తం తేదీలు (Preferred Muhurtham Date Range)</label>
              <div className="form-row" style={{ gap: '1rem', marginTop: '0.5rem' }}>
                <input
                  name="muhurthamFrom" type="date"
                  value={form.muhurthamFrom} onChange={handleChange}
                  style={{ flex: 1 }}
                />
                <input
                  name="muhurthamTo" type="date"
                  value={form.muhurthamTo} onChange={handleChange}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="form-field full">
              <label htmlFor="dob">
                మీకు నక్షత్రం తెలియకపోతే, మీ జన్మ తేది, సమయం, జన్మస్థలం పంపండి:
              </label>
              <textarea
                id="dob" name="dob" rows={2}
                placeholder="DOB, Time, Place (if Nakshatram unknown)"
                value={form.dob} onChange={handleChange}
              />
            </div>

            <div className="form-field full">
              <label htmlFor="message">{text.labels[9]}</label>
              <textarea
                id="message" name="message" rows={4}
                placeholder={text.placeholders[5]}
                value={form.message} onChange={handleChange}
              />
            </div>

            {form.poojaType && (
              <div className="advance-preview">
                <span>Advance to pay:</span>
                <strong>Rs.{getAdvanceAmount(form.poojaType).toLocaleString('en-IN')}</strong>
                <span className="advance-note">(Balance on the day)</span>
              </div>
            )}

            <div className="form-footer">
              <p className="form-note">{text.note}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-whatsapp" onClick={handleWhatsApp}>
                  {text.whatsappButton}
                </button>
                <button type="submit" className="btn-primary booking-submit">
                  {user ? text.proceedToPayment : text.loginToBook}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

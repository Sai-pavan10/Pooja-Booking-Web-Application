import { useEffect, useRef, useState } from 'react';
import { getServiceItems, useLanguage } from '../i18n';
import './Booking.css';

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

export default function Booking() {
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
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleWhatsApp = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const msg = encodeURIComponent(
      `*Muhurtham / Pooja Booking Request*\n\n` +
      `👤 Name: ${form.name}\n` +
      `📍 Address: ${form.address || 'N/A'}\n` +
      `⭐ Nakshatram: ${form.nakshatram || 'N/A'}\n` +
      `🔱 Gotram: ${form.gotram || 'N/A'}\n` +
      `🪔 Pooja / Event: ${form.poojaType}\n` +
      `📅 Preferred Date Range: ${form.muhurthamFrom || form.date} to ${form.muhurthamTo || form.date}\n` +
      `📞 Phone: ${form.phone}\n` +
      `📧 Email: ${form.email}\n` +
      `🏙 City: ${form.city}\n` +
      (form.dob ? `🎂 DOB / Time / Place: ${form.dob}\n` : '') +
      (form.message ? `📝 Note: ${form.message}` : '')
    );
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  if (submitted) {
    return (
      <section id="booking" className="booking-section">
        <div className="container">
          <div className="booking-success reveal" ref={(el) => (refs.current[0] = el)}>
            <div className="success-icon"></div>
            <h3 className="success-title">{text.successTitle}</h3>
            <p className="success-msg">
              Thank you <strong>{form.name}</strong>. {form.poojaType} on{' '}
              <strong>{form.date}</strong> has been submitted. We will call you
              within 2 hours to confirm details.
            </p>
            <p className="success-sub">{text.successSub}</p>
            <button className="btn-primary" onClick={() => { setForm(EMPTY); setSubmitted(false); }}>
              {text.another}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
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

        <form className="booking-form reveal" ref={(el) => (refs.current[1] = el)} onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className={`form-field${errors.name ? ' error' : ''}`}>
              <label htmlFor="name">{text.labels[0]} <span>*</span></label>
              <input id="name" name="name" type="text" placeholder={text.placeholders[0]} value={form.name} onChange={handleChange} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className={`form-field${errors.phone ? ' error' : ''}`}>
              <label htmlFor="phone">{text.labels[1]} <span>*</span></label>
              <input id="phone" name="phone" type="tel" placeholder={text.placeholders[1]} value={form.phone} onChange={handleChange} maxLength={10} />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          {/* Row 2 – Address */}
          <div className="form-field full">
            <label htmlFor="address">{text.labels[8] || 'Your Address (మీ చిరునామా)'}</label>
            <input id="address" name="address" type="text" placeholder="Enter your address" value={form.address} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="nakshatram">మీ నక్షత్రం (Nakshatram)</label>
              <input id="nakshatram" name="nakshatram" type="text" placeholder="If known, enter your Nakshatram" value={form.nakshatram} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="gotram">మీ గోత్రం (Gotram)</label>
              <input id="gotram" name="gotram" type="text" placeholder="Enter Gotram (if known)" value={form.gotram} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className={`form-field${errors.email ? ' error' : ''}`}>
              <label htmlFor="email">{text.labels[2]} <span>*</span></label>
              <input id="email" name="email" type="email" placeholder={text.placeholders[2]} value={form.email} onChange={handleChange} />
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
              <input id="date" name="date" type="date" min={minDateStr} value={form.date} onChange={handleChange} />
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
              <input id="city" name="city" type="text" placeholder={text.placeholders[3]} value={form.city} onChange={handleChange} />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </div>
          </div>

          <div className="form-field full">
            <label htmlFor="location">{text.labels[8]}</label>
            <input id="location" name="location" type="text" placeholder={text.placeholders[4]} value={form.location} onChange={handleChange} />
          </div>

          {/* Muhurtham Date Range */}
          <div className="form-field full">
            <label>కావలసిన ముహూర్తం తేదీలు (Preferred Muhurtham Date Range)</label>
            <div className="form-row" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              <input name="muhurthamFrom" type="date" value={form.muhurthamFrom} onChange={handleChange} style={{ flex: 1 }} />
              <input name="muhurthamTo" type="date" value={form.muhurthamTo} onChange={handleChange} style={{ flex: 1 }} />
            </div>
          </div>

          {/* DOB field for Nakshatram lookup */}
          <div className="form-field full">
            <label htmlFor="dob">మీకు నక్షత్రం తెలియకపోతే, మీ జన్మ తేది, సమయం, జన్మస్థలం పంపండి:</label>
            <textarea id="dob" name="dob" rows={2}
              placeholder="DOB, Time, Place (if Nakshatram unknown)"
              value={form.dob} onChange={handleChange} />
          </div>

          <div className="form-field full">
            <label htmlFor="message">{text.labels[9]}</label>
            <textarea id="message" name="message" rows={4} placeholder={text.placeholders[5]} value={form.message} onChange={handleChange} />
          </div>

          <div className="form-footer">
            <p className="form-note">{text.note}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={handleWhatsApp}
                style={{ background: '#25D366', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📱 WhatsApp ద్వారా పంపించండి (Send via WhatsApp)
              </button>
              <button type="submit" className="btn-primary booking-submit" disabled={loading}>
                {loading ? `${text.submitting}...` : text.submit}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

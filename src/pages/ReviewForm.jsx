// ReviewForm.jsx
// Page: /submit-review
// Allows devotees to submit a review with star rating, service name, and message.

import { useState } from "react";
import { saveReview } from "../utils/reviewStorage";
import { useLanguage } from "../i18n";
import logo from "../assets/logo.PNG";
import "./ReviewForm.css";

const POOJA_SERVICES = [
  { en: "Ganesh Puja", te: "గణేష్ పూజ", hi: "गणेश पूजा" },
  { en: "Satyanarayan Katha", te: "సత్యనారాయణ కథ", hi: "सत्यनारायण कथा" },
  { en: "Griha Pravesh", te: "గృహ ప్రవేశం", hi: "गृह प्रवेश" },
  { en: "Navratri Puja", te: "నవరాత్రి పూజ", hi: "नवरात्रि पूजा" },
  { en: "Vastu Shanti", te: "వాస్తు శాంతి", hi: "वास्तु शांति" },
  { en: "Kali Puja", te: "కాళీ పూజ", hi: "काली पूजा" },
  { en: "Lakshmi Puja", te: "లక్ష్మీ పూజ", hi: "लक्ष्मी पूजा" },
  { en: "Rudrabhishek", te: "రుద్రాభిషేకం", hi: "रुद्राभिषेक" },
  { en: "Naamkaran Sanskar", te: "నామకరణ సంస్కారం", hi: "नामकरण संस्कार" },
  { en: "Vivah Puja", te: "వివాహ పూజ", hi: "विवाह पूजा" },
  { en: "Annaprashan", te: "అన్నప్రాశన", hi: "अन्नप्राशन" },
  { en: "Shradh / Pitru Puja", te: "శ్రాద్ధం / పితృ పూజ", hi: "श्राद्ध / पितृ पूजा" },
  { en: "Sunderkand Path", te: "సుందరకాండ పారాయణం", hi: "सुंदरकांड पाठ" },
  { en: "Ram Katha", te: "రామ కథ", hi: "राम कथा" },
  { en: "Other", te: "ఇతర", hi: "अन्य" },
];

const UI_TEXT = {
  en: {
    title: "Share Your Experience",
    subtitle: "Your blessings and feedback inspire us to serve you better",
    nameLabel: "Full Name",
    cityLabel: "City",
    namePlaceholder: "Enter your full name",
    optional: "(optional)",
    serviceLabel: "Pooja Service",
    servicePlaceholder: "Select a service...",
    ratingLabel: "Rating",
    reviewLabel: "Your Review",
    reviewPlaceholder: "Share your experience with our services...",
    submitBtn: "Submit Review",
    submitting: "Submitting...",
    viewAll: "View all reviews →",
    successMsg: " Your review has been submitted successfully!",
    errorMsg: "Something went wrong. Please try again.",
    valName: "Full name is required.",
    valService: "Please select a pooja service.",
    valRating: "Please select a rating.",
    valReview: "Review message is required.",
    valReviewShort: "Review must be at least 10 characters.",
    starLabels: ["", "Poor", "Fair", "Good", "Very Good", "Excellent"]
  },
  te: {
    title: "మీ అనుభవాన్ని పంచుకోండి",
    subtitle: "మీ ఆశీస్సులు మరియు అభిప్రాయాలు మా సేవలను మెరుగుపరచడానికి మాకు స్ఫూర్తినిస్తాయి",
    nameLabel: "పూర్తి పేరు",
    cityLabel: "నగరం",
    namePlaceholder: "మీ పూర్తి పేరును నమోదు చేయండి",
    optional: "(ఐచ్ఛికం)",
    serviceLabel: "పూజా సేవ",
    servicePlaceholder: "ఒక సేవను ఎంచుకోండి...",
    ratingLabel: "రేటింగ్",
    reviewLabel: "మీ సమీక్ష",
    reviewPlaceholder: "మా సేవలతో మీ అనుభవాన్ని పంచుకోండి...",
    submitBtn: "సమీక్షను సమర్పించండి",
    submitting: "సమర్పిస్తున్నాము...",
    viewAll: "అన్ని సమీక్షలను చూడండి →",
    successMsg: " మీ సమీక్ష విజయవంతంగా సమర్పించబడింది!",
    errorMsg: "ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    valName: "పూర్తి పేరు అవసరం.",
    valService: "దయచేసి పూజా సేవను ఎంచుకోండి.",
    valRating: "దయచేసి రేటింగ్‌ను ఎంచుకోండి.",
    valReview: "సమీక్ష సందేశం అవసరం.",
    valReviewShort: "సమీక్ష కనీసం 10 అక్షరాలు ఉండాలి.",
    starLabels: ["", "బాగోలేదు", "పర్వాలేదు", "మంచిది", "చాలా బాగుంది", "అద్భుతం"]
  },
  hi: {
    title: "अपना अनुभव साझा करें",
    subtitle: "आपके आशीर्वाद और प्रतिक्रिया हमें आपकी बेहतर सेवा करने के लिए प्रेरित करते हैं",
    nameLabel: "पूरा नाम",
    cityLabel: "शहर",
    namePlaceholder: "अपना पूरा नाम दर्ज करें",
    optional: "(वैकल्पिक)",
    serviceLabel: "पूजा सेवा",
    servicePlaceholder: "एक सेवा चुनें...",
    ratingLabel: "रेटिंग",
    reviewLabel: "आपकी समीक्षा",
    reviewPlaceholder: "हमारी सेवाओं के साथ अपना अनुभव साझा करें...",
    submitBtn: "समीक्षा सबमिट करें",
    submitting: "सबमिट हो रहा है...",
    viewAll: "सभी समीक्षाएं देखें →",
    successMsg: " आपकी समीक्षा सफलतापूर्वक सबमिट कर दी गई है!",
    errorMsg: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    valName: "पूरा नाम आवश्यक है।",
    valService: "कृपया पूजा सेवा चुनें।",
    valRating: "कृपया रेटिंग चुनें।",
    valReview: "समीक्षा संदेश आवश्यक है।",
    valReviewShort: "समीक्षा कम से कम 10 अक्षरों की होनी चाहिए।",
    starLabels: ["", "खराब", "ठीक", "अच्छा", "बहुत अच्छा", "उत्कृष्ट"]
  }
};

const MAX_REVIEW_LENGTH = 500;

export default function ReviewForm() {
  const { language } = useLanguage();
  const ui = UI_TEXT[language] || UI_TEXT.en;

  const [form, setForm] = useState({
    name: "",
    city: "",
    service: "",
    rating: 0,
    review: "",
  });

  const [hoveredStar, setHoveredStar] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const navigate = (href) => {
    if (window.location.pathname === href) return;
    window.history.pushState({}, "", href);
    window.dispatchEvent(new Event("app:navigate"));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = ui.valName;
    if (!form.service) newErrors.service = ui.valService;
    if (!form.rating) newErrors.rating = ui.valRating;
    if (!form.review.trim()) newErrors.review = ui.valReview;
    else if (form.review.trim().length < 10)
      newErrors.review = ui.valReviewShort;
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStarClick = (star) => {
    setForm((prev) => ({ ...prev, rating: star }));
    if (errors.rating) setErrors((prev) => ({ ...prev, rating: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Simulate async save (replace with Firebase call when migrating)
    await new Promise((res) => setTimeout(res, 900));

    try {
      saveReview(form);
      setLoading(false);
      showToast(ui.successMsg);
      setForm({ name: "", city: "", service: "", rating: 0, review: "" });
      setErrors({});
      setTimeout(() => navigate("/reviews"), 2000);
    } catch {
      setLoading(false);
      showToast(ui.errorMsg, "error");
    }
  };

  return (
    <div className="rf-page">
      {/* Toast */}
      {toast && (
        <div className={`rf-toast rf-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="rf-container">
        {/* Header */}
        <div className="rf-header">
          <img className="rf-header-logo" src={logo} alt="Dharma Sankalpam logo" />
          <h1 className="rf-title">{ui.title}</h1>
          <p className="rf-subtitle">{ui.subtitle}</p>
        </div>

        <form className="rf-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="rf-field">
            <label className="rf-label" htmlFor="name">
              {ui.nameLabel} <span className="rf-required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`rf-input ${errors.name ? "rf-input--error" : ""}`}
              placeholder={ui.namePlaceholder}
              value={form.name}
              onChange={handleChange}
              maxLength={60}
            />
            {errors.name && <span className="rf-error">{errors.name}</span>}
          </div>

          {/* City */}
          <div className="rf-field">
            <label className="rf-label" htmlFor="city">
              {ui.cityLabel} <span className="rf-optional">{ui.optional}</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="rf-input"
              placeholder="e.g. Hyderabad, Mumbai"
              value={form.city}
              onChange={handleChange}
              maxLength={40}
            />
          </div>

          {/* Service */}
          <div className="rf-field">
            <label className="rf-label" htmlFor="service">
              {ui.serviceLabel} <span className="rf-required">*</span>
            </label>
            <select
              id="service"
              name="service"
              className={`rf-input rf-select ${errors.service ? "rf-input--error" : ""}`}
              value={form.service}
              onChange={handleChange}
            >
              <option value="">{ui.servicePlaceholder}</option>
              {POOJA_SERVICES.map((s) => (
                <option key={s.en} value={s.en}>
                  {s[language] || s.en}
                </option>
              ))}
            </select>
            {errors.service && (
              <span className="rf-error">{errors.service}</span>
            )}
          </div>

          {/* Star Rating */}
          <div className="rf-field">
            <label className="rf-label">
              {ui.ratingLabel} <span className="rf-required">*</span>
            </label>
            <div className="rf-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rf-star ${
                    star <= (hoveredStar || form.rating) ? "rf-star--active" : ""
                  }`}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
              {(hoveredStar || form.rating) > 0 && (
                <span className="rf-star-label">
                  {ui.starLabels[hoveredStar || form.rating]}
                </span>
              )}
            </div>
            {errors.rating && (
              <span className="rf-error">{errors.rating}</span>
            )}
          </div>

          {/* Review Message */}
          <div className="rf-field">
            <label className="rf-label" htmlFor="review">
              {ui.reviewLabel} <span className="rf-required">*</span>
            </label>
            <textarea
              id="review"
              name="review"
              className={`rf-textarea ${errors.review ? "rf-input--error" : ""}`}
              placeholder={ui.reviewPlaceholder}
              value={form.review}
              onChange={handleChange}
              maxLength={MAX_REVIEW_LENGTH}
              rows={5}
            />
            <div className="rf-char-count">
              <span className={form.review.length >= MAX_REVIEW_LENGTH ? "rf-char-count--max" : ""}>
                {form.review.length}
              </span>
              /{MAX_REVIEW_LENGTH}
              {errors.review && (
                <span className="rf-error" style={{ marginLeft: "auto" }}>
                  {errors.review}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`rf-submit ${loading ? "rf-submit--loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="rf-spinner" />
                {ui.submitting}
              </>
            ) : (
              <> {ui.submitBtn}</>
            )}
          </button>

          <p className="rf-view-link">
            <a href="/reviews">{ui.viewAll}</a>
          </p>
        </form>
      </div>
    </div>
  );
}

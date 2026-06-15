// ReviewsPage.jsx
// Page: /reviews
// Displays all submitted reviews with filter, sort, and average rating.

import { useState } from "react";
import {
  getReviews,
  getAverageRating,
  filterReviews,
  sortReviews,
  formatDate,
} from "../utils/reviewStorage";
import { useLanguage } from "../i18n";
import logo from "../assets/logo.PNG";
import "./ReviewsPage.css";

const UI_TEXT = {
  en: {
    title: "Devotee Reviews",
    trustedBy: "Trusted by",
    devotee: "Devotee",
    devotees: "Devotees",
    shareExp: "+ Share Your Experience",
    basedOn: "Based on",
    review: "review",
    reviews: "reviews",
    filter: "Filter",
    sortBy: "Sort by",
    allReviews: "All Reviews",
    latest: "Latest First",
    oldest: "Oldest First",
    highest: "Highest Rating",
    lowest: "Lowest Rating",
    showing: "Showing",
    of: "of",
    noReviews: "No reviews yet",
    noMatch: "No reviews match this filter",
    beFirst: "Be the first devotee to share your experience.",
    tryDifferent: "Try a different filter to see more reviews.",
    submitFirst: "Submit First Review"
  },
  te: {
    title: "భక్తుల అభిప్రాయాలు",
    trustedBy: "నమ్మకమైన",
    devotee: "భక్తుడు",
    devotees: "భక్తులు",
    shareExp: "+ మీ అనుభవాన్ని పంచుకోండి",
    basedOn: "ఆధారంగా",
    review: "అభిప్రాయం",
    reviews: "అభిప్రాయాలు",
    filter: "వడపోత",
    sortBy: "క్రమబద్ధీకరించు",
    allReviews: "అన్ని అభిప్రాయాలు",
    latest: "తాజావి మొదట",
    oldest: "పాతవి మొదట",
    highest: "అత్యధిక రేటింగ్",
    lowest: "అల్ప రేటింగ్",
    showing: "చూపిస్తున్నవి",
    of: "లో",
    noReviews: "ఇంకా సమీక్షలు లేవు",
    noMatch: "ఈ ఫిల్టర్‌కు సరిపోయే సమీక్షలు లేవు",
    beFirst: "అనుభవాన్ని పంచుకున్న మొదటి భక్తుడిగా ఉండండి.",
    tryDifferent: "మరిన్ని సమీక్షలను చూడటానికి వేరే ఫిల్టర్‌ని ప్రయత్నించండి.",
    submitFirst: "మొదటి సమీక్షను సమర్పించండి"
  },
  hi: {
    title: "भक्तों की समीक्षाएं",
    trustedBy: "भरोसेमंद",
    devotee: "भक्त",
    devotees: "भक्तों",
    shareExp: "+ अपना अनुभव साझा करें",
    basedOn: "आधारित",
    review: "समीक्षा",
    reviews: "समीक्षाएं",
    filter: "फ़िल्टर",
    sortBy: "क्रमबद्ध करें",
    allReviews: "सभी समीक्षाएं",
    latest: "नवीनतम पहले",
    oldest: "सबसे पुराना पहले",
    highest: "उच्चतम रेटिंग",
    lowest: "न्यूनतम रेटिंग",
    showing: "दिखा रहे हैं",
    of: "में से",
    noReviews: "अभी तक कोई समीक्षा नहीं",
    noMatch: "इस फ़िल्टर से कोई समीक्षा मेल नहीं खाती",
    beFirst: "अपना अनुभव साझा करने वाले पहले भक्त बनें।",
    tryDifferent: "अधिक समीक्षाएं देखने के लिए एक अलग फ़िल्टर आज़माएं।",
    submitFirst: "पहली समीक्षा सबमिट करें"
  }
};

const AVATAR_COLORS = [
  "#FF9933", "#E67E22", "#D35400", "#C0392B",
  "#8E44AD", "#2980B9", "#16A085", "#27AE60",
];

function getAvatarColor(initial) {
  const index = initial.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function StarDisplay({ rating, size = "sm" }) {
  return (
    <div className={`rp-star-display rp-star-display--${size}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "rp-star--filled" : "rp-star--empty"}>
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const avatarColor = getAvatarColor(review.avatarInitial);
  return (
    <div className="rp-card">
      <div className="rp-card-header">
        <div
          className="rp-avatar"
          style={{ background: avatarColor }}
          aria-label={`Avatar for ${review.name}`}
        >
          {review.avatarInitial}
        </div>
        <div className="rp-card-meta">
          <p className="rp-name">{review.name}</p>
          <p className="rp-location">
            {review.city ? `📍 ${review.city}` : ""}
          </p>
        </div>
        <div className="rp-card-rating">
          <StarDisplay rating={review.rating} />
        </div>
      </div>

      <div className="rp-service-tag">
        <span>🪔 {review.service}</span>
        <span className="rp-date">{formatDate(review.date)}</span>
      </div>

      <p className="rp-review-text">"{review.review}"</p>
    </div>
  );
}

export default function ReviewsPage() {
  const { language } = useLanguage();
  const ui = UI_TEXT[language] || UI_TEXT.en;
  const [allReviews] = useState(() => getReviews());
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const navigate = (href) => {
    if (window.location.pathname === href) return;
    window.history.pushState({}, "", href);
    window.dispatchEvent(new Event("app:navigate"));
  };

  const processed = sortReviews(filterReviews(allReviews, filterRating), sortBy);
  const average = getAverageRating(allReviews);
  const totalCount = allReviews.length;

  // Star breakdown counts
  const starBreakdown = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: allReviews.filter((r) => r.rating === s).length,
    pct: totalCount
      ? Math.round((allReviews.filter((r) => r.rating === s).length / totalCount) * 100)
      : 0,
  }));

  return (
    <div className="rp-page">
      {/* Hero */}
      <div className="rp-hero">
        <div className="rp-hero-inner">
          <img className="rp-hero-logo" src={logo} alt="Dharma Sankalpam logo" />
          <h1 className="rp-title">{ui.title}</h1>
          <p className="rp-subtitle">
            {ui.trustedBy}{" "}
            <strong>{totalCount} {totalCount === 1 ? ui.devotee : ui.devotees}</strong>
          </p>
          <button className="rp-submit-btn" onClick={() => navigate("/submit-review")}>
            {ui.shareExp}
          </button>
        </div>
      </div>

      <div className="rp-body">
        {/* Summary Section */}
        {totalCount > 0 && (
          <div className="rp-summary">
            <div className="rp-avg-block">
              <p className="rp-avg-number">{average.toFixed(1)}</p>
              <StarDisplay rating={Math.round(average)} size="lg" />
              <p className="rp-avg-label">{ui.basedOn} {totalCount} {totalCount !== 1 ? ui.reviews : ui.review}</p>
            </div>
            <div className="rp-breakdown">
              {starBreakdown.map(({ star, count, pct }) => (
                <div key={star} className="rp-breakdown-row">
                  <span className="rp-breakdown-label">{star}★</span>
                  <div className="rp-breakdown-bar-bg">
                    <div
                      className="rp-breakdown-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="rp-breakdown-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        {totalCount > 0 && (
          <div className="rp-controls">
            <div className="rp-control-group">
              <label className="rp-control-label" htmlFor="filter">{ui.filter}</label>
              <select
                id="filter"
                className="rp-select"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">{ui.allReviews}</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="rp-control-group">
              <label className="rp-control-label" htmlFor="sort">{ui.sortBy}</label>
              <select
                id="sort"
                className="rp-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">{ui.latest}</option>
                <option value="oldest">{ui.oldest}</option>
                <option value="highest">{ui.highest}</option>
                <option value="lowest">{ui.lowest}</option>
              </select>
            </div>
            <span className="rp-result-count">
              {ui.showing} {processed.length} {ui.of} {totalCount}
            </span>
          </div>
        )}

        {/* Reviews Grid */}
        {processed.length > 0 ? (
          <div className="rp-grid">
            {processed.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="rp-empty">
            <div className="rp-empty-icon">🪔</div>
            <p className="rp-empty-title">
              {totalCount === 0
                ? ui.noReviews
                : ui.noMatch}
            </p>
            <p className="rp-empty-sub">
              {totalCount === 0
                ? ui.beFirst
                : ui.tryDifferent}
            </p>
            {totalCount === 0 && (
              <button
                className="rp-submit-btn rp-submit-btn--outline"
                onClick={() => navigate("/submit-review")}
              >
                {ui.submitFirst}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

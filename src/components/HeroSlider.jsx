import { useState, useEffect, useRef, useCallback } from 'react';
import './HeroSlider.css';

/**
 * HeroSlider — a TTD-homepage-style rotating banner slider, built natively
 * in React (no jQuery / Skitter dependency needed).
 *
 * Props:
 *  - slides: [{ src, alt, caption? }]
 *  - interval: autoplay delay in ms (default 5000, matches TTD's pacing)
 */
export default function HeroSlider({ slides, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (i) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearTimeout(timerRef.current);
  }, [index, paused, interval, slides.length]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Featured poojas and services"
    >
      <div className="hero-slider-track">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`hero-slide${i === index ? ' active' : ''}`}
            aria-hidden={i !== index}
          >
            <img
              src={slide.src}
              alt={slide.alt || ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable="false"
            />
            {slide.caption && <div className="hero-slide-caption">{slide.caption}</div>}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button className="hero-slider-arrow prev" onClick={prev} aria-label="Previous slide">
            ‹
          </button>
          <button className="hero-slider-arrow next" onClick={next} aria-label="Next slide">
            ›
          </button>

          <div className="hero-slider-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-slider-dot${i === index ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="hero-slider-progress-wrap">
            <div
              key={index}
              className="hero-slider-progress"
              style={{
                animationDuration: `${interval}ms`,
                animationPlayState: paused ? 'paused' : 'running',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

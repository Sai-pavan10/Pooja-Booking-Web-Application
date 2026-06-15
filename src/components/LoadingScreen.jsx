/**
 * DHARMA SANKALPAM – Vedic Loading Screen
 * Premium Spiritual UI Component
 * ─────────────────────────────────────────
 * Usage:  import LoadingScreen from './LoadingScreen';
 *         <LoadingScreen onComplete={() => setLoaded(true)} />
 *
 * Props:
 *   onComplete  – callback fired when loading finishes (optional)
 *   duration    – loading duration in ms (default: 5000)
 */

import React, { useEffect, useRef, useState } from 'react';
import logoImage from '../assets/logo.PNG';
import './LoadingScreen.css';

// DharmaSankalpam.jsx

// Particle component
function Particle({ style }) {
  return <div className="particle" style={style} />;
}

// Golden spark for transition
function GoldenSpark({ style }) {
  return <div className="golden-spark" style={style} />;
}

// SVG Mandala
function Mandala() {
  return (
    <svg className="mandala" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mandalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FF8C00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#glow)" opacity="0.85">
        {/* Outer ring petals */}
        {Array.from({ length: 24 }).map((_, i) => (
          <ellipse
            key={`outer-${i}`}
            cx="200"
            cy="200"
            rx="6"
            ry="85"
            fill="none"
            stroke="#FFD700"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            transform={`rotate(${i * 15} 200 200)`}
          />
        ))}
        {/* Mid ring */}
        {Array.from({ length: 16 }).map((_, i) => (
          <ellipse
            key={`mid-${i}`}
            cx="200"
            cy="200"
            rx="5"
            ry="55"
            fill="url(#mandalGrad)"
            fillOpacity="0.4"
            transform={`rotate(${i * 22.5 + 11} 200 200)`}
          />
        ))}
        {/* Inner ring */}
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={`inner-${i}`}
            cx="200"
            cy="200"
            rx="5"
            ry="28"
            fill="#FF8C00"
            fillOpacity="0.7"
            transform={`rotate(${i * 45} 200 200)`}
          />
        ))}
        {/* Circles */}
        <circle cx="200" cy="200" r="90" fill="none" stroke="#FFD700" strokeWidth="0.6" strokeOpacity="0.4" />
        <circle cx="200" cy="200" r="65" fill="none" stroke="#FF8C00" strokeWidth="0.8" strokeOpacity="0.5" />
        <circle cx="200" cy="200" r="40" fill="none" stroke="#FFD700" strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="200" cy="200" r="18" fill="#FF8C00" fillOpacity="0.3" stroke="#FFD700" strokeWidth="1.5" />
        {/* Center dot */}
        <circle cx="200" cy="200" r="5" fill="#FFD700" />
        {/* Chakra spokes */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          return (
            <line
              key={`spoke-${i}`}
              x1={200 + 18 * Math.cos(angle)}
              y1={200 + 18 * Math.sin(angle)}
              x2={200 + 90 * Math.cos(angle)}
              y2={200 + 90 * Math.sin(angle)}
              stroke="#FFD700"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
          );
        })}
      </g>
    </svg>
  );
}

// Aura rays behind Hanuman
function AuraRays() {
  return (
    <svg className="aura-rays" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FF8C00" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i * 18 * Math.PI) / 180;
        const x2 = 300 + 280 * Math.cos(angle);
        const y2 = 300 + 280 * Math.sin(angle);
        return (
          <line
            key={i}
            x1="300"
            y1="300"
            x2={x2}
            y2={y2}
            stroke="#FFD700"
            strokeWidth={i % 2 === 0 ? "2.5" : "1"}
            strokeOpacity={i % 2 === 0 ? "0.5" : "0.25"}
          />
        );
      })}
      <circle cx="300" cy="300" r="120" fill="url(#auraGrad)" />
      <circle cx="300" cy="300" r="60" fill="#FFD700" fillOpacity="0.15" />
    </svg>
  );
}

export default function DharmaSankalpam({ onComplete }) {
  // Phases: "hanuman" | "transition" | "welcome"
  const [phase, setPhase] = useState("hanuman");
  const [hanumanVisible, setHanumanVisible] = useState(true);
  const [transitionVisible, setTransitionVisible] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);

  // Generate particles once
  const particles = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 3}s`,
      opacity: Math.random() * 0.6 + 0.2,
    }))
  );

  const sparks = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 120 - 10}%`,
      top: `${Math.random() * 120 - 10}%`,
      size: `${Math.random() * 6 + 2}px`,
      delay: `${Math.random() * 0.8}s`,
      duration: `${Math.random() * 0.6 + 0.4}s`,
    }))
  );

  useEffect(() => {
    // Phase 1: Fade out Hanuman just before 1.5s
    const t1 = setTimeout(() => {
      setHanumanVisible(false);
    }, 1200);

    // Phase 2: Quick transition sparks
    const t2 = setTimeout(() => {
      setPhase("transition");
      setTransitionVisible(true);
    }, 1300);

    // Phase 3: Welcome screen starts exactly at 1.5s
    const t3 = setTimeout(() => {
      setTransitionVisible(false);
      setPhase("welcome");
      setWelcomeVisible(true);
    }, 1500);

    // Phase 4: Complete loading screen at 5.0s total
    const t4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="ds-root">
      <style>
        {`
          .ds-root, .ds-phase, .transition-overlay {
            background-color: #fda800 !important;
            background: #fda800 !important;
          }
        `}
      </style>
      {/* === PHASE 1: HANUMAN === */}
      <div className={`ds-phase ds-hanuman-phase ${phase !== "hanuman" && !hanumanVisible ? "ds-phase--gone" : ""} ${!hanumanVisible ? "ds-phase--fade-out" : "ds-phase--visible"}`}>
        {/* Background particles */}
        {particles.current.map((p) => (
          <Particle
            key={p.id}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
            }}
          />
        ))}

        {/* Fog layers */}
        <div className="fog fog-1" />
        <div className="fog fog-2" />

        {/* Aura rays */}
        <div className="aura-wrap">
          <AuraRays />
        </div>

        {/* Hanuman image */}
        <div className="hanuman-container">
          <div className="hanuman-glow-ring" />
          <img
            src={logoImage}
            alt="Dharma Sankalpam Logo"
            className="hanuman-img"
          />
          <div className="hanuman-glow-base" />
        </div>
      </div>

      {/* === PHASE 2: TRANSITION === */}
      <div className={`ds-phase ds-transition-phase ${transitionVisible ? "ds-phase--visible" : "ds-phase--hidden"}`}>
        <div className="transition-overlay" />
        {sparks.current.map((s) => (
          <GoldenSpark
            key={s.id}
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
        <div className="transition-blur-veil" />
      </div>

      {/* === PHASE 3: WELCOME === */}
      <div className={`ds-phase ds-welcome-phase ${welcomeVisible ? "ds-phase--visible" : "ds-phase--hidden"}`}>
        {/* Ambient particles */}
        {particles.current.slice(0, 40).map((p) => (
          <Particle
            key={p.id}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity * 0.5,
            }}
          />
        ))}

        {/* Fog */}
        <div className="fog fog-welcome-1" />
        <div className="fog fog-welcome-2" />

        {/* Mandala */}
        <div className={`mandala-wrap ${welcomeVisible ? "mandala-wrap--in" : ""}`}>
          <Mandala />
        </div>

        {/* Glassmorphism card */}
        <div className={`welcome-card ${welcomeVisible ? "welcome-card--in" : ""}`}>
          <div className="welcome-card-inner">
            <div className="om-symbol">ॐ</div>
            <h1 className="welcome-title">
              <span className="welcome-title-line1">Welcome to</span>
              <span className="welcome-title-line2">Dharma Sankalpam</span>
            </h1>
            <div className="welcome-divider">
              <span className="divider-dot" />
              <span className="divider-line" />
              <span className="divider-chakra">❋</span>
              <span className="divider-line" />
              <span className="divider-dot" />
            </div>
            <p className="welcome-subtitle">
              Begin your sacred journey · सत्यम् शिवम् सुन्दरम्
            </p>
            <button className="welcome-cta">
              <span className="cta-text">Enter the Sanctuary</span>
              <span className="cta-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Corner ornaments */}
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />
      </div>
    </div>
  );
}

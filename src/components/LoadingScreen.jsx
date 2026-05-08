import { useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

// ─── PARTICLE SYSTEM ─────────────────────────────────────────────────────────
function initParticles(canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 90 }, () => createParticle(canvas));

  function createParticle(c, x, y) {
    const isGold = Math.random() > 0.35;
    return {
      x: x ?? Math.random() * c.width,
      y: y ?? Math.random() * c.height,
      size: Math.random() * 2.5 + 0.4,
      speedX: (Math.random() - 0.5) * 0.55,
      speedY: -(Math.random() * 1.1 + 0.3),
      opacity: Math.random(),
      fade: Math.random() * 0.012 + 0.004,
      color: isGold
        ? `hsl(${38 + Math.random() * 20}, 85%, ${55 + Math.random() * 20}%)`
        : `hsl(${25 + Math.random() * 30}, 70%, ${45 + Math.random() * 25}%)`,
      glow: isGold ? 6 : 3,
      isSpark: Math.random() > 0.78,
    };
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Draw
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      if (p.isSpark) {
        // elongated spark
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.glow * 2;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * 0.7;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speedX * 6, p.y - p.speedY * 6);
        ctx.stroke();
      } else {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.glow;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Move
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity -= p.fade;

      // Respawn
      if (p.opacity <= 0 || p.y < -10) {
        const respawned = createParticle(canvas,
          canvas.width * 0.25 + Math.random() * canvas.width * 0.5,
          canvas.height * 0.55 + Math.random() * canvas.height * 0.3
        );
        particles[i] = { ...respawned, opacity: 0, fade: respawned.fade };
        particles[i].opacity = Math.random() * 0.3; // fade in from 0
      }
    });

    animId = requestAnimationFrame(animate);
  }

  animate();

  const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("resize", onResize);
  };
}

// ─── LOADING SCREEN COMPONENT ─────────────────────────────────────────────────
export default function LoadingScreen({ onComplete, logoSrc }) {
  const canvasRef = useRef(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing");

  // Particle system
  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initParticles(canvasRef.current);
    return cleanup;
  }, []);

  // Loading text cycle
  useEffect(() => {
    const labels = [
      "Awakening",
      "Invoking Dharma",
      "Illuminating",
      "Manifesting",
      "Entering the Realm",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % labels.length;
      setLoadingText(labels[idx]);
    }, 640);
    return () => clearInterval(interval);
  }, []);

  // Trigger fade-out after ~3.8 s then call onComplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onComplete?.(), 1300);
    }, 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loading-screen${fadeOut ? " fade-out" : ""}`}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Atmospheric rings */}
      <div className="ring ring-1" />
      <div className="ring ring-2" />
      <div className="ring ring-3" />

      {/* Radial light burst */}
      <div className="light-burst" />

      {/* Scan-line texture */}
      <div className="scanlines" />

      {/* Vignette */}
      <div className="vignette" />

      {/* ── LOGO ── */}
      <div className="logo-wrapper" style={{ position: "relative", zIndex: 10 }}>
        <div className="logo-frame">
          <span className="corner corner-tl" />
          <span className="corner corner-tr" />
          <span className="corner corner-bl" />
          <span className="corner corner-br" />
          <img
            src={logoSrc || "/welcome_page.png"}
            alt="Welcome to Dharmasankalpam"
            className="logo-image"
            style={{ position: "relative", zIndex: 2, maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
            draggable={false}
          />
        </div>
      </div>

      {/* ── TAGLINE ── */}
      <p className="tagline">
        ॥ &nbsp; Where Ancient Wisdom Meets Eternal Purpose &nbsp; ॥
      </p>

      {/* ── GOLDEN DIVIDER ── */}
      <div className="divider">
        <div className="divider-line" />
        <div className="divider-diamond" />
        <div className="divider-line" />
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="loader-container">
        <div className="loader-track">
          <div className="loader-fill" />
        </div>
        <span className="loader-label">{loadingText}&hellip;</span>
      </div>
    </div>
  );
}

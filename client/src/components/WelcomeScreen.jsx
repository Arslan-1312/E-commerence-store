import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

// ── Modern Chandelier Earring SVG ──────────────────────────────────────────
const ModernEarringSVG = ({ className = "w-48 h-48 text-[#7A3B4E]" }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.2">
    <polygon points="50,10 57,18 50,26 43,18" fill="#7A3B4E" fillOpacity="0.3" />
    <circle cx="50" cy="18" r="2.5" fill="#F4A7B9" />
    <line x1="50" y1="26" x2="50" y2="38" strokeDasharray="2 2" />
    <path d="M 32,45 L 68,45 L 50,68 Z" fill="#7A3B4E" fillOpacity="0.15" strokeWidth="1.5" />
    <circle cx="50" cy="52" r="4" fill="#F4A7B9" />
    {[34, 42, 50, 58, 66].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="68" x2={x} y2={82 + (i === 2 ? 6 : 0)} />
        <polygon points={`${x},${84 + (i === 2 ? 6 : 0)} ${x+3},${90 + (i === 2 ? 6 : 0)} ${x},${96 + (i === 2 ? 6 : 0)} ${x-3},${90 + (i === 2 ? 6 : 0)}`} fill="#7A3B4E" />
      </g>
    ))}
  </svg>
);

// ── Modern Luxury Cuff Bracelet SVG ────────────────────────────────────────
const ModernCuffBraceletSVG = ({ className = "w-64 h-64 text-[#7A3B4E]" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.2">
    <ellipse cx="60" cy="60" rx="48" ry="38" strokeWidth="2.5" strokeDasharray="95 10" />
    <ellipse cx="60" cy="60" rx="42" ry="32" strokeWidth="1" strokeDasharray="3 3" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x = 60 + 45 * Math.cos(rad);
      const y = 60 + 35 * Math.sin(rad);
      return (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill={i % 2 === 0 ? "#7A3B4E" : "#F4A7B9"} />
          <circle cx={x} cy={y} r="1.5" fill="#FFFFFF" />
        </g>
      );
    })}
    <polygon points="60,44 68,54 60,68 52,54" fill="#7A3B4E" fillOpacity="0.2" strokeWidth="1.5" />
    <circle cx="60" cy="56" r="3" fill="#F4A7B9" />
  </svg>
);

const TOTAL_DURATION = 2000; // 2 seconds exactly
const TICK_INTERVAL = 20;    // tick every 20ms for smooth progress

export const WelcomeScreen = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const steps = TOTAL_DURATION / TICK_INTERVAL; // 100 steps
    const increment = 100 / steps;               // ~1% per step
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      const val = Math.min(Math.round(current), 100);
      setProgress(val);

      if (val >= 100) {
        clearInterval(interval);
        setDone(true);
        // Small pause at 100% so user can see it, then close
        setTimeout(() => setShowWelcome(false), 300);
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)', transition: { duration: 0.4, ease: 'easeInOut' } }}
          // Full screen, flex column, perfect center
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#FCE8EE',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >
          {/* ── Background SVGs ── */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.25 }}>
            {/* Center giant rotating bracelet */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              >
                <ModernCuffBraceletSVG className="w-[480px] h-[480px] text-[#7A3B4E]" />
              </motion.div>
            </div>
            {/* Top-left earring */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 32, left: 32 }}
            >
              <ModernEarringSVG className="w-44 h-44 text-[#7A3B4E]" />
            </motion.div>
            {/* Top-right bracelet */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: -40, right: -40 }}
            >
              <ModernCuffBraceletSVG className="w-64 h-64 text-[#7A3B4E]" />
            </motion.div>
            {/* Bottom-left bracelet */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', bottom: -48, left: -48 }}
            >
              <ModernCuffBraceletSVG className="w-72 h-72 text-[#7A3B4E]" />
            </motion.div>
            {/* Bottom-right earring */}
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [4, -4, 4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', bottom: 32, right: 32 }}
            >
              <ModernEarringSVG className="w-44 h-44 text-[#7A3B4E]" />
            </motion.div>
          </div>

          {/* ── CENTER CONTENT — Logo + Bar + Text ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {/* Logo */}
            <div style={{ width: 270, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Logo size="lg" showSubtitle={true} />
            </div>

            {/* Progress Bar + Counter */}
            <div style={{ width: 270 }}>
              {/* Track */}
              <div style={{
                width: '100%',
                height: 8,
                background: 'rgba(244,167,185,0.35)',
                borderRadius: 999,
                overflow: 'hidden',
                border: '1px solid rgba(244,167,185,0.4)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
              }}>
                {/* Fill */}
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: 'linear' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #F4A7B9, #7A3B4E, #5E2C3B)',
                    borderRadius: 999,
                    boxShadow: '0 0 16px rgba(122,59,78,0.7)',
                  }}
                />
              </div>

              {/* Labels */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 8,
                padding: '0 2px',
              }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: done ? '#5E2C3B' : '#7A3B4E',
                }}>
                  {done ? 'Collection Ready' : 'Loading Collections'}
                </span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: '#7A3B4E',
                }}>
                  {progress}%
                </span>
              </div>
            </div>

            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'rgba(122,59,78,0.75)',
              }}
            >
              Handmade Royal Jewelry &amp; Artisan Bags
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Lightweight top loading bar for React Suspense chunk loading
export const PageSuspenseFallback = () => (
  <div className="w-full h-1 bg-[#F4A7B9]/20 overflow-hidden relative">
    <div className="h-full bg-[#7A3B4E] animate-pulse w-full" />
  </div>
);

export default WelcomeScreen;

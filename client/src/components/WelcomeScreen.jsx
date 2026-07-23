import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

// ── Modern Chandelier Earring SVG ──────────────────────────────────────────
const ModernEarringSVG = ({ className = "w-48 h-48 text-[#7A3B4E]" }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.2">
    {/* Top Diamond Stud */}
    <polygon points="50,10 57,18 50,26 43,18" fill="#7A3B4E" fillOpacity="0.3" />
    <circle cx="50" cy="18" r="2.5" fill="#F4A7B9" />
    
    {/* Geometric Tier Drop */}
    <line x1="50" y1="26" x2="50" y2="38" strokeDasharray="2 2" />
    <path d="M 32,45 L 68,45 L 50,68 Z" fill="#7A3B4E" fillOpacity="0.15" strokeWidth="1.5" />
    <circle cx="50" cy="52" r="4" fill="#F4A7B9" />
    
    {/* Hanging Chandelier Droplets */}
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
    {/* Oval Modern Cuff Band */}
    <ellipse cx="60" cy="60" rx="48" ry="38" strokeWidth="2.5" strokeDasharray="95 10" />
    <ellipse cx="60" cy="60" rx="42" ry="32" strokeWidth="1" strokeDasharray="3 3" />
    
    {/* Gemstone Bezel Studs along Cuff */}
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

    {/* Center Modern Diamond Crown Emblem */}
    <polygon points="60,44 68,54 60,68 52,54" fill="#7A3B4E" fillOpacity="0.2" strokeWidth="1.5" />
    <circle cx="60" cy="56" r="3" fill="#F4A7B9" />
  </svg>
);

export const WelcomeScreen = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 2.0 second smooth progress counter 0% -> 100%
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)', transition: { duration: 0.45, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[99999] bg-[#FCE8EE] flex flex-col items-center justify-center text-center select-none overflow-hidden"
        >
          {/* Background SVGs — Featuring Modern Bracelets & Earrings in Center & Corners */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
            {/* Center Background: Modern Cuff Bracelet SVG + Earring in Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="relative flex items-center justify-center"
              >
                <ModernCuffBraceletSVG className="w-[480px] h-[480px] text-[#7A3B4E]" />
              </motion.div>
            </div>

            {/* Top Left: Modern Earring SVG */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 left-8 sm:top-12 sm:left-16"
            >
              <ModernEarringSVG className="w-40 h-40 sm:w-52 sm:h-52 text-[#7A3B4E]" />
            </motion.div>

            {/* Top Right: Modern Bracelet SVG */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-10 -right-10 sm:-top-16 sm:-right-16"
            >
              <ModernCuffBraceletSVG className="w-56 h-56 sm:w-72 sm:h-72 text-[#7A3B4E]" />
            </motion.div>

            {/* Bottom Left: Modern Cuff Bracelet SVG */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20"
            >
              <ModernCuffBraceletSVG className="w-60 h-60 sm:w-80 sm:h-80 text-[#7A3B4E]" />
            </motion.div>

            {/* Bottom Right: Modern Earring SVG */}
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [4, -4, 4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-8 right-8 sm:bottom-12 sm:right-16"
            >
              <ModernEarringSVG className="w-40 h-40 sm:w-52 sm:h-52 text-[#7A3B4E]" />
            </motion.div>
          </div>

          {/* Centered Welcome Container — Perfectly Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center gap-6 relative z-10 w-full max-w-sm px-4"
          >
            {/* Logo Container */}
            <div className="w-[270px] flex justify-center items-center">
              <Logo size="lg" showSubtitle={true} />
            </div>

            {/* Attractive Loading Section with Counter */}
            <div className="w-[270px] space-y-2">
              <div className="w-full h-2 bg-[#F4A7B9]/40 rounded-full overflow-hidden relative shadow-inner border border-[#F4A7B9]/30 p-0.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#F4A7B9] via-[#7A3B4E] to-[#5E2C3B] rounded-full shadow-[0_0_14px_rgba(122,59,78,0.7)]"
                />
              </div>

              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#7A3B4E] px-1 tracking-wider">
                <span>Loading Collections</span>
                <span className="font-mono">{progress}%</span>
              </div>
            </div>

            {/* Subtitle Tagline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#7A3B4E]/80 text-center"
            >
              Handmade Royal Jewelry & Artisan Bags
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

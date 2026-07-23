import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

// ── Detailed Earrings SVG (Jhumka / Chandelier Drop Earrings) ──────────────
const EarringsSVG = ({ className = "w-44 h-44 text-[#7A3B4E]" }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.2">
    {/* Top Stud Flower */}
    <circle cx="50" cy="20" r="8" fill="#7A3B4E" fillOpacity="0.2" />
    <circle cx="50" cy="20" r="4" fill="#F4A7B9" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <circle key={i} cx={50 + 10 * Math.cos((deg * Math.PI) / 180)} cy={20 + 10 * Math.sin((deg * Math.PI) / 180)} r="1.8" fill="#7A3B4E" />
    ))}
    
    {/* Connecting Link */}
    <line x1="50" y1="28" x2="50" y2="40" strokeDasharray="2 2" />
    <circle cx="50" cy="40" r="2.5" fill="#F4A7B9" />
    
    {/* Jhumka Bell Dome */}
    <path d="M 30,55 Q 50,38 70,55 Q 72,70 50,72 Q 28,70 30,55 Z" fill="#7A3B4E" fillOpacity="0.15" strokeWidth="1.5" />
    <path d="M 35,55 Q 50,42 65,55" strokeDasharray="3 3" />
    <line x1="30" y1="72" x2="70" y2="72" strokeWidth="1.5" />
    
    {/* Dangling Pearl Beads */}
    {[32, 38, 44, 50, 56, 62, 68].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="72" x2={x} y2={83 + (i % 2 === 0 ? 4 : 0)} />
        <circle cx={x} cy={86 + (i % 2 === 0 ? 4 : 0)} r="2.5" fill="#F4A7B9" />
      </g>
    ))}
  </svg>
);

// ── Detailed Bracelet / Bangle SVG (Kundan Gemstone Bangle) ────────────────
const BraceletSVG = ({ className = "w-52 h-52 text-[#7A3B4E]" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.2">
    {/* Outer & Inner Bangle Rings */}
    <circle cx="60" cy="60" r="50" strokeWidth="2" />
    <circle cx="60" cy="60" r="42" strokeWidth="1.5" strokeDasharray="4 3" />
    <circle cx="60" cy="60" r="34" strokeWidth="2" />
    
    {/* Gemstones & Filigree Studs along Bangle */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 60 + 46 * Math.cos(rad);
      const y1 = 60 + 46 * Math.sin(rad);
      return (
        <g key={i}>
          <circle cx={x1} cy={y1} r="3" fill={i % 2 === 0 ? "#7A3B4E" : "#F4A7B9"} />
        </g>
      );
    })}

    {/* Center Royal Medallion */}
    <circle cx="60" cy="60" r="18" fill="#7A3B4E" fillOpacity="0.1" />
    <path d="M 50,64 L 48,54 L 54,58 L 60,50 L 66,58 L 72,54 L 70,64 Z" fill="#7A3B4E" />
  </svg>
);

export const WelcomeScreen = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Exactly 2 seconds splash duration on initial load & page refresh
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
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
          {/* Background Jewelry SVG Watermarks (Earrings & Bracelets) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
            {/* Top Left: Jhumka Earrings SVG */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 left-8 sm:top-12 sm:left-16"
            >
              <EarringsSVG className="w-36 h-36 sm:w-48 sm:h-48 text-[#7A3B4E]" />
            </motion.div>

            {/* Top Right: Kundan Bangle / Bracelet SVG */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-12 -right-12 sm:-top-16 sm:-right-16"
            >
              <BraceletSVG className="w-56 h-56 sm:w-72 sm:h-72 text-[#7A3B4E]" />
            </motion.div>

            {/* Bottom Left: Kundan Bangle / Bracelet SVG */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20"
            >
              <BraceletSVG className="w-60 h-60 sm:w-80 sm:h-80 text-[#7A3B4E]" />
            </motion.div>

            {/* Bottom Right: Pair of Earrings SVG */}
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [4, -4, 4] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-8 right-8 sm:bottom-12 sm:right-16"
            >
              <EarringsSVG className="w-36 h-36 sm:w-48 sm:h-48 text-[#7A3B4E]" />
            </motion.div>

            {/* Center Background Giant Bangle Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <BraceletSVG className="w-[500px] h-[500px] text-[#7A3B4E]" />
            </div>
          </div>

          {/* Centered Content Box - Perfectly Centered Vertically & Horizontally */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center gap-6 relative z-10 w-full max-w-sm px-4"
          >
            {/* Logo Container (Centered) */}
            <div className="w-[270px] flex justify-center items-center">
              <Logo size="lg" showSubtitle={true} />
            </div>

            {/* 2-Second Precise Loading Bar */}
            <div className="w-[270px]">
              <div className="w-full h-1.5 bg-[#F4A7B9]/40 rounded-full overflow-hidden relative shadow-inner border border-[#F4A7B9]/30">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.0, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-[#F4A7B9] via-[#7A3B4E] to-[#5E2C3B] rounded-full shadow-[0_0_12px_rgba(122,59,78,0.6)]"
                />
              </div>
            </div>

            {/* Subtitle Tagline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
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

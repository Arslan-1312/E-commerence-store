import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export const WelcomeScreen = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // 2-second splash timer on initial load and page refresh
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
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)', transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[99999] bg-[#FCE8EE] flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Subtle Jewelry Watermark Background Motifs */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
            {/* Kundan Mandala SVG */}
            <svg className="w-[500px] h-[500px] text-[#7A3B4E] animate-spin-slow" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
              <circle cx="100" cy="100" r="90" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="70" />
              <circle cx="100" cy="100" r="50" strokeDasharray="6 6" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                <g key={deg} transform={`rotate(${deg} 100 100)`}>
                  <path d="M100 10 L105 25 L100 35 L95 25 Z" fill="#7A3B4E" fillOpacity="0.2" />
                  <circle cx="100" cy="45" r="3" fill="#7A3B4E" />
                </g>
              ))}
            </svg>
          </div>

          {/* Centered Welcome Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6 relative z-10"
          >
            {/* Logo Container (Exact bar alignment) */}
            <div className="w-[270px] flex justify-center">
              <Logo size="lg" showSubtitle={true} />
            </div>

            {/* Loading Bar with Gold Glow */}
            <div className="w-[270px]">
              <div className="w-full h-1.5 bg-[#F4A7B9]/40 rounded-full overflow-hidden relative shadow-inner border border-[#F4A7B9]/30">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.95, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full bg-gradient-to-r from-[#F4A7B9] via-[#7A3B4E] to-[#5E2C3B] rounded-full shadow-[0_0_12px_rgba(122,59,78,0.6)]"
                />
              </div>
            </div>

            {/* Royal Tagline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#7A3B4E]/80"
            >
              Haute Couture Handcrafted Luxury
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

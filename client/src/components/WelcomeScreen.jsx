import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export const WelcomeScreen = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // 2-second splash timer on initial load and every page refresh
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
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[99999] bg-[#FCE8EE] flex flex-col items-center justify-center select-none"
        >
          {/* Centered Welcome Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Logo Container (Fixed width for exact bar alignment) */}
            <div className="w-[270px] flex justify-center">
              <Logo size="lg" showSubtitle={true} />
            </div>

            {/* Straight Loading Bar (Length exactly matching logo width) */}
            <div className="w-[270px]">
              <div className="w-full h-1.5 bg-[#F4A7B9]/30 rounded-full overflow-hidden relative shadow-inner">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.95, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full bg-gradient-to-r from-[#F4A7B9] via-[#7A3B4E] to-[#5E2C3B] rounded-full"
                />
              </div>
            </div>
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

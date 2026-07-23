import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';

export const LuxuryToast = () => {
  const { toastMessage } = useShop();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] max-w-[90vw] sm:max-w-sm"
        >
          <div className="bg-[#1C1C1E] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold tracking-wide border border-[#F4A7B9]/20 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#96C99A] flex-shrink-0 animate-pulse" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LuxuryToast;

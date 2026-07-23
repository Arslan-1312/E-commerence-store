import React from 'react';

export const Logo = ({ size = "md", light = false, showSubtitle = true }) => {
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  }[size] || "w-11 h-11";

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl"
  }[size] || "text-lg";

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* Pink Circular Emblem with Crown & BWC Monogram */}
      <div className={`relative ${dimensions} rounded-full bg-[#F4A7B9] flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-105 overflow-hidden border border-[#E593A7]`}>
        {/* Subtle Watermark Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#7A3B4E_1px,transparent_1px)] [background-size:6px_6px]" />
        
        {/* Crown Icon + Monogram */}
        <div className="relative flex flex-col items-center justify-center text-[#7A3B4E]">
          {/* Crown */}
          <svg className="w-3/5 h-3/5 -mb-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
            <circle cx="3" cy="3.5" r="1.5" />
            <circle cx="8.5" cy="8.5" r="1.2" />
            <circle cx="12" cy="2.5" r="1.5" />
            <circle cx="15.5" cy="8.5" r="1.2" />
            <circle cx="21" cy="3.5" r="1.5" />
          </svg>

          {/* BWC Monogram Stylized Text */}
          <span className="font-serif font-black text-[9px] tracking-tighter leading-none text-[#1C1C1E]">
            BWC
          </span>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className={`font-serif font-bold ${textSizes} tracking-wider uppercase ${light ? 'text-white' : 'text-[#7A3B4E]'}`}>
          BINT-E-WAHEED
        </span>
        {showSubtitle && (
          <span className={`text-[10px] tracking-[0.25em] font-medium uppercase -mt-1 ${light ? 'text-[#F4A7B9]' : 'text-[#1C1C1E]/70'}`}>
            COLLECTION
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;

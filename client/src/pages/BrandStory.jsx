import React from 'react';
import { Crown, Award, Heart, ShieldCheck } from 'lucide-react';

export const BrandStory = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 bg-[#F4A7B9]/30 text-[#7A3B4E] text-xs font-bold uppercase tracking-widest rounded-full border border-[#F4A7B9]">
          The Heritage of Bint-e-Waheed
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#1C1C1E] leading-tight">
          Dedicated to the Sacred Art of <span className="gold-gradient-text">Handcrafted Couture</span>
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Founded with a passion for preserving centuries-old royal Pakistani jewelry craftsmanship and Zardozi embroidery, Bint-e-Waheed Collection produces strictly limited heirloom pieces for collectors worldwide.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop"
            alt="Artisan Craftsmanship"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
          <h2 className="font-serif font-bold text-2xl text-[#7A3B4E]">
            A Legacy Born of Passion
          </h2>
          <p>
            The name Bint-e-Waheed honors our founding heritage—a commitment to unyielding purity, perfection, and authentic handmade artistry. We reject mass production in favor of meticulous, slow luxury.
          </p>
          <p>
            From selecting flawless freshwater pearls and hydro emerald stones to stretching silk frames for Zardozi bullion thread wire, each piece represents tens of hours of manual labor by master goldsmiths and embroiderers.
          </p>

          <div className="pt-4 flex gap-4">
            <button
              onClick={() => setActiveTab('jewelry')}
              className="px-6 py-3 bg-[#7A3B4E] text-white font-serif text-xs font-bold uppercase rounded-2xl shadow-md hover:bg-[#5E2C3B]"
            >
              Explore Handmade Jewelry
            </button>
            <button
              onClick={() => setActiveTab('bags')}
              className="px-6 py-3 bg-white text-[#7A3B4E] border border-[#7A3B4E]/30 font-serif text-xs font-bold uppercase rounded-2xl shadow-sm hover:bg-[#FDF9F6]"
            >
              Explore Handmade Bags
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BrandStory;

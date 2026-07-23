import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Star, Award, Phone } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// ── Real product-style hero slides drawn from brand aesthetic ──────────
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400&auto=format&fit=crop',
    badge: 'New Arrival — Kundan',
    title: 'Gul-e-Rana Kundan Set',
    description: '24K Gold-plated with real freshwater pearls',
    price: 'Rs. 5,600',
    tab: 'jewelry',
  },
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1400&auto=format&fit=crop',
    badge: 'Bestseller — Zardozi',
    title: 'Noor-e-Shams Choker',
    description: 'Antique rose-gold Polki with emerald drops',
    price: 'Rs. 4,200',
    tab: 'jewelry',
  },
  {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop',
    badge: 'Limited — Velvet Potli',
    title: 'Shahi Zardozi Potli',
    description: 'Hand-embroidered velvet with gold bullion thread',
    price: 'Rs. 6,800',
    tab: 'bags',
  },
  {
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1400&auto=format&fit=crop',
    badge: 'Bridal Collection',
    title: 'Royal Pearl Clutch',
    description: 'Pure silk with 3,000 seed pearls & Dabka wire',
    price: 'Rs. 8,200',
    tab: 'bags',
  },
  {
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1400&auto=format&fit=crop',
    badge: 'Exclusive — Full Set',
    title: 'Bahar-e-Mehfil Bridal Set',
    description: 'Complete 5-piece Kundan bridal jewelry set',
    price: 'Rs. 18,500',
    tab: 'limited',
  },
];

// Slide transition variants
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 1.05 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] } },
  exit: (dir) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0, scale: 0.97, transition: { duration: 0.5 } }),
};

const tagVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const tagItem = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export const Home = ({ setActiveTab, onSelectProduct }) => {
  const { products, formatPrice } = useShop();

  // ── Live Countdown ──────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 42, seconds: 15 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Hero Slideshow ──────────────────────────────────────────
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToSlide = (nextIndex) => {
    setDirection(nextIndex > slideIndex ? 1 : -1);
    setSlideIndex(nextIndex);
  };
  const nextSlide = () => goToSlide((slideIndex + 1) % HERO_SLIDES.length);
  const prevSlide = () => goToSlide((slideIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slideIndex]);

  const currentSlide = HERO_SLIDES[slideIndex];
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">

      {/* ── Cinematic Hero with Slideshow ── */}
      <section className="relative min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8">
        {/* Ambient Orbs */}
        <div className="absolute top-12 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#F4A7B9]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#7A3B4E]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full">

          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-5 sm:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4A7B9]/30 text-[#7A3B4E] border border-[#F4A7B9] text-[11px] font-semibold tracking-widest uppercase">
              Haute Couture Handcrafted Masterpieces
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1C1E] leading-[1.15] tracking-tight">
              Where Royal Heritage Meets{' '}
              <span className="gold-gradient-text">Artisanal Grace</span>
            </h1>

            <p className="text-xs sm:text-base text-gray-600 max-w-xl font-normal leading-relaxed">
              Experience the pinnacle of Pakistani luxury. Each piece of <strong>handmade jewelry</strong> and <strong>hand-embroidered bag</strong> is individually fashioned by master artisans using 24K gold setting, real freshwater pearls, and intricate Zardozi thread work. Delivering nationwide across Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('jewelry')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#7A3B4E] text-white font-serif font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#5E2C3B] transition-all duration-300 flex items-center gap-3"
              >
                <span>Handmade Jewelry</span>
                <ArrowRight className="w-4 h-4 text-[#F4A7B9]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('bags')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white text-[#7A3B4E] border border-[#7A3B4E]/30 font-serif font-bold text-xs uppercase tracking-widest hover:bg-[#FDF9F6] shadow-sm transition-all duration-300 flex items-center gap-3"
              >
                <span>Handmade Bags</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Metrics */}
            <div className="pt-6 border-t border-[#7A3B4E]/10 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
              <div>
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#7A3B4E] block">100%</span>
                <span className="text-[10px] sm:text-[11px] text-[#8E8E93] uppercase tracking-wider">Handcrafted</span>
              </div>
              <div>
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#7A3B4E] block">4.9 ★</span>
                <span className="text-[10px] sm:text-[11px] text-[#8E8E93] uppercase tracking-wider">Patron Rating</span>
              </div>
              <div>
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#7A3B4E] block">105+</span>
                <span className="text-[10px] sm:text-[11px] text-[#8E8E93] uppercase tracking-wider">Unique Pieces</span>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Animated Hero Slideshow ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Slide Frame */}
            <div className="relative aspect-[4/5] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-[#FDF9F6]">
              <AnimatePresence custom={direction} mode="wait">
                <motion.img
                  key={slideIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              {/* Slide Indicator Dots */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-400 ${
                      i === slideIndex ? 'bg-white w-6 shadow-md' : 'bg-white/50 w-1.5'
                    }`}
                  />
                ))}
              </div>

              {/* Prev/Next Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md text-[#7A3B4E] transition-colors backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md text-[#7A3B4E] transition-colors backdrop-blur-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Animated Product Info Tag */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex + '-tag'}
                  variants={tagVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-3.5 sm:p-4 rounded-2xl bwc-glass-dark text-white backdrop-blur-md flex items-center justify-between border border-[#F4A7B9]/30"
                >
                  <div className="space-y-0.5">
                    <motion.span variants={tagItem} className="text-[10px] uppercase font-bold text-[#F4A7B9] tracking-wider block">
                      {currentSlide.badge}
                    </motion.span>
                    <motion.h4 variants={tagItem} className="font-serif text-xs sm:text-sm font-semibold text-white">
                      {currentSlide.title}
                    </motion.h4>
                    <motion.span variants={tagItem} className="text-[11px] text-gray-300 block">
                      {currentSlide.description}
                    </motion.span>
                    <motion.span variants={tagItem} className="font-serif font-bold text-[#F4A7B9] text-sm block">
                      {currentSlide.price}
                    </motion.span>
                  </div>
                  <motion.button
                    variants={tagItem}
                    onClick={() => setActiveTab(currentSlide.tab)}
                    className="p-2.5 rounded-xl bg-[#F4A7B9] text-[#7A3B4E] hover:bg-white transition-colors flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide counter */}
            <div className="absolute -bottom-4 right-4 text-xs font-mono font-bold text-[#7A3B4E]/60">
              {String(slideIndex + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Category Showcase Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2 sm:space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A3B4E]">Curated Signature Lines</span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1C1E]">
            Explore Bint-e-Waheed Collections
          </h2>
          <div className="w-16 h-0.5 bg-[#7A3B4E] mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Jewelry Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            onClick={() => setActiveTab('jewelry')}
            className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-bwc-card border border-[#7A3B4E]/10"
          >
            <img
              src="https://images.unsplash.com/photo-1611591475165-da028a385750?q=80&w=1200&auto=format&fit=crop"
              alt="Handmade Jewelry"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/90 via-[#1C1C1E]/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="px-3.5 py-1 bg-[#F4A7B9] text-[#7A3B4E] text-[10px] font-bold uppercase tracking-widest rounded-full w-fit mb-2">Exclusive Collection</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">Handmade Jewelry</h3>
              <p className="text-xs text-gray-200 mb-4 max-w-sm">Royal Kundan, Polki drops, freshwater pearl chokers & 24K gold filigree bangles.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F4A7B9] group-hover:translate-x-2 transition-transform">
                <span>View Jewelry Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* Bags Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            onClick={() => setActiveTab('bags')}
            className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-bwc-card border border-[#7A3B4E]/10"
          >
            <img
              src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1200&auto=format&fit=crop"
              alt="Handmade Bags"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/90 via-[#1C1C1E]/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="px-3.5 py-1 bg-[#7A3B4E] text-[#F4A7B9] text-[10px] font-bold uppercase tracking-widest rounded-full w-fit mb-2 border border-[#F4A7B9]/30">Bespoke Couture</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">Handmade Bags & Potlis</h3>
              <p className="text-xs text-gray-200 mb-4 max-w-sm">Italian velvet clutches, Dabka wire Zardozi embroidery, raw silk totes & pearl pouches.</p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F4A7B9] group-hover:translate-x-2 transition-transform">
                <span>View Handbag Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Bestsellers ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A3B4E]">Adored by Royalty</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1E]">Bint-e-Waheed Bestsellers</h2>
          </div>
          <button
            onClick={() => setActiveTab('jewelry')}
            className="text-xs font-bold uppercase tracking-wider text-[#7A3B4E] hover:text-[#5E2C3B] flex items-center gap-1.5"
          >
            <span>Explore All Pieces</span>
            <ArrowRight className="w-4 h-4 text-[#F4A7B9]" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id || product.slug} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* ── Limited Edition Countdown ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#7A3B4E] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-[#F4A7B9]/30">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#F4A7B9]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <span className="px-3.5 py-1 bg-[#F4A7B9] text-[#7A3B4E] text-[10px] font-bold uppercase tracking-widest rounded-full">Limited Edition Release</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">Signature Pearl Potli Drop</h2>
              <p className="text-xs sm:text-sm text-gray-200 max-w-lg leading-relaxed">Only 10 handcrafted pieces produced globally. Woven with over 3,000 freshwater seed pearls and gold thread lining.</p>
              <div className="flex gap-3 sm:gap-4 pt-2">
                {[['Hours', timeLeft.hours], ['Mins', timeLeft.minutes], ['Secs', timeLeft.seconds]].map(([label, val]) => (
                  <div key={label} className="bg-white/10 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-white/10 text-center min-w-[64px] sm:min-w-[70px]">
                    <span className="font-serif font-bold text-xl sm:text-2xl text-[#F4A7B9] block">
                      {String(val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-start lg:justify-end">
              <button
                onClick={() => setActiveTab('limited')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#F4A7B9] text-[#7A3B4E] font-serif font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-white transition-all duration-300 flex items-center gap-3"
              >
                <span>Reserve Limited Piece</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Artisan Heritage ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A3B4E]">Sacred Craftsmanship</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1E]">How Every Heirloom is Crafted</h2>
          <p className="text-xs text-gray-600">Preserving 400 years of Pakistani royal goldsmithing and embroidery traditions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { num: '01', title: 'Gold Wire Setting', desc: 'Master goldsmiths manually shape brass into floral lattice frames, finished with anti-tarnish micro 24K gold lacquering.' },
            { num: '02', title: 'Zardozi Bullion Embroidery', desc: 'Artisans stretch pure Italian velvet onto wooden frames, stitching intricate metallic wire vines taking up to 60 hours per bag.' },
            { num: '03', title: 'Precision Quality Seal', desc: 'Every completed piece passes a 12-point inspection before receiving the Bint-e-Waheed certificate of authenticity and box.' },
          ].map(({ num, title, desc }) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F4A7B9]/30 text-[#7A3B4E] flex items-center justify-center font-serif font-bold text-xl">{num}</div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1C1E]">{title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Instagram Shoppable Feed ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A3B4E]">105 Posts · Follow Our Journey</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1E]">@b.w_collection0000 on Instagram</h2>
          </div>
          <a
            href="https://www.instagram.com/b.w_collection0000?igsh=MXIyamh0cWdqcnlpNg=="
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#7A3B4E] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#5E2C3B] transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-[#F4A7B9]" />
            <span>Follow Instagram Page</span>
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
          ].map((src, i) => (
            <motion.a
              key={i}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.3 }}
              href="https://www.instagram.com/b.w_collection0000?igsh=MXIyamh0cWdqcnlpNg=="
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-md border border-[#7A3B4E]/10"
            >
              <img src={src} alt="BW Collection Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#7A3B4E]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <InstagramIcon className="w-7 h-7 text-white" />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;

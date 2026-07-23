import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';
import { ArrowRight, ArrowLeft, Star, Crown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Slide transition variants with 3D depth
const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.08,
    rotateY: dir > 0 ? 15 : -15,
    z: -100,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    z: 0,
    transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] },
  },
  exit: (dir) => ({
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.92,
    rotateY: dir < 0 ? 15 : -15,
    z: -100,
    transition: { duration: 0.6 },
  }),
};

const tagVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const tagItem = {
  hidden: { opacity: 0, y: 14, rotateX: -20 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 200 } },
};

// 3D Tilt card wrapper
const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 10);
    rotateY.set(dx * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating 3D orb particles
const FloatingOrb = ({ style, delay = 0, size = 'w-32 h-32' }) => (
  <motion.div
    className={`absolute ${size} rounded-full pointer-events-none`}
    style={style}
    animate={{
      y: [0, -20, 0],
      scale: [1, 1.08, 1],
      opacity: [0.5, 0.8, 0.5],
    }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

// Staggered section entrance
const SectionReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
    >
      {children}
    </motion.div>
  );
};

// Detailed Earrings SVG (Jhumka / Chandelier Drop Earrings)
const EarringsSVG = ({ className = "w-44 h-44 text-[#7A3B4E]" }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="50" cy="20" r="8" fill="#7A3B4E" fillOpacity="0.2" />
    <circle cx="50" cy="20" r="4" fill="#F4A7B9" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <circle key={i} cx={50 + 10 * Math.cos((deg * Math.PI) / 180)} cy={20 + 10 * Math.sin((deg * Math.PI) / 180)} r="1.8" fill="#7A3B4E" />
    ))}
    <line x1="50" y1="28" x2="50" y2="40" strokeDasharray="2 2" />
    <circle cx="50" cy="40" r="2.5" fill="#F4A7B9" />
    <path d="M 30,55 Q 50,38 70,55 Q 72,70 50,72 Q 28,70 30,55 Z" fill="#7A3B4E" fillOpacity="0.15" strokeWidth="1.5" />
    <path d="M 35,55 Q 50,42 65,55" strokeDasharray="3 3" />
    <line x1="30" y1="72" x2="70" y2="72" strokeWidth="1.5" />
    {[32, 38, 44, 50, 56, 62, 68].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="72" x2={x} y2={83 + (i % 2 === 0 ? 4 : 0)} />
        <circle cx={x} cy={86 + (i % 2 === 0 ? 4 : 0)} r="2.5" fill="#F4A7B9" />
      </g>
    ))}
  </svg>
);

// Detailed Bracelet / Bangle SVG (Kundan Gemstone Bangle)
const BraceletSVG = ({ className = "w-52 h-52 text-[#7A3B4E]" }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="60" cy="60" r="50" strokeWidth="2" />
    <circle cx="60" cy="60" r="42" strokeWidth="1.5" strokeDasharray="4 3" />
    <circle cx="60" cy="60" r="34" strokeWidth="2" />
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
    <circle cx="60" cy="60" r="18" fill="#7A3B4E" fillOpacity="0.1" />
    <path d="M 50,64 L 48,54 L 54,58 L 60,50 L 66,58 L 72,54 L 70,64 Z" fill="#7A3B4E" />
  </svg>
);

// Jewelry SVG Background Motifs (Earrings & Bracelets)
const JewelryBackgroundMotifs = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
    {/* Floating Kundan Bracelet SVG - Top Right */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      className="absolute -top-16 -right-16"
    >
      <BraceletSVG className="w-80 h-80 text-[#7A3B4E]" />
    </motion.div>

    {/* Floating Earrings SVG - Top Left */}
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-10 left-6 sm:left-12"
    >
      <EarringsSVG className="w-48 h-48 text-[#7A3B4E]" />
    </motion.div>

    {/* Floating Earrings SVG - Bottom Right */}
    <motion.div
      animate={{ y: [0, 12, 0], rotate: [5, -5, 5] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-12 right-8 sm:right-16"
    >
      <EarringsSVG className="w-48 h-48 text-[#7A3B4E]" />
    </motion.div>

    {/* Floating Kundan Bracelet SVG - Bottom Left */}
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      className="absolute -bottom-20 -left-20"
    >
      <BraceletSVG className="w-80 h-80 text-[#7A3B4E]" />
    </motion.div>
  </div>
);

export const Home = ({ setActiveTab, onSelectProduct }) => {
  const { products, formatPrice } = useShop();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  // Parallax: hero text drifts up as user scrolls
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

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

  // ── Dynamic Hero Slides from real products (newest first) ───
  // Merge admin-added products into hero slides dynamically
  const buildHeroSlides = () => {
    const productSlides = products.slice(0, 6).map(p => ({
      image: p.images?.[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400&auto=format&fit=crop',
      badge: p.isNewArrival ? 'New Arrival' : p.isBestSeller ? 'Bestseller' : p.isFeatured ? 'Featured' : 'Collection',
      title: p.title,
      description: p.description?.slice(0, 60) + '...',
      price: formatPrice(p.discountPrice || p.price),
      product: p,
      tab: p.category === 'Handmade Bags' ? 'bags' : p.category === 'Limited Edition Sets' ? 'limited' : 'jewelry',
    }));

    if (productSlides.length === 0) {
      return [
        {
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400&auto=format&fit=crop',
          badge: 'New Arrival — Kundan',
          title: 'Gul-e-Rana Kundan Set',
          description: '24K Gold-plated with real freshwater pearls...',
          price: 'Rs. 5,600',
          tab: 'jewelry',
        },
      ];
    }
    return productSlides;
  };

  const HERO_SLIDES = buildHeroSlides();

  // ── Hero Slideshow ──────────────────────────────────────────
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToSlide = (nextIndex) => {
    setDirection(nextIndex > slideIndex ? 1 : -1);
    setSlideIndex(nextIndex);
  };
  const nextSlide = () => goToSlide((slideIndex + 1) % HERO_SLIDES.length);
  const prevSlide = () => goToSlide((slideIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  // Clamp index if products change
  useEffect(() => {
    if (slideIndex >= HERO_SLIDES.length) setSlideIndex(0);
  }, [HERO_SLIDES.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slideIndex, HERO_SLIDES.length]);

  const currentSlide = HERO_SLIDES[Math.min(slideIndex, HERO_SLIDES.length - 1)];

  // Featured products — newest first
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 overflow-hidden" style={{ perspective: '1200px' }}>

      {/* ── 3D Cinematic Hero ── */}
      <section ref={heroRef} className="relative min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8">

        {/* Royal Jewelry Background SVG Motifs */}
        <JewelryBackgroundMotifs />

        {/* Ambient 3D Orbs */}
        <FloatingOrb
          size="w-80 h-80 sm:w-[32rem] sm:h-[32rem]"
          style={{ top: '-5%', left: '-8%', background: 'radial-gradient(circle, rgba(244,167,185,0.3) 0%, transparent 70%)' }}
          delay={0}
        />
        <FloatingOrb
          size="w-64 h-64 sm:w-96 sm:h-96"
          style={{ bottom: '5%', right: '-5%', background: 'radial-gradient(circle, rgba(122,59,78,0.15) 0%, transparent 70%)' }}
          delay={2}
        />
        <FloatingOrb
          size="w-40 h-40"
          style={{ top: '30%', right: '20%', background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
          delay={4}
        />

        {/* Decorative 3D grid lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(122,59,78,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(122,59,78,1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full">

          {/* Left Text with Parallax */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            initial={{ opacity: 0, x: -60, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-5 sm:space-y-6"
            style={{ transformStyle: 'preserve-3d', perspective: '800px', y: heroY, opacity: heroOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4A7B9]/30 text-[#7A3B4E] border border-[#F4A7B9] text-[11px] font-semibold tracking-widest uppercase"
            >
              <Crown className="w-3 h-3" />
              Haute Couture Handcrafted Masterpieces
            </motion.div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1C1E] leading-[1.15] tracking-tight">
              {['Where', 'Royal', 'Heritage', 'Meets'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30, rotateX: -30 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                  className="inline-block mr-2"
                  style={{ display: 'inline-block' }}
                >
                  {word}
                </motion.span>
              ))}{' '}
              <motion.span
                initial={{ opacity: 0, scale: 0.6, rotateY: -40 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.55, type: 'spring', stiffness: 120 }}
                className="gold-gradient-text inline-block"
              >
                Artisanal Grace
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xs sm:text-base text-gray-600 max-w-xl font-normal leading-relaxed"
            >
              Experience the pinnacle of Pakistani luxury. Each piece of <strong>handmade jewelry</strong> and <strong>hand-embroidered bag</strong> is individually fashioned by master artisans using 24K gold setting, real freshwater pearls, and intricate Zardozi thread work. Delivering nationwide across Pakistan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.05, rotateX: 4, y: -3, boxShadow: '0 20px 40px -8px rgba(122,59,78,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('jewelry')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#7A3B4E] text-white font-serif font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#5E2C3B] transition-all duration-300 flex items-center gap-3"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <span>Handmade Jewelry</span>
                <ArrowRight className="w-4 h-4 text-[#F4A7B9]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, rotateX: 4, y: -3, boxShadow: '0 20px 40px -8px rgba(122,59,78,0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('bags')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white text-[#7A3B4E] border border-[#7A3B4E]/30 font-serif font-bold text-xs uppercase tracking-widest hover:bg-[#FDF9F6] shadow-sm transition-all duration-300 flex items-center gap-3"
              >
                <span>Handmade Bags</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-6 border-t border-[#7A3B4E]/10 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg"
            >
              {[
                { value: '100%', label: 'Handcrafted' },
                { value: '4.9 ★', label: 'Patron Rating' },
                { value: `${products.length}+`, label: 'Unique Pieces' },
              ].map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.08, rotateY: 8, z: 20 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#7A3B4E] block">{value}</span>
                  <span className="text-[10px] sm:text-[11px] text-[#8E8E93] uppercase tracking-wider">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: 3D Hero Slideshow ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: 20, x: 60 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            <TiltCard className="relative aspect-[4/5] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-[#FDF9F6]"
              style={{ boxShadow: '0 40px 80px -20px rgba(122,59,78,0.35), 0 0 0 1px rgba(244,167,185,0.2), inset 0 1px 0 rgba(255,255,255,0.9)' }}
            >
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
                  style={{ transformStyle: 'preserve-3d' }}
                />
              </AnimatePresence>

              {/* 3D Glossy overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

              {/* Slide Indicator Pills — inside card, top center */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {HERO_SLIDES.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => goToSlide(i)}
                    animate={{ width: i === slideIndex ? 24 : 6, opacity: i === slideIndex ? 1 : 0.5 }}
                    className="h-1.5 rounded-full bg-white shadow-md"
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>

              {/* Animated Product Info Tag — inside card, bottom */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex + '-tag'}
                  variants={tagVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-3.5 sm:p-4 rounded-2xl bwc-glass-dark text-white backdrop-blur-md flex items-center justify-between border border-[#F4A7B9]/30"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                >
                  <div className="space-y-0.5">
                    <motion.span variants={tagItem} className="text-[10px] uppercase font-bold text-[#F4A7B9] tracking-wider block">
                      {currentSlide.badge}
                    </motion.span>
                    <motion.h4 variants={tagItem} className="font-serif text-xs sm:text-sm font-semibold text-white line-clamp-1">
                      {currentSlide.title}
                    </motion.h4>
                    <motion.span variants={tagItem} className="text-[11px] text-gray-300 block line-clamp-1">
                      {currentSlide.description}
                    </motion.span>
                    <motion.span variants={tagItem} className="font-serif font-bold text-[#F4A7B9] text-sm block">
                      {currentSlide.price}
                    </motion.span>
                  </div>
                  <motion.button
                    variants={tagItem}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => currentSlide.product ? onSelectProduct(currentSlide.product) : setActiveTab(currentSlide.tab)}
                    className="p-2.5 rounded-xl bg-[#F4A7B9] text-[#7A3B4E] hover:bg-white transition-colors flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </TiltCard>

            {/* ── PREV / NEXT ARROWS — Outside TiltCard so overflow-hidden doesn't clip them ── */}
            <motion.button
              whileHover={{ scale: 1.12, x: -3, boxShadow: '0 8px 24px rgba(122,59,78,0.4)' }}
              whileTap={{ scale: 0.93 }}
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 w-11 h-11 bg-white hover:bg-[#F4A7B9] rounded-full flex items-center justify-center shadow-xl text-[#7A3B4E] hover:text-white transition-all duration-200 border border-[#F4A7B9]/40"
              style={{ boxShadow: '0 4px 20px rgba(122,59,78,0.25)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.12, x: 3, boxShadow: '0 8px 24px rgba(122,59,78,0.4)' }}
              whileTap={{ scale: 0.93 }}
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 w-11 h-11 bg-white hover:bg-[#7A3B4E] rounded-full flex items-center justify-center shadow-xl text-[#7A3B4E] hover:text-white transition-all duration-200 border border-[#7A3B4E]/20"
              style={{ boxShadow: '0 4px 20px rgba(122,59,78,0.25)' }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {/* Slide counter */}
            <div className="absolute -bottom-6 right-4 text-xs font-mono font-bold text-[#7A3B4E]/60">
              {String(Math.min(slideIndex, HERO_SLIDES.length - 1) + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
            </div>

            {/* 3D floating shadow beneath card */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-10 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(122,59,78,0.25) 0%, transparent 70%)', filter: 'blur(12px)' }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── New Arrivals Slider (dynamic — shows admin-added products) ── */}
      {products.filter(p => p.isNewArrival).length > 0 && (
        <SectionReveal delay={0.1}>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: 'auto' }}
                  viewport={{ once: true }}
                  className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A3B4E] flex items-center gap-2"
                >
                  <Crown className="w-3 h-3" /> Latest Arrivals — Newest First
                </motion.span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1E]">Just Arrived</h2>
              </div>
              <button
                onClick={() => setActiveTab('shop')}
                className="text-xs font-bold uppercase tracking-wider text-[#7A3B4E] hover:text-[#5E2C3B] flex items-center gap-1.5"
              >
                <span>View All New</span>
                <ArrowRight className="w-4 h-4 text-[#F4A7B9]" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.filter(p => p.isNewArrival).slice(0, 4).map((product, i) => (
                <motion.div
                  key={product._id || product.slug}
                  initial={{ opacity: 0, y: 40, rotateX: 15, z: -50 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: 'preserve-3d', perspective: 800 }}
                >
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </motion.div>
              ))}
            </div>
          </section>
        </SectionReveal>
      )}

      {/* ── Category Showcase Grid ── */}
      <SectionReveal delay={0.15}>
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
            {[
              {
                img: 'https://images.unsplash.com/photo-1611591475165-da028a385750?q=80&w=1200&auto=format&fit=crop',
                badge: 'Exclusive Collection',
                badgeBg: 'bg-[#F4A7B9] text-[#7A3B4E]',
                title: 'Handmade Jewelry',
                desc: 'Royal Kundan, Polki drops, freshwater pearl chokers & 24K gold filigree bangles.',
                linkText: 'View Jewelry Catalog',
                tab: 'jewelry',
              },
              {
                img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1200&auto=format&fit=crop',
                badge: 'Bespoke Couture',
                badgeBg: 'bg-[#7A3B4E] text-[#F4A7B9] border border-[#F4A7B9]/30',
                title: 'Handmade Bags & Potlis',
                desc: 'Italian velvet clutches, Dabka wire Zardozi embroidery, raw silk totes & pearl pouches.',
                linkText: 'View Handbag Catalog',
                tab: 'bags',
              },
            ].map(({ img, badge, badgeBg, title, desc, linkText, tab }, i) => (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 40, rotateY: i === 0 ? -12 : 12 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, rotateY: i === 0 ? 3 : -3, z: 30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActiveTab(tab)}
                className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-bwc-card border border-[#7A3B4E]/10"
                style={{ transformStyle: 'preserve-3d', perspective: 800 }}
              >
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/90 via-[#1C1C1E]/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <span className={`px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full w-fit mb-2 ${badgeBg}`}>{badge}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-xs text-gray-200 mb-4 max-w-sm">{desc}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F4A7B9] group-hover:translate-x-2 transition-transform">
                    <span>{linkText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                {/* 3D shine sweep on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)' }}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* ── Featured Bestsellers ── */}
      <SectionReveal delay={0.1}>
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
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product._id || product.slug}
                initial={{ opacity: 0, y: 40, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: 'preserve-3d', perspective: 800 }}
              >
                <ProductCard product={product} onSelect={onSelectProduct} />
              </motion.div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* ── Limited Edition Countdown ── */}
      <SectionReveal delay={0.1}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            whileHover={{ scale: 1.01, rotateX: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-[#7A3B4E] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-[#F4A7B9]/30"
            style={{ transformStyle: 'preserve-3d', boxShadow: '0 40px 80px -20px rgba(122,59,78,0.5), 0 0 0 1px rgba(244,167,185,0.2)' }}
          >
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#F4A7B9]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#F4A7B9]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <span className="px-3.5 py-1 bg-[#F4A7B9] text-[#7A3B4E] text-[10px] font-bold uppercase tracking-widest rounded-full">Limited Edition Release</span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">Signature Pearl Potli Drop</h2>
                <p className="text-xs sm:text-sm text-gray-200 max-w-lg leading-relaxed">Only 10 handcrafted pieces produced globally. Woven with over 3,000 freshwater seed pearls and gold thread lining.</p>
                <div className="flex gap-3 sm:gap-4 pt-2">
                  {[['Hours', timeLeft.hours], ['Mins', timeLeft.minutes], ['Secs', timeLeft.seconds]].map(([label, val]) => (
                    <motion.div
                      key={label}
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0 }}
                      className="bg-white/10 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-white/10 text-center min-w-[64px] sm:min-w-[70px]"
                      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}
                    >
                      <span className="font-serif font-bold text-xl sm:text-2xl text-[#F4A7B9] block">
                        {String(val).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-300">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 flex justify-start lg:justify-end">
                <motion.button
                  whileHover={{ scale: 1.05, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('limited')}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#F4A7B9] text-[#7A3B4E] font-serif font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-white transition-all duration-300 flex items-center gap-3"
                >
                  <span>Reserve Limited Piece</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>
      </SectionReveal>

      {/* ── Artisan Heritage 3D cards ── */}
      <SectionReveal delay={0.1}>
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
            ].map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 30, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.02, boxShadow: '0 30px 60px -10px rgba(122,59,78,0.2)' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft space-y-4 cursor-default"
                style={{ transformStyle: 'preserve-3d', perspective: 800 }}
              >
                <motion.div
                  whileHover={{ rotateY: 180, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-2xl bg-[#F4A7B9]/30 text-[#7A3B4E] flex items-center justify-center font-serif font-bold text-xl"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {num}
                </motion.div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1C1E]">{title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* ── Instagram Feed ── */}
      <SectionReveal delay={0.1}>
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
                initial={{ opacity: 0, scale: 0.85, rotateZ: i % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.06, rotateZ: i % 2 === 0 ? 2 : -2, z: 30 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                href="https://www.instagram.com/b.w_collection0000?igsh=MXIyamh0cWdqcnlpNg=="
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-md border border-[#7A3B4E]/10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img src={src} alt="BW Collection Instagram" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-[#7A3B4E]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <InstagramIcon className="w-7 h-7 text-white" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </SectionReveal>

    </div>
  );
};

export default Home;

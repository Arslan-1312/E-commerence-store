import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductCard = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, wishlist, setQuickViewProduct, formatPrice } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const cardRef = useRef(null);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // 3D tilt on mouse move
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 250, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 250, damping: 25 });

  // Subtle glare position
  const glareX = useTransform(springY, [-12, 12], ['0%', '100%']);
  const glareY = useTransform(springX, [-12, 12], ['0%', '100%']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 8);
    rotateY.set(dx * 8);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  const isWishlisted = wishlist.some(item => item._id === product._id || item.slug === product.slug);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const isNew = product.isNewArrival;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ z: 20, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-[#7A3B4E]/10 shadow-bwc-soft hover:shadow-bwc-card transition-shadow duration-500 flex flex-col cursor-pointer"
    >
      {/* 3D Glare overlay */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18) 0%, transparent 60%)`,
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#FDF9F6]" onClick={() => onSelect(product)}>
        <motion.img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#7A3B4E]/30 to-transparent pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isNew && (
            <motion.span
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              className="px-3 py-1 bg-gradient-to-r from-[#F4A7B9] to-[#E07898] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md"
            >
              New Arrival
            </motion.span>
          )}
          <span className="px-3 py-1 bg-[#7A3B4E] text-white text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-md">
            {product.category}
          </span>
          {hasDiscount && (
            <span className="px-3 py-1 bg-[#F4A7B9] text-[#7A3B4E] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
              Save {formatPrice(product.price - product.discountPrice)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-300 z-10 ${
            isWishlisted
              ? 'bg-[#7A3B4E] text-[#F4A7B9]'
              : 'bg-white/80 text-[#1C1C1E] hover:bg-white hover:text-[#7A3B4E]'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Quick View Hover Overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-[#7A3B4E]/15 backdrop-blur-[2px] flex items-center justify-center gap-3 pointer-events-none"
          style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
        >
          <motion.button
            initial={false}
            animate={{ y: isHovered ? 0 : 12, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
            className="px-4 py-2 bg-white text-[#7A3B4E] text-xs font-bold rounded-full shadow-lg hover:bg-[#F4A7B9] hover:text-[#7A3B4E] transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Quick View
          </motion.button>
        </motion.div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Subcategory & Rating */}
          <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[#7A3B4E]/80">{product.subcategory}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating || 4.9}</span>
              <span className="text-gray-400">({product.numReviews || 12})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-serif font-semibold text-sm sm:text-base text-[#1C1C1E] hover:text-[#7A3B4E] cursor-pointer transition-colors line-clamp-1 mb-2"
          >
            {product.title}
          </h3>

          {/* Materials */}
          <p className="text-xs text-[#8E8E93] line-clamp-1 mb-3">
            {product.materials?.join(' • ')}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-[#7A3B4E]/10 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-serif font-bold text-base sm:text-lg text-[#7A3B4E]">
                {formatPrice(hasDiscount ? product.discountPrice : product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleAddToCart}
            className={`px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs font-bold flex-shrink-0 flex items-center gap-1.5 transition-all duration-300 shadow-md ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#7A3B4E] text-white hover:bg-[#5E2C3B]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#F4A7B9]" />
                <span>Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* 3D bottom depth shadow */}
      <motion.div
        className="absolute -bottom-3 left-4 right-4 h-6 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0, scaleX: isHovered ? 0.85 : 0.7 }}
        transition={{ duration: 0.3 }}
        style={{ background: 'radial-gradient(ellipse, rgba(122,59,78,0.2) 0%, transparent 70%)', filter: 'blur(8px)' }}
      />
    </motion.div>
  );
};

export default ProductCard;

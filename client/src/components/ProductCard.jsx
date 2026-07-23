import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductCard = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, wishlist, setQuickViewProduct, formatPrice } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCardClick = () => {
    if (onSelect) onSelect(product);
  };

  const isWishlisted = wishlist.some(item => item && (item._id === product._id || item.slug === product.slug));
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const isNew = product.isNewArrival;
  const primaryImg = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop';
  const secondaryImg = product.images?.[1] || primaryImg;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-[#7A3B4E]/10 shadow-bwc-soft hover:shadow-bwc-card transition-all duration-300 flex flex-col cursor-pointer select-none"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#FDF9F6]" onClick={handleCardClick}>
        <img
          src={isHovered ? secondaryImg : primaryImg}
          alt={product.title || 'Handcrafted Jewelry & Bags'}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#7A3B4E]/25 to-transparent transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isNew && (
            <span className="px-3 py-1 bg-gradient-to-r from-[#F4A7B9] to-[#E07898] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
              New Arrival
            </span>
          )}
          {product.category && (
            <span className="px-3 py-1 bg-[#7A3B4E] text-white text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-md">
              {product.category}
            </span>
          )}
          {hasDiscount && (
            <span className="px-3 py-1 bg-[#F4A7B9] text-[#7A3B4E] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
              Save {formatPrice(product.price - product.discountPrice)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 z-20 ${
            isWishlisted
              ? 'bg-[#7A3B4E] text-[#F4A7B9]'
              : 'bg-white/80 text-[#1C1C1E] hover:bg-white hover:text-[#7A3B4E]'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div
          className={`absolute inset-0 bg-[#7A3B4E]/15 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 z-10 ${
            isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={handleQuickView}
            className="px-4 py-2 bg-white text-[#7A3B4E] text-xs font-bold rounded-full shadow-lg hover:bg-[#F4A7B9] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Subcategory & Rating */}
          <div className="flex items-center justify-between text-xs text-[#8E8E93] mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[#7A3B4E]/80">{product.subcategory || 'Handcrafted'}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating || 4.9}</span>
              <span className="text-gray-400">({product.numReviews || 12})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={handleCardClick}
            className="font-serif font-semibold text-sm sm:text-base text-[#1C1C1E] hover:text-[#7A3B4E] cursor-pointer transition-colors line-clamp-1 mb-2"
          >
            {product.title}
          </h3>

          {/* Materials */}
          {product.materials?.length > 0 && (
            <p className="text-xs text-[#8E8E93] line-clamp-1 mb-3">
              {product.materials.join(' • ')}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-[#7A3B4E]/10 flex items-center justify-between gap-2 mt-2">
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

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex-shrink-0 flex items-center gap-1.5 transition-all duration-200 shadow-md cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-[#7A3B4E] text-white hover:bg-[#5E2C3B] active:scale-95'
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
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

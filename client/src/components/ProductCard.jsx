import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductCard = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, wishlist, setQuickViewProduct, formatPrice } = useShop();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.some(item => item._id === product._id || item.slug === product.slug);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-[#7A3B4E]/10 shadow-bwc-soft hover:shadow-bwc-card transition-all duration-500 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Zoom & Secondary Swap */}
      <div className="relative aspect-square overflow-hidden bg-[#FDF9F6] cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-3 py-1 bg-[#7A3B4E] text-white text-[10px] font-semibold uppercase tracking-wider rounded-full shadow-md">
            {product.category}
          </span>
          {hasDiscount && (
            <span className="px-3 py-1 bg-[#F4A7B9] text-[#7A3B4E] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
              Save {formatPrice(product.price - product.discountPrice)}
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-300 z-10 ${
            isWishlisted
              ? 'bg-[#7A3B4E] text-[#F4A7B9]'
              : 'bg-white/80 text-[#1C1C1E] hover:bg-white hover:text-[#7A3B4E]'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Trigger Hover Overlay */}
        <div className={`absolute inset-0 bg-[#7A3B4E]/20 backdrop-blur-[2px] flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="px-4 py-2 bg-white text-[#7A3B4E] text-xs font-bold rounded-full shadow-lg hover:bg-[#F4A7B9] hover:text-[#7A3B4E] transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content Information */}
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

          <button
            onClick={() => addToCart(product)}
            className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-[#7A3B4E] text-white hover:bg-[#5E2C3B] hover:shadow-bwc-glow transition-all duration-300 flex items-center gap-1.5 text-xs font-bold flex-shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F4A7B9]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

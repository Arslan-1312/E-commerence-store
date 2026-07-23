import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, ArrowLeft, MessageCircle } from 'lucide-react';
import { useShop, USD_TO_PKR } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export const ProductDetail = ({ product, onBack, onSelectProduct }) => {
  const { addToCart, toggleWishlist, wishlist, products, setIsCartOpen, formatPrice } = useShop();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#7A3B4E]">Collection Piece</h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">Discover our handcrafted royal Kundan jewelry and Zardozi velvet bags catalog.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-[#7A3B4E] text-white text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-[#5E2C3B] transition-colors shadow-md"
        >
          Browse All Collections
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item._id === product._id || item.slug === product.slug);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const relatedProducts = products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 3);

  const WHATSAPP_NUMBER = '923335244191'; // Updated WhatsApp

  const handleWhatsAppProductInquiry = () => {
    const pkrPrice = Math.round((product.discountPrice || product.price) * USD_TO_PKR);
    let msg = `*ASSALAM-O-ALAIKUM BINT-E-WAHEED COLLECTION!* 👑\n\n`;
    msg += `I am interested in purchasing this handcrafted piece:\n\n`;
    msg += `*Product:* ${product.title}\n`;
    msg += `*Category:* ${product.category} (${product.subcategory})\n`;
    msg += `*Price:* Rs. ${pkrPrice.toLocaleString()}\n`;
    if (selectedColor) msg += `*Selected Shade:* ${selectedColor}\n`;
    msg += `*Product Link/Image:* ${product.images[0]}\n\n`;
    msg += `Please let me know about stock availability & dispatch time for Pakistan. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12"
    >
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7A3B4E] hover:text-[#5E2C3B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-[#F4A7B9]" />
        <span>Back to Catalog</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Image Gallery & Magnifier */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-[#7A3B4E]/10 shadow-bwc-card relative group">
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3.5 py-1 bg-[#F4A7B9] text-[#7A3B4E] text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                Save {formatPrice(product.price - product.discountPrice)}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 sm:w-20 h-16 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                  activeImage === idx ? 'border-[#7A3B4E] shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Details Section */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#7A3B4E]">
              {product.category} • {product.subcategory}
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1E] mt-1 mb-2">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1C1C1E]">{product.rating || 4.9}</span>
              <span className="text-xs text-[#8E8E93]">({product.numReviews || 12} Verified Reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif font-extrabold text-2xl sm:text-3xl text-[#7A3B4E]">
                {formatPrice(hasDiscount ? product.discountPrice : product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-xs text-[#96C99A] font-semibold bg-[#96C99A]/10 px-2.5 py-1 rounded-full border border-[#96C99A]/20">
                In Stock & Handcrafted
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C1C1E] block">
                Select Shade / Color: <span className="text-[#7A3B4E]">{selectedColor}</span>
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedColor === c.name
                        ? 'border-[#7A3B4E] bg-[#7A3B4E] text-white shadow-sm'
                        : 'border-gray-200 bg-white text-[#1C1C1E] hover:border-[#7A3B4E]'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-2xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs text-[#1C1C1E]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(product, quantity, selectedColor);
                  setIsCartOpen(true);
                }}
                className="flex-1 py-4 rounded-2xl bg-[#7A3B4E] text-white font-serif font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#5E2C3B] hover:shadow-bwc-glow transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#F4A7B9]" />
                <span>Add to Bag</span>
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <button
              onClick={handleWhatsAppProductInquiry}
              className="w-full py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#1EBE5D] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current text-white" />
              <span>Inquire & Order via WhatsApp (+92 333 5244191)</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`w-full py-2.5 rounded-2xl border border-[#7A3B4E]/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                isWishlisted ? 'bg-[#F4A7B9]/30 text-[#7A3B4E]' : 'bg-white text-[#1C1C1E] hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#7A3B4E]' : ''}`} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-[11px] text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#96C99A]" />
              <span>Authentic Handcraft</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#7A3B4E]" />
              <span>Express Courier Pakistan</span>
            </div>
          </div>
        </div>

      </div>

      {/* Product Information Accordion Tabs */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#7A3B4E]/10 shadow-bwc-soft space-y-6">
        <div className="flex border-b border-gray-100 gap-4 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 ${
              activeTab === 'details' ? 'text-[#7A3B4E] border-b-2 border-[#7A3B4E]' : 'text-gray-400'
            }`}
          >
            Artisan Craft Story
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 ${
              activeTab === 'materials' ? 'text-[#7A3B4E] border-b-2 border-[#7A3B4E]' : 'text-gray-400'
            }`}
          >
            Materials & Care
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0 ${
              activeTab === 'reviews' ? 'text-[#7A3B4E] border-b-2 border-[#7A3B4E]' : 'text-gray-400'
            }`}
          >
            Verified Client Reviews ({product.numReviews || 12})
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
            <p className="font-serif text-sm sm:text-base text-[#1C1C1E] font-semibold italic">"{product.craftDetails}"</p>
            <p>Every element of this creation has been designed to evoke Pakistani heritage, meticulously handcrafted under strict artisan supervision to deliver a durable, breathtaking heirloom.</p>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#1C1C1E] uppercase tracking-wider">Composition</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {product.materials?.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#FDF9F6] rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-serif font-bold text-2xl text-[#7A3B4E]">4.9 / 5.0</span>
                <p className="text-xs text-gray-500">Based on 12 verified purchases</p>
              </div>
              <button className="px-4 py-2 bg-[#7A3B4E] text-white text-xs font-bold rounded-xl hover:bg-[#5E2C3B]">
                Write a Review
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1C1C1E]">Mahnoor S.</span>
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-xs text-gray-600">"The Kundan detail is even more stunning in person! Received so many compliments at my sister's wedding."</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Cross-Sell Items */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#1C1C1E]">
            Complete Your Royal Set
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel._id || rel.slug}
                product={rel}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default ProductDetail;

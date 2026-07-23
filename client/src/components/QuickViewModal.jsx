import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ShieldCheck, MessageCircle } from 'lucide-react';
import { useShop, USD_TO_PKR } from '../context/ShopContext';

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, wishlist, formatPrice } = useShop();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.some(item => item._id === quickViewProduct._id || item.slug === quickViewProduct.slug);
  const WHATSAPP_NUMBER = '923335244191'; // Updated WhatsApp

  const handleWhatsAppInquiry = () => {
    const pkrPrice = Math.round((quickViewProduct.discountPrice || quickViewProduct.price) * USD_TO_PKR);
    let msg = `*ASSALAM-O-ALAIKUM BINT-E-WAHEED COLLECTION!* 👑\n\n`;
    msg += `I am interested in this item:\n\n`;
    msg += `*Product:* ${quickViewProduct.title}\n`;
    msg += `*Category:* ${quickViewProduct.category}\n`;
    msg += `*Price:* Rs. ${pkrPrice.toLocaleString()}\n`;
    msg += `*Image:* ${quickViewProduct.images[0]}\n\n`;
    msg += `Please send dispatch details. Thank you!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#7A3B4E]/10"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-600 hover:text-black hover:bg-white shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Section */}
            <div className="p-6 bg-[#FDF9F6] flex flex-col justify-between">
              <div className="aspect-square rounded-2xl overflow-hidden border border-[#F4A7B9]/30 mb-4 bg-white">
                <img
                  src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
                  alt={quickViewProduct.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === i ? 'border-[#7A3B4E]' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Meta Section */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-[#7A3B4E]">
                  {quickViewProduct.category} • {quickViewProduct.subcategory}
                </span>

                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1C1E] mt-1 mb-2">
                  {quickViewProduct.title}
                </h2>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#1C1C1E]">{quickViewProduct.rating || 4.9}</span>
                  <span className="text-xs text-gray-400">({quickViewProduct.numReviews || 12} reviews)</span>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-serif font-bold text-2xl sm:text-3xl text-[#7A3B4E]">
                    {formatPrice(quickViewProduct.discountPrice || quickViewProduct.price)}
                  </span>
                  {quickViewProduct.discountPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(quickViewProduct.price)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {quickViewProduct.description}
                </p>

                {/* Craft Details */}
                <div className="p-3 bg-[#FDF9F6] rounded-2xl border border-[#F4A7B9]/30 mb-6">
                  <span className="text-[11px] uppercase font-bold text-[#7A3B4E] tracking-wider block mb-1">
                    Artisan Craftsmanship
                  </span>
                  <p className="text-xs text-gray-600 italic">
                    "{quickViewProduct.craftDetails}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#7A3B4E] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#5E2C3B] hover:shadow-bwc-glow transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#F4A7B9]" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-3 rounded-2xl bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1EBE5D] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-white" />
                  <span>Order via WhatsApp (+92 333 5244191)</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;

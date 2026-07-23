import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal = ({ onSelectProduct }) => {
  const { products, isSearchOpen, setIsSearchOpen } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = searchTerm.trim() === ''
    ? products.slice(0, 4)
    : products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.materials?.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-md flex items-start justify-center pt-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#7A3B4E]/10 overflow-hidden"
          >
            {/* Input Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Search className="w-6 h-6 text-[#7A3B4E]" />
              <input
                type="text"
                autoFocus
                placeholder="Search handmade jewelry, silk bags, Kundan sets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-base font-serif text-[#1C1C1E] focus:outline-none placeholder:font-sans placeholder:text-gray-400 placeholder:text-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Suggestions & Results */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8E8E93] font-medium uppercase tracking-wider">
                <span>{searchTerm.trim() ? 'Search Results' : 'Suggested Collections'}</span>
                <span>{filteredResults.length} Items</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredResults.map((product) => (
                  <div
                    key={product._id || product.slug}
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSelectProduct(product);
                    }}
                    className="flex gap-3 p-2.5 rounded-2xl border border-gray-100 hover:border-[#F4A7B9] hover:bg-[#FDF9F6] cursor-pointer transition-all duration-300 group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-xl bg-gray-50 border border-gray-100"
                    />
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-serif font-semibold text-xs text-[#1C1C1E] group-hover:text-[#7A3B4E] line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-[10px] text-[#8E8E93]">{product.category}</p>
                      <span className="font-serif font-bold text-xs text-[#7A3B4E] mt-0.5">
                        ${product.discountPrice || product.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;

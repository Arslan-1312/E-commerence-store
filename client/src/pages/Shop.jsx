import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, SlidersHorizontal, Search, Grid3X3, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

const CATEGORIES = ['All', 'Handmade Jewelry', 'Handmade Bags', 'Limited Edition Sets', 'Artisan Accessories'];
const SUBCATEGORIES = {
  'Handmade Jewelry': ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Bangles', 'Full Sets'],
  'Handmade Bags': ['Clutches', 'Totes', 'Crossbody', 'Potli Bags', 'Mini Bags'],
  'Limited Edition Sets': ['Bridal Sets', 'Festive Editions'],
  'Artisan Accessories': ['Hair Accessories', 'Belts', 'Keychains']
};
const SORT_OPTIONS = [
  { label: 'Featured First', value: 'featured' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' }
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export const Shop = ({ initialCategory = 'All', onSelectProduct }) => {
  const { products, loading, formatPrice } = useShop();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedSubcategory('All');
  }, [initialCategory]);

  const filteredProducts = useCallback(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedSubcategory !== 'All') {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.materials?.some(m => m.toLowerCase().includes(q))
      );
    }
    filtered = filtered.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    switch (sortBy) {
      case 'price_asc': return filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      case 'price_desc': return filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      case 'rating': return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest': return filtered.sort((a, b) => {
        const tsA = a.createdAt ? new Date(a.createdAt).getTime() : (a._id?.startsWith('bwc-') ? Number(a._id.slice(4)) : 0);
        const tsB = b.createdAt ? new Date(b.createdAt).getTime() : (b._id?.startsWith('bwc-') ? Number(b._id.slice(4)) : 0);
        return tsB - tsA;
      });
      default: return filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [products, selectedCategory, selectedSubcategory, searchTerm, priceRange, sortBy]);

  const results = filteredProducts();
  const subcats = selectedCategory !== 'All' ? (SUBCATEGORIES[selectedCategory] || []) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center sm:text-left space-y-1"
      >
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A3B4E]">Bint-e-Waheed Catalog</span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1C1C1E]">
          {selectedCategory === 'All' ? 'All Handcrafted Pieces' : selectedCategory}
        </h1>
        <p className="text-xs text-gray-500">{results.length} unique handcrafted items found</p>
      </motion.div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search jewelry, bags, materials, styles..."
          className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm border border-gray-200 rounded-2xl bg-white focus:border-[#7A3B4E] focus:outline-none shadow-sm"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setSelectedSubcategory('All'); }}
            className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs font-bold border transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-[#7A3B4E] text-white border-[#7A3B4E] shadow-md'
                : 'bg-white text-[#1C1C1E] border-gray-200 hover:border-[#7A3B4E] hover:text-[#7A3B4E]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subcategory Pills */}
      <AnimatePresence>
        {subcats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          >
            {['All', ...subcats].map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                  selectedSubcategory === sub
                    ? 'bg-[#F4A7B9] text-[#7A3B4E] border-[#F4A7B9]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#F4A7B9]'
                }`}
              >
                {sub}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort & View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-xs font-semibold text-[#1C1C1E] px-4 py-2 pr-8 rounded-xl focus:border-[#7A3B4E] focus:outline-none cursor-pointer shadow-sm"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors shadow-sm ${
              showFilters ? 'bg-[#7A3B4E] text-white border-[#7A3B4E]' : 'bg-white text-[#1C1C1E] border-gray-200 hover:border-[#7A3B4E]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#7A3B4E] text-white' : 'text-gray-400 hover:text-[#7A3B4E]'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#7A3B4E] text-white' : 'text-gray-400 hover:text-[#7A3B4E]'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price Range Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-5 rounded-2xl border border-[#7A3B4E]/10 shadow-sm overflow-hidden"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A3B4E] mb-4 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Price Range Filter
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold text-[#1C1C1E]">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#7A3B4E]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid or List */}
      {loading ? (
        <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-3xl shimmer-loading" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="font-serif text-xl text-[#1C1C1E]">No pieces found</p>
          <p className="text-xs text-gray-500">Try adjusting your search or filter criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
            className="mt-2 px-5 py-2 bg-[#7A3B4E] text-white text-xs font-bold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <motion.div
          key={selectedCategory + viewMode + sortBy}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2'
          }`}
          style={{ perspective: '800px' }}
        >
          {results.map((product, i) => (
            <motion.div
              key={product._id || product.slug}
              variants={cardVariant}
              style={{ transformStyle: 'preserve-3d' }}
              whileHover={{ z: 20 }}
            >
              <ProductCard product={product} onSelect={onSelectProduct} />
            </motion.div>
          ))}
        </motion.div>
      )}

    </div>
  );
};

export default Shop;

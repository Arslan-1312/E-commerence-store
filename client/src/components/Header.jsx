import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useShop } from '../context/ShopContext';

export const Header = ({ activeTab, shopCategory, setActiveTab }) => {
  const { cart, wishlist, user, setIsCartOpen, setIsSearchOpen, currency, setCurrency } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'bags', label: 'Bags' },
    { id: 'limited', label: 'Limited' },
    { id: 'craft', label: 'Heritage' },
    { id: 'contact', label: 'Contact' }
  ];

  const isLinkActive = (linkId) => {
    if (activeTab === linkId) return true;
    if (activeTab === 'shop') {
      if (linkId === 'jewelry' && shopCategory === 'Handmade Jewelry') return true;
      if (linkId === 'bags' && shopCategory === 'Handmade Bags') return true;
      if (linkId === 'limited' && shopCategory === 'Limited Edition Sets') return true;
    }
    return false;
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      {/* Top Announcement Bar */}
      <div className="bg-[#7A3B4E] text-[#FDF9F6] text-[10px] sm:text-xs font-medium py-2 px-4 text-center tracking-wider">
        🇵🇰 Free Express Delivery All Over Pakistan | WhatsApp: <strong className="text-[#F4A7B9] font-mono">+92 333 5244191</strong> | Code: <strong className="text-[#F4A7B9]">LUXURY10</strong>
      </div>

      {/* Main Glass Nav Bar */}
      <div className={`bwc-glass border-b border-[#7A3B4E]/10 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div onClick={() => setActiveTab('home')} className="cursor-pointer flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5EFF2]/80 p-1.5 rounded-full border border-[#7A3B4E]/10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isLinkActive(link.id)
                    ? 'bg-[#7A3B4E] text-white shadow-md'
                    : 'text-[#1C1C1E] hover:text-[#7A3B4E] hover:bg-white/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Currency Toggle (Desktop only) */}
            <div className="hidden sm:flex items-center bg-[#F5EFF2] rounded-full p-0.5 border border-[#7A3B4E]/10 text-xs font-bold">
              <button
                onClick={() => setCurrency('PKR')}
                className={`px-2.5 py-1 rounded-full transition-all ${currency === 'PKR' ? 'bg-[#7A3B4E] text-white shadow-sm' : 'text-gray-600 hover:text-black'}`}
              >Rs.</button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-full transition-all ${currency === 'USD' ? 'bg-[#7A3B4E] text-white shadow-sm' : 'text-gray-600 hover:text-black'}`}
              >$</button>
            </div>

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-full text-[#1C1C1E] hover:text-[#7A3B4E] hover:bg-[#F4A7B9]/20 transition-colors"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActiveTab('account')}
              className="relative p-2 sm:p-2.5 rounded-full text-[#1C1C1E] hover:text-[#7A3B4E] hover:bg-[#F4A7B9]/20 transition-colors hidden sm:flex"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#7A3B4E] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full bg-[#7A3B4E] text-white hover:bg-[#5E2C3B] shadow-md transition-all duration-300 flex items-center gap-1.5 px-3 sm:px-3.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#F4A7B9]" />
              <span className="text-xs font-semibold hidden sm:inline">Bag</span>
              {cartItemCount > 0 && (
                <span className="w-4 h-4 bg-[#F4A7B9] text-[#7A3B4E] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              onClick={() => setActiveTab('account')}
              className="p-2 sm:p-2.5 rounded-full text-[#1C1C1E] hover:text-[#7A3B4E] hover:bg-[#F4A7B9]/20 transition-colors hidden sm:flex"
              title="Customer Account Portal"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-[#1C1C1E] hover:text-[#7A3B4E] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-[#7A3B4E]/10 grid grid-cols-3 gap-2 pb-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isLinkActive(link.id) ? 'bg-[#7A3B4E] text-white' : 'text-[#1C1C1E] bg-[#F5EFF2] hover:bg-[#F4A7B9]/30'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              {/* Mobile Currency + Account */}
              <div className="flex items-center justify-between pb-4 px-1 gap-3">
                <div className="flex items-center bg-[#F5EFF2] rounded-full p-0.5 border border-[#7A3B4E]/10 text-xs font-bold">
                  <button onClick={() => setCurrency('PKR')} className={`px-3 py-1.5 rounded-full transition-all ${currency === 'PKR' ? 'bg-[#7A3B4E] text-white' : 'text-gray-600'}`}>Rs.</button>
                  <button onClick={() => setCurrency('USD')} className={`px-3 py-1.5 rounded-full transition-all ${currency === 'USD' ? 'bg-[#7A3B4E] text-white' : 'text-gray-600'}`}>$</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setActiveTab('account'); setMobileMenuOpen(false); }} className="p-2.5 rounded-xl bg-[#F5EFF2] text-[#7A3B4E]">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setActiveTab('account'); setMobileMenuOpen(false); }} className="p-2.5 rounded-xl bg-[#F5EFF2] text-[#7A3B4E]">
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

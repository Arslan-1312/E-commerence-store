import React, { useState } from 'react';
import { Send, ShieldCheck, Truck, Award, Heart, Smartphone, Wallet, Building, CreditCard, Phone } from 'lucide-react';
import Logo from './Logo';
import { useShop } from '../context/ShopContext';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const Footer = ({ setActiveTab }) => {
  const { showToast } = useShop();
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    showToast('Mubarak! You are subscribed to Bint-e-Waheed VIP Access.');
    setEmailInput('');
  };

  return (
    <footer className="bg-[#1C1C1E] text-[#FDF9F6] pt-12 sm:pt-16 pb-12 border-t border-[#F4A7B9]/20 relative overflow-hidden">
      {/* Soft Glow Effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7A3B4E]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trust Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pb-12 border-b border-white/10 text-center">
          <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Award className="w-6 h-6 text-[#F4A7B9]" />
            <h4 className="font-serif font-semibold text-sm">100% Authentic Pakistani Handcraft</h4>
            <p className="text-xs text-gray-400">Handcrafted individually by master jewelers and embroiderers in Pakistan.</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Truck className="w-6 h-6 text-[#F4A7B9]" />
            <h4 className="font-serif font-semibold text-sm">Nationwide Express Delivery</h4>
            <p className="text-xs text-gray-400">Priority 2-4 business days courier delivery to all cities across Pakistan.</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
            <Phone className="w-6 h-6 text-[#F4A7B9]" />
            <h4 className="font-serif font-semibold text-sm">WhatsApp Concierge</h4>
            <p className="text-xs text-gray-400">Direct order & inquiry via WhatsApp +92 333 5244191.</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 py-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo size="lg" light={true} />
            <p className="text-xs text-gray-400 leading-relaxed">
              Bint-e-Waheed Collection is a premium Pakistani fashion house crafting heirloom Kundan jewelry and Zardozi velvet bags. Delivering nationwide across Pakistan.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://www.instagram.com/b.w_collection0000?igsh=MXIyamh0cWdqcnlpNg=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#7A3B4E] hover:bg-[#F4A7B9] hover:text-[#7A3B4E] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-md w-fit"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow @b.w_collection0000</span>
              </a>
              <a
                href="https://wa.me/923335244191"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-md w-fit font-mono"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: +92 333 5244191</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#F4A7B9] mb-4 uppercase tracking-wider">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <button onClick={() => setActiveTab('jewelry')} className="hover:text-[#F4A7B9] transition-colors text-left">
                  Handmade Kundan & Pearl Jewelry
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bags')} className="hover:text-[#F4A7B9] transition-colors text-left">
                  Royal Zardozi Velvet Bags
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('limited')} className="hover:text-[#F4A7B9] transition-colors text-left">
                  Limited Edition Bridal Potlis
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('craft')} className="hover:text-[#F4A7B9] transition-colors text-left">
                  The Art of Pakistani Handcrafting
                </button>
              </li>
            </ul>
          </div>

          {/* Pakistani WhatsApp Contact */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#F4A7B9] mb-4 uppercase tracking-wider">
              Client Concierge
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
                <Phone className="w-4 h-4" /> +92 333 5244191
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#96C99A]" /> TCS & Leopards Delivery
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#F4A7B9]" /> Lahore, Karachi, Islamabad
              </div>
            </div>
          </div>

          {/* VIP Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[#F4A7B9] uppercase tracking-wider">
              Bint-e-Waheed Privilege Club
            </h4>
            <p className="text-xs text-gray-400">
              Receive private invitations to limited artisan drops and 10% off your inaugural order.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A7B9]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#7A3B4E] hover:bg-[#F4A7B9] hover:text-[#7A3B4E] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-3 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Bint-e-Waheed Collection. All Rights Reserved. WhatsApp: +92 333 5244191.</p>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Handcrafted with</span>
              <Heart className="w-3.5 h-3.5 text-[#F4A7B9] fill-current" />
              <span>in Pakistan</span>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[11px] text-gray-500 hover:border-[#F4A7B9]/30 transition-colors group">
            <svg className="w-3.5 h-3.5 text-[#F4A7B9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="text-gray-600">Designed &amp; Developed by</span>
            <span className="font-semibold text-[#F4A7B9] group-hover:text-white transition-colors">Arslan Iqbal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, CheckCircle2, ArrowRight, MapPin, Gift, User, Phone, Mail, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop, USD_TO_PKR } from '../context/ShopContext';

export const CartCheckout = ({ onOrderComplete }) => {
  const { cart, cartTotalUSD, discountAmountUSD, finalTotalUSD, appliedCoupon, clearCart, user, API_BASE, formatPrice, currency } = useShop();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '+92 333 5244191',
    email: user?.email || '',
    street: 'House #14, Block C, Gulberg III',
    city: 'Lahore',
    province: 'Punjab',
    notes: 'Please include luxury gift packaging & ribbon.',
    isGiftWrapped: true
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const WHATSAPP_NUMBER = '923335244191'; // Updated Brand Official WhatsApp Number

  const handlePlaceOrderWhatsApp = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim()) {
      alert('Please fill in your Name, WhatsApp Phone Number, and Delivery City.');
      return;
    }

    setLoading(true);

    const orderNumber = 'BWC-ORD-' + Math.floor(100000 + Math.random() * 900000);
    const finalTotalPKR = Math.round(finalTotalUSD * USD_TO_PKR);

    // Build Structured WhatsApp Message
    let message = `*ASSALAM-O-ALAIKUM BINT-E-WAHEED COLLECTION!* 👑\n\n`;
    message += `I would like to confirm & place my order for the following handcrafted items:\n\n`;
    message += `📋 *ORDER DETAILS (#${orderNumber})*\n`;
    message += `-----------------------------------\n`;

    cart.forEach((item, index) => {
      const itemPricePKR = Math.round(item.price * USD_TO_PKR);
      message += `*${index + 1}. ${item.title}*\n`;
      if (item.selectedColor) message += `   • Shade: ${item.selectedColor}\n`;
      message += `   • Qty: ${item.quantity} x Rs. ${item.price ? itemPricePKR.toLocaleString() : 0}\n`;
      message += `   • Image: ${item.image}\n\n`;
    });

    message += `-----------------------------------\n`;
    message += `💰 *Total Amount:* Rs. ${finalTotalPKR.toLocaleString()} (${currency === 'USD' ? `$${finalTotalUSD}` : ''})\n`;
    if (appliedCoupon) {
      message += `🏷️ *Promo Code:* ${appliedCoupon.code} (${appliedCoupon.discountAmount}% Off Applied)\n`;
    }
    message += `🎁 *Gift Packaging:* ${formData.isGiftWrapped ? 'Yes (Velvet Gift Box & Ribbon)' : 'Standard'}\n\n`;

    message += `👤 *PATRON DELIVERY DETAILS*\n`;
    message += `• *Name:* ${formData.name}\n`;
    message += `• *WhatsApp #:* ${formData.phone}\n`;
    message += `• *City:* ${formData.city}, ${formData.province}\n`;
    message += `• *Address:* ${formData.street}\n`;
    if (formData.notes) message += `• *Special Instructions:* ${formData.notes}\n`;

    message += `\n*Please confirm availability and dispatch details. Thank you!*`;

    // Trigger celebration confetti
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    // Open WhatsApp API in new tab
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      clearCart();
      setLoading(false);
      onOrderComplete();
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8"
    >
      
      {/* Luxury Header Banner */}
      <div className="bg-[#7A3B4E] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-[#F4A7B9]/30">
        <div className="max-w-xl space-y-2 relative z-10">
          <span className="px-3 py-1 bg-[#F4A7B9] text-[#7A3B4E] text-[10px] font-bold uppercase tracking-widest rounded-full">
            Direct Concierge Order
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            Complete Order via WhatsApp
          </h1>
          <p className="text-xs text-gray-200">
            Fill in your delivery details below. Clicking "Place Order on WhatsApp" will automatically generate a structured message sent directly to WhatsApp <strong>+92 333 5244191</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-8 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft space-y-5 sm:space-y-6">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#7A3B4E] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F4A7B9]" /> Patron Delivery Info (Pakistan Nationwide)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                placeholder="e.g. Syeda Ayesha Fatima"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">WhatsApp Number *</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none font-mono"
                placeholder="+92 333 5244191"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Delivery Street Address *</label>
            <input
              type="text"
              name="street"
              required
              value={formData.street}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
              placeholder="House #, Street #, Phase/Sector"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">City *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                placeholder="Lahore, Karachi, Islamabad..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Province *</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
              >
                <option>Punjab</option>
                <option>Sindh</option>
                <option>KPK</option>
                <option>Balochistan</option>
                <option>Islamabad Capital Territory</option>
                <option>Azad Kashmir</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Special Instructions / Customization Notes</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none resize-none"
              placeholder="Custom color requests, bridal date, gift message..."
            />
          </div>

          {/* Gift Packaging Checkbox */}
          <div className="p-4 bg-[#FDF9F6] rounded-2xl border border-[#7A3B4E]/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-[#7A3B4E] flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#1C1C1E] block">Complimentary Luxury Gift Packaging</span>
                <span className="text-[11px] text-gray-500">Velvet-lined rigid box & satin ribbon</span>
              </div>
            </div>
            <input
              type="checkbox"
              name="isGiftWrapped"
              checked={formData.isGiftWrapped}
              onChange={handleInputChange}
              className="w-5 h-5 accent-[#7A3B4E] rounded cursor-pointer flex-shrink-0"
            />
          </div>

          {/* WhatsApp Direct Action Button */}
          <button
            onClick={handlePlaceOrderWhatsApp}
            disabled={loading || cart.length === 0}
            className="w-full py-4 bg-[#25D366] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:bg-[#1EBE5D] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <MessageCircle className="w-5 h-5 fill-current text-white flex-shrink-0" />
            <span>{loading ? 'Generating Message...' : `Place Order via WhatsApp (+92 333 5244191)`}</span>
          </button>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#7A3B4E]">Luxury Bag Summary ({cart.length} Items)</h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item, i) => (
              <div key={i} className="flex gap-3 items-center text-xs p-2.5 bg-[#FDF9F6] rounded-2xl border border-gray-100">
                <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-gray-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-semibold text-[#1C1C1E] truncate">{item.title}</h4>
                  {item.selectedColor && <span className="text-[10px] text-[#7A3B4E]">Shade: {item.selectedColor}</span>}
                  <div className="text-[#8E8E93] text-[11px]">Qty: {item.quantity}</div>
                </div>
                <span className="font-serif font-bold text-[#7A3B4E] flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotalUSD)}</span>
            </div>
            {discountAmountUSD > 0 && (
              <div className="flex justify-between text-[#96C99A] font-bold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discountAmountUSD)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-serif font-bold text-[#7A3B4E] pt-2 border-t border-gray-100">
              <span>Total Payable</span>
              <span>{formatPrice(finalTotalUSD)}</span>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default CartCheckout;

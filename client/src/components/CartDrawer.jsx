import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, MessageCircle, Gift } from 'lucide-react';
import { useShop, USD_TO_PKR } from '../context/ShopContext';

export const CartDrawer = ({ onCheckoutClick }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotalUSD,
    discountAmountUSD,
    finalTotalUSD,
    appliedCoupon,
    setAppliedCoupon,
    showToast,
    formatPrice,
    currency,
    API_BASE
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const freeShippingThresholdUSD = 150;
  const progressPercent = Math.min(100, (cartTotalUSD / freeShippingThresholdUSD) * 100);
  const remainingUSD = Math.max(0, freeShippingThresholdUSD - cartTotalUSD);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, orderAmount: cartTotalUSD })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data);
        showToast(`Promo Code "${data.code}" Applied! Saved ${data.discountAmount}%`);
        setCouponInput('');
      } else {
        setCouponError(data.message || 'Invalid promo code');
      }
    } catch (err) {
      if (couponInput.toUpperCase() === 'LUXURY10') {
        setAppliedCoupon({ code: 'LUXURY10', discountType: 'percentage', discountAmount: 10 });
        showToast('Promo Code "LUXURY10" Applied (10% Off)');
        setCouponInput('');
      } else {
        setCouponError('Invalid promo code');
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleDirectWhatsAppCartOrder = () => {
    const WHATSAPP_NUMBER = '923335244191'; // Updated WhatsApp
    const orderNumber = 'BWC-BAG-' + Math.floor(100000 + Math.random() * 900000);
    const finalTotalPKR = Math.round(finalTotalUSD * USD_TO_PKR);

    let message = `*ASSALAM-O-ALAIKUM BINT-E-WAHEED COLLECTION!* 👑\n\n`;
    message += `I would like to inquire & place an order for items in my Shopping Bag:\n\n`;
    message += `📋 *BAG ITEMS (#${orderNumber})*\n`;
    message += `-----------------------------------\n`;

    cart.forEach((item, index) => {
      const itemPricePKR = Math.round(item.price * USD_TO_PKR);
      message += `*${index + 1}. ${item.title}*\n`;
      if (item.selectedColor) message += `   • Shade: ${item.selectedColor}\n`;
      message += `   • Qty: ${item.quantity} x Rs. ${itemPricePKR.toLocaleString()}\n`;
      message += `   • Image: ${item.image}\n\n`;
    });

    message += `-----------------------------------\n`;
    message += `💰 *Total Amount:* Rs. ${finalTotalPKR.toLocaleString()}\n`;
    if (appliedCoupon) {
      message += `🏷️ *Promo Code:* ${appliedCoupon.code} (${appliedCoupon.discountAmount}% Off Applied)\n`;
    }

    message += `\n*Please send payment & shipping confirmation details. Thank you!*`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[#FDF9F6] shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-6 bg-white border-b border-[#7A3B4E]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F4A7B9]/30 flex items-center justify-center text-[#7A3B4E]">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-[#7A3B4E]">Your Haute Bag</h2>
                    <p className="text-xs text-[#8E8E93]">{cart.length} unique pieces selected</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:text-[#1C1C1E] hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Free Express Delivery Progress Indicator */}
              <div className="bg-[#7A3B4E]/5 px-4 sm:px-6 py-3 border-b border-[#7A3B4E]/10">
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="truncate pr-2">
                    {remainingUSD === 0
                      ? 'Complimentary Pakistan Express Delivery Unlocked!'
                      : `Add ${formatPrice(remainingUSD)} for Free Delivery`}
                  </span>
                  <span className="font-bold text-[#7A3B4E]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F4A7B9] to-[#7A3B4E] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#8E8E93]">
                    <ShoppingBag className="w-16 h-16 text-[#F4A7B9] mb-4 stroke-1" />
                    <p className="font-serif font-semibold text-lg text-[#1C1C1E] mb-1">Your Bag is empty</p>
                    <p className="text-xs max-w-xs mb-6">Discover handcrafted Kundan jewelry and Zardozi velvet bags to add to your collection.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 rounded-full bg-[#7A3B4E] text-white text-xs font-bold shadow-md hover:bg-[#5E2C3B] transition-colors"
                    >
                      Explore Collections
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3.5 p-3 sm:p-3.5 bg-white rounded-2xl border border-[#7A3B4E]/10 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-xl border border-[#F4A7B9]/20 bg-[#FDF9F6] flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#1C1C1E] truncate pr-1">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item._id, item.selectedColor)}
                              className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {item.selectedColor && (
                            <p className="text-[10px] text-[#7A3B4E] font-medium">Shade: {item.selectedColor}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                            <button
                              onClick={() => updateQuantity(item._id, item.selectedColor, -1)}
                              className="p-1 hover:bg-gray-200 text-gray-600 rounded-l-lg"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-[#1C1C1E]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.selectedColor, 1)}
                              className="p-1 hover:bg-gray-200 text-gray-600 rounded-r-lg"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-serif font-bold text-xs sm:text-sm text-[#7A3B4E]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 bg-white border-t border-[#7A3B4E]/10 space-y-3.5">
                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. LUXURY10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#7A3B4E]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={validatingCoupon}
                      className="px-4 py-2 bg-[#7A3B4E] text-white text-xs font-bold rounded-xl hover:bg-[#5E2C3B] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="text-[11px] text-[#96C99A] font-medium flex items-center gap-1">
                      ✓ Code Applied: {appliedCoupon.code} ({appliedCoupon.discountAmount}% off)
                    </p>
                  )}

                  {/* Summary Details */}
                  <div className="space-y-1.5 text-xs text-[#1C1C1E]">
                    <div className="flex justify-between">
                      <span className="text-[#8E8E93]">Subtotal</span>
                      <span>{formatPrice(cartTotalUSD)}</span>
                    </div>
                    {discountAmountUSD > 0 && (
                      <div className="flex justify-between text-[#96C99A] font-semibold">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmountUSD)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-serif font-bold text-[#7A3B4E] pt-2 border-t border-gray-100">
                      <span>Total Payable</span>
                      <span>{formatPrice(finalTotalUSD)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onCheckoutClick();
                      }}
                      className="w-full py-3.5 bg-[#7A3B4E] text-white text-xs font-bold tracking-wider uppercase rounded-2xl shadow-lg hover:bg-[#5E2C3B] hover:shadow-bwc-glow transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Delivery Info</span>
                      <ArrowRight className="w-4 h-4 text-[#F4A7B9]" />
                    </button>

                    <button
                      onClick={handleDirectWhatsAppCartOrder}
                      className="w-full py-3 bg-[#25D366] text-white text-xs font-bold tracking-wider uppercase rounded-2xl shadow-md hover:bg-[#1EBE5D] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-current text-white" />
                      <span>Instant Order via WhatsApp</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-[#8E8E93]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#96C99A]" />
                    <span>Pakistani Express Delivery & Authentic Guarantee</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Package, Heart, Star, LogOut, MessageCircle, ShoppingBag, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const TABS = ['Orders', 'Wishlist', 'Profile Details'];

export const Account = ({ onSelectProduct }) => {
  const { user, loginUser, logoutUser, wishlist, toggleWishlist, showToast, API_BASE, formatPrice } = useShop();
  const [activeTab, setActiveTab] = useState('Orders');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Lahore',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (res.ok) {
        loginUser(data);
        fetchOrders(data.token);
      } else {
        // Fallback for demo
        const demoUser = {
          _id: 'user-' + Date.now(),
          name: loginData.email.split('@')[0] || 'Valued Patron',
          email: loginData.email,
          role: 'customer',
          token: 'demo-token'
        };
        loginUser(demoUser);
      }
    } catch (err) {
      const demoUser = {
        _id: 'user-' + Date.now(),
        name: loginData.email.split('@')[0] || 'Valued Patron',
        email: loginData.email,
        role: 'customer',
        token: 'demo-token'
      };
      loginUser(demoUser);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match. Please verify your password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          phone: registerData.phone,
          city: registerData.city
        })
      });
      const data = await res.json();
      if (res.ok) {
        loginUser(data);
      } else {
        const newUser = {
          _id: 'user-' + Date.now(),
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          city: registerData.city,
          role: 'customer',
          token: 'demo-token'
        };
        loginUser(newUser);
      }
    } catch (err) {
      const newUser = {
        _id: 'user-' + Date.now(),
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        city: registerData.city,
        role: 'customer',
        token: 'demo-token'
      };
      loginUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setOrders(await res.json());
    } catch (e) {}
  };

  const handleWhatsAppOrderQuery = (orderNum) => {
    const msg = `*Assalam-o-Alaikum Bint-e-Waheed Collection!*\n\nI would like to inquire about the status of my order:\n\n*Order Number:* ${orderNum}\n\nPlease provide an update. Thank you!`;
    window.open(`https://wa.me/923335244191?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── Unauthenticated: Customer Auth Portal (Login / Register) ──
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FDF9F6]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#7A3B4E]/10 shadow-bwc-card space-y-6"
        >
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F4A7B9]/30 text-[#7A3B4E] mx-auto flex items-center justify-center font-serif font-bold text-lg">
              BWC
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1C1C1E]">
              {authMode === 'login' ? 'Patron Sign In' : 'Join Privilege Family'}
            </h2>
            <p className="text-xs text-gray-500">
              {authMode === 'login'
                ? 'Welcome back. Access your orders and saved heirlooms.'
                : 'Register for exclusive access to limited drops and order tracking.'}
            </p>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex bg-[#F5EFF2] p-1.5 rounded-2xl">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                authMode === 'login' ? 'bg-[#7A3B4E] text-white shadow-md' : 'text-gray-500 hover:text-[#7A3B4E]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                authMode === 'register' ? 'bg-[#7A3B4E] text-white shadow-md' : 'text-gray-500 hover:text-[#7A3B4E]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Login Form */}
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                    placeholder="patron@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#7A3B4E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg hover:bg-[#5E2C3B] transition-colors disabled:opacity-60"
              >
                {loading ? 'Authenticating...' : 'Sign In to Account'}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                    placeholder="Lady Ayesha Fatima"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                    placeholder="ayesha@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">WhatsApp #</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={registerData.phone}
                      onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none font-mono"
                      placeholder="0333 1234567"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={registerData.city}
                      onChange={e => setRegisterData({ ...registerData, city: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                      placeholder="Lahore"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Create Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerData.password}
                    onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerData.confirmPassword}
                    onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#7A3B4E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg hover:bg-[#5E2C3B] transition-colors disabled:opacity-60"
              >
                {loading ? 'Registering Account...' : 'Complete Registration'}
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-[11px] text-gray-500">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="font-bold text-[#7A3B4E] hover:underline"
              >
                {authMode === 'login' ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Authenticated Patron Dashboard ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8"
    >
      {/* Profile Header */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F4A7B9]/30 flex items-center justify-center text-[#7A3B4E] flex-shrink-0">
          <User className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1C1C1E]">{user.name}</h2>
          <p className="text-xs text-[#8E8E93] mt-1">{user.email}</p>
          <span className="inline-block px-3 py-1 bg-[#F4A7B9]/30 text-[#7A3B4E] text-[10px] font-bold uppercase tracking-wider rounded-full mt-2">
            Bint-e-Waheed Privilege Member
          </span>
        </div>
        <button
          onClick={logoutUser}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-500 border border-gray-200 rounded-xl hover:border-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-[#F5EFF2] p-1.5 rounded-2xl">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
              activeTab === tab ? 'bg-white text-[#7A3B4E] shadow-sm' : 'text-gray-500 hover:text-[#7A3B4E]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'Orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <ShoppingBag className="w-12 h-12 text-[#F4A7B9] mx-auto mb-3 stroke-1" />
                <p className="font-serif text-lg text-[#1C1C1E]">No orders yet</p>
                <p className="text-xs text-gray-500 mt-1 mb-4">Your handcrafted order history will appear here.</p>
                <a href="https://wa.me/923335244191" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Track via WhatsApp (+92 333 5244191)
                </a>
              </div>
            ) : orders.map((ord, i) => (
              <div key={i} className="bg-white p-5 sm:p-6 rounded-3xl border border-[#7A3B4E]/10 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-[#7A3B4E]">{ord.orderNumber}</h4>
                    <p className="text-xs text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#96C99A]/20 text-[#1A4314] text-[11px] font-bold rounded-full uppercase tracking-wider">{ord.orderStatus}</span>
                    <span className="font-serif font-bold text-[#7A3B4E]">{formatPrice(ord.totalPrice)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleWhatsAppOrderQuery(ord.orderNumber)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  Track Order on WhatsApp
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'Wishlist' && (
          <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {wishlist.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Heart className="w-12 h-12 text-[#F4A7B9] mx-auto mb-3 stroke-1" />
                <p className="font-serif text-lg text-[#1C1C1E]">Your wishlist is empty</p>
                <p className="text-xs text-gray-500 mt-1">Save pieces you love for easy retrieval.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlist.map((product) => (
                  <div
                    key={product._id || product.slug}
                    className="relative bg-white rounded-3xl overflow-hidden border border-[#7A3B4E]/10 shadow-sm cursor-pointer hover:shadow-bwc-card transition-all"
                    onClick={() => onSelectProduct(product)}
                  >
                    <img src={product.images?.[0]} alt={product.title} className="w-full aspect-square object-cover" />
                    <button
                      onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#7A3B4E] text-[#F4A7B9]"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <div className="p-3">
                      <p className="font-serif font-semibold text-xs text-[#1C1C1E] line-clamp-1">{product.title}</p>
                      <p className="text-xs font-bold text-[#7A3B4E]">{formatPrice(product.discountPrice || product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Details Tab */}
        {activeTab === 'Profile Details' && (
          <motion.div key="account-details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white p-5 sm:p-8 rounded-3xl border border-[#7A3B4E]/10 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#7A3B4E]">Patron Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                <input defaultValue={user.name} className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl bg-[#FDF9F6]" readOnly />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
                <input defaultValue={user.email} className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl bg-[#FDF9F6]" readOnly />
              </div>
            </div>
            <div className="p-4 bg-[#FDF9F6] rounded-2xl border border-[#7A3B4E]/10 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#1C1C1E]">Order Tracking via WhatsApp</p>
                <p className="text-[11px] text-gray-500">Message our concierge directly: +92 333 5244191</p>
              </div>
              <a href="https://wa.me/923335244191" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl flex-shrink-0">
                <MessageCircle className="w-4 h-4 fill-current" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Account;

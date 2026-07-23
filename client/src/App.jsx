import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import QuickViewModal from './components/QuickViewModal';
import LuxuryToast from './components/LuxuryToast';
import WelcomeScreen, { PageSuspenseFallback } from './components/WelcomeScreen';

// ─── Code Splitting / Lazy Loading for Performance ───────────────────
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartCheckout = lazy(() => import('./pages/CartCheckout'));
const Account = lazy(() => import('./pages/Account'));
const BrandStory = lazy(() => import('./pages/BrandStory'));
const ContactFAQ = lazy(() => import('./pages/ContactFAQ'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// ─── Admin Credentials (frontend-only guard) ───────────────────────────
const ADMIN_PASS = 'bwc-admin-2025';

// ─── Floating WhatsApp Widget ──────────────────────────────────────────
const WhatsAppFloat = () => (
  <a
    href="https://wa.me/923335244191?text=Assalam-o-Alaikum%20Bint-e-Waheed%20Collection!%20I%20would%20like%20to%20inquire%20about%20your%20handcrafted%20collection."
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-float"
    title="Order on WhatsApp: +92 333 5244191"
    aria-label="Order via WhatsApp"
  >
    <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
);

// ─── WordPress-Style Secret Admin Login Gate ───────────────────────────
const AdminLoginGate = ({ onSuccess, onBack }) => {
  const [username, setUsername] = useState('admin@bwcollection.pk');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      onSuccess();
    } else {
      setError('Invalid admin credentials. Access denied.');
      setPass('');
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        {/* WordPress-Style Admin Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#7A3B4E] mx-auto flex items-center justify-center shadow-lg border border-[#F4A7B9]/30">
            <svg className="w-7 h-7 text-[#F4A7B9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="px-3 py-1 bg-[#F4A7B9]/20 text-[#F4A7B9] text-[10px] font-bold uppercase tracking-widest rounded-full inline-block">
            WordPress-Style Secret Gate
          </span>
          <h1 className="font-serif font-bold text-xl text-white">WP Admin Portal</h1>
          <p className="text-xs text-gray-400">Bint-e-Waheed Couture — Secret Dashboard Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">Admin Username / Email</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F4A7B9] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">Admin Password</label>
            <input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              autoFocus
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F4A7B9] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-semibold bg-red-400/10 px-3 py-2 rounded-lg text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#7A3B4E] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#5E2C3B] transition-colors shadow-lg"
          >
            Log In to Admin Panel
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Exit to Public Store
          </button>
        </form>

        <div className="text-center pt-3 border-t border-white/10 space-y-1">
          <p className="text-[10px] text-gray-500">Secret WordPress Link:</p>
          <code className="text-[10px] text-[#F4A7B9] font-mono block bg-black/30 py-1 px-2 rounded">
            http://localhost:3001/#wp-admin
          </code>
          <p className="text-[10px] text-gray-600">Password: <code className="text-[#F4A7B9]">bwc-admin-2025</code></p>
        </div>
      </div>
    </div>
  );
};

// ─── Main App Content ──────────────────────────────────────────────────
const AppContent = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    const search = window.location.search;
    if (
      hash.includes('wp-admin') ||
      hash.includes('admin') ||
      path.includes('wp-admin') ||
      path.includes('admin') ||
      search.includes('admin')
    ) {
      return 'admin';
    }
    return 'home';
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopCategory, setShopCategory] = useState('All');
  const [adminUnlocked, setAdminUnlocked] = useState(() => {
    return sessionStorage.getItem('bwc_admin_unlocked') === 'true';
  });

  const shop = useShop() || {};
  const { quickViewProduct, loginUser } = shop;

  // ── Keyboard shortcut: Ctrl + Shift + A → open secret admin gate
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setActiveTab('admin');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── Secret URL Routing: /#wp-admin, /wp-admin, ?admin=login
  useEffect(() => {
    const checkUrl = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const search = window.location.search;
      if (
        hash.includes('wp-admin') ||
        hash.includes('admin') ||
        path.includes('wp-admin') ||
        path.includes('admin') ||
        search.includes('admin')
      ) {
        setActiveTab('admin');
      }
    };
    checkUrl();
    window.addEventListener('hashchange', checkUrl);
    window.addEventListener('popstate', checkUrl);
    return () => {
      window.removeEventListener('hashchange', checkUrl);
      window.removeEventListener('popstate', checkUrl);
    };
  }, []);

  const handleAdminUnlock = () => {
    loginUser({
      _id: 'admin-001',
      name: 'Brand Administrator',
      email: 'admin@bwcollection.pk',
      role: 'admin',
      token: 'admin-session-token'
    });
    sessionStorage.setItem('bwc_admin_unlocked', 'true');
    setAdminUnlocked(true);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    if (tab === 'jewelry') {
      setShopCategory('Handmade Jewelry');
      setActiveTab('shop');
    } else if (tab === 'bags') {
      setShopCategory('Handmade Bags');
      setActiveTab('shop');
    } else if (tab === 'limited') {
      setShopCategory('Limited Edition Sets');
      setActiveTab('shop');
    } else {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = activeTab === 'admin';
  const isCheckout = activeTab === 'checkout';

  if (isAdmin && !adminUnlocked) {
    return (
      <AdminLoginGate
        onSuccess={handleAdminUnlock}
        onBack={() => handleTabChange('home')}
      />
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={handleTabChange} onSelectProduct={handleSelectProduct} />;
      case 'shop':
        return <Shop initialCategory={shopCategory} onSelectProduct={handleSelectProduct} />;
      case 'product-detail':
        return (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setActiveTab('shop')}
            onSelectProduct={handleSelectProduct}
          />
        );
      case 'checkout':
        return <CartCheckout onOrderComplete={() => handleTabChange('home')} />;
      case 'account':
        return <Account onSelectProduct={handleSelectProduct} />;
      case 'craft':
        return <BrandStory setActiveTab={handleTabChange} />;
      case 'contact':
        return <ContactFAQ />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home setActiveTab={handleTabChange} onSelectProduct={handleSelectProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF9F6]">
      {/* 2-Second Welcome Screen Splash */}
      <WelcomeScreen />

      {/* Admin Top Bar */}
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#1C1C1E] border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#96C99A] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wider uppercase">WP-Admin Dashboard — Bint-e-Waheed</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('bwc_admin_unlocked');
              setAdminUnlocked(false);
              handleTabChange('home');
            }}
            className="px-4 py-1.5 bg-[#7A3B4E] text-white text-[11px] font-bold rounded-lg hover:bg-[#5E2C3B] transition-colors"
          >
            ← Exit to Public Store
          </button>
        </div>
      )}

      {!isAdmin && <Header activeTab={activeTab} shopCategory={shopCategory} setActiveTab={handleTabChange} />}

      {/* React Suspense with lightweight fallback */}
      <Suspense fallback={<PageSuspenseFallback />}>
        <main className={`flex-1 ${isAdmin ? 'pt-12' : ''}`}>
          {renderPage()}
        </main>
      </Suspense>

      {!isAdmin && !isCheckout && <Footer setActiveTab={handleTabChange} />}

      {/* Global Overlays */}
      <CartDrawer onCheckoutClick={() => handleTabChange('checkout')} />
      <SearchModal onSelectProduct={handleSelectProduct} />
      {quickViewProduct && <QuickViewModal />}
      <LuxuryToast />

      {/* Floating WhatsApp Widget */}
      {!isAdmin && <WhatsAppFloat />}
    </div>
  );
};

function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

export default App;

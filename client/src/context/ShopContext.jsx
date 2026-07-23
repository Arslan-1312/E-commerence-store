import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProductsData from '../data/products.json';

const ShopContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

// Exchange rate: 1 USD = 280 PKR
export const USD_TO_PKR = 280;

const defaultContextValue = {
  products: initialProductsData,
  loading: false,
  cart: [],
  wishlist: [],
  user: null,
  currency: 'PKR',
  setCurrency: () => {},
  formatPrice: (usd) => `Rs. ${Math.round(usd * USD_TO_PKR).toLocaleString()}`,
  isCartOpen: false,
  setIsCartOpen: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
  quickViewProduct: null,
  setQuickViewProduct: () => {},
  toastMessage: null,
  showToast: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  toggleWishlist: () => {},
  cartTotalUSD: 0,
  discountAmountUSD: 0,
  finalTotalUSD: 0,
  appliedCoupon: null,
  setAppliedCoupon: () => {},
  fetchProducts: () => {},
  addProductLocally: () => {},
  updateProductLocally: () => {},
  deleteProductLocally: () => {},
  exportProductsJSON: () => {},
  loginUser: () => {},
  logoutUser: () => {},
  API_BASE
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('bwc_products');
      return saved ? JSON.parse(saved) : initialProductsData;
    } catch (e) {
      return initialProductsData;
    }
  });

  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('PKR');

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('bwc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('bwc_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bwc_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('bwc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bwc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bwc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) localStorage.setItem('bwc_user', JSON.stringify(user));
    else localStorage.removeItem('bwc_user');
  }, [user]);

  // Fetch products from backend API (if running), else fall back to local JSON
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${queryString}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      // Offline / Static resilience fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Admin CRUD helper functions
  const addProductLocally = (newProd) => {
    const item = {
      _id: 'bwc-' + Date.now(),
      slug: newProd.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      numReviews: 1,
      ...newProd
    };
    setProducts(prev => [item, ...prev]);
    showToast(`Added product "${newProd.title}" successfully!`);
    return item;
  };

  const updateProductLocally = (updatedProd) => {
    setProducts(prev => prev.map(p => (p._id === updatedProd._id || p.slug === updatedProd.slug ? updatedProd : p)));
    showToast(`Updated "${updatedProd.title}"!`);
  };

  const deleteProductLocally = (idOrSlug) => {
    setProducts(prev => prev.filter(p => p._id !== idOrSlug && p.slug !== idOrSlug));
    showToast(`Product deleted successfully.`);
  };

  // Export Data JSON File function (for easy local folder backup!)
  const exportProductsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "products.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Downloaded products.json backup file!`);
  };

  const formatPrice = (usdAmount) => {
    if (currency === 'PKR') {
      const pkrVal = Math.round(usdAmount * USD_TO_PKR);
      return `Rs. ${pkrVal.toLocaleString()}`;
    }
    return `$${usdAmount.toLocaleString()}`;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1, selectedColor = '', selectedMaterial = '') => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item._id === product._id && item.selectedColor === selectedColor);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, {
        _id: product._id || product.slug,
        title: product.title,
        price: product.discountPrice || product.price,
        image: product.images?.[0] || '',
        quantity,
        selectedColor,
        selectedMaterial
      }];
    });
    showToast(`Added "${product.title}" to Bag!`);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('Removed item from Bag.');
  };

  const updateQuantity = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    const isWishlisted = wishlist.some(item => item._id === product._id || item.slug === product.slug);
    if (isWishlisted) {
      setWishlist(prev => prev.filter(item => item._id !== product._id && item.slug !== product.slug));
      showToast(`Removed from Wishlist.`);
    } else {
      setWishlist(prev => [...prev, product]);
      showToast(`Saved "${product.title}" to Wishlist.`);
    }
  };

  const cartTotalUSD = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmountUSD = appliedCoupon ? (appliedCoupon.discountType === 'percentage' ? (cartTotalUSD * appliedCoupon.discountAmount) / 100 : appliedCoupon.discountAmount) : 0;
  const finalTotalUSD = Math.max(0, cartTotalUSD - discountAmountUSD);

  const loginUser = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`);
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Logged out successfully.');
  };

  return (
    <ShopContext.Provider value={{
      products,
      loading,
      cart,
      wishlist,
      user,
      currency,
      setCurrency,
      formatPrice,
      isCartOpen,
      setIsCartOpen,
      isSearchOpen,
      setIsSearchOpen,
      quickViewProduct,
      setQuickViewProduct,
      toastMessage,
      showToast,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      cartTotalUSD,
      discountAmountUSD,
      finalTotalUSD,
      appliedCoupon,
      setAppliedCoupon,
      fetchProducts,
      addProductLocally,
      updateProductLocally,
      deleteProductLocally,
      exportProductsJSON,
      loginUser,
      logoutUser,
      API_BASE
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  return context || defaultContextValue;
};

export default ShopContext;

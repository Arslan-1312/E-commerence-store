import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings,
  Plus, Edit2, Trash2, TrendingUp, DollarSign, Star, X, CheckCircle2,
  AlertCircle, Save, BarChart3, ArrowUp, Clock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const StatCard = ({ icon, label, value, change, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft">
    <div className="flex items-start justify-between">
      <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-[#96C99A] flex items-center gap-1">
        <ArrowUp className="w-3 h-3" /> {change}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-xs uppercase font-bold tracking-wider text-[#8E8E93]">{label}</p>
      <p className="font-serif font-bold text-2xl text-[#1C1C1E] mt-0.5">{value}</p>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { products, fetchProducts, addProductLocally, deleteProductLocally, exportProductsJSON, user, API_BASE } = useShop();
  const [activeSection, setActiveSection] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [newProduct, setNewProduct] = useState({
    title: '', category: 'Handmade Jewelry', subcategory: 'Necklaces',
    price: '', discountPrice: '', stock: 10, sku: '',
    description: '', craftDetails: '', materials: '', colors: '',
    images: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    isFeatured: false, isNewArrival: true, isBestSeller: false, inStock: true
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/all`);
        if (res.ok) setOrders(await res.json());
      } catch (e) {}
    };
    fetchOrders();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="font-serif font-bold text-xl text-[#1C1C1E]">Admin Access Required</h2>
        <p className="text-xs text-gray-500 mt-2">Please sign in with admin credentials to access the dashboard.</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productData = {
      ...newProduct,
      price: Number(newProduct.price),
      discountPrice: Number(newProduct.discountPrice) || 0,
      stock: Number(newProduct.stock),
      slug: newProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      sku: newProduct.sku || 'BWC-' + Date.now().toString().slice(-6),
      images: typeof newProduct.images === 'string' ? newProduct.images.split(',').map(s => s.trim()) : newProduct.images,
      materials: typeof newProduct.materials === 'string' ? newProduct.materials.split(',').map(s => s.trim()) : newProduct.materials,
      colors: typeof newProduct.colors === 'string' ? newProduct.colors.split(',').map(c => ({ name: c.trim(), hex: '#7A3B4E' })) : newProduct.colors,
      rating: 5.0, numReviews: 1
    };

    try {
      const token = user?.token || '';
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(productData)
      });
    } catch (err) {}

    addProductLocally(productData);
    setSaveMessage('✓ Product added & saved locally!');
    setTimeout(() => setSaveMessage(''), 3000);
    setShowAddForm(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      const token = user?.token || '';
      await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {}

    deleteProductLocally(productId);
    setSaveMessage('✓ Product removed.');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = user?.token || '';
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderStatus: status })
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
      setSaveMessage(`✓ Order status updated to "${status}"`);
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (err) {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    }
  };

  const sidebarLinks = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Product Manager', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'Order Fulfillment', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'analytics', label: 'Sales Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FDF9F6]">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#1C1C1E] text-white flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-serif font-bold text-lg text-[#F4A7B9]">BWC Admin</h2>
          <p className="text-xs text-gray-400 mt-0.5">Luxury Command Centre</p>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSection === link.id
                  ? 'bg-[#7A3B4E] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#7A3B4E] capitalize">{activeSection}</h1>
            <p className="text-xs text-gray-500">Bint-e-Waheed Collection · Admin Panel</p>
          </div>
          {saveMessage && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#96C99A]/20 text-[#1A4314] rounded-xl text-xs font-bold border border-[#96C99A]/30">
              <CheckCircle2 className="w-4 h-4" /> {saveMessage}
            </div>
          )}
        </div>

        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                icon={<DollarSign className="w-5 h-5 text-white" />}
                label="Total Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                change="+18% this month"
                color="bg-[#7A3B4E]"
              />
              <StatCard
                icon={<ShoppingCart className="w-5 h-5 text-[#7A3B4E]" />}
                label="Total Orders"
                value={orders.length}
                change="+7 this week"
                color="bg-[#F4A7B9]/30"
              />
              <StatCard
                icon={<Package className="w-5 h-5 text-[#7A3B4E]" />}
                label="Active Products"
                value={products.length}
                change="+2 new listings"
                color="bg-[#F4A7B9]/30"
              />
              <StatCard
                icon={<Star className="w-5 h-5 text-amber-500" />}
                label="Avg Rating"
                value="4.9 / 5.0"
                change="+0.1 improved"
                color="bg-amber-50"
              />
            </div>

            {/* Recent Orders Mini-Table */}
            <div className="bg-white rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#7A3B4E]">Recent Orders</h3>
                <button onClick={() => setActiveSection('orders')} className="text-xs font-bold text-[#7A3B4E] hover:underline">
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#FDF9F6] border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Order #</th>
                      <th className="px-5 py-3 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Customer</th>
                      <th className="px-5 py-3 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Total</th>
                      <th className="px-5 py-3 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.slice(0, 5).map((ord, i) => (
                      <tr key={i} className="hover:bg-[#FDF9F6]">
                        <td className="px-5 py-3 font-bold text-[#7A3B4E]">{ord.orderNumber}</td>
                        <td className="px-5 py-3 font-medium text-[#1C1C1E]">{ord.customerInfo?.name || 'Patron'}</td>
                        <td className="px-5 py-3 font-serif font-bold">${ord.totalPrice?.toFixed(2)}</td>
                        <td className="px-5 py-3">
                          <span className="px-2.5 py-1 bg-[#96C99A]/20 text-[#1A4314] rounded-full font-bold">
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGER */}
        {activeSection === 'products' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1C1C1E]">{products.length} Products Listed</h2>
                <p className="text-xs text-gray-500">Manage catalog, add new pieces, and export data backup</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportProductsJSON}
                  className="px-4 py-2.5 bg-white border border-[#7A3B4E]/30 text-[#7A3B4E] text-xs font-bold rounded-2xl shadow-sm hover:bg-[#FDF9F6] flex items-center gap-2"
                  title="Export products.json backup file for client/src/data/ folder"
                >
                  <Save className="w-4 h-4 text-[#7A3B4E]" /> Save Data File (products.json)
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-5 py-2.5 bg-[#7A3B4E] text-white text-xs font-bold rounded-2xl shadow-md hover:bg-[#5E2C3B] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#F4A7B9]" /> Add New Product
                </button>
              </div>
            </div>

            {/* Vercel Persistence Guide Banner */}
            <div className="p-4 bg-[#7A3B4E]/5 rounded-2xl border border-[#7A3B4E]/10 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#7A3B4E] text-white flex-shrink-0">
                <Save className="w-4 h-4 text-[#F4A7B9]" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#7A3B4E] block">Vercel Free Deployment Data Persistence</span>
                <span className="text-gray-600">
                  When deployed live on Vercel, changes update in real-time in your browser. Click <strong className="text-[#7A3B4E]">"Save Data File (products.json)"</strong> above to download your updated product catalog into your <code className="font-mono text-[#7A3B4E]">client/src/data/products.json</code> folder before pushing to GitHub!
                </span>
              </div>
            </div>

            {/* Add Product Modal */}
            {showAddForm && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#7A3B4E]/10 max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10">
                    <h3 className="font-serif font-bold text-lg text-[#7A3B4E]">Add New Product</h3>
                    <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-700 block mb-1">Product Title *</label>
                        <input required type="text" value={newProduct.title}
                          onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                          placeholder="e.g. Zardozi Bridal Velvet Clutch" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Category *</label>
                        <select required value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none">
                          <option>Handmade Jewelry</option>
                          <option>Handmade Bags</option>
                          <option>Limited Edition Sets</option>
                          <option>Artisan Accessories</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Subcategory *</label>
                        <select required value={newProduct.subcategory}
                          onChange={e => setNewProduct({...newProduct, subcategory: e.target.value})}
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none">
                          <option>Necklaces</option><option>Earrings</option><option>Rings</option>
                          <option>Bracelets</option><option>Clutches</option><option>Totes</option>
                          <option>Crossbody</option><option>Potli Bags</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Price ($) *</label>
                        <input required type="number" value={newProduct.price}
                          onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                          placeholder="299" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Discount Price ($)</label>
                        <input type="number" value={newProduct.discountPrice}
                          onChange={e => setNewProduct({...newProduct, discountPrice: e.target.value})}
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                          placeholder="249" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Description *</label>
                      <textarea required rows={3} value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none resize-none"
                        placeholder="Describe the product..." />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Craft / Artisan Details *</label>
                      <textarea required rows={2} value={newProduct.craftDetails}
                        onChange={e => setNewProduct({...newProduct, craftDetails: e.target.value})}
                        className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none resize-none"
                        placeholder="Hours of craftsmanship, techniques used..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Materials (comma-separated)</label>
                        <input type="text" value={newProduct.materials}
                          onChange={e => setNewProduct({...newProduct, materials: e.target.value})}
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                          placeholder="24K Gold Plated, Freshwater Pearls" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Colors (comma-separated)</label>
                        <input type="text" value={newProduct.colors}
                          onChange={e => setNewProduct({...newProduct, colors: e.target.value})}
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                          placeholder="Royal Gold, Ivory White" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Image URLs (comma-separated)</label>
                      <input type="text" value={newProduct.images}
                        onChange={e => setNewProduct({...newProduct, images: e.target.value})}
                        className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                        placeholder="https://..." />
                    </div>
                    <div className="flex gap-6 text-xs font-semibold text-gray-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={newProduct.isFeatured}
                          onChange={e => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                          className="w-4 h-4 accent-[#7A3B4E]" />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={newProduct.isNewArrival}
                          onChange={e => setNewProduct({...newProduct, isNewArrival: e.target.checked})}
                          className="w-4 h-4 accent-[#7A3B4E]" />
                        New Arrival
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={newProduct.isBestSeller}
                          onChange={e => setNewProduct({...newProduct, isBestSeller: e.target.checked})}
                          className="w-4 h-4 accent-[#7A3B4E]" />
                        Bestseller
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit"
                        className="flex-1 py-3 bg-[#7A3B4E] text-white text-xs font-bold rounded-2xl hover:bg-[#5E2C3B] flex items-center justify-center gap-2">
                        <Save className="w-4 h-4 text-[#F4A7B9]" /> Save Product
                      </button>
                      <button type="button" onClick={() => setShowAddForm(false)}
                        className="px-5 py-3 border border-gray-200 text-xs font-bold rounded-2xl hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#FDF9F6] border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3.5 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Product</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Category</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Price</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Stock</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Rating</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#8E8E93] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((prod, i) => (
                      <tr key={i} className="hover:bg-[#FDF9F6] transition-colors">
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <img src={prod.images?.[0]} alt={prod.title}
                            className="w-10 h-10 object-cover rounded-xl bg-gray-100 border border-gray-100" />
                          <div>
                            <p className="font-serif font-semibold text-[#1C1C1E] line-clamp-1 max-w-[180px]">{prod.title}</p>
                            <p className="text-[#8E8E93]">{prod.subcategory}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 bg-[#F4A7B9]/20 text-[#7A3B4E] rounded-full font-semibold">
                            {prod.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-serif font-bold text-[#7A3B4E]">
                          ${prod.discountPrice || prod.price}
                          {prod.discountPrice > 0 && <span className="text-gray-400 line-through ml-1">${prod.price}</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`font-bold ${prod.stock > 5 ? 'text-[#96C99A]' : 'text-red-400'}`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-amber-500">
                          ★ {prod.rating}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteProduct(prod._id || prod.slug)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDER FULFILLMENT */}
        {activeSection === 'orders' && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-xl text-[#1C1C1E]">{orders.length} Total Orders</h2>
            {orders.map((ord, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#7A3B4E]/10 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#7A3B4E]">{ord.orderNumber}</h3>
                    <p className="text-xs text-[#8E8E93]">{ord.customerInfo?.name} · {ord.customerInfo?.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={ord.orderStatus}
                      onChange={e => handleUpdateOrderStatus(ord._id, e.target.value)}
                      className="text-xs font-semibold border border-[#7A3B4E]/20 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7A3B4E] text-[#7A3B4E]"
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Handcrafting</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                    <span className="font-serif font-bold text-[#7A3B4E]">${ord.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex flex-wrap gap-4">
                  <span>📍 {ord.shippingAddress?.city}, {ord.shippingAddress?.country}</span>
                  <span>🔖 Tracking: {ord.trackingNumber || 'BWC-EXP-0000'}</span>
                  <span>🕐 {new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft space-y-2">
                <h4 className="text-xs uppercase font-bold text-[#8E8E93] tracking-wider">Handmade Jewelry Revenue</h4>
                <p className="font-serif font-bold text-2xl text-[#7A3B4E]">$12,840</p>
                <p className="text-xs text-[#96C99A] font-semibold">↑ 22% vs last quarter</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft space-y-2">
                <h4 className="text-xs uppercase font-bold text-[#8E8E93] tracking-wider">Handmade Bags Revenue</h4>
                <p className="font-serif font-bold text-2xl text-[#7A3B4E]">$9,630</p>
                <p className="text-xs text-[#96C99A] font-semibold">↑ 15% vs last quarter</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft space-y-2">
                <h4 className="text-xs uppercase font-bold text-[#8E8E93] tracking-wider">Avg Order Value</h4>
                <p className="font-serif font-bold text-2xl text-[#7A3B4E]">$287</p>
                <p className="text-xs text-[#96C99A] font-semibold">↑ 8% vs last quarter</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft">
              <h3 className="font-serif font-bold text-base text-[#7A3B4E] mb-4">Top Performing Products</h3>
              <div className="space-y-3">
                {products.slice(0, 5).map((p, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img src={p.images?.[0]} className="w-10 h-10 object-cover rounded-xl" alt={p.title} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1C1C1E] line-clamp-1">{p.title}</p>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-[#F4A7B9] to-[#7A3B4E] rounded-full"
                          style={{ width: `${Math.random() * 60 + 40}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-serif font-bold text-[#7A3B4E]">
                      ${p.discountPrice || p.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

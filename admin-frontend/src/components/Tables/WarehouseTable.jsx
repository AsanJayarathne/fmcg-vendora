import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Pagination from '../Pagination';

const API = 'http://localhost/fmcg-vendora/backend/api/admin/warehouse-stock.php';
const UPLOADS_BASE = 'http://localhost/fmcg-vendora/backend/uploads/products/';

/* ─── Product Thumbnail ──────────────────────────────────── */
const ProductThumb = ({ imageUrl, name }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={`${UPLOADS_BASE}${imageUrl}`}
        alt={name}
        className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold font-sans">
      {initials}
    </div>
  );
};

/* ─── Skeleton Loader Rows ──────────────────────────────── */
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-6 py-4 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const WarehouseTable = () => {
  const { auth } = useAuth();
  
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* Filters State */
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  /* Update Stock State */
  const [editingItem, setEditingItem] = useState(null);
  const [updateQty, setUpdateQty] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [updateExpiry, setUpdateExpiry] = useState('');

  const fetchStock = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API, {
        headers: {
          'Authorization': `Bearer ${auth?.token}`
        }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to fetch warehouse stock');
      }
      setStockItems(json.data);
    } catch (err) {
      setError(err.message || 'Network error — could not reach the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchStock();
    }
  }, [auth]);

  const handleUpdateClick = (item) => {
    setEditingItem(item);
    setUpdateQty(item.quantity);
    setUpdateExpiry(item.expiry_date || '');
    setUpdateError('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (updateQty === '' || parseInt(updateQty) < 0) {
      setUpdateError('Please enter a valid stock quantity (>= 0).');
      return;
    }
    setUpdating(true);
    setUpdateError('');
    try {
      const res = await fetch(API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`
        },
        body: JSON.stringify({
          product_id: editingItem.product_id,
          quantity: parseInt(updateQty),
          expiry_date: updateExpiry || null
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update warehouse stock');
      }
      // Update local state dynamically
      setStockItems(prev => prev.map(item => 
        item.product_id === editingItem.product_id ? { ...item, quantity: parseInt(updateQty), expiry_date: updateExpiry || null } : item
      ));
      setEditingItem(null);
    } catch (err) {
      setUpdateError(err.message || 'Error occurred while updating stock');
    } finally {
      setUpdating(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Statuses');
    setCurrentPage(1);
  };

  // Determine categories dynamically from current stockItems
  const categoriesList = ['All Categories', ...new Set(stockItems.map(item => item.category_name))].sort();

  const getStatus = (qty) => {
    if (qty <= 0) return 'Out Of Stock';
    if (qty <= 50) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Low Stock': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Out Of Stock': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const formatPrice = val =>
    val != null ? `Rs. ${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—';

  const filteredItems = stockItems.filter(item => {
    const code = `PROD-${String(item.product_id).padStart(3, '0')}`;
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || item.category_name === selectedCategory;
    
    const status = getStatus(item.quantity);
    const matchesStatus = selectedStatus === 'All Statuses' || status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="w-full font-sans">
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by product or ID..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition text-sm text-slate-800 w-64 placeholder-slate-400"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
          
          <select 
            value={selectedCategory}
            onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm text-slate-700 font-semibold cursor-pointer"
          >
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select 
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm text-slate-700 font-semibold cursor-pointer"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out Of Stock">Out Of Stock</option>
          </select>
        </div>
        
        <button 
          onClick={handleResetFilters}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white font-bold text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-10.02l5.67-5.67"/>
          </svg>
          Reset Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-slate-900 font-bold border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-right">Base Price</th>
                <th className="py-4 px-6 text-right">MRP</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6">Expiry Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    No products found in warehouse stock.
                  </td>
                </tr>
              ) : (
                filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => {
                  const status = getStatus(item.quantity);
                  const code = `PROD-${String(item.product_id).padStart(3, '0')}`;
                  return (
                    <tr key={item.product_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <ProductThumb imageUrl={item.image_url} name={item.product_name} />
                          <div>
                            <div className="font-semibold text-slate-900 leading-tight">{item.product_name}</div>
                            <div className="text-xs text-slate-400 mt-1 font-mono font-medium">{code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-600">{item.category_name}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800 text-right">{formatPrice(item.base_price)}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800 text-right">{formatPrice(item.mrp_max_retail_price)}</td>
                      <td className="py-3.5 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="font-bold text-slate-900">{item.quantity} <span className="text-xs font-semibold text-slate-400">{item.unit || 'units'}</span></div>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 max-w-max rounded-full text-[10px] font-bold border ${getStatusColor(status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === 'In Stock' ? 'bg-emerald-500' : (status === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500')
                            }`} />
                            {status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-medium">{item.expiry_date ? item.expiry_date : '—'}</td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleUpdateClick(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 bg-white font-bold text-xs hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 5v14M5 12h14"/>
                            </svg>
                            Update Stock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          label="products"
        />
      </div>

      {/* Stock Update Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          {/* Panel */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-md font-bold text-slate-900">Update Stock</h3>
                <p className="text-xs text-slate-400 mt-0.5">{editingItem.product_name}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
              {updateError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl px-3 py-2">
                  {updateError}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stock</label>
                <div className="text-sm font-semibold text-slate-800 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                  {editingItem.quantity} {editingItem.unit || 'units'}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Stock Quantity</label>
                <input
                  type="number"
                  value={updateQty}
                  onChange={e => setUpdateQty(e.target.value)}
                  placeholder="e.g. 500"
                  min="0"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                <input
                  type="date"
                  value={updateExpiry}
                  onChange={e => setUpdateExpiry(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {updating ? 'Saving...' : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseTable;

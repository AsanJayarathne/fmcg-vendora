import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Pagination from '../Pagination';
import BatchDrillDownPanel from '../warehouse/BatchDrillDownPanel';

const API    = 'http://localhost/fmcg-vendora/backend/api/admin/warehouse-stock.php';
const UPLOADS = 'http://localhost/fmcg-vendora/backend/uploads/products/';

/* ─── Helpers ────────────────────────────────────────────── */
const ProductThumb = ({ imageUrl, name }) => {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  if (imageUrl) {
    return (
      <img
        src={`${UPLOADS}${imageUrl}`}
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

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-5 py-4 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const getStatus   = qty => qty <= 0 ? 'Out Of Stock' : qty <= 50 ? 'Low Stock' : 'In Stock';
const statusColor = s => ({
  'In Stock':    'text-emerald-700 bg-emerald-50 border-emerald-100',
  'Low Stock':   'text-amber-700   bg-amber-50   border-amber-100',
  'Out Of Stock':'text-rose-700    bg-rose-50    border-rose-100',
}[s] ?? 'text-slate-500 bg-slate-50 border-slate-200');
const statusDot   = s => ({
  'In Stock':    'bg-emerald-500',
  'Low Stock':   'bg-amber-500',
  'Out Of Stock':'bg-rose-500',
}[s] ?? 'bg-slate-400');
const fmt = val => val != null ? `Rs. ${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—';

/* ─── Component ──────────────────────────────────────────── */
const WarehouseTable = ({ onAddBatchClick, refreshKey }) => {
  const { auth } = useAuth();
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  // Filters
  const [search, setSearch]               = useState('');
  const [selectedCategory, setCategory]   = useState('All Categories');
  const [selectedStatus, setStatus]       = useState('All Statuses');
  const [currentPage, setCurrentPage]     = useState(1);
  const itemsPerPage = 10;

  // Edit batch modal state
  const [editingItem, setEditingItem]     = useState(null);
  const [updateQty, setUpdateQty]         = useState('');
  const [updateExpiry, setUpdateExpiry]   = useState('');
  const [updating, setUpdating]           = useState(false);
  const [updateError, setUpdateError]     = useState('');

  // Batch drill-down state
  const [drillProduct, setDrillProduct]   = useState(null);
  const [drillBatches, setDrillBatches]   = useState([]);
  const [drillLoading, setDrillLoading]   = useState(false);

  const fetchStock = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(API, { headers: { Authorization: `Bearer ${auth?.token}` } });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to fetch stock');
      setItems(json.data);
    } catch (err) {
      setError(err.message || 'Network error');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (auth?.token) fetchStock(); }, [auth?.token, refreshKey]);

  /* ── Aggregate per product from batch list ── */
  const aggregated = React.useMemo(() => {
    const map = {};
    items.forEach(b => {
      if (!map[b.product_id]) {
        map[b.product_id] = {
          product_id:         b.product_id,
          product_name:       b.product_name,
          category_name:      b.category_name,
          unit:               b.unit,
          image_url:          b.image_url,
          base_price:         b.base_price,
          mrp_max_retail_price: b.mrp_max_retail_price,
          quantity:           0,
          earliest_expiry:    null,
          batches:            [],
        };
      }
      if (b.status === 'Active') map[b.product_id].quantity += parseInt(b.quantity || 0);
      if (b.expiry_date) {
        if (!map[b.product_id].earliest_expiry || b.expiry_date < map[b.product_id].earliest_expiry)
          map[b.product_id].earliest_expiry = b.expiry_date;
      }
      map[b.product_id].batches.push(b);
    });
    return Object.values(map);
  }, [items]);

  const categories = ['All Categories', ...new Set(aggregated.map(i => i.category_name)).values()].sort();

  const filtered = aggregated.filter(item => {
    const code = `PROD-${String(item.product_id).padStart(3, '0')}`;
    const matchSearch = item.product_name.toLowerCase().includes(search.toLowerCase()) ||
                        code.toLowerCase().includes(search.toLowerCase());
    const matchCat    = selectedCategory === 'All Categories' || item.category_name === selectedCategory;
    const status      = getStatus(item.quantity);
    const matchStatus = selectedStatus   === 'All Statuses'   || status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* ── Update batch (PUT by batch_id) ── */
  const handleUpdateClick = (item) => {
    // We use the product's first active batch batch_id for editing
    const firstActive = item.batches.find(b => b.status === 'Active');
    if (!firstActive) { alert('No active batch found for this product.'); return; }
    setEditingItem({ ...item, batch_id: firstActive.batch_id, batch_qty: firstActive.quantity, batch_expiry: firstActive.expiry_date });
    setUpdateQty(firstActive.quantity);
    setUpdateExpiry(firstActive.expiry_date || '');
    setUpdateError('');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (updateQty === '' || parseInt(updateQty) < 0) { setUpdateError('Please enter a valid quantity (≥ 0).'); return; }
    setUpdating(true); setUpdateError('');
    try {
      const res = await fetch(`${API}?batch_id=${editingItem.batch_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({ quantity: parseInt(updateQty), expiry_date: updateExpiry || null }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to update batch');
      setEditingItem(null);
      fetchStock();
    } catch (err) {
      setUpdateError(err.message || 'Error updating batch');
    } finally { setUpdating(false); }
  };

  /* ── Drill-down ── */
  const handleViewBatches = async (item) => {
    setDrillProduct(item);
    setDrillBatches([]);
    setDrillLoading(true);
    try {
      const res  = await fetch(`${API}?product_id=${item.product_id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success) setDrillBatches(json.data || []);
    } catch { /* silent */ }
    finally { setDrillLoading(false); }
  };

  return (
    <div className="w-full font-sans">
      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm">{error}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text" value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search product or ID..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 w-60 placeholder-slate-400 transition"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <select value={selectedCategory} onChange={e => { setCategory(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-blue-400">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={selectedStatus} onChange={e => { setStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-semibold cursor-pointer focus:outline-none focus:border-blue-400">
            <option>All Statuses</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out Of Stock</option>
          </select>
          <button onClick={() => { setSearch(''); setCategory('All Categories'); setStatus('All Statuses'); setCurrentPage(1); }}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-10.02"/>
            </svg>
            Reset
          </button>
        </div>
        {/* Add Batch Button */}
        <button
          id="add-batch-btn"
          onClick={onAddBatchClick}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Batch
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-slate-900 font-bold border-b border-slate-200 bg-slate-50/50">
              <tr>
                <th className="py-4 px-5">Product</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5 text-right">Base Price</th>
                <th className="py-4 px-5 text-right">MRP</th>
                <th className="py-4 px-5">Stock Status</th>
                <th className="py-4 px-5">Nearest Expiry</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-14 text-center text-slate-400 font-medium">
                    No products found in warehouse stock.
                  </td>
                </tr>
              ) : (
                paginated.map(item => {
                  const status = getStatus(item.quantity);
                  const code   = `PROD-${String(item.product_id).padStart(3, '0')}`;
                  return (
                    <tr key={item.product_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <ProductThumb imageUrl={item.image_url} name={item.product_name} />
                          <div>
                            <div className="font-semibold text-slate-900 leading-tight">{item.product_name}</div>
                            <div className="text-xs text-slate-400 mt-0.5 font-mono font-medium">{code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-medium text-slate-600">{item.category_name}</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800 text-right">{fmt(item.base_price)}</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800 text-right">{fmt(item.mrp_max_retail_price)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex flex-col gap-1">
                          <div className="font-bold text-slate-900">
                            {item.quantity.toLocaleString()}
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 max-w-max rounded-full text-[10px] font-bold border ${statusColor(status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDot(status)}`} />
                            {status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 font-medium text-sm">
                        {item.earliest_expiry ? item.earliest_expiry : '—'}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewBatches(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-indigo-200 hover:border-indigo-300 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold text-xs transition active:scale-95 cursor-pointer"
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                            Batches
                          </button>
                          <button
                            onClick={() => handleUpdateClick(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs transition active:scale-95 cursor-pointer"
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
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
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          label="products"
        />
      </div>

      {/* ── Edit Batch Modal ── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-md font-bold text-slate-900">Edit Batch Stock</h3>
                <p className="text-xs text-slate-400 mt-0.5">{editingItem.product_name}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
              {updateError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl px-3 py-2">{updateError}</div>
              )}
              <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-500 border border-slate-100">
                <span className="font-semibold text-slate-700">Editing first active batch</span> — adjust for write-offs or corrections
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Qty</label>
                <div className="text-sm font-semibold text-slate-800 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                  {editingItem.batch_qty} {editingItem.unit || 'units'}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Qty</label>
                <input
                  type="number" value={updateQty} min="0"
                  onChange={e => setUpdateQty(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                <input
                  type="date" value={updateExpiry}
                  onChange={e => setUpdateExpiry(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition cursor-pointer"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={updating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer">
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Batch Drill-Down ── */}
      {drillProduct && (
        <BatchDrillDownPanel
          product={drillProduct}
          batches={drillBatches}
          loading={drillLoading}
          onClose={() => { setDrillProduct(null); setDrillBatches([]); }}
        />
      )}
    </div>
  );
};

export default WarehouseTable;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';

const API          = 'http://localhost/fmcg-vendora/backend/api/admin/products.php';
const UPLOADS_BASE = 'http://localhost/fmcg-vendora/backend/uploads/products/';

/* ─── Status Badge ───────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const styles =
    status === 'Active'
      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
      : 'bg-red-50 text-red-500 border-red-100';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
      {status}
    </span>
  );
};

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
    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
      {initials}
    </div>
  );
};

/* ─── Skeleton Row ───────────────────────────────────────── */
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-5 py-4 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

/* ─── Edit Button ────────────────────────────────────────── */
const EditBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title="Edit product"
    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors active:scale-95"
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
    Edit
  </button>
);

/* ─── Main Component ─────────────────────────────────────── */
const ProductTable = ({ refreshKey = 0, onEditProduct }) => {
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(API, {
      headers: { Authorization: `Bearer ${auth?.token}` },
    })
      .then(r => r.json())
      .then(r => {
        if (r.success) setProducts(r.data);
        else setError(r.message || 'Failed to load products');
      })
      .catch(() => setError('Network error — could not reach the server'))
      .finally(() => setLoading(false));
  }, [auth, refreshKey]);

  const formatPrice = val =>
    val != null ? `Rs. ${parseFloat(val).toFixed(2)}` : '—';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2.5 text-rose-700 text-sm bg-rose-50 border-b border-rose-100 px-5 py-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Image', 'Product', 'Category', 'Unit', 'Base Price', 'MRP', 'Status', 'Actions'].map(h => (
              <th
                key={h}
                className="bg-slate-50 text-slate-500 text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider border-b border-slate-200"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-sm">
                <div className="flex flex-col items-center gap-2">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  No products found. Add your first product using the button above.
                </div>
              </td>
            </tr>
          ) : (
            products.map((p, idx) => {
              const isLast = idx === products.length - 1;
              const border = isLast ? '' : 'border-b border-slate-100';
              return (
                <tr key={p.product_id} className="hover:bg-slate-50 transition-colors">
                  {/* Image */}
                  <td className={`px-5 py-3.5 ${border}`}>
                    <div className="relative">
                      <ProductThumb imageUrl={p.image_url} name={p.product_name} />
                      {p.image_url && (
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 items-center justify-center text-xs font-bold hidden">
                          {p.product_name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </td>
                  {/* Product Name + ID */}
                  <td className={`px-5 py-3.5 ${border}`}>
                    <p className="text-sm font-semibold text-slate-800">{p.product_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">#{p.product_id}</p>
                  </td>
                  {/* Category */}
                  <td className={`px-5 py-3.5 text-sm text-slate-600 ${border}`}>
                    {p.category_name}
                  </td>
                  {/* Unit */}
                  <td className={`px-5 py-3.5 text-sm text-slate-500 ${border}`}>
                    {p.unit || '—'}
                  </td>
                  {/* Base Price */}
                  <td className={`px-5 py-3.5 text-sm text-slate-700 font-medium ${border}`}>
                    {formatPrice(p.base_price)}
                  </td>
                  {/* MRP */}
                  <td className={`px-5 py-3.5 text-sm text-slate-500 ${border}`}>
                    {formatPrice(p.mrp_max_retail_price)}
                  </td>
                  {/* Status */}
                  <td className={`px-5 py-3.5 ${border}`}>
                    <StatusBadge status={p.status} />
                  </td>
                  {/* Actions */}
                  <td className={`px-5 py-3.5 ${border}`}>
                    <EditBtn onClick={() => onEditProduct && onEditProduct(p)} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;

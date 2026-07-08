import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';

const API = 'http://localhost/fmcg-vendora/backend/api/admin/products.php';

/* ─── Field Component ─────────────────────────────────────── */
const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  'bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400';

/* ─── Add Product Modal ───────────────────────────────────── */
const AddProductModal = ({ onClose, onProductAdded }) => {
  const { auth } = useAuth();

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  /* form state */
  const [form, setForm] = useState({
    product_name: '',
    category_id:  '',
    unit:         '',
    description:  '',
    base_price:   '',
    mrp:          '',
  });

  /* image preview */
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging]         = useState(false);
  const fileInputRef = useRef(null);

  /* fetch categories on mount */
  useEffect(() => {
    fetch(`${API}?action=categories`, {
      headers: { Authorization: `Bearer ${auth?.token}` },
    })
      .then(r => r.json())
      .then(r => { if (r.success) setCategories(r.data); })
      .catch(() => {});
  }, [auth]);

  /* handlers */
  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageFile = file => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2 MB.');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragging(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!form.product_name.trim() || !form.category_id) {
      setError('Product name and category are required.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);

      const res  = await fetch(API, {
        method:  'POST',
        headers: { Authorization: `Bearer ${auth?.token}` },
        body:    fd,
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'Failed to create product');
      onProductAdded(data.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Product</h2>
            <p className="text-xs text-slate-400 mt-0.5">Fill in the details below to add a product to the catalog</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Image Upload */}
          <Field label="Product Image">
            {imagePreview ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                  ${dragging
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="text-sm text-slate-500">
                  <span className="text-blue-500 font-semibold">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-slate-400">JPG, PNG, WEBP · Max 2 MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => handleImageFile(e.target.files[0])}
            />
          </Field>

          {/* Product Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Product Name" required>
              <input
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                placeholder="e.g. Coca-Cola 500ml"
                className={inputClass}
                required
              />
            </Field>
            <Field label="Category" required>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select category…</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Unit + Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Unit">
              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="e.g. 500ml, 1kg, 6-pack"
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short product description"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing (optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Base Price (Rs.)">
                <input
                  type="number"
                  name="base_price"
                  value={form.base_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </Field>
              <Field label="MRP (Rs.)">
                <input
                  type="number"
                  name="mrp"
                  value={form.mrp}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

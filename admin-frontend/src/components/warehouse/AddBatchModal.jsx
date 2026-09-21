import React, { useState, useEffect } from 'react';
import { X, Loader2, PackagePlus, Sparkles } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const API_BASE = 'http://localhost/fmcg-vendora/backend/api/admin';

const Field = ({ label, name, value, onChange, type = 'text', required = false, min, step, placeholder, hint }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {hint && (
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
          {hint}
        </span>
      )}
    </div>
    <input
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      required={required}
      min={min}
      step={step}
      placeholder={placeholder}
      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400 font-medium"
    />
  </div>
);

const AddBatchModal = ({ onClose, onBatchAdded }) => {
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pastPricing, setPastPricing] = useState(null);

  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
    cost_price: '',
    selling_price: '',
    mfg_date: '',
    expiry_date: '',
    received_at: new Date().toISOString().split('T')[0],
  });

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products.php`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const json = await res.json();
        if (json.success) setProducts(json.data || []);
      } catch {
        // silent
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [auth?.token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleProductChange = async (e) => {
    const pId = e.target.value;
    if (!pId) {
      setForm((prev) => ({ ...prev, product_id: '', cost_price: '', selling_price: '' }));
      setPastPricing(null);
      return;
    }

    const selected = products.find((p) => String(p.product_id) === String(pId));
    let initialCost = selected?.base_price ? String(Number(selected.base_price).toFixed(2)) : '';
    let initialSelling = selected?.mrp_max_retail_price
      ? String(Number(selected.mrp_max_retail_price).toFixed(2))
      : selected?.base_price
      ? String(Number(selected.base_price).toFixed(2))
      : '';

    setForm((prev) => ({
      ...prev,
      product_id: pId,
      cost_price: initialCost,
      selling_price: initialSelling,
    }));
    setPastPricing({
      cost_price: initialCost,
      selling_price: initialSelling,
      source: 'Catalog Pricing',
    });
    setError('');

    // Fetch previous batches for this product to suggest and auto-fill the latest batch's past price
    try {
      const res = await fetch(`${API_BASE}/warehouse-stock.php?product_id=${pId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const latestBatch = json.data[0];
        const lastCost = latestBatch.cost_price ? String(Number(latestBatch.cost_price).toFixed(2)) : initialCost;
        const lastSelling = latestBatch.selling_price ? String(Number(latestBatch.selling_price).toFixed(2)) : initialSelling;

        setForm((prev) => ({
          ...prev,
          cost_price: lastCost,
          selling_price: lastSelling,
        }));

        setPastPricing({
          cost_price: lastCost,
          selling_price: lastSelling,
          source: `Last Batch (${latestBatch.batch_number})`,
        });
      }
    } catch {
      // silent fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.product_id || !form.quantity || !form.cost_price || !form.selling_price) {
      setError('Product, quantity, cost price, and selling price are required.');
      return;
    }
    if (parseInt(form.quantity) <= 0) {
      setError('Quantity must be greater than 0.');
      return;
    }
    if (parseFloat(form.cost_price) <= 0 || parseFloat(form.selling_price) <= 0) {
      setError('Prices must be greater than 0.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/warehouse-stock.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({
          product_id: parseInt(form.product_id),
          quantity: parseInt(form.quantity),
          cost_price: parseFloat(form.cost_price),
          selling_price: parseFloat(form.selling_price),
          mfg_date: form.mfg_date || null,
          expiry_date: form.expiry_date || null,
          received_at: form.received_at || null,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to add batch');
      onBatchAdded(json.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans" onClick={onClose}>
      <div
        className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-6 overflow-y-auto no-scrollbar max-h-[90vh] border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <PackagePlus size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Warehouse Batch</h3>
              <p className="text-xs text-slate-400 mt-0.5">Record new goods received from manufacturer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Product <span className="text-rose-500">*</span>
            </label>
            {loadingProducts ? (
              <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            ) : (
              <select
                name="product_id"
                value={form.product_id}
                onChange={handleProductChange}
                required
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="">- Select a product -</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.product_name} ({p.category_name})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Quantity */}
          <Field
            label="Received Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            required
            min="1"
            placeholder="e.g. 500"
          />

          {/* Prices - side by side */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Cost Price (Rs.)"
              name="cost_price"
              value={form.cost_price}
              onChange={handleChange}
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="e.g. 85.00"
              hint={pastPricing?.cost_price ? `Past: Rs. ${pastPricing.cost_price}` : null}
            />
            <Field
              label="Selling Price (Rs.)"
              name="selling_price"
              value={form.selling_price}
              onChange={handleChange}
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="e.g. 100.00"
              hint={pastPricing?.selling_price ? `Past: Rs. ${pastPricing.selling_price}` : null}
            />
          </div>

          {/* Dates - three side by side */}
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Mfg Date"
              name="mfg_date"
              value={form.mfg_date}
              onChange={handleChange}
              type="date"
            />
            <Field
              label="Expiry Date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              type="date"
            />
            <Field
              label="Received At"
              name="received_at"
              value={form.received_at}
              onChange={handleChange}
              type="date"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving...
                </>
              ) : (
                'Add Batch'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBatchModal;

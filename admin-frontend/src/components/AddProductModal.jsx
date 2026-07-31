import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { X, PackagePlus, Upload, Trash2, Loader2, Save, Image, Plus } from "lucide-react";

const API = "http://localhost/fmcg-vendora/backend/api/admin/products.php";

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full border border-slate-200 focus:border-blue-500 rounded-full px-4 py-3 text-sm font-semibold outline-none bg-white text-slate-800 transition placeholder-slate-400 focus:ring-4 focus:ring-blue-500/10";

const selectClass =
  "w-full border border-slate-200 focus:border-blue-500 rounded-full px-4 py-3 text-sm font-semibold outline-none bg-white text-slate-800 transition cursor-pointer shadow-2xs focus:ring-4 focus:ring-blue-500/10";

export default function AddProductModal({ onClose, onProductAdded }) {
  const { auth } = useAuth();

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const [form, setForm] = useState({
    product_name: "",
    category_id:  "",
    unit:         "",
    description:  "",
    base_price:   "",
    mrp:          "",
  });

  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging]         = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${API}?action=categories`, {
      headers: { Authorization: `Bearer ${auth?.token}` },
    })
      .then((r) => r.json())
      .then((r) => { if (r.success) setCategories(r.data || []); })
      .catch(() => {});
  }, [auth]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageFile = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.product_name.trim() || !form.category_id) {
      setError("Product name and category are required.");
      return;
    }
    if (!form.base_price || parseFloat(form.base_price) <= 0) {
      setError("Please enter a valid base price.");
      return;
    }
    if (!form.mrp || parseFloat(form.mrp) <= 0) {
      setError("Please enter a valid MRP price.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("product_name", form.product_name.trim());
      fd.append("category_id",  form.category_id);
      fd.append("unit",         form.unit.trim());
      fd.append("description",  form.description.trim());
      fd.append("base_price",   form.base_price);
      fd.append("mrp",          form.mrp);
      if (imageFile) fd.append("image", imageFile);

      const res  = await fetch(API, {
        method:  "POST",
        headers: { Authorization: `Bearer ${auth?.token}` },
        body:    fd,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to add product");

      onProductAdded();
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto no-scrollbar border border-slate-100 transform transition-all scale-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <PackagePlus size={22} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-blue-600">New Product</span>
              <h2 className="text-xl font-black text-slate-800 leading-tight mt-0.5">Add Catalog Item</h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">Fill in details to register a new product</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
              ⚠️ {error}
            </div>
          )}

          {/* Product Image Uploader */}
          <Field label="Product Image">
            {imagePreview ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 group shadow-2xs">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload size={14} />
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  dragging
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/20"
                }`}
              >
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Image size={22} />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  <span className="text-blue-600 font-extrabold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs font-bold text-slate-400">JPG, PNG, WEBP • Max 2 MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleImageFile(e.target.files[0])}
            />
          </Field>

          {/* Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Product Name" required>
              <input
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                placeholder="e.g. Anchor Full Cream Milk Powder"
                className={inputClass}
                required
              />
            </Field>
            <Field label="Category" required>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className={selectClass}
                required
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Unit & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Unit / Size">
              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="e.g. 400g, 1L, 6-pack"
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

          {/* Pricing Section Card */}
          <div className="bg-slate-50/70 rounded-2xl p-5 space-y-3.5 border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing Configuration</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Base Price (LKR)" required>
                <input
                  type="number"
                  name="base_price"
                  value={form.base_price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="MRP Price (LKR)" required>
                <input
                  type="number"
                  name="mrp"
                  value={form.mrp}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  required
                />
              </Field>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Registering…
                </>
              ) : (
                <>
                  <Plus size={15} /> Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

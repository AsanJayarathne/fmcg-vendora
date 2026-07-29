import { useState } from "react";
import { X, Package, AlertCircle, CheckCircle2, AlertTriangle, Save, Loader2, Tag } from "lucide-react";

export default function ProductDetailModal({ product, onClose, onSavePrice }) {
  if (!product) return null;

  const [sellingPrice, setSellingPrice] = useState(Number(product.selling || product.selling_price || 0).toString());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case "In Stock":
        return {
          color: "text-green-600 bg-green-50 border-green-200/60",
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
        };
      case "Low Stock":
        return {
          color: "text-amber-600 bg-amber-50 border-amber-200/60",
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        };
      default:
        return {
          color: "text-red-600 bg-red-50 border-red-200/60",
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        };
    }
  };

  const statusConfig = getStatusConfig(product.status);

  // Profit calculation logic
  const profitMarginPercentage = (() => {
    const currentSelling = parseFloat(sellingPrice) || 0;
    const base = Number(product.base || product.base_price || 0);
    if (!base) return 0;
    return (((currentSelling - base) / base) * 100).toFixed(1);
  })();

  const handleSave = async () => {
    setSaveError("");
    const parsedPrice = parseFloat(sellingPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setSaveError("Please enter a valid positive price.");
      return;
    }

    const base = Number(product.base || product.base_price || 0);
    const mrp = Number(product.mrp || 0);
    if (parsedPrice < base || parsedPrice > mrp) {
      setSaveError(`Selling price must be between LKR ${base.toFixed(2)} (Base Price) and LKR ${mrp.toFixed(2)} (MRP).`);
      return;
    }

    setSaving(true);
    try {
      await onSavePrice(product, parsedPrice);
      onClose(); // Close modal on success
    } catch (err) {
      setSaveError(err.message || "Failed to update price. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden transform transition-all scale-100 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-black text-blue-600">Edit Price & Details</span>
              <h2 className="text-base font-extrabold text-slate-800 leading-tight mt-0.5">{product.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Status and Stock Badge */}
          <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white text-blue-600 border border-slate-100 shadow-2xs">
                <Package className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Available Stock</p>
                <p className="text-sm font-extrabold text-slate-800">{product.stock} units</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${statusConfig.color}`}>
              {statusConfig.icon}
              {product.status}
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Pricing Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Base Price</p>
                <div className="flex items-baseline gap-1 font-extrabold text-slate-700">
                  <span className="text-xs">LKR</span>
                  <span className="text-base">{Number(product.base || product.base_price || 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">MRP</p>
                <div className="flex items-baseline gap-1 font-extrabold text-slate-700">
                  <span className="text-xs">LKR</span>
                  <span className="text-base">{Number(product.mrp || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Editable Selling Price Field */}
            <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-2">
              <label className="block text-xs font-black text-blue-600 uppercase tracking-wider">
                My Selling Price (LKR)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-xs font-bold text-blue-500">LKR</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  disabled={saving}
                  className="block w-full pl-14 pr-4 py-2.5 text-base font-black text-blue-700 border border-blue-200 rounded-xl bg-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition disabled:opacity-50 shadow-2xs"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* General Details */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">General Information</h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white">
              <div className="flex justify-between px-4 py-3 text-xs">
                <span className="text-slate-500 font-bold">Product Code</span>
                <span className="text-slate-800 font-extrabold">{product.id}</span>
              </div>
              <div className="flex justify-between px-4 py-3 text-xs">
                <span className="text-slate-500 font-bold">Category</span>
                <span className="text-slate-800 font-bold">{product.category}</span>
              </div>
              <div className="flex justify-between px-4 py-3 text-xs">
                <span className="text-slate-500 font-bold">Measurement Unit</span>
                <span className="text-slate-800 font-bold">{product.unit || "N/A"}</span>
              </div>
              <div className="flex justify-between px-4 py-3 text-xs">
                <span className="text-slate-500 font-bold">Calculated Profit Margin</span>
                <span className={`font-black ${parseFloat(profitMarginPercentage) >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {profitMarginPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {product.description && (
            <div className="space-y-2 bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Product Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">{product.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Price
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

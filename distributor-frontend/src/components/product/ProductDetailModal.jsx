import React, { useState } from "react";
import { X, Package, AlertCircle, CheckCircle2, AlertTriangle, Save, Loader2 } from "lucide-react";

export default function ProductDetailModal({ product, onClose, onSavePrice }) {
  if (!product) return null;

  const [sellingPrice, setSellingPrice] = useState(Number(product.selling || 0).toString());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Status-specific configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case "In Stock":
        return {
          color: "text-green-600 bg-green-50 border-green-200",
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
        };
      case "Low Stock":
        return {
          color: "text-orange-500 bg-orange-50 border-orange-200",
          icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
        };
      default:
        return {
          color: "text-red-600 bg-red-50 border-red-200",
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        };
    }
  };

  const statusConfig = getStatusConfig(product.status);

  // Profit calculation logic
  const profitMarginPercentage = (() => {
    const currentSelling = parseFloat(sellingPrice) || 0;
    const base = Number(product.base || 0);
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

    const base = Number(product.base || 0);
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden transform transition-all scale-100 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600">Edit Price & Details</span>
            <h2 className="text-lg font-bold text-slate-800 leading-tight mt-0.5">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {saveError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Status and Stock Badge */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Package className="w-5 h-5" />
              </span>
              <div>
                <p className="text-xs text-slate-400">Available Stock</p>
                <p className="text-sm font-bold text-slate-800">{product.stock} units</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusConfig.color}`}>
              {statusConfig.icon}
              {product.status}
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pricing Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 font-semibold mb-1">Base Price</p>
                <div className="flex items-baseline gap-0.5 font-bold text-slate-700">
                  <span className="text-xs">LKR</span>
                  <span className="text-base">{Number(product.base).toFixed(2)}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] text-slate-400 font-semibold mb-1">MRP</p>
                <div className="flex items-baseline gap-0.5 font-bold text-slate-700">
                  <span className="text-xs">LKR</span>
                  <span className="text-base">{Number(product.mrp).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Editable Selling Price Field */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider">
                My Selling Price (LKR)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-sm font-semibold text-blue-500">LKR</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  disabled={saving}
                  className="block w-full pl-12 pr-3 py-2 text-base font-bold text-blue-700 border border-blue-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* General Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">General Information</h3>
            <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-white">
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-500 font-medium">Product Code</span>
                <span className="text-slate-800 font-bold">{product.id}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-500 font-medium">Category</span>
                <span className="text-slate-800 font-semibold">Category {product.category}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-500 font-medium">Measurement Unit</span>
                <span className="text-slate-800 font-semibold">{product.unit || "N/A"}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-500 font-medium">Calculated Profit Margin</span>
                <span className={`font-bold ${parseFloat(profitMarginPercentage) >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {profitMarginPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {product.description && (
            <div className="space-y-2 bg-slate-50/75 border border-slate-100 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Product Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{product.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
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

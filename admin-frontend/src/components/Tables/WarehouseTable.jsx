import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import Pagination from "../Pagination";
import BatchDrillDownPanel from "../warehouse/BatchDrillDownPanel";
import { Search, RotateCcw, Plus, Layers, Edit2, X, Loader2 } from "lucide-react";

const API     = "http://localhost/fmcg-vendora/backend/api/admin/warehouse-stock.php";
const UPLOADS = "http://localhost/fmcg-vendora/backend/uploads/products/";

const ProductThumb = ({ imageUrl, name }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={`${UPLOADS}${imageUrl}`}
        alt={name}
        className="w-10 h-10 rounded-2xl object-cover border border-slate-100 shrink-0"
        onError={(e) => {
          e.target.style.display = "none";
          if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
        }}
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
      {initials}
    </div>
  );
};

const getStatus = (qty) => (qty <= 0 ? "Out Of Stock" : qty <= 50 ? "Low Stock" : "In Stock");

const StatusBadge = ({ status }) => {
  const isGood = status === "In Stock";
  const isLow  = status === "Low Stock";
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isGood
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
          : isLow
          ? "bg-amber-50 text-amber-700 border border-amber-200/50"
          : "bg-rose-50 text-rose-700 border border-rose-200/50"
      }`}
    >
      {status}
    </span>
  );
};

export default function WarehouseTable({ onAddBatchClick, refreshKey }) {
  const { auth } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Filters
  const [search, setSearch]             = useState("");
  const [selectedCategory, setCategory] = useState("All Categories");
  const [selectedStatus, setStatus]     = useState("All Statuses");
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 10;

  // Edit batch modal state
  const [editingItem, setEditingItem]   = useState(null);
  const [updateQty, setUpdateQty]       = useState("");
  const [updateExpiry, setUpdateExpiry] = useState("");
  const [updating, setUpdating]         = useState(false);
  const [updateError, setUpdateError]   = useState("");

  // Batch drill-down state
  const [drillProduct, setDrillProduct] = useState(null);
  const [drillBatches, setDrillBatches] = useState([]);
  const [drillLoading, setDrillLoading] = useState(false);

  const fetchStock = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(API, { headers: { Authorization: `Bearer ${auth?.token}` } });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch stock");
      setItems(json.data || []);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) fetchStock();
  }, [auth?.token, refreshKey]);

  // Aggregate per product from batch list
  const aggregated = React.useMemo(() => {
    const map = {};
    items.forEach((b) => {
      if (!map[b.product_id]) {
        map[b.product_id] = {
          product_id:           b.product_id,
          product_name:         b.product_name,
          category_name:        b.category_name,
          unit:                 b.unit,
          image_url:            b.image_url,
          base_price:           b.base_price,
          mrp_max_retail_price: b.mrp_max_retail_price,
          quantity:             0,
          earliest_expiry:      null,
          batches:              [],
        };
      }
      if (b.status === "Active") map[b.product_id].quantity += parseInt(b.quantity || 0);
      if (b.expiry_date) {
        if (!map[b.product_id].earliest_expiry || b.expiry_date < map[b.product_id].earliest_expiry)
          map[b.product_id].earliest_expiry = b.expiry_date;
      }
      map[b.product_id].batches.push(b);
    });
    return Object.values(map);
  }, [items]);

  const categories = React.useMemo(() => {
    const list = aggregated.map((i) => i.category_name).filter(Boolean);
    return ["All Categories", ...new Set(list)].sort();
  }, [aggregated]);

  const filtered = React.useMemo(() => {
    return aggregated.filter((item) => {
      const code = `PRD-${String(item.product_id).padStart(3, "0")}`;
      const matchSearch =
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        code.toLowerCase().includes(search.toLowerCase());
      const matchCat    = selectedCategory === "All Categories" || item.category_name === selectedCategory;
      const status      = getStatus(item.quantity);
      const matchStatus = selectedStatus === "All Statuses" || status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [aggregated, search, selectedCategory, selectedStatus]);

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateClick = (item) => {
    const firstActive = item.batches.find((b) => b.status === "Active");
    if (!firstActive) {
      alert("No active batch found for this product.");
      return;
    }
    setEditingItem({ ...item, batch_id: firstActive.batch_id, batch_qty: firstActive.quantity, batch_expiry: firstActive.expiry_date });
    setUpdateQty(firstActive.quantity);
    setUpdateExpiry(firstActive.expiry_date || "");
    setUpdateError("");
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (updateQty === "" || parseInt(updateQty) < 0) {
      setUpdateError("Please enter a valid quantity (≥ 0).");
      return;
    }
    setUpdating(true);
    setUpdateError("");
    try {
      const res = await fetch(`${API}?batch_id=${editingItem.batch_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({ quantity: parseInt(updateQty), expiry_date: updateExpiry || null }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to update batch");
      setEditingItem(null);
      fetchStock();
    } catch (err) {
      setUpdateError(err.message || "Error updating batch");
    } finally {
      setUpdating(false);
    }
  };

  const handleViewBatches = async (item) => {
    setDrillProduct(item);
    setDrillBatches([]);
    setDrillLoading(true);
    try {
      const res = await fetch(`${API}?product_id=${item.product_id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success) setDrillBatches(json.data || []);
    } catch { /* silent */ }
    finally {
      setDrillLoading(false);
    }
  };

  const fmt = (val) =>
    val != null
      ? `LKR ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "—";

  return (
    <div className="space-y-4 font-sans">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search product or ID..."
              className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-slate-200 focus:border-blue-500 rounded-full px-4 py-3 text-xs font-bold outline-none bg-white text-slate-700 transition shadow-2xs cursor-pointer focus:ring-4 focus:ring-blue-500/10"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-slate-200 focus:border-blue-500 rounded-full px-4 py-3 text-xs font-bold outline-none bg-white text-slate-700 transition shadow-2xs cursor-pointer focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out Of Stock">Out Of Stock</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSearch("");
              setCategory("All Categories");
              setStatus("All Statuses");
              setCurrentPage(1);
            }}
            className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition cursor-pointer shadow-2xs shrink-0"
            title="Reset Filters"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Add Batch Button */}
        <button
          id="add-batch-btn"
          onClick={onAddBatchClick}
          className="px-6 py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Plus size={16} />
          Add Batch
        </button>
      </div>

      {/* Stock Table */}
      <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Base Price</th>
                <th className="px-6 py-4 text-right">MRP</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4">Nearest Expiry</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-4">
                      <div className="h-6 bg-slate-100 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                    <p className="text-4xl mb-2">📦</p>
                    <p className="font-bold text-slate-800 text-sm">No warehouse stock records found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const status = getStatus(item.quantity);
                  const code   = `PRD-${String(item.product_id).padStart(3, "0")}`;
                  return (
                    <tr key={item.product_id} className="hover:bg-slate-50/60 transition duration-150">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <ProductThumb imageUrl={item.image_url} name={item.product_name} />
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{item.product_name}</p>
                            <p className="text-[10px] font-bold text-blue-600 mt-0.5">{code}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 font-bold text-slate-600">
                        {item.category_name}
                      </td>

                      <td className="px-6 py-3.5 text-right font-bold text-slate-900 text-sm">
                        {fmt(item.base_price)}
                      </td>

                      <td className="px-6 py-3.5 text-right font-semibold text-slate-500">
                        {fmt(item.mrp_max_retail_price)}
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-900 text-xs">
                            {item.quantity.toLocaleString()} units
                          </span>
                          <div>
                            <StatusBadge status={status} />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-3.5 font-medium text-slate-500">
                        {item.earliest_expiry ? (
                          <span className="font-semibold text-slate-700">{item.earliest_expiry}</span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewBatches(item)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <Layers size={13} />
                            Batches
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateClick(item)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <Edit2 size={13} />
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

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            label="products"
          />
        )}
      </div>

      {/* Edit Batch Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-6 overflow-hidden border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Stock Adjustment</span>
                <h3 className="text-base font-bold text-slate-800 leading-tight mt-0.5">Edit Batch Stock</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{editingItem.product_name}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
              {updateError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
                  ⚠️ {updateError}
                </div>
              )}

              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3 text-xs text-slate-500 font-medium">
                Adjusting first active batch stock level.
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Qty</label>
                <div className="text-xs font-bold text-slate-800 bg-slate-50 rounded-full px-4 py-2.5 border border-slate-100">
                  {editingItem.batch_qty} {editingItem.unit || "units"}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Quantity</label>
                <input
                  type="number"
                  value={updateQty}
                  min="0"
                  onChange={(e) => setUpdateQty(e.target.value)}
                  className="w-full border border-slate-200 focus:border-blue-500 rounded-full px-4 py-2.5 text-xs font-bold outline-none bg-white text-slate-800 transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</label>
                <input
                  type="date"
                  value={updateExpiry}
                  onChange={(e) => setUpdateExpiry(e.target.value)}
                  className="w-full border border-slate-200 focus:border-blue-500 rounded-full px-4 py-2.5 text-xs font-bold outline-none bg-white text-slate-800 transition cursor-pointer"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  {updating ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Drill-Down */}
      {drillProduct && (
        <BatchDrillDownPanel
          product={drillProduct}
          batches={drillBatches}
          loading={drillLoading}
          onClose={() => {
            setDrillProduct(null);
            setDrillBatches([]);
          }}
        />
      )}
    </div>
  );
}

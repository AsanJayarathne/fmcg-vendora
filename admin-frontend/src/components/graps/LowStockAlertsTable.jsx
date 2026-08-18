import React from "react";
import { AlertTriangle, ChevronRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LowStockAlertsTable = ({ stockItems = [], loading = false }) => {
  const navigate = useNavigate();

  // Filter low stock items (quantity <= 50) and sort by lowest stock first
  const alertItems = (stockItems || [])
    .filter((item) => parseInt(item.quantity || 0) <= 50)
    .sort((a, b) => parseInt(a.quantity || 0) - parseInt(b.quantity || 0))
    .slice(0, 5);

  const getStatus = (qty) => {
    const q = parseInt(qty || 0);
    if (q <= 0) return { label: "Out of Stock", color: "text-rose-600 bg-rose-50 border-rose-200/60" };
    if (q <= 20) return { label: "Critical", color: "text-amber-600 bg-amber-50 border-amber-200/60" };
    return { label: "Low", color: "text-amber-600 bg-amber-50 border-amber-200/60" };
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 leading-tight">Low Stock Alerts</h2>
              <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                {alertItems.length} {alertItems.length === 1 ? "Alert" : "Alerts"}
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">Inventory items needing reorder</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/warehouse")}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          See All <ChevronRight size={14} />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-2xs bg-white">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 text-right">Current</th>
                <th className="px-4 py-3 text-right">Min Stock</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs font-semibold text-slate-400">
                    <div className="animate-pulse flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 animate-spin" />
                      Loading low stock alerts...
                    </div>
                  </td>
                </tr>
              ) : alertItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs font-semibold text-slate-400">
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle2 size={24} className="text-emerald-500" />
                      <span className="text-slate-700 font-bold">All products are well-stocked!</span>
                      <span className="text-[11px] text-slate-400">No warehouse stock alerts at this time.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                alertItems.map((item, index) => {
                  const qty = parseInt(item.quantity || 0);
                  const st = getStatus(qty);
                  return (
                    <tr key={index} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="px-4 py-3 font-bold text-slate-800 max-w-[200px] truncate">
                        <div className="flex flex-col">
                          <span className="truncate">{item.product_name}</span>
                          {item.category_name && (
                            <span className="text-[10px] font-medium text-slate-400">{item.category_name}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${qty === 0 ? "text-rose-600" : "text-amber-600"}`}>
                          {qty} {item.unit || "units"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-500">
                        50 {item.unit || "units"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => navigate("/warehouse")}
                          className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition cursor-pointer shadow-2xs"
                        >
                          Reorder
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlertsTable;


import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, AlertTriangle, Truck } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const API_BASE = "http://localhost/fmcg-vendora/backend/api/admin";

const ApproveRequestModal = ({ request, onClose, onApproved }) => {
  const { auth } = useAuth();
  const [warehouseStock, setWarehouseStock] = useState({});
  const [loadingStock, setLoadingStock]     = useState(true);
  const [approvals, setApprovals]           = useState({});
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError]                   = useState("");

  useEffect(() => {
    if (!request?.items) return;
    const initial = {};
    request.items.forEach((item) => {
      initial[item.request_item_id] = item.requested_qty;
    });
    setApprovals(initial);

    const fetchStocks = async () => {
      setLoadingStock(true);
      try {
        const res  = await fetch(`${API_BASE}/warehouse-stock.php`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const json = await res.json();
        if (json.success) {
          const stockMap = {};
          (json.data || []).forEach((b) => {
            if (b.status === "Active") {
              stockMap[b.product_id] = (stockMap[b.product_id] || 0) + parseInt(b.quantity || 0);
            }
          });
          setWarehouseStock(stockMap);
        }
      } catch { /* silent */ }
      finally {
        setLoadingStock(false);
      }
    };
    fetchStocks();
  }, [request, auth?.token]);

  const handleQtyChange = (requestItemId, value) => {
    setApprovals((prev) => ({ ...prev, [requestItemId]: Math.max(0, parseInt(value) || 0) }));
    setError("");
  };

  const handleSubmit = async () => {
    for (const item of request?.items || []) {
      const approved  = approvals[item.request_item_id] || 0;
      const available = warehouseStock[item.product_id] || 0;
      if (approved > available) {
        setError(`Approved qty for "${item.product_name}" (${approved}) exceeds available warehouse stock (${available}).`);
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      const itemsPayload = (request?.items || []).map((item) => ({
        request_item_id: item.request_item_id,
        approved_qty:    approvals[item.request_item_id] ?? 0,
      }));

      const res = await fetch(`${API_BASE}/supply-requests.php?id=${request.request_id}&action=approve`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth?.token}` },
        body:    JSON.stringify({ approvals: itemsPayload, items: itemsPayload }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to approve request");

      onApproved(json.data);
    } catch (err) {
      setError(err.message || "Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!request) return null;
  const reqCode = `REQ-${String(request.request_id).padStart(3, "0")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-100 transform transition-all scale-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle size={22} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">Stock Transfer Approval</span>
              <h2 className="text-xl font-black text-slate-800 leading-tight mt-0.5">Approve Supply Request</h2>
              <p className="text-sm font-bold text-slate-600 mt-1">
                {request.distributor_name} <span className="font-bold text-blue-600 ml-1">({reqCode})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
              ⚠️ {error}
            </div>
          )}

          {/* Transfer Info */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-slate-800 text-sm">{request.distributor_name}</p>
              <p className="text-slate-400 font-semibold mt-0.5">Region: {request.region_name || "—"}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Request Date</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{request.request_date || "—"}</p>
            </div>
          </div>

          {/* Item Allocation Table */}
          <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-2xs bg-white">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Requested Product</th>
                  <th className="px-4 py-3 text-right">Requested</th>
                  <th className="px-4 py-3 text-right">Warehouse Stock</th>
                  <th className="px-4 py-3 text-right">Approved Qty</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loadingStock ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-slate-400 font-semibold">
                      Loading available stock levels...
                    </td>
                  </tr>
                ) : (
                  (request?.items || []).map((item) => {
                    const available = warehouseStock[item.product_id] ?? 0;
                    const approved  = approvals[item.request_item_id] ?? 0;
                    const isExceeded = approved > available;

                    return (
                      <tr key={item.request_item_id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800 text-xs">{item.product_name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{item.unit || "units"}</p>
                        </td>

                        <td className="px-4 py-3 text-right font-bold text-slate-700">
                          {item.requested_qty}
                        </td>

                        <td className="px-4 py-3 text-right font-bold">
                          <span className={available < item.requested_qty ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
                            {available} units
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            min="0"
                            max={available}
                            value={approved}
                            onChange={(e) => handleQtyChange(item.request_item_id, e.target.value)}
                            className={`w-28 text-right border ${
                              isExceeded ? "border-rose-500 focus:ring-rose-500/10" : "border-slate-200 focus:border-blue-500"
                            } rounded-full px-3 py-2 text-xs font-bold outline-none bg-white text-slate-800 transition shadow-2xs`}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Actions */}
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
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-7 py-3 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Transferring...
                </>
              ) : (
                <>
                  <CheckCircle size={15} /> Confirm &amp; Transfer Stock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveRequestModal;

import { useState } from "react";
import { X, Loader2, PackageCheck } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

const ReceiveStockModal = ({ request, onClose, onReceived }) => {
  const { auth }      = useAuth();
  const navigate      = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState(false);

  if (!request) return null;

  const reqCode = `REQ-${String(request.request_id).padStart(3, "0")}`;

  const handleConfirm = async () => {
    setSubmitting(true); setError("");
    try {
      const res = await fetch(
        `${API_BASE}/distributor/supply-requests.php?id=${request.request_id}&action=receive`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
          body: JSON.stringify({}),
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to confirm receipt");
      onReceived(json.data);
      setSuccess(true);
      // Signal MyInventoryPage to refresh, then navigate after a short delay
      localStorage.setItem('inventory_needs_refresh', '1');
      setTimeout(() => {
        onClose();
        navigate('/my-inventory');
      }, 1200);
    } catch (err) {
      setError(err.message || "Network error occurred.");
    } finally { setSubmitting(false); }
  };

  const approvedItems = (request.items || []).filter(i => (i.approved_qty ?? 0) > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <PackageCheck size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Receipt</h3>
              <p className="text-xs text-slate-400 mt-0.5">{reqCode}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <PackageCheck size={28} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Stock Receipt Confirmed!</h4>
              <p className="text-xs text-slate-500 mt-1">Your inventory has been updated. Redirecting...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">{error}</div>
            )}

            <p className="text-sm text-slate-600 mb-4">
              Please confirm that you have physically received the following stock for <strong>{reqCode}</strong>. This will notify the admin.
            </p>

            {/* Items summary */}
            {approvedItems.length > 0 && (
              <div className="mb-5 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                      <th className="px-4 py-2.5 text-right font-semibold text-slate-500 uppercase tracking-wide">Approved Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approvedItems.map(item => (
                      <tr key={item.request_item_id}>
                        <td className="px-4 py-2.5 font-medium text-slate-800">{item.product_name}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-emerald-700">
                          {item.approved_qty} <span className="font-normal text-slate-400">{item.unit || "units"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer">
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition cursor-pointer">
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Confirming...</> : "Confirm Receipt"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReceiveStockModal;

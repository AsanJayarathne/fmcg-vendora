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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-6 overflow-hidden border border-slate-100 transform transition-all scale-100 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <PackageCheck size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">Stock Transfer</span>
              <h3 className="text-base font-bold text-slate-800 leading-tight mt-0.5">Confirm Receipt</h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{reqCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
            <div className="p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <PackageCheck size={32} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">Stock Receipt Confirmed!</h4>
              <p className="text-xs font-semibold text-slate-400 mt-1">Your inventory has been updated. Redirecting to My Inventory...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">⚠️ {error}</div>
            )}

            <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed">
              Please confirm that you have physically received the following stock items for <strong>{reqCode}</strong>:
            </p>

            {/* Items summary */}
            {approvedItems.length > 0 && (
              <div className="mb-5 border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Product</th>
                      <th className="px-4 py-2.5 text-right">Approved Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approvedItems.map(item => (
                      <tr key={item.request_item_id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="px-4 py-2.5 font-bold text-slate-800">{item.product_name}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-emerald-600">
                          {item.approved_qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
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

import React, { useState } from "react";
import { X, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const API_BASE = "http://localhost/fmcg-vendora/backend/api/admin";

const RejectRequestModal = ({ request, onClose, onRejected }) => {
  const { auth } = useAuth();
  const [remarks, setRemarks]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  if (!request) return null;
  const reqCode = `REQ-${String(request.request_id).padStart(3, "0")}`;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/supply-requests.php?id=${request.request_id}&action=reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({ remarks }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to reject request");
      onRejected(request.request_id);
      onClose();
    } catch (err) {
      setError(err.message || "Network error occurred.");
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
        className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md p-6 border border-slate-100 transform transition-all scale-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <XCircle size={22} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-rose-600">Request Rejection</span>
              <h3 className="text-xl font-black text-slate-800 leading-tight mt-0.5">Reject Supply Request</h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {reqCode} — {request.distributor_name}
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

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl text-xs text-slate-600 font-medium">
            Rejecting this request will notify the distributor that stock cannot be fulfilled at this time.
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rejection Remarks / Reason</label>
            <textarea
              rows="3"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Out of stock, insufficient inventory..."
              className="w-full border border-slate-200 focus:border-blue-500 rounded-2xl p-4 text-xs font-semibold outline-none bg-white text-slate-800 transition placeholder-slate-400 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Rejecting...
                </>
              ) : (
                <>
                  <XCircle size={14} /> Confirm Rejection
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectRequestModal;

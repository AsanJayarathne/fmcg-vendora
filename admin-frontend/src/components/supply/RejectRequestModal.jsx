import React, { useState } from 'react';
import { X, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const API_BASE = 'http://localhost/fmcg-vendora/backend/api/admin';

const RejectRequestModal = ({ request, onClose, onRejected }) => {
  const { auth } = useAuth();
  const [remarks, setRemarks]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');

  if (!request) return null;

  const reqCode = `REQ-${String(request.request_id).padStart(3, '0')}`;

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/supply-requests.php?id=${request.request_id}&action=reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({ remarks }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to reject request');
      onRejected(request.request_id);
      onClose();
    } catch (err) {
      setError(err.message || 'Network error occurred.');
    } finally { setSubmitting(false); }
  };

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
            <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <XCircle size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reject Request</h3>
              <p className="text-xs text-slate-400 mt-0.5">{reqCode} — {request.distributor_name}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">{error}</div>
        )}

        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to reject <strong>{reqCode}</strong>? The distributor will be notified with your reason.
        </p>

        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rejection Reason (optional)</label>
          <textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={3}
            placeholder="e.g. Insufficient warehouse stock for this period..."
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition resize-none placeholder-slate-400"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2 transition cursor-pointer">
            {submitting ? <><Loader2 size={14} className="animate-spin" /> Rejecting...</> : 'Reject Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectRequestModal;

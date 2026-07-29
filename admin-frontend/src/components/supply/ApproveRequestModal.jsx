import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const API_BASE = 'http://localhost/fmcg-vendora/backend/api/admin';

const ApproveRequestModal = ({ request, onClose, onApproved }) => {
  const { auth } = useAuth();
  const [warehouseStock, setWarehouseStock] = useState({});
  const [loadingStock, setLoadingStock]     = useState(true);
  const [approvals, setApprovals]           = useState({});
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError]                   = useState('');

  // Build initial approvals map and fetch warehouse stock per product
  useEffect(() => {
    if (!request?.items) return;
    const initial = {};
    request.items.forEach(item => {
      initial[item.request_item_id] = item.requested_qty;
    });
    setApprovals(initial);

    // Fetch warehouse totals for each product
    const fetchStocks = async () => {
      setLoadingStock(true);
      try {
        const res  = await fetch(`${API_BASE}/warehouse-stock.php`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        const json = await res.json();
        if (json.success) {
          // Aggregate active qty per product_id from batch list
          const stockMap = {};
          (json.data || []).forEach(b => {
            if (b.status === 'Active') {
              stockMap[b.product_id] = (stockMap[b.product_id] || 0) + parseInt(b.quantity || 0);
            }
          });
          setWarehouseStock(stockMap);
        }
      } catch { /* silent */ }
      finally { setLoadingStock(false); }
    };
    fetchStocks();
  }, [request, auth?.token]);

  const handleQtyChange = (requestItemId, value) => {
    setApprovals(prev => ({ ...prev, [requestItemId]: Math.max(0, parseInt(value) || 0) }));
    setError('');
  };

  const handleSubmit = async () => {
    // Validate: approved qty must not exceed warehouse stock
    for (const item of (request?.items || [])) {
      const approved  = approvals[item.request_item_id] || 0;
      const available = warehouseStock[item.product_id] || 0;
      if (approved > available) {
        setError(`Approved qty for "${item.product_name}" (${approved}) exceeds available warehouse stock (${available}).`);
        return;
      }
    }

    const payload = Object.entries(approvals).map(([request_item_id, approved_qty]) => ({
      request_item_id: parseInt(request_item_id),
      approved_qty,
    })).filter(a => a.approved_qty > 0);

    if (payload.length === 0) {
      setError('Please approve at least one item with a quantity > 0.');
      return;
    }

    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/supply-requests.php?id=${request.request_id}&action=approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({ approvals: payload }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to approve request');
      onApproved(json.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Network error occurred.');
    } finally { setSubmitting(false); }
  };

  if (!request) return null;

  const reqCode = `REQ-${String(request.request_id).padStart(3, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Approve Supply Request</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {reqCode} — {request.distributor_name}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
            Set the <strong>approved quantity</strong> for each item. Quantities must not exceed available warehouse stock.
            Items set to <strong>0</strong> will be skipped.
          </p>

          <div className="space-y-3">
            {(request.items || []).map(item => {
              const available = warehouseStock[item.product_id] ?? null;
              const approved  = approvals[item.request_item_id] || 0;
              const isOver    = available !== null && approved > available;

              return (
                <div key={item.request_item_id}
                  className={`border rounded-xl p-4 ${isOver ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-sm">{item.product_name}</div>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span>Requested: <strong className="text-slate-700">{item.requested_qty} {item.unit || 'units'}</strong></span>
                        {loadingStock ? (
                          <span className="animate-pulse bg-slate-200 rounded w-20 h-4 inline-block" />
                        ) : (
                          <span className={available !== null && available < item.requested_qty ? 'text-amber-600 font-semibold' : ''}>
                            Available: <strong className={isOver ? 'text-rose-600' : 'text-emerald-600'}>
                              {available !== null ? available.toLocaleString() : '—'} {item.unit || 'units'}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end flex-shrink-0">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Approve Qty</label>
                      <input
                        type="number"
                        value={approved}
                        min="0"
                        max={available ?? undefined}
                        onChange={e => handleQtyChange(item.request_item_id, e.target.value)}
                        className={`w-28 text-right border rounded-lg px-2.5 py-1.5 text-sm font-semibold outline-none transition
                          ${isOver
                            ? 'border-rose-300 bg-rose-50 text-rose-700 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                          }`}
                      />
                      {isOver && (
                        <span className="text-[10px] text-rose-600 font-semibold">Exceeds stock</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <div className="text-xs text-slate-400">
            {request.items?.length} product{request.items?.length !== 1 ? 's' : ''} requested
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition cursor-pointer">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Approving...</> : 'Approve & Transfer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveRequestModal;

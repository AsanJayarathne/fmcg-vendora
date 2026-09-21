import React, { useState } from 'react';
import { X, Layers, AlertCircle, Loader2, Edit2, Check, Calendar } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

const STATUS_STYLES = {
  Active: { dot: 'bg-emerald-500', badge: 'text-emerald-700 bg-emerald-50 border-emerald-200/60' },
  Exhausted: { dot: 'bg-slate-400', badge: 'text-slate-600  bg-slate-100  border-slate-200' },
  Expired: { dot: 'bg-rose-500', badge: 'text-rose-700   bg-rose-50   border-rose-200/60' },
};

const fmtPrice = (val) =>
  val != null ? `LKR ${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-';

const fmtDate = (date) => {
  if (!date || date === '0000-00-00') return 'N/A';
  const parsed = new Date(date.replace(/-/g, '/'));
  return isNaN(parsed.getTime())
    ? 'N/A'
    : parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const isExpiringSoon = (expiryDate) => {
  if (!expiryDate || expiryDate === '0000-00-00') return false;
  const days = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 30;
};

const DistributorBatchDrillDownModal = ({ product, batches = [], loading, onClose, onBatchUpdated }) => {
  const { auth } = useAuth();
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editQty, setEditQty] = useState('');
  const [savingBatchId, setSavingBatchId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!product) return null;

  const startEditing = (b) => {
    setEditingBatchId(b.dist_batch_id ?? b.batch_id);
    setEditExpiryDate(b.expiry_date || '');
    setEditQty(b.quantity ?? 0);
    setErrorMsg('');
  };

  const cancelEditing = () => {
    setEditingBatchId(null);
    setEditExpiryDate('');
    setEditQty('');
    setErrorMsg('');
  };

  const handleSave = async (b) => {
    const batchId = b.dist_batch_id ?? b.batch_id;
    setSavingBatchId(batchId);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/distributor/stock.php?batch_id=${batchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({
          quantity: parseInt(editQty, 10),
          expiry_date: editExpiryDate || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditingBatchId(null);
        if (onBatchUpdated) {
          onBatchUpdated();
        }
      } else {
        setErrorMsg(data.message || 'Failed to update batch');
      }
    } catch {
      setErrorMsg('Failed to connect to server');
    } finally {
      setSavingBatchId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 transform transition-all scale-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Batch Breakdown</span>
              <h3 className="text-base font-bold text-slate-800 leading-tight mt-0.5">
                {product.product_name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{product.category_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="px-6 py-2 bg-rose-50 border-b border-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        {/* Table Body */}
        <div className="overflow-auto flex-1 no-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
          ) : batches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Layers size={40} className="mb-2 opacity-30" />
              <p className="text-sm font-bold text-slate-800">No batch records found</p>
              <p className="text-xs text-slate-400">There are no batch records for this product.</p>
            </div>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider z-10">
                <tr>
                  <th className="px-5 py-4">Batch #</th>
                  <th className="px-5 py-4">Received Date</th>
                  <th className="px-5 py-4">Mfg. Date</th>
                  <th className="px-5 py-4">Expiry Date</th>
                  <th className="px-5 py-4 text-right">Cost Price</th>
                  <th className="px-5 py-4 text-right">Selling Price</th>
                  <th className="px-5 py-4 text-right">Quantity</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((b) => {
                  const batchId = b.dist_batch_id ?? b.batch_id;
                  const isEditing = editingBatchId === batchId;
                  const isSaving = savingBatchId === batchId;
                  const style = STATUS_STYLES[b.status] || STATUS_STYLES.Exhausted;
                  const expSoon = isExpiringSoon(b.expiry_date);

                  return (
                    <tr key={batchId} className={`hover:bg-slate-50/60 transition duration-150 ${isEditing ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-5 py-4 font-bold text-blue-600">{b.batch_number}</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{fmtDate(b.received_at)}</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{fmtDate(b.mfg_date)}</td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="date"
                              value={editExpiryDate}
                              onChange={(e) => setEditExpiryDate(e.target.value)}
                              className="px-2 py-1 bg-white border border-blue-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className={expSoon ? "text-amber-600 font-bold" : b.expiry_date ? "text-slate-700 font-medium" : "text-slate-400 italic"}>
                              {fmtDate(b.expiry_date)}
                            </span>
                            {expSoon && (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                                <AlertCircle size={9} /> Expiring Soon
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-600 font-medium">{fmtPrice(b.cost_price)}</td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">{fmtPrice(b.selling_price)}</td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            className="w-20 px-2 py-1 bg-white border border-blue-300 rounded-lg text-xs text-right text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold shadow-xs"
                          />
                        ) : (
                          Number(b.quantity || 0).toLocaleString()
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleSave(b)}
                              disabled={isSaving}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs disabled:opacity-50"
                              title="Save Changes"
                            >
                              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isSaving}
                              className="p-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition cursor-pointer"
                              title="Cancel"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(b)}
                            className="p-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold border border-blue-100"
                            title="Edit Expiry / Qty"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Summary */}
        {!loading && batches.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 flex-shrink-0 font-medium">
            <div>
              Total <strong className="text-slate-800">{batches.length}</strong> batches found
            </div>
            <div className="font-bold text-slate-900 text-xs">
              Active Stock:{" "}
              <span className="text-blue-600">
                {batches.filter(b => b.status === 'Active').reduce((s, b) => s + parseInt(b.quantity || 0, 10), 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributorBatchDrillDownModal;

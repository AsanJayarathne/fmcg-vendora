import React from 'react';
import { X, Layers } from 'lucide-react';

const STATUS_STYLES = {
  Active:    { dot: 'bg-emerald-500', badge: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  Exhausted: { dot: 'bg-slate-400',   badge: 'text-slate-600  bg-slate-50  border-slate-200'    },
  Expired:   { dot: 'bg-rose-500',    badge: 'text-rose-700   bg-rose-50   border-rose-100'      },
};

const fmtPrice = (val) =>
  val != null ? `Rs. ${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—';

const fmtDate = (date) =>
  date ? new Date(date.replace(/-/g, "/")).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

const isExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false;
  const days = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 30;
};

const DistributorBatchDrillDownModal = ({ product, batches = [], loading, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Batch Details</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">{product.product_name} ({product.category_name})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table Body */}
        <div className="overflow-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center p-16">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : batches.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400">
              <Layers size={36} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No batch records found for this product</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3.5">Batch #</th>
                  <th className="px-5 py-3.5">Received Date</th>
                  <th className="px-5 py-3.5">Mfg. Date</th>
                  <th className="px-5 py-3.5">Expiry Date</th>
                  <th className="px-5 py-3.5 text-right">Cost Price</th>
                  <th className="px-5 py-3.5 text-right">Selling Price</th>
                  <th className="px-5 py-3.5 text-right">Quantity</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {batches.map((b) => {
                  const style = STATUS_STYLES[b.status] || STATUS_STYLES.Exhausted;
                  const expSoon = isExpiringSoon(b.expiry_date);
                  return (
                    <tr key={b.dist_batch_id ?? b.batch_id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-800">{b.batch_number}</td>
                      <td className="px-5 py-3.5 text-slate-500">{fmtDate(b.received_at)}</td>
                      <td className="px-5 py-3.5 text-slate-500">{fmtDate(b.mfg_date)}</td>
                      <td className={`px-5 py-3.5 ${expSoon ? "text-amber-600 font-semibold" : "text-slate-500"}`}>
                        {fmtDate(b.expiry_date)}
                        {expSoon && (
                          <span className="ml-1.5 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full inline-block">
                            Expiring Soon
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right text-slate-600">{fmtPrice(b.cost_price)}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-850">{fmtPrice(b.selling_price)}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                        {b.quantity.toLocaleString()} <span className="font-normal text-xs text-slate-400">{product.unit || 'units'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {b.status}
                        </span>
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
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-6 text-xs text-slate-500 flex-shrink-0">
            <span><strong className="text-slate-700">{batches.length}</strong> batch{batches.length !== 1 ? 'es' : ''}</span>
            <span>
              <strong className="text-slate-700">
                {batches.filter(b => b.status === 'Active').reduce((s, b) => s + parseInt(b.quantity || 0), 0).toLocaleString()}
              </strong> active units
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributorBatchDrillDownModal;

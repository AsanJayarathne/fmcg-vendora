import React from 'react';
import { X, Layers, AlertCircle, Loader2 } from 'lucide-react';

const STATUS_STYLES = {
  Active:    { dot: 'bg-emerald-500', badge: 'text-emerald-700 bg-emerald-50 border-emerald-200/60' },
  Exhausted: { dot: 'bg-slate-400',   badge: 'text-slate-600  bg-slate-100  border-slate-200'      },
  Expired:   { dot: 'bg-rose-500',    badge: 'text-rose-700   bg-rose-50   border-rose-200/60'    },
};

const fmtPrice = (val) =>
  val != null ? `LKR ${parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 transform transition-all scale-100 animate-slide-up"
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
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Batch #</th>
                  <th className="px-5 py-4">Received Date</th>
                  <th className="px-5 py-4">Mfg. Date</th>
                  <th className="px-5 py-4">Expiry Date</th>
                  <th className="px-5 py-4 text-right">Cost Price</th>
                  <th className="px-5 py-4 text-right">Selling Price</th>
                  <th className="px-5 py-4 text-right">Quantity</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((b) => {
                  const style = STATUS_STYLES[b.status] || STATUS_STYLES.Exhausted;
                  const expSoon = isExpiringSoon(b.expiry_date);
                  return (
                    <tr key={b.dist_batch_id ?? b.batch_id} className="hover:bg-slate-50/60 transition duration-150">
                      <td className="px-5 py-4 font-bold text-blue-600">{b.batch_number}</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{fmtDate(b.received_at)}</td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{fmtDate(b.mfg_date)}</td>
                      <td className={`px-5 py-4 ${expSoon ? "text-amber-600 font-bold" : "text-slate-600 font-medium"}`}>
                        {fmtDate(b.expiry_date)}
                        {expSoon && (
                          <span className="ml-1.5 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                            <AlertCircle size={9} /> Expiring Soon
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-600 font-medium">{fmtPrice(b.cost_price)}</td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">{fmtPrice(b.selling_price)}</td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">
                        {b.quantity.toLocaleString()} <span className="font-normal text-[10px] text-slate-400">{product.unit || 'units'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.badge}`}>
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
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 flex-shrink-0 font-medium">
            <div>
              Total <strong className="text-slate-800">{batches.length}</strong> batches found
            </div>
            <div className="font-bold text-slate-900 text-xs">
              Active Stock:{" "}
              <span className="text-blue-600">
                {batches.filter(b => b.status === 'Active').reduce((s, b) => s + parseInt(b.quantity || 0), 0).toLocaleString()} {product.unit || 'units'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributorBatchDrillDownModal;

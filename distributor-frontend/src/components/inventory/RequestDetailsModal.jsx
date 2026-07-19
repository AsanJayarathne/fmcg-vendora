import React from "react";
import { X, Calendar, ClipboardList } from "lucide-react";

export default function RequestDetailsModal({ request, onClose }) {
  if (!request) return null;

  const code = `REQ-${String(request.request_id).padStart(3, "0")}`;
  const formattedDate = request.request_date 
    ? new Date(request.request_date.replace(/-/g, "/")).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden transform transition-all scale-100 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600">Request Details</span>
            <h2 className="text-lg font-bold text-slate-800 leading-tight mt-0.5">{code}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Date Submitted</p>
                <p className="text-xs font-bold text-slate-700">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Current Status</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-100 text-sky-800 bg-sky-50 mt-0.5`}>
                  {request.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Request Items List</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Requested Qty</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Approved Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {(!request.items || request.items.length === 0) ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-gray-400 text-sm">
                        No items found in this request.
                      </td>
                    </tr>
                  ) : (
                    request.items.map((item) => (
                      <tr key={item.request_item_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {item.product_name}
                          <span className="text-xs text-gray-400 font-normal ml-1">({item.unit})</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-gray-700">{item.requested_qty}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">
                          {item.approved_qty !== null ? item.approved_qty : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks */}
          {request.remarks && (
            <div className="space-y-1 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Distributor Remarks</h4>
              <p className="text-xs text-slate-600 leading-relaxed italic">"{request.remarks}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-350 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

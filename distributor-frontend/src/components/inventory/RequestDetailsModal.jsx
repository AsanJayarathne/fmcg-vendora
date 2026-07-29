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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden transform transition-all scale-100 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Request Overview</span>
            <h2 className="text-base font-bold text-slate-800 leading-tight mt-0.5">{code}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/70 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Date Submitted</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Current Status</p>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-sky-200/60 text-sky-700 bg-sky-50 mt-0.5">
                  {request.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Request Items List</h3>
            <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-2xs bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3 text-right">Requested Qty</th>
                    <th className="px-4 py-3 text-right">Approved Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(!request.items || request.items.length === 0) ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-slate-400">
                        No items found in this request.
                      </td>
                    </tr>
                  ) : (
                    request.items.map((item) => (
                      <tr key={item.request_item_id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {item.product_name}
                          <span className="text-[10px] text-slate-400 font-medium ml-1.5">({item.unit})</span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">{item.requested_qty}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
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
            <div className="space-y-1 bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Distributor Remarks</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">"{request.remarks}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

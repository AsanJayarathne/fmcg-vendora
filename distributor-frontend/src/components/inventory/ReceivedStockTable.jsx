import { Eye, CheckCircle2 } from "lucide-react";

const STATUS_CONFIG = {
  Partially_Approved: { badge: "bg-sky-50 text-sky-700 border border-sky-200/60",          label: "Approved — Awaiting Receipt" },
  Received:           { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/60", label: "Received ✓" },
};

export default function ReceivedStockTable({ receivedStocks = [], onViewRequest, onReceiveRequest }) {
  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Request ID</th>
              <th className="px-6 py-4">Date Submitted</th>
              <th className="px-6 py-4 text-center">Items</th>
              <th className="px-6 py-4">Remarks</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {receivedStocks.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">🚚</p>
                  <p className="font-bold text-slate-800 text-sm">No stock transfers found</p>
                  <p className="text-xs text-slate-400">Approved manufacturer supply requests will appear here for receipt confirmation.</p>
                </td>
              </tr>
            ) : (
              receivedStocks.map((stock) => {
                const code = `REQ-${String(stock.request_id).padStart(3, "0")}`;
                const formattedDate = stock.request_date
                  ? new Date(stock.request_date.replace(/-/g, "/")).toLocaleDateString(undefined, {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : "—";
                const cfg = STATUS_CONFIG[stock.status] || STATUS_CONFIG.Partially_Approved;
                const isPendingReceipt = stock.status === "Partially_Approved";

                return (
                  <tr key={stock.request_id} className="hover:bg-slate-50/60 transition duration-150">
                    <td className="px-6 py-4 font-bold text-blue-600">{code}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{formattedDate}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{stock.item_count || 0}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-medium max-w-xs truncate" title={stock.remarks}>
                      {stock.remarks || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => onViewRequest && onViewRequest(stock)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Eye size={13} />
                          View Items
                        </button>
                        {isPendingReceipt && onReceiveRequest && (
                          <button
                            onClick={() => onReceiveRequest(stock)}
                            className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 size={13} />
                            Mark Received
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { Eye } from "lucide-react";

export default function RequestedStockTable({ requests = [], onViewRequest }) {
  const getStatusLabel = (status) => {
    if (status === "Partially_Approved") return "Accepted";
    if (status === "Received") return "Received";
    return status.replace("_", " ");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-200/60";
      case "Approved":
      case "Partially_Approved":
      case "Delivered":
      case "Received":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border border-rose-200/60";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Request ID</th>
              <th className="px-6 py-4">Request Date</th>
              <th className="px-6 py-4 text-center">Total Items</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Remarks / Notes</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">📋</p>
                  <p className="font-bold text-slate-800 text-sm">No stock requests found</p>
                  <p className="text-xs text-slate-400">You have no active supply requests matching your filter criteria.</p>
                </td>
              </tr>
            ) : (
              requests.map((request) => {
                const code = `REQ-${String(request.request_id).padStart(3, "0")}`;
                const formattedDate = request.request_date 
                  ? new Date(request.request_date.replace(/-/g, "/")).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—";

                return (
                  <tr key={request.request_id} className="hover:bg-slate-50/60 transition duration-150">
                    <td className="px-6 py-4 font-bold text-blue-600">{code}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{formattedDate}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{request.item_count || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-medium max-w-xs truncate" title={request.remarks}>
                      {request.remarks || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => onViewRequest && onViewRequest(request)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Eye size={13} />
                          View Items
                        </button>
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
export default function ReceivedStockTable({ receivedStocks = [], onViewRequest }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl font-sans">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50/75 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Request ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Submitted</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total Items</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks / Notes</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-gray-700">
          {receivedStocks.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-400 text-sm">
                No received stock records found.
              </td>
            </tr>
          ) : (
            receivedStocks.map((stock) => {
              const code = `REQ-${String(stock.request_id).padStart(3, "0")}`;
              const formattedDate = stock.request_date 
                ? new Date(stock.request_date.replace(/-/g, "/")).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";

              return (
                <tr key={stock.request_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-gray-900">{code}</td>
                  <td className="px-6 py-4 text-gray-700">{formattedDate}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800">{stock.item_count || 0}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-100 text-emerald-800 border-emerald-200">
                      {stock.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 italic max-w-xs truncate" title={stock.remarks}>
                    {stock.remarks || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onViewRequest && onViewRequest(stock)}
                        className="px-3.5 py-1.5 text-xs font-bold border border-gray-200 rounded-md text-sky-600 bg-white hover:bg-sky-50 active:scale-95 transition-all cursor-pointer"
                      >
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
  );
}
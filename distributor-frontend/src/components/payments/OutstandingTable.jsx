import { Eye } from "lucide-react";

function fmtAmount(val) {
  return Number(val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

export default function OutstandingTable({ outstandings, onViewAccount }) {
  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Retailer ID</th>
              <th className="px-6 py-4">Retailer Shop</th>
              <th className="px-6 py-4 text-right">Credit Limit</th>
              <th className="px-6 py-4 text-right">Outstanding Balance</th>
              <th className="px-6 py-4 text-right">Available Credit</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {outstandings.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">💳</p>
                  <p className="font-bold text-slate-800 text-sm">No outstanding credit accounts found</p>
                  <p className="text-xs text-slate-400">There are no retailer credit accounts matching your criteria.</p>
                </td>
              </tr>
            ) : (
              outstandings.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition duration-150">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewAccount?.(item)}
                      className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {item.retailerId}
                    </button>
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-800">
                    {item.retailer}
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">
                    LKR {fmtAmount(item.creditLimit)}
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-rose-600">
                    LKR {fmtAmount(item.outstanding)}
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    LKR {fmtAmount(item.availableCredit)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onViewAccount?.(item)}
                        className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <Eye size={13} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
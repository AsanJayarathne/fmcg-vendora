export default function OutstandingTable({
  outstandings,
}) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/75">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Credit Limit (LKR)</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Outstanding (LKR)</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Available Credit</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {outstandings.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                {item.retailerId}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900">
                {item.retailer}
              </td>

              <td className="px-6 py-4 text-right text-gray-700 font-semibold">
                {item.creditLimit}
              </td>

              <td className="px-6 py-4 text-right font-semibold text-red-500">
                {item.outstanding}
              </td>

              <td className="px-6 py-4 text-right font-semibold text-green-500">
                {item.availableCredit}
              </td>

              <td className="px-6 py-4 text-center">
                <button className="px-5 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md hover:bg-sky-50 transition-colors">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
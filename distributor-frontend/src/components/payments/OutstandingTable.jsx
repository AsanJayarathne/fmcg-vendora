export default function OutstandingTable({
  outstandings,
}) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left">
              Retailer ID
            </th>
            <th className="text-left">
              Retailer
            </th>
            <th className="text-left">
              Credit Limit(LKR)
            </th>
            <th className="text-left">
              Outstanding(LKR)
            </th>
            <th className="text-left">
              Available Credit
            </th>
            <th className="text-left">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {outstandings.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200"
            >
              <td className="px-6 py-4">
                {item.retailerId}
              </td>

              <td>
                {item.retailer}
              </td>

              <td>
                {item.creditLimit}
              </td>

              <td className="font-semibold text-red-500">
                {item.outstanding}
              </td>

              <td className="font-semibold text-green-500">
                {item.availableCredit}
              </td>

              <td>
                <button className="px-5 py-1 text-[10px] font-semibold text-sky-500 border rounded-md">
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
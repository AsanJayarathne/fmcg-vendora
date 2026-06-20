export default function SetCreditTable({ shops }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Retailer ID</th>
            <th>Retailer</th>
            <th>Current Credit Limit</th>
            <th>New Credit Limit</th>
            <th>Outstanding</th>
            <th>Available Credit</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {shops.map((shop, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-3">{shop.id}</td>
              <td>{shop.name}</td>
              <td>{shop.creditLimit}</td>

              <td>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-32 px-3 py-2 text-xs border border-gray-300 rounded-md outline-none"
                />
              </td>

              <td className="font-semibold text-red-500">5,000.00</td>
              <td className="font-semibold text-green-500">45,000.00</td>

              <td>
                <button className="px-5 py-1 text-[10px] font-semibold text-white bg-blue-600 rounded-md">
                  Save Credit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
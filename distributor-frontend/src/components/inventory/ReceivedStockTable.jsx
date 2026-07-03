export default function ReceivedStockTable({ receivedStocks }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Receive ID</th>
            <th>Request ID</th>
            <th>Received Date</th>
            <th>Total Items</th>
            <th>Total Amount</th>
            <th>Received By</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {receivedStocks.map((stock) => (
            <tr
              key={stock.id}
              className="border-b border-gray-100"
            >
              <td className="px-6 py-4 font-medium">
                {stock.id}
              </td>

              <td>{stock.requestId}</td>

              <td>{stock.date}</td>

              <td>{stock.items}</td>

              <td>LKR {stock.amount}</td>

              <td>{stock.receivedBy}</td>

              <td>
                <button className="px-5 py-1 text-xs font-semibold border rounded-md text-sky-500">
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
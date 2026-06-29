export default function RequestedStockTable({ requests }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Request ID</th>
            <th>Request Date</th>
            <th>Total Items</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Expected Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className="border-b border-gray-100"
            >
              <td className="px-6 py-4 font-medium">
                {request.id}
              </td>

              <td>{request.date}</td>

              <td>{request.items}</td>

              <td>LKR {request.amount}</td>

              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : request.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {request.status}
                </span>
              </td>

              <td>{request.expected}</td>

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
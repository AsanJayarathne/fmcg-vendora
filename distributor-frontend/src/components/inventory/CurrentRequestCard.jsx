import { Send, Trash2 } from "lucide-react";

export default function CurrentRequestCard({ request }) {
  const totalItems = request.items.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = request.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full max-w-2xl p-3 bg-white border border-gray-300 rounded-lg">
      <h3 className="text-sm font-bold">My Current Request</h3>
      <p className="text-[10px] font-semibold text-sky-500">
        {request.requestId}
      </p>

      <div className="mt-2 overflow-hidden border border-gray-200 rounded-md">
        <table className="w-full text-xs text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th>Qty</th>
              <th>Base Price</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {request.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-6 py-3">{item.product}</td>
                <td>{item.qty}</td>
                <td>{item.basePrice}</td>
                <td>{item.amount.toLocaleString()}</td>
                <td>
                  <button className="p-1 text-red-500 border border-gray-300 rounded-md">
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}

            <tr>
              <td className="px-6 py-3">Total Items</td>
              <td>{totalItems}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td className="px-6 py-3">Total Amount</td>
              <td></td>
              <td></td>
              <td className="text-2xl font-bold text-blue-500">
                {totalAmount.toLocaleString()}.00
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-20 mt-6">
        <button className="w-64 py-2 text-sm font-bold text-red-500 border border-red-400 rounded-md">
          Clear Request
        </button>

        <button className="flex items-center justify-center w-64 gap-2 py-2 text-sm font-bold text-white bg-blue-500 rounded-md">
          <Send size={16} />
          Submit Request
        </button>
      </div>
    </div>
  );
}
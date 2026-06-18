import { Send, Trash2, PackagePlus } from "lucide-react";

export default function CurrentRequestCard({ request }) {
  const totalItems = request.items.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = request.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            My Current Request
          </h3>
          <p className="text-xs font-semibold text-sky-500">
            {request.requestId}
          </p>
        </div>

        <div className="flex items-center justify-center w-10 h-10 rounded-full text-sky-500 bg-sky-100">
          <PackagePlus size={20} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-xs text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th>Qty</th>
              <th>Base Price</th>
              <th>Amount</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {request.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-6 py-3 font-medium text-gray-800">
                  {item.product}
                </td>
                <td>{item.qty.toLocaleString()}</td>
                <td>{item.basePrice}</td>
                <td className="font-semibold">
                  {item.amount.toLocaleString()}.00
                </td>
                <td className="text-center">
                  <button className="p-1.5 text-red-500 border border-red-200 rounded-md hover:bg-red-50">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary + Actions */}
      <div className="flex flex-col gap-4 mt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-4 lg:w-1/2">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500">Total Items</p>
            <h4 className="text-xl font-bold text-gray-900">
              {totalItems.toLocaleString()}
            </h4>
          </div>

          <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
            <p className="text-xs text-gray-500">Total Amount</p>
            <h4 className="text-2xl font-bold text-blue-600">
              {totalAmount.toLocaleString()}.00
            </h4>
          </div>
        </div>

        <div className="flex gap-4 lg:w-1/2 lg:justify-end">
          <button className="w-full px-6 py-3 text-sm font-bold text-red-500 border border-red-400 rounded-lg lg:w-52 hover:bg-red-50">
            Clear Request
          </button>

          <button className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-500 rounded-lg lg:w-52 hover:bg-blue-600">
            <Send size={16} />
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
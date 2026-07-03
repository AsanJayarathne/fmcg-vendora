import { MoreVertical, PackageCheck } from "lucide-react";

export default function InventoryTable({ items }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        {/* Header */}
        <thead className="bg-white border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-sm font-bold text-gray-800">
              Product
            </th>

            <th className="px-6 py-4 text-sm font-bold text-gray-800">
              Product ID
            </th>

            <th className="px-6 py-4 text-sm font-bold text-gray-800">
              Available Stock
            </th>

            <th className="px-6 py-4 text-sm font-bold text-gray-800">
              Status
            </th>

            <th className="px-6 py-4 text-sm font-bold text-gray-800">
              Expired
            </th>

            <th className="px-6 py-4 text-sm font-bold text-gray-800">
              Action
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="transition border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-6 py-4">
                <p className="text-sm text-gray-700">{item.name}</p>
                <p className="text-xs text-gray-500">{item.code}</p>
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {item.productId}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {item.availableStock}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`text-sm font-medium ${
                    item.status === "Good"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`text-sm font-medium ${
                    item.expired !== "---"
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  {item.expired}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium transition border border-gray-300 rounded-md text-sky-500 hover:bg-sky-50">
                    <PackageCheck size={14} />
                    Manage Stock
                  </button>

                  <button className="p-2 transition border border-gray-300 rounded-md hover:bg-gray-100">
                    <MoreVertical size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { PackagePlus } from "lucide-react";

export default function RequestStockTable({ products }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        {/* Table Header */}
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
              Base Price
            </th>

            <th className="px-6 py-4 text-sm font-bold text-gray-800">
              MRP
            </th>

            <th className="px-6 py-4 text-sm font-bold text-gray-800">
              Action
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {products.map((product, index) => (
            <tr
              key={index}
              className="transition border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-sm text-gray-700">
                {product.name}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {product.productId}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {product.availableStock}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                LKR {product.basePrice.toFixed(2)}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                LKR {product.mrp.toFixed(2)}
              </td>

              <td className="px-6 py-4">
                <button className="flex items-center gap-2 px-5 py-2 text-xs font-medium transition border border-gray-300 rounded-md text-sky-500 hover:bg-sky-50">
                  <PackagePlus size={14} />
                  Request
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
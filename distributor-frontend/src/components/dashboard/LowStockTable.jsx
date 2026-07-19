import { TriangleAlert } from "lucide-react";

export default function LowStockTable({ products }) {
  return (
    <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Low Stock Alerts</h2>
        <button className="text-xs font-semibold text-blue-600">View All</button>
      </div>

      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/50">
          <tr>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-2.5 font-semibold text-gray-900">{product.name}</td>
              <td className="px-4 py-2.5 text-gray-700">{product.category}</td>
              <td className="px-4 py-2.5 text-gray-700 font-semibold">{product.stock}</td>
              <td className="px-4 py-2.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-semibold text-red-600 bg-red-100 rounded-full">
                  <TriangleAlert size={12} />
                  Low
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { TriangleAlert } from "lucide-react";

export default function LowStockTable({ products }) {
  return (
    <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Low Stock Alerts</h2>
        <button className="text-xs font-semibold text-blue-600">View All</button>
      </div>

      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="py-3">Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-100">
              <td className="py-3 font-semibold">{product.name}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>
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
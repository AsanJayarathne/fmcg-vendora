import { TriangleAlert } from "lucide-react";

export default function LowStockTable({ products }) {
  return (
    <div className="p-6 bg-white border border-slate-100 shadow-xs rounded-[32px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-black text-slate-800">Low Stock Alerts</h2>
        <button className="text-xs font-bold text-slate-550 hover:text-slate-900 cursor-pointer">View All</button>
      </div>

      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-slate-100 bg-slate-50/50">
          <tr>
            <th className="px-4 py-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-2.5 font-semibold text-gray-900">{product.name}</td>
              <td className="px-4 py-2.5 text-gray-700">{product.category}</td>
              <td className="px-4 py-2.5 text-gray-700 font-semibold">{product.stock}</td>
              <td className="px-4 py-2.5 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black text-red-600 bg-red-50 border border-red-200/50 rounded-full">
                  <TriangleAlert size={10} />
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
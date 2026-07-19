import { Eye, Edit2 } from "lucide-react";

export default function ProductTable({ products = [], onViewProduct, onEditPrice }) {
  
  // Status check helper
  const getStatus = (stock) => {
    if (stock <= 0) return "Out Of Stock";
    if (stock <= 50) return "Low Stock";
    return "In Stock";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "In Stock":
        return "text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-semibold border border-green-100";
      case "Low Stock":
        return "text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full text-xs font-semibold border border-orange-100";
      default:
        return "text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-semibold border border-red-100";
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/75">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Product
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Category
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Base Price (LKR)
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              MRP (LKR)
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              My Selling Price (LKR)
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Stock
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((item) => {
              const status = getStatus(Number(item.stock));
              const pId = `PRD-${item.product_id}`;
              
              return (
                <tr key={item.product_id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.product_name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">{pId}</p>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {item.category_name}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    {Number(item.base_price || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    {Number(item.mrp || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    {Number(item.selling_price || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800 mb-0.5">
                      {item.stock}
                    </p>
                    <span className={getStatusClass(status)}>
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewProduct && onViewProduct({
                          product_id: item.product_id,
                          id: pId,
                          name: item.product_name,
                          category: item.category_name,
                          base: item.base_price,
                          mrp: item.mrp,
                          selling: item.selling_price,
                          stock: item.stock,
                          status: status,
                          description: item.description,
                          unit: item.unit,
                          image_url: item.image_url
                        })}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-sky-200 text-sky-500 rounded-lg hover:bg-sky-50 transition"
                      >
                        <Edit2 size={12} />
                        Edit Price
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
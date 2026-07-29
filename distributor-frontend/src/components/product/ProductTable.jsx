import { Edit2 } from "lucide-react";

export default function ProductTable({ products = [], onViewProduct }) {
  
  const getStatus = (stock) => {
    if (stock <= 0) return "Out Of Stock";
    if (stock <= 50) return "Low Stock";
    return "In Stock";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "In Stock":
        return "text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-[11px] font-semibold border border-emerald-200/60";
      case "Low Stock":
        return "text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-[11px] font-semibold border border-amber-200/60";
      default:
        return "text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-[11px] font-semibold border border-rose-200/60";
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-xs">
      <table className="w-full text-xs text-left border-collapse">
        <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
          <tr>
            <th className="px-6 py-3.5">Product</th>
            <th className="px-6 py-3.5">Category</th>
            <th className="px-6 py-3.5">Base Price (LKR)</th>
            <th className="px-6 py-3.5">MRP (LKR)</th>
            <th className="px-6 py-3.5">My Selling Price (LKR)</th>
            <th className="px-6 py-3.5">Stock</th>
            <th className="px-6 py-3.5 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-semibold">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((item) => {
              const status = getStatus(Number(item.stock));
              const pId = `PRD-${item.product_id}`;
              
              return (
                <tr key={item.product_id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">
                      {item.product_name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">{pId}</p>
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-600">
                    {item.category_name}
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-700">
                    {Number(item.base_price || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-700">
                    {Number(item.mrp || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 font-bold text-emerald-600">
                    {Number(item.selling_price || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 mb-1">
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
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition cursor-pointer"
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
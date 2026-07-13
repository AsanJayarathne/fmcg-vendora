import { useState } from "react";
import { PackagePlus } from "lucide-react";

export default function RequestStockTable({ products = [], onRequestItem }) {
  const [quantities, setQuantities] = useState({});

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg font-sans">
      <table className="w-full text-sm text-left border-collapse">
        {/* Table Header */}
        <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-700 font-bold">
          <tr>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">Product ID</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Admin Warehouse Stock</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Base Price</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">MRP</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100 text-gray-600">
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                No products found in warehouse catalog.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const code = `PRD-${String(product.product_id).padStart(3, "0")}`;
              const qtyValue = quantities[product.product_id] || "";

              return (
                <tr key={product.product_id} className="transition hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {product.product_name}
                    <div className="text-xs text-gray-400 font-normal mt-0.5">{product.category_name}</div>
                  </td>

                  <td className="px-6 py-4 font-mono">{code}</td>

                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-gray-800">{product.warehouse_stock}</span>{" "}
                    <span className="text-xs text-gray-400">{product.unit || "units"}</span>
                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-gray-700">
                    Rs. {parseFloat(product.base_price || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-gray-700">
                    Rs. {parseFloat(product.mrp || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={qtyValue}
                        onChange={(e) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [product.product_id]: e.target.value,
                          }))
                        }
                        className="w-20 px-2 py-1.5 text-xs border rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition bg-slate-50 text-gray-800"
                      />
                      <button
                        onClick={() => {
                          const qty = parseInt(qtyValue);
                          if (!qty || qty <= 0) {
                            alert("Please enter a valid quantity greater than 0");
                            return;
                          }
                          onRequestItem && onRequestItem(product, qty);
                          setQuantities((prev) => ({
                            ...prev,
                            [product.product_id]: "",
                          }));
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold transition border border-sky-200 rounded-md text-sky-600 bg-sky-50 hover:bg-sky-100 active:scale-95 cursor-pointer"
                      >
                        <PackagePlus size={13} />
                        Request
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
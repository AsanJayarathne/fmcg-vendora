import { MoreVertical, PackagePlus } from "lucide-react";

export default function RequestStockTable({ products }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Product</th>
            <th>Product ID</th>
            <th>Available Stock</th>
            <th>Base Price</th>
            <th>MRP</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-3">{product.name}</td>
              <td>{product.productId}</td>
              <td>{product.availableStock}</td>
              <td>{product.basePrice.toFixed(2)}</td>
              <td>{product.mrp.toFixed(2)}</td>

              <td>
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-1 px-4 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md">
                    <PackagePlus size={12} />
                    Request
                  </button>

                  <button className="p-1 border border-gray-300 rounded-md">
                    <MoreVertical size={13} />
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
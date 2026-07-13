import { MoreVertical, PackageCheck } from "lucide-react";

export default function InventoryTable({ items = [], onSelectProduct, selectedProductId }) {
  const getStatus = (qty) => {
    if (qty <= 0) return "Out of Stock";
    if (qty <= 20) return "Low";
    return "Good";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Good":
        return "text-green-600 bg-green-50 border-green-100";
      case "Low":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "Out of Stock":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg font-sans">
      <table className="w-full text-sm text-left border-collapse">
        {/* Header */}
        <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-700 font-bold">
          <tr>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">Product ID</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">Available Stock</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">Expired</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100 text-gray-600">
          {items.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                No inventory items found.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const status = getStatus(item.quantity);
              const code = `PRD-${String(item.product_id).padStart(3, '0')}`;
              const isSelected = selectedProductId === item.product_id;

              return (
                <tr
                  key={item.product_id}
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  className={`transition hover:bg-gray-50 cursor-pointer ${
                    isSelected ? "bg-blue-50/40 hover:bg-blue-50/60" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.product_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.category_name}</div>
                  </td>

                  <td className="px-6 py-4 text-sm font-mono">{code}</td>

                  <td className="px-6 py-4 text-sm">
                    <span className="font-bold text-gray-800">{item.quantity}</span>{" "}
                    <span className="text-xs text-gray-400">{item.unit || "units"}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-400">---</td>

                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onSelectProduct && onSelectProduct(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-md text-sky-600 bg-white hover:bg-sky-50 active:scale-95 transition-all cursor-pointer"
                      >
                        <PackageCheck size={13} />
                        View Details
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
import { MoreVertical, PackageCheck } from "lucide-react";

export default function InventoryTable({ items }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Product</th>
            <th>Product ID</th>
            <th>Available Stock</th>
            <th>Status</th>
            <th>Expired</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-3">
                <p className="font-medium">{item.name}</p>
                <p className="text-[10px] text-gray-500">{item.code}</p>
              </td>

              <td>{item.productId}</td>
              <td>{item.availableStock}</td>

              <td className={item.status === "Good" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                {item.status}
              </td>

              <td className={item.expired !== "---" ? "text-red-500 font-semibold" : "text-gray-700"}>
                {item.expired}
              </td>

              <td>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 px-3 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md">
                    <PackageCheck size={12} />
                    Manage Stock
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
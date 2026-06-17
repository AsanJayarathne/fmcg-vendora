import { Eye } from "lucide-react";

const products = [
  { id: "ORD-01", name: "Item 1", category: "A", base: "45.00", mrp: "65.00", selling: "58.00", stock: 500, status: "In Stock" },
  { id: "ORD-02", name: "Item 2", category: "B", base: "45.00", mrp: "65.00", selling: "58.00", stock: 500, status: "In Stock" },
  { id: "ORD-03", name: "Item 3", category: "A", base: "45.00", mrp: "65.00", selling: "58.00", stock: 50, status: "Low Stock" },
   { id: "ORD-03", name: "Item 3", category: "A", base: "45.00", mrp: "65.00", selling: "58.00", stock: 50, status: "Low Stock" },
    { id: "ORD-03", name: "Item 3", category: "A", base: "45.00", mrp: "65.00", selling: "58.00", stock: 50, status: "Low Stock" },
  { id: "ORD-06", name: "Item 6", category: "B", base: "45.00", mrp: "65.00", selling: "58.00", stock: 0, status: "Out Of Stock" },
];

export default function ProductTable() {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs text-left">
        <thead className="border-b">
          <tr>
            <th className="px-6 py-3">Product</th>
            <th>Category</th>
            <th>Base Price(LKR)</th>
            <th>MRP(LKR)</th>
            <th>My Selling Price(LKR)</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="px-6 py-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-[10px] text-gray-500">{item.id}</p>
              </td>

              <td>{item.category}</td>
              <td>{item.base}</td>
              <td>{item.mrp}</td>
              <td className="text-green-500">{item.selling}</td>

              <td>
                <p>{item.stock}</p>
                <p
                  className={`text-[10px] font-semibold ${
                    item.status === "In Stock"
                      ? "text-green-600"
                      : item.status === "Low Stock"
                      ? "text-orange-500"
                      : "text-red-600"
                  }`}
                >
                  {item.status}
                </p>
              </td>

              <td>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-[10px] text-sky-500 border rounded-md">
                    Edit Price
                  </button>

                  <button className="p-1 border rounded-md text-sky-400">
                    <Eye size={13} />
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
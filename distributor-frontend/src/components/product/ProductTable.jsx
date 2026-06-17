import { Eye } from "lucide-react";

const products = [
  {
    id: "ORD-01",
    name: "Item 1",
    category: "A",
    base: "45.00",
    mrp: "65.00",
    selling: "58.00",
    stock: 500,
    status: "In Stock",
  },
  {
    id: "ORD-02",
    name: "Item 2",
    category: "B",
    base: "45.00",
    mrp: "65.00",
    selling: "58.00",
    stock: 500,
    status: "In Stock",
  },
  {
    id: "ORD-03",
    name: "Item 3",
    category: "A",
    base: "45.00",
    mrp: "65.00",
    selling: "58.00",
    stock: 50,
    status: "Low Stock",
  },
  {
    id: "ORD-04",
    name: "Item 4",
    category: "A",
    base: "45.00",
    mrp: "65.00",
    selling: "58.00",
    stock: 50,
    status: "Low Stock",
  },
  {
    id: "ORD-05",
    name: "Item 5",
    category: "A",
    base: "45.00",
    mrp: "65.00",
    selling: "58.00",
    stock: 50,
    status: "Low Stock",
  },
  {
    id: "ORD-06",
    name: "Item 6",
    category: "B",
    base: "45.00",
    mrp: "65.00",
    selling: "58.00",
    stock: 0,
    status: "Out Of Stock",
  },
];

export default function ProductTable() {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Product
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Base Price (LKR)
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              MRP (LKR)
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              My Selling Price (LKR)
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Stock
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-800">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">{item.id}</p>
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                {item.category}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                {item.base}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                {item.mrp}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-green-600">
                {item.selling}
              </td>

              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-800">
                  {item.stock}
                </p>

                <p
                  className={`text-xs font-semibold ${
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

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-sky-500 hover:bg-sky-50">
                    Edit Price
                  </button>

                  <button className="p-2 border border-gray-300 rounded-md text-sky-500 hover:bg-sky-50">
                    <Eye size={16} />
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
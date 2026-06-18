import { Phone } from "lucide-react";

export default function ShopsTable({ shops }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Shop</th>
            <th>Contact</th>
            <th>Shop Details</th>
            <th>Credit Limit</th>
            <th>Status</th>
            <th>Registered On</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {shops.map((shop, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center text-xs font-bold text-blue-600 bg-blue-100 rounded-full w-9 h-9">
                    {shop.initials}
                  </div>

                  <div>
                    <p className="font-semibold">{shop.name}</p>
                    <p className="text-[10px] text-gray-500">{shop.id}</p>
                  </div>
                </div>
              </td>

              <td>
                <div className="flex items-center gap-2">
                  <Phone size={13} />
                  {shop.contact}
                </div>
              </td>

              <td>
                <p className="font-medium">{shop.address}</p>
                <p className="text-[10px] text-gray-500">{shop.city}</p>
              </td>

              <td>{shop.creditLimit}</td>

              <td>
                <span className={`px-4 py-1 text-[10px] font-semibold rounded ${getStatusStyle(shop.status)}`}>
                  {shop.status}
                </span>
              </td>

              <td>{shop.registeredOn}</td>

              <td>
                <button className="px-5 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getStatusStyle(status) {
  if (status === "Approved") return "text-green-600 bg-green-100";
  if (status === "Pending") return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
}
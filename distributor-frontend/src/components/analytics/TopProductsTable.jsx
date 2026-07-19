import AnalyticsCard from "./AnalyticsCard";

export default function TopProductsTable({ products }) {
  return (
    <AnalyticsCard title="Top Performing Products">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/50">
          <tr>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Orders</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Revenue (LKR)</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {products.map((item) => (
            <tr key={item.name} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-2.5 font-medium text-gray-900">{item.name}</td>
              <td className="px-4 py-2.5 text-right text-gray-700">{item.orders}</td>
              <td className="px-4 py-2.5 text-right font-semibold text-green-600">{item.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="mt-4 text-sm font-semibold text-blue-600">
        View all products →
      </button>
    </AnalyticsCard>
  );
}
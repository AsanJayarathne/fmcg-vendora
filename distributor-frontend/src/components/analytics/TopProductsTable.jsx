import AnalyticsCard from "./AnalyticsCard";

export default function TopProductsTable({ products }) {
  return (
    <AnalyticsCard title="Top Performing Products">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-left">Product Name</th>
            <th className="text-left">Orders</th>
            <th className="text-left">Revenue (LKR)</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => (
            <tr key={item.name} className="border-b">
              <td className="py-3 font-medium">{item.name}</td>
              <td>{item.orders}</td>
              <td>{item.revenue}</td>
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
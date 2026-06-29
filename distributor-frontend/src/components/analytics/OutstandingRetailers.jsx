import AnalyticsCard from "./AnalyticsCard";

export default function OutstandingRetailers({ retailers }) {
  return (
    <AnalyticsCard
      title="Outstanding by Retailer"
      action={<button className="text-xs font-semibold text-blue-600">View All</button>}
    >
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-left">Retailer Name</th>
            <th className="text-left">Outstanding (LKR)</th>
          </tr>
        </thead>

        <tbody>
          {retailers.map((item) => (
            <tr key={item.name} className="border-b">
              <td className="py-3">{item.name}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="mt-4 text-sm font-semibold text-blue-600">
        View all outstanding →
      </button>
    </AnalyticsCard>
  );
}
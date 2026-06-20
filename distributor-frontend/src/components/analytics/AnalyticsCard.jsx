export default function AnalyticsCard({ title, children, action }) {
  return (
    <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>

        {action || (
          <select className="px-3 py-1 text-xs border rounded-md">
            <option>This Week</option>
            <option>This Month</option>
          </select>
        )}
      </div>

      {children}
    </div>
  );
}
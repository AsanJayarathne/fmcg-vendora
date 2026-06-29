export default function AnalyticsKpiCards({ kpis }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-6">
      {kpis.map((item) => (
        <div
          key={item.title}
          className={`p-5 border border-gray-200 rounded-2xl ${item.bg}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-full ${item.iconBg} ${item.iconColor}`}
            >
              {item.icon}
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700">{item.title}</p>
              <h2 className="text-2xl font-bold text-gray-900">{item.value}</h2>
              <p className={`text-xs font-medium ${item.changeColor}`}>
                {item.change}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
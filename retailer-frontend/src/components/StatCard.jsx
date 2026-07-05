export default function StatCard({
  title,
  value,
  icon,
  color = "blue",
  subtitle,
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <div className={`p-4 rounded-xl border shadow-sm ${colorMap[color]}`}>
      
      {/* TOP ROW */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600">
          {title}
        </h3>

        {icon && (
          <div className="text-lg opacity-80">
            {icon}
          </div>
        )}
      </div>

      {/* VALUE */}
      <div className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </div>

      {/* SUBTITLE (optional) */}
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">
          {subtitle}
        </p>
      )}

    </div>
  );
}
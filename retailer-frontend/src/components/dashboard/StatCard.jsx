import { useEffect, useState } from "react";

export default function StatCard({ title, value, color = "blue", subtitle, icon }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const iconBg = {
    blue: "bg-white/80 text-blue-600",
    green: "bg-white/80 text-green-600",
    orange: "bg-white/80 text-orange-600",
    red: "bg-white/80 text-red-600",
    purple: "bg-white/80 text-purple-600",
    gray: "bg-white/80 text-gray-600",
  };

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm transform transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-105 ${
        mounted ? "opacity-100 scale-100 -translate-y-0" : "opacity-0 scale-95 translate-y-2"
      } ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</div>
          <h3 className="text-sm font-medium text-gray-600 mt-1">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg[color]} shadow-sm`}> 
            <div className="text-xl opacity-90">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
}
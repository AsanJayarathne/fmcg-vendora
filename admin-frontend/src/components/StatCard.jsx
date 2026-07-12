import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  bgColor = "bg-slate-200",
  iconBg = "bg-white",
  loading = false,
}) => {
  return (
    <div className={`${bgColor} rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-transform hover:-translate-y-0.5`}>
      {/* Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg} flex-shrink-0`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-700">
          {title}
        </h4>

        {loading ? (
          <div className="h-8 w-20 bg-black/10 rounded-lg mt-1 animate-pulse" />
        ) : (
          <h2 className="text-2xl font-bold leading-tight text-gray-900">
            {value}
          </h2>
        )}

        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

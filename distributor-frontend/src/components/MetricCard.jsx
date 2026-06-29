export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  bgColor = "bg-slate-200",
  iconBg = "bg-white",
}) {
  return (
    <div
      className={`
        ${bgColor}
        rounded-2xl
        px-4
        py-4
        flex
        items-center
        gap-4
        shadow-sm
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-12
          h-12
          rounded-full
          flex
          items-center
          justify-center
          ${iconBg}
          flex-shrink-0
        `}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-700">
          {title}
        </h4>

        <h2 className="text-2xl font-bold leading-tight text-gray-900">
          {value}
        </h2>

        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
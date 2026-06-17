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
        rounded-[30px]
        px-4
        py-3
        flex
        items-center
        gap-5
        shadow-sm
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-16
          h-16
          rounded-full
          flex
          items-center
          justify-center
          ${iconBg}
        `}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-xl font-semibold text-gray-800">
          {title}
        </h4>

        <h2 className="text-4xl font-bold leading-tight text-gray-900">
          {value}
        </h2>

        <p className="text-lg text-gray-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
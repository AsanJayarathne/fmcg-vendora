function StatCard({
  title,
  value,
  percentage,
  icon: Icon,
  iconColor = "text-gray-500",
  percentageColor = "text-green-600"
}) {
  return (
    <div className="bg-[#F7F1EA] rounded-3xl p-5 flex justify-between items-center min-h-[110px]">
      <div>
        <h4 className="text-sm font-medium text-black mb-4">
          {title}
        </h4>

        <div className="text-3xl font-semibold text-black">
          {value}
        </div>

        <div className={`text-sm mt-1 ${percentageColor}`}>
          {percentage}
        </div>
      </div>

      <Icon
        size={42}
        className={iconColor}
      />
    </div>
  );
}

export default StatCard;
function StatCard({ label, value, icon, color, percentage, percentageUp }) {
  const Icon = icon;
  return (
    <div className="bg-orange-50 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {Icon && <Icon size={36} className="text-gray-300" />}
      </div>
      <div className={`text-3xl font-bold text-gray-800`}>{value}</div>
      <div className={`text-xs font-medium ${percentageUp ? 'text-green-500' : 'text-red-500'}`}>
        {percentageUp ? '↑' : '↓'} {percentage}
      </div>
    </div>
  );
}

export default StatCard;
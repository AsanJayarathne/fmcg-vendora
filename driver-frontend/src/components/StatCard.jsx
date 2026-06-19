function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
        <Icon size={15} /> {label}
      </div>
      <div className={`text-2xl font-medium ${color}`}>{value}</div>
    </div>
  );
}

export default StatCard;
function OrderStatCard({ icon, label, value, linkText, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 items-start">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-blue-600 mt-1">{linkText}</p>
      </div>
    </div>
  );
}

export default OrderStatCard;

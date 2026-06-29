import { Calendar } from "lucide-react";

export default function AnalyticsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-sm text-gray-500">
          Real-time insights into your business performance
        </p>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border rounded-lg">
        <Calendar size={16} />
        This Week
      </button>
    </div>
  );
}
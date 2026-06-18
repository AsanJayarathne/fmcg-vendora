import { Search, Calendar, RotateCcw } from "lucide-react";

export default function DeliveryFilters() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center px-3 border rounded-md w-44">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 text-xs outline-none"
          />
          <Search size={14} className="text-gray-400" />
        </div>

        <select className="px-6 py-2 text-xs font-semibold border rounded-md">
          <option>Status</option>
          <option>Delivered</option>
          <option>Returned</option>
          <option>Pending</option>
        </select>

        <button className="flex items-center gap-2 px-6 py-2 text-xs font-semibold border rounded-md">
          <Calendar size={14} />
          May 20 , 2026
        </button>
      </div>

      <button className="flex items-center gap-2 px-6 py-2 text-xs font-semibold border rounded-md">
        <RotateCcw size={15} />
        Reset Filters
      </button>
    </div>
  );
}
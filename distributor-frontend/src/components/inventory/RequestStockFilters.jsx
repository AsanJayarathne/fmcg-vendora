import { Search, RotateCcw } from "lucide-react";

export default function RequestStockFilters() {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex gap-8">
        <div className="flex items-center px-3 border rounded-md w-44">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 text-xs outline-none"
          />
          <Search size={14} className="text-gray-400" />
        </div>

        <select className="px-6 py-2 text-xs font-semibold border rounded-md">
          <option>All Categories</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>

        <select className="px-6 py-2 text-xs font-semibold border rounded-md">
          <option>Status</option>
          <option>Available</option>
          <option>Low Stock</option>
        </select>
      </div>

      <button className="flex items-center gap-2 px-6 py-2 text-xs font-semibold border rounded-md">
        <RotateCcw size={15} />
        Reset Filters
      </button>
    </div>
  );
}
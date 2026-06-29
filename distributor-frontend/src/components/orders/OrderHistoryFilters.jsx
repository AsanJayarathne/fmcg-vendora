import { Calendar, RotateCcw } from "lucide-react";

export default function OrderHistoryFilters() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-wrap gap-6">
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border rounded-md">
          01 Jan 2026 -31 May 2026
          <Calendar size={14} />
        </button>

        <select className="px-5 py-2 text-xs font-semibold border rounded-md">
          <option>All Retailer</option>
          <option>Star Grocery Store</option>
          <option>Asan Grocery Store</option>
        </select>

        <select className="px-5 py-2 text-xs font-semibold border rounded-md">
          <option>Status</option>
          <option>Delivered</option>
          <option>Returned</option>
          <option>Cancelled</option>
        </select>

        <select className="px-5 py-2 text-xs font-semibold border rounded-md">
          <option>All Payment Methods</option>
          <option>Cash</option>
          <option>Credit</option>
          <option>Partial</option>
        </select>
      </div>

      <button className="flex items-center gap-2 px-5 py-2 text-xs font-semibold border rounded-md">
        <RotateCcw size={15} />
        Reset Filters
      </button>
    </div>
  );
}
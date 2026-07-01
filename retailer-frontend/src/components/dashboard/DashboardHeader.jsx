import { FiBarChart2, FiCalendar } from "react-icons/fi";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-6">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FiBarChart2 />
          Dashboard
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Welcome back 👋 | Here is your store performance overview
        </p>
      </div>

      {/* RIGHT SIDE (DATE / FILTER) */}
      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white shadow-sm">
          <FiCalendar className="text-gray-500" />
          <select className="outline-none bg-transparent text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Week</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition">
          Filters
        </button>

      </div>

    </div>
  );
}
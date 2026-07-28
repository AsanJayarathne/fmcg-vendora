import { FiHome, FiCalendar } from "react-icons/fi";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <FiHome className="text-blue-500" />
          Dashboard
        </h1>

        <p className="text-slate-400 text-sm mt-1 font-normal">
          Welcome back 👋 &nbsp;|&nbsp; Here is your store performance overview
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-white shadow-sm">
          <FiCalendar className="text-slate-400" />
          <select className="outline-none bg-transparent text-sm font-medium text-slate-600">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Week</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition">
          Filters
        </button>

      </div>

    </div>
  );
}
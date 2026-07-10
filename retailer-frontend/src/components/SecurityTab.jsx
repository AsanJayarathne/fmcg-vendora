export default function SecurityTab() {
  return (
    <div className="p-6 max-w-lg">

      <h2 className="text-lg font-bold text-slate-900 mb-6">Change Password</h2>

      <div className="space-y-5">

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter current password"
            className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Re-enter new password"
            className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="pt-2">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>

      </div>
    </div>
  );
}
import { User, Lock, Save } from "lucide-react";

export default function ProfileSettings({ user, onChangePassword }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-blue-100 rounded-full">
          <User size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-sm text-gray-500">
            Manage your distributor profile information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Full Name</label>
          <input
            defaultValue={user.fullName}
            className="w-full px-4 py-3 mt-2 text-sm border rounded-lg outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Email Address</label>
          <input
            defaultValue={user.email}
            className="w-full px-4 py-3 mt-2 text-sm border rounded-lg outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Phone Number</label>
          <input
            defaultValue={user.phone}
            className="w-full px-4 py-3 mt-2 text-sm border rounded-lg outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Address</label>
          <input
            defaultValue={user.address}
            className="w-full px-4 py-3 mt-2 text-sm border rounded-lg outline-none"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onChangePassword}
          className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-blue-600 border border-blue-500 rounded-lg"
        >
          <Lock size={16} />
          Change Password
        </button>

        <button className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg">
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
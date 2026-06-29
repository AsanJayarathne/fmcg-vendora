import { X, Lock } from "lucide-react";

export default function ChangePasswordModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md p-6 bg-white rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Change Password</h2>
            <p className="text-sm text-gray-500">
              Update your account password
            </p>
          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-4 py-3 mt-2 text-sm border rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-3 mt-2 text-sm border rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-3 mt-2 text-sm border rounded-lg outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold border rounded-lg"
          >
            Cancel
          </button>

          <button className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg">
            <Lock size={16} />
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
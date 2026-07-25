import { useState } from "react";
import { X, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { changePassword } from "../../services/profileApi";

export default function ChangePasswordModal({ onClose }) {
  const { auth } = useAuth();

  const [form, setForm] = useState({ old: "", new: "", confirm: "" });
  const [showOld, setShowOld]       = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (!form.old || !form.new || !form.confirm) {
      setToast({ type: "error", msg: "All fields are required." });
      return;
    }
    if (form.new.length < 6) {
      setToast({ type: "error", msg: "New password must be at least 6 characters." });
      return;
    }
    if (form.new !== form.confirm) {
      setToast({ type: "error", msg: "New passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      await changePassword(auth.token, form.old, form.new);
      setToast({ type: "success", msg: "Password changed successfully!" });
      setTimeout(onClose, 1800);
    } catch (err) {
      setToast({ type: "error", msg: err.message || "Failed to change password." });
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ field, label, show, onToggle }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={form[field]}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-blue-100 rounded-xl">
              <Lock size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500">Update your account password</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Toast */}
          {toast && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
              toast.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {toast.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
              {toast.msg}
            </div>
          )}

          <PasswordInput field="old"     label="Current Password" show={showOld}     onToggle={() => setShowOld(!showOld)}         />
          <PasswordInput field="new"     label="New Password"     show={showNew}     onToggle={() => setShowNew(!showNew)}         />
          <PasswordInput field="confirm" label="Confirm Password" show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />

          {/* Strength hint */}
          {form.new.length > 0 && form.new.length < 6 && (
            <p className="text-xs text-orange-500">Password must be at least 6 characters.</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Lock size={14} />
              )}
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
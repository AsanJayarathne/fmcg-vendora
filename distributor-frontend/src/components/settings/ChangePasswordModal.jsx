import { useState } from "react";
import { X, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
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
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={form[field]}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full px-4 py-3 pr-10 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition shadow-2xs"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-full font-black text-sm">
              <Lock size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Change Password</h2>
              <p className="text-xs text-slate-400 font-medium">Update account login password</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
          {/* Toast */}
          {toast && (
            <div
              className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs font-bold border ${
                toast.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {toast.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              {toast.msg}
            </div>
          )}

          <PasswordInput field="old"     label="Current Password" show={showOld}     onToggle={() => setShowOld(!showOld)}         />
          <PasswordInput field="new"     label="New Password"     show={showNew}     onToggle={() => setShowNew(!showNew)}         />
          <PasswordInput field="confirm" label="Confirm Password" show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />

          {/* Strength hint */}
          {form.new.length > 0 && form.new.length < 6 && (
            <p className="text-[11px] font-bold text-amber-600">Password must be at least 6 characters.</p>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-60 transition cursor-pointer shadow-xs shadow-blue-600/20"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Lock size={13} />
              )}
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
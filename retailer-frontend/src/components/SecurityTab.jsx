import { useState } from "react";
import { FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { updatePassword } from "../services/orderService";

export default function SecurityTab() {
  const { auth } = useAuth();
  const token = auth?.token ?? null;

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI status states
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await updatePassword(token, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-7 max-w-lg space-y-6">
      <div>
        <h2 className="text-base font-black text-slate-800 uppercase tracking-wider mb-1">Change Password</h2>
        <p className="text-xs text-slate-400 font-bold">Ensure your account uses a secure password phrase.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100/50 text-red-750 px-4.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <FiAlertCircle /> {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-100/50 text-green-750 px-4.5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
          <FiCheckCircle /> {message}
        </div>
      )}

      <div className="space-y-4">
        <PasswordField
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          required
        />

        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />

        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          required
        />

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-755 text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer shadow-xs transition disabled:bg-slate-205 flex items-center gap-2"
          >
            {saving && <FiLoader className="animate-spin" />}
            {saving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </form>
  );
}

function PasswordField({ label, value, placeholder, onChange, required = false }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full h-12 border border-slate-200 rounded-2xl px-4 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
      />
    </div>
  );
}
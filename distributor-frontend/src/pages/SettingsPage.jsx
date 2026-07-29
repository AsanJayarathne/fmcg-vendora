import { useState, useEffect } from "react";
import ProfileSettings from "../components/settings/ProfileSettings";
import ChangePasswordModal from "../components/settings/ChangePasswordModal";
import { useAuth } from "../auth/AuthContext";
import { fetchProfile } from "../services/profileApi";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { auth } = useAuth();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    if (!auth?.token) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchProfile(auth.token);
      setProfile(data);
    } catch (e) {
      setError(e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [auth?.token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <ProfileSettings
        profile={profile}
        onChangePassword={() => setIsPasswordOpen(true)}
        onSaved={loadProfile}
      />

      {isPasswordOpen && (
        <ChangePasswordModal onClose={() => setIsPasswordOpen(false)} />
      )}
    </div>
  );
}
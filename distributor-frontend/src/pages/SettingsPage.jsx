import { useState, useEffect } from "react";
import ProfileSettings from "../components/settings/ProfileSettings";
import ChangePasswordModal from "../components/settings/ChangePasswordModal";
import MetricCard from "../components/MetricCard";
import { useAuth } from "../auth/AuthContext";
import { fetchProfile } from "../services/profileApi";
import { Settings, ShieldCheck, MapPin, FileText, Award, Loader2, RotateCcw } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center min-h-[450px] bg-white border border-slate-100 rounded-[32px] gap-3 text-slate-500 shadow-xs">
        <Loader2 className="w-9 h-9 animate-spin text-blue-600" />
        <p className="text-xs font-bold text-slate-600">Loading enterprise profile & security settings...</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <Settings className="inline mr-3 text-blue-600 w-8 h-8" />
          Account Settings
          {!loading && (
            <span className="ml-3 text-base font-normal text-slate-500">
              (Live FMCG Network Profile)
            </span>
          )}
        </h1>

        <button
          onClick={loadProfile}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition cursor-pointer disabled:opacity-50"
          title="Refresh Profile"
        >
          <RotateCcw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl shadow-2xs">
          ⚠️ {error}
        </div>
      )}

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Account Status"
          value={profile?.status || "Approved"}
          subtitle="Verified Network Partner"
          icon={<ShieldCheck size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Assigned Territory"
          value={profile?.region_name ? `${profile.region_name}` : "Colombo"}
          subtitle={`Region #${profile?.region_id || 1} Distribution Hub`}
          icon={<MapPin size={20} />}
          color="blue"
        />
        <MetricCard
          title="Business Reg. No."
          value={profile?.reg_number || "REG-001"}
          subtitle="Ministry Verified Entity"
          icon={<FileText size={20} />}
          color="amber"
        />
        <MetricCard
          title="FMCG Operating License"
          value={profile?.lic_number || "LIC-001"}
          subtitle="Tier-1 Distribution Authorization"
          icon={<Award size={20} />}
          color="violet"
        />
      </div>

      {/* Main Settings Sections */}
      <ProfileSettings
        profile={profile}
        onChangePassword={() => setIsPasswordOpen(true)}
        onSaved={loadProfile}
      />

      {/* Change Password Modal */}
      {isPasswordOpen && (
        <ChangePasswordModal onClose={() => setIsPasswordOpen(false)} />
      )}
    </div>
  );
}
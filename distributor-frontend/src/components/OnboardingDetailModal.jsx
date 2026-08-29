import { X, Check, ShieldOff, User } from "lucide-react";

export default function OnboardingDetailModal({
  title,
  idLabel,
  avatarColor = "text-blue-600 bg-blue-50 border border-blue-100",
  status,
  fields = [],
  onClose,
  onAction,
  actionLoading = "",
  actionError = "",
}) {
  const initials = (title || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 transform transition-all scale-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center text-xs font-black rounded-full w-10 h-10 shrink-0 ${avatarColor}`}
            >
              {initials}
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base leading-tight">{title}</h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{idLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status badge */}
          <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Account Status
            </span>
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getStatusStyle(status)}`}
            >
              {status}
            </span>
          </div>

          {/* Detail fields grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            {fields.map((field, i) => (
              <DetailRow key={i} icon={field.icon} label={field.label} value={field.value} />
            ))}
          </div>

          {/* Error message */}
          {actionError && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              ⚠️ {actionError}
            </p>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            {status !== "Approved" && (
              <ActionButton
                label="Approve Account"
                icon={<Check size={16} />}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                loading={actionLoading === "Approved"}
                onClick={() => onAction("Approved")}
              />
            )}

            {status !== "Blocked" && (
              <ActionButton
                label={status === "Approved" ? "Block Account" : "Block"}
                icon={<ShieldOff size={15} />}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-2xs"
                loading={actionLoading === "Blocked"}
                onClick={() => onAction("Blocked")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Internal sub-components ─────────────────────────────────────────────── */

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      {icon ? <span className="text-blue-600 mt-0.5 shrink-0">{icon}</span> : <User size={14} className="text-blue-600 mt-0.5 shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-slate-800 font-bold text-xs truncate mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

function ActionButton({ label, icon, className, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 cursor-pointer ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}

/* ── Shared helpers ──────────────────────────────────────────────────────── */

export function getStatusStyle(status) {
  if (status === "Approved") return "text-emerald-700 bg-emerald-50 border border-emerald-200/60";
  if (status === "Pending Approval" || status === "Pending") return "text-amber-700 bg-amber-50 border border-amber-200/60";
  if (status === "Blocked") return "text-orange-700 bg-orange-50 border border-orange-200/60";
  return "text-rose-700 bg-rose-50 border border-rose-200/60";
}

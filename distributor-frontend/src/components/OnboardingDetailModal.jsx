import { X, Check, XCircle, ShieldOff } from "lucide-react";

/**
 * Reusable detail + action modal for onboarding entities (shops, drivers, etc.)
 *
 * Props:
 *  - title        {string}   Primary name shown in header
 *  - idLabel      {string}   Formatted ID shown below the name (e.g. "SHOP-0001")
 *  - avatarColor  {string}   Tailwind classes for avatar text + bg (e.g. "text-blue-600 bg-blue-100")
 *  - status       {string}   Current status of the entity
 *  - fields       {Array}    [{ icon: <JSX />, label: string, value: string }]
 *  - onClose      {fn}       Called when the modal should close
 *  - onAction     {fn}       Called with (status: string) when an action button is clicked
 *  - actionLoading {string}  Which status is currently loading ("Approved" | "Rejected" | "Blocked" | "")
 *  - actionError  {string}   Error message to display inside the modal
 */
export default function OnboardingDetailModal({
  title,
  idLabel,
  avatarColor = "text-blue-600 bg-blue-100",
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center text-sm font-bold rounded-full w-11 h-11 shrink-0 ${avatarColor}`}
            >
              {initials}
            </div>
            <div>
              <h2 className="font-bold text-gray-800">{title}</h2>
              <p className="text-xs text-gray-500">{idLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(status)}`}
            >
              {status}
            </span>
          </div>

          {/* Detail fields grid */}
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field, i) => (
              <DetailRow key={i} icon={field.icon} label={field.label} value={field.value} />
            ))}
          </div>

          {/* Error message */}
          {actionError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {actionError}
            </p>
          )}

          {/* Action buttons */}
          {status !== "Approved" && (
            <ActionButton
              label="Approve"
              icon={<Check size={14} />}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              loading={actionLoading === "Approved"}
              onClick={() => onAction("Approved")}
            />
          )}

          <div className="flex gap-3">
            {status !== "Rejected" && (
              <ActionButton
                label="Reject"
                icon={<XCircle size={14} />}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                loading={actionLoading === "Rejected"}
                onClick={() => onAction("Rejected")}
              />
            )}
            {status !== "Blocked" && (
              <ActionButton
                label="Block"
                icon={<ShieldOff size={14} />}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
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
      <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-gray-400 uppercase font-semibold">{label}</p>
        <p className="text-gray-700 font-medium text-xs">{value || "—"}</p>
      </div>
    </div>
  );
}

function ActionButton({ label, icon, className, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${className}`}
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
  if (status === "Approved") return "text-green-600 bg-green-100";
  if (status === "Pending Approval" || status === "Pending") return "text-yellow-600 bg-yellow-100";
  if (status === "Blocked") return "text-orange-600 bg-orange-100";
  return "text-red-600 bg-red-100";
}

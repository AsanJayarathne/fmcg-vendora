import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  Truck,
  Store,
  User,
  Car,
  FileText,
  DollarSign,
  MessageSquare,
  Clock,
  CheckCircle2,
  RotateCcw,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { fetchApprovedDrivers, assignDriver } from "../../services/deliveryApi";

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmt(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function fmtAmount(val) {
  if (val === null || val === undefined) return "—";
  return Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

const STATUS_CONFIG = {
  OPEN:      { label: "Open",      color: "bg-amber-100 text-amber-700"    },
  CLAIMED:   { label: "Claimed",   color: "bg-blue-100 text-blue-700"      },
  DELIVERED: { label: "Delivered", color: "bg-emerald-100 text-emerald-700"},
  RETURNED:  { label: "Returned",  color: "bg-red-100 text-red-700"        },
};

// ─── Info Row ───────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, valueClass = "text-gray-800" }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 break-words ${valueClass}`}>{value ?? "—"}</p>
      </div>
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ icon, title }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
      {icon}
      {title}
    </p>
  );
}

// ─── Assign Driver Sub-Modal ─────────────────────────────────────────────────
function AssignDriverPanel({ deliveryId, onAssigned, onCancel }) {
  const { auth } = useAuth();
  const [drivers, setDrivers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    fetchApprovedDrivers(auth?.token)
      .then(setDrivers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [auth?.token]);

  async function handleAssign() {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      await assignDriver(auth?.token, deliveryId, selected);
      onAssigned();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <div className="border border-blue-100 rounded-xl bg-blue-50/50 p-4 space-y-3">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Assign Driver</p>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 size={22} className="animate-spin text-blue-500" />
        </div>
      ) : drivers.length === 0 ? (
        <p className="text-xs text-gray-500 py-2">No approved drivers available.</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {drivers.map((d) => (
            <button
              key={d.driver_id}
              onClick={() => setSelected(d.driver_id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition ${
                selected === d.driver_id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-xs font-bold shrink-0">
                {(d.full_name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{d.full_name}</p>
                <p className="text-[10px] text-gray-400">{d.vehicle_number} · {d.license_number}</p>
              </div>
              {selected === d.driver_id && (
                <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleAssign}
          disabled={!selected || saving}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition disabled:opacity-50"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
          Confirm Assignment
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({ icon, label, date, done }) {
  return (
    <div className={`flex items-start gap-3 ${done ? "opacity-100" : "opacity-40"}`}>
      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        <p className="text-[10px] text-gray-400">{date}</p>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function DeliveryDetailModal({ delivery, onClose, onRefresh }) {
  const [showAssign, setShowAssign] = useState(false);

  if (!delivery) return null;

  const badge = STATUS_CONFIG[delivery.status] ?? { label: delivery.status, color: "bg-gray-100 text-gray-600" };

  const paymentColor =
    delivery.payment_method === "Cash"        ? "text-green-600" :
    delivery.payment_method === "Credit"      ? "text-red-500"   :
    delivery.payment_method === "Cash_Credit" ? "text-purple-600": "text-gray-700";

  const isOpen      = delivery.status === "OPEN";
  const isDelivered = delivery.status === "DELIVERED";
  const isReturned  = delivery.status === "RETURNED";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Delivery Details</p>
            <h2 className="text-lg font-bold text-gray-900 mt-0.5">
              DEL-{String(delivery.delivery_id).padStart(4, "0")}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
              {badge.label}
            </span>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Order Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <SectionHeader icon={<FileText size={12} />} title="Order Information" />
            <div className="grid grid-cols-2 gap-3">
              <InfoRow
                icon={<FileText size={14} />}
                label="Order ID"
                value={`#${delivery.order_id}`}
                valueClass="font-mono text-gray-900"
              />
              <InfoRow
                icon={<DollarSign size={14} />}
                label="Total Amount"
                value={`LKR ${fmtAmount(delivery.total_amount)}`}
                valueClass="text-gray-900"
              />
              <InfoRow
                icon={<DollarSign size={14} />}
                label="Payment Method"
                value={delivery.payment_method ?? "—"}
                valueClass={paymentColor}
              />
              {(isDelivered || isReturned) && (
                <InfoRow
                  icon={<DollarSign size={14} />}
                  label="Collected Amount"
                  value={delivery.collected_amount != null ? `LKR ${fmtAmount(delivery.collected_amount)}` : "—"}
                  valueClass={isDelivered ? "text-green-600" : "text-gray-700"}
                />
              )}
            </div>
          </div>

          {/* Retailer Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <SectionHeader icon={<Store size={12} />} title="Retailer" />
            <div className="space-y-3">
              <InfoRow icon={<Store size={14} />} label="Shop Name" value={delivery.shop_name} />
              <InfoRow icon={<User size={14} />} label="Owner" value={delivery.owner_name} />
              {delivery.shop_address && (
                <InfoRow icon={<FileText size={14} />} label="Address" value={delivery.shop_address} />
              )}
            </div>
          </div>

          {/* Driver Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <SectionHeader icon={<Truck size={12} />} title="Driver" />
              {isOpen && !showAssign && (
                <button
                  onClick={() => setShowAssign(true)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  <UserPlus size={12} />
                  Assign Driver
                </button>
              )}
            </div>

            {showAssign ? (
              <AssignDriverPanel
                deliveryId={delivery.delivery_id}
                onAssigned={() => { setShowAssign(false); onRefresh(); onClose(); }}
                onCancel={() => setShowAssign(false)}
              />
            ) : delivery.driver_id ? (
              <div className="space-y-3">
                <InfoRow icon={<User size={14} />} label="Driver Name" value={delivery.driver_name ?? delivery.full_name} />
                <InfoRow icon={<Car size={14} />} label="Vehicle No." value={delivery.vehicle_number} />
                <InfoRow icon={<FileText size={14} />} label="License No." value={delivery.license_number} />
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2 text-gray-400">
                <User size={16} />
                <p className="text-sm">No driver assigned yet</p>
              </div>
            )}
          </div>

          {/* Remarks */}
          {delivery.remarks && (
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <SectionHeader icon={<MessageSquare size={12} />} title="Remarks" />
              <p className="text-sm text-gray-700 leading-relaxed">{delivery.remarks}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <SectionHeader icon={<Clock size={12} />} title="Timeline" />
            <div className="space-y-3 ml-1">
              <TimelineItem
                icon={<Truck size={11} />}
                label="Delivery Created"
                date={fmt(delivery.created_at)}
                done={true}
              />
              <TimelineItem
                icon={<CheckCircle2 size={11} />}
                label="Driver Claimed"
                date={delivery.claimed_at ? fmt(delivery.claimed_at) : "Awaiting"}
                done={!!delivery.claimed_at}
              />
              <TimelineItem
                icon={isReturned ? <RotateCcw size={11} /> : <CheckCircle2 size={11} />}
                label={isReturned ? "Returned" : "Delivered"}
                date={delivery.delivery_date ? fmt(delivery.delivery_date) : "Pending"}
                done={isDelivered || isReturned}
              />
            </div>
          </div>

        </div>

        {/* ── Footer: Assign Driver CTA for OPEN ── */}
        {isOpen && !showAssign && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowAssign(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
              <UserPlus size={16} />
              Assign Driver to This Delivery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

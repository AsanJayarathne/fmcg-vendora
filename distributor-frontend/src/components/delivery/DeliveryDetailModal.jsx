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
  Check,
  Layers,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { fetchApprovedDrivers, assignDriver } from "../../services/deliveryApi";

function fmt(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function fmtAmount(val) {
  if (val === null || val === undefined) return "—";
  return Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

const STATUS_CONFIG = {
  OPEN:      { label: "Open",      color: "bg-amber-50 text-amber-700 border border-amber-200/60"      },
  CLAIMED:   { label: "Claimed",   color: "bg-sky-50 text-sky-700 border border-sky-200/60"          },
  DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
  RETURNED:  { label: "Returned",  color: "bg-rose-50 text-rose-700 border border-rose-200/60"        },
};

function InfoRow({ icon, label, value, valueClass = "text-slate-800" }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-blue-600 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{label}</p>
        <p className={`text-xs font-bold mt-0.5 break-words ${valueClass}`}>{value ?? "—"}</p>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
      <span className="text-blue-600">{icon}</span>
      {title}
    </p>
  );
}

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
    <div className="border border-blue-100 rounded-2xl bg-blue-50/40 p-3 space-y-2">
      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Assign Driver</p>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 size={20} className="animate-spin text-blue-600" />
        </div>
      ) : drivers.length === 0 ? (
        <p className="text-xs text-slate-500 font-semibold py-1">No approved drivers available.</p>
      ) : (
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {drivers.map((d) => (
            <button
              key={d.driver_id}
              onClick={() => setSelected(d.driver_id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition cursor-pointer ${
                selected === d.driver_id
                  ? "border-blue-500 bg-blue-50 shadow-2xs"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
              }`}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold shrink-0">
                {(d.full_name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{d.full_name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{d.vehicle_number} · {d.license_number}</p>
              </div>
              {selected === d.driver_id && (
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleAssign}
          disabled={!selected || saving}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
          Confirm Assignment
        </button>
        <button
          onClick={onCancel}
          className="px-3.5 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function DeliveryDetailModal({ delivery, onClose, onRefresh }) {
  const [showAssign, setShowAssign] = useState(false);
  const [activeTab, setActiveTab]   = useState("All Details");

  if (!delivery) return null;

  const badge = STATUS_CONFIG[delivery.status] ?? { label: delivery.status, color: "bg-slate-100 text-slate-600 border border-slate-200" };

  const paymentColor =
    delivery.payment_method === "Cash"        ? "text-green-600" :
    delivery.payment_method === "Credit"      ? "text-purple-600" :
    delivery.payment_method === "Cash_Credit" ? "text-indigo-600" : "text-slate-700";

  const isOpen      = delivery.status === "OPEN";
  const isDelivered = delivery.status === "DELIVERED";
  const isReturned  = delivery.status === "RETURNED";

  const timelineSteps = [
    {
      name: "Created",
      date: fmt(delivery.created_at),
      completed: true,
    },
    {
      name: "Claimed",
      date: delivery.claimed_at ? fmt(delivery.claimed_at) : "Awaiting",
      completed: !!delivery.claimed_at,
    },
    {
      name: isReturned ? "Returned" : "Delivered",
      date: delivery.delivery_date ? fmt(delivery.delivery_date) : "Pending",
      completed: isDelivered || isReturned,
      isReturned: isReturned,
    },
  ];

  const modalTabs = ["All Details", "Order & Retailer", "Driver Info", "Status Progress"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden border border-slate-100 transform transition-all scale-100 animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Delivery Overview</span>
              <h2 className="text-base font-bold text-slate-800 leading-tight mt-0.5">
                DEL-{String(delivery.delivery_id).padStart(4, "0")}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.color}`}>
              {badge.label}
            </span>
            <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Nav Tabs (Non-scroll layout tabs) */}
        <div className="px-6 pt-3 pb-1 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {modalTabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === t
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Non-Scroll Body Content */}
        <div className="p-5 space-y-4">

          {/* Status Progress Stepper */}
          {(activeTab === "All Details" || activeTab === "Status Progress") && (
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3.5">
              <SectionHeader icon={<Clock size={13} />} title="Delivery Status Progress" />
              <div className="grid grid-cols-3 gap-2 pt-0.5 text-center">
                {timelineSteps.map((step) => {
                  const isComplete = step.completed;
                  const isErr = step.isReturned;
                  return (
                    <div key={step.name} className="relative flex flex-col items-center">
                      <div className={`h-1.5 w-full rounded-full mb-2 transition-all ${
                        isErr ? "bg-rose-500" : isComplete ? "bg-emerald-500" : "bg-slate-200"
                      }`} />
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isErr
                          ? "bg-rose-500 text-white shadow-2xs"
                          : isComplete
                            ? "bg-emerald-500 text-white shadow-2xs"
                            : "bg-white border-2 border-slate-200 text-slate-400"
                      }`}>
                        {isErr ? <RotateCcw size={11} /> : isComplete ? <Check size={12} /> : <Clock size={11} />}
                      </div>
                      <p className={`text-xs mt-1 font-bold ${isComplete ? "text-slate-800" : "text-slate-400"}`}>
                        {step.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{step.date}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Columns */}
          {(activeTab === "All Details" || activeTab === "Order & Retailer" || activeTab === "Driver Info") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Order & Retailer */}
              {(activeTab === "All Details" || activeTab === "Order & Retailer") && (
                <div className="space-y-3">
                  {/* Order Info */}
                  <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 space-y-2">
                    <SectionHeader icon={<FileText size={13} />} title="Order Information" />
                    <div className="grid grid-cols-2 gap-2">
                      <InfoRow
                        icon={<FileText size={13} />}
                        label="Order ID"
                        value={`#${delivery.order_id}`}
                        valueClass="font-bold text-blue-600"
                      />
                      <InfoRow
                        icon={<DollarSign size={13} />}
                        label="Total Amount"
                        value={`LKR ${fmtAmount(delivery.total_amount)}`}
                        valueClass="font-bold text-slate-900"
                      />
                      <InfoRow
                        icon={<DollarSign size={13} />}
                        label="Payment Method"
                        value={delivery.payment_method ?? "—"}
                        valueClass={`font-bold ${paymentColor}`}
                      />
                      {(isDelivered || isReturned) && (
                        <InfoRow
                          icon={<DollarSign size={13} />}
                          label="Collected Amount"
                          value={delivery.collected_amount != null ? `LKR ${fmtAmount(delivery.collected_amount)}` : "—"}
                          valueClass={isDelivered ? "font-bold text-green-600" : "font-bold text-slate-700"}
                        />
                      )}
                    </div>
                  </div>

                  {/* Retailer Info */}
                  <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 space-y-2">
                    <SectionHeader icon={<Store size={13} />} title="Retailer Details" />
                    <div className="space-y-2">
                      <InfoRow icon={<Store size={13} />} label="Shop Name" value={delivery.shop_name} />
                      <InfoRow icon={<User size={13} />} label="Owner" value={delivery.owner_name} />
                      {delivery.shop_address && (
                        <InfoRow icon={<FileText size={13} />} label="Address" value={delivery.shop_address} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Driver Info & Assignment */}
              {(activeTab === "All Details" || activeTab === "Driver Info") && (
                <div className="space-y-3 flex flex-col">
                  <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 space-y-2 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <SectionHeader icon={<Truck size={13} />} title="Driver Information" />
                      {isOpen && !showAssign && (
                        <button
                          onClick={() => setShowAssign(true)}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
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
                      <div className="space-y-2">
                        <InfoRow icon={<User size={13} />} label="Driver Name" value={delivery.driver_name ?? delivery.full_name} />
                        <InfoRow icon={<Car size={13} />} label="Vehicle No." value={delivery.vehicle_number} />
                        <InfoRow icon={<FileText size={13} />} label="License No." value={delivery.license_number} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-slate-400">
                        <User size={20} className="mb-1 text-slate-300" />
                        <p className="text-xs font-semibold">No driver assigned yet</p>
                        {isOpen && (
                          <button
                            onClick={() => setShowAssign(true)}
                            className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer shadow-2xs"
                          >
                            Assign Driver Now
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remarks */}
                  {delivery.remarks && (
                    <div className="bg-slate-50/70 rounded-2xl p-3.5 border border-slate-100 space-y-1">
                      <SectionHeader icon={<MessageSquare size={13} />} title="Remarks" />
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{delivery.remarks}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
          >
            Close
          </button>
          {isOpen && !showAssign && (
            <button
              onClick={() => setShowAssign(true)}
              className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <UserPlus size={15} />
              Assign Driver
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

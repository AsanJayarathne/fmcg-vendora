import { useState } from "react";
import { Phone, Eye } from "lucide-react";
import OnboardingDetailModal, { getStatusStyle } from "../OnboardingDetailModal";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function DriversTable({ drivers, onRefresh }) {
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState("");
  const [actionError, setActionError] = useState("");

  async function handleAction(status) {
    setActionLoading(status);
    setActionError("");
    try {
      const token = localStorage.getItem("vendora_token");
      const res = await fetch(`${API_BASE}/distributor/drivers.php?id=${selected.driver_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Action failed");
      setSelected(null);
      onRefresh();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading("");
    }
  }

  if (drivers.length === 0) {
    return (
      <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] p-16 text-center text-slate-400 shadow-xs">
        <p className="text-4xl mb-2">🚚</p>
        <p className="font-bold text-slate-800 text-sm">No drivers found</p>
        <p className="text-xs text-slate-400">There are no drivers matching your selected status or search term.</p>
      </div>
    );
  }

  // Build the fields array for the selected driver
  const modalFields = selected
    ? [
        { label: "Full Name", value: selected.full_name },
        { label: "Phone", value: selected.phone },
        { label: "Email", value: selected.email },
        { label: "Vehicle No.", value: selected.vehicle_number },
        { label: "License No.", value: selected.license_number },
        {
          label: "Registered",
          value: selected.created_at
            ? new Date(selected.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—",
        },
      ]
    : [];

  return (
    <>
      <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Driver Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Vehicle Details</th>
                <th className="px-6 py-4">License Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {drivers.map((driver) => (
                <tr key={driver.driver_id} className="hover:bg-slate-50/60 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full w-9 h-9 shrink-0">
                        {(driver.full_name || "?")
                          .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{driver.full_name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          DR-{String(driver.driver_id).padStart(4, "0")}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    <div className="flex items-center gap-2 font-medium">
                      <Phone size={13} className="text-slate-400" />
                      {driver.phone || "—"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    <p className="font-bold text-slate-800">{driver.vehicle_number || "—"}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Vehicle</p>
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    <p className="font-bold text-slate-800">{driver.license_number || "—"}</p>
                    <p className="text-[10px] text-slate-400 font-medium">License No.</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusStyle(driver.status)}`}>
                      {driver.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {driver.created_at
                      ? new Date(driver.created_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSelected(driver); setActionError(""); }}
                      className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center justify-center gap-1 mx-auto"
                    >
                      <Eye size={13} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <OnboardingDetailModal
          title={selected.full_name}
          idLabel={`DR-${String(selected.driver_id).padStart(4, "0")}`}
          avatarColor="text-emerald-600 bg-emerald-50 border border-emerald-100"
          status={selected.status}
          fields={modalFields}
          onClose={() => setSelected(null)}
          onAction={handleAction}
          actionLoading={actionLoading}
          actionError={actionError}
        />
      )}
    </>
  );
}
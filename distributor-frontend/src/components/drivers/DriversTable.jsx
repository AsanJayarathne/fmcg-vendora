import { useState } from "react";
import { Phone, Car, FileText, Calendar, User } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg text-gray-400">
        <div className="text-4xl mb-2">🚚</div>
        <p className="text-sm font-medium">No drivers found</p>
      </div>
    );
  }

  // Build the fields array for the selected driver
  const modalFields = selected
    ? [
        { icon: <User size={14} />, label: "Full Name", value: selected.full_name },
        { icon: <Phone size={14} />, label: "Phone", value: selected.phone },
        { icon: <FileText size={14} />, label: "Email", value: selected.email },
        { icon: <Car size={14} />, label: "Vehicle No.", value: selected.vehicle_number },
        { icon: <FileText size={14} />, label: "License No.", value: selected.license_number },
        {
          icon: <Calendar size={14} />,
          label: "Registered",
          value: selected.created_at
            ? new Date(selected.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "—",
        },
      ]
    : [];

  return (
    <>
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="border-b border-gray-200 bg-gray-50/75">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">License Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered On</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {drivers.map((driver) => (
              <tr key={driver.driver_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center text-xs font-bold text-green-600 bg-green-100 rounded-full w-9 h-9 shrink-0">
                      {(driver.full_name || "?")
                        .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{driver.full_name}</p>
                      <p className="text-[10px] text-gray-400">
                        DR-{String(driver.driver_id).padStart(4, "0")}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-3.5 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-gray-400" />
                    {driver.phone || "—"}
                  </div>
                </td>

                <td className="px-6 py-3.5 text-gray-700">
                  <p className="font-medium text-gray-800">{driver.vehicle_number || "—"}</p>
                  <p className="text-[10px] text-gray-500">Vehicle</p>
                </td>

                <td className="px-6 py-3.5 text-gray-700">
                  <p className="font-medium text-gray-800">{driver.license_number || "—"}</p>
                  <p className="text-[10px] text-gray-500">License No.</p>
                </td>

                <td className="px-6 py-3.5">
                  <span className={`px-4 py-1 text-[10px] font-semibold rounded ${getStatusStyle(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>

                <td className="px-6 py-3.5 text-gray-700">
                  {driver.created_at
                    ? new Date(driver.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : "—"}
                </td>

                <td className="px-6 py-3.5">
                  <button
                    onClick={() => { setSelected(driver); setActionError(""); }}
                    className="px-5 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md hover:bg-sky-50 transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <OnboardingDetailModal
          title={selected.full_name}
          idLabel={`DR-${String(selected.driver_id).padStart(4, "0")}`}
          avatarColor="text-green-600 bg-green-100"
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
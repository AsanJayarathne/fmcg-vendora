import { useState } from "react";
import { Phone, MapPin, Calendar, CreditCard, User } from "lucide-react";
import OnboardingDetailModal, { getStatusStyle } from "../OnboardingDetailModal";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function ShopsTable({ shops, creditAccounts = {}, onRefresh }) {
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState("");
  const [actionError, setActionError] = useState("");

  async function handleAction(status) {
    setActionLoading(status);
    setActionError("");
    try {
      const token = localStorage.getItem("vendora_token");
      const res = await fetch(`${API_BASE}/distributor/retailers.php?id=${selected.retailer_id}`, {
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

  if (shops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg text-gray-400">
        <div className="text-4xl mb-2">🏪</div>
        <p className="text-sm font-medium">No shops found</p>
      </div>
    );
  }

  // Build the fields array for the selected shop
  const modalFields = selected
    ? [
        { icon: <User size={14} />, label: "Owner", value: selected.owner_name || selected.full_name },
        { icon: <Phone size={14} />, label: "Phone", value: selected.phone || selected.contact },
        { icon: <MapPin size={14} />, label: "Address", value: selected.shop_address },
        { icon: <MapPin size={14} />, label: "City", value: selected.city },
        { icon: <CreditCard size={14} />, label: "NIC", value: selected.nic_number },
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
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credit Limit</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered On</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {shops.map((shop) => (
              <tr key={shop.retailer_id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center text-xs font-bold text-blue-600 bg-blue-100 rounded-full w-9 h-9 shrink-0">
                      {(shop.shop_name || shop.full_name || "?")
                        .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{shop.shop_name || shop.full_name}</p>
                      <p className="text-[10px] text-gray-400">
                        SHOP-{String(shop.retailer_id).padStart(4, "0")}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-3.5 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-gray-400" />
                    {shop.phone || shop.contact || "—"}
                  </div>
                </td>

                <td className="px-6 py-3.5 text-gray-700">
                  <p className="font-medium text-gray-800">{shop.shop_address || "—"}</p>
                  <p className="text-[10px] text-gray-500">{shop.city || "—"}</p>
                </td>

                <td className="px-6 py-3.5 text-gray-700 font-semibold">
                  {creditAccounts[shop.retailer_id]
                    ? `${Number(creditAccounts[shop.retailer_id].credit_limit).toLocaleString()}.00`
                    : <span className="text-gray-400 italic text-[10px]">Not Set</span>}
                </td>

                <td className="px-6 py-3.5">
                  <span className={`px-4 py-1 text-[10px] font-semibold rounded ${getStatusStyle(shop.status)}`}>
                    {shop.status}
                  </span>
                </td>

                <td className="px-6 py-3.5 text-gray-700">
                  {shop.created_at
                    ? new Date(shop.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : "—"}
                </td>

                <td className="px-6 py-3.5">
                  <button
                    onClick={() => { setSelected(shop); setActionError(""); }}
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
          title={selected.shop_name || selected.full_name}
          idLabel={`SHOP-${String(selected.retailer_id).padStart(4, "0")}`}
          avatarColor="text-blue-600 bg-blue-100"
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
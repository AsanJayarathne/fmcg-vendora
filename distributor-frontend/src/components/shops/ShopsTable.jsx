import { useState } from "react";
import { Phone, MapPin, Calendar, CreditCard, User, Eye } from "lucide-react";
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
      <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] p-16 text-center text-slate-400 shadow-xs">
        <p className="text-4xl mb-2">🏪</p>
        <p className="font-bold text-slate-800 text-sm">No shops found</p>
        <p className="text-xs text-slate-400">There are no retailer shops matching your criteria.</p>
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
                <th className="px-6 py-4">Shop Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Shop Location</th>
                <th className="px-6 py-4">Credit Limit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {shops.map((shop) => (
                <tr key={shop.retailer_id} className="hover:bg-slate-50/60 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full w-9 h-9 shrink-0">
                        {(shop.shop_name || shop.full_name || "?")
                          .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{shop.shop_name || shop.full_name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          SHOP-{String(shop.retailer_id).padStart(4, "0")}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    <div className="flex items-center gap-2 font-medium">
                      <Phone size={13} className="text-slate-400" />
                      {shop.phone || shop.contact || "—"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    <p className="font-semibold text-slate-800">{shop.shop_address || "—"}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{shop.city || "—"}</p>
                  </td>

                  <td className="px-6 py-4">
                    {creditAccounts[shop.retailer_id] ? (
                      <span className="font-bold text-slate-900">
                        LKR {Number(creditAccounts[shop.retailer_id].credit_limit).toLocaleString()}.00
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[10px]">Not Set</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusStyle(shop.status)}`}>
                      {shop.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {shop.created_at
                      ? new Date(shop.created_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSelected(shop); setActionError(""); }}
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
          title={selected.shop_name || selected.full_name}
          idLabel={`SHOP-${String(selected.retailer_id).padStart(4, "0")}`}
          avatarColor="text-blue-600 bg-blue-50 border border-blue-100"
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
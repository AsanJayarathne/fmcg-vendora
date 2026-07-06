import { useState, useEffect } from "react";
import { Save, Loader } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function SetCreditTable({ shops, creditAccounts: initialAccounts = {}, onRefresh }) {
  const [creditInputs, setCreditInputs] = useState({});
  // Keep a local copy that can be updated immediately after save without waiting for page-level refetch
  const [localAccounts, setLocalAccounts] = useState(initialAccounts);
  const [loadingId, setLoadingId] = useState(null);
  const [messages, setMessages] = useState({});

  // Sync when the parent refreshes (onRefresh triggers new props)
  useEffect(() => {
    setLocalAccounts(initialAccounts);
  }, [initialAccounts]);

  async function handleSave(shop) {
    const newLimit = parseFloat(creditInputs[shop.retailer_id] || "");
    if (!newLimit || newLimit <= 0) {
      setMessages((prev) => ({ ...prev, [shop.retailer_id]: { type: "error", text: "Enter a valid credit limit" } }));
      return;
    }

    setLoadingId(shop.retailer_id);
    setMessages((prev) => ({ ...prev, [shop.retailer_id]: null }));

    try {
      const token = localStorage.getItem("vendora_token");
      const account = localAccounts[shop.retailer_id];

      let res;
      if (account) {
        // Update existing credit limit
        res = await fetch(`${API_BASE}/distributor/credit.php?id=${account.credit_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credit_limit: newLimit }),
        });
      } else {
        // Create new credit account
        res = await fetch(`${API_BASE}/distributor/credit.php`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ retailer_id: shop.retailer_id, credit_limit: newLimit }),
        });
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to save credit");

      setMessages((prev) => ({ ...prev, [shop.retailer_id]: { type: "success", text: "Credit limit saved!" } }));
      setCreditInputs((prev) => ({ ...prev, [shop.retailer_id]: "" }));

      // Refresh the page-level data so All Shop tab and this table both update
      onRefresh();
    } catch (err) {
      setMessages((prev) => ({ ...prev, [shop.retailer_id]: { type: "error", text: err.message } }));
    } finally {
      setLoadingId(null);
    }
  }

  if (shops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg text-gray-400">
        <div className="text-4xl mb-2">💳</div>
        <p className="text-sm font-medium">No approved shops to set credit for</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Retailer ID</th>
            <th>Retailer</th>
            <th>Current Credit Limit</th>
            <th>New Credit Limit</th>
            <th>Outstanding</th>
            <th>Available Credit</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {shops.map((shop) => {
            const acct = localAccounts[shop.retailer_id];
            const isLoading = loadingId === shop.retailer_id;
            const msg = messages[shop.retailer_id];
            return (
              <tr key={shop.retailer_id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 font-mono">
                  SHOP-{String(shop.retailer_id).padStart(4, "0")}
                </td>
                <td className="font-medium">{shop.shop_name || shop.full_name}</td>

                <td>
                  {acct ? (
                    <span className="font-semibold text-gray-700">
                      {Number(acct.credit_limit).toLocaleString()}.00
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Not Set</span>
                  )}
                </td>

                <td>
                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      min="0"
                      placeholder="Enter amount"
                      value={creditInputs[shop.retailer_id] || ""}
                      onChange={(e) =>
                        setCreditInputs((prev) => ({ ...prev, [shop.retailer_id]: e.target.value }))
                      }
                      className="w-32 px-3 py-2 text-xs border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    {msg && (
                      <span className={`text-[10px] font-medium ${msg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                        {msg.text}
                      </span>
                    )}
                  </div>
                </td>

                <td className="font-semibold text-red-500">
                  {acct ? `${Number(acct.current_balance).toLocaleString()}.00` : "—"}
                </td>

                <td className="font-semibold text-green-500">
                  {acct ? `${Number(acct.available_credit).toLocaleString()}.00` : "—"}
                </td>

                <td>
                  <button
                    onClick={() => handleSave(shop)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader size={12} className="animate-spin" />
                    ) : (
                      <Save size={12} />
                    )}
                    Save Credit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function SetCreditTable({ shops, creditAccounts: initialAccounts = {}, onRefresh }) {
  const [creditInputs, setCreditInputs] = useState({});
  const [localAccounts, setLocalAccounts] = useState(initialAccounts);
  const [loadingId, setLoadingId] = useState(null);
  const [messages, setMessages] = useState({});

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
        res = await fetch(`${API_BASE}/distributor/credit.php?id=${account.credit_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credit_limit: newLimit }),
        });
      } else {
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

      onRefresh();
    } catch (err) {
      setMessages((prev) => ({ ...prev, [shop.retailer_id]: { type: "error", text: err.message } }));
    } finally {
      setLoadingId(null);
    }
  }

  if (shops.length === 0) {
    return (
      <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] p-16 text-center text-slate-400 shadow-xs">
        <p className="text-4xl mb-2">💳</p>
        <p className="font-bold text-slate-800 text-sm">No approved shops to set credit for</p>
        <p className="text-xs text-slate-400">Approved shops will appear here for credit limit assignment.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Retailer ID</th>
              <th className="px-6 py-4">Retailer Shop</th>
              <th className="px-6 py-4">Current Credit Limit</th>
              <th className="px-6 py-4">New Credit Limit (LKR)</th>
              <th className="px-6 py-4">Outstanding Balance</th>
              <th className="px-6 py-4">Available Credit</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {shops.map((shop) => {
              const acct = localAccounts[shop.retailer_id];
              const isLoading = loadingId === shop.retailer_id;
              const msg = messages[shop.retailer_id];
              return (
                <tr key={shop.retailer_id} className="hover:bg-slate-50/60 transition duration-150">
                  <td className="px-6 py-4 font-bold text-blue-600">
                    SHOP-{String(shop.retailer_id).padStart(4, "0")}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{shop.shop_name || shop.full_name}</td>

                  <td className="px-6 py-4">
                    {acct ? (
                      <span className="font-bold text-slate-900">
                        LKR {Number(acct.credit_limit).toLocaleString()}.00
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[10px]">Not Set</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <input
                        type="number"
                        min="0"
                        placeholder="Enter limit amount"
                        value={creditInputs[shop.retailer_id] || ""}
                        onChange={(e) =>
                          setCreditInputs((prev) => ({ ...prev, [shop.retailer_id]: e.target.value }))
                        }
                        className="w-36 border border-slate-200 focus:border-blue-500 rounded-full px-4 py-2 text-xs font-bold outline-none bg-white text-slate-700 placeholder-slate-400 transition shadow-2xs focus:ring-4 focus:ring-blue-500/10"
                      />
                      {msg && (
                        <span className={`text-[10px] font-bold ${msg.type === "success" ? "text-emerald-600" : "text-rose-500"}`}>
                          {msg.text}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold text-rose-600">
                    {acct ? `LKR ${Number(acct.current_balance).toLocaleString()}.00` : "—"}
                  </td>

                  <td className="px-6 py-4 font-bold text-emerald-600">
                    {acct ? `LKR ${Number(acct.available_credit).toLocaleString()}.00` : "—"}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSave(shop)}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-2xs disabled:opacity-50 mx-auto"
                    >
                      {isLoading ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Save size={13} />
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
    </div>
  );
}
import { useState, useEffect, useCallback } from "react";
import ShopTabs from "../components/shops/ShopTabs";
import ShopsTable from "../components/shops/ShopsTable";
import SetCreditTable from "../components/shops/SetCreditTable";
import Pagination from "../components/Pagination";
import { Search } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";
const ITEMS_PER_PAGE = 8;

export default function ShopsPage() {
  const [activeTab, setActiveTab] = useState("All Shop");
  const [currentPage, setCurrentPage] = useState(1);
  const [shops, setShops] = useState([]);
  const [creditAccounts, setCreditAccounts] = useState({}); // keyed by retailer_id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("vendora_token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch retailers and credit accounts in parallel
      const [retailersRes, creditRes] = await Promise.all([
        fetch(`${API_BASE}/distributor/retailers.php`, { headers }),
        fetch(`${API_BASE}/distributor/credit.php`, { headers }),
      ]);

      const [retailersJson, creditJson] = await Promise.all([
        retailersRes.json(),
        creditRes.json(),
      ]);

      if (!retailersJson.success) throw new Error(retailersJson.message || "Failed to load shops");
      setShops(retailersJson.data || []);

      // Build a map: retailer_id → credit account
      if (creditJson.success && Array.isArray(creditJson.data)) {
        const map = {};
        creditJson.data.forEach((acct) => {
          map[acct.retailer_id] = acct;
        });
        setCreditAccounts(map);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredShops =
    activeTab === "All Shop" || activeTab === "Set Credit"
      ? shops
      : shops.filter((shop) => {
          const targetStatus = activeTab === "Pending Approval" ? "Pending" : activeTab;
          return shop.status === targetStatus;
        });

  // Apply search across all tab results
  const searchedShops = search.trim()
    ? filteredShops.filter(
        (s) =>
          s.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
          s.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
          `RET-${String(s.retailer_id).padStart(3, "0")}`.toLowerCase().includes(search.toLowerCase())
      )
    : filteredShops;

  // Approved shops for credit tab (also searchable)
  const approvedShops = shops.filter((shop) => shop.status === "Approved");
  const searchedApproved = search.trim()
    ? approvedShops.filter(
        (s) =>
          s.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
          s.owner_name?.toLowerCase().includes(search.toLowerCase())
      )
    : approvedShops;

  // Paginate
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedShops   = searchedShops.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const paginatedApproved = searchedApproved.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ShopTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setCurrentPage(1); setSearch(""); }} />
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search shop name or ID…"
            className="pl-8 pr-3 py-2 text-xs font-medium border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-400 w-52"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 text-red-500 text-sm">
          {error}
        </div>
      ) : activeTab === "Set Credit" ? (
        <SetCreditTable
          shops={paginatedApproved}
          creditAccounts={creditAccounts}
          onRefresh={fetchAll}
        />
      ) : (
        <ShopsTable
          shops={paginatedShops}
          creditAccounts={creditAccounts}
          onRefresh={fetchAll}
        />
      )}

      {!loading && !error && (
        <Pagination
          currentPage={currentPage}
          totalItems={activeTab === "Set Credit" ? searchedApproved.length : searchedShops.length}
          itemsPerPage={ITEMS_PER_PAGE}
          label="Shops"
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
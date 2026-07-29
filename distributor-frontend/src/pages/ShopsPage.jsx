import { useState, useEffect, useCallback, useMemo } from "react";
import ShopTabs from "../components/shops/ShopTabs";
import ShopsTable from "../components/shops/ShopsTable";
import SetCreditTable from "../components/shops/SetCreditTable";
import Pagination from "../components/Pagination";
import MetricCard from "../components/MetricCard";
import { Store, Clock, CheckCircle2, CreditCard, Search, Loader2 } from "lucide-react";

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

  const filteredShops = useMemo(() => {
    return activeTab === "All Shop" || activeTab === "Set Credit"
      ? shops
      : shops.filter((shop) => {
          const targetStatus = activeTab === "Pending Approval" ? "Pending" : activeTab;
          return shop.status === targetStatus;
        });
  }, [shops, activeTab]);

  // Apply search across all tab results
  const searchedShops = useMemo(() => {
    return search.trim()
      ? filteredShops.filter(
          (s) =>
            s.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
            s.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
            `RET-${String(s.retailer_id).padStart(3, "0")}`.toLowerCase().includes(search.toLowerCase())
        )
      : filteredShops;
  }, [filteredShops, search]);

  // Approved shops for credit tab (also searchable)
  const approvedShops = useMemo(() => shops.filter((shop) => shop.status === "Approved"), [shops]);
  const searchedApproved = useMemo(() => {
    return search.trim()
      ? approvedShops.filter(
          (s) =>
            s.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
            s.owner_name?.toLowerCase().includes(search.toLowerCase())
        )
      : approvedShops;
  }, [approvedShops, search]);

  // Metrics
  const metrics = useMemo(() => {
    const pendingCount  = shops.filter((s) => s.status === "Pending").length;
    const approvedCount = shops.filter((s) => s.status === "Approved").length;
    const creditCount   = Object.keys(creditAccounts).length;
    return { pendingCount, approvedCount, creditCount };
  }, [shops, creditAccounts]);

  // Paginate
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedShops    = searchedShops.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const paginatedApproved = searchedApproved.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans">

      {/* Page Header */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <Store className="inline mr-3 text-blue-600 w-8 h-8" />
        Retailer Shops
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({searchedShops.length} shops)
          </span>
        )}
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Registered"
          value={shops.length}
          subtitle="All Shops"
          icon={<Store size={20} />}
          color="blue"
        />
        <MetricCard
          title="Pending Approval"
          value={metrics.pendingCount}
          subtitle="Needs Review"
          icon={<Clock size={20} />}
          color="amber"
        />
        <MetricCard
          title="Approved Shops"
          value={metrics.approvedCount}
          subtitle="Active Retailers"
          icon={<CheckCircle2 size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Credit Accounts"
          value={metrics.creditCount}
          subtitle="Limit Assigned"
          icon={<CreditCard size={20} />}
          color="purple"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xs">
          ⚠️ {error}
        </div>
      )}

      {/* Navigation Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <ShopTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setCurrentPage(1); setSearch(""); }} />

        <div className="relative flex-1 w-full md:w-auto md:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search shop name or ID..."
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-xs">
          <Loader2 size={32} className="animate-spin text-blue-600" />
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
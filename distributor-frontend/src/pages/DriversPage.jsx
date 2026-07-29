import { useState, useEffect, useCallback, useMemo } from "react";
import DriverTabs from "../components/drivers/DriverTabs";
import DriversTable from "../components/drivers/DriversTable";
import Pagination from "../components/Pagination";
import MetricCard from "../components/MetricCard";
import { Truck, Clock, CheckCircle2, ShieldOff, Search, Loader2 } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";
const ITEMS_PER_PAGE = 8;

export default function DriversPage() {
  const [activeTab, setActiveTab] = useState("All Drivers");
  const [currentPage, setCurrentPage] = useState(1);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("vendora_token");
      const res = await fetch(`${API_BASE}/distributor/drivers.php`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load drivers");
      setDrivers(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredDrivers = useMemo(() => {
    return activeTab === "All Drivers"
      ? drivers
      : drivers.filter((driver) => {
          const targetStatus = activeTab === "Pending Approval" ? "Pending" : activeTab;
          return driver.status === targetStatus;
        });
  }, [drivers, activeTab]);

  // Apply search on top of tab filter
  const searchedDrivers = useMemo(() => {
    return search.trim()
      ? filteredDrivers.filter(
          (d) =>
            d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            `DR-${String(d.driver_id).padStart(4, "0")}`.toLowerCase().includes(search.toLowerCase())
        )
      : filteredDrivers;
  }, [filteredDrivers, search]);

  // Metrics
  const metrics = useMemo(() => {
    const pendingCount  = drivers.filter((d) => d.status === "Pending").length;
    const approvedCount = drivers.filter((d) => d.status === "Approved").length;
    const blockedCount  = drivers.filter((d) => d.status === "Blocked" || d.status === "Rejected").length;
    return { pendingCount, approvedCount, blockedCount };
  }, [drivers]);

  // Paginate
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDrivers = searchedDrivers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans">

      {/* Page Header */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <Truck className="inline mr-3 text-blue-600 w-8 h-8" />
        Registered Drivers
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({searchedDrivers.length} drivers)
          </span>
        )}
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Registered"
          value={drivers.length}
          subtitle="All Drivers"
          icon={<Truck size={20} />}
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
          title="Approved Drivers"
          value={metrics.approvedCount}
          subtitle="Active Fleet"
          icon={<CheckCircle2 size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Blocked / Rejected"
          value={metrics.blockedCount}
          subtitle="Inactive Drivers"
          icon={<ShieldOff size={20} />}
          color="red"
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
        <DriverTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setCurrentPage(1); setSearch(""); }} />

        <div className="relative flex-1 w-full md:w-auto md:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search driver name or ID..."
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
      ) : (
        <DriversTable drivers={paginatedDrivers} onRefresh={fetchDrivers} />
      )}

      {!loading && !error && (
        <Pagination
          currentPage={currentPage}
          totalItems={searchedDrivers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          label="Drivers"
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
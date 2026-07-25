import { useState, useEffect, useCallback } from "react";
import DriverTabs from "../components/drivers/DriverTabs";
import DriversTable from "../components/drivers/DriversTable";
import Pagination from "../components/Pagination";
import { Search } from "lucide-react";

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

  const filteredDrivers =
    activeTab === "All Drivers"
      ? drivers
      : drivers.filter((driver) => {
          const targetStatus = activeTab === "Pending Approval" ? "Pending" : activeTab;
          return driver.status === targetStatus;
        });

  // Apply search on top of tab filter
  const searchedDrivers = search.trim()
    ? filteredDrivers.filter(
        (d) =>
          d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          `DR-${String(d.driver_id).padStart(4, "0")}`.toLowerCase().includes(search.toLowerCase())
      )
    : filteredDrivers;

  // Paginate
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDrivers = searchedDrivers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DriverTabs activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setCurrentPage(1); setSearch(""); }} />
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search driver name or ID…"
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
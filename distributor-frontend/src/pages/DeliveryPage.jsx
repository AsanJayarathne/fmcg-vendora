import { useState, useEffect, useCallback, useMemo } from "react";
import { Truck, PackageOpen, CheckCircle2, RotateCcw, Loader2, ClipboardList } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { fetchDeliveries } from "../services/deliveryApi";
import MetricCard from "../components/MetricCard";
import OrderTabs from "../components/orders/OrderTabs";
import DeliveryFilters from "../components/delivery/DeliveryFilters";
import DeliveryTable from "../components/delivery/DeliveryTable";
import DeliveryDetailModal from "../components/delivery/DeliveryDetailModal";
import Pagination from "../components/Pagination";

const TABS = ["OPEN", "CLAIMED", "DELIVERED", "RETURNED", "All"];
const ITEMS_PER_PAGE = 8;

export default function DeliveryPage() {
  const { auth } = useAuth();

  const [allDeliveries, setAllDeliveries] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  // Filters
  const [activeTab, setActiveTab]         = useState("All");
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [currentPage, setCurrentPage]     = useState(1);

  // Modal
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDeliveries(auth?.token);
      setAllDeliveries(data);
      setCurrentPage(1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => { loadData(); }, [loadData]);

  // Metrics
  const total          = allDeliveries.length;
  const openCount      = allDeliveries.filter((d) => d.status === "OPEN").length;
  const claimedCount   = allDeliveries.filter((d) => d.status === "CLAIMED").length;
  const deliveredCount = allDeliveries.filter((d) => d.status === "DELIVERED").length;
  const returnedCount  = allDeliveries.filter((d) => d.status === "RETURNED").length;

  // Filter logic
  const filtered = useMemo(() => {
    let list = allDeliveries;

    // Tab filter
    if (activeTab !== "All") {
      list = list.filter((d) => d.status === activeTab);
    }

    // Status dropdown
    if (statusFilter !== "All") {
      list = list.filter((d) => d.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          String(d.delivery_id).includes(q) ||
          String(d.order_id).includes(q) ||
          (d.shop_name   ?? "").toLowerCase().includes(q) ||
          (d.owner_name  ?? "").toLowerCase().includes(q) ||
          (d.driver_name ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [allDeliveries, activeTab, statusFilter, search]);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleReset() {
    setSearch("");
    setStatusFilter("All");
    setActiveTab("All");
    setCurrentPage(1);
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setStatusFilter("All");
    setCurrentPage(1);
  }

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans">

      {/* Page Header — styled like Retailer */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <Truck className="inline mr-3 text-blue-600 w-8 h-8" />
        Deliveries
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({filtered.length} deliveries)
          </span>
        )}
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Deliveries"
          value={total}
          subtitle="All time"
          icon={<ClipboardList size={20} />}
          color="blue"
        />
        <MetricCard
          title="Open"
          value={openCount}
          subtitle="Awaiting driver"
          icon={<PackageOpen size={20} />}
          color="amber"
        />
        <MetricCard
          title="Claimed"
          value={claimedCount}
          subtitle="Driver assigned"
          icon={<Truck size={20} />}
          color="blue"
        />
        <MetricCard
          title="Delivered"
          value={deliveredCount}
          subtitle="Successfully delivered"
          icon={<CheckCircle2 size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Returned"
          value={returnedCount}
          subtitle="Could not deliver"
          icon={<RotateCcw size={20} />}
          color="red"
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xs">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <OrderTabs
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Filters */}
      <DeliveryFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
        onReset={handleReset}
      />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-xs">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      ) : (
        <DeliveryTable
          deliveries={paginated}
          onView={setSelectedDelivery}
        />
      )}

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          label="Deliveries"
          onPageChange={setCurrentPage}
        />
      )}

      {/* Detail Modal */}
      {selectedDelivery && (
        <DeliveryDetailModal
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          onRefresh={loadData}
        />
      )}
    </div>
  );
}
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

const TABS = ["All", "OPEN", "CLAIMED", "DELIVERED", "RETURNED"];
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

  // ── Load data ────────────────────────────────────────────────────────────
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

  // ── Metrics ───────────────────────────────────────────────────────────────
  const total     = allDeliveries.length;
  const openCount = allDeliveries.filter((d) => d.status === "OPEN").length;
  const claimedCount = allDeliveries.filter((d) => d.status === "CLAIMED").length;
  const deliveredCount = allDeliveries.filter((d) => d.status === "DELIVERED").length;
  const returnedCount  = allDeliveries.filter((d) => d.status === "RETURNED").length;

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = allDeliveries;

    // Tab filter
    if (activeTab !== "All") {
      list = list.filter((d) => d.status === activeTab);
    }

    // Status dropdown (secondary filter — works on tab result)
    if (statusFilter !== "All") {
      list = list.filter((d) => d.status === statusFilter);
    }

    // Search: delivery_id, order_id, shop_name, driver_name, owner_name
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
    setStatusFilter("All"); // reset dropdown when tab changes
    setCurrentPage(1);
  }

  return (
    <div className="space-y-4">

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Deliveries"
          value={total}
          subtitle="All time"
          icon={<ClipboardList className="text-[#0228e3]" size={34} />}
          iconBg="bg-[#5BDAF2]"
        />
        <MetricCard
          title="Open"
          value={openCount}
          subtitle="Awaiting driver"
          icon={<PackageOpen className="text-amber-600" size={34} />}
          iconBg="bg-amber-100"
        />
        <MetricCard
          title="Claimed"
          value={claimedCount}
          subtitle="Driver assigned"
          icon={<Truck className="text-blue-600" size={34} />}
          iconBg="bg-blue-100"
        />
        <MetricCard
          title="Delivered"
          value={deliveredCount}
          subtitle="Successfully delivered"
          icon={<CheckCircle2 className="text-emerald-600" size={34} />}
          iconBg="bg-emerald-100"
        />
        <MetricCard
          title="Returned"
          value={returnedCount}
          subtitle="Could not deliver"
          icon={<RotateCcw className="text-red-500" size={34} />}
          iconBg="bg-red-100"
        />
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ── Tabs ── */}
      <OrderTabs
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* ── Filters ── */}
      <DeliveryFilters
        search={search}
        onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
        onReset={handleReset}
      />

      {/* ── Table ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16 bg-white border border-gray-200 rounded-lg">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : (
        <DeliveryTable
          deliveries={paginated}
          onView={setSelectedDelivery}
        />
      )}

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        label="Deliveries"
        onPageChange={setCurrentPage}
      />

      {/* ── Detail Modal ── */}
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
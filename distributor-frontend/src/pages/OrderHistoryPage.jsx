import { useState, useEffect, useMemo } from "react";
import MetricCard from "../components/MetricCard";
import OrderHistoryFilters from "../components/orders/OrderHistoryFilters";
import OrderHistoryTable from "../components/orders/OrderHistoryTable";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import Pagination from "../components/Pagination";
import { useAuth } from "../auth/AuthContext";
import { fetchDeliveries } from "../services/ordersApi";
import { ShoppingCart, CheckSquare, RotateCcw, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function OrderHistoryPage() {
  const { auth } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Filters
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Load deliveries — only DELIVERED and RETURNED
  useEffect(() => {
    setLoading(true);
    setError("");
    fetchDeliveries(auth?.token)
      .then((data) => {
        // Only keep completed deliveries (delivered or returned)
        const completed = (data ?? []).filter(
          (d) => d.status === "DELIVERED" || d.status === "RETURNED"
        );
        setDeliveries(completed);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [auth?.token]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // Client-side filtering
  const filtered = useMemo(() => {
    return deliveries.filter((d) => {
      const matchSearch = !search ||
        d.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
        String(d.order_id).includes(search);
      const matchStatus = !statusFilter || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [deliveries, search, statusFilter]);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Metrics
  const totalCount     = deliveries.length;
  const deliveredCount = deliveries.filter((d) => d.status === "DELIVERED").length;
  const returnedCount  = deliveries.filter((d) => d.status === "RETURNED").length;

  return (
    <div className="space-y-4">

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Completed"
          value={totalCount}
          subtitle="Delivered + Returned"
          icon={<ShoppingCart className="text-cyan-600" size={34} />}
          bgColor="bg-[#E5ECFF]"
          iconBg="bg-[#5BDAF2]"
        />
        <MetricCard
          title="Delivered"
          value={deliveredCount}
          subtitle="Successfully delivered"
          icon={<CheckSquare className="text-emerald-500" size={34} />}
          bgColor="bg-[#E7FFE0]"
          iconBg="bg-[#C7FFB8]"
        />
        <MetricCard
          title="Returned"
          value={returnedCount}
          subtitle="Failed / returned deliveries"
          icon={<RotateCcw className="text-orange-500" size={34} />}
          bgColor="bg-[#FFF3E2]"
          iconBg="bg-[#FFD8A4]"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <OrderHistoryFilters
        search={search}           setSearch={setSearch}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        onReset={resetFilters}
      />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 bg-white border border-gray-200 rounded-lg">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : (
        <OrderHistoryTable
          deliveries={paginated}
          onView={setSelectedOrderId}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        label="Records"
        onPageChange={(p) => { setCurrentPage(p); }}
      />

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}

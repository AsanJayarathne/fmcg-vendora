import { useState, useEffect, useMemo } from "react";
import MetricCard from "../components/MetricCard";
import OrderHistoryFilters from "../components/orders/OrderHistoryFilters";
import OrderHistoryTable from "../components/orders/OrderHistoryTable";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import Pagination from "../components/Pagination";
import { useAuth } from "../auth/AuthContext";
import { fetchDeliveries } from "../services/ordersApi";
import { History, ShoppingCart, CheckSquare, RotateCcw, Loader2 } from "lucide-react";

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
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");

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
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // Client-side filtering
  const filtered = useMemo(() => {
    return deliveries.filter((d) => {
      const matchSearch = !search ||
        d.shop_name?.toLowerCase().includes(search.toLowerCase()) ||
        String(d.order_id).includes(search) ||
        String(d.delivery_id).includes(search);
      const matchStatus = !statusFilter || d.status === statusFilter;
      // Date range filter
      const deliveryDate = d.created_at ? new Date(d.created_at.split(" ")[0]) : null;
      const matchFrom = !dateFrom || (deliveryDate && deliveryDate >= new Date(dateFrom));
      const matchTo   = !dateTo   || (deliveryDate && deliveryDate <= new Date(dateTo));
      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [deliveries, search, statusFilter, dateFrom, dateTo]);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Metrics
  const totalCount     = deliveries.length;
  const deliveredCount = deliveries.filter((d) => d.status === "DELIVERED").length;
  const returnedCount  = deliveries.filter((d) => d.status === "RETURNED").length;

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans">

      {/* Page Header — styled like Retailer */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <History className="inline mr-3 text-blue-600 w-8 h-8" />
        Order History
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({filtered.length} records)
          </span>
        )}
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total Completed"
          value={totalCount}
          subtitle="Delivered + Returned"
          icon={<ShoppingCart size={20} />}
          color="blue"
        />
        <MetricCard
          title="Delivered"
          value={deliveredCount}
          subtitle="Successfully Delivered"
          icon={<CheckSquare size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Returned"
          value={returnedCount}
          subtitle="Returned Deliveries"
          icon={<RotateCcw size={20} />}
          color="purple"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xs">
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <OrderHistoryFilters
        search={search}             setSearch={(v) => { setSearch(v);       setCurrentPage(1); }}
        statusFilter={statusFilter} setStatusFilter={(v) => { setStatusFilter(v); setCurrentPage(1); }}
        dateFrom={dateFrom}         setDateFrom={(v) => { setDateFrom(v);   setCurrentPage(1); }}
        dateTo={dateTo}             setDateTo={(v) => { setDateTo(v);       setCurrentPage(1); }}
        onReset={resetFilters}
      />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-xs">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      ) : (
        <OrderHistoryTable
          deliveries={paginated}
          onView={setSelectedOrderId}
        />
      )}

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          label="Records"
          onPageChange={(p) => { setCurrentPage(p); }}
        />
      )}

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

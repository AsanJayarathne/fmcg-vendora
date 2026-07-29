import { useState, useEffect, useCallback, useMemo } from "react";
import OrderTabs from "../components/orders/OrderTabs";
import OrdersTable from "../components/orders/OrdersTable";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import Pagination from "../components/Pagination";
import MetricCard from "../components/MetricCard";
import { useAuth } from "../auth/AuthContext";
import { fetchOrders, fetchDeliveries, approveOrder, rejectOrder } from "../services/ordersApi";
import {
  ShoppingCart,
  ClipboardClock,
  SquareCheckBig,
  Ban,
  RotateCcw,
  Loader2,
} from "lucide-react";

const TABS = ["All Orders", "Pending", "Processing", "Approved", "Delivered", "Returned", "Rejected"];

const ITEMS_PER_PAGE = 8;

export default function OrdersPage() {
  const { auth } = useAuth();

  const [allOrders, setAllOrders]       = useState([]);
  const [returnedOrderIds, setReturnedOrderIds] = useState(new Set());
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [activeTab, setActiveTab]       = useState("All Orders");
  const [currentPage, setCurrentPage]   = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [actioningId, setActioningId]   = useState(null);

  // Load all orders + deliveries together
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersData, deliveriesData] = await Promise.all([
        fetchOrders(auth?.token, ""),
        fetchDeliveries(auth?.token).catch(() => []), // fallback gracefully
      ]);
      setAllOrders(ordersData ?? []);
      // Build set of order_ids that have a RETURNED delivery
      const returnedIds = new Set(
        (deliveriesData ?? [])
          .filter((d) => d.status === "RETURNED")
          .map((d) => Number(d.order_id))
      );
      setReturnedOrderIds(returnedIds);
      setCurrentPage(1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => { loadData(); }, [loadData]);

  // Tab filtering
  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case "All Orders":  return allOrders;
      case "Pending":     return allOrders.filter((o) => o.status === "Pending");
      case "Processing":  return allOrders.filter((o) => o.status === "Processing");
      case "Approved":    return allOrders.filter((o) => o.status === "Approved");
      case "Delivered":   return allOrders.filter((o) => o.status === "Delivered");
      // Returned = Rejected in orders table BUT has a RETURNED delivery record
      case "Returned":    return allOrders.filter(
                            (o) => o.status === "Rejected" && returnedOrderIds.has(Number(o.order_id))
                          );
      // Rejected by distributor = Rejected in orders table but NOT from a returned delivery
      case "Rejected":    return allOrders.filter(
                            (o) => o.status === "Rejected" && !returnedOrderIds.has(Number(o.order_id))
                          );
      default:            return allOrders;
    }
  }, [allOrders, activeTab, returnedOrderIds]);

  const paginated = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Inline approve
  const handleApprove = async (orderId) => {
    setActioningId(orderId);
    try {
      await approveOrder(auth?.token, orderId);
      await loadData();
    } catch (e) {
      setError(e.message);
    } finally {
      setActioningId(null);
    }
  };

  // Inline reject
  const handleReject = async (orderId) => {
    setActioningId(orderId);
    try {
      await rejectOrder(auth?.token, orderId);
      await loadData();
    } catch (e) {
      setError(e.message);
    } finally {
      setActioningId(null);
    }
  };

  // Metrics
  const totalCount    = allOrders.length;
  const pendingCount  = allOrders.filter((o) => o.status === "Pending").length;
  const approvedCount = allOrders.filter((o) => o.status === "Approved").length;
  const returnedCount = allOrders.filter(
    (o) => o.status === "Rejected" && returnedOrderIds.has(Number(o.order_id))
  ).length;
  const rejectedCount = allOrders.filter(
    (o) => o.status === "Rejected" && !returnedOrderIds.has(Number(o.order_id))
  ).length;

  return (
    <div className="space-y-4">

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Orders"
          value={totalCount}
          subtitle="All Time"
          icon={<ShoppingCart size={20} />}
          color="blue"
        />
        <MetricCard
          title="Pending"
          value={pendingCount}
          subtitle="Awaiting Approval"
          icon={<ClipboardClock size={20} />}
          color="amber"
        />
        <MetricCard
          title="Approved"
          value={approvedCount}
          subtitle="Active Orders"
          icon={<SquareCheckBig size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Returned"
          value={returnedCount}
          subtitle="Returned Deliveries"
          icon={<RotateCcw size={20} />}
          color="purple"
        />
        <MetricCard
          title="Rejected"
          value={rejectedCount}
          subtitle="Rejected Orders"
          icon={<Ban size={20} />}
          color="red"
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <OrderTabs
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
      />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 bg-white border border-gray-200 rounded-lg">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : (
        <OrdersTable
          orders={paginated}
          returnedOrderIds={returnedOrderIds}
          onView={setSelectedOrderId}
          onApprove={handleApprove}
          onReject={handleReject}
          actioningId={actioningId}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredOrders.length}
        itemsPerPage={ITEMS_PER_PAGE}
        label="Orders"
        onPageChange={setCurrentPage}
      />

      {/* Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onActionDone={loadData}
        />
      )}
    </div>
  );
}
import { useState, useEffect, useMemo } from "react";
import PaymentTabs from "../components/payments/PaymentTabs";
import PaymentsTable from "../components/payments/PaymentsTable";
import OutstandingTable from "../components/payments/OutstandingTable";
import Pagination from "../components/Pagination";
import PageHeader from "../components/PageHeader";
import MetricCard from "../components/MetricCard";
import { useAuth } from "../auth/AuthContext";
import { Loader2, Search, Banknote, CreditCard, Receipt, Users } from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

export default function PaymentsPage() {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState("payments");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Payments / Delivered Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Credit Accounts State
  const [credits, setCredits] = useState([]);
  const [loadingCredits, setLoadingCredits] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE}/distributor/orders.php`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success) {
        // Filter to only include orders that have payment activity (Delivered/Completed)
        setOrders(json.data || []);
      }
    } catch {
      setError("Failed to fetch payments history.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCredits = async () => {
    setLoadingCredits(true);
    try {
      const res = await fetch(`${API_BASE}/distributor/credit.php`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success) {
        setCredits(json.data || []);
      }
    } catch {
      setError("Failed to fetch outstanding accounts.");
    } finally {
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchOrders();
      fetchCredits();
    }
  }, [auth?.token]);

  // Filtered Payments (Orders)
  const filteredPayments = useMemo(() => {
    return orders
      .filter((o) => o.status === "Delivered")
      .map((o) => ({
        orderId: `ORD-${String(o.order_id).padStart(3, "0")}`,
        retailer: o.shop_name || "Unknown Retailer",
        orderDate: o.created_at
          ? new Date(o.created_at).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "—",
        orderTime: o.created_at
          ? new Date(o.created_at).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        totalAmount: parseFloat(o.total_amount || 0).toFixed(2),
        paid: parseFloat(o.cash_amount || 0).toFixed(2),
        outstanding: parseFloat(o.credit_amount || 0).toFixed(2),
        paymentStatus: o.payment_method?.toLowerCase() || "cash",
      }))
      .filter(
        (p) =>
          p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.retailer.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [orders, searchQuery]);

  // Filtered Outstandings (Credit Accounts)
  const filteredOutstandings = useMemo(() => {
    return credits
      .map((c) => ({
        retailerId: `RET-${String(c.retailer_id).padStart(3, "0")}`,
        retailer: c.shop_name || "Unknown Retailer",
        creditLimit: parseFloat(c.credit_limit || 0).toFixed(2),
        outstanding: parseFloat(c.current_balance || 0).toFixed(2),
        availableCredit: parseFloat(c.available_credit || 0).toFixed(2),
      }))
      .filter(
        (o) =>
          o.retailerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.retailer.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [credits, searchQuery]);

  const activeItems = activeTab === "payments" ? filteredPayments : filteredOutstandings;

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return activeItems.slice(start, start + itemsPerPage);
  }, [activeItems, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const loading = activeTab === "payments" ? loadingOrders : loadingCredits;

  // ── Summary metrics ──
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const totalRevenue    = deliveredOrders.reduce((s, o) => s + parseFloat(o.cash_amount || 0), 0);
  const totalOutstanding = credits.reduce((s, c) => s + parseFloat(c.current_balance || 0), 0);
  const creditAccountsCount = credits.length;
  const totalTransactions   = deliveredOrders.length;

  const fmtLKR = (val) =>
    `LKR ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4 font-sans">
      <PageHeader
        title="Payment & Credits"
        subtitle="Manage payments and track outstanding retailer credits"
      />

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={fmtLKR(totalRevenue)}
          subtitle="Cash collected (Delivered)"
          icon={<Banknote className="text-emerald-600" size={22} />}
          iconBg="bg-emerald-100"
        />
        <MetricCard
          title="Total Outstanding"
          value={fmtLKR(totalOutstanding)}
          subtitle="Unpaid credit balances"
          icon={<CreditCard className="text-orange-500" size={22} />}
          iconBg="bg-orange-100"
        />
        <MetricCard
          title="Credit Accounts"
          value={creditAccountsCount}
          subtitle="Active credit accounts"
          icon={<Users className="text-blue-600" size={22} />}
          iconBg="bg-blue-100"
        />
        <MetricCard
          title="Transactions"
          value={totalTransactions}
          subtitle="Delivered & paid orders"
          icon={<Receipt className="text-purple-600" size={22} />}
          iconBg="bg-purple-100"
        />
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PaymentTabs activeTab={activeTab} setActiveTab={handleTabChange} />

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              activeTab === "payments"
                ? "Search by Order ID or retailer..."
                : "Search by Retailer ID or name..."
            }
            className="pl-9 pr-4 py-2 w-full bg-white border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tables display */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white border border-gray-200 rounded-xl">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : activeTab === "payments" ? (
        <PaymentsTable payments={paginatedItems} />
      ) : (
        <OutstandingTable outstandings={paginatedItems} />
      )}

      {/* Pagination */}
      {!loading && activeItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={activeItems.length}
          itemsPerPage={itemsPerPage}
          label={activeTab === "payments" ? "Payments" : "Accounts"}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
import { useState, useEffect, useMemo } from "react";
import PaymentTabs from "../components/payments/PaymentTabs";
import PaymentsTable from "../components/payments/PaymentsTable";
import OutstandingTable from "../components/payments/OutstandingTable";
import Pagination from "../components/Pagination";
import MetricCard from "../components/MetricCard";
import OrderDetailModal from "../components/orders/OrderDetailModal";
import OnboardingDetailModal from "../components/OnboardingDetailModal";
import { useAuth } from "../auth/AuthContext";
import { Loader2, Search, Banknote, CreditCard, Receipt, Users, Phone, MapPin, DollarSign } from "lucide-react";

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

  // Selected items for modal view
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE}/distributor/orders.php`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (json.success) {
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
        rawOrderId: o.order_id,
        orderId: `ORD-${String(o.order_id).padStart(3, "0")}`,
        retailer: o.shop_name || "Unknown Retailer",
        orderDate: o.created_at
          ? new Date(o.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "—",
        orderTime: o.created_at
          ? new Date(o.created_at).toLocaleTimeString("en-GB", {
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
        rawRetailerId: c.retailer_id,
        retailerId: `RET-${String(c.retailer_id).padStart(3, "0")}`,
        retailer: c.shop_name || "Unknown Retailer",
        ownerName: c.owner_name || "—",
        phone: c.phone || "—",
        creditLimit: parseFloat(c.credit_limit || 0).toFixed(2),
        outstanding: parseFloat(c.current_balance || 0).toFixed(2),
        availableCredit: parseFloat(c.available_credit || 0).toFixed(2),
        status: "Approved",
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

  // Summary metrics
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const totalRevenue    = deliveredOrders.reduce((s, o) => s + parseFloat(o.cash_amount || 0), 0);
  const totalOutstanding = credits.reduce((s, c) => s + parseFloat(c.current_balance || 0), 0);
  const creditAccountsCount = credits.length;
  const totalTransactions   = deliveredOrders.length;

  const fmtLKR = (val) =>
    `LKR ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Fields for selected credit account modal
  const accountFields = selectedAccount
    ? [
        { icon: <DollarSign size={14} />, label: "Credit Limit", value: `LKR ${Number(selectedAccount.creditLimit).toLocaleString("en-LK", { minimumFractionDigits: 2 })}` },
        { icon: <DollarSign size={14} />, label: "Outstanding Balance", value: `LKR ${Number(selectedAccount.outstanding).toLocaleString("en-LK", { minimumFractionDigits: 2 })}` },
        { icon: <DollarSign size={14} />, label: "Available Credit", value: `LKR ${Number(selectedAccount.availableCredit).toLocaleString("en-LK", { minimumFractionDigits: 2 })}` },
        { icon: <Phone size={14} />, label: "Contact Phone", value: selectedAccount.phone },
      ]
    : [];

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans">

      {/* Page Header */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <Banknote className="inline mr-3 text-blue-600 w-8 h-8" />
        Payment & Credits
        {!loading && (
          <span className="ml-3 text-base font-normal text-slate-500">
            ({activeItems.length} records)
          </span>
        )}
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={fmtLKR(totalRevenue)}
          subtitle="Cash collected (Delivered)"
          icon={<Banknote size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Total Outstanding"
          value={fmtLKR(totalOutstanding)}
          subtitle="Unpaid credit balances"
          icon={<CreditCard size={20} />}
          color="red"
        />
        <MetricCard
          title="Credit Accounts"
          value={creditAccountsCount}
          subtitle="Active credit accounts"
          icon={<Users size={20} />}
          color="blue"
        />
        <MetricCard
          title="Transactions"
          value={totalTransactions}
          subtitle="Delivered & paid orders"
          icon={<Receipt size={20} />}
          color="purple"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xs">
          ⚠️ {error}
        </div>
      )}

      {/* Navigation Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <PaymentTabs activeTab={activeTab} setActiveTab={handleTabChange} />

        <div className="relative flex-1 w-full md:w-auto md:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              activeTab === "payments"
                ? "Search Order ID or retailer..."
                : "Search Retailer ID or name..."
            }
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Tables display */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-xs">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      ) : activeTab === "payments" ? (
        <PaymentsTable
          payments={paginatedItems}
          onViewOrder={(rawOrderId) => setSelectedOrderId(rawOrderId)}
        />
      ) : (
        <OutstandingTable
          outstandings={paginatedItems}
          onViewAccount={(acc) => setSelectedAccount(acc)}
        />
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

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      {/* Account Credit Detail Modal */}
      {selectedAccount && (
        <OnboardingDetailModal
          title={selectedAccount.retailer}
          idLabel={selectedAccount.retailerId}
          avatarColor="text-blue-600 bg-blue-50 border border-blue-100"
          status={selectedAccount.status}
          fields={accountFields}
          onClose={() => setSelectedAccount(null)}
          onAction={() => {}}
        />
      )}
    </div>
  );
}
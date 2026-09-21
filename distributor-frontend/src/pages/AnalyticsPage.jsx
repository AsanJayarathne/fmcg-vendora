import { useState, useEffect, useMemo } from "react";
import {
  Store,
  Truck,
  Package,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Loader2,
  RefreshCw,
  BarChart3,
  Calendar,
  CheckCircle2,
  PieChart as PieChartIcon,
  TrendingUp,
  Boxes,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { fetchRawAnalyticsData, computeAnalyticsForTimeframe } from "../services/analyticsApi";

import AnalyticsKpiCards from "../components/analytics/AnalyticsKpiCards";
import SalesOverview from "../components/analytics/SalesOverview";
import TopProductsTable from "../components/analytics/TopProductsTable";
import OrderStatusBreakdown from "../components/analytics/OrderStatusBreakdown";
import PaymentBreakdown from "../components/analytics/PaymentBreakdown";
import OutstandingRetailers from "../components/analytics/OutstandingRetailers";
import DriverPerformance from "../components/analytics/DriverPerformance";
import RetailerGrowth from "../components/analytics/RetailerGrowth";
import InventoryInsights from "../components/analytics/InventoryInsights";

function formatAmount(val) {
  if (val >= 1_000_000) return `LKR ${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000)     return `LKR ${(val / 1_000).toFixed(1)}K`;
  return `LKR ${Number(val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

export default function AnalyticsPage() {
  const { auth } = useAuth();
  const [rawData, setRawData]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [timeframe, setTimeframe] = useState("This Month");
  const [activeTab, setActiveTab] = useState("all");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const load = async () => {
    if (!auth?.token) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchRawAnalyticsData(auth.token);
      setRawData(result);
    } catch (e) {
      setError(e.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [auth?.token]);

  const handleRefresh = () => {
    load();
    showToast("Analytics metrics refreshed with live operational data.");
  };

  // Re-compute all analytics metrics, charts and tables dynamically on timeframe change
  const filteredData = useMemo(() => {
    if (!rawData) return null;
    return computeAnalyticsForTimeframe(rawData, timeframe);
  }, [rawData, timeframe]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[550px] bg-slate-50 rounded-3xl p-8 gap-3">
        <Loader2 size={36} className="animate-spin text-blue-600" />
        <p className="text-slate-500 font-semibold text-sm">Loading analytics breakdown...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50 rounded-3xl p-8 gap-4">
        <p className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 px-5 py-3 rounded-2xl">
          {error}
        </p>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-200 bg-white rounded-xl hover:bg-blue-50 transition shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} /> Retry Loading
        </button>
      </div>
    );
  }

  const { kpis, salesData, topProducts, orderStatusData, paymentData,
          outstandingRetailers, driverPerformance, retailerGrowth, inventoryInsights } = filteredData;

  const kpiCards = [
    {
      title: "Total Retailers",
      value: String(kpis.totalRetailers),
      change: "Registered in territory",
      icon: <Store size={22} />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      changeColor: "text-slate-400",
    },
    {
      title: "Active Drivers",
      value: String(kpis.activeDrivers),
      change: "Approved & on fleet",
      icon: <Truck size={22} />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      changeColor: "text-slate-400",
    },
    {
      title: "Total Orders",
      value: kpis.totalOrders.toLocaleString(),
      change: `Orders in ${timeframe.toLowerCase()}`,
      icon: <Package size={22} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-emerald-600",
    },
    {
      title: "Total Revenue",
      value: formatAmount(kpis.totalRevenue),
      change: "Delivered & approved",
      icon: <DollarSign size={22} />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      changeColor: "text-emerald-600",
    },
    {
      title: "Outstanding Due",
      value: formatAmount(kpis.totalOutstanding),
      change: "Open credit balances",
      icon: <CreditCard size={22} />,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      changeColor: kpis.totalOutstanding > 0 ? "text-rose-500" : "text-emerald-600",
    },
    {
      title: "Low Stock Alert",
      value: String(kpis.lowStockCount),
      change: "Items need restocking",
      icon: <AlertTriangle size={22} />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      changeColor: kpis.lowStockCount > 0 ? "text-amber-600" : "text-emerald-600",
    },
  ];

  const totalOrdersLabel = kpis.totalOrders.toLocaleString();
  const totalRevenueLabel = formatAmount(kpis.totalRevenue);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="text-emerald-400 size-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-800 tracking-tight">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-xs">
              <BarChart3 className="w-7 h-7" />
            </div>
            <span>Distributor Analytics</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-normal">
            Real-time business intelligence, revenue trends, fulfillment metrics, and fleet performance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-white shadow-xs">
            <Calendar className="text-slate-400 text-sm size-4" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="outline-none bg-transparent text-xs font-semibold text-slate-600 cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "all"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/60"
          }`}
        >
          <PieChartIcon size={14} />
          <span>All Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "sales"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/60"
          }`}
        >
          <TrendingUp size={14} />
          <span>Sales & Revenue</span>
        </button>
        <button
          onClick={() => setActiveTab("retailers")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "retailers"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/60"
          }`}
        >
          <Store size={14} />
          <span>Orders & Retailers</span>
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
            activeTab === "inventory"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/60"
          }`}
        >
          <Boxes size={14} />
          <span>Inventory & Operations</span>
        </button>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <AnalyticsKpiCards kpis={kpiCards} />

      {/* Section 1: Revenue Trends & Retailer Growth */}
      {(activeTab === "all" || activeTab === "sales" || activeTab === "retailers") && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SalesOverview data={salesData} timeframe={timeframe} />
          <RetailerGrowth data={retailerGrowth} />
        </div>
      )}

      {/* Section 2: Order Status, Payment Channels & Driver Performance */}
      {(activeTab === "all" || activeTab === "sales" || activeTab === "retailers" || activeTab === "inventory") && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <OrderStatusBreakdown data={orderStatusData} totalOrders={totalOrdersLabel} />
          <PaymentBreakdown data={paymentData} totalRevenue={totalRevenueLabel} />
          <DriverPerformance drivers={driverPerformance} />
        </div>
      )}

      {/* Section 3: High-Performing Products & Retailer Balances */}
      {(activeTab === "all" || activeTab === "sales" || activeTab === "retailers") && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <TopProductsTable products={topProducts} />
          <OutstandingRetailers retailers={outstandingRetailers} />
        </div>
      )}

      {/* Section 4: Inventory & Warehouse Summary */}
      {(activeTab === "all" || activeTab === "inventory") && (
        <InventoryInsights insights={inventoryInsights} />
      )}
    </div>
  );
}
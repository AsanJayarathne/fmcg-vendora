import { useState, useEffect } from "react";
import {
  Store,
  Truck,
  Package,
  DollarSign,
  CreditCard,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { fetchAnalyticsData } from "../services/analyticsApi";

import PageHeader from "../components/PageHeader";
import AnalyticsKpiCards from "../components/analytics/AnalyticsKpiCards";
import SalesOverview from "../components/analytics/SalesOverview";
import SalesByTerritory from "../components/analytics/SalesByTerritory";
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
  return `LKR ${val.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

export default function AnalyticsPage() {
  const { auth } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const load = async () => {
    if (!auth?.token) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchAnalyticsData(auth.token);
      setData(result);
    } catch (e) {
      setError(e.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [auth?.token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 size={36} className="animate-spin text-blue-600" />
        <p className="text-sm text-gray-500 font-semibold">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 transition"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const { kpis, salesData, territoryData, topProducts, orderStatusData, paymentData,
          outstandingRetailers, driverPerformance, retailerGrowth, inventoryInsights } = data;

  const kpiCards = [
    {
      title: "Total Retailers",
      value: String(kpis.totalRetailers),
      change: "Registered in your region",
      icon: <Store size={26} />,
      bg: "bg-[#EFEAFF]",
      iconBg: "bg-purple-200",
      iconColor: "text-purple-600",
      changeColor: "text-gray-500",
    },
    {
      title: "Active Drivers",
      value: String(kpis.activeDrivers),
      change: "Approved & operational",
      icon: <Truck size={26} />,
      bg: "bg-[#FFF8D6]",
      iconBg: "bg-yellow-200",
      iconColor: "text-yellow-600",
      changeColor: "text-gray-500",
    },
    {
      title: "Total Orders",
      value: kpis.totalOrders.toLocaleString(),
      change: "All time",
      icon: <Package size={26} />,
      bg: "bg-[#E8F3FF]",
      iconBg: "bg-blue-200",
      iconColor: "text-blue-600",
      changeColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: formatAmount(kpis.totalRevenue),
      change: "From delivered orders",
      icon: <DollarSign size={26} />,
      bg: "bg-[#E9FBEF]",
      iconBg: "bg-green-200",
      iconColor: "text-green-600",
      changeColor: "text-green-600",
    },
    {
      title: "Outstanding",
      value: formatAmount(kpis.totalOutstanding),
      change: "Credit balances owed",
      icon: <CreditCard size={26} />,
      bg: "bg-[#FFF0E6]",
      iconBg: "bg-orange-200",
      iconColor: "text-orange-600",
      changeColor: kpis.totalOutstanding > 0 ? "text-red-500" : "text-green-600",
    },
    {
      title: "Low Stock Products",
      value: String(kpis.lowStockCount),
      change: "Need replenishment",
      icon: <AlertTriangle size={26} />,
      bg: "bg-[#FFE8EC]",
      iconBg: "bg-red-200",
      iconColor: "text-red-600",
      changeColor: kpis.lowStockCount > 0 ? "text-red-500" : "text-green-600",
    },
  ];

  const totalOrdersLabel = kpis.totalOrders.toLocaleString();
  const totalRevenueLabel = formatAmount(kpis.totalRevenue);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Analytics Overview"
          subtitle="Real-time insights into your business performance"
        />
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition mt-1"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <AnalyticsKpiCards kpis={kpiCards} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesOverview data={salesData} />
        <SalesByTerritory data={territoryData} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <TopProductsTable products={topProducts} />
        <OrderStatusBreakdown data={orderStatusData} totalOrders={totalOrdersLabel} />
        <PaymentBreakdown data={paymentData} totalRevenue={totalRevenueLabel} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <OutstandingRetailers retailers={outstandingRetailers} />
        <DriverPerformance drivers={driverPerformance} />
        <RetailerGrowth data={retailerGrowth} />
      </div>

      <InventoryInsights insights={inventoryInsights} />
    </div>
  );
}
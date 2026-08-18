import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import MonthlyChart from "../components/graps/MonthlyChart";
import YearlyStockChart from "../components/graps/YearlyStockChart";
import ExpensesDonutChart from "../components/graps/ExpensesDonutChart";
import SalesTerritoryChart from "../components/graps/SalesTerritoryChart";
import LowStockAlertsTable from "../components/graps/LowStockAlertsTable";
import MetricCard from "../components/MetricCard";
import { LayoutDashboard, DollarSign, Building2, Package, AlertTriangle, RotateCcw } from "lucide-react";

const ANALYTICS_API = "http://localhost/fmcg-vendora/backend/api/admin/analytics.php";
const WAREHOUSE_API = "http://localhost/fmcg-vendora/backend/api/admin/warehouse-stock.php";

const formatLKR = (val) => {
  const num = Number(val || 0);
  if (num >= 1000000) return `LKR ${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `LKR ${(num / 1000).toFixed(1)}k`;
  return `LKR ${num.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
};

const Dashboard = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [warehouseBatches, setWarehouseBatches] = useState([]);
  const [stockSummary, setStockSummary] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${auth?.token}` };

      // Fetch analytics, warehouse batches, and warehouse summary in parallel
      const [resAnalytics, resBatches, resSummary] = await Promise.all([
        fetch(ANALYTICS_API, { headers }).then((r) => r.json()).catch(() => ({ success: false })),
        fetch(WAREHOUSE_API, { headers }).then((r) => r.json()).catch(() => ({ success: false })),
        fetch(`${WAREHOUSE_API}?summary=1`, { headers }).then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (resAnalytics.success) {
        setAnalyticsData(resAnalytics.data);
      }
      if (resBatches.success) {
        setWarehouseBatches(resBatches.data || []);
      }
      if (resSummary.success) {
        setStockSummary(resSummary.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (auth?.token) {
      fetchDashboardData();
    }
  }, [auth?.token, fetchDashboardData, refreshKey]);

  // Aggregate product stock from batches for low stock alerts
  const aggregatedStock = useMemo(() => {
    const map = {};
    (warehouseBatches || []).forEach((b) => {
      if (!map[b.product_id]) {
        map[b.product_id] = {
          product_id: b.product_id,
          product_name: b.product_name,
          category_name: b.category_name,
          unit: b.unit,
          quantity: 0,
        };
      }
      if (b.status === "Active") {
        map[b.product_id].quantity += parseInt(b.quantity || 0);
      }
    });
    return Object.values(map);
  }, [warehouseBatches]);

  const metrics = analyticsData?.metrics || {};
  const totalRevenue = parseFloat(metrics.total_revenue || 0);
  const activeDistributors = parseInt(metrics.active_distributors || 0);
  const totalStockUnits = parseInt(metrics.stock_units || stockSummary?.total_units || 0);
  const lowStockCount = stockSummary?.low_stock_count !== undefined
    ? parseInt(stockSummary.low_stock_count)
    : aggregatedStock.filter((i) => i.quantity <= 50).length;

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <LayoutDashboard className="inline mr-3 text-blue-600 w-8 h-8" />
          Company Admin Dashboard
          <span className="ml-3 text-base font-normal text-slate-500">
            (Live Overview)
          </span>
        </h1>

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2 text-xs font-bold"
          title="Refresh Dashboard Data"
        >
          <RotateCcw size={15} className={loading ? "animate-spin text-blue-600" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={loading ? "..." : formatLKR(totalRevenue)}
          subtitle={`${metrics.total_orders || 0} Total Orders Logged`}
          icon={<DollarSign size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Active Distributors"
          value={loading ? "..." : `${activeDistributors} Companies`}
          subtitle="Approved Distributor Network"
          icon={<Building2 size={20} />}
          color="blue"
        />
        <MetricCard
          title="Warehouse Stock"
          value={loading ? "..." : `${totalStockUnits.toLocaleString()} Units`}
          subtitle={
            metrics.stock_value
              ? `Valued at ${formatLKR(metrics.stock_value)}`
              : "Total Storage Inventory"
          }
          icon={<Package size={20} />}
          color="purple"
        />
        <MetricCard
          title="Low Stock Alerts"
          value={loading ? "..." : `${lowStockCount} Products`}
          subtitle="Needs Reordering (<= 50 units)"
          icon={<AlertTriangle size={20} />}
          color="amber"
        />
      </div>

      {/* Main Charts Row (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyChart data={analyticsData?.monthly_trend || []} loading={loading} />
        <YearlyStockChart
          warehouseBatches={warehouseBatches}
          totalStockValue={metrics.stock_value}
          loading={loading}
        />
        <ExpensesDonutChart
          categories={analyticsData?.categories || []}
          warehouseBatches={warehouseBatches}
          loading={loading}
        />
      </div>

      {/* Secondary Row (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTerritoryChart
          territories={analyticsData?.territory || []}
          loading={loading}
        />
        <LowStockAlertsTable
          stockItems={aggregatedStock}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;


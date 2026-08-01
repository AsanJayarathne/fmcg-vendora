import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import MetricCard from "../components/MetricCard";
import RevenueTrendChart from "../components/analytics/RevenueTrendChart";
import RegionShareChart from "../components/analytics/RegionShareChart";
import TopDistributorsTable from "../components/analytics/TopDistributorsTable";
import AnalyticsCard from "../components/analytics/AnalyticsCard";
import { BarChart3, TrendingUp, ShoppingBag, Boxes, CheckCircle2, Download, Layers, RotateCcw } from "lucide-react";

const API = "http://localhost/fmcg-vendora/backend/api/admin/analytics.php";

const COLORS = ["bg-blue-600", "bg-emerald-500", "bg-amber-500", "bg-violet-600", "bg-rose-500"];

export default function AnalyticsPage() {
  const { auth } = useAuth();
  const [timeRange, setTimeRange] = useState("This Month");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}?range=${encodeURIComponent(timeRange)}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load analytics data");
      setAnalyticsData(json.data);
    } catch (err) {
      setError(err.message || "Network error fetching analytics");
    } finally {
      setLoading(false);
    }
  }, [auth?.token, timeRange]);

  useEffect(() => {
    if (auth?.token) fetchAnalytics();
  }, [auth?.token, fetchAnalytics]);

  const ranges = ["Last 7 Days", "This Month", "This Quarter", "This Year"];

  const handleExport = () => {
    alert("Exporting Real Analytics Data Report (CSV / PDF)...");
  };

  const metrics = analyticsData?.metrics || {};
  const categoriesData = analyticsData?.categories || [];
  const totalCategoryRev = categoriesData.reduce((acc, curr) => acc + parseFloat(curr.revenue || 0), 0);

  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center text-slate-800">
          <BarChart3 className="inline mr-3 text-blue-600 w-8 h-8" />
          Business Analytics
          {!loading && (
            <span className="ml-3 text-base font-normal text-slate-500">
              (Live MySQL Database)
            </span>
          )}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Filter Pills */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200/60 shadow-2xs">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  timeRange === r
                    ? "bg-white text-slate-800 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2.5 rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition cursor-pointer disabled:opacity-50"
            title="Refresh Data"
          >
            <RotateCcw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Export Report CTA */}
          <button
            onClick={handleExport}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Download size={15} />
            Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Top 4 Real Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Platform Revenue"
          value={loading ? "..." : `LKR ${Number(metrics.total_revenue || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}
          subtitle={`${metrics.total_orders || 0} Total Orders Logged`}
          icon={<TrendingUp size={20} />}
          color="blue"
        />
        <MetricCard
          title="Active Distributors"
          value={loading ? "..." : `${metrics.active_distributors || 0} Companies`}
          subtitle="Active Approved Network"
          icon={<ShoppingBag size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Warehouse Stock Value"
          value={loading ? "..." : `LKR ${Number(metrics.stock_value || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}
          subtitle={`${(metrics.stock_units || 0).toLocaleString()} Units in Storage`}
          icon={<Boxes size={20} />}
          color="violet"
        />
        <MetricCard
          title="Supply Fulfillment Rate"
          value={loading ? "..." : `${metrics.fulfillment_rate || 100}%`}
          subtitle={`${metrics.fulfilled_requests || 0} / ${metrics.total_requests || 0} Requests`}
          icon={<CheckCircle2 size={20} />}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart (2 Cols) */}
        <div className="lg:col-span-2">
          <RevenueTrendChart data={analyticsData?.monthly_trend || []} loading={loading} />
        </div>

        {/* Territory Share Donut Chart (1 Col) */}
        <div className="lg:col-span-1">
          <RegionShareChart data={analyticsData?.territory || []} loading={loading} />
        </div>
      </div>

      {/* Second Row: Category Performance & Top Distributors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Category Distribution (1 Col) */}
        <div className="lg:col-span-1">
          <AnalyticsCard
            title="Category Sales Performance"
            subtitle="Revenue contribution by product category"
            icon={Layers}
          >
            <div className="space-y-4 pt-2">
              {loading ? (
                <div className="py-8 text-center text-xs font-semibold text-slate-400">
                  Loading category statistics...
                </div>
              ) : categoriesData.length === 0 ? (
                <p className="text-xs text-slate-400 font-semibold">No category statistics recorded yet.</p>
              ) : (
                categoriesData.map((cat, idx) => {
                  const rev = parseFloat(cat.revenue || 0);
                  const pct = totalCategoryRev > 0 ? Math.round((rev / totalCategoryRev) * 100) : 0;
                  const color = COLORS[idx % COLORS.length];

                  return (
                    <div key={cat.category_id || idx} className="space-y-1.5 font-sans">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-800">{cat.category_name}</span>
                        <span className="text-slate-900 font-extrabold">
                          LKR {rev > 0 ? rev.toLocaleString() : "0.00"}
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color} transition-all duration-500`}
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AnalyticsCard>
        </div>

        {/* Top Distributors Table (2 Cols) */}
        <div className="lg:col-span-2">
          <TopDistributorsTable data={analyticsData?.top_distributors || []} loading={loading} />
        </div>
      </div>
    </div>
  );
}

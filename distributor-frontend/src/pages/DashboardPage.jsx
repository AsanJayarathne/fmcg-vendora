import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { fetchOrders } from "../services/ordersApi";
import { fetchProfile } from "../services/profileApi";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart, ClipboardClock, SquareCheckBig, TriangleAlert,
  TrendingUp, TrendingDown, ArrowRight, Package, Truck,
  Loader2, RefreshCw, Store, AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost/fmcg-vendora/backend/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtLKR(val) {
  if (val >= 1_000_000) return `LKR ${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000)     return `LKR ${(val / 1_000).toFixed(1)}K`;
  return `LKR ${Number(val).toLocaleString("en-LK")}`;
}
function fmtDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    Pending:    "bg-amber-50 text-amber-700 border border-amber-200",
    Processing: "bg-blue-50 text-blue-700 border border-blue-200",
    Approved:   "bg-indigo-50 text-indigo-700 border border-indigo-200",
    Delivered:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Rejected:   "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ─── SVG Area Chart ───────────────────────────────────────────────────────────
function AreaChart({ data, color = "#3b82f6", gradientId = "areaGrad" }) {
  const W = 540, H = 160, PAD = 12;
  const vals  = data.map((d) => d.value);
  const max   = Math.max(...vals, 1);
  const min   = 0;
  const range = max - min || 1;
  const xStep = (W - PAD * 2) / (data.length - 1 || 1);

  const pts = data.map((d, i) => ({
    x: PAD + i * xStep,
    y: PAD + ((max - d.value) / range) * (H - PAD * 2),
  }));

  const linePath  = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath  = `${linePath} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
}

// ─── Mini Sparkline ───────────────────────────────────────────────────────────
function Sparkline({ data, color = "#3b82f6" }) {
  const W = 80, H = 32;
  const vals  = data.map((d) => d.value);
  const max   = Math.max(...vals, 1);
  const xStep = W / (data.length - 1 || 1);
  const pts   = vals.map((v, i) => ({ x: i * xStep, y: H - (v / max) * H * 0.85 }));
  const path  = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-16 h-8">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Metric Card ─────────────────────────────────────────────────────────────
function DashMetricCard({ title, value, subtitle, icon, iconBg, sparkData, sparkColor, trend, trendLabel, onClick }) {
  const up = trend > 0;
  return (
    <button
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left w-full cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {sparkData && <Sparkline data={sparkData} color={sparkColor} />}
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-900 leading-tight">{value}</h3>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
        {trendLabel && (
          <span className={`flex items-center gap-0.5 text-[10px] font-bold ${up ? "text-emerald-600" : "text-red-500"}`}>
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendLabel}
          </span>
        )}
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { auth } = useAuth();
  const navigate  = useNavigate();

  const [orders,     setOrders]     = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [retailers,  setRetailers]  = useState([]);
  const [drivers,    setDrivers]    = useState([]);
  const [profile,    setProfile]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const load = async () => {
    if (!auth?.token) return;
    setLoading(true); setError("");
    try {
      const [ordersData, stockRes, retailersRes, driversRes, profileData] = await Promise.all([
        fetchOrders(auth.token),
        fetch(`${API_BASE}/distributor/stock.php`,     { headers: { Authorization: `Bearer ${auth.token}` } }).then(r => r.json()),
        fetch(`${API_BASE}/distributor/retailers.php`, { headers: { Authorization: `Bearer ${auth.token}` } }).then(r => r.json()),
        fetch(`${API_BASE}/distributor/drivers.php`,   { headers: { Authorization: `Bearer ${auth.token}` } }).then(r => r.json()),
        fetchProfile(auth.token).catch(() => null),
      ]);
      setOrders(ordersData ?? []);
      setStockItems(stockRes.success ? (stockRes.data ?? []) : []);
      setRetailers(retailersRes.success ? (retailersRes.data ?? []) : []);
      setDrivers(driversRes.success ? (driversRes.data ?? []) : []);
      setProfile(profileData);
    } catch (e) {
      setError(e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [auth?.token]);

  // ── Aggregated stock ──
  const aggregatedStock = useMemo(() => {
    const map = {};
    stockItems.forEach(b => {
      if (!map[b.product_id]) map[b.product_id] = { ...b, quantity: 0 };
      if (b.status === "Active") map[b.product_id].quantity += parseInt(b.quantity || 0);
    });
    return Object.values(map);
  }, [stockItems]);

  const lowStockItems = useMemo(() =>
    aggregatedStock.filter(i => i.quantity <= 20 && i.quantity > 0), [aggregatedStock]);

  // ── Metrics ──
  const totalOrders    = orders.length;
  const pendingCount   = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const lowStockCount  = lowStockItems.length;
  const approvedShops  = retailers.filter(r => r.status === "Approved").length;
  const activeDrivers  = drivers.filter(d => d.status === "Approved").length;

  const totalRevenue = orders
    .filter(o => o.status === "Delivered")
    .reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);

  // ── Sales chart data (last 7 days) ──
  const salesData = useMemo(() => {
    const grouped = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      const key   = d.toISOString().split("T")[0];
      grouped[key] = { label, value: 0 };
    }
    orders.forEach(o => {
      if (o.status === "Delivered" || o.status === "Approved") {
        const key = (o.created_at || "").split(" ")[0];
        if (grouped[key]) grouped[key].value += parseFloat(o.total_amount || 0);
      }
    });
    return Object.values(grouped);
  }, [orders]);

  // ── Order status distribution ──
  const orderStatusDist = useMemo(() => {
    const counts = {
      Delivered:  orders.filter(o => o.status === "Delivered").length,
      Approved:   orders.filter(o => o.status === "Approved").length,
      Processing: orders.filter(o => o.status === "Processing").length,
      Pending:    orders.filter(o => o.status === "Pending").length,
      Rejected:   orders.filter(o => o.status === "Rejected").length,
    };
    const total = orders.length || 1;
    return [
      { label: "Delivered",  count: counts.Delivered,  pct: Math.round(counts.Delivered  / total * 100), color: "bg-emerald-500" },
      { label: "Approved",   count: counts.Approved,   pct: Math.round(counts.Approved   / total * 100), color: "bg-blue-500"    },
      { label: "Processing", count: counts.Processing, pct: Math.round(counts.Processing / total * 100), color: "bg-indigo-400"  },
      { label: "Pending",    count: counts.Pending,    pct: Math.round(counts.Pending    / total * 100), color: "bg-amber-400"   },
      { label: "Rejected",   count: counts.Rejected,   pct: Math.round(counts.Rejected   / total * 100), color: "bg-red-400"    },
    ].filter(s => s.count > 0);
  }, [orders]);

  // ── Territory data ──
  const territoryData = useMemo(() => {
    const zones = { Kegalle: 0, Colombo: 0, Galle: 0, Kandy: 0, Kurunegala: 0, Other: 0 };
    let total = 0;
    orders.forEach(o => {
      if (o.status === "Delivered" || o.status === "Approved") {
        const addr = (o.shop_address || "").toLowerCase();
        const val  = parseFloat(o.total_amount || 0);
        let found  = false;
        for (const t of Object.keys(zones)) {
          if (t !== "Other" && addr.includes(t.toLowerCase())) { zones[t] += val; found = true; break; }
        }
        if (!found) zones.Other += val;
        total += val;
      }
    });
    return Object.entries(zones)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, val]) => ({ name, val, pct: total > 0 ? Math.round((val / total) * 100) : 0 }));
  }, [orders]);

  // ── Recent orders (last 6) ──
  const recentOrders = useMemo(() =>
    [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6),
    [orders]);

  // ── Low stock (top 5) ──
  const topLowStock = useMemo(() =>
    [...lowStockItems].sort((a, b) => a.quantity - b.quantity).slice(0, 5),
    [lowStockItems]);

  // ── Quick actions ──
  const quickActions = [
    { label: "Manage Orders",   icon: ShoppingCart, path: "/orders",       color: "bg-blue-50 text-blue-600 hover:bg-blue-100"     },
    { label: "Manage Delivery", icon: Truck,        path: "/delivery",     color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"},
    { label: "Request Stock",   icon: Package,      path: "/request-stock",color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"},
    { label: "Shops & Drivers", icon: Store,        path: "/shops",        color: "bg-purple-50 text-purple-600 hover:bg-purple-100"},
  ];

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 size={36} className="animate-spin text-blue-600" />
        <p className="text-sm text-gray-500 font-semibold">Loading dashboard…</p>
      </div>
    );
  }

  // ─── Greeting ────────────────────────────────────────────────────────────────
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.full_name?.split(" ")[0] ?? "Distributor";

  return (
    <div className="space-y-5 pb-4">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">{greeting}, {firstName} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's what's happening with your distribution today.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashMetricCard
          title="Total Orders"
          value={totalOrders}
          subtitle="All incoming orders"
          icon={<ShoppingCart size={20} className="text-blue-600" />}
          iconBg="bg-blue-100"
          sparkData={salesData}
          sparkColor="#3b82f6"
          onClick={() => navigate("/orders")}
        />
        <DashMetricCard
          title="Pending Action"
          value={pendingCount}
          subtitle="Awaiting approval"
          icon={<ClipboardClock size={20} className="text-amber-600" />}
          iconBg="bg-amber-100"
          onClick={() => navigate("/orders")}
        />
        <DashMetricCard
          title="Delivered"
          value={deliveredCount}
          subtitle="Successfully dispatched"
          icon={<SquareCheckBig size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-100"
          onClick={() => navigate("/order-history")}
        />
        <DashMetricCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Products need restock"
          icon={<TriangleAlert size={20} className="text-red-500" />}
          iconBg="bg-red-100"
          onClick={() => navigate("/my-inventory")}
        />
      </div>

      {/* ── Revenue + Quick Actions ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue highlight */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-200">
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -right-4 -bottom-12 w-56 h-56 bg-white/5 rounded-full" />

          <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Total Revenue</p>
          <h2 className="text-4xl font-black text-white mb-1">{fmtLKR(totalRevenue)}</h2>
          <p className="text-sm text-blue-200">From {deliveredCount} delivered orders</p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Shops",   val: approvedShops, icon: Store },
              { label: "Drivers", val: activeDrivers, icon: Truck  },
              { label: "SKUs",    val: aggregatedStock.length, icon: Package },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} className="bg-white/10 rounded-xl px-4 py-3">
                <Icon size={16} className="text-blue-200 mb-1" />
                <p className="text-xl font-black text-white">{val}</p>
                <p className="text-xs text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            {quickActions.map(({ label, icon: Icon, path, color }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold text-sm transition ${color}`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sales Chart + Order Status ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Area Chart */}
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-gray-800">Sales Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 7 days revenue (LKR)</p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full">7 Days</span>
          </div>

          {/* Y-axis labels + chart */}
          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-[9px] text-gray-400 font-bold pb-5 shrink-0 w-10 text-right">
              {[...Array(4)].map((_, i) => {
                const max = Math.max(...salesData.map(d => d.value), 1);
                const val = max - (max / 3) * i;
                return <span key={i}>{val >= 1000 ? `${(val/1000).toFixed(0)}K` : Math.round(val)}</span>;
              })}
            </div>
            <div className="flex-1">
              <div className="h-40">
                <AreaChart data={salesData} color="#3b82f6" gradientId="dashGrad1" />
              </div>
              {/* X labels */}
              <div className="flex justify-between mt-1 px-1">
                {salesData.map((d, i) => (
                  <span key={i} className="text-[9px] text-gray-400 font-medium">{d.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-800 mb-1">Order Status</h3>
          <p className="text-xs text-gray-400 mb-4">{totalOrders} orders total</p>

          {orderStatusDist.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No order data yet</p>
          ) : (
            <div className="space-y-3.5">
              {orderStatusDist.map(({ label, count, pct, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{label}</span>
                    <span className="text-xs font-bold text-gray-500">{count} <span className="text-gray-300">|</span> {pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-1.5 mt-5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            View all orders <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Territory + Recent Orders + Low Stock ── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

        {/* Territory */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-800 mb-1">Sales by Territory</h3>
          <p className="text-xs text-gray-400 mb-4">Revenue distribution by region</p>

          {territoryData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No territory data yet</p>
          ) : (
            <div className="space-y-4">
              {territoryData.map(({ name, val, pct }, i) => {
                const colors = ["bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-cyan-500"];
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
                        <span className="text-xs font-semibold text-gray-700">{name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-800">{fmtLKR(val)}</span>
                        <span className="text-[10px] text-gray-400 ml-1">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-800">Recent Orders</h3>
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.order_id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <ShoppingCart size={13} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{o.shop_name || "—"}</p>
                      <p className="text-[10px] text-gray-400">#{o.order_id} · {fmtDate(o.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    <span className="text-xs font-bold text-gray-900">{fmtLKR(o.total_amount || 0)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-800">Low Stock Alerts</h3>
            <button
              onClick={() => navigate("/my-inventory")}
              className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 transition"
            >
              Manage <ArrowRight size={12} />
            </button>
          </div>

          {topLowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <SquareCheckBig size={28} className="text-emerald-400" />
              <p className="text-xs text-gray-400 font-medium">All stock levels are healthy!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topLowStock.map((p) => {
                const pct = Math.min((p.quantity / 20) * 100, 100);
                const urgency = p.quantity <= 5 ? "bg-red-500" : p.quantity <= 10 ? "bg-orange-400" : "bg-amber-400";
                return (
                  <div key={p.product_id} className="py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="min-w-0 mr-2">
                        <p className="text-xs font-bold text-gray-800 truncate">{p.product_name}</p>
                        <p className="text-[10px] text-gray-400">{p.category_name}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full ${
                        p.quantity <= 5 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {p.quantity} {p.unit || "units"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${urgency} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => navigate("/request-stock")}
                className="flex items-center justify-center gap-2 w-full mt-2 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
              >
                <Package size={13} /> Request Stock
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

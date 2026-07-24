import { useState, useEffect, useMemo } from "react";
import MetricCard from "../components/MetricCard";
import SalesOverview from "../components/analytics/SalesOverview";
import SalesByTerritory from "../components/analytics/SalesByTerritory";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import LowStockTable from "../components/dashboard/LowStockTable";
import { useAuth } from "../auth/AuthContext";
import { fetchOrders } from "../services/ordersApi";
import {
  ShoppingCart,
  ClipboardClock,
  SquareCheckBig,
  TriangleAlert,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost/fmcg-vendora/backend/api";

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const ordersData = await fetchOrders(auth?.token);
      
      const stockRes = await fetch(`${API_BASE}/distributor/stock.php`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const stockJson = await stockRes.json();
      
      setOrders(ordersData || []);
      setStockItems(stockJson.success ? (stockJson.data || []) : []);
    } catch (e) {
      setError(e.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchDashboardData();
    }
  }, [auth?.token]);

  // Aggregate stockItems by product_id
  const aggregatedStock = useMemo(() => {
    const map = {};
    stockItems.forEach(b => {
      if (!map[b.product_id]) {
        map[b.product_id] = {
          product_id:    b.product_id,
          product_name:  b.product_name,
          category_name: b.category_name,
          unit:          b.unit,
          quantity:      0,
        };
      }
      if (b.status === 'Active') {
        map[b.product_id].quantity += parseInt(b.quantity || 0);
      }
    });
    return Object.values(map);
  }, [stockItems]);

  // Low stock products (quantity <= 20 and > 0)
  const lowStockItems = useMemo(() => {
    return aggregatedStock.filter(i => i.quantity <= 20 && i.quantity > 0);
  }, [aggregatedStock]);

  // Metrics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const lowStockCount = lowStockItems.length;

  // Chart 1: Last 7 Days Sales Trend
  const salesData = useMemo(() => {
    const grouped = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      const key = d.toISOString().split('T')[0];
      grouped[key] = { label, value: 0 };
    }
    
    orders.forEach(o => {
      if (o.status === "Delivered" || o.status === "Approved") {
        const key = o.created_at.split(' ')[0];
        if (grouped[key]) {
          grouped[key].value += parseFloat(o.total_amount || 0);
        }
      }
    });
    
    return Object.values(grouped);
  }, [orders]);

  // Chart 2: Sales By Territory (derived from retailer address)
  const territoryData = useMemo(() => {
    const territories = {
      "Kegalle": 0,
      "Colombo": 0,
      "Galle": 0,
      "Kandy": 0,
      "Kurunegala": 0,
      "Other": 0,
    };
    
    let totalSales = 0;
    
    orders.forEach(o => {
      if (o.status === "Delivered" || o.status === "Approved") {
        const addr = o.shop_address || "";
        let found = false;
        const salesVal = parseFloat(o.total_amount || 0);
        
        for (const t in territories) {
          if (t !== "Other" && addr.toLowerCase().includes(t.toLowerCase())) {
            territories[t] += salesVal;
            found = true;
            break;
          }
        }
        if (!found) {
          territories["Other"] += salesVal;
        }
        totalSales += salesVal;
      }
    });
    
    const mapped = Object.keys(territories).map(name => {
      const val = territories[name];
      const percentage = totalSales > 0 ? ((val / totalSales) * 100).toFixed(1) + "%" : "0%";
      return {
        name,
        value: parseFloat((val / 1000).toFixed(1)), // Value in thousands (LKR k)
        percentage
      };
    });
    
    // Sort descending and filter out zero-value territories
    const activeTerritories = mapped.filter(t => t.value > 0).sort((a, b) => b.value - a.value);
    
    // Fallback if no sales yet to show graph layout
    if (activeTerritories.length === 0) {
      return [
        { name: "Colombo", value: 0, percentage: "0%" },
        { name: "Kegalle", value: 0, percentage: "0%" }
      ];
    }
    
    return activeTerritories;
  }, [orders]);

  // Mapped Table Data
  const recentOrdersMapped = useMemo(() => {
    return orders.slice(0, 5).map(o => ({
      id: o.order_id,
      retailer: o.shop_name,
      amount: Number(o.total_amount).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      status: o.status === "Processing" ? "Processing" : o.status === "Delivered" ? "Delivered" : o.status === "Pending" ? "Pending" : "Rejected"
    }));
  }, [orders]);

  const lowStockProductsMapped = useMemo(() => {
    return lowStockItems.slice(0, 5).map(i => ({
      id: `PRD-${String(i.product_id).padStart(3, "0")}`,
      name: i.product_name,
      category: i.category_name,
      stock: i.quantity
    }));
  }, [lowStockItems]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 bg-slate-50/50 rounded-[32px] border border-slate-100 min-h-[500px]">
        <Loader2 size={36} className="animate-spin text-slate-800" />
        <p className="text-slate-500 font-bold text-sm">Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Orders"
          value={totalOrdersCount}
          subtitle="All incoming retail orders"
          icon={<ShoppingCart className="text-slate-900" size={20} />}
          iconBg="bg-slate-50 text-slate-900"
        />

        <MetricCard
          title="Pending Approvals"
          value={pendingOrdersCount}
          subtitle="Orders requiring action"
          icon={<ClipboardClock className="text-amber-600" size={20} />}
          iconBg="bg-amber-50 text-amber-600"
        />

        <MetricCard
          title="Delivered Today"
          value={deliveredCount}
          subtitle="Completed sales dispatches"
          icon={<SquareCheckBig className="text-emerald-600" size={20} />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Inventory requiring restock"
          icon={<TriangleAlert className="text-red-650" size={20} />}
          iconBg="bg-red-50 text-red-600"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SalesOverview data={salesData} />
        <SalesByTerritory data={territoryData} />
      </div>

      {/* Details Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentOrdersTable orders={recentOrdersMapped} />
        <LowStockTable products={lowStockProductsMapped} />
      </div>

    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { FiCreditCard, FiFileText, FiTag, FiTrendingUp, FiLoader } from "react-icons/fi";

import RecentOrdersStatus from "../components/orders/RecentOrdersStatus";
import RecentlyOrderedProducts from "../components/Products/RecentlyOrderedProducts.jsx";
import TodayStorefrontPayments from "../components/payments/TodayStorefrontPayments";
import CreditOverview from "../components/Credits/CreditOverview";
import SpendingSummary from "../components/Cash/SpendingSummary";
import CreditUsageChart from "../components/Credits/CreditUsageChart";

import { useAuth } from "../context/AuthContext";
import { fetchCreditInfo, fetchOrders } from "../services/orderService";

export default function Dashboard() {
  const { auth } = useAuth();
  const token = auth?.token ?? null;
  const [creditInfo, setCreditInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    Promise.all([
      fetchCreditInfo(token).catch(() => null),
      fetchOrders(token).catch(() => [])
    ])
      .then(([creditData, ordersData]) => {
        setCreditInfo(creditData);
        setOrders(ordersData || []);
      })
      .catch((err) => {
        setError("Failed to load dashboard metrics.");
        console.error("Dashboard data load error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // Spending metric: aggregate sum of completed (non-rejected) orders
  const spendingVal = useMemo(() => {
    const total = orders
      .filter(o => o.backendStatus !== "Rejected")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    return `Rs. ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [orders]);

  // Total incoming orders count
  const totalOrdersVal = useMemo(() => {
    return String(orders.length);
  }, [orders]);

  // Unique products purchased
  const productsVal = useMemo(() => {
    const unique = new Set();
    orders.forEach(o => {
      (o.items ?? []).forEach(item => {
        unique.add(item.productId);
      });
    });
    return String(unique.size);
  }, [orders]);

  // Bulk discounts savings sum
  const savingsVal = useMemo(() => {
    const total = orders
      .reduce((sum, o) => sum + Number(o.discount || 0), 0);
    return `Rs. ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [orders]);

  // Stats Card dataset mapping
  const stats = useMemo(() => [
    { title: "Spending", value: spendingVal, color: "green", icon: <FiCreditCard size={18} />, subtitle: "Aggregate orders value" },
    { title: "Total Order", value: totalOrdersVal, color: "blue", icon: <FiFileText size={18} />, subtitle: "All placed orders count" },
    { title: "No of Products", value: productsVal, color: "orange", icon: <FiTag size={18} />, subtitle: "Distinct products purchased" },
    { title: "Savings", value: savingsVal, color: "purple", icon: <FiTrendingUp size={18} />, subtitle: "Bulk promotions savings" },
  ], [spendingVal, totalOrdersVal, productsVal, savingsVal]);

  // Credit details computation
  const creditData = useMemo(() => {
    const limit = creditInfo ? Number(creditInfo.credit_limit ?? 0) : 0;
    const used = creditInfo ? Number(creditInfo.current_balance ?? 0) : 0;
    const available = creditInfo ? Number(creditInfo.available_credit ?? 0) : 0;
    const usedPercent = limit ? (used / limit) * 100 : 0;

    return {
      limit,
      used,
      available,
      usedPercent,
    };
  }, [creditInfo]);

  // Credit Usage Chart data mapping
  const creditChartData = useMemo(() => {
    if (!creditInfo?.transactions || creditInfo.transactions.length === 0) {
      return [
        { week: "Start", credit: 0 },
      ];
    }
    const list = [...creditInfo.transactions].reverse().slice(-8);
    return list.map((tx) => {
      const txDate = tx.created_at
        ? new Date(tx.created_at.replace(" ", "T")).toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : "";
      return {
        week: `TX-${tx.transaction_id}`,
        month: txDate,
        credit: parseFloat(tx.balance_after || 0)
      };
    });
  }, [creditInfo]);

  // Mapped list components data
  const recentOrdersMapped = useMemo(() => {
    return orders.slice(0, 3).map(o => ({
      id: o.orderId,
      distributor: o.distributor,
      date: new Date(o.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      total: `Rs. ${o.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      status: o.status,
      payment: o.paymentLabel,
      itemCount: (o.items ?? []).reduce((sum, i) => sum + Number(i.quantity || 0), 0)
    }));
  }, [orders]);

  const recentProductsMapped = useMemo(() => {
    const list = [];
    orders.forEach(o => {
      (o.items ?? []).forEach(item => {
        if (list.length < 3 && !list.some(p => p.id === item.productId)) {
          list.push({
            id: item.id || item.productId,
            name: item.name,
            distributor: o.distributor,
            quantity: item.quantity,
            price: `Rs. ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          });
        }
      });
    });
    // Fallback if empty to preserve alignment
    if (list.length === 0) {
      return [
        { id: 1, name: "No products purchased yet", distributor: "—", quantity: 0, price: "Rs. 0.00" }
      ];
    }
    return list;
  }, [orders]);

  const paymentsToday = useMemo(() => {
    let cash = 0;
    let credit = 0;
    let count = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    orders.forEach(o => {
      const oDate = o.createdAt ? o.createdAt.split(' ')[0] : "";
      if (oDate === todayStr && o.backendStatus !== "Rejected") {
        cash += Number(o.cashAmount ?? 0);
        credit += Number(o.creditUsed ?? 0);
        count++;
      }
    });
    return { cash, credit, count };
  }, [orders]);

  const spendingChartData = useMemo(() => {
    const weeks = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 7);
      const key = `W${getWeekNumber(d)}`;
      weeks[key] = { month: key, spending: 0 };
    }
    
    orders.forEach(o => {
      if (o.backendStatus !== "Rejected") {
        const oDate = new Date(o.createdAt);
        const key = `W${getWeekNumber(oDate)}`;
        if (weeks[key]) {
          weeks[key].spending += Number(o.total || 0);
        }
      }
    });
    
    return Object.values(weeks);
  }, [orders]);

  function getWeekNumber(d) {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-55/10 gap-3">
        <FiLoader size={36} className="animate-spin text-slate-900" />
        <p className="text-slate-500 font-bold text-sm">Syncing dashboard details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <DashboardHeader />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-semibold mb-6">
          {error}
        </div>
      )}

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            color={item.color}
            icon={item.icon}
            subtitle={item.subtitle}
          />
        ))}
      </div>

      {/* Recent Orders Overview */}
      <div className="w-full mb-6">
        <RecentOrdersStatus orders={recentOrdersMapped} />
      </div>

      {/* Grid of payments, credits and recent ordered items */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        <div className="w-full">
          <TodayStorefrontPayments
            cashAmount={paymentsToday.cash}
            creditAmount={paymentsToday.credit}
            transactionCount={paymentsToday.count}
          />
        </div>
        <div className="w-full">
          <CreditOverview data={creditData} />
        </div>
        <div className="w-full">
          <RecentlyOrderedProducts products={recentProductsMapped} />
        </div>
      </div>

      {/* Usage Analytics charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6 mb-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <CreditUsageChart data={creditChartData} />
        </div>
        <div className="w-full">
          <SpendingSummary data={spendingChartData} />
        </div>
      </div>
    </div>
  );
}
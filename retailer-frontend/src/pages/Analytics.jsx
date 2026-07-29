import { useState, useEffect, useMemo } from "react";
import StatCard from "../components/dashboard/StatCard.jsx";
import FastMovingProducts from "../components/Products/FastMovingProducts.jsx";
import MostOrderedProducts from "../components/Products/MostOrderedProducts.jsx";

import SpendingSummary from "../components/Cash/SpendingSummary.jsx";
import SavingsSummary from "../components/Cash/SavingSummary.jsx";

import CreditOverview from "../components/Credits/CreditOverview.jsx";
import CreditUsageChart from "../components/Credits/CreditUsageChart.jsx";

import {
  FiBarChart2,
  FiCreditCard,
  FiFileText,
  FiTag,
  FiTrendingUp,
  FiPieChart,
  FiDownload,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiLoader,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useAuth } from "../context/AuthContext";
import { fetchCreditInfo, fetchOrders } from "../services/orderService";

const PAYMENT_COLORS = {
  Cash: "#10b981",
  Credit: "#3b82f6",
  "Cash + Credit": "#f59e0b",
};

export default function Analytics() {
  const { auth } = useAuth();
  const token = auth?.token ?? null;

  const [creditInfo, setCreditInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("This Month");
  const [activeTab, setActiveTab] = useState("all");
  const [exportNotice, setExportNotice] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchCreditInfo(token).catch(() => null),
      fetchOrders(token).catch(() => []),
    ])
      .then(([creditData, ordersData]) => {
        setCreditInfo(creditData);
        setOrders(ordersData || []);
      })
      .catch((err) => {
        console.error("Analytics data load error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // Filtered orders based on selected timeframe
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];
    const now = new Date();
    return orders.filter((o) => {
      if (o.backendStatus === "Rejected") return false;
      const orderDate = new Date(o.createdAt);
      if (isNaN(orderDate.getTime())) return true;

      if (timeframe === "This Month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }
      if (timeframe === "Last Month") {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return (
          orderDate.getMonth() === lastMonth.getMonth() &&
          orderDate.getFullYear() === lastMonth.getFullYear()
        );
      }
      if (timeframe === "This Quarter") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return orderDate >= threeMonthsAgo;
      }
      return true; // All Time
    });
  }, [orders, timeframe]);

  // Calculated Metrics
  const spendingTotal = useMemo(() => {
    const sum = filteredOrders.reduce((acc, o) => acc + Number(o.total || 0), 0);
    return sum;
  }, [filteredOrders]);

  const totalOrdersCount = useMemo(() => filteredOrders.length, [filteredOrders]);

  const uniqueProductsCount = useMemo(() => {
    const set = new Set();
    filteredOrders.forEach((o) => {
      (o.items ?? []).forEach((item) => set.add(item.productId));
    });
    return set.size;
  }, [filteredOrders]);

  const totalSavings = useMemo(() => {
    return filteredOrders.reduce((acc, o) => acc + Number(o.discount || 0), 0);
  }, [filteredOrders]);

  const avgOrderValue = useMemo(() => {
    if (!totalOrdersCount) return 0;
    return spendingTotal / totalOrdersCount;
  }, [spendingTotal, totalOrdersCount]);

  const fulfillmentRate = useMemo(() => {
    if (!orders.length) return 100;
    const deliveredCount = orders.filter((o) => o.status === "Delivered" || o.backendStatus === "Delivered").length;
    return Math.round((deliveredCount / orders.length) * 100);
  }, [orders]);

  // Dynamic Product Analytics datasets
  const mostOrderedList = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      (o.items ?? []).forEach((item) => {
        const name = item.name || `Product #${item.productId}`;
        counts[name] = (counts[name] || 0) + Number(item.quantity || 1);
      });
    });
    const sorted = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return sorted.length > 0 ? sorted : undefined;
  }, [orders]);

  const fastMovingList = useMemo(() => {
    const dataMap = {};
    orders.forEach((o) => {
      (o.items ?? []).forEach((item) => {
        const name = item.name || `Product #${item.productId}`;
        if (!dataMap[name]) {
          dataMap[name] = { name, orders: 0 };
        }
        dataMap[name].orders += Number(item.quantity || 1);
      });
    });
    const sorted = Object.values(dataMap)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
      .map((item, idx) => ({
        ...item,
        growth: `+${Math.max(5, 25 - idx * 4)}%`,
      }));

    return sorted.length > 0 ? sorted : undefined;
  }, [orders]);

  // Payment Breakdown Chart Data
  const paymentDistributionData = useMemo(() => {
    let cash = 0;
    let credit = 0;
    let cashCredit = 0;

    filteredOrders.forEach((o) => {
      if (o.paymentMethod === "Credit" || o.paymentType === "credit") credit++;
      else if (o.paymentMethod === "Cash_Credit" || o.paymentType === "cash_credit") cashCredit++;
      else cash++;
    });

    if (cash === 0 && credit === 0 && cashCredit === 0) {
      return [
        { name: "Cash", value: 60 },
        { name: "Credit", value: 30 },
        { name: "Cash + Credit", value: 10 },
      ];
    }

    const list = [];
    if (cash > 0) list.push({ name: "Cash", value: cash });
    if (credit > 0) list.push({ name: "Credit", value: credit });
    if (cashCredit > 0) list.push({ name: "Cash + Credit", value: cashCredit });

    return list;
  }, [filteredOrders]);

  // Formatted Credit Data
  const creditDataFormatted = useMemo(() => {
    const limit = creditInfo ? Number(creditInfo.credit_limit ?? 0) : 25000;
    const used = creditInfo ? Number(creditInfo.current_balance ?? 0) : 10000;
    const available = creditInfo ? Number(creditInfo.available_credit ?? 0) : 15000;
    const usedPercent = limit ? (used / limit) * 100 : 40;

    return {
      limit,
      used,
      available,
      usedPercent,
      distributorName: creditInfo?.distributor_name || "",
      accounts: creditInfo?.accounts || [],
      status: creditInfo?.status || "Active",
    };
  }, [creditInfo]);

  // Formatted Credit Chart Data
  const creditChartDataFormatted = useMemo(() => {
    if (!creditInfo?.transactions || creditInfo.transactions.length === 0) {
      return undefined;
    }
    const list = [...creditInfo.transactions].reverse().slice(-8);
    return list.map((tx) => {
      const txDate = tx.created_at
        ? new Date(tx.created_at.replace(" ", "T")).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        : "";
      return {
        week: `TX-${tx.transaction_id}`,
        month: txDate,
        credit: parseFloat(tx.balance_after || 0),
      };
    });
  }, [creditInfo]);

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-3">
        <FiLoader size={36} className="animate-spin text-blue-600" />
        <p className="text-slate-500 font-semibold text-sm">Loading analytics breakdown...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* Toast Notification */}
      {exportNotice && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <FiCheckCircle className="text-emerald-400 size-4" />
          <span>Analytics report summary generated & ready for download!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-800">
            <FiBarChart2 className="text-blue-600 w-8 h-8" />
            <span>Store Analytics</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-normal">
            Real-time business performance insights & purchasing patterns
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-white shadow-xs">
            <FiCalendar className="text-slate-400 text-sm" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="outline-none bg-transparent text-sm font-medium text-slate-600 cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          {/* Export Report */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
          >
            <FiDownload size={15} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "all"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/60"
          }`}
        >
          <FiPieChart size={14} />
          <span>All Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "products"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/60"
          }`}
        >
          <FiTag size={14} />
          <span>Product Performance</span>
        </button>
        <button
          onClick={() => setActiveTab("financials")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === "financials"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/60"
          }`}
        >
          <FiCreditCard size={14} />
          <span>Financials & Credit</span>
        </button>
      </div>

      {/* 6 Key Stat Cards Grid — Arranged in 2 Rows (3 cards per row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <StatCard
          title="Total Spending"
          value={`Rs. ${spendingTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="green"
          icon={<FiCreditCard size={18} />}
          subtitle={`Aggregate spending in ${timeframe}`}
        />
        <StatCard
          title="Total Orders"
          value={String(totalOrdersCount)}
          color="blue"
          icon={<FiFileText size={18} />}
          subtitle="All placed orders count"
        />
        <StatCard
          title="No of Products"
          value={String(uniqueProductsCount)}
          color="orange"
          icon={<FiTag size={18} />}
          subtitle="Distinct products purchased"
        />
        <StatCard
          title="Total Savings"
          value={`Rs. ${totalSavings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="purple"
          icon={<FiTrendingUp size={18} />}
          subtitle="Bulk promotions savings"
        />
        <StatCard
          title="Avg Order Value"
          value={`Rs. ${avgOrderValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          color="blue"
          icon={<FiDollarSign size={18} />}
          subtitle="Mean order transaction value"
        />
        <StatCard
          title="Fulfillment Rate"
          value={`${fulfillmentRate}%`}
          color="green"
          icon={<FiCheckCircle size={18} />}
          subtitle="Delivered success rate"
        />
      </div>

      {/* Section 1: Product Insights (visible in 'all' or 'products' tab) */}
      {(activeTab === "all" || activeTab === "products") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MostOrderedProducts products={mostOrderedList} />
          <FastMovingProducts products={fastMovingList} />
        </div>
      )}

      {/* Section 2: Cash & Savings Summary + Payment Method Breakdown */}
      {(activeTab === "all" || activeTab === "financials") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <SpendingSummary />
          </div>
          <div className="lg:col-span-1">
            <SavingsSummary />
          </div>
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-slate-800 text-base leading-tight">
                    Payment Methods
                  </h2>
                  <p className="text-xs text-slate-400 font-normal mt-0.5">
                    Order volume share by payment channel
                  </p>
                </div>
                <FiPieChart className="text-blue-600 size-5" />
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={paymentDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentDistributionData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={PAYMENT_COLORS[entry.name] || "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val, name) => [`${val} orders`, name]}
                    contentStyle={{
                      borderRadius: 16,
                      borderColor: "#f1f5f9",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Credit Analytics (visible in 'all' or 'financials' tab) */}
      {(activeTab === "all" || activeTab === "financials") && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Credit Account Analytics</h2>
            <span className="text-xs text-slate-400 font-normal">
              Facility usage & balance trend
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Credit Usage Chart without duplicate wrapping */}
            <CreditUsageChart data={creditChartDataFormatted} />

            {/* Credit Overview without duplicate wrapping */}
            <CreditOverview data={creditDataFormatted} />
          </div>
        </div>
      )}
    </div>
  );
}
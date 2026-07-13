import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { FiCreditCard, FiFileText, FiTag, FiUsers } from "react-icons/fi";

import RecentOrdersStatus from "../components/orders/RecentOrdersStatus";

import RecentlyOrderedProducts from "../components/products/RecentlyOrderedProducts.jsx";
import TodayStorefrontPayments from "../components/payments/TodayStorefrontPayments";
import CreditUsageChart from "../components/Credits/CreditUsageChart";
import CreditOverview from "../components/Credits/CreditOverview";
import SpendingSummary from "../components/Cash/SpendingSummary";

import { useAuth } from "../context/AuthContext";
import { fetchCreditInfo } from "../services/orderService";

const stats = [
  { title: "Spending", value: "Rs. 245,000", color: "green", icon: <FiCreditCard size={18} />, subtitle: "+8% from yesterday" },
  { title: "Total Order", value: "300", color: "blue", icon: <FiFileText size={18} />, subtitle: "+5% from yesterday" },
  { title: "No of Products", value: "120", color: "orange", icon: <FiTag size={18} />, subtitle: "+1.2% from yesterday" },
  { title: "Savings", value: "Rs. 12,500", color: "purple", icon: <FiUsers size={18} />, subtitle: "0.5% from yesterday" },
];

const recentOrders = [
  {
    id: "ORD-1005",
    distributor: "ABC Distributor",
    date: "Jun 25",
    total: "Rs. 12,500",
    status: "Pending",
    payment: "Cash + Credit",
  },
  {
    id: "ORD-1004",
    distributor: "Metro Distributor",
    date: "Jun 24",
    total: "Rs. 8,200",
    status: "Processing",
    payment: "Credit",
  },
  {
    id: "ORD-1003",
    distributor: "ABC Distributor",
    date: "Jun 23",
    total: "Rs. 14,300",
    status: "Delivered",
    payment: "Full Cash",
  },
];

const recentProducts = [
  {
    id: 1,
    name: "Anchor Milk Powder",
    distributor: "ABC Distributor",
    quantity: 12,
    price: "Rs. 1,350",
  },
  {
    id: 2,
    name: "Sunlight Soap",
    distributor: "Metro Distributor",
    quantity: 9,
    price: "Rs. 95",
  },
  {
    id: 3,
    name: "Pepsi 1.5L",
    distributor: "Fresh Supplies",
    quantity: 6,
    price: "Rs. 260",
  },
];

export default function Dashboard() {
  const { auth } = useAuth();
  const token = auth?.token ?? null;
  const [creditInfo, setCreditInfo] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchCreditInfo(token)
      .then((data) => {
        setCreditInfo(data);
      })
      .catch((err) => {
        console.error("Failed to load credit info in Dashboard:", err);
      });
  }, [token]);

  // Dynamically calculate credit overview values from database creditInfo
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

  // Dynamically map real credit transactions to chart usage coordinates
  const creditChartData = useMemo(() => {
    if (!creditInfo?.transactions || creditInfo.transactions.length === 0) {
      return [
        { week: "Start", credit: 0 },
      ];
    }

    // Take the last 8 transactions and display them chronologically
    const list = [...creditInfo.transactions].reverse().slice(-8);
    return list.map((tx, idx) => {
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

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <DashboardHeader />

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

      <div className="w-full mb-6">
        <RecentOrdersStatus orders={recentOrders} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
        <div className="w-full h-full">
          <TodayStorefrontPayments
            cashAmount={12000}
            creditAmount={6750}
            transactionCount={24}
          />
        </div>
        <div className="w-full h-full">
          <CreditOverview data={creditData} />
        </div>
        <div className="w-full h-full">
          <RecentlyOrderedProducts products={recentProducts} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <CreditUsageChart data={creditChartData} />
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <SpendingSummary />
        </div>
      </div>
    </div>
  );
}
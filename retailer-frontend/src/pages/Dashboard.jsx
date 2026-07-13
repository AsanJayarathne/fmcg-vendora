import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { FiCreditCard, FiFileText, FiTag, FiUsers } from "react-icons/fi";

import RecentOrdersStatus from "../components/orders/RecentOrdersStatus";

import RecentlyOrderedProducts from "../components/products/RecentlyOrderedProducts.jsx";
import TodayStorefrontPayments from "../components/payments/TodayStorefrontPayments";
import CreditUsageChart from "../components/Credits/CreditUsageChart";
import CreditOverview from "../components/Credits/CreditOverview";
import SpendingSummary from "../components/Cash/SpendingSummary";

const stats = [
  { title: "Spending", value: "Rs. 245,000", color: "green", icon: <FiCreditCard size={18} />, subtitle: "+8% from yesterday" },
  { title: "Total Order", value: "300", color: "blue", icon: <FiFileText size={18} />, subtitle: "+5% from yesterday" },
  { title: "No of Products", value: "120", color: "orange", icon: <FiTag size={18} />, subtitle: "+1.2% from yesterday" },
  { title: "Savings", value: "Rs. 12,500", color: "purple", icon: <FiUsers size={18} />, subtitle: "0.5% from yesterday" },
];

const creditChartData = [
  { week: "W1", credit: 4000 },
  { week: "W2", credit: 6000 },
  { week: "W3", credit: 3500 },
  { week: "W4", credit: 7000 },
];

const creditData = {
  limit: 50000,
  used: 18500,
  available: 31500,
  usedPercent: 37,
};

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
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
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
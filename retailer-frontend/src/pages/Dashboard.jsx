import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";

import RecentOrdersStatus from "../components/orders/RecentOrdersStatus";
import RecentOrdersTable from "../components/orders/RecentOrdersTable";

import CreditOverview from "../components/Credits/CreditOverview";
import CreditUsageChart from "../components/Credits/CreditUsageChart";

import RecentlyOrderedProducts from "../components/products/RecentlyOrderedProducts.jsx";
import TodayStorefrontPayments from "../components/payments/TodayStorefrontPayments";

const stats = [
  { title: "Orders", value: "152" },
  { title: "Products", value: "1,250" },
  { title: "Spending", value: "Rs. 245,000" },
  { title: "Savings", value: "Rs. 12,500" },
];

const creditData = {
  limit: 50000,
  used: 18500,
  available: 31500,
  usedPercent: 37,
};

const creditChartData = [
  { week: "W1", credit: 4000 },
  { week: "W2", credit: 6000 },
  { week: "W3", credit: 3500 },
  { week: "W4", credit: 7000 },
];

const orderStatus = [
  { id: "ORD-1003", status: "Delivered", updated: "Today" },
  { id: "ORD-1004", status: "Processing", updated: "2h ago" },
  { id: "ORD-1005", status: "Pending", updated: "6h ago" },
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
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <DashboardHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CreditUsageChart data={creditChartData} />
        <CreditOverview data={creditData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RecentOrdersStatus orders={orderStatus} />
        <RecentOrdersTable orders={recentOrders} />
      </div>

      <div className="mb-6">
        <RecentlyOrderedProducts products={recentProducts} />
      </div>

      <TodayStorefrontPayments total={18750} transactionCount={24} />
    </div>
  );
}
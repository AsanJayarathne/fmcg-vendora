import StatCard from "../components/dashboard/StatCard.jsx";
import FastMovingProducts from "../components/products/FastMovingProducts.jsx";
import MostOrderedProducts from "../components/products/MostOrderedProducts.jsx";

import SpendingSummary from "../components/Cash/SpendingSummary.jsx";
import SavingsSummary from "../components/Cash/SavingSummary.jsx";

import CreditStatsCards from "../components/Credits/CreditStatsCards.jsx";
import CreditUsageChart from "../components/Credits/CreditUsageChart.jsx";

import {
  FiHome,
  FiShoppingBag,
  FiBarChart2,
  FiClipboard,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { FiCreditCard, FiFileText, FiTag, FiUsers } from "react-icons/fi";

export default function Analytics() {
    const creditData = {
    limit: 25000,
    used: 10000,
    available: 15000,
    usedPercent: 40,
  };

  const creditUsageData = {
    week: [
      { label: "Mon", value: 1200 },
      { label: "Tue", value: 1800 },
      { label: "Wed", value: 900 },
      { label: "Thu", value: 2200 },
    ],
    month: [
      { label: "Week 1", value: 4000 },
      { label: "Week 2", value: 6000 },
      { label: "Week 3", value: 3500 },
      { label: "Week 4", value: 7000 },
    ],
    year: [
      { label: "Jan", value: 12000 },
      { label: "Feb", value: 15000 },
      { label: "Mar", value: 18000 },
    ],
  };
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
      <FiBarChart2 className="text-slate-900 w-8 h-8" />
      <span>Analytics</span>
    </h1>

        <div className="flex gap-3">
          <select className="border rounded-lg px-4 py-2">
            <option>May 2024</option>
            <option>June 2024</option>
          </select>

          <button className="border rounded-lg px-4 py-2">Filters</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard title="Spending" value="Rs. 245,000" color="green" icon={<FiCreditCard size={18} />} subtitle={"+8% from yesterday"} />

        <StatCard title="Total Orders" value="300" color="blue" icon={<FiFileText size={18} />} subtitle={"+5% from yesterday"} />

        <StatCard title="No of Products" value="120" color="orange" icon={<FiTag size={18} />} subtitle={"+1.2% from yesterday"} />

        <StatCard title="Savings" value="Rs. 12,500" color="purple" icon={<FiUsers size={18} />} subtitle={"0.5% from yesterday"} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <MostOrderedProducts />
        <FastMovingProducts />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <SpendingSummary />
        <SavingsSummary />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Credit Analytics</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT: CHART */}
          <div className="bg-white p-5 rounded-xl shadow">
            <CreditUsageChart data={creditUsageData} />
          </div>


          <div className="bg-white p-5 rounded-xl shadow">
            <CreditStatsCards data={creditData} />
          </div>
        </div>
      </div>
    </div>
  );
}
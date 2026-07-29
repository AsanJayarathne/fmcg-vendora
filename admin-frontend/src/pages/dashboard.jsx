import React from "react";
import MonthlyChart from "../components/graps/MonthlyChart";
import YearlyStockChart from "../components/graps/YearlyStockChart";
import ExpensesDonutChart from "../components/graps/ExpensesDonutChart";
import SalesTerritoryChart from "../components/graps/SalesTerritoryChart";
import LowStockAlertsTable from "../components/graps/LowStockAlertsTable";
import MetricCard from "../components/MetricCard";
import { LayoutDashboard, DollarSign, Building2, Package, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-w-0 overflow-x-hidden space-y-6 font-sans pb-10">

      {/* Page Header */}
      <h1 className="text-3xl font-bold flex items-center text-slate-800">
        <LayoutDashboard className="inline mr-3 text-blue-600 w-8 h-8" />
        Company Admin Dashboard
        <span className="ml-3 text-base font-normal text-slate-500">
          (Live Overview)
        </span>
      </h1>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="LKR 12.8M"
          subtitle="Annual Sales Performance"
          icon={<DollarSign size={20} />}
          color="emerald"
        />
        <MetricCard
          title="Active Distributors"
          value="18 Companies"
          subtitle="Across 5 Regions"
          icon={<Building2 size={20} />}
          color="blue"
        />
        <MetricCard
          title="Warehouse Stock"
          value="48,500 Units"
          subtitle="Total Inventory"
          icon={<Package size={20} />}
          color="purple"
        />
        <MetricCard
          title="Low Stock Alerts"
          value="5 Products"
          subtitle="Needs Reordering"
          icon={<AlertTriangle size={20} />}
          color="amber"
        />
      </div>

      {/* Main Charts Row (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyChart />
        <YearlyStockChart />
        <ExpensesDonutChart />
      </div>

      {/* Secondary Row (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTerritoryChart />
        <LowStockAlertsTable />
      </div>
    </div>
  );
};

export default Dashboard;

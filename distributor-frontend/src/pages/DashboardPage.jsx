import MetricCard from "../components/MetricCard";
import SalesChart from "../components/SalesChart";
import { Package } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { ChartColumnBig } from "lucide-react";
import { CreditCard } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <MetricCard
          title="Total Orders"
          value="178"
          subtitle="Across All Categories"
          icon={<ShoppingCart className="text-[#0228e3]"size={40} />}
          bgColor="bg-[#DCE1F0]"
          iconBg="bg-[#5BDAF2]"
        />

        <MetricCard
          title="Total Sales"
          value="125,00"
          subtitle="This Month"
          icon={<ChartColumnBig color="#FFC107" size={40} />}
          bgColor="bg-[#FFFCD6]"
          iconBg="bg-[#FFE365]"
        />
        <MetricCard
          title="Total Credits"
          value="10,000"
          subtitle="This Month"
          icon={<CreditCard className="text-[#5349e4]" size={40} />}
          bgColor="bg-[#EBDDFF]"
          iconBg="bg-[#F372F3]"
        />
      </div>

      {/* Dashboard Content */}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <SalesChart />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <SalesChart />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SalesChart />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SalesChart />
        </div>
      </div>
    </div>
  );
}
